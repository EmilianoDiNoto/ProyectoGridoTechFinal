using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WebApplicationGridoTech.Models
{
    public class Products
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
        public int CODIGO { get; set; }

        public string PRODUCTO { get; set; }

        public string DESCRIPCION { get; set; }
        public string UM { get; set; }
        #endregion

        #region Metodos

        public DataTable SelectAll()
        {
            string sqlSentencia = "SP_GetAll_Products";

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


        #endregion






    }

}
