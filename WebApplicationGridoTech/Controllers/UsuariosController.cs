using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Data;
using System.Web.Http;
using WebApplicationGridoTech.Models;
using System.Data.SqlClient;
using System.Net.Mail;
using WebApplicationGridoTech.Helpers;
using System.Configuration;

namespace WebApplicationGridoTech.Controllers
{


    public class UsuariosController : ApiController
    {
        private string connectionString = @"Data Source=EMI-PC\EMI_PC_SERVER;Initial Catalog=GridoTech ; Integrated Security= True ";
        /// Conexión a Base de Datos EMI

        [HttpPost]
        [Route("api/usuarios/login")]
        public IHttpActionResult Login([FromBody] LoginRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("Usuario y contraseña son requeridos");
            }

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                // Corregido: UserLastname a UserLastName para consistencia
                using (SqlCommand cmd = new SqlCommand(
                    "SELECT UserID, UserName, UserLastName, UserPass, RolID, Email FROM Users WHERE UserLastName = @UserLastName", conn))
                {
                    cmd.Parameters.AddWithValue("@UserLastName", request.Username);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            string storedPassword = reader["UserPass"].ToString();

                            // Verificar la contraseña utilizando el helper que compara el hash
                            if (PasswordHelper.VerifyPassword(request.Password, storedPassword))
                            {
                                return Ok(new
                                {
                                    userId = reader["UserID"],
                                    userName = reader["UserName"],
                                    userLastName = reader["UserLastName"],
                                    rolId = reader["RolID"],
                                    email = reader["Email"]
                                });
                            }
                        }
                    }
                }
            }

            return Unauthorized();
        }

        [HttpPost]
        [Route("api/usuarios/reset-password")]
        public IHttpActionResult RequestPasswordReset([FromBody] ResetPasswordRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Email))
            {
                return BadRequest("Email es requerido");
            }

            string token = null;

            // Verificar si el email existe en la base de datos
            bool emailExists = false;
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("SELECT COUNT(1) FROM Users WHERE Email = @Email", conn))
                {
                    cmd.Parameters.AddWithValue("@Email", request.Email);
                    emailExists = (int)cmd.ExecuteScalar() > 0;
                }

                if (!emailExists)
                {
                    // Por seguridad, no informamos si el email existe o no
                    return Ok(new { message = "Si tu email está registrado, recibirás instrucciones para recuperar tu contraseña" });
                }

                // Generar token y establecer fecha de expiración
                token = GenerateRandomToken();
                DateTime expiry = DateTime.Now.AddHours(24);

                // Actualizar en la base de datos
                using (SqlCommand cmd = new SqlCommand(
                    "UPDATE Users SET ResetToken = @Token, ResetTokenExpiry = @Expiry WHERE Email = @Email", conn))
                {
                    cmd.Parameters.AddWithValue("@Token", token);
                    cmd.Parameters.AddWithValue("@Expiry", expiry);
                    cmd.Parameters.AddWithValue("@Email", request.Email);

                    int affected = cmd.ExecuteNonQuery();
                    if (affected > 0)
                    {
                        try
                        {
                            // En desarrollo, solo registramos los datos que enviaríamos
                            System.Diagnostics.Debug.WriteLine($"Se enviaría un correo a {request.Email} con el token: {token}");
                        }
                        catch (Exception ex)
                        {
                            // Registrar el error pero no devolver detalles al cliente
                            System.Diagnostics.Debug.WriteLine("Error al enviar email: " + ex.Message);
                        }
                    }
                }
            }

            return Ok(new
            {
                message = "Si tu email está registrado, recibirás instrucciones para recuperar tu contraseña",
                // Solo incluir esto en entorno de desarrollo
                developmentToken = token
            });
        }

        [HttpPut]
        [Route("api/usuarios/change-password")]
        public IHttpActionResult ChangePassword([FromBody] ChangePasswordRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Email) ||
                string.IsNullOrEmpty(request.Token) || string.IsNullOrEmpty(request.NewPassword))
            {
                return BadRequest("Todos los campos son requeridos");
            }

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                // Verificar que el token sea válido y no haya expirado
                bool tokenValid = false;
                using (SqlCommand cmd = new SqlCommand(
                    "SELECT COUNT(1) FROM Users WHERE Email = @Email AND ResetToken = @Token AND ResetTokenExpiry > GETDATE()", conn))
                {
                    cmd.Parameters.AddWithValue("@Email", request.Email);
                    cmd.Parameters.AddWithValue("@Token", request.Token);
                    tokenValid = (int)cmd.ExecuteScalar() > 0;
                }

                if (!tokenValid)
                {
                    return BadRequest("Token inválido o expirado");
                }

                // Encriptar la nueva contraseña
                string encryptedPassword = PasswordHelper.EncryptPassword(request.NewPassword);

                // Actualizar la contraseña y limpiar el token
                using (SqlCommand cmd = new SqlCommand(@"
            UPDATE Users 
            SET UserPass = @NewPassword, ResetToken = NULL, ResetTokenExpiry = NULL 
            WHERE Email = @Email AND ResetToken = @Token", conn))
                {
                    cmd.Parameters.AddWithValue("@NewPassword", encryptedPassword);
                    cmd.Parameters.AddWithValue("@Email", request.Email);
                    cmd.Parameters.AddWithValue("@Token", request.Token);

                    int affected = cmd.ExecuteNonQuery();
                    if (affected > 0)
                    {
                        return Ok(new { message = "Contraseña actualizada exitosamente" });
                    }
                }
            }

            return BadRequest("No se pudo actualizar la contraseña");
        }

        private string GenerateRandomToken()
        {
            // Generar un token numérico de 6 dígitos
            Random random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        // Método para migrar contraseñas existentes (ejecutar una vez)
        [HttpPost]
        [Route("api/usuarios/migrate-passwords")]
        [Authorize(Roles = "Admin")] // Restringe acceso solo a admins
        public IHttpActionResult MigratePasswords()
        {
            int updatedCount = 0;

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                // Obtener todos los usuarios
                List<Usuario> usuarios = new List<Usuario>();
                using (SqlCommand cmd = new SqlCommand("SELECT UserID, UserPass FROM Users", conn))
                {
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            usuarios.Add(new Usuario
                            {
                                UserID = (int)reader["UserID"],
                                UserPass = reader["UserPass"].ToString()
                            });
                        }
                    }
                }

                // Actualizar cada contraseña
                foreach (var user in usuarios)
                {
                    // Solo encriptamos si la contraseña no parece ya estar encriptada
                    // (verificamos longitud aproximada de SHA256)
                    if (user.UserPass.Length < 64)
                    {
                        string encryptedPassword = PasswordHelper.EncryptPassword(user.UserPass);

                        using (SqlCommand updateCmd = new SqlCommand(
                            "UPDATE Users SET UserPass = @EncryptedPass WHERE UserID = @UserID", conn))
                        {
                            updateCmd.Parameters.AddWithValue("@EncryptedPass", encryptedPassword);
                            updateCmd.Parameters.AddWithValue("@UserID", user.UserID);

                            int affected = updateCmd.ExecuteNonQuery();
                            if (affected > 0)
                            {
                                updatedCount++;
                            }
                        }
                    }
                }
            }

            return Ok(new { message = $"Se han migrado {updatedCount} contraseñas" });
        }
            // POST: api/gestion-usuarios/check-email
            [HttpPost]
            [Route("api/gestion-usuarios/check-email")]
            public IHttpActionResult CheckEmailExists([FromBody] dynamic request)
            {
            if (request == null || request.email == null)
            {
                return BadRequest("Email requerido");
            }

            string email = request.email.ToString();
            int? userId = request.userId != null ? (int?)request.userId : null;

            bool exists = false;
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string sql = "SELECT COUNT(1) FROM Users WHERE Email = @Email";

                // Si estamos en modo edición, excluir el usuario actual
                if (userId.HasValue)
                {
                    sql += " AND UserID <> @UserId";
                }

                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@Email", email);
                    if (userId.HasValue)
                    {
                        cmd.Parameters.AddWithValue("@UserId", userId.Value);
                    }

                    exists = (int)cmd.ExecuteScalar() > 0;
                }
            }

            return Ok(new { exists });
        }

    }
}