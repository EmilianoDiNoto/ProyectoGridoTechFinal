
// ============== FUNCIONALIDAD 2: CONTADOR DE PEDIDOS PENDIENTES Y TARJETA CLICKEABLE ==============

// Función para actualizar el contador de pedidos pendientes
async function actualizarContadorPedidosPendientes() {
    try {
        console.log("Iniciando actualización de pedidos pendientes...");
        
        // Realizar la petición a la API
        const response = await fetch('http://localhost:63152/api/SolicitudMaterialRepository/GetAllSolicitudes');
        
        // Verificar si la respuesta es correcta
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status}`);
        }
        
        // Convertir la respuesta a JSON
        const solicitudes = await response.json();
        console.log("Solicitudes recibidas:", solicitudes.length);
        
        // Filtrar solo las solicitudes con estado "SOLICITADO"
        const pedidosPendientes = solicitudes.filter(solicitud => 
            solicitud.Estado && solicitud.Estado.trim().toUpperCase() === "SOLICITADO"
        );
        
        console.log("Pedidos pendientes filtrados:", pedidosPendientes.length);
        
        // Buscar la tarjeta de "PEDIDOS PENDIENTES" específicamente
        const tarjetasPedidos = document.querySelectorAll('.counter-card');
        let contadorElement = null;
        
        tarjetasPedidos.forEach(tarjeta => {
            const titulo = tarjeta.querySelector('h3');
            if (titulo && titulo.textContent.trim() === "PEDIDOS PENDIENTES") {
                contadorElement = tarjeta.querySelector('.counter-value');
            }
        });
        
        if (contadorElement) {
            // Actualizar el texto del contador
            contadorElement.textContent = pedidosPendientes.length;
            console.log("Contador actualizado:", pedidosPendientes.length);
            
            // Cambiar el color según la cantidad de pedidos
            if (pedidosPendientes.length > 5) {
                contadorElement.className = 'counter-value text-danger';
            } else if (pedidosPendientes.length > 0) {
                contadorElement.className = 'counter-value text-warning';
            } else {
                contadorElement.className = 'counter-value text-success';
            }
            
            // Añadir clase para la animación
            contadorElement.classList.add('counter-updated');
            setTimeout(() => {
                contadorElement.classList.remove('counter-updated');
            }, 500);
        } else {
            console.error("No se encontró el contador de pedidos pendientes en el DOM");
        }
        
        return pedidosPendientes.length;
        
    } catch (error) {
        console.error('Error al actualizar pedidos pendientes:', error);
        
        // Buscar el contador para mostrar el error
        const tarjetasPedidos = document.querySelectorAll('.counter-card');
        let contadorElement = null;
        
        tarjetasPedidos.forEach(tarjeta => {
            const titulo = tarjeta.querySelector('h3');
            if (titulo && titulo.textContent.trim() === "PEDIDOS PENDIENTES") {
                contadorElement = tarjeta.querySelector('.counter-value');
            }
        });
        
        if (contadorElement) {
            contadorElement.textContent = 'Error';
            contadorElement.className = 'counter-value text-danger';
        }
        
        return 0;
    }
}

// Función para hacer que la tarjeta de pedidos sea clickeable
function hacerTarjetaPedidosClickeable() {
    console.log("Configurando tarjeta pedidos pendientes como clickeable...");
    
    // Encontrar la tarjeta de pedidos pendientes
    const tarjetasPedidos = document.querySelectorAll('.counter-card');
    let tarjetaPedidos = null;
    
    tarjetasPedidos.forEach(tarjeta => {
        const titulo = tarjeta.querySelector('h3');
        if (titulo && titulo.textContent.trim() === "PEDIDOS PENDIENTES") {
            tarjetaPedidos = tarjeta;
            console.log("Tarjeta de pedidos pendientes encontrada");
        }
    });
    
    if (tarjetaPedidos) {
        // Añadir estilos y clase para indicar que es clickeable
        tarjetaPedidos.style.cursor = 'pointer';
        tarjetaPedidos.classList.add('counter-clickable');
        
        // Añadir evento de clic para mostrar detalles
        tarjetaPedidos.addEventListener('click', async function() {
            console.log("Tarjeta de pedidos pendientes clickeada");
            try {
                // Obtener los datos más recientes
                const response = await fetch('http://localhost:63152/api/SolicitudMaterialRepository/GetAllSolicitudes');
                if (!response.ok) {
                    throw new Error(`Error en la petición: ${response.status}`);
                }
                
                const solicitudes = await response.json();
                
                // Filtrar solo las solicitudes pendientes
                const pedidosPendientes = solicitudes.filter(solicitud => 
                    solicitud.Estado && solicitud.Estado.trim().toUpperCase() === "SOLICITADO"
                );
                
                // Si hay pedidos pendientes, mostrar detalles en una ventana modal
                if (pedidosPendientes.length > 0) {
                    mostrarDetallesPedidosPendientes(pedidosPendientes);
                } else {
                    // Si no hay pedidos pendientes, mostrar un mensaje
                    Swal.fire({
                        title: 'Pedidos Pendientes',
                        text: 'No hay pedidos pendientes en este momento.',
                        icon: 'info',
                        confirmButtonColor: '#0e2238'
                    });
                }
            } catch (error) {
                console.error('Error al obtener detalles de pedidos:', error);
                
                // Mostrar mensaje de error
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudieron cargar los detalles de los pedidos pendientes.',
                    icon: 'error',
                    confirmButtonColor: '#0e2238'
                });
            }
        });
    } else {
        console.error("No se encontró la tarjeta de pedidos pendientes para hacerla clickeable");
    }
}

// Función para mostrar los detalles de los pedidos pendientes
function mostrarDetallesPedidosPendientes(pedidos) {
    console.log("Mostrando detalles de pedidos pendientes:", pedidos.length);
    
    // Crear una tabla HTML con los detalles de los pedidos
    let tablaPedidos = `
        <div class="table-responsive" style="max-height: 70vh; overflow-y: auto;">
            <table class="table table-striped table-hover">
                <thead class="thead-dark" style="background-color: #0e2238; color: white;">
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Usuario</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Añadir cada pedido a la tabla
    pedidos.forEach(pedido => {
        // Formatear la fecha si existe
        const fecha = pedido.FechaSolicitud ? new Date(pedido.FechaSolicitud).toLocaleDateString() : 'N/A';
        
        tablaPedidos += `
            <tr>
                <td>${pedido.SolicitudID || ''}</td>
                <td>${fecha}</td>
                <td>${pedido.Estado || ''}</td>
                <td>${pedido.Usuario || 'Sin asignar'}</td>
            </tr>
        `;
    });
    
    // Cerrar la tabla
    tablaPedidos += `
                </tbody>
            </table>
        </div>
    `;
    
    // Mostrar la tabla en un modal de SweetAlert2
    Swal.fire({
        title: 'Pedidos Pendientes',
        html: tablaPedidos,
        width: '80%',
        showCloseButton: true,
        showConfirmButton: false,
        focusConfirm: false
    });
}

// Añadir estilos para la animación
function agregarEstilosAnimacion() {
    if (!document.getElementById('counter-animation-styles')) {
        console.log("Agregando estilos de animación para contadores");
        
        const estilos = document.createElement('style');
        estilos.id = 'counter-animation-styles';
        estilos.textContent = `
            @keyframes counterUpdate {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
            
            .counter-updated {
                animation: counterUpdate 0.5s ease;
            }
            
            .counter-clickable {
                transition: all 0.3s ease;
                position: relative;
            }
            
            .counter-clickable:hover {
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                transform: translateY(-3px);
            }
            
            .counter-clickable:hover::after {
                content: "Consultar detalle";
                position: absolute;
                bottom: -20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0,0,0,0.7);
                color: white;
                padding: 3px 8px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                z-index: 100;
            }
        `;
        document.head.appendChild(estilos);
    }
}

// Función para inicializar la funcionalidad de pedidos pendientes
function inicializarPedidosPendientes() {
    console.log("Inicializando funcionalidad de pedidos pendientes");
    
    // Añadir estilos de animación
    agregarEstilosAnimacion();
    
    // Hacer clickeable la tarjeta de pedidos
    hacerTarjetaPedidosClickeable();
    
    // Actualizar el contador de pedidos pendientes
    actualizarContadorPedidosPendientes();
    
    // Actualizar el contador cada 5 minutos
    setInterval(actualizarContadorPedidosPendientes, 5 * 60 * 1000);
    
    console.log("Funcionalidad de pedidos pendientes inicializada correctamente");
}

// Ejecutar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM cargado, inicializando funcionalidades...");
    
    // Inicializar pedidos pendientes
    inicializarPedidosPendientes();
    
    // Integrar con la función existente de actualización de contadores, si existe
    if (typeof window.actualizarContadores === 'function') {
        console.log("Integrando con función existente actualizarContadores");
        
        const originalActualizarContadores = window.actualizarContadores;
        window.actualizarContadores = async function() {
            await originalActualizarContadores();
            await actualizarContadorPedidosPendientes();
        };
    }
    
    console.log("Inicialización completa");
});