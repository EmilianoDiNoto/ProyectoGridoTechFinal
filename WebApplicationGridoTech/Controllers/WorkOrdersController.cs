using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplicationGridoTech.Models;

namespace WebApplicationGridoTech.Controllers
{
    public class WorkOrdersController : ApiController
    {
        // GET: api/WorkOrders
        public List<WorkOrders> Get()
        {
            WorkOrders oWorkOrders = new WorkOrders();
            var dt = oWorkOrders.SelectAll();

            var ListaJson = JsonConvert.SerializeObject(dt);
            var Lista = JsonConvert.DeserializeObject<List<WorkOrders>>(ListaJson);
            return Lista;
        }

        // GET: api/WorkOrders/5
        //public string Get(int id)
        //{
            //return "value";
        //}

        // POST: api/WorkOrders
        public void Post([FromBody] WorkOrders value)
        {
            WorkOrders oWorkOrders = new WorkOrders();
            oWorkOrders.ProductID = value.ProductID;
            oWorkOrders.Quantity = value.Quantity;
            oWorkOrders.Status = value.Status;

            oWorkOrders.Insert();

        }

        // PUT: api/WorkOrders/5
        public void Put(int id, [FromBody] WorkOrders value)
        {
            WorkOrders oWorkOrders = new WorkOrders();
            oWorkOrders.WorkOrderID = id;
            oWorkOrders.ProductID = value.ProductID;
            oWorkOrders.Quantity = value.Quantity;
            oWorkOrders.Status = value.Status;
            oWorkOrders.CreatedAt = value.CreatedAt;
            oWorkOrders.UpdatedAt = value.UpdatedAt;

            oWorkOrders.Actualizar();

        }

        // DELETE: api/WorkOrders/5
        //public void Delete(int id)
        //{
        //}
    }
}
