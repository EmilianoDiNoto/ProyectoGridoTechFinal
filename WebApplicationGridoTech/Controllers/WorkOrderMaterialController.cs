using System.Web.Http;
using System.Collections.Generic;
using WebApplicationGridoTech.Models;
using YourNamespace;

namespace WebApplicationGridoTech.Controllers
{
    public class WorkOrderMaterialsController : ApiController
    {
        private readonly WorkOrderMaterialRepository _workOrderMaterialRepository;

        public WorkOrderMaterialsController()
        {
            _workOrderMaterialRepository = new WorkOrderMaterialRepository();
        }

        // Método existente para obtener materiales por OT
        [HttpGet]
        [Route("api/WorkOrderMaterial/GetWorkOrderMaterials")]
        public IHttpActionResult GetWorkOrderMaterials([FromUri] int ot)
        {
            if (ot <= 0)
            {
                return BadRequest("A valid OT (Order Number) is required.");
            }

            List<WorkOrderMaterial> materials = _workOrderMaterialRepository.GetWorkOrderMaterials(ot);

            if (materials.Count == 0)
            {
                return NotFound();
            }

            return Ok(materials);
        }

        // Nuevo método para obtener todos los materiales
        [HttpGet]
        [Route("api/WorkOrderMaterial/GetAllWorkOrderMaterials")]
        public IHttpActionResult GetAllWorkOrderMaterials()
        {
            List<WorkOrderMaterial> materials = _workOrderMaterialRepository.GetAllWorkOrderMaterials();

            if (materials.Count == 0)
            {
                return NotFound();
            }

            return Ok(materials);
        }
    }
}
