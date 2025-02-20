using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace WebApplicationGridoTech.Models
{
    public class IDService
    {
        private readonly string _connectionString;

        public IDService(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IDResponse> GetIDsAsync(string turno, string usuario, string material, string proveedor)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("SP_GetIDs", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@TurnoNombre", turno);
                    cmd.Parameters.AddWithValue("@UsuarioNombre", usuario);
                    cmd.Parameters.AddWithValue("@MaterialNombre", material);
                    cmd.Parameters.AddWithValue("@ProveedorNombre", proveedor);

                    await conn.OpenAsync();
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new IDResponse
                            {
                                TurnoID = reader["TurnoID"] != DBNull.Value ? Convert.ToInt32(reader["TurnoID"]) : 0,
                                UsuarioID = reader["UsuarioID"] != DBNull.Value ? Convert.ToInt32(reader["UsuarioID"]) : 0,
                                MaterialID = reader["MaterialID"] != DBNull.Value ? Convert.ToInt32(reader["MaterialID"]) : 0,
                                ProveedorID = reader["ProveedorID"] != DBNull.Value ? Convert.ToInt32(reader["ProveedorID"]) : 0
                            };
                        }
                    }
                }
            }
            return null; // Si no hay resultados
        }
    }

    public class IDResponse
    {
        public int TurnoID { get; set; }
        public int UsuarioID { get; set; }
        public int MaterialID { get; set; }
        public int ProveedorID { get; set; }
    }
}
