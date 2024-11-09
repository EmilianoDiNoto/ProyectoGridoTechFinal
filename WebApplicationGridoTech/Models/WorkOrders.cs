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
        public string PRODUCTO { get; set; }
        public int DEMANDA { get; set; }
        public string ESTADO { get; set; }
        public string UM { get; set; }
        

       

        #endregion

        #region Metodos
        public DataTable SelectAll()
        {
            string sqlSentencia = "SP_V_GetAll_WorkOrders";

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

        //public void Insert()
        //{

        //    string sqlSentencia = "SP_Insert_WorkOrders";
        //    SqlConnection sqlCnn = new SqlConnection();
        //    sqlCnn.ConnectionString = conectionString;

        //    SqlCommand sqlCom = new SqlCommand(sqlSentencia, sqlCnn);
        //    sqlCom.CommandType = CommandType.StoredProcedure;

        //    sqlCom.Parameters.Add("@ProductID", SqlDbType.Int).Value = ProductID;
        //    sqlCom.Parameters.Add("@Quantity", SqlDbType.Int).Value = Quantity;
        //    sqlCom.Parameters.Add("@Status", SqlDbType.NVarChar).Value = Status;

        //    sqlCnn.Open();

        //    var res = sqlCom.ExecuteNonQuery();

        //    sqlCnn.Close();

        //}

        //public void Actualizar()
        //{
        //    string sqlSentencia = "SP_Update_WorkOrders";


        //    SqlConnection sqlCnn = new SqlConnection();
        //    sqlCnn.ConnectionString = conectionString;


        //    SqlCommand sqlCom = new SqlCommand(sqlSentencia, sqlCnn);
        //    sqlCom.CommandType = CommandType.StoredProcedure;
        //    sqlCom.Parameters.Add("@WorkOrderID", SqlDbType.Int).Value = WorkOrderID;
        //    sqlCom.Parameters.Add("@ProductID", SqlDbType.Int).Value = ProductID;
        //    sqlCom.Parameters.Add("@Quantity", SqlDbType.Int).Value = Quantity;
        //    sqlCom.Parameters.Add("@Status", SqlDbType.NVarChar).Value = Status;
        //    sqlCom.Parameters.Add("@createdAT", SqlDbType.DateTime).Value = CreatedAt;
        //    sqlCom.Parameters.Add("@UpdateAT", SqlDbType.DateTime).Value = UpdatedAt;

        //    sqlCnn.Open();


        //    var res = sqlCom.ExecuteNonQuery();


        //    sqlCnn.Close();

        //}

        #endregion


    }
}