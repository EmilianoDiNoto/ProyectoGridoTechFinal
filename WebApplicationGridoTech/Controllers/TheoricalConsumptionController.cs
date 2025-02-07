using System.Web.Http;
using System.Collections.Generic;
using WebApplicationGridoTech.Models;
using YourNamespace;


namespace WebApplicationGridoTech.Controllers
{
    public class TheoricalConsumptionController : ApiController
    {

        private readonly TheoricalConsumptionRepository _TheoricalConsumptionRepository;

        public TheoricalConsumptionController()
        {
            _TheoricalConsumptionRepository = new TheoricalConsumptionRepository();
        }

        // Método existente para obtener materiales por OT
        [HttpGet]
        [Route("api/TheoricalConsumption/GetTheoricalConsumption")]
        public IHttpActionResult GetTheoricalConsumption([FromUri] int ot)
        {
            if (ot <= 0)
            {
                return BadRequest("Se requiere un OT(Número de pedido) válido.");
            }

            List<TheoricalConsumption> materials = _TheoricalConsumptionRepository.GetTheoricalConsumption(ot);

            if (materials.Count == 0)
            {
                return NotFound();
            }

            return Ok(materials);
        }

        // Nuevo método para obtener todos los materiales
        [HttpGet]
        [Route("api/TheoricalConsumption/Consolidadobm")]
        public IHttpActionResult GetTheoricalConsumption()
        {
            List<TheoricalConsumption> materials = _TheoricalConsumptionRepository.Consolidadobm();

            if (materials.Count == 0)
            {
                return NotFound();
            }

            return Ok(materials);
        }
    }
}
