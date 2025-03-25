using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Configuration; // Necesario para acceder a la cadena de conexión

namespace WebApplicationGridoTech.Models
{
  
    public class FiltroProductionGrafico
    {
        public DateTime Fecha { get; set; }
        public string ProductName { get; set; }
        public int Cantidad { get; set; }
        public int Demanda { get; set; }
    }


}