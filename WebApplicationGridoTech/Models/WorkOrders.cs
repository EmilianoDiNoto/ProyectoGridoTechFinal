using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WebApplicationGridoTech.Models
{
    public class WorkOrdersRepository
    {
        private string connectionString;

        public WorkOrdersRepository()
        {
            // Asegúrate de tener "YourConnectionStringName" configurado en web.config o appsettings.json
            connectionString = ConfigurationManager.ConnectionStrings["YourConnectionStringName"].ConnectionString;
        }

        // Nuevo método para obtener todos los movimientos del almacen
        public List<WorkOrders> GetAllWorkOrders()
        {
            List<WorkOrders> WorkOrders = new List<WorkOrders>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_GetAll_WorkOrder", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            WorkOrders.Add(new WorkOrders
                            {
                                OT = Convert.ToInt32(reader["OT"]),
                                CODIGO = Convert.ToInt32(reader["CODIGO"]),
                                PRODUCTO = reader["PRODUCTO"].ToString(),
                                DEMANDA = Convert.ToInt32(reader["DEMANDA"]),
                                UM = reader["UM"].ToString(),
                                ESTADO = reader["ESTADO"].ToString(),
                                FECHAELABORACION = Convert.ToDateTime(reader["FECHAELABORACION"]),

                            });
                        }
                    }
                }
            }

            return WorkOrders;
        }

        //Buscar Orden por nombre de producto
        public DataTable SelectByProductName(string productName)
        {
            string sqlSentencia = "SP_Get_WorkOrderName";

            using (SqlConnection sqlCnn = new SqlConnection(connectionString))
            {
                sqlCnn.Open();
                using (SqlCommand sqlCom = new SqlCommand(sqlSentencia, sqlCnn))
                {
                    sqlCom.CommandType = CommandType.StoredProcedure;
                    sqlCom.Parameters.AddWithValue("@ProductName", productName);

                    DataSet ds = new DataSet();
                    using (SqlDataAdapter da = new SqlDataAdapter(sqlCom))
                    {
                        da.Fill(ds);
                    }

                    return ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
                }
            }
        }

        //Buscar Orden por nombre de producto
        public DataTable SelectByProductStatus(string productStatus)
        {
            string sqlSentencia = "SP_GetTop_WorkOrder";

            using (SqlConnection sqlCnn = new SqlConnection(connectionString))
            {
                sqlCnn.Open();
                using (SqlCommand sqlCom = new SqlCommand(sqlSentencia, sqlCnn))
                {
                    sqlCom.CommandType = CommandType.StoredProcedure;
                    sqlCom.Parameters.AddWithValue("@status", productStatus);

                    DataSet ds = new DataSet();
                    using (SqlDataAdapter da = new SqlDataAdapter(sqlCom))
                    {
                        da.Fill(ds);
                    }

                    return ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
                }
            }
        }





        // Nuevo método para insertar un movimiento en WorkOrders
        public void InsertWorkOrders(int productid, int codigo, int cantidad, string um, DateTime fechacreada, DateTime fechamodificada, string estado, DateTime fechaelaboracion)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_Insert_WorkOrder", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    // Agregar parámetros al comando
                    command.Parameters.AddWithValue("@PRODUCTOID", productid);
                    command.Parameters.AddWithValue("@CODIGO", codigo);
                    command.Parameters.AddWithValue("@DEMANDA", cantidad);
                    command.Parameters.AddWithValue("@UM", um);
                    command.Parameters.AddWithValue("@FECHACREADA", fechacreada);
                    command.Parameters.AddWithValue("@FECHAMODIFICADA", fechamodificada);
                    command.Parameters.AddWithValue("@ESTADO", estado);
                    command.Parameters.AddWithValue("@FECHAELABORACION", fechaelaboracion);

                    connection.Open();
                    command.ExecuteNonQuery(); // Ejecuta el procedimiento almacenado
                }
            }
        }

    }


    public class WorkOrders
    {
        public int OT { get; set; }
        public int PRODUCTOID { get; set; }
        public int CODIGO { get; set; }
        public string PRODUCTO { get; set; }
        public int DEMANDA { get; set; }
        public string UM { get; set; }
        public DateTime FECHACREADA { get; set; }
        public DateTime FECHAMODIFICADA { get; set; }
        public string ESTADO { get; set; }
        public DateTime FECHAELABORACION { get; set; }
    }
}