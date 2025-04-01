/**
 * welcomeSection.js
 * Funcionalidades interactivas para la sección de bienvenida renovada
 */

// Ejecutar cuando el documento esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initWelcomeSection();
});

/**
 * Inicializa todas las funcionalidades de la sección de bienvenida
 */
function initWelcomeSection() {
    // Aplicar animaciones iniciales
    animateWelcomeElements();
    
    // Configurar interactividad de los elementos de productos
    setupProductInteractions();
    
    // Iniciar actualizaciones periódicas de estadísticas
    setupPeriodicUpdates();
    
    // Configurar tooltips y elementos interactivos
    setupTooltips();
}

/**
 * Aplica animaciones iniciales a los elementos de la sección de bienvenida
 */
function animateWelcomeElements() {
    // Seleccionar todos los elementos animables
    const animatedElements = document.querySelectorAll(
        '.welcome-section .welcome-header, ' + 
        '.welcome-section .stat-item, ' + 
        '.welcome-section .ice-cream-item'
    );
    
    // Aplicar la animación de forma secuencial
    animatedElements.forEach((element, index) => {
        // Retrasar cada elemento para crear efecto en cascada
        setTimeout(() => {
            element.classList.add('fade-in-element');
        }, 100 * index);
    });
}

/**
 * Configura las interacciones para las tarjetas de productos
 */
function setupProductInteractions() {
    // Seleccionar todas las tarjetas de productos
    const productCards = document.querySelectorAll('.welcome-section .ice-cream-item');
    
    productCards.forEach(card => {
        // Efecto de hover mejorado
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover-active');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover-active');
        });
        
        // Efecto parallax para las imágenes
        const image = card.querySelector('.product-image img');
        
        if (image) {
            card.addEventListener('mousemove', function(e) {
                if (!window.matchMedia('(max-width: 768px)').matches) {
                    // Solo aplicar en dispositivos no táctiles
                    const rect = this.getBoundingClientRect();
                    
                    // Calcular posición relativa del mouse dentro de la tarjeta (valores entre -1 y 1)
                    const xPos = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
                    const yPos = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
                    
                    // Aplicar transformación sutil
                    image.style.transform = `translate(${xPos * 5}px, ${yPos * 5}px) scale(1.05)`;
                }
            });
            
            // Restablecer la posición al salir
            card.addEventListener('mouseleave', function() {
                image.style.transform = '';
            });
        }
        
        // Configurar evento de clic para mostrar más detalles
        card.addEventListener('click', function() {
            showProductDetails(this);
        });
    });
}

/**
 * Muestra los detalles del producto usando SweetAlert2
 * @param {HTMLElement} productElement - Elemento del producto seleccionado
 */
function showProductDetails(productElement) {
    const productName = productElement.getAttribute('data-product');
    const productImage = productElement.querySelector('img').src;
    
    // Datos simulados para cada producto
    const productData = {
        'PACK TORTA COOKIES AND CREAM - GRIDO': {
            title: 'Torta Cookies and Cream',
            description: 'Deliciosa torta helada con galletas oreo y crema americana.',
            estado: 'En producción',
            ot: '4',
            producido: '852',
            demanda: '1446',
            eficiencia: '58.9'
        },
        'PACK TORTA COOKIES AND MOUSSE - GRIDO': {
            title: 'Torta Cookies and Mousse',
            description: 'Exquisita combinación de galletas y mousse para un sabor incomparable.',
            estado: 'Planificada',
            ot: '6',
            producido: '0',
            demanda: '1200',
            eficiencia: '0'
        },
        'PACK TORTA GRIDO CON RELLENO - GRIDO': {
            title: 'Torta Grido con Relleno',
            description: 'La clásica torta Grido con relleno especial que todos adoran.',
            estado: 'Completada',
            ot: '3',
            producido: '1350',
            demanda: '1350',
            eficiencia: '100'
        }
    };
    
    // Obtener datos del producto actual (o usar datos por defecto)
    const data = productData[productName] || {
        title: 'Producto',
        description: 'Sin descripción disponible',
        estado: 'Desconocido',
        ot: 'N/A',
        producido: '0',
        demanda: '0',
        eficiencia: '0'
    };
    
    // Determinar clase y color según el estado
    let statusClass, statusColor;
    
    switch (data.estado.toLowerCase()) {
        case 'en producción':
            statusClass = 'bg-primary';
            statusColor = '#0c169f';
            break;
        case 'planificada':
            statusClass = 'bg-warning';
            statusColor = '#ffc107';
            break;
        case 'completada':
            statusClass = 'bg-success';
            statusColor = '#28a745';
            break;
        default:
            statusClass = 'bg-secondary';
            statusColor = '#6c757d';
    }
    
    // Calcular porcentaje para la barra de progreso
    const progressPercentage = Math.min(100, Math.max(0, parseFloat(data.eficiencia)));
    
    // Crear contenido HTML para el modal
    const detailContent = `
        <div class="product-detail-container">
            <div class="row">
                <div class="col-md-5">
                    <div class="product-detail-image">
                        <img src="${productImage}" alt="${data.title}" class="img-fluid rounded">
                        <span class="product-status ${statusClass}">${data.estado}</span>
                    </div>
                </div>
                <div class="col-md-7 text-start">
                    <div class="product-detail-info">
                        <h4>${data.title}</h4>
                        <p class="product-description">${data.description}</p>
                        
                        <div class="production-data">
                            <div class="data-row">
                                <span class="data-label">Orden de Trabajo:</span>
                                <span class="data-value">OT #${data.ot}</span>
                            </div>
                            <div class="data-row">
                                <span class="data-label">Producido:</span>
                                <span class="data-value">${data.producido} unidades</span>
                            </div>
                            <div class="data-row">
                                <span class="data-label">Demanda:</span>
                                <span class="data-value">${data.demanda} unidades</span>
                            </div>
                            
                            <div class="progress-container mt-3">
                                <div class="progress-label d-flex justify-content-between">
                                    <span>Avance de producción</span>
                                    <span>${progressPercentage}%</span>
                                </div>
                                <div class="progress">
                                    <div class="progress-bar" role="progressbar" 
                                        style="width: ${progressPercentage}%; background-color: ${statusColor}" 
                                        aria-valuenow="${progressPercentage}" aria-valuemin="0" aria-valuemax="100">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Mostrar el modal con SweetAlert2 (si está disponible)
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            html: detailContent,
            showConfirmButton: false,
            showCloseButton: true,
            customClass: {
                container: 'product-detail-modal-container',
                popup: 'product-detail-modal'
            },
            width: '700px',
            padding: '1.5rem',
            backdrop: 'rgba(0,0,0,0.4)'
        });
    } else {
        // Alternativa si SweetAlert2 no está disponible
        alert(`Detalles de producto: ${data.title}\nEstado: ${data.estado}\nOT: ${data.ot}\nEficiencia: ${data.eficiencia}%`);
    }
}

/**
 * Configura las actualizaciones periódicas de estadísticas
 */
function setupPeriodicUpdates() {
    // Actualizar estadísticas cada cierto tiempo para dar sensación de datos en vivo
    setInterval(() => {
        updateEfficiencyStats();
    }, 8000);
    
    // Actualizar otra estadística con diferente intervalo
    setInterval(() => {
        updateOrderStats();
    }, 12000);
}

/**
 * Actualiza la estadística de eficiencia con pequeñas variaciones aleatorias
 */
function updateEfficiencyStats() {
    const efficiencyElement = document.querySelector('.welcome-section .stat-value');
    
    if (efficiencyElement) {
        // Obtener el valor actual (quitar el símbolo % si existe)
        const currentValue = parseFloat(efficiencyElement.textContent.replace('%', ''));
        
        // Generar una pequeña variación aleatoria (±0.3%)
        const variation = (Math.random() * 0.6) - 0.3;
        
        // Calcular el nuevo valor con límites
        const newValue = Math.min(Math.max(currentValue + variation, 90), 98).toFixed(1);
        
        // Actualizar el valor mostrado
        efficiencyElement.textContent = newValue + '%';
        
        // Añadir clase para animación de actualización
        efficiencyElement.classList.add('value-updating');
        
        // Actualizar la barra de progreso si existe
        const progressBar = document.querySelector('.welcome-section .progress-bar');
        if (progressBar) {
            progressBar.style.width = newValue + '%';
            progressBar.setAttribute('aria-valuenow', newValue);
        }
        
        // Quitar la clase de animación después de completarse
        setTimeout(() => {
            efficiencyElement.classList.remove('value-updating');
        }, 1000);
    }
}

/**
 * Actualiza la estadística de órdenes completadas
 */
function updateOrderStats() {
    const ordersElement = document.querySelector('.welcome-section .stat-value:nth-of-type(2)');
    
    if (ordersElement) {
        // Obtener el texto actual
        const currentText = ordersElement.textContent;
        
        // Extraer solo el número
        const match = currentText.match(/(\d+)/);
        
        if (match && match[1]) {
            // Obtener el número actual
            const currentValue = parseInt(match[1], 10);
            
            // Determinar si aumentamos o no (70% de probabilidad de aumento)
            if (Math.random() < 0.7) {
                // Aumentar en 1
                const newValue = currentValue + 1;
                
                // Actualizar el texto manteniendo el formato original
                ordersElement.textContent = newValue + ' <small>este mes</small>';
                
                // Añadir HTML para el pequeño indicador
                const trendElement = ordersElement.parentNode.querySelector('.stat-trend');
                
                if (trendElement) {
                    // Actualizar el indicador de tendencia
                    const percentChange = ((newValue / currentValue - 1) * 100).toFixed(0);
                    trendElement.innerHTML = `<i class="zmdi zmdi-trending-up"></i> +${percentChange}% vs. mes anterior`;
                    
                    // Animar la actualización
                    trendElement.classList.add('value-updating');
                    
                    // Quitar la animación después de completarse
                    setTimeout(() => {
                        trendElement.classList.remove('value-updating');
                    }, 1000);
                }
            }
        }
    }
}

/**
 * Configura tooltips y otros elementos interactivos
 */
function setupTooltips() {
    // Buscar todos los elementos que deberían tener tooltips
    const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    
    // Inicializar tooltips de Bootstrap si están disponibles
    if (typeof bootstrap !== 'undefined' && tooltipElements.length > 0) {
        tooltipElements.forEach(el => {
            new bootstrap.Tooltip(el);
        });
    }
}

// Agregar estilos necesarios para las animaciones y el modal
document.addEventListener('DOMContentLoaded', function() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Animaciones para elementos de la sección de bienvenida */
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes valueUpdating {
            0% { color: inherit; }
            50% { color: #117daf; }
            100% { color: inherit; }
        }
        
        .fade-in-element {
            animation: fadeInUp 0.5s ease forwards;
        }
        
        .value-updating {
            animation: valueUpdating 1s ease;
        }
        
        /* Estilos para el modal de detalles de producto */
        .product-detail-modal {
            border-radius: 15px;
            overflow: hidden;
        }
        
        .product-detail-container {
            padding: 10px;
        }
        
        .product-detail-image {
            position: relative;
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 15px;
        }
        
        .product-detail-image img {
            width: 100%;
            border-radius: 10px;
            transition: transform 0.3s ease;
        }
        
        .product-detail-modal:hover .product-detail-image img {
            transform: scale(1.05);
        }
        
        .product-status {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            color: white;
        }
        
        .product-detail-info h4 {
            font-size: 1.4rem;
            margin-bottom: 10px;
            color: #0e2238;
        }
        
        .product-description {
            font-size: 0.95rem;
            color: #6c757d;
            margin-bottom: 20px;
        }
        
        .production-data {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
        }
        
        .data-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 0.9rem;
        }
        
        .data-label {
            font-weight: 600;
            color: #6c757d;
        }
        
        .data-value {
            font-weight: 600;
            color: #0e2238;
        }
        
        .progress-container {
            margin-top: 15px;
        }
        
        .progress-label {
            font-size: 0.9rem;
            margin-bottom: 5px;
            font-weight: 600;
        }
        
        .progress {
            height: 10px;
            border-radius: 5px;
        }
        
        /* Responsive adjustments */
        @media (max-width: 767.98px) {
            .product-detail-image {
                margin-bottom: 20px;
            }
        }
    `;
    
    document.head.appendChild(styleElement);
});