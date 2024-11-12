using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Configuration; // Necesario para acceder a la cadena de conexión

namespace YourNamespace
{
    public class WorkOrderMaterialRepository
    {
        private string connectionString;

        public WorkOrderMaterialRepository()
        {
            // Asegúrate de tener "YourConnectionStringName" configurado en web.config o appsettings.json
            connectionString = ConfigurationManager.ConnectionStrings["YourConnectionStringName"].ConnectionString;
        }

        // Método para obtener materiales específicos por OT
        public List<WorkOrderMaterial> GetWorkOrderMaterials(int ot)
        {
            List<WorkOrderMaterial> materials = new List<WorkOrderMaterial>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_Get_WorkOrderMaterialOT", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@OT", ot);

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            materials.Add(new WorkOrderMaterial
                            {
                                OT = Convert.ToInt32(reader["OT"]),
                                MATERIAL = reader["MATERIAL"].ToString(),
                                NECESIDAD = Convert.ToDecimal(reader["NECESIDAD"]),
                                UM = reader["UM"].ToString(),
                                CODIGO = reader["CODIGO"].ToString()
                            });
                        }
                    }
                }
            }

            return materials;
        }

        // Nuevo método para obtener todos los materiales
        public List<WorkOrderMaterial> GetAllWorkOrderMaterials()
        {
            List<WorkOrderMaterial> materials = new List<WorkOrderMaterial>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_GetAll_WorkOrderMaterial", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            materials.Add(new WorkOrderMaterial
                            {
                                //OT = Convert.ToInt32(reader["OT"]),
                                MATERIAL = reader["MATERIAL"].ToString(),
                                NECESIDAD = Convert.ToDecimal(reader["NECESIDAD"]),
                                //UM = reader["UM"].ToString(),
                                CODIGO = reader["CODIGO"].ToString()
                            });
                        }
                    }
                }
            }

            return materials;
        }
    }

    public class WorkOrderMaterial
    {
        public int OT { get; set; }
        public string MATERIAL { get; set; }
        public decimal NECESIDAD { get; set; }
        public string UM { get; set; }
        public string CODIGO { get; set; }
    }
}
