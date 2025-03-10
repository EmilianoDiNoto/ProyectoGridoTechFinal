using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Data;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using WebApplicationGridoTech.Models;
using System.Data.SqlClient;
using WebApplicationGridoTech.Helpers;
using System.IO;
using System.Web;

namespace WebApplicationGridoTech.Controllers
{
    public class ChatbotController : ApiController
    {
        private const string GeminiApiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
        private static readonly string ApiKey = System.Configuration.ConfigurationManager.AppSettings["GeminiApiKey"];

        private static readonly string GridoKnowledge = @"
# INFORMACIÓN GENERAL DEL SISTEMA
- Grido Tech Advance es un sistema de gestión y control de producción para la empresa Grido.
- El sistema permite monitorear el balance de masas, la producción por temporada, y las órdenes de trabajo.
- Los usuarios pueden visualizar indicadores clave en el dashboard: inventario valorizado, desvío de producción, stock final y pedidos pendientes.

# MENÚ Y ESTRUCTURA
- El menú principal incluye: Inicio, Declarar Producción, Órdenes de Trabajo, Materiales, Productos, Almacén y Gestión de Usuarios.
- La sección Materiales incluye submenús para: Materiales, Materiales Descartados y Materiales Retenidos.

# POLÍTICAS DE LA EMPRESA
- Priorizar la calidad del producto por encima de todo.
- Optimizar el uso de recursos y minimizar los desvíos de producción.
- Mantener niveles de stock adecuados para no interrumpir la producción.
- Todo desvío superior al 2% debe ser justificado por el supervisor de turno.
- La empresa sigue los protocolos de FSSC 22000 para seguridad alimentaria.

# PROTOCOLO DE PRODUCCIÓN
- Seguir estrictamente las órdenes de trabajo generadas por el departamento de planificación.
- Registrar todos los materiales utilizados en tiempo real.
- Reportar cualquier desviación respecto a la receta estándar.
- Verificar la calidad de los insumos antes de iniciar la producción.
- Realizar control de calidad al finalizar cada lote.
- Completar la documentación de trazabilidad para cada producción.

# PROCESOS ESPECÍFICOS
- El balance de masas compara el consumo teórico vs. real de los materiales.
- Las órdenes de trabajo se clasifican como pendientes o realizadas.
- La performance de producción se calcula como: (Producción Real / Producción Solicitada) * 100.
- El desvío de producción representa la diferencia monetaria entre el consumo teórico y real.
- El stock final muestra los materiales disponibles al finalizar cada orden de trabajo.

# PRODUCTOS PRINCIPALES
- Grido fabrica principalmente: Grido Cookie and Cream, Grido Mousse, y Grido con Relleno.
- La producción se planifica por temporadas, con mayor demanda en los meses de verano.

# RESOLUCIÓN DE PROBLEMAS COMUNES
- Si hay desvíos negativos, revisar el proceso de pesaje y consumo.
- Para fallas en el registro de datos, contactar al administrador del sistema.
- Si el sistema muestra errores de conexión, verificar la red y reiniciar el navegador.
- Para agregar nuevos usuarios, dirigirse a la sección de Gestión de Usuarios.
";

        [HttpPost]
        [Route("api/chatbot/ask")]
        public async Task<IHttpActionResult> Ask([FromBody] ChatbotRequest request)
        {
            try
            {
                if (request == null || string.IsNullOrEmpty(request.Message))
                {
                    return BadRequest("El mensaje no puede estar vacío");
                }

                // Agregar registro para depuración
                System.Diagnostics.Debug.WriteLine($"API Key: {ApiKey ?? "NULL"}");
                System.Diagnostics.Debug.WriteLine($"Mensaje recibido: {request.Message}");

                // Crear el prompt con el contexto de Grido
                string prompt = $"{GridoKnowledge}\n\nEres Robot Grido, un asistente virtual para el sistema Grido Tech Advance. " +
                    $"Tu objetivo es ayudar a los usuarios a utilizar el sistema y responder preguntas específicas sobre " +
                    $"producción, inventario, órdenes de trabajo, y políticas de la empresa.\n\n" +
                    $"Responde de manera concisa, profesional y amigable. " +
                    $"Si no sabes algo específico sobre Grido, puedes responder basándote en conocimientos generales " +
                    $"sobre sistemas de producción y gestión de inventarios.\n\n" +
                    $"Pregunta del usuario: {request.Message}";

                // Preparar la solicitud a Gemini
                var requestBody = new
                {
                    contents = new[]
                    {
                        new
                        {
                            parts = new[]
                            {
                                new { text = prompt }
                            }
                        }
                    },
                    generationConfig = new
                    {
                        temperature = 0.7,
                        maxOutputTokens = 800
                    }
                };

                using (var client = new HttpClient())
                {
                    // Configurar la solicitud
                    var url = $"{GeminiApiUrl}?key={ApiKey}";
                    var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");

                    // Agregar log para depuración
                    System.Diagnostics.Debug.WriteLine($"URL de solicitud: {url}");

                    // Enviar la solicitud a Gemini
                    var response = await client.PostAsync(url, content);

                    // Agregar log para respuesta
                    System.Diagnostics.Debug.WriteLine($"Respuesta status: {response.StatusCode}");

                    if (response.IsSuccessStatusCode)
                    {
                        var jsonResponse = await response.Content.ReadAsStringAsync();
                        System.Diagnostics.Debug.WriteLine($"Respuesta JSON: {jsonResponse.Substring(0, Math.Min(100, jsonResponse.Length))}...");
                        
                        var parsedResponse = JObject.Parse(jsonResponse);

                        // Extraer la respuesta del modelo
                        if (parsedResponse["candidates"] != null &&
                            parsedResponse["candidates"][0]["content"]["parts"][0]["text"] != null)
                        {
                            string botResponse = parsedResponse["candidates"][0]["content"]["parts"][0]["text"].ToString();

                            return Ok(new { response = botResponse });
                        }
                        else
                        {
                            return BadRequest("No se pudo obtener una respuesta válida del modelo");
                        }
                    }
                    else
                    {
                        var errorResponse = await response.Content.ReadAsStringAsync();
                        System.Diagnostics.Debug.WriteLine($"Error response: {errorResponse}");
                        return BadRequest($"Error al comunicarse con Gemini: {response.StatusCode}. Detalles: {errorResponse}");
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Excepción: {ex.Message}");
                System.Diagnostics.Debug.WriteLine($"StackTrace: {ex.StackTrace}");
                return InternalServerError(ex);
            }
        }
    }

    public class ChatbotRequest
    {
        public string Message { get; set; }
    }
}