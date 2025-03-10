using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WebApplicationGridoTech.Models
{
    public class UnplannedStops
    {
        private string connectionString;

        public UnplannedStops()
        {
            // Asegúrate de tener "YourConnectionStringName" configurado en web.config o appsettings.json
            connectionString = ConfigurationManager.ConnectionStrings["YourConnectionStringName"].ConnectionString;
        }

        // Nuevo método para obtener todos los eventos
        public List<Unplanned> GetAllUnplanned()
        {
            List<Unplanned> Unplanned = new List<Unplanned>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_GetAll_UnplannedStop", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Unplanned.Add(new Unplanned
                            {
                                OT = Convert.ToInt32(reader["OT"]),
                                FECHA = Convert.ToDateTime(reader["FECHA"]),
                                HSINICIO = (TimeSpan)reader["HSINICIO"],
                                //FECHAFIN = Convert.ToDateTime(reader["FECHAFIN"]),
                                HSFIN = (TimeSpan)reader["HSREINICIO"],
                                DETALLE = reader["DETALLE"].ToString(),
                                TALLER = reader["TALLER"].ToString(),
                                DURACION = Convert.ToInt32(reader["DURACION"]),
                            });
                        }
                    }
                }
            }

            return Unplanned;
        }

        // Nuevo método para insertar un movimiento en ProductionStore
        public void InsertUnplanned( int OT, DateTime FECHA, TimeSpan HSINICIO, DateTime FECHAFIN, TimeSpan HSFIN, string DETALLE, string TALLER)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_Insert_UnplannedStop", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    // Agregar parámetros al comando
                    command.Parameters.AddWithValue("@OT", OT);
                    command.Parameters.AddWithValue("@FECHA", FECHA);
                    command.Parameters.AddWithValue("@HSINICIO", HSINICIO);
                    command.Parameters.AddWithValue("@FECHAFIN", FECHAFIN);
                    command.Parameters.AddWithValue("@HSFIN", HSFIN);
                    command.Parameters.AddWithValue("@DETALLE", DETALLE);
                    command.Parameters.AddWithValue("@TALLER", TALLER);

                    connection.Open();
                    command.ExecuteNonQuery(); // Ejecuta el procedimiento almacenado
                }
            }
        }

    }


    public class Unplanned
    {
        public int STOPID { get; set; }
        public int OT { get; set; }
        public DateTime FECHA { get; set; }
        public TimeSpan HSINICIO { get; set; }
        public DateTime FECHAFIN { get; set; }
        public TimeSpan HSFIN { get; set; }
        public string DETALLE { get; set; }
        public string TALLER { get; set; }
        public int DURACION { get; set; }
    }
}