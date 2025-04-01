/**
 * grido-dashboard.js
 * Funcionalidades específicas para el dashboard modernizado de Grido Tech Advance
 * Se enfoca solo en la página home.html sin afectar otros archivos
 */

// Ejecutar cuando el documento está listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la interfaz del dashboard
    initDashboardUI();
    
    // Configurar interactividad para la sección de bienvenida
    setupWelcomeSection();
    
    // Configurar eventos para exportar gráficos
    setupExportButtons();
    
    // Conectar con los contadores existentes
    enhanceCounters();
});

/**
 * Inicializa la interfaz visual del dashboard
 */
function initDashboardUI() {
    // Aplicar el tema de fondo azul al contenedor principal
    const mainContainer = document.querySelector('.main');
    if (mainContainer) {
        mainContainer.style.backgroundColor = '#f3f6ff';
        mainContainer.style.padding = '0 0 30px 0';
    }
    
    // Mejorar estilos de las tablas de datos
    enhanceDataTables();
    
    // Mejorar estilos de los modales
    enhanceModals();
}

/**
 * Configura la interactividad para la sección de bienvenida
 */
function setupWelcomeSection() {
    // Configurar animaciones para la sección de bienvenida
    animateWelcomeSection();
    
    // Configurar interactividad para las tarjetas de productos
    setupProductCards();
    
    // Añadir efecto parallax sutil a las imágenes
    setupParallaxEffect();
}

/**
 * Aplica animaciones a los elementos de la sección de bienvenida
 */
function animateWelcomeSection() {
    // Seleccionar elementos de la sección de bienvenida
    const welcomeElements = [
        document.querySelector('.welcome-header'),
        ...document.querySelectorAll('.stat-item'),
        ...document.querySelectorAll('.ice-cream-item')
    ].filter(el => el); // Filtrar elementos nulos
    
    // Aplicar animación con delays secuenciales
    welcomeElements.forEach((element, index) => {
        // Agregar clase para opacidad inicial
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        // Aplicar delay secuencial
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 * index);
    });
}

/**
 * Configura la interactividad para las tarjetas de productos
 */
function setupProductCards() {
    const productCards = document.querySelectorAll('.ice-cream-item');
    
    productCards.forEach(card => {
        // Añadir evento de clic para mostrar información detallada
        card.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            showProductDetails(productName);
        });
    });
}

/**
 * Muestra detalles del producto usando SweetAlert2
 * @param {string} productName - Nombre del producto
 */
function showProductDetails(productName) {
    // Verificar que SweetAlert2 esté disponible
    if (typeof Swal === 'undefined') {
        console.warn('SweetAlert2 no disponible para mostrar detalles del producto');
        return;
    }
    
    // Obtener la imagen y detalles específicos del producto
    const productElement = document.querySelector(`[data-product="${productName}"]`);
    const productImage = productElement ? productElement.querySelector('img').src : '';
    
    // Datos simulados para cada producto
    const productData = {
        'PACK TORTA COOKIES AND CREAM - GRIDO': {
            title: 'Torta Cookies & Cream',
            description: 'Deliciosa torta helada con galletas oreo y crema americana.',
            estado: 'En producción',
            ot: '4',
            producido: '852',
            demanda: '1446',
            eficiencia: '58.9'
        },
        'PACK TORTA COOKIES AND MOUSSE - GRIDO': {
            title: 'Torta Cookies & Mousse',
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
    
    // Obtener datos del producto seleccionado (o usar datos por defecto)
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
    let statusColor;
    switch (data.estado.toLowerCase()) {
        case 'en producción':
            statusColor = '#28a745';
            break;
        case 'planificada':
            statusColor = '#ffc107';
            break;
        case 'completada':
            statusColor = '#17a2b8';
            break;
        default:
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
                        <div class="product-status-badge" style="background-color: ${statusColor}">
                            ${data.estado}
                        </div>
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
                                <div class="progress mt-1" style="height: 10px;">
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
    
    // Mostrar el modal con SweetAlert2
    Swal.fire({
        html: detailContent,
        showConfirmButton: false,
        showCloseButton: true,
        width: '700px',
        padding: '1.5rem',
        customClass: {
            container: 'product-detail-modal-container',
            popup: 'product-detail-modal'
        }
    });
    
    // Añadir estilos específicos para el modal
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .product-detail-modal {
            border-radius: 15px;
            overflow: hidden;
        }
        
        .product-detail-image {
            position: relative;
            margin-bottom: 15px;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }
        
        .product-detail-image img {
            width: 100%;
            border-radius: 10px;
        }
        
        .product-status-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 5px 10px;
            border-radius: 20px;
            color: white;
            font-size: 12px;
            font-weight: 600;
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
    `;
    
    // Añadir estilos solo si no existen ya
    if (!document.getElementById('product-detail-styles')) {
        styleElement.id = 'product-detail-styles';
        document.head.appendChild(styleElement);
    }
}

/**
 * Añade efecto parallax sutil a las imágenes de productos
 */
function setupParallaxEffect() {
    const productCards = document.querySelectorAll('.ice-cream-item');
    
    productCards.forEach(card => {
        const image = card.querySelector('.product-image img');
        
        if (image) {
            card.addEventListener('mousemove', function(e) {
                // Solo aplicar en dispositivos no táctiles
                if (window.matchMedia('(min-width: 992px)').matches) {
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
    });
}

/**
 * Configura botones para exportar gráficos
 */
function setupExportButtons() {
    // Configurar botón de exportación para el gráfico de balance
    const exportButton = document.getElementById('export-balance-chart-btn');
    
    if (exportButton) {
        exportButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtener el gráfico
            const chart = Highcharts.charts.find(chart => 
                chart && chart.renderTo.id === 'balance-highchart-container'
            );
            
            if (chart) {
                // Crear menú de opciones de exportación
                const exportMenu = document.createElement('div');
                exportMenu.className = 'export-menu';
                exportMenu.innerHTML = `
                    <div class="export-menu-item" data-format="png">PNG</div>
                    <div class="export-menu-item" data-format="jpeg">JPEG</div>
                    <div class="export-menu-item" data-format="pdf">PDF</div>
                    <div class="export-menu-item" data-format="svg">SVG</div>
                    <div class="export-menu-item" data-format="csv">CSV</div>
                    <div class="export-menu-item" data-format="print">Imprimir</div>
                `;
                
                // Posicionar el menú
                const buttonRect = this.getBoundingClientRect();
                exportMenu.style.position = 'absolute';
                exportMenu.style.top = (buttonRect.bottom + 5) + 'px';
                exportMenu.style.right = (window.innerWidth - buttonRect.right) + 'px';
                exportMenu.style.backgroundColor = 'white';
                exportMenu.style.borderRadius = '8px';
                exportMenu.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
                exportMenu.style.padding = '8px 0';
                exportMenu.style.zIndex = '9999';
                
                // Estilos para los elementos del menú
                const styleElement = document.createElement('style');
                styleElement.textContent = `
                    .export-menu-item {
                        padding: 8px 15px;
                        cursor: pointer;
                        transition: background-color 0.2s ease;
                        font-size: 14px;
                    }
                    
                    .export-menu-item:hover {
                        background-color: #f0f0f0;
                    }
                `;
                document.head.appendChild(styleElement);
                
                // Añadir al DOM
                document.body.appendChild(exportMenu);
                
                // Manejar clics en opciones
                exportMenu.querySelectorAll('.export-menu-item').forEach(item => {
                    item.addEventListener('click', function() {
                        const format = this.getAttribute('data-format');
                        
                        switch (format) {
                            case 'png':
                                chart.exportChart({ type: 'image/png' });
                                break;
                            case 'jpeg':
                                chart.exportChart({ type: 'image/jpeg' });
                                break;
                            case 'pdf':
                                chart.exportChart({ type: 'application/pdf' });
                                break;
                            case 'svg':
                                chart.exportChart({ type: 'image/svg+xml' });
                                break;
                            case 'csv':
                                chart.downloadCSV();
                                break;
                            case 'print':
                                chart.print();
                                break;
                        }
                        
                        // Cerrar menú
                        exportMenu.remove();
                    });
                });
                
                // Cerrar el menú al hacer clic fuera
                document.addEventListener('click', function closeMenu(e) {
                    if (!exportMenu.contains(e.target) && e.target !== exportButton) {
                        exportMenu.remove();
                        document.removeEventListener('click', closeMenu);
                    }
                });
            }
        });
    }
}

/**
 * Mejora visual de tablas DataTables
 */
function enhanceDataTables() {
    // Agregar estilos específicos para DataTables en esta página
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Estilos modernos para tablas DataTables */
        .dataTables_wrapper .dataTable {
            border-collapse: separate;
            border-spacing: 0;
            width: 100%;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .dataTables_wrapper .dataTable thead th {
            background-color: #0e2238;
            color: white;
            font-weight: 600;
            padding: 12px 10px;
            border: none;
        }
        
        .dataTables_wrapper .dataTable tbody tr td {
            padding: 10px;
            border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        
        .dataTables_wrapper .dataTable tbody tr:last-child td {
            border-bottom: none;
        }
        
        .dataTables_wrapper .dataTable tbody tr:hover {
            background-color: rgba(14, 34, 56, 0.05);
        }
        
        /* Mejorar controles de DataTables */
        .dataTables_wrapper .dataTables_length select,
        .dataTables_wrapper .dataTables_filter input {
            border: 1px solid rgba(0,0,0,0.1);
            border-radius: 6px;
            padding: 6px 10px;
            margin-left: 6px;
        }
        
        .dataTables_wrapper .dataTables_paginate .paginate_button {
            border-radius: 6px;
            padding: 6px 12px;
            border: 1px solid rgba(0,0,0,0.1);
        }
        
        .dataTables_wrapper .dataTables_paginate .paginate_button.current {
            background: #0e2238;
            color: white !important;
            border-color: #0e2238;
        }
        
        .dataTables_wrapper .dataTables_paginate .paginate_button:hover {
            background: #1a3b5d;
            color: white !important;
            border-color: #1a3b5d;
        }
        
        /* Botones de exportación */
        .dt-buttons .dt-button {
            background-color: #f8f9fa;
            border: 1px solid rgba(0,0,0,0.1);
            border-radius: 6px;
            padding: 6px 12px;
            margin-right: 5px;
            transition: all 0.3s ease;
        }
        
        .dt-buttons .dt-button:hover {
            background-color: #0e2238;
            color: white;
        }
    `;
    
    // Añadir estilos
    document.head.appendChild(styleElement);
}

/**
 * Mejora visual de modales
 */
function enhanceModals() {
    // Agregar estilos específicos para modales en esta página
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Estilos modernos para modales */
        .modal-content {
            border-radius: 15px;
            border: none;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        
        .modal-header {
            background-color: #0e2238;
            color: white;
            border-bottom: none;
            padding: 15px 20px;
        }
        
        .modal-title {
            font-weight: 600;
        }
        
        .modal-header .btn-close {
            color: white;
            opacity: 0.8;
            filter: brightness(10);
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .modal-footer {
            border-top: 1px solid rgba(0,0,0,0.05);
            padding: 15px 20px;
        }
        
        .modal-body h6 {
            color: #0e2238;
            font-weight: 600;
            margin-bottom: 15px;
        }
    `;
    
    // Añadir estilos
    document.head.appendChild(styleElement);
}

/**
 * Mejora visual de los contadores
 */
function enhanceCounters() {
    // Mejorar visualmente los contadores superiores
    const counterCards = document.querySelectorAll('.counter-card');
    
    counterCards.forEach(card => {
        // Añadir clase para sombra y transición
        card.style.transition = 'all 0.3s ease';
        card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        
        // Añadir efecto hover
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // Agregar efecto pulse al contador de stock final si es clickeable
    const stockCounter = document.getElementById('stock-final-counter');
    if (stockCounter) {
        // Añadir ícono de ojo
        const counterContent = stockCounter.querySelector('.counter-content');
        if (counterContent) {
            const eyeIcon = document.createElement('i');
            eyeIcon.className = 'zmdi zmdi-eye counter-icon-detail';
            eyeIcon.style.position = 'absolute';
            eyeIcon.style.top = '10px';
            eyeIcon.style.right = '10px';
            eyeIcon.style.fontSize = '16px';
            eyeIcon.style.opacity = '0.7';
            eyeIcon.style.transition = 'opacity 0.3s ease';
            stockCounter.appendChild(eyeIcon);
            
            // Hacer más visible al hover
            stockCounter.addEventListener('mouseenter', function() {
                eyeIcon.style.opacity = '1';
            });
            
            stockCounter.addEventListener('mouseleave', function() {
                eyeIcon.style.opacity = '0.7';
            });
        }
    }
}

/**
 * Aplica efectos de animación a los contadores cuando se actualizan
 * Esta función se puede llamar cada vez que se actualicen los valores
 * @param {string} elementId - ID del elemento que se actualizó
 */
function animateCounterUpdate(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Añadir clase de animación
    element.classList.add('counter-updated');
    
    // Agregar keyframes si no existen
    if (!document.getElementById('counter-animations')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'counter-animations';
        styleElement.textContent = `
            @keyframes counterPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); color: #117daf; }
                100% { transform: scale(1); }
            }
            
            .counter-updated {
                animation: counterPulse 0.5s ease;
            }
        `;
        document.head.appendChild(styleElement);
    }
    
    // Eliminar la clase después de completar la animación
    setTimeout(() => {
        element.classList.remove('counter-updated');
    }, 500);
}

// Exportar funciones para uso en eventos externos
window.dashboardUI = {
    animateCounterUpdate: animateCounterUpdate
};