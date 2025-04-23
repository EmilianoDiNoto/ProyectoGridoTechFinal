using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;


namespace WebApplication.ApiAdo.Models
{
    public class RetainedMaterial
    {

        #region Atributo


        // Conexión a Base de Datos EMI
        string conectionString = @"Data Source=EMI-PC\EMI_PC_SERVER;Initial Catalog=GridoTech; Integrated Security= True ";

        // Conexión a Base de Datos EMMA
        //string conectionString = @"Data Source=LAPTOP-OJ158TC8 ;Initial Catalog=GridoTech ; Integrated Security= True ";

        // Conexión a Base de Datos DIANA
        //string conectionString = @"Data Source=DIANA\SQLEXPRESS01;Initial Catalog=GridoTech ; Integrated Security= True ";

        // Conexión a Base de Datos SOFIA
        //string conectionString = @"Data Source=;Initial Catalog=GridoTech ; Integrated Security= True ";

        #endregion


        #region Propiedades
        public int RetainID { get; set; }

        public int MaterialID { get; set; }

        public string MaterialName { get; set; }

        public string Reason { get; set; }

        public DateTime DateRetained { get; set; }


        #endregion


        #region Metodos
        public DataTable SelectAll()
        {
            string sqlSentencia = "ListarRetained";


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

        public DataTable SelectById(int RetainID)
        {
            string sqlSentencia = "ListarPorIdRetained";

            SqlConnection sqlCnn = new SqlConnection();
            sqlCnn.ConnectionString = conectionString;

            SqlCommand sqlCom = new SqlCommand(sqlSentencia, sqlCnn);
            sqlCom.CommandType = CommandType.StoredProcedure;
            sqlCom.Parameters.AddWithValue("@Id", RetainID);

            DataSet ds = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter();
            da.SelectCommand = sqlCom;
            da.Fill(ds);

            sqlCnn.Close();

            return ds.Tables[0];
        }

        public void InsertRetained()
        {
            string sqlSentencia = "InsertRetainedMaterial";

            using (SqlConnection sqlCnn = new SqlConnection(conectionString))
            {
                SqlCommand sqlCom = new SqlCommand(sqlSentencia, sqlCnn);
                sqlCom.CommandType = CommandType.StoredProcedure;

                // Añadir los parámetros necesarios para el procedimiento almacenado
                sqlCom.Parameters.Add("@MaterialID", SqlDbType.Int).Value = MaterialID;
                sqlCom.Parameters.Add("@Reason", SqlDbType.NVarChar).Value = Reason;
                sqlCom.Parameters.Add("@DateRetained", SqlDbType.DateTime).Value = DateRetained;

                sqlCnn.Open();
                sqlCom.ExecuteNonQuery(); // Ejecuta la inserción
            }
        }




        public void Modificar()
        {
            string sqlSentencia = "UpdateRetainedMaterial";


            SqlConnection sqlCnn = new SqlConnection();
            sqlCnn.ConnectionString = conectionString;



            SqlCommand sqlCom = new SqlCommand(sqlSentencia, sqlCnn);
            sqlCom.CommandType = CommandType.StoredProcedure;
            sqlCom.Parameters.Add("@RetainID", SqlDbType.Int).Value = RetainID;
            sqlCom.Parameters.Add("@MaterialID", SqlDbType.Int).Value = MaterialID;
            sqlCom.Parameters.Add("@Reason", SqlDbType.NVarChar).Value = Reason;
            sqlCom.Parameters.Add("@DateRetained", SqlDbType.Date).Value = DateRetained;



            sqlCnn.Open();


            var res = sqlCom.ExecuteNonQuery();


            sqlCnn.Close();

        }


        #endregion




    }
}