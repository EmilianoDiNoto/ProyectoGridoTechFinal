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
using WebApplicationGridoTech.Helpers;
using System.IO;
using System.Web;

namespace WebApplicationGridoTech.Controllers
{
    public class GestionUsuariosController : ApiController
    {
        private string connectionString = @"Data Source=EMI-PC\EMI_PC_SERVER;Initial Catalog=GridoTech ; Integrated Security= True ";

        // GET: api/gestion-usuarios
        [HttpGet]
        [Route("api/gestion-usuarios")]
        public IHttpActionResult GetAllUsers()
        {
            List<Usuario> usuarios = new List<Usuario>();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(@"
                    SELECT u.UserID, u.UserName, u.UserLastName, u.Email, 
                    u.RolID, r.RolName, u.UserState, u.ProfileImage 
                    FROM Users u
                    INNER JOIN Roles r ON u.RolID = r.RolID
                    ORDER BY u.UserName", conn))
                {
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            usuarios.Add(new Usuario
                            {
                                UserID = Convert.ToInt32(reader["UserID"]),
                                UserName = reader["UserName"].ToString(),
                                UserLastName = reader["UserLastName"].ToString(),
                                Email = reader["Email"].ToString(),
                                RolID = Convert.ToInt32(reader["RolID"]),
                                RolName = reader["RolName"].ToString(),
                                UserState = Convert.ToBoolean(reader["UserState"]),
                                ProfileImage = reader["ProfileImage"] != DBNull.Value ? reader["ProfileImage"].ToString() : null
                            });
                        }
                    }
                }
            }

            return Ok(usuarios);
        }

        // GET: api/gestion-usuarios/{id}
        [HttpGet]
        [Route("api/gestion-usuarios/{id}")]
        public IHttpActionResult GetUserById(int id)
        {
            Usuario usuario = null;

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(@"
                    SELECT u.UserID, u.UserName, u.UserLastName, u.Email, 
                    u.RolID, r.RolName, u.UserState, u.ProfileImage 
                    FROM Users u
                    INNER JOIN Roles r ON u.RolID = r.RolID
                    WHERE u.UserID = @UserID", conn))
                {
                    cmd.Parameters.AddWithValue("@UserID", id);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            usuario = new Usuario
                            {
                                UserID = Convert.ToInt32(reader["UserID"]),
                                UserName = reader["UserName"].ToString(),
                                UserLastName = reader["UserLastName"].ToString(),
                                Email = reader["Email"].ToString(),
                                RolID = Convert.ToInt32(reader["RolID"]),
                                RolName = reader["RolName"].ToString(),
                                UserState = Convert.ToBoolean(reader["UserState"]),
                                ProfileImage = reader["ProfileImage"] != DBNull.Value ? reader["ProfileImage"].ToString() : null
                            };
                        }
                    }
                }
            }

            if (usuario == null)
            {
                return NotFound();
            }

            return Ok(usuario);
        }

        // GET: api/gestion-usuarios/roles
        [HttpGet]
        [Route("api/gestion-usuarios/roles")]
        public IHttpActionResult GetAllRoles()
        {
            List<Rol> roles = new List<Rol>();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("SELECT RolID, RolName FROM Roles ORDER BY RolName", conn))
                {
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            roles.Add(new Rol
                            {
                                RolID = Convert.ToInt32(reader["RolID"]),
                                RolName = reader["RolName"].ToString()
                            });
                        }
                    }
                }
            }

            return Ok(roles);
        }

        // POST: api/gestion-usuarios
        [HttpPost]
        [Route("api/gestion-usuarios")]
        public IHttpActionResult CreateUser([FromBody] CreateUserRequest request)
        {
            if (request == null)
            {
                return BadRequest("Datos de usuario inválidos");
            }

            if (string.IsNullOrEmpty(request.UserName) || string.IsNullOrEmpty(request.UserLastName) ||
                string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.UserPass))
            {
                return BadRequest("Todos los campos marcados con * son obligatorios");
            }

            // Verificar si el usuario ya existe
            bool userExists = false;
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("SELECT COUNT(1) FROM Users WHERE Email = @Email", conn))
                {
                    cmd.Parameters.AddWithValue("@Email", request.Email);
                    userExists = (int)cmd.ExecuteScalar() > 0;
                }

                if (userExists)
                {
                    return BadRequest("El email ya está registrado");
                }

                // Encriptar contraseña
                string encryptedPassword = PasswordHelper.EncryptPassword(request.UserPass);

                // Insertar nuevo usuario
                using (SqlCommand cmd = new SqlCommand(@"
                    INSERT INTO Users (UserName, UserLastName, UserPass, RolID, Email, ProfileImage, UserState)
                    VALUES (@UserName, @UserLastName, @UserPass, @RolID, @Email, @ProfileImage, 1);
                    SELECT SCOPE_IDENTITY();", conn))
                {
                    cmd.Parameters.AddWithValue("@UserName", request.UserName);
                    cmd.Parameters.AddWithValue("@UserLastName", request.UserLastName);
                    cmd.Parameters.AddWithValue("@UserPass", encryptedPassword);
                    cmd.Parameters.AddWithValue("@RolID", request.RolID);
                    cmd.Parameters.AddWithValue("@Email", request.Email);
                    cmd.Parameters.AddWithValue("@ProfileImage", (object)request.ProfileImage ?? DBNull.Value);

                    int newUserId = Convert.ToInt32(cmd.ExecuteScalar());

                    return Ok(new { message = "Usuario creado exitosamente", userId = newUserId });
                }
            }
        }

        // PUT: api/gestion-usuarios/{id}
        [HttpPut]
        [Route("api/gestion-usuarios/{id}")]
        public IHttpActionResult UpdateUser(int id, [FromBody] UpdateUserRequest request)
        {
            if (request == null || id != request.UserID)
            {
                return BadRequest("ID de usuario inválido");
            }

            if (string.IsNullOrEmpty(request.UserName) || string.IsNullOrEmpty(request.UserLastName) || string.IsNullOrEmpty(request.Email))
            {
                return BadRequest("Todos los campos marcados con * son obligatorios");
            }

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                // Verificar si el email ya está en uso por otro usuario
                using (SqlCommand cmd = new SqlCommand("SELECT COUNT(1) FROM Users WHERE Email = @Email AND UserID <> @UserID", conn))
                {
                    cmd.Parameters.AddWithValue("@Email", request.Email);
                    cmd.Parameters.AddWithValue("@UserID", id);
                    bool emailExists = (int)cmd.ExecuteScalar() > 0;

                    if (emailExists)
                    {
                        return BadRequest("El email ya está siendo utilizado por otro usuario");
                    }
                }

                // Actualizar usuario
                using (SqlCommand cmd = new SqlCommand(@"
                    UPDATE Users 
                    SET UserName = @UserName, UserLastName = @UserLastName, 
                    RolID = @RolID, Email = @Email, ProfileImage = @ProfileImage
                    WHERE UserID = @UserID", conn))
                {
                    cmd.Parameters.AddWithValue("@UserID", id);
                    cmd.Parameters.AddWithValue("@UserName", request.UserName);
                    cmd.Parameters.AddWithValue("@UserLastName", request.UserLastName);
                    cmd.Parameters.AddWithValue("@RolID", request.RolID);
                    cmd.Parameters.AddWithValue("@Email", request.Email);
                    cmd.Parameters.AddWithValue("@ProfileImage", (object)request.ProfileImage ?? DBNull.Value);

                    int affected = cmd.ExecuteNonQuery();
                    if (affected > 0)
                    {
                        return Ok(new { message = "Usuario actualizado exitosamente" });
                    }
                    else
                    {
                        return NotFound();
                    }
                }
            }
        }

        // PUT: api/gestion-usuarios/{id}/state
        [HttpPut]
        [Route("api/gestion-usuarios/{id}/state")]
        public IHttpActionResult ChangeUserState(int id, [FromBody] ChangeUserStateRequest request)
        {
            if (request == null || id != request.UserID)
            {
                return BadRequest("ID de usuario inválido");
            }

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("UPDATE Users SET UserState = @UserState WHERE UserID = @UserID", conn))
                {
                    cmd.Parameters.AddWithValue("@UserID", id);
                    cmd.Parameters.AddWithValue("@UserState", request.UserState);

                    int affected = cmd.ExecuteNonQuery();
                    if (affected > 0)
                    {
                        string action = request.UserState ? "activado" : "desactivado";
                        return Ok(new { message = $"Usuario {action} exitosamente" });
                    }
                    else
                    {
                        return NotFound();
                    }
                }
            }
        }

        // PUT: api/gestion-usuarios/{id}/password
        [HttpPut]
        [Route("api/gestion-usuarios/{id}/password")]
        public IHttpActionResult ChangeUserPassword(int id, [FromBody] ChangeUserPasswordRequest request)
        {
            if (request == null || id != request.UserID || string.IsNullOrEmpty(request.NewPassword))
            {
                return BadRequest("Datos inválidos");
            }

            // Encriptar nueva contraseña
            string encryptedPassword = PasswordHelper.EncryptPassword(request.NewPassword);

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("UPDATE Users SET UserPass = @UserPass WHERE UserID = @UserID", conn))
                {
                    cmd.Parameters.AddWithValue("@UserID", id);
                    cmd.Parameters.AddWithValue("@UserPass", encryptedPassword);

                    int affected = cmd.ExecuteNonQuery();
                    if (affected > 0)
                    {
                        return Ok(new { message = "Contraseña actualizada exitosamente" });
                    }
                    else
                    {
                        return NotFound();
                    }
                }
            }
        }

        // POST: api/gestion-usuarios/upload-image
        [HttpPost]
        [Route("api/gestion-usuarios/upload-image")]
        public IHttpActionResult UploadProfileImage()
        {
            if (!Request.Content.IsMimeMultipartContent())
            {
                return BadRequest("El formato de la solicitud no es válido");
            }

            try
            {
                // Procesamos la imagen como base64 en lugar de guardarla en el servidor
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    var file = httpRequest.Files[0];
                    if (file != null && file.ContentLength > 0)
                    {
                        // Validamos el tipo de archivo (solo imágenes)
                        string[] allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };
                        string fileExtension = Path.GetExtension(file.FileName).ToLower();

                        if (!allowedExtensions.Contains(fileExtension))
                        {
                            return BadRequest("Solo se permiten archivos de imagen (jpg, jpeg, png, gif)");
                        }

                        // Convertir la imagen a base64
                        byte[] fileData = new byte[file.ContentLength];
                        file.InputStream.Read(fileData, 0, file.ContentLength);
                        string base64String = Convert.ToBase64String(fileData);

                        // Devolver la imagen como base64 con el tipo MIME adecuado
                        string mimeType = file.ContentType;
                        string imageBase64 = $"data:{mimeType};base64,{base64String}";

                        return Ok(new { imageBase64 });
                    }
                }

                return BadRequest("No se encontró ningún archivo");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}