using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WebApplicationGridoTech.Models
{
    public class WorkOrders
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

        #region Propiedades
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





        #endregion

        #region Metodos
        public DataTable SelectAll()
        {
            string sqlSentencia = "SP_GetAll_WorkOrder";

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

            string sqlSentencia = "SP_Insert_WorkOrder";
            SqlConnection sqlCnn = new SqlConnection();
            sqlCnn.ConnectionString = conectionString;

            SqlCommand sqlCom = new SqlCommand(sqlSentencia, sqlCnn);
            sqlCom.CommandType = CommandType.StoredProcedure;

            sqlCom.Parameters.Add("@PRODUCTOID", SqlDbType.Int).Value = PRODUCTOID;
            sqlCom.Parameters.Add("@CODIGO", SqlDbType.Int).Value = CODIGO;
            //sqlCom.Parameters.Add("@PRODUCTO", SqlDbType.NVarChar).Value = PRODUCTO;
            sqlCom.Parameters.Add("@DEMANDA", SqlDbType.Int).Value = DEMANDA;
            sqlCom.Parameters.Add("@UM", SqlDbType.NVarChar).Value = UM;
            sqlCom.Parameters.Add("@FECHACREADA", SqlDbType.DateTime).Value = FECHACREADA;
            sqlCom.Parameters.Add("@FECHAMODIFICADA", SqlDbType.DateTime).Value = FECHAMODIFICADA;
            sqlCom.Parameters.Add("@ESTADO", SqlDbType.NVarChar).Value = ESTADO;
            sqlCom.Parameters.Add("@FECHAELABORACION", SqlDbType.Date).Value = FECHAELABORACION;


            sqlCnn.Open();

            var res = sqlCom.ExecuteNonQuery();

            sqlCnn.Close();

        }

        public void Actualizar()
        {
            string sqlSentencia = "SP_Update_WorkOrders";


            SqlConnection sqlCnn = new SqlConnection();
            sqlCnn.ConnectionString = conectionString;


            SqlCommand sqlCom = new SqlCommand(sqlSentencia, sqlCnn);
            sqlCom.CommandType = CommandType.StoredProcedure;
            sqlCom.Parameters.Add("@OT", SqlDbType.Int).Value = OT;
            sqlCom.Parameters.Add("@PRODUCTOID", SqlDbType.Int).Value = PRODUCTOID;
            sqlCom.Parameters.Add("@CODIGO", SqlDbType.Int).Value = CODIGO;
            //sqlCom.Parameters.Add("@PRODUCTO", SqlDbType.NVarChar).Value = PRODUCTO;
            sqlCom.Parameters.Add("@DEMANDA", SqlDbType.Int).Value = DEMANDA;
            sqlCom.Parameters.Add("@UM", SqlDbType.NVarChar).Value = UM;
            sqlCom.Parameters.Add("@FECHACREADA", SqlDbType.DateTime).Value = FECHACREADA;
            sqlCom.Parameters.Add("@FECHAMODIFICADA", SqlDbType.DateTime).Value = FECHAMODIFICADA;
            sqlCom.Parameters.Add("@ESTADO", SqlDbType.NVarChar).Value = ESTADO;
            sqlCom.Parameters.Add("@FECHAELABORACION", SqlDbType.DateTime).Value = FECHAELABORACION;

            sqlCnn.Open();


            var res = sqlCom.ExecuteNonQuery();


            sqlCnn.Close();

        }

        #endregion


    }
}