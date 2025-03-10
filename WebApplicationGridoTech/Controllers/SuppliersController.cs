using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplicationGridoTech.Models;

namespace WebApplicationGridoTech.Controllers
{
    public class SuppliersController : ApiController
    {
        private readonly Suppliers _UnplannedStopsRepository;

        public SuppliersController()
        {
            _UnplannedStopsRepository = new Suppliers();
        }

        // Nuevo método para obtener todos los eventos
        [HttpGet]
        [Route("api/Suppliers/GetAllSupplier")]
        public IHttpActionResult GetAllSupplier()
        {
            List<Supplier> production = _UnplannedStopsRepository.GetAllSupplier();

            if (production.Count == 0)
            {
                return NotFound();
            }

            return Ok(production);
        }
    }
}
