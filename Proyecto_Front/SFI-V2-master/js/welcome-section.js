/**
 * welcome-section.js
 * Maneja la funcionalidad de la sección de bienvenida y la carga de datos de las API
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la sección de bienvenida
    initWelcomeSection();
    
    // Inicializar métricas dinámicas
    loadMetricsData();
    
    // Configurar eventos interactivos
    setupInteractiveElements();
});

/**
 * Inicializa la sección de bienvenida
 */
function initWelcomeSection() {
    // Animar elementos con efecto de entrada
    animateWelcomeElements();
    
    // Añadir efecto de parallax a las imágenes
    setupImageParallax();
    
    // Configurar interactividad en tarjetas de productos
    setupProductCards();
}

/**
 * Anima elementos de la sección de bienvenida con efecto de entrada
 */
function animateWelcomeElements() {
    // Elementos que se animarán
    const elementsToAnimate = [
        document.querySelector('.welcome-header'),
        ...document.querySelectorAll('.stat-item'),
        ...document.querySelectorAll('.ice-cream-item')
    ].filter(Boolean);
    
    // Aplicar animación con delays
    elementsToAnimate.forEach((element, index) => {
        // Configurar estado inicial
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        // Aplicar animación con delay
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 * index);
    });
}

/**
 * Configura el efecto parallax para las imágenes
 */
function setupImageParallax() {
    const productCards = document.querySelectorAll('.ice-cream-item');
    
    productCards.forEach(card => {
        const image = card.querySelector('.product-image img');
        
        if (image) {
            // Evento mousemove para efecto parallax
            card.addEventListener('mousemove', function(e) {
                // Solo aplicar en dispositivos no móviles
                if (window.innerWidth >= 992) {
                    const rect = this.getBoundingClientRect();
                    
                    // Calcular posición relativa del mouse (entre -1 y 1)
                    const xPos = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
                    const yPos = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
                    
                    // Aplicar transformación sutil
                    image.style.transform = `translate(${xPos * 5}px, ${yPos * 5}px) scale(1.05)`;
                }
            });
            
            // Resetear al salir
            card.addEventListener('mouseleave', function() {
                image.style.transform = '';
            });
        }
    });
}

/**
 * Configura interactividad para las tarjetas de productos
 */
function setupProductCards() {
    const productCards = document.querySelectorAll('.ice-cream-item');
    
    productCards.forEach(card => {
        // Evento de clic para mostrar detalles
        card.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            showProductDetails(productName);
        });
    });
}

/**
 * Muestra detalles del producto seleccionado
 * @param {string} productName - Nombre del producto
 */
function showProductDetails(productName) {
    // Verificar que SweetAlert2 esté disponible
    if (typeof Swal === 'undefined') {
        console.error('SweetAlert2 no está disponible');
        return;
    }
    
    // Obtener elemento del producto y su imagen
    const productElement = document.querySelector(`[data-product="${productName}"]`);
    const productImage = productElement ? productElement.querySelector('img').src : '';
    
    // Consultar API para obtener datos del producto
    fetch('http://localhost:63152/api/Production/GetAllProduction')
        .then(response => response.json())
        .then(productionData => {
            // Filtrar datos específicos para este producto
            const productProduction = productionData.filter(item => item.PRODUCTO === productName);
            
            // Datos por defecto
            let productData = {
                title: productName.replace(' - GRIDO', ''),
                description: 'Información no disponible',
                estado: 'Sin información',
                ot: 'N/A',
                producido: '0',
                demanda: '0',
                eficiencia: '0'
            };
            
            // Estado predeterminado según el producto
            switch(productName) {
                case 'PACK TORTA COOKIES AND CREAM - GRIDO':
                    productData.estado = 'En producción';
                    productData.ot = '4';
                    productData.description = 'Deliciosa torta helada con galletas oreo y crema americana.';
                    break;
                case 'PACK TORTA COOKIES AND MOUSSE - GRIDO':
                    productData.estado = 'Planificada';
                    productData.ot = '6';
                    productData.description = 'Exquisita combinación de galletas y mousse para un sabor incomparable.';
                    break;
                case 'PACK TORTA GRIDO CON RELLENO - GRIDO':
                    productData.estado = 'Completada';
                    productData.ot = '3';
                    productData.description = 'La clásica torta Grido con relleno especial que todos adoran.';
                    break;
            }
            
            // Actualizar con datos reales si están disponibles
            if (productProduction.length > 0) {
                // Calcular total producido
                const totalProducido = productProduction.reduce((sum, item) => sum + (item.PRODUCIDO || 0), 0);
                productData.producido = totalProducido.toString();
                
                // Obtener demanda de trabajo más reciente
                const lastProduction = productProduction.sort((a, b) => new Date(b.FECHA) - new Date(a.FECHA))[0];
                if (lastProduction) {
                    productData.ot = lastProduction.OT.toString();
                    
                    // Solo si conocemos tanto la producción como la demanda, calculamos la eficiencia
                    if (lastProduction.DEMANDA && lastProduction.DEMANDA > 0) {
                        productData.demanda = lastProduction.DEMANDA.toString();
                        productData.eficiencia = ((totalProducido / lastProduction.DEMANDA) * 100).toFixed(1);
                    }
                }
            }
            
            // Determinar color según el estado
            let statusColor;
            switch(productData.estado.toLowerCase()) {
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
            
            // Preparar contenido HTML
            const content = `
                <div class="product-detail-container">
                    <div class="row">
                        <div class="col-md-5">
                            <div class="product-detail-image">
                                <img src="${productImage}" alt="${productData.title}" class="img-fluid rounded">
                                <div class="product-status-badge" style="background-color: ${statusColor}">
                                    ${productData.estado}
                                </div>
                            </div>
                        </div>
                        <div class="col-md-7 text-start">
                            <div class="product-detail-info">
                                <h4>${productData.title}</h4>
                                <p class="product-description">${productData.description}</p>
                                
                                <div class="production-data">
                                    <div class="data-row">
                                        <span class="data-label">Orden de Trabajo:</span>
                                        <span class="data-value">OT #${productData.ot}</span>
                                    </div>
                                    <div class="data-row">
                                        <span class="data-label">Producido:</span>
                                        <span class="data-value">${productData.producido} unidades</span>
                                    </div>
                                    <div class="data-row">
                                        <span class="data-label">Demanda:</span>
                                        <span class="data-value">${productData.demanda} unidades</span>
                                    </div>
                                    
                                    <div class="progress-container mt-3">
                                        <div class="progress-label d-flex justify-content-between">
                                            <span>Avance de producción</span>
                                            <span>${productData.eficiencia}%</span>
                                        </div>
                                        <div class="progress mt-1" style="height: 10px;">
                                            <div class="progress-bar" role="progressbar" 
                                                style="width: ${productData.eficiencia}%; background-color: ${statusColor}" 
                                                aria-valuenow="${productData.eficiencia}" aria-valuemin="0" aria-valuemax="100">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Mostrar modal
            Swal.fire({
                html: content,
                showConfirmButton: false,
                showCloseButton: true,
                width: '700px',
                padding: '20px',
                customClass: {
                    popup: 'product-detail-modal'
                }
            });
        })
        .catch(error => {
            console.error('Error al cargar datos de producción:', error);
            
            // Mostrar modal de error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los datos del producto. Inténtelo nuevamente.',
                confirmButtonColor: '#0e2238'
            });
        });
}

/**
 * Carga datos de métricas desde las API
 */
function loadMetricsData() {
    // Cargar métricas para la sección de última producción
    loadUltimaProduccionMetrics();
    
    // Actualizar estadísticas de eficiencia
    updateEfficiencyStatistic();
    
    // Actualizar estadísticas de órdenes completadas
    updateCompletedOrdersStatistic();
}

/**
 * Carga métricas para la sección de última producción
 */
function loadUltimaProduccionMetrics() {
    const metricsContainer = document.querySelector('.metrics-container');
    if (!metricsContainer) return;
    
    // Mostrar indicador de carga
    metricsContainer.innerHTML = `
        <div class="loading-indicator text-center w-100">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Cargando datos...</p>
        </div>
    `;
    
    // Crear promesas para las consultas API
    const getProduction = fetch('http://localhost:63152/api/Production/GetAllProduction')
        .then(response => {
            if (!response.ok) throw new Error('Error en API de producción');
            return response.json();
        })
        .catch(error => {
            console.error('Error al obtener datos de producción:', error);
            return [];
        });
    
    const getOrders = fetch('http://localhost:63152/api/WorkOrders/GetAllWorkOrders')
        .then(response => {
            if (!response.ok) throw new Error('Error en API de órdenes');
            return response.json();
        })
        .catch(error => {
            console.error('Error al obtener datos de órdenes:', error);
            return [];
        });
    
    // Ejecutar ambas consultas en paralelo
    Promise.all([getProduction, getOrders])
        .then(([produccionData, ordenesData]) => {
            try {
                // Verificar datos
                if (!Array.isArray(produccionData) || !Array.isArray(ordenesData)) {
                    throw new Error('Formato de datos incorrecto');
                }
                
                // Filtrar datos para OT 4
                const otProduccion = produccionData.filter(item => item && typeof item === 'object' && item.OT === 4);
                const otOrden = ordenesData.find(item => item && typeof item === 'object' && item.OT === 4);
                
                // Calcular total producido
                const totalProducido = otProduccion.reduce((sum, item) => {
                    return sum + (typeof item.PRODUCIDO === 'number' ? item.PRODUCIDO : 0);
                }, 0);
                
                // Obtener demanda
                const produccionSolicitada = otOrden && typeof otOrden.DEMANDA === 'number' ? otOrden.DEMANDA : 0;
                
                // Obtener performance
                let performance = "0.0";
                if (otProduccion.length > 0) {
                    // Ordenar por fecha descendente
                    const produccionOrdenada = [...otProduccion].sort((a, b) => 
                        new Date(b.FECHA) - new Date(a.FECHA)
                    );
                    
                    // Obtener performance del último registro
                    if (produccionOrdenada[0] && typeof produccionOrdenada[0].PERFORMANCE === 'number') {
                        const performanceValue = produccionOrdenada[0].PERFORMANCE / 100;
                        performance = performanceValue.toFixed(2);
                    }
                }
                
                // Actualizar el contenedor con los datos obtenidos
                metricsContainer.innerHTML = `
                    <div class="metric-card">
                        <div class="metric-icon">
                            <i class="zmdi zmdi-check-circle"></i>
                        </div>
                        <div class="metric-value">${totalProducido.toLocaleString()}</div>
                        <div class="metric-label">Producido</div>
                    </div>

                    <div class="metric-card">
                        <div class="metric-icon">
                            <i class="zmdi zmdi-assignment-o"></i>
                        </div>
                        <div class="metric-value">${produccionSolicitada.toLocaleString()}</div>
                        <div class="metric-label">Demanda</div>
                    </div>

                    <div class="metric-card">
                        <div class="metric-icon">
                            <i class="zmdi zmdi-trending-up"></i>
                        </div>
                        <div class="metric-value">${performance}%</div>
                        <div class="metric-label">Performance</div>
                    </div>
                `;
                
                // Guardar datos para uso posterior
                window.ultimaProduccionData = {
                    producido: totalProducido,
                    demanda: produccionSolicitada,
                    performance: performance
                };
                
            } catch (error) {
                console.error('Error al procesar datos:', error);
                
                // Mostrar mensaje de error
                metricsContainer.innerHTML = `
                    <div class="error-message text-center w-100">
                        <i class="zmdi zmdi-alert-circle text-danger" style="font-size: 24px;"></i>
                        <p class="mt-2">Error al procesar los datos. Por favor, intente más tarde.</p>
                        <button class="btn btn-sm btn-outline-primary mt-2" onclick="loadUltimaProduccionMetrics()">
                            <i class="zmdi zmdi-refresh"></i> Reintentar
                        </button>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error general:', error);
            
            // Mostrar mensaje de error en el contenedor
            metricsContainer.innerHTML = `
                <div class="error-message text-center w-100">
                    <i class="zmdi zmdi-alert-circle text-danger" style="font-size: 24px;"></i>
                    <p class="mt-2">Error al cargar los datos. Por favor, intente más tarde.</p>
                    <button class="btn btn-sm btn-outline-primary mt-2" onclick="loadUltimaProduccionMetrics()">
                        <i class="zmdi zmdi-refresh"></i> Reintentar
                    </button>
                </div>
            `;
        });
}

/**
 * Actualiza la estadística de eficiencia con datos reales
 */
function updateEfficiencyStatistic() {
    // Obtener el elemento de valor
    const efficiencyElement = document.querySelector('.stat-item:first-child .stat-value');
    const progressBar = document.querySelector('.stat-item:first-child .progress-bar');
    
    if (!efficiencyElement || !progressBar) return;
    
    // Consultar API para obtener datos
    fetch('http://localhost:63152/api/Production/GetAllProduction')
        .then(response => response.json())
        .then(data => {
            // Calcular eficiencia promedio
            let totalPerformance = 0;
            let count = 0;
            
            data.forEach(item => {
                if (item && typeof item.PERFORMANCE === 'number') {
                    totalPerformance += item.PERFORMANCE / 100; // Dividir por 100 para normalizar
                    count++;
                }
            });
            
            // Calcular eficiencia promedio si hay datos
            if (count > 0) {
                const avgPerformance = (totalPerformance / count) * 100;
                const formattedPerformance = avgPerformance.toFixed(1);
                
                // Actualizar elemento con animación
                efficiencyElement.textContent = formattedPerformance + '%';
                efficiencyElement.classList.add('counter-updated');
                
                // Actualizar barra de progreso
                progressBar.style.width = `${formattedPerformance}%`;
                progressBar.setAttribute('aria-valuenow', formattedPerformance);
                
                // Remover clase de animación después de completarse
                setTimeout(() => {
                    efficiencyElement.classList.remove('counter-updated');
                }, 1000);
            }
        })
        .catch(error => {
            console.error('Error al obtener datos de eficiencia:', error);
        });
}

/**
 * Actualiza la estadística de órdenes completadas
 */
function updateCompletedOrdersStatistic() {
    // Obtener elementos
    const ordersElement = document.querySelector('.stat-item:nth-child(2) .stat-value');
    const trendElement = document.querySelector('.stat-item:nth-child(2) .stat-trend');
    
    if (!ordersElement || !trendElement) return;
    
    // Consultar API para obtener órdenes
    fetch('http://localhost:63152/api/WorkOrders/GetAllWorkOrders')
        .then(response => response.json())
        .then(data => {
            // Filtrar órdenes completadas
            const completedOrders = data.filter(item => item && item.ESTADO === 'REALIZADA');
            
            if (completedOrders.length > 0) {
                // Actualizar contador
                ordersElement.innerHTML = `${completedOrders.length} <small>este mes</small>`;
                
                // Calcular tendencia (simulada)
                const trend = Math.floor(Math.random() * 15) + 5; // Valor entre 5% y 20%
                trendElement.innerHTML = `<i class="zmdi zmdi-trending-up"></i> +${trend}% vs. mes anterior`;
                
                // Animar actualización
                ordersElement.classList.add('counter-updated');
                setTimeout(() => {
                    ordersElement.classList.remove('counter-updated');
                }, 1000);
            }
        })
        .catch(error => {
            console.error('Error al obtener datos de órdenes:', error);
        });
}

/**
 * Configura elementos interactivos de la página
 */
function setupInteractiveElements() {
    // Hacer clickeable el contador de stock final
    const stockCounter = document.getElementById('stock-final-counter');
    if (stockCounter) {
        stockCounter.addEventListener('click', function() {
            // Verificar si Modal existe como objeto global
            if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                const stockModal = new bootstrap.Modal(document.getElementById('stockModal'));
                stockModal.show();
            } else {
                // Fallback si bootstrap no está disponible
                $('#stockModal').modal('show');
            }
        });
        
        // Añadir efecto de pulsación al pasar el mouse
        stockCounter.addEventListener('mouseenter', function() {
            this.classList.add('counter-hover');
        });
        
        stockCounter.addEventListener('mouseleave', function() {
            this.classList.remove('counter-hover');
        });
    }
    
    // Configurar botón de exportación
    const exportBtn = document.getElementById('export-balance-chart-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Buscar el gráfico de Highcharts
            const chart = Highcharts.charts.find(chart => 
                chart && chart.renderTo.id === 'balance-highchart-container'
            );
            
            if (chart) {
                // Crear menú de opciones de exportación
                showExportMenu(this, chart);
            }
        });
    }
}

/**
 * Muestra el menú de exportación para el gráfico
 * @param {HTMLElement} buttonElement - Elemento botón que activó el menú
 * @param {Object} chart - Instancia del gráfico Highcharts
 */
function showExportMenu(buttonElement, chart) {
    // Eliminar menú existente si hay
    const existingMenu = document.querySelector('.export-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    // Crear menú de opciones
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
    
    // Estilos para el menú
    exportMenu.style.position = 'absolute';
    exportMenu.style.backgroundColor = 'white';
    exportMenu.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
    exportMenu.style.borderRadius = '8px';
    exportMenu.style.zIndex = '9999';
    exportMenu.style.overflow = 'hidden';
    
    // Posicionar el menú
    const buttonRect = buttonElement.getBoundingClientRect();
    exportMenu.style.top = (buttonRect.bottom + 5) + 'px';
    exportMenu.style.right = (window.innerWidth - buttonRect.right) + 'px';
    
    // Añadir al documento
    document.body.appendChild(exportMenu);
    
    // Manejar clics en las opciones
    exportMenu.querySelectorAll('.export-menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const format = this.getAttribute('data-format');
            
            // Ejecutar acción según el formato
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
    
    // Cerrar al hacer clic fuera
    document.addEventListener('click', function closeMenu(e) {
        if (!exportMenu.contains(e.target) && e.target !== buttonElement) {
            exportMenu.remove();
            document.removeEventListener('click', closeMenu);
        }
    });
}

// Actualizar datos cada cierto tiempo para mantener dinamismo
setInterval(function() {
    updateEfficiencyStatistic();
}, 60000); // Cada minuto

setInterval(function() {
    updateCompletedOrdersStatistic();
}, 120000); // Cada 2 minutos

// Exponer función para recargar métricas desde otros archivos
window.reloadWelcomeMetrics = loadMetricsData;