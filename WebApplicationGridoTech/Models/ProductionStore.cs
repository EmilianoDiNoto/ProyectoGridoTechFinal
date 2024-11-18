using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Configuration; // Necesario para acceder a la cadena de conexión

namespace YourNamespace
{
    public class ProductionStoreRepository
    {
        private string connectionString;

        public ProductionStoreRepository()
        {
            // Asegúrate de tener "YourConnectionStringName" configurado en web.config o appsettings.json
            connectionString = ConfigurationManager.ConnectionStrings["YourConnectionStringName"].ConnectionString;
        }


        // Nuevo método para obtener todos los movimientos del almacen
        public List<ProductionStore> GetAllProductionStore()
        {
            List<ProductionStore> productionStores = new List<ProductionStore>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_GetAll_ProductionStore", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    connection.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            productionStores.Add(new ProductionStore
                            {
                                FECHAMOV = Convert.ToDateTime(reader["FECHAMOV"]),
                                TURNO = reader["TURNO"].ToString(),
                                RESPONSABLE = reader["RESPONSABLE"].ToString(),
                                OT = Convert.ToInt32(reader["OT"]),
                                MATERIAL = reader["MATERIAL"].ToString(),
                                CANTIDAD = Convert.ToInt32(reader["CANTIDAD"]),
                                PROVEEDOR = reader["PROVEEDOR"].ToString(),
                                LOTE = reader["LOTE"].ToString(),
                                TIPOMOV = reader["TIPOMOV"].ToString(),
                              
                            });
                        }
                    }
                }
            }

            return productionStores;
        }

        // Nuevo método para insertar un movimiento en ProductionStore
        public void InsertProductionStore(DateTime fechamov, int turnoId, int usuarioId, int otId, int materialId, int cantidad, int proveedorId, string lote, string tipomov)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_Insert_ProductionStore", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    // Agregar parámetros al comando
                    command.Parameters.AddWithValue("@FECHAMOV", fechamov);
                    command.Parameters.AddWithValue("@TURNOID", turnoId);
                    command.Parameters.AddWithValue("@USUARIOID", usuarioId);
                    command.Parameters.AddWithValue("@OTID", otId);
                    command.Parameters.AddWithValue("@MATERIALID", materialId);
                    command.Parameters.AddWithValue("@CANTIDAD", cantidad);
                    command.Parameters.AddWithValue("@PROVEEDORID", proveedorId);
                    command.Parameters.AddWithValue("@LOTE", lote ?? (object)DBNull.Value); // Manejo de valores nulos
                    command.Parameters.AddWithValue("@TIPOMOV", tipomov ?? (object)DBNull.Value); // Manejo de valores nulos

                    connection.Open();
                    command.ExecuteNonQuery(); // Ejecuta el procedimiento almacenado
                }
            }
        }


    }


    public class ProductionStore
    {
        public int MOTIONID { get; set; }
        public DateTime FECHAMOV { get; set; }
        public string TURNO { get; set; }
        public string RESPONSABLE { get; set; }
        public int OT { get; set; }
        public string MATERIAL { get; set; }
        public int CANTIDAD { get; set; }
        public string PROVEEDOR { get; set; }
        public string LOTE { get; set; }
        public string TIPOMOV { get; set; }
    }
}
