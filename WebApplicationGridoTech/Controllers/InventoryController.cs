using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Data;
using System.Web.Http;
using WebApplicationGridoTech.Models;


namespace WebApplicationGridoTech.Controllers
{
    public class InventoryController : ApiController
    {
        // GET: api/Inventory
        public List<Inventory> Get()
        {
            Inventory oInventory = new Inventory();
            var dt = oInventory.SelectAll();

            var ListaJson = JsonConvert.SerializeObject(dt);
            var Lista = JsonConvert.DeserializeObject<List<Inventory>>(ListaJson);
            return Lista;
        }

        // POST: api/Inventory
        public void Post([FromBody] Inventory value)
        {
            Inventory oInventory = new Inventory();
            oInventory.MaterialID = value.MaterialID;
            oInventory.InitialStock = value.InitialStock;
            oInventory.FinalStock = value.FinalStock;
            oInventory.Date = value.Date;
            oInventory.BatchNumber = value.BatchNumber;

            oInventory.Insert();
        }

        // PUT: api/Inventory/5
        public void Put(int id, [FromBody] Inventory value)
        {
            Inventory oInventory = new Inventory();
            oInventory.InventoryID = id;
            oInventory.InitialStock = value.InitialStock;
            oInventory.FinalStock = value.FinalStock;
            oInventory.Date = value.Date;
            oInventory.BatchNumber = value.BatchNumber;

            oInventory.Actualizar();

        }
    }
}
