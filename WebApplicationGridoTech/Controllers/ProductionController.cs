using System.Web.Http;
using System.Collections.Generic;
using WebApplicationGridoTech.Models;
using YourNamespace;
using System;

namespace WebApplicationGridoTech.Controllers
{
    public class ProductionController : ApiController
    {
        private readonly ProductionRepository _ProductionRepository;

        public ProductionController()
        {
            _ProductionRepository = new ProductionRepository();
        }

        // Nuevo método para obtener todos los materiales
        [HttpGet]
        [Route("api/Production/GetAllProduction")]
        public IHttpActionResult GetAllWorkOrderMaterials()
        {
            List<Production> production = _ProductionRepository.GetAllProduction();

            if (production.Count == 0)
            {
                return NotFound();
            }

            return Ok(production);
        }

        // Nuevo método POST para insertar un movimiento en ProductionStore
        [HttpPost]
        [Route("api/Production/InsertProduction")]
        public IHttpActionResult InsertProduction([FromBody] Production production)
        {
            if (production == null)
            {
                return BadRequest("Los datos de produccion son requeridos.");
            }

            try
            {
                _ProductionRepository.InsertProduction(
                    production.FECHA,
                    int.Parse(production.TURNO),
                    int.Parse(production.RESPONSABLE),
                    production.OT,
                    production.PRODUCIDO
                );

                return Ok("Produccion insertada exitosamente.");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}

