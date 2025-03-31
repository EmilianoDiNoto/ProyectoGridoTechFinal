using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Web.Http;
using WebApplicationGridoTech.Models;

namespace WebApplicationGridoTech.Controllers
{
    public class WorkOrdersController : ApiController
    {
        private readonly WorkOrdersRepository _ProductionStoreRepository;

        public WorkOrdersController()
        {
            _ProductionStoreRepository = new WorkOrdersRepository();
        }

        // Nuevo método para obtener todos los materiales
        [HttpGet]
        [Route("api/WorkOrders/GetAllWorkOrders")]
        public IHttpActionResult GetAllWorkOrderMaterials()
        {
            List<WorkOrders> productionStores = _ProductionStoreRepository.GetAllWorkOrders();

            if (productionStores.Count == 0)
            {
                return NotFound();
            }

            return Ok(productionStores);
        }

        //Nuevo Metodo para obtener orden por nombre de producto
        [HttpGet]
        [Route("api/WorkOrders/by-product/{productName}")]
        public List<WorkOrders> GetByProductName(string productName)
        {
            if (string.IsNullOrEmpty(productName))
                return new List<WorkOrders>();

            var dt = _ProductionStoreRepository.SelectByProductName(productName);
            var ListaJson = JsonConvert.SerializeObject(dt);
            return JsonConvert.DeserializeObject<List<WorkOrders>>(ListaJson);
        }

        [HttpGet]
        [Route("api/WorkOrders/by-status/{productStatus}")]
        public List<WorkOrders> GetByProductStatus(string productStatus)
        {
            if (string.IsNullOrEmpty(productStatus))
                return new List<WorkOrders>();

            var dt = _ProductionStoreRepository.SelectByProductStatus(productStatus);
            var ListaJson = JsonConvert.SerializeObject(dt);
            return JsonConvert.DeserializeObject<List<WorkOrders>>(ListaJson);
        }

        // Nuevo método POST para insertar un movimiento en ProductionStore
        [HttpPost]
        [Route("api/WorkOrders/InsertWorkOrderse")]
        public IHttpActionResult InsertWorkOrders([FromBody] WorkOrders WorkOrders)
        {
            if (WorkOrders == null)
            {
                return BadRequest("Los datos del movimiento son requeridos.");
            }

            try
            {
                _ProductionStoreRepository.InsertWorkOrders(
                    WorkOrders.PRODUCTOID,
                    WorkOrders.CODIGO,
                    WorkOrders.DEMANDA,
                    WorkOrders.UM,
                    WorkOrders.FECHACREADA,
                    WorkOrders.FECHAMODIFICADA,
                    WorkOrders.ESTADO,
                    WorkOrders.FECHAELABORACION
                );

                return Ok("Movimiento insertado exitosamente.");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


    }
}
