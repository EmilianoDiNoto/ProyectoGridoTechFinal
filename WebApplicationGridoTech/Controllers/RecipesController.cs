using System.Web.Http;
using System.Collections.Generic;
using WebApplicationGridoTech.Models;
using YourNamespace;

namespace WebApplicationGridoTech.Controllers
{
    public class RecipesController : ApiController
    {
        private readonly RecipeRepository _recipeRepository;

        public RecipesController()
        {
            _recipeRepository = new RecipeRepository();
        }

        [HttpGet]
        [Route("api/Recipe/GetRecipeMaterials")]
        public IHttpActionResult GetRecipeMaterials([FromUri] string productName)
        {
            if (string.IsNullOrEmpty(productName))
            {
                return BadRequest("Product name is required.");
            }

            List<RecipeMaterial> materials = _recipeRepository.GetRecipeMaterials(productName);

            if (materials.Count == 0)
            {
                return NotFound();
            }

            return Ok(materials);
        }
    }
}
