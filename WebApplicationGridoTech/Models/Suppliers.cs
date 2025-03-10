using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WebApplicationGridoTech.Models
{
    public class Suppliers
    {
        private string connectionString;

        public Suppliers()
        {
            // Asegúrate de tener "YourConnectionStringName" configurado en web.config o appsettings.json
            connectionString = ConfigurationManager.ConnectionStrings["YourConnectionStringName"].ConnectionString;
        }

        // Nuevo método para obtener todos los eventos
        public List<Supplier> GetAllSupplier()
        {
            List<Supplier> Supplier = new List<Supplier>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_Get_PROVEEDORID", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Supplier.Add(new Supplier
                            {
                                PROVEEDORID = Convert.ToInt32(reader["PROVEEDORID"]),
                                PROVEEDOR = reader["PROVEEDOR"].ToString(),
                            });
                        }
                    }
                }
            }

            return Supplier;
        }

    }

    public class Supplier
    {
        public int PROVEEDORID { get; set; }
        public string PROVEEDOR { get; set; }

    }


}