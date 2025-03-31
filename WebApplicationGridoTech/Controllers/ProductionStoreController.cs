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

        // Nuevo método para obtener movimientos filtrados por fecha, material y tipo de movimiento
        [HttpGet]
        [Route("api/ProductionStore/GetProductionStoreByDateRange")]
        public IHttpActionResult GetProductionStoreByDateRange(DateTime fechaDesde, DateTime fechaHasta, string material, string movimiento)
        {
            try
            {
                List<ProductionStore> productionStores = _ProductionStoreRepository.GetProductionStoreByDateRange(fechaDesde, fechaHasta, material, movimiento);

                if (productionStores == null || productionStores.Count == 0)
                {
                    return NotFound();
                }

                return Ok(productionStores);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // Nuevo método para obtener movimientos filtrados por fecha, material y tipo de movimiento
        [HttpGet]
        [Route("api/ProductionStore/GetProductionStoreInitial")]
        public IHttpActionResult GetProductionStoreInitial(DateTime fechaDesde, string material, string movimiento)
        {
            try
            {
                List<ProductionStore> productionStoresI = _ProductionStoreRepository.GetProductionStoreInitial(fechaDesde, material, movimiento);

                if (productionStoresI == null || productionStoresI.Count == 0)
                {
                    return NotFound();
                }

                return Ok(productionStoresI);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("api/ProductionStore/GetProductionStoreFinal")]
        public IHttpActionResult GetProductionStoreFinal(DateTime fechaHasta, string material, string movimiento)
        {
            try
            {
                List<ProductionStore> productionStoresF = _ProductionStoreRepository.GetProductionStoreFinal(fechaHasta, material, movimiento);

                if (productionStoresF == null || productionStoresF.Count == 0)
                {
                    return NotFound();
                }

                return Ok(productionStoresF);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

    }
}

