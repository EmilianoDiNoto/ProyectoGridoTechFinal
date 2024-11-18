using System.Web.Http;
using System.Collections.Generic;
using WebApplicationGridoTech.Models;
using YourNamespace;
using System;

namespace WebApplicationGridoTech.Controllers
{
    public class ProductionStoreController : ApiController
    {
        private readonly ProductionStoreRepository _ProductionStoreRepository;

        public ProductionStoreController()
        {
            _ProductionStoreRepository = new ProductionStoreRepository();
        }

        // Nuevo método para obtener todos los materiales
        [HttpGet]
        [Route("api/ProductionStore/GetAllProductionStore")]
        public IHttpActionResult GetAllWorkOrderMaterials()
        {
            List<ProductionStore> productionStores = _ProductionStoreRepository.GetAllProductionStore();

            if (productionStores.Count == 0)
            {
                return NotFound();
            }

            return Ok(productionStores);
        }

        // Nuevo método POST para insertar un movimiento en ProductionStore
        [HttpPost]
        [Route("api/ProductionStore/InsertProductionStore")]
        public IHttpActionResult InsertProductionStore([FromBody] ProductionStore productionStore)
        {
            if (productionStore == null)
            {
                return BadRequest("Los datos del movimiento son requeridos.");
            }

            try
            {
                _ProductionStoreRepository.InsertProductionStore(
                    productionStore.FECHAMOV,
                    int.Parse(productionStore.TURNO),
                    int.Parse(productionStore.RESPONSABLE),
                    productionStore.OT,
                    int.Parse(productionStore.MATERIAL),
                    productionStore.CANTIDAD,
                    int.Parse(productionStore.PROVEEDOR),
                    productionStore.LOTE,
                    productionStore.TIPOMOV
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

