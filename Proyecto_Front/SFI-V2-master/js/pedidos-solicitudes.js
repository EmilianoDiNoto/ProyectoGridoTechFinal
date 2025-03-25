// Función para actualizar el contador de pedidos pendientes
async function actualizarContadorPedidosPendientes() {
    try {
        // Realizar la petición a la API
        const response = await fetch('http://localhost:63152/api/SolicitudMaterialRepository/GetAllSolicitudes');
        
        // Verificar si la respuesta es correcta
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status}`);
        }
        
        // Convertir la respuesta a JSON
        const solicitudes = await response.json();
        
        // Filtrar solo las solicitudes con estado "Solicitado"
        const pedidosPendientes = solicitudes.filter(solicitud => 
            solicitud.ESTADO && solicitud.ESTADO.trim().toUpperCase() === "SOLICITADO"
        );
        
        // Obtener la cantidad de pedidos pendientes
        const cantidadPendientes = pedidosPendientes.length;
        
        // Actualizar el contador en la tarjeta
        const contadorElement = document.querySelector('.counter-card:nth-child(4) .counter-value');
        if (contadorElement) {
            contadorElement.textContent = cantidadPendientes;
            
            // Añadir clase para la animación (opcional)
            contadorElement.classList.add('counter-updated');
            
            // Cambiar el color según la cantidad de pedidos
            if (cantidadPendientes > 5) {
                contadorElement.className = 'counter-value text-danger';
            } else if (cantidadPendientes > 0) {
                contadorElement.className = 'counter-value text-warning';
            } else {
                contadorElement.className = 'counter-value text-success';
            }
        }
        
        // Devolver la cantidad para posible uso en otras funciones
        return cantidadPendientes;
        
    } catch (error) {
        console.error('Error al actualizar pedidos pendientes:', error);
        
        // Mostrar mensaje de error en el contador
        const contadorElement = document.querySelector('.counter-card:nth-child(4) .counter-value');
        if (contadorElement) {
            contadorElement.textContent = 'Error';
            contadorElement.className = 'counter-value text-danger';
        }
        
        return 0;
    }
}

// Estilos para la animación de actualización (opcional)
function agregarEstilosAnimacion() {
    if (!document.getElementById('counter-animation-styles')) {
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
        `;
        document.head.appendChild(estilos);
    }
}

// Función para hacer la tarjeta clickeable (opcional)
function hacerTarjetaClickeable() {
    const tarjeta = document.querySelector('.counter-card:nth-child(4)');
    if (tarjeta) {
        tarjeta.style.cursor = 'pointer';
        tarjeta.classList.add('counter-clickable');
        
        // Añadir evento de clic para mostrar detalles
        tarjeta.addEventListener('click', async function() {
            try {
                // Obtener los datos más recientes
                const response = await fetch('http://localhost:63152/api/SolicitudMaterialRepository/GetAllSolicitudes');
                const solicitudes = await response.json();
                
                // Filtrar solo las solicitudes pendientes
                const pedidosPendientes = solicitudes.filter(solicitud => 
                    solicitud.ESTADO && solicitud.ESTADO.trim().toUpperCase() === "SOLICITADO"
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
    }
}

// Función para mostrar los detalles de los pedidos pendientes
function mostrarDetallesPedidosPendientes(pedidos) {
    // Crear una tabla HTML con los detalles de los pedidos
    let tablaPedidos = `
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Material</th>
                        <th>Cantidad</th>
                        <th>Fecha</th>
                        <th>Solicitante</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Añadir cada pedido a la tabla
    pedidos.forEach(pedido => {
        // Formatear la fecha si existe
        const fecha = pedido.FECHA ? new Date(pedido.FECHA).toLocaleDateString() : 'N/A';
        
        tablaPedidos += `
            <tr>
                <td>${pedido.ID || ''}</td>
                <td>${pedido.MATERIAL || ''}</td>
                <td>${pedido.CANTIDAD || '0'} ${pedido.UNIDAD || ''}</td>
                <td>${fecha}</td>
                <td>${pedido.SOLICITANTE || ''}</td>
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

// Función para inicializar todo
function inicializarContadorPedidos() {
    // Añadir estilos para la animación
    agregarEstilosAnimacion();
    
    // Hacer la tarjeta clickeable
    hacerTarjetaClickeable();
    
    // Actualizar el contador inmediatamente
    actualizarContadorPedidosPendientes();
    
    // Configurar actualización periódica cada 5 minutos (opcional)
    setInterval(actualizarContadorPedidosPendientes, 5 * 60 * 1000);
}

// Ejecutar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el contador de pedidos pendientes
    inicializarContadorPedidos();
    
    // Si ya existe una función para actualizar contadores, añadir a ella
    if (typeof window.actualizarContadores === 'function') {
        const originalActualizarContadores = window.actualizarContadores;
        window.actualizarContadores = async function() {
            await originalActualizarContadores();
            await actualizarContadorPedidosPendientes();
        };
    }
});