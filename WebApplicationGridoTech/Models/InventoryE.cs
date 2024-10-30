using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WebApplicationGridoTech.Models
{
    public class InventoryE
    {
        #region Atributos
        // Conexión a Base de Datos EMMA
        string conectionString = @"Data Source=LAPTOP-OJ158TC8 ;Initial Catalog=GridoTech ; Integrated Security= True ";
        #endregion

        #region Atributos
        public string Material { get; set; }
        public int Stock_Inicial { get; set; }
        public int Stock_Final { get; set; }
        public DateTime Fecha_de_Inventario { get; set; }

        #endregion

        #region Metodos
        public DataTable SelectAll()
        {
            string sqlSentencia = @"
        SELECT 
            M.MaterialName AS Material, 
            I.InitialStock AS 'Stock Inicial', 
            I.FinalStock AS 'Stock Final', 
            I.Date AS 'Fecha de inventario' 
        FROM Inventory I
        INNER JOIN Materials M ON I.MaterialID = M.MaterialID";

            SqlConnection sqlCnn = new SqlConnection(conectionString);

            SqlCommand sqlCom = new SqlCommand(sqlSentencia, sqlCnn);
            sqlCom.CommandType = CommandType.Text; // Cambia el tipo de comando a Text

            DataSet ds = new DataSet();

            SqlDataAdapter da = new SqlDataAdapter();
            da.SelectCommand = sqlCom;

            sqlCnn.Open();
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

            sqlCom.Parameters.Add("@Material", SqlDbType.Int).Value = Material;
            sqlCom.Parameters.Add("@InitialStock", SqlDbType.Int).Value = Stock_Inicial;
            sqlCom.Parameters.Add("@FinalStock", SqlDbType.Int).Value = Stock_Final;
            sqlCom.Parameters.Add("@FE", SqlDbType.DateTime).Value = Fecha_de_Inventario;
            

            sqlCnn.Open();

            var res = sqlCom.ExecuteNonQuery();

            sqlCnn.Close();

        }



        #endregion



    }
}