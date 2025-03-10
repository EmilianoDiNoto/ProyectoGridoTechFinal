using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplicationGridoTech.Models;

namespace WebApplicationGridoTech.Controllers
{
    public class UnplannedStopsController : ApiController
    {
        private readonly UnplannedStops _UnplannedStopsRepository;

        public UnplannedStopsController()
        {
            _UnplannedStopsRepository = new UnplannedStops();
        }

        // Nuevo método para obtener todos los eventos
        [HttpGet]
        [Route("api/Unplanned/GetAllUnplanned")]
        public IHttpActionResult GetAllUnplanned()
        {
            List<Unplanned> production = _UnplannedStopsRepository.GetAllUnplanned();

            if (production.Count == 0)
            {
                return NotFound();
            }

            return Ok(production);
        }

        // Nuevo método POST para insertar un EVENTO
        [HttpPost]
        [Route("api/Unplanned/InsertUnplanned")]
        public IHttpActionResult InsertUnplanned([FromBody] Unplanned Unplanned)
        {
            if (Unplanned == null)
            {
                return BadRequest("Los datos de produccion son requeridos.");
            }

            try
            {
                _UnplannedStopsRepository.InsertUnplanned(

                    Unplanned.OT,
                    Unplanned.FECHA,
                    Unplanned.HSINICIO,
                    Unplanned.FECHAFIN,
                    Unplanned.HSFIN,
                    Unplanned.DETALLE,
                    Unplanned.TALLER
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
