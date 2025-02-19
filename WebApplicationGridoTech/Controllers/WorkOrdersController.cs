using Newtonsoft.Json;
using System.Collections.Generic;
using System.Data;
using System.Web.Http;
using WebApplicationGridoTech.Models;

namespace WebApplicationGridoTech.Controllers
{
    public class WorkOrdersController : ApiController
    {
        private readonly WorkOrders _workOrdersRepository;

        public WorkOrdersController()
        {
            _workOrdersRepository = new WorkOrders();
        }

        // GET: api/WorkOrders
        public List<WorkOrders> Get()
        {
            var dt = _workOrdersRepository.SelectAll();
            var ListaJson = JsonConvert.SerializeObject(dt);
            return JsonConvert.DeserializeObject<List<WorkOrders>>(ListaJson);
        }

        // GET: api/WorkOrders/by-product/{productName}
        [HttpGet]
        [Route("api/WorkOrders/by-product/{productName}")]
        public List<WorkOrders> GetByProductName(string productName)
        {
            if (string.IsNullOrEmpty(productName))
                return new List<WorkOrders>();

            var dt = _workOrdersRepository.SelectByProductName(productName);
            var ListaJson = JsonConvert.SerializeObject(dt);
            return JsonConvert.DeserializeObject<List<WorkOrders>>(ListaJson);
        }

        // POST: api/WorkOrders
        public void Post([FromBody] WorkOrders value)
        {
            WorkOrders oWorkOrders = new WorkOrders
            {
                PRODUCTOID = value.PRODUCTOID,
                CODIGO = value.CODIGO,
                DEMANDA = value.DEMANDA,
                UM = value.UM,
                FECHACREADA = value.FECHACREADA,
                FECHAMODIFICADA = value.FECHAMODIFICADA,
                ESTADO = value.ESTADO,
                FECHAELABORACION = value.FECHAELABORACION
            };

            oWorkOrders.Insert();
        }

        // PUT: api/WorkOrders/5
        public void Put(int id, [FromBody] WorkOrders value)
        {
            WorkOrders oWorkOrders = new WorkOrders
            {
                OT = id,
                PRODUCTOID = value.PRODUCTOID,
                CODIGO = value.CODIGO,
                DEMANDA = value.DEMANDA,
                UM = value.UM,
                FECHACREADA = value.FECHACREADA,
                FECHAMODIFICADA = value.FECHAMODIFICADA,
                ESTADO = value.ESTADO,
                FECHAELABORACION = value.FECHAELABORACION
            };

            oWorkOrders.Actualizar();
        }
    }
}
