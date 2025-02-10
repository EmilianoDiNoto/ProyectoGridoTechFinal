using System.Web.Http;
using System.Collections.Generic;
using WebApplicationGridoTech.Models;
using YourNamespace;
using System;
using System.Configuration;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;

namespace WebApplicationGridoTech.Models
{
    public class SolicitudMaterialRepository
    {
        #region Atributos
        // Conexión a Base de Datos EMMA
        string conectionString = @"Data Source=LAPTOP-OJ158TC8 ;Initial Catalog=GridoTech ; Integrated Security= True ";

        //// Conexión a Base de Datos EMI
        //string conectionString = @"Data Source=EMI-PC\EMI_PC_SERVER;Initial Catalog=GridoTech ; Integrated Security= True ";
        //// Conexión a Base de Datos EMMA
        //string conectionString = @"Data Source=LAPTOP-OJ158TC8 ;Initial Catalog=GridoTech ; Integrated Security= True ";
        //// Conexión a Base de Datos EMMA
        //string conectionString = @"Data Source=LAPTOP-OJ158TC8 ;Initial Catalog=GridoTech ; Integrated Security= True ";

        #endregion


        public int ORDEN { get; set; }
        public DateTime EMISION { get; set; }
        public string ESTADO { get; set; }
        public string DETALLEMATERIALES { get; set; }
        public string USUARIO { get; set; }





        public DataTable SelectAll()
        {
            string sqlSentencia = "SP_GetAll_SolMat";

            SqlConnection sqlCnn = new SqlConnection();
            sqlCnn.ConnectionString = conectionString;

            sqlCnn.Open();

            SqlCommand sqlCom = new SqlCommand(sqlSentencia, sqlCnn);
            sqlCom.CommandType = CommandType.StoredProcedure;

            DataSet ds = new DataSet();

            SqlDataAdapter da = new SqlDataAdapter();
            da.SelectCommand = sqlCom;
            da.Fill(ds);

            sqlCnn.Close();

            return ds.Tables[0];

        }

        public void Insert()
        {

            string sqlSentencia = "SP_Insert_SolMat";
            SqlConnection sqlCnn = new SqlConnection();
            sqlCnn.ConnectionString = conectionString;

            SqlCommand sqlCom = new SqlCommand(sqlSentencia, sqlCnn);
            sqlCom.CommandType = CommandType.StoredProcedure;

            sqlCom.Parameters.Add("@ESTADO", SqlDbType.NVarChar).Value = ESTADO;
            sqlCom.Parameters.Add("@DETALLEMATERIALES", SqlDbType.NVarChar).Value = DETALLEMATERIALES;
            sqlCom.Parameters.Add("@USUARIO", SqlDbType.NVarChar).Value = USUARIO;

            sqlCnn.Open();

            var res = sqlCom.ExecuteNonQuery();

            sqlCnn.Close();

        }





    }
}