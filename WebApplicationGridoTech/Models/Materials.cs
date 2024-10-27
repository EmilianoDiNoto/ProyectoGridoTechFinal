using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WebApplicationGridoTech.Models
{
    public class Materials
    {
        #region Atributos
        // Conexión a Base de Datos EMMA
        //string conectionString = @"Data Source=LAPTOP-OJ158TC8 ;Initial Catalog=GridoTech ; Integrated Security= True ";

        //// Conexión a Base de Datos EMI
        string conectionString = @"Data Source=EMI-PC\EMI_PC_SERVER;Initial Catalog=GridoTech ; Integrated Security= True ";
        //// Conexión a Base de Datos EMMA
        //string conectionString = @"Data Source=LAPTOP-OJ158TC8 ;Initial Catalog=GridoTech ; Integrated Security= True ";
        //// Conexión a Base de Datos EMMA
        //string conectionString = @"Data Source=LAPTOP-OJ158TC8 ;Initial Catalog=GridoTech ; Integrated Security= True ";

        #endregion

        #region Propiedades

        public int MaterialID { get; set; }
        public string MaterialName { get; set; }
        public string Description { get; set; }
        public int SupplierID { get; set; }
        public int StockQuantity { get; set; }
        public string StockUnit { get; set; }
        #endregion

        #region Metodos

        public DataTable SelectAll()
        {
            string sqlSentencia = "SP_GetAll_Materials";

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

            string sqlSentencia = "RegisterMaterial";
            SqlConnection sqlCnn = new SqlConnection();
            sqlCnn.ConnectionString = conectionString;

            SqlCommand sqlCom = new SqlCommand(sqlSentencia, sqlCnn);
            sqlCom.CommandType = CommandType.StoredProcedure;

            sqlCom.Parameters.Add("@MaterialName", SqlDbType.NVarChar).Value = MaterialName;
            sqlCom.Parameters.Add("@Description", SqlDbType.NVarChar).Value = Description;
            sqlCom.Parameters.Add("@SupplierID", SqlDbType.Int).Value = SupplierID;
            sqlCom.Parameters.Add("@StockQuantity", SqlDbType.Int).Value = StockQuantity;
            sqlCom.Parameters.Add("@StockUnit", SqlDbType.NVarChar).Value = StockUnit;

            sqlCnn.Open();

            var res = sqlCom.ExecuteNonQuery();

            sqlCnn.Close();

        }

        public void Actualizar()
        {

            string sqlSentencia = "UpdateMaterial";
            SqlConnection sqlCnn = new SqlConnection();
            sqlCnn.ConnectionString = conectionString;

            SqlCommand sqlCom = new SqlCommand(sqlSentencia, sqlCnn);
            sqlCom.CommandType = CommandType.StoredProcedure;
            sqlCom.Parameters.Add("@MaterialID", SqlDbType.NVarChar).Value = MaterialID;
            sqlCom.Parameters.Add("@MaterialName", SqlDbType.NVarChar).Value = MaterialName;
            sqlCom.Parameters.Add("@Description", SqlDbType.NVarChar).Value = Description;
            sqlCom.Parameters.Add("@SupplierID", SqlDbType.Int).Value = SupplierID;
            sqlCom.Parameters.Add("@StockQuantity", SqlDbType.Int).Value = StockQuantity;
            sqlCom.Parameters.Add("@StockUnit", SqlDbType.NVarChar).Value = StockUnit;

            sqlCnn.Open();

            var res = sqlCom.ExecuteNonQuery();

            sqlCnn.Close();

        }


        #endregion
    }
}