using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Data;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using WebApplicationGridoTech.Models;
using System.Data.SqlClient;
using WebApplicationGridoTech.Helpers;
using System.IO;
using System.Web;

namespace GridoTechAdvance.Controllers
{
    public class FiltroProductionGraficoController : ApiController
    {
        private string connectionString = @"Data Source=DESKTOP-MLHSGS5\SQLEXPRESS ;Initial Catalog=GridoTech ; Integrated Security= True ";

        [HttpGet]
        [Route("api/production/report/gridocookie")]
        public IHttpActionResult GetFiltroGridoCookie()
        {
            try
            {
                // Fechas fijas
                DateTime startDate = new DateTime(2024, 04, 26);
                DateTime endDate = new DateTime(2025, 02, 27);
                string productName = "PACK TORTA COOKIES AND CREAM - GRIDO";

                int totalCantidad = 0;

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = conn;
                        cmd.CommandType = CommandType.Text;

                        string sql = @"SELECT SUM(p.QuantityActual) AS TotalCantidad
                                FROM Production P
                                INNER JOIN WorkOrders W ON W.WorkOrderID = P.WorkOrderID
                                INNER JOIN Products po ON po.ProductID = w.ProductID
                                WHERE P.ProductionDate >= @StartDate AND P.ProductionDate <= @EndDate
                                AND po.ProductName = @ProductName";

                        cmd.CommandText = sql;
                        cmd.Parameters.AddWithValue("@StartDate", startDate);
                        cmd.Parameters.AddWithValue("@EndDate", endDate);
                        cmd.Parameters.AddWithValue("@ProductName", productName);

                        object result = cmd.ExecuteScalar();
                        if (result != null && result != DBNull.Value)
                        {
                            totalCantidad = Convert.ToInt32(result);
                        }
                    }
                }

                var response = new
                {
                    ProductName = productName,
                    TotalCantidad = totalCantidad
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("api/production/report/mousse")]
        public IHttpActionResult GetFiltroMousse()
        {
            try
            {
                // Fechas fijas
                DateTime startDate = new DateTime(2024, 04, 26);
                DateTime endDate = new DateTime(2025, 02, 27);
                string productName = "PACK TORTA COOKIES AND MOUSSE - GRIDO";

                int totalCantidad = 0;

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = conn;
                        cmd.CommandType = CommandType.Text;

                        string sql = @"SELECT SUM(p.QuantityActual) AS TotalCantidad
                                FROM Production P
                                INNER JOIN WorkOrders W ON W.WorkOrderID = P.WorkOrderID
                                INNER JOIN Products po ON po.ProductID = w.ProductID
                                WHERE P.ProductionDate >= @StartDate AND P.ProductionDate <= @EndDate
                                AND po.ProductName = @ProductName";

                        cmd.CommandText = sql;
                        cmd.Parameters.AddWithValue("@StartDate", startDate);
                        cmd.Parameters.AddWithValue("@EndDate", endDate);
                        cmd.Parameters.AddWithValue("@ProductName", productName);

                        object result = cmd.ExecuteScalar();
                        if (result != null && result != DBNull.Value)
                        {
                            totalCantidad = Convert.ToInt32(result);
                        }
                    }
                }

                var response = new
                {
                    ProductName = productName,
                    TotalCantidad = totalCantidad
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("api/production/report/tortagrido")]
        public IHttpActionResult GetFiltroTortaGrido()
        {
            try
            {
                // Fechas fijas
                DateTime startDate = new DateTime(2024, 04, 26);
                DateTime endDate = new DateTime(2025, 02, 27);
                string productName = "PACK TORTA GRIDO CON RELLENO - GRIDO";

                int totalCantidad = 0;

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = conn;
                        cmd.CommandType = CommandType.Text;

                        string sql = @"SELECT SUM(p.QuantityActual) AS TotalCantidad
                                FROM Production P
                                INNER JOIN WorkOrders W ON W.WorkOrderID = P.WorkOrderID
                                INNER JOIN Products po ON po.ProductID = w.ProductID
                                WHERE P.ProductionDate >= @StartDate AND P.ProductionDate <= @EndDate
                                AND po.ProductName = @ProductName";

                        cmd.CommandText = sql;
                        cmd.Parameters.AddWithValue("@StartDate", startDate);
                        cmd.Parameters.AddWithValue("@EndDate", endDate);
                        cmd.Parameters.AddWithValue("@ProductName", productName);

                        object result = cmd.ExecuteScalar();
                        if (result != null && result != DBNull.Value)
                        {
                            totalCantidad = Convert.ToInt32(result);
                        }
                    }
                }

                var response = new
                {
                    ProductName = productName,
                    TotalCantidad = totalCantidad
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("api/production/report")]
        public IHttpActionResult GetFiltroProduction(string productName = null)
        {
            // Mantener el método original por si necesitas el listado detallado
            try
            {
                // Fechas fijas
                DateTime startDate = new DateTime(2024, 04, 26);
                DateTime endDate = new DateTime(2025, 02, 27);

                List<FiltroProductionGrafico> result = new List<FiltroProductionGrafico>();

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    using (SqlCommand cmd = new SqlCommand())
                    {
                        cmd.Connection = conn;
                        cmd.CommandType = CommandType.Text;

                        string sql = @"SELECT P.ProductionDate AS FECHA, 
                                       po.ProductName, 
                                       p.QuantityActual AS CANTIDAD, 
                                       w.Quantity AS DEMANDA 
                                FROM Production P
                                INNER JOIN WorkOrders W ON W.WorkOrderID = P.WorkOrderID
                                INNER JOIN Products po ON po.ProductID = w.ProductID
                                WHERE P.ProductionDate >= @StartDate AND P.ProductionDate <= @EndDate";

                        if (!string.IsNullOrEmpty(productName))
                        {
                            sql += " AND po.ProductName = @ProductName";
                            cmd.Parameters.AddWithValue("@ProductName", productName);
                        }

                        cmd.CommandText = sql;
                        cmd.Parameters.AddWithValue("@StartDate", startDate);
                        cmd.Parameters.AddWithValue("@EndDate", endDate);

                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                result.Add(new FiltroProductionGrafico
                                {
                                    Fecha = Convert.ToDateTime(reader["FECHA"]),
                                    ProductName = reader["ProductName"].ToString(),
                                    Cantidad = Convert.ToInt32(reader["CANTIDAD"]),
                                    Demanda = Convert.ToInt32(reader["DEMANDA"])
                                });
                            }
                        }
                    }
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}