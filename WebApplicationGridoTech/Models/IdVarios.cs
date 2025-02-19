using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Configuration; // Necesario para acceder a la cadena de conexión


namespace WebApplicationGridoTech.Models
{
    public class IdVarios
    {
        private string connectionString;

        public IdVarios()
        {
            // Asegúrate de tener "YourConnectionStringName" configurado en web.config o appsettings.json
            connectionString = ConfigurationManager.ConnectionStrings["YourConnectionStringName"].ConnectionString;
        }

        public (int TurnoID, int UsuarioID, int MaterialID, int ProveedorID) GetIDs(string turnoNombre, string usuarioNombre, string materialNombre, string proveedorNombre)
        {
            int turnoID = 0, usuarioID = 0, materialID = 0, proveedorID = 0;

            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("GetIDs", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Agregar parámetros de entrada
                    cmd.Parameters.AddWithValue("@TurnoNombre", turnoNombre);
                    cmd.Parameters.AddWithValue("@UsuarioNombre", usuarioNombre);
                    cmd.Parameters.AddWithValue("@MaterialNombre", materialNombre);
                    cmd.Parameters.AddWithValue("@ProveedorNombre", proveedorNombre);

                    // Ejecutar el procedimiento
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            turnoID = reader.IsDBNull(0) ? 0 : reader.GetInt32(0);
                            usuarioID = reader.IsDBNull(1) ? 0 : reader.GetInt32(1);
                            materialID = reader.IsDBNull(2) ? 0 : reader.GetInt32(2);
                            proveedorID = reader.IsDBNull(3) ? 0 : reader.GetInt32(3);
                        }
                    }
                }
            }

            return (turnoID, usuarioID, materialID, proveedorID);
        }

    }
}