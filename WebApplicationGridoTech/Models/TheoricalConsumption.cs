using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Configuration; // Necesario para acceder a la cadena de conexión



namespace WebApplicationGridoTech.Models
{

    public class TheoricalConsumptionRepository
    {
        private string connectionString;

        public TheoricalConsumptionRepository()
        {
            // Asegúrate de tener "YourConnectionStringName" configurado en web.config o appsettings.json
            connectionString = ConfigurationManager.ConnectionStrings["YourConnectionStringName"].ConnectionString;
        }


        // Método para obtener materiales específicos por OT
        public List<TheoricalConsumption> GetTheoricalConsumption(int ot)
        {
            List<TheoricalConsumption> materials = new List<TheoricalConsumption>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_Get_TheoreticalConsumption", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@OT", ot);

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            materials.Add(new TheoricalConsumption
                            {
                                //OT = Convert.ToInt32(reader["OT"]),
                                MATERIAL = reader["MATERIAL"].ToString(),
                                TEORICO = Convert.ToDecimal(reader["TEORICO"]),
                                REAL = Convert.ToDecimal(reader["REAL"]),
                                DESVIO = Convert.ToDecimal(reader["DESVIO"]),

                            });
                        }
                    }
                }
            }

            return materials;
        }

        // Nuevo método para obtener todos los materiales
        public List<TheoricalConsumption> Consolidadobm()
        {
            List<TheoricalConsumption> materials = new List<TheoricalConsumption>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_CONSOLIDADOBM", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            materials.Add(new TheoricalConsumption
                            {
                                //OT = Convert.ToInt32(reader["OT"]),
                                MATERIAL = reader["MATERIAL"].ToString(),
                                TEORICO = Convert.ToDecimal(reader["TEORICO"]),
                                REAL = Convert.ToDecimal(reader["REAL"]),
                                DESVIO = Convert.ToDecimal(reader["DESVIO"]),

                            });
                        }
                    }
                }
            }

            return materials;
        }
    }



    public class TheoricalConsumption
    {
        public int OT { get; set; }
        public string MATERIAL { get; set; }
        public decimal TEORICO { get; set; }
        public decimal REAL { get; set; }
        public decimal DESVIO { get; set; }


    }
}
