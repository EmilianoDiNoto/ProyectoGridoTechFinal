using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApplication.ApiAdo.Models;
using Newtonsoft.Json;

namespace WebApplication.ApiAdo.Controllers
{
    public class DiscardedMaterialController : ApiController
    {
        // GET: api/DiscardedMaterial
        public List<DiscardedMaterial> Get()
        {
            DiscardedMaterial oDiscardedMaterial = new DiscardedMaterial();
            var dt = oDiscardedMaterial.SelectAll();

            var ListaJsom = JsonConvert.SerializeObject(dt);
            var Lista = JsonConvert.DeserializeObject<List<DiscardedMaterial>>(ListaJsom);

            return Lista;
        }

        // GET: api/DiscardedMaterial/{id}
        public IHttpActionResult Get(int id)
        {
            DiscardedMaterial oDiscardedMaterial = new DiscardedMaterial();
            var dt = oDiscardedMaterial.SelectById(id);

            if (dt.Rows.Count == 0)
            {
                return NotFound();
            }

            var discardedMaterial = new DiscardedMaterial
            {
                DiscardID = Convert.ToInt32(dt.Rows[0]["DiscardID"]),
                MaterialID = Convert.ToInt32(dt.Rows[0]["MaterialID"]),
                MaterialName = Convert.ToString(dt.Rows[0]["MaterialName"]),
                Reason = Convert.ToString(dt.Rows[0]["Reason"]),
                DateDiscarded = Convert.ToDateTime(dt.Rows[0]["DateDiscarded"])
            };

            return Ok(discardedMaterial);
        }

        // POST: api/DiscardedMaterial
        public IHttpActionResult Post([FromBody] DiscardedMaterial discardedMaterial)
        {
            try
            {
                discardedMaterial.InsertDiscarded();
                return Ok("Material Descartado insertado correctamente.");
            }
            catch (Exception ex)
            {
                return BadRequest("Error al insertar el material descartado: " + ex.Message);
            }
        }

        // PUT: api/DiscardedMaterial/{id}
        public IHttpActionResult Put(int id, [FromBody] DiscardedMaterial discardedMaterial)
        {
            try
            {
                discardedMaterial.DiscardID = id;
                discardedMaterial.Modificar();
                return Ok("Material descartado actualizado correctamente.");
            }
            catch (Exception ex)
            {
                return BadRequest("Error al actualizar el material descartado: " + ex.Message);
            }
        }
    }
}
