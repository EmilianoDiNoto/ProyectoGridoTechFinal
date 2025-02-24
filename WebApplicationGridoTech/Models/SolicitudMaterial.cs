using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using Newtonsoft.Json;

namespace WebApplicationGridoTech.Models
{
 
    public class SolicitudMaterialRepository
    {
        private readonly string connectionString;

        public SolicitudMaterialRepository()
        {
            connectionString = ConfigurationManager.ConnectionStrings["YourConnectionStringName"].ConnectionString;
        }

        // Obtener todas las solicitudes
        public List<SolicitudMaterial> GetAllSolicitudes()
        {
            List<SolicitudMaterial> solicitudes = new List<SolicitudMaterial>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand("SP_GetAll_SolMat", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    solicitudes.Add(new SolicitudMaterial
                    {
                        SolicitudID = Convert.ToInt32(reader["ORDEN"]),
                        FechaSolicitud = Convert.ToDateTime(reader["EMISION"]),
                        Estado = reader["Estado"].ToString()
                    });
                }
            }

            return solicitudes;
        }

        // Obtener solo un pedido por orden
        public SolicitudMaterial GetSolicitudPorId(int id)
        {
            SolicitudMaterial solicitud = null;
            List<SolicitudMaterial> detalles = new List<SolicitudMaterial>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("SP_GetId_SolMat", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@idSol", id);

                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            if (solicitud == null)
                            {
                                solicitud = new SolicitudMaterial
                                {
                                    SolicitudID = reader.GetInt32(reader.GetOrdinal("SolicitudID")),
                                    FechaSolicitud = reader.GetDateTime(reader.GetOrdinal("FechaSolicitud")),
                                    Usuario = reader.GetString(reader.GetOrdinal("Usuario")),
                                    Estado = reader.GetString(reader.GetOrdinal("Estado")),
                                    DetalleMateriales = new List<DetalleMaterial>()
                                };
                            }

                            DetalleMaterial detalle = new DetalleMaterial
                            {
                                Material = reader.GetString(reader.GetOrdinal("Material")),
                                Cantidad = reader.IsDBNull(reader.GetOrdinal("Cantidad"))
                                  ? 0
                                  : reader.GetInt32(reader.GetOrdinal("Cantidad"))
                            };

                            solicitud.DetalleMateriales.Add(detalle);
                        }
                    }
                }
            }

            return solicitud;
        }

        internal void InsertSolicitud(DateTime fechaSolicitud)
        {
            throw new NotImplementedException();
        }

        // Insertar una nueva solicitud
        public void InsertSolicitud(DateTime FechaSolicitud, string Estado, List<DetalleMaterial> DetalleMateriales, string Usuario)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
               using (SqlCommand command = new SqlCommand("SP_Insert_SolMat", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    string DetalleMaterialesJson = JsonConvert.SerializeObject(DetalleMateriales);

                    command.Parameters.AddWithValue("@FECHASOLICITUD", FechaSolicitud);
                    command.Parameters.AddWithValue("@ESTADO", Estado);
                    command.Parameters.AddWithValue("@DETALLEMATERIALES", DetalleMaterialesJson);
                    command.Parameters.AddWithValue("@USUARIO", Usuario);

                    connection.Open();
                    command.ExecuteNonQuery();

                }
                               
            }
        }


        // Actualizar la cantidad de un material en una solicitud
        public void UpdateSolicitudMaterial(int SolicitudID, string Estado, List<DetalleMaterial> DetalleMateriales)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand("SP_Update_SolMat", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                string DetalleMaterialesJson = JsonConvert.SerializeObject(DetalleMateriales);

                command.Parameters.AddWithValue("@ORDEN", SolicitudID);
                command.Parameters.AddWithValue("@ESTADO", Estado ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@DETALLEMATERIALES", DetalleMaterialesJson ?? (object)DBNull.Value);

                connection.Open();
                command.ExecuteNonQuery();
            }
        }

        public void UpdateSolicitudMaterialEstado(int SolicitudID, string Estado)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand("SP_Update_SolMatEstado", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                command.Parameters.AddWithValue("@ORDEN", SolicitudID);
                command.Parameters.AddWithValue("@ESTADO", Estado ?? (object)DBNull.Value);

                connection.Open();
                command.ExecuteNonQuery();
            }
        }
    }



    public class SolicitudMaterial
    {
        public int SolicitudID { get; set; }
        public DateTime FechaSolicitud { get; set; }
        public string Estado { get; set; }
        public List<DetalleMaterial> DetalleMateriales { get; set; }  // Este campo contendrá el JSON de los materiales
        public string Usuario { get; set; }
    }

    public class DetalleMaterial
    {
        public string Material { get; set; }
        public int Cantidad { get; set; }
    }
}