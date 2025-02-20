using System.Threading.Tasks;
using System.Web.Http;
using WebApplicationGridoTech.Models;
using Microsoft.Extensions.Configuration;
using System.Configuration;

namespace WebApplicationGridoTech.Controllers
{
    [RoutePrefix("api/IDResponse")]
    public class IDController : ApiController
    {
        private readonly IDService _idService;

        public IDController()
        {
            string connectionString = ConfigurationManager.ConnectionStrings["YourConnectionStringName"].ConnectionString;
            _idService = new IDService(connectionString);
        }

        [HttpGet]
        [Route("GetIDs")]
        public async Task<IHttpActionResult> GetIDsAsync(string turno, string usuario, string material, string proveedor)
        {
            var result = await _idService.GetIDsAsync(turno, usuario, material, proveedor);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }
    }
}
