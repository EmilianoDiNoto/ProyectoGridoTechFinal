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
            try
            {
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
                                var item = new Production();

                                // Usar métodos de conversión con manejo de errores
                                item.FECHA = reader["FECHA"] != DBNull.Value ? Convert.ToDateTime(reader["FECHA"]) : DateTime.MinValue;
                                item.TURNO = reader["TURNO"]?.ToString() ?? string.Empty;
                                item.RESPONSABLE = reader["RESPONSABLE"]?.ToString() ?? string.Empty;
                                item.OT = reader["OT"] != DBNull.Value ? Convert.ToInt32(reader["OT"]) : 0;
                                item.PRODUCTO = reader["PRODUCTO"]?.ToString() ?? string.Empty;
                                item.PRODUCIDO = reader["PRODUCIDO"] != DBNull.Value ? Convert.ToInt32(reader["PRODUCIDO"]) : 0;

                                // Manejar el valor de PERFORMANCE con cuidado
                                try
                                {
                                    if (reader["PERFORMANCE"] != DBNull.Value)
                                    {
                                        // Intentar convertir directamente
                                        if (reader["PERFORMANCE"] is float || reader["PERFORMANCE"] is double)
                                        {
                                            item.PERFORMANCE = (float)Convert.ToDouble(reader["PERFORMANCE"]);
                                        }
                                        // Si es string, intentar parsear
                                        else if (reader["PERFORMANCE"] is string)
                                        {
                                            if (float.TryParse(reader["PERFORMANCE"].ToString(), out float perfValue))
                                            {
                                                item.PERFORMANCE = perfValue;
                                            }
                                            else
                                            {
                                                item.PERFORMANCE = 0;
                                            }
                                        }
                                        else
                                        {
                                            item.PERFORMANCE = (float)Convert.ToDouble(reader["PERFORMANCE"]);
                                        }
                                    }
                                    else
                                    {
                                        item.PERFORMANCE = 0;
                                    }
                                }
                                catch
                                {
                                    item.PERFORMANCE = 0;
                                    // Opcional: Registrar el error
                                }

                                production.Add(item);
                            }
                        }
                    }
                }
                return production;
            }
            catch (Exception ex)
            {
                // Registrar el error en algún lugar
                Console.WriteLine("Error en GetAllProduction: " + ex.Message);
                // Puedes rethrow la excepción o devolver una lista vacía
                return new List<Production>();
            }
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
