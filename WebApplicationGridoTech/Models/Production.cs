using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Configuration; // Necesario para acceder a la cadena de conexión

namespace YourNamespace
{
    public class ProductionRepository
    {
        private string connectionString;

        public ProductionRepository()
        {
            // Asegúrate de tener "YourConnectionStringName" configurado en web.config o appsettings.json
            connectionString = ConfigurationManager.ConnectionStrings["YourConnectionStringName"].ConnectionString;
        }


        // Nuevo método para obtener todos los movimientos del almacen
        public List<Production> GetAllProduction()
        {
            List<Production> production = new List<Production>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_GetAll_Production", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            production.Add(new Production
                            {
                                FECHA = Convert.ToDateTime(reader["FECHA"]),
                                TURNO = reader["TURNO"].ToString(),
                                RESPONSABLE = reader["RESPONSABLE"].ToString(),
                                OT = Convert.ToInt32(reader["OT"]),
                                PRODUCTO = reader["PRODUCTO"].ToString(),
                                PRODUCIDO = Convert.ToInt32(reader["PRODUCIDO"]),
                                PERFORMANCE = (float)Convert.ToDouble(reader["PERFORMANCE"]),

                            });
                        }
                    }
                }
            }

            return production;
        }

        // Nuevo método para insertar un movimiento en ProductionStore
        public void InsertProduction(DateTime fecha, int turnoId, int usuarioId, int otId, int producido)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_Insert_Production", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    // Agregar parámetros al comando
                    command.Parameters.AddWithValue("@FECHA", fecha);
                    command.Parameters.AddWithValue("@TURNO", turnoId);
                    command.Parameters.AddWithValue("@RESPONSABLE", usuarioId);
                    command.Parameters.AddWithValue("@OT", otId);
                    command.Parameters.AddWithValue("@PRODUCIDO", producido);
                                   
                    connection.Open();
                    command.ExecuteNonQuery(); // Ejecuta el procedimiento almacenado
                }
            }
        }


    }


    public class Production    {

        public DateTime FECHA { get; set; }
        public string TURNO { get; set; }
        public string RESPONSABLE { get; set; }
        public int OT { get; set; }
        public string PRODUCTO { get; set; }
        public int PRODUCIDO { get; set; }
        public float PERFORMANCE { get; set; }
       
    }
}
