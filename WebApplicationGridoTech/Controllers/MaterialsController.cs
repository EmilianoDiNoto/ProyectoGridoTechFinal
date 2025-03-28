﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplicationGridoTech.Models;

namespace WebApplicationGridoTech.Controllers
{
    public class MaterialsController : ApiController
    {
        // GET: api/Materials
        public List<Materials> Get()
        {
            Materials oMaterials = new Materials();
            var dt = oMaterials.SelectAll();

            var ListaJson = JsonConvert.SerializeObject(dt);
            var Lista = JsonConvert.DeserializeObject<List<Materials>>(ListaJson);
            return Lista;
        }

        // // GET: api/Materials/5
        //// public string Get(int id)
        // //{
        //     //return "value";
        // //}

        // // POST: api/Materials
        public void Post([FromBody] Materials value)
        {
            Materials oMaterials = new Materials();
            oMaterials.CODIGO = value.CODIGO;
            oMaterials.MATERIAL = value.MATERIAL;
            oMaterials.STOCK_MIN = value.STOCK_MIN;
            oMaterials.UM = value.UM;
            oMaterials.PRECIO = value.PRECIO;

            oMaterials.Insert();
        }

        // // PUT: api/Materials/5
        public void Put(int id, [FromBody] Materials value)
        {
            Materials oMaterials = new Materials();
            oMaterials.MaterialID = id;
            oMaterials.CODIGO = value.CODIGO;
            oMaterials.MATERIAL = value.MATERIAL;
            oMaterials.STOCK_MIN = value.STOCK_MIN;
            oMaterials.UM = value.UM;
            oMaterials.PRECIO = value.PRECIO; ;

            oMaterials.Actualizar();
        }

        // DELETE: api/Materials/5
        // public void Delete(int id)
        //{
        //}
    }//
}
