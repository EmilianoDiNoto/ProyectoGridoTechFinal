using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WebApplicationGridoTech.Models
{
    public class MaterialSuppliersRepository
    {
        private string connectionString;

        public MaterialSuppliersRepository()
        {
            // Asegúrate de tener "YourConnectionStringName" configurado en web.config o appsettings.json
            connectionString = ConfigurationManager.ConnectionStrings["YourConnectionStringName"].ConnectionString;
        }

        //Buscar Orden por nombre de producto
        public DataTable SelectByMaterialSuppliers(string materialname)
        {
            string sqlSentencia = "SP_Get_MatProv";

            using (SqlConnection sqlCnn = new SqlConnection(connectionString))
            {
                sqlCnn.Open();
                using (SqlCommand sqlCom = new SqlCommand(sqlSentencia, sqlCnn))
                {
                    sqlCom.CommandType = CommandType.StoredProcedure;
                    sqlCom.Parameters.AddWithValue("@MATERIAL", materialname);

                    DataSet ds = new DataSet();
                    using (SqlDataAdapter da = new SqlDataAdapter(sqlCom))
                    {
                        da.Fill(ds);
                    }

                    return ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
                }
            }
        }

    }

    public class MaterialSupplier
    {
        public string PROVEEDOR { get; set; }
    }
}