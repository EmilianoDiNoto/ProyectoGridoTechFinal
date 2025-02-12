using System.Web.Http;
using System.Collections.Generic;
using WebApplicationGridoTech.Models;
using YourNamespace;
using System;

namespace WebApplicationGridoTech.Controllers
{
    public class SolicitudMaterialController : ApiController
    {
        private readonly SolicitudMaterialRepository _SolicitudMaterialRepository;

        public SolicitudMaterialController()
        {
            _SolicitudMaterialRepository = new SolicitudMaterialRepository();
        }

        // Nuevo método para obtener todos los materiales
        [HttpGet]
        [Route("api/SolicitudMaterialRepository/GetAllSolicitudes")]
        public IHttpActionResult GetAllWorkOrderMaterials()
        {
            List<SolicitudMaterial> production = _SolicitudMaterialRepository.GetAllSolicitudes();

            if (production.Count == 0)
            {
                return NotFound();
            }

            return Ok(production);
        }

        [HttpGet]
        [Route("api/SolicitudMaterialRepository/GetSolicitud/{id}")]
        public IHttpActionResult GetSolicitud(int id)
        {
            try
            {
                var solicitud = _SolicitudMaterialRepository.GetSolicitudPorId(id);

                if (solicitud == null)
                {
                    return NotFound(); // Si no se encuentra la solicitud
                }

                return Ok(solicitud); // Retorna la solicitud encontrada
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }





        // Nuevo método POST para insertar un movimiento en ProductionStore
        [HttpPost]
        [Route("api/SolicitudMaterialRepository/InsertSolicitud")]
        public IHttpActionResult InsertSolicitud([FromBody] SolicitudMaterial solicitud)
        {
            if (solicitud == null)
            {
                return BadRequest("Los datos de produccion son requeridos.");
            }

            try
            {
                _SolicitudMaterialRepository.InsertSolicitud(
                    solicitud.FechaSolicitud,
                    solicitud.Estado,
                    solicitud.DetalleMateriales,
                    solicitud.Usuario
                    //solicitud.FechaSolicitud,
                    //int.Parse(solicitud.Estado),
                    //int.Parse(solicitud.DetalleMateriales),
                    //int.Parse(solicitud.Usuario)

                );

                return Ok("Solicitud insertada exitosamente.");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPut]
        [Route("api/SolicitudMaterialRepository/UpdateSolicitud")]
        public IHttpActionResult UpdateSolicitud([FromBody] SolicitudMaterial solicitud)
        {
            if (solicitud == null || solicitud.SolicitudID <= 0)
            {
                return BadRequest("Datos de solicitud inválidos.");
            }

            try
            {
                // Llamada al método del repositorio para actualizar la solicitud
                _SolicitudMaterialRepository.UpdateSolicitudMaterial(
                    solicitud.SolicitudID,      // ID de la solicitud a actualizar
                    solicitud.Estado,           // Nuevo estado: SOLICITADO, ENTREGADO, ANULADO
                    solicitud.DetalleMateriales // Detalle de materiales en formato JSON
                );

                return Ok("Solicitud actualizada exitosamente.");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }




    }
}

