using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WebApplicationGridoTech.Models
{
    public class Inventory
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

        public int InventoryID { get; set; }
        public int MaterialID { get; set; }
        public int InitialStock { get; set; }
        public int FinalStock { get; set; }
        public DateTime Date { get; set; }
        public string BatchNumber { get; set; }
        public string Material { get; set; }
        public int Stock_Inicial { get; set; }
        public int Stock_Final { get; set; }
        public DateTime Fecha_de_Inventario { get; set; }

        #endregion

        #region Metodos
        public DataTable SelectAll()
        {
            string sqlSentencia = "SP_V_Inventory1";

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

            string sqlSentencia = "InsertInventory";
            SqlConnection sqlCnn = new SqlConnection();
            sqlCnn.ConnectionString = conectionString;

            SqlCommand sqlCom = new SqlCommand(sqlSentencia, sqlCnn);
            sqlCom.CommandType = CommandType.StoredProcedure;

            sqlCom.Parameters.Add("@MaterialID", SqlDbType.Int).Value = MaterialID;
            sqlCom.Parameters.Add("@InitialStock", SqlDbType.Int).Value = InitialStock;
            sqlCom.Parameters.Add("@FinalStock", SqlDbType.Int).Value = FinalStock;
            sqlCom.Parameters.Add("@Date", SqlDbType.DateTime).Value = Date;
            sqlCom.Parameters.Add("@BatchNumber", SqlDbType.NVarChar).Value = BatchNumber;


            sqlCnn.Open();

            var res = sqlCom.ExecuteNonQuery();

            sqlCnn.Close();

        }
        public void Actualizar()
        {
            string sqlSentencia = "UpdateInventory";


            SqlConnection sqlCnn = new SqlConnection();
            sqlCnn.ConnectionString = conectionString;


            SqlCommand sqlCom = new SqlCommand(sqlSentencia, sqlCnn);
            sqlCom.CommandType = CommandType.StoredProcedure;
            sqlCom.Parameters.Add("@InventoryID", SqlDbType.Int).Value = InventoryID;
            sqlCom.Parameters.Add("@MaterialID", SqlDbType.Int).Value = MaterialID;
            sqlCom.Parameters.Add("@InitialStock", SqlDbType.Int).Value = InitialStock;
            sqlCom.Parameters.Add("@FinalStock", SqlDbType.Int).Value = FinalStock;
            sqlCom.Parameters.Add("@Date", SqlDbType.DateTime).Value = Date;
            sqlCom.Parameters.Add("@BatchNumber", SqlDbType.NVarChar).Value = BatchNumber;

            sqlCnn.Open();


            var res = sqlCom.ExecuteNonQuery();


            sqlCnn.Close();

        }

        #endregion


    }
}