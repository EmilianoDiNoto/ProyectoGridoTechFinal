using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplicationGridoTech.Models;

namespace WebApplicationGridoTech.Controllers
{
    public class SolicitudMaterialRepositoryController : ApiController
    {
        // GET: api/SolicitudMaterialRepository
        public List<SolicitudMaterialRepository> Get()
        {
            SolicitudMaterialRepository oMaterials = new SolicitudMaterialRepository();
            var dt = oMaterials.SelectAll();

            var ListaJson = JsonConvert.SerializeObject(dt);
            var Lista = JsonConvert.DeserializeObject<List<SolicitudMaterialRepository>>(ListaJson);
            return Lista;
        }



        //// POST: api/SolicitudMaterialRepository
        public void Post([FromBody] SolicitudMaterialRepository value)
        {
            SolicitudMaterialRepository oMaterials = new SolicitudMaterialRepository();
          
            oMaterials.ESTADO = value.ESTADO;
            oMaterials.DETALLEMATERIALES = value.DETALLEMATERIALES;
            oMaterials.USUARIO = value.USUARIO;
         

            oMaterials.Insert();
        }

        //// PUT: api/SolicitudMaterialRepository/5
        //public void Put(int id, [FromBody]string value)
        //{
        //}

        //// DELETE: api/SolicitudMaterialRepository/5
        //public void Delete(int id)
        //{
        //}
    }
}
