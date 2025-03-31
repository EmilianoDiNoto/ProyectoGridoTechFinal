using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Web.Http;
using WebApplicationGridoTech.Models;

namespace WebApplicationGridoTech.Controllers
{
    public class MaterialSuppliersController : ApiController
    {
        private readonly MaterialSuppliersRepository _ProductionStoreRepository;

        public MaterialSuppliersController()
        {
            _ProductionStoreRepository = new MaterialSuppliersRepository();
        }

        [HttpGet]
        [Route("api/MaterialSupplier/by-material/{materialname}")]
        public IHttpActionResult GetMaterialSuppliers(string materialname)
        {
            try
            {
                if (string.IsNullOrEmpty(materialname))
                    return BadRequest("El nombre del material no puede estar vacío.");

                var dt = _ProductionStoreRepository.SelectByMaterialSuppliers(materialname);
                var materialSuppliersList = new List<MaterialSupplier>();

                foreach (DataRow row in dt.Rows)
                {
                    materialSuppliersList.Add(new MaterialSupplier
                    {
                        PROVEEDOR = row["PROVEEDOR"].ToString()
                    });
                }

                return Ok(materialSuppliersList);
            }
            catch (Exception ex)
            {
                return InternalServerError(new Exception("Error en la API: " + ex.Message));
            }
        }


    }
}
