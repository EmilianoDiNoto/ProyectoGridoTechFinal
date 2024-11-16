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
    public class ProductsController : ApiController
    {
        // GET: api/Products
        public List<Products> Get()
        {
            Products oProducts = new Products();
            var dt = oProducts.SelectAll();

            var ListaJson = JsonConvert.SerializeObject(dt);
            var Lista = JsonConvert.DeserializeObject<List<Products>>(ListaJson);
            return Lista;
        }

        //public List<Products> Get()
        //{
        //    Products oProducts = new Products();
        //    var dt = oProducts.SelectAllNato();

        //    var ListaJson = JsonConvert.SerializeObject(dt);
        //    var Lista = JsonConvert.DeserializeObject<List<Products>>(ListaJson);
        //    return Lista;
        //}

        //// GET: api/Products/5
        //public string Get(int id)
        //{
        //    return "value";
        //}

        //// POST: api/Products
        //public void Post([FromBody]string value)
        //{
        //}

        //// PUT: api/Products/5
        //public void Put(int id, [FromBody]string value)
        //{
        //}

        //// DELETE: api/Products/5
        //public void Delete(int id)
        //{
        //}
    }
}
