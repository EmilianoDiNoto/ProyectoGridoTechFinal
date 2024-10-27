using System;
using System.Collections.Generic;
using System.Data;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication.ApiAdo.Models;
using Newtonsoft.Json;

namespace WebApplication.ApiAdo.Controllers
{
    public class RetainedMaterialController : ApiController
    {
        // GET: api/RetainedMaterial
        public List<RetainedMaterial> Get()
        {
            RetainedMaterial oRetainedMaterial = new RetainedMaterial();
            var dt = oRetainedMaterial.SelectAll();

            var ListaJsom = JsonConvert.SerializeObject(dt);
            var Lista = JsonConvert.DeserializeObject<List<RetainedMaterial>>(ListaJsom);

            return Lista;
        }

        // GET: api/RetainedMaterial/{id}
        public IHttpActionResult Get(int id)
        {
            RetainedMaterial oRetainedMaterial = new RetainedMaterial();
            var dt = oRetainedMaterial.SelectById(id);

            if (dt.Rows.Count == 0)
            {
                return NotFound();
            }

            var retainedMaterial = new RetainedMaterial
            {
                RetainID = Convert.ToInt32(dt.Rows[0]["RetainID"]),
                MaterialID = Convert.ToInt32(dt.Rows[0]["MaterialID"]),
                MaterialName = Convert.ToString(dt.Rows[0]["MaterialName"]),
                Reason = Convert.ToString(dt.Rows[0]["Reason"]),
                DateRetained = Convert.ToDateTime(dt.Rows[0]["DateRetained"])
            };

            return Ok(retainedMaterial);
        }

        // POST: api/RetainedMaterial
        public IHttpActionResult Post([FromBody] RetainedMaterial retainedMaterial)
        {
            try
            {
                retainedMaterial.InsertRetained();
                return Ok("Material retenido insertado correctamente.");
            }
            catch (Exception ex)
            {
                return BadRequest("Error al insertar el material retenido: " + ex.Message);
            }
        }

        // PUT: api/RetainedMaterial/{id}
        public IHttpActionResult Put(int id, [FromBody] RetainedMaterial retainedMaterial)
        {
            try
            {
                retainedMaterial.RetainID = id;
                retainedMaterial.Modificar();
                return Ok("Material retenido actualizado correctamente.");
            }
            catch (Exception ex)
            {
                return BadRequest("Error al actualizar el material retenido: " + ex.Message);
            }
        }
    }
}
