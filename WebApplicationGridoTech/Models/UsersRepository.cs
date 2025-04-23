using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;

namespace WebApplicationGridoTech.Models
{
    public class UserRepository
    {
        private readonly string connectionString = @"Data Source=EMI-PC\EMI_PC_SERVER;Initial Catalog=GridoTech ; Integrated Security= True ";

        public UserRepository()
        {
            // Usamos la misma cadena de conexión que en el controlador de usuarios
        }

        public int? GetUserIdByLastName(string userLastName)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                // Consulta para encontrar el ID del usuario por su apellido
                using (SqlCommand command = new SqlCommand(
                    "SELECT UserID FROM Users WHERE UserLastName = @UserLastName", connection))
                {
                    command.Parameters.AddWithValue("@UserLastName", userLastName);
                    var result = command.ExecuteScalar();
                    if (result != null && result != DBNull.Value)
                    {
                        return Convert.ToInt32(result);
                    }
                }
            }

            return null; // Retorna null si no encuentra el usuario
        }

        // Opcional: método para obtener todos los usuarios
        public List<Usuario> GetAllUsers()
        {
            List<Usuario> users = new List<Usuario>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand(
                    "SELECT UserID, UserName, UserLastName, RolID, Email, UserState FROM Users", connection))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            users.Add(new Usuario
                            {
                                UserID = Convert.ToInt32(reader["UserID"]),
                                UserName = reader["UserName"].ToString(),
                                UserLastName = reader["UserLastName"].ToString(),
                                RolID = Convert.ToInt32(reader["RolID"]),
                                Email = reader["Email"].ToString(),
                                UserState = Convert.ToBoolean(reader["UserState"])
                            });
                        }
                    }
                }
            }

            return users;
        }
    }
}