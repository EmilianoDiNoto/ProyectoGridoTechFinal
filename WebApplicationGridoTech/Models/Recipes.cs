using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Configuration; // Necesario para acceder a la cadena de conexión

namespace YourNamespace
{
    public class RecipeRepository
    {
        private string connectionString;

        public RecipeRepository()
        {
            // Asegúrate de tener "YourConnectionStringName" configurado en web.config o appsettings.json
            connectionString = ConfigurationManager.ConnectionStrings["YourConnectionStringName"].ConnectionString;
        }

        public List<RecipeMaterial> GetRecipeMaterials(string productName)
        {
            List<RecipeMaterial> materials = new List<RecipeMaterial>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_Get_ProductName", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@ProductName", productName);

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            materials.Add(new RecipeMaterial
                            {
                                Material = reader["MATERIAL"].ToString(),
                                Description = reader["DESCRIPCION"].ToString(),
                                Quantity = Convert.ToDecimal(reader["CANTIDAD"])
                            });
                        }
                    }
                }
            }

            return materials;
        }
    }

    public class RecipeMaterial
    {
        public string Material { get; set; }
        public string Description { get; set; }
        public Decimal Quantity { get; set; }
    }
}
