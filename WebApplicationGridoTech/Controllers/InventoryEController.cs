using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data;
using WebApplicationGridoTech.Models;
using Newtonsoft.Json;

namespace WebApplicationGridoTech.Controllers
{
    public class InventoryEController : ApiController
    {
        // GET: api/InventoryE
        public List<InventoryE> Get()
        {
            InventoryE oInventory = new InventoryE();
            var dt = oInventory.SelectAll();

            var ListaJson = JsonConvert.SerializeObject(dt);
            var Lista = JsonConvert.DeserializeObject<List<InventoryE>>(ListaJson);
            return Lista;
        }

        // GET: api/InventoryE/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/InventoryE
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/InventoryE/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/InventoryE/5
        public void Delete(int id)
        {
        }
    }
}
