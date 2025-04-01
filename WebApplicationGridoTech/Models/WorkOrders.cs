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

        public List<WorkOrders> GetAllWorkOrders()
        {
            List<WorkOrders> workOrders = new List<WorkOrders>();
            try
            {
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
                                try
                                {
                                    WorkOrders order = new WorkOrders
                                    {
                                        OT = reader["OT"] != DBNull.Value ? Convert.ToInt32(reader["OT"]) : 0,
                                        CODIGO = reader["CODIGO"] != DBNull.Value ? Convert.ToInt32(reader["CODIGO"]) : 0,
                                        PRODUCTO = reader["PRODUCTO"]?.ToString() ?? string.Empty,
                                        DEMANDA = reader["DEMANDA"] != DBNull.Value ? Convert.ToInt32(reader["DEMANDA"]) : 0,
                                        UM = reader["UM"]?.ToString() ?? string.Empty,
                                        ESTADO = reader["ESTADO"]?.ToString() ?? string.Empty,
                                        FECHAELABORACION = reader["FECHAELABORACION"] != DBNull.Value ?
                                            Convert.ToDateTime(reader["FECHAELABORACION"]) : DateTime.MinValue
                                    };

                                    workOrders.Add(order);
                                }
                                catch (Exception ex)
                                {
                                    // Solo registramos el error pero continuamos con el siguiente registro
                                    Console.WriteLine($"Error al procesar fila: {ex.Message}");
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Captura cualquier excepción a nivel de conexión o comando
                Console.WriteLine($"Error en GetAllWorkOrders: {ex.Message}");
            }

            return workOrders;
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