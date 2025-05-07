document.addEventListener('DOMContentLoaded', function () {
    const hamBurger = document.querySelector(".toggle-btn");
    const sidebar = document.querySelector("#sidebar");

    function adjustTable() {
        if (window.materialsTable &&
            typeof window.materialsTable.columns?.adjust === 'function') {
            setTimeout(() => {
                window.materialsTable.columns.adjust();
                if (window.materialsTable.responsive) {
                    window.materialsTable.responsive.recalc();
                }
            }, 300);
        }
    }

    hamBurger.addEventListener("click", function () {
        sidebar.classList.toggle("expand");
        adjustTable();
    });

    function handleResize() {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove("expand");
        } else {
            if (!sidebar.classList.contains("expand")) {
                sidebar.classList.add("expand");
            }
        }
        adjustTable();
    }

    window.addEventListener('resize', handleResize);
    handleResize();


    //NUEVO 
    // 1. Reorganizar la estructura de los contenedores de gráficos
    function reorganizarGraficos() {
        // Ajustar el contenedor principal
        const mainContainer = document.querySelector('.main');
        if (mainContainer) {
            mainContainer.style.paddingTop = '20px';
            mainContainer.style.overflow = 'visible';
        }

        // Ajustar espaciado de filas
        const rows = document.querySelectorAll('.row');
        rows.forEach(row => {
            row.style.marginBottom = '30px';
            row.style.overflow = 'visible';
        });

        // Aumentar el espacio entre los gráficos verticalmente
        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach(container => {
            container.style.marginBottom = '40px';
            container.style.overflow = 'visible';
        });

        // Reorganizar la columna izquierda para que ocupe todo el ancho en dispositivos pequeños
        const leftColumn = document.querySelector('.col-md-6:first-child');
        if (leftColumn) {
            // En dispositivos móviles, hacerlo full width
            if (window.innerWidth < 992) {
                leftColumn.className = 'col-12';
            } else {
                // En dispositivos grandes, mantener el 50%
                leftColumn.className = 'col-md-6';
            }
        }

        // Reorganizar la columna derecha igual
        const rightColumn = document.querySelector('.col-md-6:last-child');
        if (rightColumn) {
            if (window.innerWidth < 992) {
                rightColumn.className = 'col-12';
            } else {
                rightColumn.className = 'col-md-6';
            }
        }

        // Ajustar alturas de los contenedores según el tipo
        const largeContainers = document.querySelectorAll('.chart-container-large');
        largeContainers.forEach(container => {
            container.style.height = '450px';
            container.style.marginBottom = '30px';
        });

        const mediumContainers = document.querySelectorAll('.chart-container-medium');
        mediumContainers.forEach(container => {
            container.style.height = '350px';
            container.style.marginBottom = '30px';
        });

        const smallContainers = document.querySelectorAll('.chart-container-small');
        smallContainers.forEach(container => {
            container.style.height = '300px';
            container.style.marginBottom = '30px';
        });
    }



    // Ejecutar la reorganización de gráficos
    reorganizarGraficos();
});

// Función para actualizar las tablas de producción y balance con la OT especificada
function actualizarTablasProduccion(ot) {
    console.log(`Actualizando tablas para la OT ${ot}`);

    // Actualizar tabla de producción si ya está inicializada
    if (window.productionTable) {
        window.productionTable.ajax.url(`http://localhost:63152/api/Production/GetAllProduction`).load();

        // Aplicar filtro para la OT específica
        window.productionTable.column(3).search(ot.toString()).draw();
    }

    // Actualizar tabla de balance teórico si ya está inicializada
    if (window.theoricalTableInProduction) {
        // Destruir y reinicializar la tabla con la nueva URL específica para la OT
        if ($.fn.DataTable.isDataTable('#theoricalTableInProduction')) {
            $('#theoricalTableInProduction').DataTable().destroy();
        }

        window.theoricalTableInProduction = $('#theoricalTableInProduction').DataTable({
            ajax: {
                url: `http://localhost:63152/api/TheoricalConsumption/GetTheoricalConsumption?ot=${ot}`,
                dataSrc: ''
            },
            language: window.dataTablesLanguage,
            columns: [
                { data: "MATERIAL" },
                {
                    data: "TEORICO",
                    className: "text-right",
                    render: function (data) {
                        return parseFloat(data).toFixed(2) + ' KG';
                    }
                },
                {
                    data: "REAL",
                    className: "text-right",
                    render: function (data) {
                        return parseFloat(data).toFixed(2) + ' KG';
                    }
                },
                {
                    data: "DESVIO",
                    className: "text-right",
                    render: function (data) {
                        const value = parseFloat(data);
                        const color = value < 0 ? '#dc3545' : '#28a745';
                        return `<span style="color: ${color}">${value.toFixed(2)} KG</span>`;
                    }
                }
            ],
            initComplete: function () {
                $('#theoricalTableInProduction thead th').css({
                    'background-color': '#0e2238',
                    'color': 'white'
                });
                $('#theoricalTableInProduction tbody tr').css({
                    'background-color': 'white',
                    'color': 'black'
                });
            }
        });
    }
}




// Función para solucionar problemas de botones - FUERA del DOMContentLoaded
function solucionarProblemasBotones() {
    // Asegurarse de que los botones de consulta estén posicionados correctamente
    const consultarButtons = document.querySelectorAll('.btn-consultar');
    consultarButtons.forEach(button => {
        button.style.position = 'relative';
        button.style.zIndex = '100';
        button.style.marginTop = '10px';
        button.style.marginBottom = '5px';
    });

    // Ajustar la posición del menú hamburguesa para Highcharts
    const style = document.createElement('style');
    style.textContent = `
        /* Asegurar que el menú contextual de Highcharts siempre esté por encima */
        .highcharts-contextmenu, 
        .highcharts-menu {
            position: fixed !important; /* Usar fixed en lugar de absolute */
            z-index: 9999 !important;
            max-height: 80vh !important; /* Limitar altura en ventanas pequeñas */
            overflow-y: auto !important; /* Permitir scroll */
            box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important;
            border-radius: 6px !important;
        }
        
        /* Mejorar la visibilidad de los botones */
        .btn-consultar {
            background-color: #0e2238 !important;
            color: white !important;
            transition: all 0.3s ease !important;
            padding: 8px 20px !important;
            border-radius: 4px !important;
            display: inline-block !important;
            margin: 10px auto !important;
            position: relative !important;
            z-index: 100 !important;
        }
        
        /* Hacer los gráficos "click-through" para los menús */
        .highchart-wrapper {
            overflow: visible !important;
        }
        
        /* Asegurar que los contenedores no oculten elementos */
        .chart-container, 
        .chart-container-large, 
        .chart-container-medium, 
        .chart-container-small {
            overflow: visible !important;
            position: relative !important;
        }
        
        /* Asegurar que el sidebar esté por encima de todo */
        #sidebar {
            z-index: 1050 !important;
        }
        
        /* Ajustar el botón de hamburguesa para que sea más visible */
        .toggle-btn {
            background-color: #0e2238 !important;
            color: white !important;
            border-radius: 4px !important;
            z-index: 1051 !important;
            position: relative !important;
        }
        
        /* Estilos para pantallas pequeñas */
        @media (max-width: 991px) {
            .chart-container-large,
            .chart-container-medium,
            .chart-container-small {
                height: 350px !important;
                margin-bottom: 40px !important;
            }
            
            .btn-consultar {
                margin: 15px auto !important;
            }
        }
    `;
    document.head.appendChild(style);
}



// Sobrescribir configuración de Highcharts para el menú contextual
if (typeof Highcharts !== 'undefined') {
    Highcharts.setOptions({
        navigation: {
            menuItemStyle: {
                padding: '0.5em 1em',
                fontSize: '14px'
            },
            menuStyle: {
                border: '1px solid #ccc',
                background: '#fff',
                padding: '5px 0',
                borderRadius: '4px',
                boxShadow: '2px 2px 10px rgba(0,0,0,0.3)',
                zIndex: 9999
            },
            buttonOptions: {
                theme: {
                    'stroke-width': 1,
                    stroke: '#666',
                    fill: '#f8f8f8',
                    r: 4
                }
            }
        },
        exporting: {
            buttons: {
                contextButton: {
                    menuClassName: 'highcharts-contextmenu-fixed',
                    symbol: 'menu',
                    symbolStrokeWidth: 1
                }
            }
        }
    });
}


// Función para mejorar el posicionamiento del menú contextual - FUERA del DOMContentLoaded
function mejorarMenuContextual() {
    // Añadir un listener para detectar clics en el botón del menú contextual
    document.addEventListener('click', function (e) {
        // Verificar si el clic fue en un botón de menú contextual
        if (e.target.closest('.highcharts-button') ||
            e.target.closest('.highcharts-contextmenu')) {

            // Dar tiempo a que el menú se muestre
            setTimeout(function () {
                const menu = document.querySelector('.highcharts-contextmenu');
                if (menu) {
                    // Obtener posición del clic
                    const x = e.clientX;
                    const y = e.clientY;

                    // Obtener dimensiones del viewport
                    const viewportWidth = window.innerWidth;
                    const viewportHeight = window.innerHeight;

                    // Obtener dimensiones del menú
                    const menuWidth = menu.offsetWidth;
                    const menuHeight = menu.offsetHeight;

                    // Calcular posición óptima
                    let newX = x;
                    let newY = y;

                    // Ajustar si sale por la derecha
                    if (x + menuWidth > viewportWidth) {
                        newX = viewportWidth - menuWidth - 10;
                    }

                    // Ajustar si sale por abajo
                    if (y + menuHeight > viewportHeight) {
                        newY = viewportHeight - menuHeight - 10;
                    }

                    // Aplicar nueva posición
                    menu.style.position = 'fixed';
                    menu.style.left = newX + 'px';
                    menu.style.top = newY + 'px';
                    menu.style.zIndex = '9999';
                }
            }, 10);
        }
    }, true);

    // Añadir un listener para cerrar el menú al hacer clic fuera
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.highcharts-contextmenu') &&
            !e.target.closest('.highcharts-button')) {
            const menus = document.querySelectorAll('.highcharts-contextmenu');
            menus.forEach(menu => {
                menu.style.display = 'none';
            });
        }
    });
}

// Ejecutar las funciones después de un tiempo para asegurar que todo el DOM está cargado
setTimeout(function () {
    solucionarProblemasBotones();
    mejorarMenuContextual();
}, 500);


// Función para detectar y corregir menús contextuales fuera de los límites
function fixContextMenuPosition() {
    // Aplicar después de que aparezca cualquier menú contextual
    $(document).on('mousedown', '.highcharts-contextmenu', function () {
        const menu = $(this);
        const menuRect = this.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Comprobar si el menú sale por la derecha
        if (menuRect.right > viewportWidth) {
            const newLeft = viewportWidth - menuRect.width - 10;
            menu.css('left', newLeft + 'px');
        }

        // Comprobar si el menú sale por abajo
        if (menuRect.bottom > viewportHeight) {
            const newTop = viewportHeight - menuRect.height - 10;
            menu.css('top', newTop + 'px');
        }
    });
}




// Función para inicializar todos los gráficos con Highcharts
function initHighcharts() {
    // 1. Última Producción (gráfico circular)
    initUltimaProduccionChart();

    // 2. Órdenes de Trabajo (gráfico circular)
    initOrdenesTrabajoChart();

    // 3. Producción por Temporada (barras)
    initProduccionTemporadaChart();

    // 4. Producción por Órdenes de Trabajo (barras)
    // initProduccionOTChart();

    // 5. Producción Anual (líneas)
    initProduccionAnualChart();

    // 6. Balance de Masas (barras) - ya implementado previamente
    initBalanceMasasChart();
}


// 1. Última Producción (gráfico circular)
// 2. Para el gráfico de Última Producción - Mostrar la leyenda siempre visible
function initUltimaProduccionChart() {
    // Función para inicializar el gráfico de Última Producción con los 3 contadores
    window.initUltimaProduccionChart = function () {
        const container = document.getElementById('ultima-produccion-container');
        if (!container) return;

        // Obtener datos de producción
        $.ajax({
            url: 'http://localhost:63152/api/Production/GetAllProduction',
            success: function (productionData) {
                // Filtrar datos para OT 4
                const otData = productionData.filter(item => item.OT === 4);
                // Calcular producción total
                const totalProducido = otData.reduce((sum, item) => sum + item.PRODUCIDO, 0);
                // Demanda fija como indicaste
                const produccionSolicitada = 1446;

                // Calcular porcentajes y performance
                const porcentajeProducido = ((totalProducido / produccionSolicitada) * 100).toFixed(1);
                const porcentajeFaltante = (100 - porcentajeProducido).toFixed(1);

                // Performance (mismo valor que porcentaje producido en este caso)
                const performance = porcentajeProducido;

                // Crear el gráfico circular
                Highcharts.chart('ultima-produccion-container', {
                    chart: {
                        type: 'pie',
                        backgroundColor: 'transparent',
                        // Dejar espacio suficiente para los contadores
                        spacingBottom: 20,
                        // Altura para ajustarse al contenedor
                        height: '100%'
                    },
                    title: {
                        text: undefined
                    },
                    credits: {
                        enabled: false
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            innerSize: '60%', // Estilo donut
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            },
                            // Reducir tamaño para dejar espacio a los contadores
                            size: '90%',
                            // Mostrar leyenda solo si hay espacio
                            showInLegend: true
                        }
                    },
                    legend: {
                        enabled: false // Desactivar leyenda para dar más espacio a los contadores
                    },
                    series: [{
                        name: 'Producción',
                        colorByPoint: true,
                        data: [{
                            name: 'Producción Real',
                            y: parseFloat(porcentajeProducido),
                            color: '#0c169f'
                        }, {
                            name: 'Pendiente',
                            y: parseFloat(porcentajeFaltante),
                            color: '#e74a3b'
                        }]
                    }]
                });

                // Agregar información central (OT 4 y porcentaje)
                // Eliminar cualquier info central existente primero
                const existingInfo = container.querySelector('.highcharts-center-info');
                if (existingInfo) existingInfo.remove();

                const centerInfo = document.createElement('div');
                centerInfo.className = 'highcharts-center-info';
                centerInfo.innerHTML = `
          <div class="center-title">OT 4</div>
          <div class="center-value">${porcentajeProducido}%</div>
        `;
                container.appendChild(centerInfo);

                // Crear los 3 contadores solicitados
                // Eliminar cualquier contador existente primero
                const existingCounters = container.querySelector('.production-counters');
                if (existingCounters) existingCounters.remove();

                const countersContainer = document.createElement('div');
                countersContainer.className = 'production-counters';
                countersContainer.innerHTML = `
          <div class="counters-wrapper">
            <div class="counter-box">
              <div class="counter-icon"><i class="zmdi zmdi-check-circle"></i></div>
              <div class="counter-value">${totalProducido.toLocaleString()}</div>
              <div class="counter-label">Producido</div>
            </div>
            <div class="counter-box">
              <div class="counter-icon"><i class="zmdi zmdi-assignment-o"></i></div>
              <div class="counter-value">${produccionSolicitada.toLocaleString()}</div>
              <div class="counter-label">Demanda</div>
            </div>
            <div class="counter-box">
              <div class="counter-icon"><i class="zmdi zmdi-trending-up"></i></div>
              <div class="counter-value">${performance}%</div>
              <div class="counter-label">Performance</div>
            </div>
          </div>
        `;
                container.appendChild(countersContainer);

                // Aplicar estilos personalizados para los contadores
                const styleElement = document.createElement('style');
                styleElement.textContent = `
          /* Estilos para el contenedor de contadores */
          .production-counters {
            padding: 10px;
            margin-top: 5px;
            width: 100%;
            background-color: #f8f9fa;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          /* Wrapper para los contadores */
          .counters-wrapper {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
          }
          
          /* Cada contador individual */
          .counter-box {
            flex: 1;
            min-width: 75px;
            text-align: center;
            padding: 8px 5px;
            background-color: white;
            border-radius: 5px;
            margin: 0 3px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
          }
          
          .counter-box:hover {
            transform: translateY(-2px);
            box-shadow: 0 3px 6px rgba(0,0,0,0.1);
          }
          
          /* Iconos distintivos para cada contador */
          .counter-icon {
            font-size: 18px;
            margin-bottom: 3px;
          }
          
          .counter-box:nth-child(1) .counter-icon {
            color: #0c169f; /* Azul para Producido */
          }
          
          .counter-box:nth-child(2) .counter-icon {
            color: #e74a3b; /* Rojo para Demanda */
          }
          
          .counter-box:nth-child(3) .counter-icon {
            color: #1cc88a; /* Verde para Performance */
          }
          
          /* Valores de los contadores */
          .counter-value {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin-bottom: 2px;
          }
          
          /* Etiquetas de los contadores */
          .counter-label {
            font-size: 11px;
            color: #666;
          }
          
          /* Ajuste para dispositivos móviles */
          @media (max-width: 767px) {
            .counter-box {
              margin-bottom: 5px;
              flex-basis: 100%;
            }
          }
        `;

                // Añadir los estilos al documento
                if (!document.getElementById('ultima-produccion-styles')) {
                    styleElement.id = 'ultima-produccion-styles';
                    document.head.appendChild(styleElement);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error al cargar datos de producción:", error);
                container.innerHTML = '<div class="error-message">Error al cargar datos de producción</div>';
            }
        });
    };
}
// Función para cargar dinámicamente los datos de la última OT con estado REALIZADA
// Función para cargar los datos de la última OT realizada usando una consulta directa
function cargarUltimaProduccion() {
    // Seleccionar el contenedor de métricas
    const metricsContainer = document.querySelector('.metrics-container');
    if (!metricsContainer) {
        console.error('No se encontró el contenedor de métricas de Última Producción');
        return;
    }

    // Mostrar loader mientras se cargan los datos
    metricsContainer.innerHTML = `
        <div style="width: 100%; text-align: center; padding: 20px;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Cargando datos de producción...</p>
        </div>
    `;

    // Obtener primero todas las órdenes de trabajo para identificar la última REALIZADA
    fetch('http://localhost:63152/api/WorkOrders/GetAllWorkOrders')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar órdenes de trabajo');
            }
            return response.json();
        })
        .then(ordenesData => {
            // Filtrar órdenes con estado REALIZADA
            const ordenesRealizadas = ordenesData.filter(item => item.ESTADO === 'REALIZADA');

            // Ordenar por OT descendente para obtener la última (asumiendo que las OT más recientes tienen números más altos)
            ordenesRealizadas.sort((a, b) => b.OT - a.OT);

            // Obtener la última OT realizada
            const ultimaOT = ordenesRealizadas.length > 0 ? ordenesRealizadas[0] : null;

            if (!ultimaOT) {
                metricsContainer.innerHTML = `
                    <div style="width: 100%; text-align: center; padding: 20px; color: #dc3545;">
                        <i class="zmdi zmdi-alert-circle-o" style="font-size: 24px;"></i>
                        <p class="mt-2">No se encontraron órdenes de trabajo realizadas.</p>
                    </div>
                `;
                return Promise.reject('No hay órdenes de trabajo realizadas');
            }

            console.log('Última OT REALIZADA:', ultimaOT);

            // Guardar la última OT en una variable global para usarla en otras funciones
            window.ultimaOTrealizada = ultimaOT.OT;

            // Actualizar título del modal con la OT encontrada
            const modalTitle = document.getElementById('productionModalLabel');
            if (modalTitle) {
                modalTitle.textContent = `Última Producción - OT ${ultimaOT.OT}`;
            }

            // Crear una consulta personalizada para obtener los datos de producción de esta OT específica
            // Esta es una URL ficticia que deberías reemplazar con un endpoint real que consulte directamente la tabla Production
            // O implementar una nueva solución en el backend

            // Por ahora, intentemos usar GetAllProduction y buscar manualmente los datos de la OT deseada
            return Promise.all([
                fetch('http://localhost:63152/api/Production/GetAllProduction')
                    .then(response => {
                        if (!response.ok) throw new Error('Error al cargar datos de producción');
                        return response.json();
                    }),
                Promise.resolve(ultimaOT)
            ]);
        })
        .then(([produccionData, ultimaOT]) => {
            // Filtrar datos de producción para la última OT
            let otProduccion = produccionData.filter(item => item.OT === ultimaOT.OT);

            // Si no hay datos para esta OT en la vista, podríamos implementar una solución alternativa aquí
            // Por ejemplo, podríamos crear un nuevo endpoint que consulte directamente la tabla Production

            // Como solución temporal, si no hay datos, mostrar un mensaje explicativo
            if (otProduccion.length === 0) {
                console.warn(`No se encontraron datos de producción para la OT ${ultimaOT.OT} en la vista GetAllProduction. Se usarán valores predeterminados.`);

                // Valores predeterminados para mostrar algo
                const totalProducido = ultimaOT.CANTIDAD || 0; // Usar la cantidad de la orden como aproximación
                const produccionSolicitada = ultimaOT.DEMANDA || 0;
                const performance = "0.00"; // No tenemos un valor real

                // Actualizar el contenedor con los datos predeterminados
                metricsContainer.innerHTML = `
                    <div class="metric-card" 
                        style="flex: 1; text-align: center; background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 0 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                        <div class="metric-icon" style="font-size: 18px; color: #0c169f; margin-bottom: 5px;">
                            <i class="zmdi zmdi-check-circle"></i>
                        </div>
                        <div class="metric-value" style="font-size: 18px; font-weight: bold; color: #333;">${totalProducido.toLocaleString()}</div>
                        <div class="metric-label" style="font-size: 12px; color: #666;">Producido</div>
                    </div>

                    <div class="metric-card" 
                        style="flex: 1; text-align: center; background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 0 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                        <div class="metric-icon" style="font-size: 18px; color: #e74a3b; margin-bottom: 5px;">
                            <i class="zmdi zmdi-assignment-o"></i>
                        </div>
                        <div class="metric-value" style="font-size: 18px; font-weight: bold; color: #333;">${produccionSolicitada.toLocaleString()}</div>
                        <div class="metric-label" style="font-size: 12px; color: #666;">Demanda</div>
                    </div>

                    <div class="metric-card" 
                        style="flex: 1; text-align: center; background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 0 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                        <div class="metric-icon" style="font-size: 18px; color: #1cc88a; margin-bottom: 5px;">
                            <i class="zmdi zmdi-trending-up"></i>
                        </div>
                        <div class="metric-value" style="font-size: 18px; font-weight: bold; color: #333;">${performance}%</div>
                        <div class="metric-label" style="font-size: 12px; color: #666;">Performance</div>
                    </div>
                    
                    <div style="width: 100%; text-align: center; margin-top: 10px; font-size: 12px; color: #dc3545;">
                        <i class="zmdi zmdi-info-outline"></i> Los datos de producción para la OT ${ultimaOT.OT} no están completos en el sistema.
                    </div>
                `;

                // Almacenar los datos para uso posterior
                window.ultimaProduccionData = {
                    producido: totalProducido,
                    demanda: produccionSolicitada,
                    performance: performance,
                    ot: ultimaOT.OT
                };

                console.log('Datos de Última Producción (predeterminados):', window.ultimaProduccionData);

                // También actualizar las tablas
                actualizarTablasProduccion(ultimaOT.OT);

                return; // Salir de la función
            }

            // Si hay datos, continuar con el procesamiento normal
            // Calcular producción total
            const totalProducido = otProduccion.reduce((sum, item) => {
                return sum + (typeof item.PRODUCIDO === 'number' ? item.PRODUCIDO : 0);
            }, 0);

            // Obtener la demanda desde la orden de trabajo
            const produccionSolicitada = ultimaOT.DEMANDA;

            // Obtener el performance
            // Obtener el último registro de producción (ordenado por fecha)
            const produccionOrdenada = [...otProduccion].sort((a, b) =>
                new Date(b.FECHA) - new Date(a.FECHA)
            );

            // Calcular el performance como porcentaje de lo producido respecto a lo solicitado
            let performance = 0;
            if (produccionOrdenada.length > 0 && produccionOrdenada[0].PERFORMANCE) {
                // El performance viene como número entero (9308.0 para 93.08%)
                performance = (produccionOrdenada[0].PERFORMANCE).toFixed(2);
            } else if (produccionSolicitada > 0) {
                // Calcularlo si no está disponible
                performance = ((totalProducido / produccionSolicitada) * 100).toFixed(2);
            }

            // Actualizar el contenedor con los datos dinámicos
            metricsContainer.innerHTML = `
                <div class="metric-card" 
                    style="flex: 1; text-align: center; background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 0 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <div class="metric-icon" style="font-size: 18px; color: #0c169f; margin-bottom: 5px;">
                        <i class="zmdi zmdi-check-circle"></i>
                    </div>
                    <div class="metric-value" style="font-size: 18px; font-weight: bold; color: #333;">${totalProducido.toLocaleString()}</div>
                    <div class="metric-label" style="font-size: 12px; color: #666;">Producido</div>
                </div>

                <div class="metric-card" 
                    style="flex: 1; text-align: center; background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 0 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <div class="metric-icon" style="font-size: 18px; color: #e74a3b; margin-bottom: 5px;">
                        <i class="zmdi zmdi-assignment-o"></i>
                    </div>
                    <div class="metric-value" style="font-size: 18px; font-weight: bold; color: #333;">${produccionSolicitada.toLocaleString()}</div>
                    <div class="metric-label" style="font-size: 12px; color: #666;">Demanda</div>
                </div>

                <div class="metric-card" 
                    style="flex: 1; text-align: center; background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 0 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <div class="metric-icon" style="font-size: 18px; color: #1cc88a; margin-bottom: 5px;">
                        <i class="zmdi zmdi-trending-up"></i>
                    </div>
                    <div class="metric-value" style="font-size: 18px; font-weight: bold; color: #333;">${performance}%</div>
                    <div class="metric-label" style="font-size: 12px; color: #666;">Performance</div>
                </div>
            `;

            // Almacenar los datos para uso posterior si es necesario
            window.ultimaProduccionData = {
                producido: totalProducido,
                demanda: produccionSolicitada,
                performance: performance,
                ot: ultimaOT.OT
            };

            console.log('Datos de Última Producción cargados correctamente:', window.ultimaProduccionData);

            // Actualizar tablas si ya están inicializadas
            actualizarTablasProduccion(ultimaOT.OT);
        })
        .catch(error => {
            console.error('Error al cargar datos de Última Producción:', error);

            // Mostrar mensaje de error en el contenedor con botón para reintentar
            metricsContainer.innerHTML = `
                <div style="width: 100%; text-align: center; padding: 20px; color: #dc3545;">
                    <i class="zmdi zmdi-alert-circle-o" style="font-size: 24px;"></i>
                    <p class="mt-2">Error al cargar los datos. Por favor, intente de nuevo más tarde.</p>
                    <button class="btn btn-sm btn-outline-danger mt-2" onclick="cargarUltimaProduccion()">
                        <i class="zmdi zmdi-refresh"></i> Reintentar
                    </button>
                </div>
            `;
        });
}



document.addEventListener('DOMContentLoaded', function () {
    // Cargar los datos de la última OT realizada
    cargarUltimaProduccion();

    // Inicializar tablas adaptadas para mostrar la última OT realizada
    initTables();

    // Agregar evento para actualizar cuando se abra el modal
    document.querySelector('.btn-consultar[data-bs-target="#productionModal"]')?.addEventListener('click', function () {
        // Recargar datos actualizados
        cargarUltimaProduccion();
    });
});

// 2. Órdenes de Trabajo (gráfico circular)
function initOrdenesTrabajoChart() {
    const container = document.getElementById('ordenes-trabajo-container');
    if (!container) return;

    $.ajax({
        url: 'http://localhost:63152/api/WorkOrders/GetAllWorkOrders',
        success: function (workOrdersData) {
            // Contar órdenes por estado
            const realizadas = workOrdersData.filter(item => item.ESTADO === 'REALIZADA').length;
            const pendientes = workOrdersData.filter(item => item.ESTADO === 'PENDIENTE').length;

            Highcharts.chart('ordenes-trabajo-container', {
                chart: {
                    type: 'pie',
                    backgroundColor: 'transparent'
                },
                title: {
                    text: undefined
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.y} ({point.percentage:.1f}%)</b>'
                },
                accessibility: {
                    point: {
                        valueSuffix: '%'
                    }
                },
                plotOptions: {
                    pie: {
                        innerSize: '60%',
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.y}'
                        }
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    itemStyle: {
                        fontSize: '12px'
                    }
                },
                series: [{
                    name: 'Órdenes',
                    colorByPoint: true,
                    data: [{
                        name: 'Pendientes',
                        y: pendientes,
                        color: '#0c169f'
                    }, {
                        name: 'Realizadas',
                        y: realizadas,
                        color: '#1cc88a'
                    }]
                }]
            });
        },
        error: function (xhr, status, error) {
            console.error("Error al cargar datos de órdenes de trabajo:", error);
            container.innerHTML = '<div class="error-message">Error al cargar datos de órdenes de trabajo</div>';
        }
    });
}

// 3. Producción por Temporada (barras) - Modificado para ordenar de mayor a menor
function initProduccionTemporadaChart() {
    const container = document.getElementById('produccion-temporada-container');
    if (!container) return;

    // Mostrar mensaje de carga mientras se obtienen los datos
    container.innerHTML = '<div class="loading-message">Cargando datos de producción...</div>';

    // Arrays para almacenar los nombres de tortas y cantidades
    let datosProduccion = [];
    let promesasCargadas = 0;
    const totalPromesas = 3;

    // Función para actualizar el gráfico cuando todos los datos estén cargados
    function actualizarGrafico() {
        // Ordenar los datos de mayor a menor cantidad
        datosProduccion.sort((a, b) => b.cantidad - a.cantidad);

        // Separar los arrays para el gráfico
        const tortas = datosProduccion.map(item => item.nombre);
        const cantidades = datosProduccion.map(item => item.cantidad);

        Highcharts.chart('produccion-temporada-container', {
            chart: {
                type: 'column',
                backgroundColor: 'transparent'
            },
            title: {
                text: undefined
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: tortas,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Cantidad'
                },
                labels: {
                    formatter: function () {
                        return this.value.toLocaleString();
                    }
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.0f}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                    borderRadius: 5
                }
            },
            series: [{
                name: 'Producción Temporada 2025',
                color: '#0c169f',
                data: cantidades
            }]
        });
    }

    // 1. Obtener datos de la torta Cookies and Cream
    $.ajax({
        url: 'http://localhost:63152/api/production/report/gridocookie',
        success: function (data) {
            datosProduccion.push({
                nombre: 'Grido Cookie and Cream',
                cantidad: data.TotalCantidad
            });

            promesasCargadas++;

            // Verificar si ya se cargaron las tres APIs
            if (promesasCargadas === totalPromesas) {
                actualizarGrafico();
            }
        },
        error: function (xhr, status, error) {
            console.error("Error al cargar datos de Cookies and Cream:", error);
            datosProduccion.push({
                nombre: 'Grido Cookie and Cream',
                cantidad: 0
            });

            promesasCargadas++;

            if (promesasCargadas === totalPromesas) {
                actualizarGrafico();
            }
        }
    });

    // 2. Obtener datos de la torta Mousse
    $.ajax({
        url: 'http://localhost:63152/api/production/report/mousse',
        success: function (data) {
            datosProduccion.push({
                nombre: 'Grido Mousse',
                cantidad: data.TotalCantidad
            });

            promesasCargadas++;

            if (promesasCargadas === totalPromesas) {
                actualizarGrafico();
            }
        },
        error: function (xhr, status, error) {
            console.error("Error al cargar datos de Mousse:", error);
            datosProduccion.push({
                nombre: 'Grido Mousse',
                cantidad: 0
            });

            promesasCargadas++;

            if (promesasCargadas === totalPromesas) {
                actualizarGrafico();
            }
        }
    });

    // 3. Obtener datos de la torta Grido con Relleno
    $.ajax({
        url: 'http://localhost:63152/api/production/report/tortagrido',
        success: function (data) {
            datosProduccion.push({
                nombre: 'Grido con Relleno',
                cantidad: data.TotalCantidad
            });

            promesasCargadas++;

            if (promesasCargadas === totalPromesas) {
                actualizarGrafico();
            }
        },
        error: function (xhr, status, error) {
            console.error("Error al cargar datos de Torta Grido con Relleno:", error);
            datosProduccion.push({
                nombre: 'Grido con Relleno',
                cantidad: 0
            });

            promesasCargadas++;

            if (promesasCargadas === totalPromesas) {
                actualizarGrafico();
            }
        }
    });
}

// Función actualizada para el gráfico de Producción Anual con rango abril 2024 a mayo 2025
function initProduccionAnualChart() {
    const container = document.getElementById('produccion-anual-container');
    if (!container) return;

    // Mostrar mensaje de carga mientras se obtienen los datos
    container.innerHTML = '<div class="loading-message">Cargando datos de producción anual...</div>';

    // Obtener datos de la API CORRECTA
    $.ajax({
        url: 'http://localhost:63152/api/Production/GetAllProduction',
        success: function (data) {
            // Filtrar datos desde abril 2024 hasta mayo 2025 (actualizado)
            const fechaInicio = new Date(2024, 4, 1); // Mayo 2024 (0-indexed months, donde 3 = abril)
            const fechaFin = new Date(2025, 3, 31); // Abril 2025 (0-indexed months, donde 4 = mayo)

            // Nombres exactos de productos a filtrar
            const productosAFiltrar = [
                "PACK TORTA COOKIES AND MOUSSE - GRIDO",
                "PACK TORTA GRIDO CON RELLENO - GRIDO",
                "PACK TORTA COOKIES AND CREAM - GRIDO"
            ];

            // Función para mapear nombres de productos a series
            const mapProductoASerie = (producto) => {
                if (producto === "PACK TORTA COOKIES AND CREAM - GRIDO") {
                    return "Grido Cookie and Cream";
                } else if (producto === "PACK TORTA COOKIES AND MOUSSE - GRIDO") {
                    return "Grido Mousse";
                } else if (producto === "PACK TORTA GRIDO CON RELLENO - GRIDO") {
                    return "Grido con Relleno";
                } else {
                    return "Otros";
                }
            };

            // Filtrar datos en el rango de fechas y agrupar por producto y mes
            const produccionPorProductoYMes = {};

            data.forEach(item => {
                // Verificar que la fecha sea válida y el producto esté en nuestra lista
                if (!item.FECHA || !productosAFiltrar.includes(item.PRODUCTO)) return;

                // Parsear la fecha (formato: 2024-11-07T00:00:00)
                const fechaStr = item.FECHA;
                const fecha = new Date(fechaStr);

                // Verificar que la fecha esté en el rango deseado
                if (fecha >= fechaInicio && fecha <= fechaFin) {
                    // Determinar a qué serie pertenece
                    const nombreSerie = mapProductoASerie(item.PRODUCTO);

                    // Obtener año y mes de la fecha
                    const año = fecha.getFullYear();
                    const mes = fecha.getMonth(); // 0-indexed (0=enero, 11=diciembre)

                    // Crear clave para agrupar por año-mes y serie
                    const clave = `${año}-${mes}-${nombreSerie}`;

                    // Inicializar si no existe
                    if (!produccionPorProductoYMes[clave]) {
                        produccionPorProductoYMes[clave] = 0;
                    }

                    // Sumar la cantidad PRODUCIDO (en lugar de CANTIDAD)
                    produccionPorProductoYMes[clave] += parseFloat(item.PRODUCIDO || 0);
                }
            });

            console.log("Datos procesados:", produccionPorProductoYMes);

            // Preparar datos para el gráfico
            const meses = [];
            const series = {
                "Grido Cookie and Cream": [],
                "Grido Mousse": [],
                "Grido con Relleno": []
            };

            // Generar array de meses desde abril 2024 hasta mayo 2025 (14 meses)
            for (let m = 0; m < 14; m++) {
                const fecha = new Date(2024, 3 + m, 1); // Empezar en abril 2024
                const año = fecha.getFullYear();
                const mes = fecha.getMonth();

                // Nombre del mes para mostrar en el gráfico
                const nombreMes = fecha.toLocaleString('es', { month: 'short' });
                meses.push(nombreMes + " " + año); // Añadir año para mayor claridad

                // Inicializar datos para cada serie en este mes
                Object.keys(series).forEach(nombreSerie => {
                    const clave = `${año}-${mes}-${nombreSerie}`;
                    series[nombreSerie].push(produccionPorProductoYMes[clave] || 0);
                });
            }

            console.log("Series de datos para el gráfico:", series);

            // Crear el gráfico
            Highcharts.chart('produccion-anual-container', {
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent'
                },
                title: {
                    text: undefined
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    categories: meses,
                    crosshair: true,
                    labels: {
                        rotation: -45, // Rotar etiquetas para mejor visualización
                        style: {
                            fontSize: '11px'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Cantidad'
                    },
                    labels: {
                        formatter: function () {
                            return this.value.toLocaleString();
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.0f}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'top',
                    borderWidth: 0
                },
                plotOptions: {
                    line: {
                        marker: {
                            radius: 3
                        },
                        lineWidth: 3
                    }
                },
                series: [
                    {
                        name: 'Grido Cookie and Cream',
                        color: '#0e2238',
                        data: series['Grido Cookie and Cream']
                    },
                    {
                        name: 'Grido Mousse',
                        color: '#f6c23e',
                        data: series['Grido Mousse']
                    },
                    {
                        name: 'Grido con Relleno',
                        color: '#e74a3b',
                        data: series['Grido con Relleno']
                    }
                ]
            });
        },
        error: function (xhr, status, error) {
            console.error("Error al cargar datos de producción anual:", error);
            container.innerHTML = '<div class="error-message">Error al cargar datos de producción anual. Por favor, intente nuevamente más tarde.</div>';
        }
    });
}

//BALANCE DE MASAS
function initBalanceMasasChart() {
    const container = document.getElementById('balance-highchart-container');
    if (!container) {
        console.error('El contenedor balance-highchart-container no existe');
        return;
    }

    // Limpiar el contenedor antes de crear un nuevo gráfico
    container.innerHTML = '';

    // Agregar un contenedor para el estilo highcharts-figure
    container.className = 'highchart-wrapper highcharts-figure';

    $.ajax({
        url: 'http://localhost:63152/api/TheoricalConsumption/Consolidadobm',
        success: function (balanceData) {
            // Calcular totales
            const totales = balanceData.reduce((acc, item) => {
                return {
                    teorico: acc.teorico + parseFloat(item.TEORICO || 0),
                    real: acc.real + parseFloat(item.REAL || 0),
                    desvio: acc.desvio + parseFloat(item.DESVIO || 0)
                };
            }, { teorico: 0, real: 0, desvio: 0 });

            // Configurar gráfico de barras horizontales
            Highcharts.chart('balance-highchart-container', {
                chart: {
                    type: 'bar',
                    backgroundColor: 'transparent',
                    height: '100%',
                    reflow: true
                },
                title: {
                    text: undefined
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    categories: ['Balance de Masas'],
                    title: {
                        text: null
                    },
                    gridLineWidth: 0,
                    lineWidth: 0
                },
                yAxis: {
                    min: 500000,
                    title: {
                        text: 'Cantidad Total',
                        align: 'high'
                    },
                    labels: {
                        formatter: function () {
                            return this.value.toLocaleString();
                        },
                        overflow: 'justify'
                    },
                    gridLineWidth: 0
                },
                tooltip: {
                    formatter: function () {
                        let value = this.y;
                        if (this.series.name === 'Desvío Total' && totales.desvio < 0) {
                            value = -value;
                        }
                        return `<b>${this.series.name}</b>: ${value.toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}`;
                    }
                },
                plotOptions: {
                    bar: {
                        borderRadius: 5,
                        dataLabels: {
                            enabled: true,
                            formatter: function () {
                                return this.y.toLocaleString(undefined, {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                });
                            }
                        },
                        groupPadding: 0.1
                    }
                },
                legend: {
                    align: 'center',
                    verticalAlign: 'top',
                    itemStyle: {
                        fontSize: '12px'
                    }
                },
                exporting: {
                    enabled: true
                },
                series: [{
                    name: 'Consumo Teórico',
                    data: [Math.abs(totales.teorico)],
                    color: '#0c169f'
                }, {
                    name: 'Consumo Real',
                    data: [Math.abs(totales.real)],
                    color: '#1cc88a'
                }, {
                    name: 'Desvío Total',
                    data: [Math.abs(totales.desvio)],
                    color: '#e74a3b'
                }]
            });
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener datos para el balance de masas:', error);
            container.innerHTML = `
                <div style="height: 100%; display: flex; align-items: center; justify-content: center;">
                    <p style="color: red; text-align: center;">Error al cargar los datos del balance de masas</p>
                </div>
            `;
        }
    });

    // Agregar estilos para hacer el gráfico responsive y con scroll si es necesario
    const style = document.createElement('style');
    style.textContent = `
        .highcharts-figure,
        .highcharts-data-table table {
            min-width: 310px;
            max-width: 100%;
            margin: 0 auto;
        }
        
        #balance-highchart-container {
            height: 400px;
            overflow: visible;
        }
        
        .highcharts-data-table table {
            font-family: Verdana, sans-serif;
            border-collapse: collapse;
            border: 1px solid #ebebeb;
            margin: 10px auto;
            text-align: center;
            width: 100%;
            max-width: 500px;
        }
        
        .highcharts-data-table caption {
            padding: 1em 0;
            font-size: 1.2em;
            color: #555;
        }
        
        .highcharts-data-table th {
            font-weight: 600;
            padding: 0.5em;
        }
        
        .highcharts-data-table td,
        .highcharts-data-table th,
        .highcharts-data-table caption {
            padding: 0.5em;
        }
        
        .highcharts-data-table thead tr,
        .highcharts-data-table tr:nth-child(even) {
            background: #f8f8f8;
        }
        
        .highcharts-data-table tr:hover {
            background: #f1f7ff;
        }
        
        .highcharts-description {
            margin: 0.3rem 10px;
        }
        
        /* Asegurar que el gráfico no se corte */
        .highcharts-container {
            overflow: visible !important;
        }
        
        /* Permitir scroll si el contenido es demasiado grande */
        .chart-container-large {
            overflow: auto !important;
            max-height: 500px;
        }
    `;

    // Añadir los estilos solo si no existen ya
    if (!document.getElementById('balance-chart-styles')) {
        style.id = 'balance-chart-styles';
        document.head.appendChild(style);
    }
}




// Función principal para inicializar todo
function initializeAllHighcharts() {
    // Prepara los contenedores, reemplazando los elementos canvas por divs para Highcharts
    prepareContainers();

    // Inicializa todos los gráficos con Highcharts
    initHighcharts();

    // Inicializa las tablas y contadores (mantenemos estas funciones tal como están)
    if (typeof initTables === 'function') initTables();
    if (typeof actualizarContadores === 'function') actualizarContadores();
}

// Prepara los contenedores para Highcharts
function prepareContainers() {
    // Función auxiliar para reemplazar canvas por div
    function replaceCanvasWithDiv(canvasId, newDivId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return false;

        const container = canvas.parentElement;
        const newDiv = document.createElement('div');
        newDiv.id = newDivId;
        newDiv.style.width = '100%';
        newDiv.style.height = '100%';

        container.replaceChild(newDiv, canvas);
        return true;
    }

    // Reemplazar cada canvas por un div para Highcharts
    replaceCanvasWithDiv('productionPieChart', 'ultima-produccion-container');
    replaceCanvasWithDiv('workDistribution', 'ordenes-trabajo-container');
    replaceCanvasWithDiv('monthlyProduction', 'produccion-temporada-container');
    replaceCanvasWithDiv('comparativeChart', 'produccion-ot-container');
    replaceCanvasWithDiv('mainMetrics', 'produccion-anual-container');

    // Balance de Masas ya está preparado
}

// Actualizar la función window.onload o document.ready
$(document).ready(function () {
    initializeAllHighcharts();

    // Carga de scripts adicionales de Highcharts si fuera necesario
    loadHighchartsModules();
});

// Función para cargar módulos adicionales de Highcharts si fuera necesario
function loadHighchartsModules() {
    // Si necesitas más módulos de Highcharts, puedes cargarlos aquí
    if (typeof Highcharts !== 'undefined') {
        // Configuraciones globales de Highcharts
        Highcharts.setOptions({
            lang: {
                thousandsSep: '.',
                decimalPoint: ','
            },
            colors: ['#0c169f', '#1cc88a', '#e74a3b', '#f6c23e', '#4e73df']
        });
    }
}



// 1. Configuración global para Highcharts
function configureHighcharts() {
    // Configuraciones globales comunes para todos los gráficos
    if (typeof Highcharts !== 'undefined') {
        Highcharts.setOptions({
            exporting: {
                enabled: false
            },
            lang: {
                thousandsSep: '.',
                decimalPoint: ','
            },
            colors: ['#0c169f', '#1cc88a', '#e74a3b', '#f6c23e', '#4e73df'],
            chart: {
                style: {
                    fontFamily: "'RobotoRegular', sans-serif" // Fuente consistente
                },
                events: {
                    // Corregir problema de superposición del menú
                    beforeShowContextMenu: function () {
                        // Ajustar botones consultar
                        $('.btn-consultar').css('z-index', 5);
                    },
                    afterHideContextMenu: function () {
                        // Restaurar z-index
                        $('.btn-consultar').css('z-index', 10);
                    }
                }
            },
            // Mejora de accesibilidad y tooltips
            tooltip: {
                outside: true // Para evitar problemas de superposición
            },
            // Mejora para leyendas
            legend: {
                itemDistance: 8,
                itemMarginBottom: 5
            }
        });
    }
}

// 2. Ajustes a los gráficos de dona para corregir visualización y tamaño
function fixPieChartsConfig() {
    // Configuración común para gráficos de dona
    const pieChartDefaults = {
        chart: {
            type: 'pie',
            backgroundColor: 'transparent',
            // Asegurar renderizado completo
            margin: [0, 0, 0, 0],
            // Tamaño dinámico basado en contenedor
            height: '100%',
            events: {
                // Ajuste después de renderizar
                render: function () {
                    // Ajustar posición de leyendas si es necesario
                    if (this.legend && this.legend.options.align === 'right') {
                        this.reflow();
                    }
                }
            }
        },
        plotOptions: {
            pie: {
                innerSize: '60%',
                size: '90%', // Asegurar que el gráfico no sea demasiado grande
                allowPointSelect: true,
                cursor: 'pointer',
                borderWidth: 0, // Eliminar bordes
                dataLabels: {
                    distance: -25, // Ajustar etiquetas
                    style: {
                        textOutline: 'none', // Mejorar legibilidad
                        fontWeight: 'normal'
                    }
                },
                showInLegend: true,
                // Posición central para textos
                center: ['50%', '50%']
            }
        }
    };

    // Aplicar configuración a gráficos específicos
    // 1. Última Producción
    const ultimaProduccionConfig = window.ultimaProduccionChart?.userOptions;
    if (ultimaProduccionConfig) {
        window.ultimaProduccionChart.update(Highcharts.merge(pieChartDefaults, {}));
    }

    // 2. Órdenes de Trabajo
    const ordenesTrabajoConfig = window.ordenesTrabajoChart?.userOptions;
    if (ordenesTrabajoConfig) {
        window.ordenesTrabajoChart.update(Highcharts.merge(pieChartDefaults, {
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            }
        }));
    }
}

// 3. Fix para el error de SweetAlert
function fixSweetAlertError() {
    // Verificar si Swal existe pero está causando un error
    if (typeof Swal !== 'undefined' && typeof swal !== 'undefined' && !swal.init) {
        // Proporcionar una implementación temporal
        swal.init = function () {
            console.log('SweetAlert init polyfill');
            return Swal.isVisible();
        };
    }
}







// Tabla de Stock Final - Versión corregida para mostrar la última OT REALIZADA
function initStockTable() {
    // Destruir la tabla existente si ya está inicializada
    if ($.fn.DataTable.isDataTable('#stockTable')) {
        $('#stockTable').DataTable().destroy();
    }

    // Primero obtenemos la última OT realizada y luego inicializamos la tabla
    $.ajax({
        url: 'http://localhost:63152/api/WorkOrders/GetAllWorkOrders',
        success: function (workOrdersData) {
            // Filtrar órdenes con estado REALIZADA
            const realizadas = workOrdersData.filter(item => item.ESTADO === 'REALIZADA');

            // Ordenar por fecha descendente (asumiendo que hay un campo FECHA o similar)
            realizadas.sort((a, b) => {
                if (a.FECHA && b.FECHA) {
                    return new Date(b.FECHA) - new Date(a.FECHA);
                }
                // Ordenar por número de OT si no hay fechas
                return b.OT - a.OT;
            });

            // Obtener la última OT realizada
            const ultimaOT = realizadas.length > 0 ? realizadas[0].OT : null;

            // Guardar la última OT en una variable global para usarla en otras funciones
            window.ultimaOTRealizada = ultimaOT;

            if (ultimaOT) {
                // Actualizar el título del modal con la OT
                $('#stockModalLabel').text(`Stock Final - Orden de Trabajo ${ultimaOT}`);

                // Inicializar la tabla con la OT encontrada
                let stockTable = $('#stockTable').DataTable({
                    ajax: {
                        url: 'http://localhost:63152/api/ProductionStore/GetAllProductionStore',
                        dataSrc: function (data) {
                            // Filtrar por la última OT y tipo de movimiento STOCK FINAL
                            return data.filter(item =>
                                item.OT === ultimaOT && item.TIPOMOV === 'STOCK FINAL'
                            );
                        }
                    },
                    columns: [
                        {
                            data: "FECHAMOV",
                            render: function (data) {
                                return new Date(data).toLocaleDateString();
                            }
                        },
                        { data: "TURNO" },
                        { data: "RESPONSABLE" },
                        {
                            data: "OT",
                            className: "text-right"
                        },
                        { data: "MATERIAL" },
                        {
                            data: "CANTIDAD",
                            className: "text-right",
                            render: function (data) {
                                return parseFloat(data).toFixed(2) + ' KG';
                            }
                        },
                        { data: "PROVEEDOR" },
                        { data: "LOTE" }
                    ],
                    language: window.dataTablesLanguage,
                    initComplete: function () {
                        $('#stockTable thead th').css({
                            'background-color': '#0e2238',
                            'color': 'white'
                        });
                        $('#stockTable tbody tr').css({
                            'background-color': 'white',
                            'color': 'black'
                        });
                    }
                });
                window.stockTable = stockTable;
            } else {
                // No hay órdenes realizadas, mostrar un mensaje
                $('#stockModalLabel').text('Stock Final - No hay órdenes realizadas');
                $('#stockTable').html('<tr><td colspan="8" class="text-center">No hay órdenes de trabajo realizadas</td></tr>');
            }
        },
        error: function (xhr, status, error) {
            console.error("Error al obtener órdenes de trabajo:", error);
            $('#stockModalLabel').text('Stock Final - Error al cargar datos');
            $('#stockTable').html('<tr><td colspan="8" class="text-center">Error al cargar datos: ' + error + '</td></tr>');
        }
    });
}













// Sobreescribir la función initTables para incluir nuestro filtro de OT
function initTables() {
    // Obtener primero la última OT realizada
    fetch('http://localhost:63152/api/WorkOrders/GetAllWorkOrders')
        .then(response => response.json())
        .then(ordenesData => {
            // Filtrar órdenes con estado REALIZADA
            const ordenesRealizadas = ordenesData.filter(item => item.ESTADO === 'REALIZADA');

            // Ordenar por OT descendente
            ordenesRealizadas.sort((a, b) => b.OT - a.OT);

            // Obtener la última OT realizada
            const ultimaOT = ordenesRealizadas.length > 0 ? ordenesRealizadas[0].OT : null;

            if (!ultimaOT) {
                console.error('No se encontraron órdenes de trabajo realizadas');
                return;
            }

            console.log('Última OT REALIZADA para tablas:', ultimaOT);

            // Guardar en variable global
            window.ultimaOTrealizada = ultimaOT;

            // Verificar si las tablas ya están inicializadas y destruirlas
            if ($.fn.DataTable.isDataTable('#productionTable')) {
                $('#productionTable').DataTable().destroy();
            }
            if ($.fn.DataTable.isDataTable('#theoricalTableInProduction')) {
                $('#theoricalTableInProduction').DataTable().destroy();
            }
            if ($.fn.DataTable.isDataTable('#consolidadoBMTable')) {
                $('#consolidadoBMTable').DataTable().destroy();
            }
            if ($.fn.DataTable.isDataTable('#stockTable')) {
                $('#stockTable').DataTable().destroy();
            }

            // Configuración común para las DataTables
            let commonConfig = {
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: '<i class="zmdi zmdi-file-text"></i> Excel',
                        className: 'btn btn-sm btn-success export-btn',
                        titleAttr: 'Exportar a Excel',
                        exportOptions: {
                            columns: ':visible'
                        }
                    },
                    {
                        extend: 'csvHtml5',
                        text: '<i class="zmdi zmdi-file"></i> CSV',
                        className: 'btn btn-sm btn-info export-btn',
                        titleAttr: 'Exportar a CSV',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }
                ],
                searching: true,
                language: window.dataTablesLanguage || {
                    // configuración de idioma
                }
            };

            // Tabla de Producción (filtrada por la última OT REALIZADA)
            let productionTable = $('#productionTable').DataTable({
                ...commonConfig,
                ajax: {
                    url: 'http://localhost:63152/api/Production/GetAllProduction',
                    dataSrc: function (json) {
                        return json.filter(item => item.OT === ultimaOT);
                    }
                },
                columns: [
                    {
                        data: "FECHA",
                        render: function (data) {
                            return new Date(data).toLocaleDateString();
                        }
                    },
                    { data: "TURNO" },
                    { data: "RESPONSABLE" },
                    {
                        data: "OT",
                        className: "text-right"
                    },
                    { data: "PRODUCTO" },
                    {
                        data: "PRODUCIDO",
                        className: "text-right"
                    },
                    {
                        data: "PERFORMANCE",
                        className: "text-right",
                        render: function (data) {
                            return (data).toFixed(2) + '%';
                        }
                    }
                ],
                responsive: true,
                scrollX: false,
                language: window.dataTablesLanguage,
                initComplete: function () {
                    $('#productionTable thead th').css({
                        'background-color': '#0e2238',
                        'color': 'white'
                    });
                    $('#productionTable tbody tr').css({
                        'background-color': 'white',
                        'color': 'black'
                    });
                }
            });
            window.productionTable = productionTable;

            // Tabla de Balance de Masas con colores en desvíos (filtrada por la última OT REALIZADA)
            let theoricalTableInProduction = $('#theoricalTableInProduction').DataTable({
                ajax: {
                    url: `http://localhost:63152/api/TheoricalConsumption/GetTheoricalConsumption?ot=${ultimaOT}`,
                    dataSrc: ''
                },
                language: window.dataTablesLanguage,
                columns: [
                    { data: "MATERIAL" },
                    {
                        data: "TEORICO",
                        className: "text-right",
                        render: function (data) {
                            return parseFloat(data).toFixed(2) + ' KG';
                        }
                    },
                    {
                        data: "REAL",
                        className: "text-right",
                        render: function (data) {
                            return parseFloat(data).toFixed(2) + ' KG';
                        }
                    },
                    {
                        data: "DESVIO",
                        className: "text-right",
                        render: function (data) {
                            const value = parseFloat(data);
                            const color = value < 0 ? '#dc3545' : '#28a745';
                            return `<span style="color: ${color}">${value.toFixed(2)} KG</span>`;
                        }
                    }
                ],
                initComplete: function () {
                    $('#theoricalTableInProduction thead th').css({
                        'background-color': '#0e2238',
                        'color': 'white'
                    });
                    $('#theoricalTableInProduction tbody tr').css({
                        'background-color': 'white',
                        'color': 'black'
                    });
                }
            });
            window.theoricalTableInProduction = theoricalTableInProduction;

            // Mantener el resto de las tablas igual
            // Tabla para el consolidado de Balance de Masas
            let consolidadoBMTable = $('#consolidadoBMTable').DataTable({
                ...commonConfig,
                searching: true,
                language: window.dataTablesLanguage,
                ajax: {
                    url: 'http://localhost:63152/api/TheoricalConsumption/Consolidadobm',
                    dataSrc: ''
                },
                columns: [
                    { data: "MATERIAL" },
                    {
                        data: "TEORICO",
                        className: "text-right", // Añadimos la clase text-right para alineación
                        render: function (data) {
                            return parseFloat(data).toFixed(2) + ' KG';
                        }
                    },
                    {
                        data: "REAL",
                        className: "text-right", // Añadimos la clase text-right para alineación
                        render: function (data) {
                            return parseFloat(data).toFixed(2) + ' KG';
                        }
                    },
                    {
                        data: "DESVIO",
                        className: "text-right", // Añadimos la clase text-right para alineación
                        render: function (data) {
                            const value = parseFloat(data);
                            const color = value < 0 ? '#dc3545' : '#28a745';
                            return `<span style="color: ${color}; text-align: right;">${value.toFixed(2)} KG</span>`;
                        }
                    },
                    {
                        data: null,
                        className: "text-right", // Añadimos la clase text-right para alineación
                        render: function (data, type, row) {
                            // Código existente para el cálculo del valor en la última columna...
                            const precios = {
                                "DULCE DE LECHE C/CACAO P/SEMBRAR": 1699.47,
                                "DULCE DE LECHE CON CACAO PARA SEMBRAR": 1699.47,
                                "DULCE DE LECHE P/SEMBRAR": 1675.69,
                                "DULCE DE LECHE PARA SEMBRAR": 1675.69,
                                "GALLETA OREO PICADA": 4049.75,
                                "GALLETAS MILKA MOUSSE": 5301.71,
                                "HELADO DE CHOCOLATE": 10000,
                                "HELADO DE CREMA AMERICANA": 10000,
                                "HELADO DE DULCE DE LECHE": 10000,
                                "PREPARADO ALMIBAR STANDART": 247.68,
                                "PREPARADO ALMIBAR STANDART": 247.68,
                                "SALSA DULCE SABOR CHOCOLATE": 1379.57,
                                "TAPA GALLETA SABOR VAINILLA 17 CM": 1862.48
                            };

                            let precioMaterial = 0;
                            const materialName = row.MATERIAL;

                            if (precios[materialName] !== undefined) {
                                precioMaterial = precios[materialName];
                            } else {
                                const keys = Object.keys(precios);
                                for (const key of keys) {
                                    if (key.includes(materialName) || materialName.includes(key)) {
                                        precioMaterial = precios[key];
                                        break;
                                    }
                                }
                            }

                            const desvio = parseFloat(row.DESVIO || 0);
                            const valorDesvio = desvio * precioMaterial;

                            // Modifica la función formatearValor para quitar los decimales
                            function formatearValor(valor) {
                                const valorAbs = Math.abs(valor);
                                if (valorAbs >= 1000000) {
                                    // Redondea al millón más cercano y quita los decimales
                                    return `${Math.round(valorAbs)}M`;
                                } else if (valorAbs >= 1000) {
                                    // Redondea al millar más cercano y quita los decimales
                                    return `${Math.round(valorAbs)}k`;
                                }
                                // Para valores menores a 1000, mantén los decimales si los prefieres
                                // o también puedes redondear con Math.round(valorAbs)
                                return Math.round(valorAbs).toString();
                            }

                            const color = valorDesvio < 0 ? '#dc3545' : '#28a745';
                            const formattedValue = formatearValor(valorDesvio);
                            const fullValue = Math.abs(valorDesvio).toFixed(2);

                            return `<span style="color: ${color}; cursor: help; text-align: right;" 
                                   title="Valor completo: $${fullValue}">${valorDesvio < 0 ? '-' : ''}$${formattedValue}</span>`;
                        }
                    }
                ],
                initComplete: function () {
                    $('#consolidadoBMTable thead th').css({
                        'background-color': '#0e2238',
                        'color': 'white'
                    });
                    $('#consolidadoBMTable tbody tr').css({
                        'background-color': 'white',
                        'color': 'black'
                    });
                }
            });
            window.consolidadoBMTable = consolidadoBMTable;

            // Inicializar la tabla de stock final
            initStockTable(ultimaOT);

            // Actualizar título del modal de producción
            const modalTitle = document.getElementById('productionModalLabel');
            if (modalTitle) {
                modalTitle.textContent = `Última Producción - OT ${ultimaOT}`;
            }
        })
        .catch(error => {
            console.error('Error al obtener órdenes de trabajo:', error);
        });

    // Recargar tablas cuando se abren los modales
    $('#productionModal').on('shown.bs.modal', function () {
        if (window.productionTable) window.productionTable.ajax.reload();
        if (window.theoricalTableInProduction) window.theoricalTableInProduction.ajax.reload();
    });

    $('#balanceModal').on('shown.bs.modal', function () {
        if (window.consolidadoBMTable) window.consolidadoBMTable.ajax.reload();
    });

    $('#stockModal').on('shown.bs.modal', function () {
        if (window.stockTable) {
            window.stockTable.ajax.reload();
        } else {
            initStockTable(window.ultimaOTrealizada);
        }
    });
}

// Función para inicializar la tabla de stock final específica para una OT
function initStockTable(ot) {
    // Destruir la tabla existente si ya está inicializada
    if ($.fn.DataTable.isDataTable('#stockTable')) {
        $('#stockTable').DataTable().destroy();
    }

    // Actualizar el título del modal con la OT
    $('#stockModalLabel').text(`Stock Final - Orden de Trabajo ${ot}`);

    // Inicializar la tabla
    let stockTable = $('#stockTable').DataTable({
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excelHtml5',
                text: '<i class="zmdi zmdi-file-text"></i> Excel',
                className: 'btn btn-sm btn-success export-btn',
                titleAttr: 'Exportar a Excel',
                exportOptions: {
                    columns: ':visible'
                }
            },
            {
                extend: 'csvHtml5',
                text: '<i class="zmdi zmdi-file"></i> CSV',
                className: 'btn btn-sm btn-info export-btn',
                titleAttr: 'Exportar a CSV',
                exportOptions: {
                    columns: ':visible'
                }
            }
        ],
        searching: true,
        ajax: {
            url: 'http://localhost:63152/api/ProductionStore/GetAllProductionStore',
            dataSrc: function (data) {
                // Filtrar por la OT específica y tipo STOCK FINAL
                return data.filter(item =>
                    item.OT === ot && item.TIPOMOV === 'STOCK FINAL'
                );
            }
        },
        columns: [
            {
                data: "FECHAMOV",
                render: function (data) {
                    return new Date(data).toLocaleDateString();
                }
            },
            { data: "TURNO" },
            { data: "RESPONSABLE" },
            {
                data: "OT",
                className: "text-right"
            },
            { data: "MATERIAL" },
            {
                data: "CANTIDAD",
                className: "text-right",
                render: function (data) {
                    return parseFloat(data).toFixed(2) + ' KG';
                }
            },
            { data: "PROVEEDOR" },
            { data: "LOTE" }
        ],
        language: window.dataTablesLanguage,
        initComplete: function () {
            $('#stockTable thead th').css({
                'background-color': '#0e2238',
                'color': 'white'
            });
            $('#stockTable tbody tr').css({
                'background-color': 'white',
                'color': 'black'
            });
        }
    });

    window.stockTable = stockTable;
}

// Función para cargar datos de la última OT realizada
function cargarDatosUltimaOT() {
    // Mostrar un indicador de carga mientras se obtienen los datos
    $('#stockTable tbody').html('<tr><td colspan="8" class="text-center">Cargando datos...</td></tr>');

    // Obtener la última OT realizada
    $.ajax({
        url: 'http://localhost:63152/api/WorkOrders/GetAllWorkOrders',
        success: function (workOrdersData) {
            // Filtrar órdenes con estado REALIZADA
            const realizadas = workOrdersData.filter(item => item.ESTADO === 'REALIZADA');

            // Ordenar por fecha descendente (o por número de OT si no hay fechas)
            realizadas.sort((a, b) => {
                if (a.FECHA && b.FECHA) {
                    return new Date(b.FECHA) - new Date(a.FECHA);
                }
                return b.OT - a.OT;
            });

            // Obtener la última OT realizada
            const ultimaOT = realizadas.length > 0 ? realizadas[0].OT : null;

            // Guardar la última OT en una variable global
            window.ultimaOTRealizada = ultimaOT;

            if (ultimaOT) {
                // Actualizar el título del modal
                $('#stockModalLabel').text(`Stock Final - Orden de Trabajo ${ultimaOT}`);

                // Obtener datos de stock para esta OT
                $.ajax({
                    url: 'http://localhost:63152/api/ProductionStore/GetAllProductionStore',
                    success: function (stockData) {
                        // Filtrar por la última OT y tipo de movimiento STOCK FINAL
                        const stockFinalData = stockData.filter(item =>
                            item.OT === ultimaOT && item.TIPOMOV === 'STOCK FINAL'
                        );

                        if (stockFinalData.length > 0) {
                            // Actualizar la tabla con los nuevos datos
                            window.stockTable.clear().rows.add(stockFinalData).draw();

                            // Aplicar estilos a las filas
                            $('#stockTable tbody tr').css({
                                'background-color': 'white',
                                'color': 'black'
                            });
                        } else {
                            window.stockTable.clear().draw();
                            $('#stockTable tbody').html('<tr><td colspan="8" class="text-center">No hay datos de stock final para esta orden de trabajo</td></tr>');
                        }
                    },
                    error: function (xhr, status, error) {
                        console.error("Error al obtener datos de ProductionStore:", error);
                        $('#stockTable tbody').html('<tr><td colspan="8" class="text-center">Error al cargar datos: ' + error + '</td></tr>');
                    }
                });
            } else {
                // No hay órdenes realizadas
                $('#stockModalLabel').text('Stock Final - No hay órdenes realizadas');
                $('#stockTable tbody').html('<tr><td colspan="8" class="text-center">No hay órdenes de trabajo realizadas</td></tr>');
            }
        },
        error: function (xhr, status, error) {
            console.error("Error al obtener órdenes de trabajo:", error);
            $('#stockModalLabel').text('Stock Final - Error al cargar datos');
            $('#stockTable tbody').html('<tr><td colspan="8" class="text-center">Error al cargar datos: ' + error + '</td></tr>');
        }
    });
}



// Reemplaza la función actualizarValoresDesvio con esta versión
async function actualizarValoresDesvio() {
    try {
        // Obtener precios de materiales
        const materialsResponse = await fetch('http://localhost:63152/api/Materials');
        const materialsData = await materialsResponse.json();

        console.log("Materiales obtenidos:", materialsData);
        console.log("Elementos a actualizar:", $('.valor-desvio').length);

        // Función para formatear números grandes
        function formatearValorCompacto(valor) {
            // Valor absoluto para el formato
            const valorAbs = Math.abs(valor);

            if (valorAbs >= 1000000) {
                // Formato para millones (M)
                return (valorAbs).toFixed(2) + 'M';
            } else if (valorAbs >= 1000) {
                // Formato para miles (k)
                return (valorAbs).toFixed(2) + 'k';
            } else {
                // Formato normal para valores pequeños
                return valorAbs.toFixed(2);
            }
        }

        // Actualizar cada celda de valor en la tabla
        $('.valor-desvio').each(function () {
            const $this = $(this);
            const materialName = $this.data('material');
            const desvio = parseFloat($this.data('desvio'));

            const material = materialsData.find(m => m.MATERIAL === materialName);
            if (material) {
                const precioMaterial = parseFloat(material.PRECIO || 0);
                const valorDesvio = desvio * precioMaterial;

                const color = valorDesvio < 0 ? '#dc3545' : '#28a745';
                const valorFormateado = formatearValorCompacto(valorDesvio);
                const valorCompleto = Math.abs(valorDesvio).toFixed(2);

                // Creamos un span con tooltip o título para mostrar el valor completo al pasar el mouse
                $this.html(`<span style="color: ${color}; cursor: pointer;" 
                                     title="$${valorCompleto}" 
                                     data-bs-toggle="tooltip" 
                                     data-bs-placement="top">
                                  $${valorFormateado}
                               </span>`);
            } else {
                $this.text('$0.00');
            }
        });

        // Inicializar los tooltips de Bootstrap
        $('[data-bs-toggle="tooltip"]').tooltip();

    } catch (error) {
        console.error('Error al actualizar valores de desvío:', error);
        $('.valor-desvio').text('Error');
    }
}



// Reemplazar la función initPieCharts para modificar el gráfico de balance de masas con Highcharts
function initPieCharts() {
    const productionPieCtx = document.getElementById('productionPieChart');
    if (productionPieCtx) {
        $.ajax({
            url: 'http://localhost:63152/api/Production/GetAllProduction',
            success: function (productionData) {
                const otData = productionData.filter(item => item.OT === 4);
                const totalProducido = otData.reduce((sum, item) => sum + item.PRODUCIDO, 0);
                const produccionSolicitada = 1446;

                // Calcular porcentajes
                const porcentajeProducido = ((totalProducido / produccionSolicitada) * 100).toFixed(1);
                const porcentajeFaltante = (100 - porcentajeProducido).toFixed(1);

                new Chart(productionPieCtx, {
                    type: 'doughnut', // Usando doughnut para mejor visualización
                    data: {
                        labels: ['Producción Real', 'Pendiente'],
                        datasets: [{
                            data: [totalProducido, produccionSolicitada - totalProducido],
                            backgroundColor: ['#0c169f', '#e74a3b'],
                            borderWidth: 1,
                            borderColor: '#ffffff'
                        }]
                    },
                    options: {
                        maintainAspectRatio: false,
                        responsive: true,
                        cutout: '60%', // Tamaño del agujero central
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    padding: 20,
                                    usePointStyle: true
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        const label = context.label || '';
                                        const value = context.raw;
                                        const percentage = context.parsed;
                                        return `${label}: ${value.toLocaleString()} (${percentage.toFixed(1)}%)`;
                                    }
                                }
                            },
                            // Agregar título central
                            datalabels: {
                                color: '#ffffff',
                                font: {
                                    weight: 'bold',
                                    size: 13
                                },
                                formatter: (value, context) => {
                                    return `${value.toLocaleString()}\n(${context.chart.data.labels[context.dataIndex]})`;
                                }
                            }
                        }
                    },
                    plugins: [{
                        id: 'centerText',
                        afterDraw: (chart) => {
                            const width = chart.width;
                            const height = chart.height;
                            const ctx = chart.ctx;

                            ctx.restore();
                            ctx.save();
                            ctx.textBaseline = 'middle';
                            ctx.textAlign = 'center';

                            // Título
                            ctx.font = '14px Arial';
                            ctx.fillStyle = '#666';
                            ctx.fillText('OT 4', width / 2, height / 2 - 15);

                            // Valor total
                            ctx.font = 'bold 16px Arial';
                            ctx.fillStyle = '#333';
                            ctx.fillText(`${porcentajeProducido}%`, width / 2, height / 2 + 15);

                            ctx.restore();
                        }
                    }]
                });

                // Agregar información adicional debajo del gráfico
                const container = productionPieCtx.parentElement;
                const infoDiv = document.createElement('div');
                infoDiv.className = 'production-info';
                infoDiv.innerHTML = `
<div class="info-grid">
    <div class="info-item">
        <span class="info-label">Producción Solicitada:</span>
        <span class="info-value">${produccionSolicitada.toLocaleString()}</span>
    </div>
    <div class="info-item">
        <span class="info-label">Producción Real:</span>
        <span class="info-value">${totalProducido.toLocaleString()}</span>
    </div>
    <div class="info-item">
        <span class="info-label">Avance:</span>
        <span class="info-value">${porcentajeProducido}%</span>
    </div>
</div>
`;
                container.appendChild(infoDiv);
            }
        });
    }

    // Estilos para la información adicional
    const style = document.createElement('style');
    style.textContent = `
.production-info {
    margin-top: 15px;
    padding: 10px;
    border-top: 1px solid #eee;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
    text-align: center;
}

.info-item {
    padding: 5px;
}

.info-label {
    display: block;
    font-size: 0.9em;
    color: #666;
    margin-bottom: 3px;
}

.info-value {
    display: block;
    font-size: 1.1em;
    font-weight: bold;
    color: #333;
}
`;
    document.head.appendChild(style);

    // Gráfico de Balance de Masas con Highcharts
    const balancePieChartContainer = document.getElementById('balancePieChart');
    if (balancePieChartContainer) {
        // Crear un contenedor para Highcharts que reemplace el canvas
        const highchartsContainer = document.createElement('div');
        highchartsContainer.id = 'balance-highchart-container';
        highchartsContainer.style.width = '100%';
        highchartsContainer.style.height = '100%';

        // Reemplazar el canvas con el nuevo contenedor
        balancePieChartContainer.parentNode.replaceChild(highchartsContainer, balancePieChartContainer);

        // Agregar un título al gráfico
        const titleElement = document.createElement('h3');
        titleElement.className = 'chart-title';
        titleElement.textContent = 'Balance de Masas Total';
        highchartsContainer.parentNode.insertBefore(titleElement, highchartsContainer);

        // Crear el botón de consulta
        const buttonContainer = document.createElement('div');
        buttonContainer.innerHTML = `
            <button class="btn btn-consultar" data-bs-toggle="modal" data-bs-target="#balanceModal">
                Consultar
            </button>
        `;
        highchartsContainer.parentNode.appendChild(buttonContainer);

        $.ajax({
            url: 'http://localhost:63152/api/TheoricalConsumption/Consolidadobm',
            success: function (balanceData) {
                // Calcular totales
                const totales = balanceData.reduce((acc, item) => {
                    return {
                        teorico: acc.teorico + parseFloat(item.TEORICO || 0),
                        real: acc.real + parseFloat(item.REAL || 0),
                        desvio: acc.desvio + parseFloat(item.DESVIO || 0)
                    };
                }, { teorico: 0, real: 0, desvio: 0 });

                // Configurar y crear el gráfico Highcharts
                Highcharts.chart('balance-highchart-container', {
                    chart: {
                        type: 'column',
                        backgroundColor: 'transparent'
                    },
                    title: {
                        text: undefined // No mostrar título en el gráfico (ya lo agregamos arriba)
                    },
                    credits: {
                        enabled: false // Quitar los créditos de Highcharts
                    },
                    xAxis: {
                        categories: ['Balance de Masas'],
                        labels: {
                            style: {
                                fontSize: '12px'
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Cantidad Total',
                            style: {
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }
                        },
                        labels: {
                            formatter: function () {
                                return this.value.toLocaleString();
                            }
                        }
                    },
                    legend: {
                        align: 'center',
                        verticalAlign: 'top',
                        itemStyle: {
                            fontSize: '12px'
                        }
                    },
                    tooltip: {
                        formatter: function () {
                            let value = this.y;

                            // Si es el desvío y es negativo en los datos originales
                            if (this.series.name === 'Desvío Total' && totales.desvio < 0) {
                                value = -value;
                            }

                            return `<b>${this.series.name}</b>: ${value.toFixed(2)}`;
                        }
                    },
                    plotOptions: {
                        column: {
                            borderWidth: 0,
                            borderRadius: 5
                        }
                    },
                    series: [{
                        name: 'Consumo Teórico',
                        data: [Math.abs(totales.teorico)],
                        color: '#0c169f'
                    }, {
                        name: 'Consumo Real',
                        data: [Math.abs(totales.real)],
                        color: '#1cc88a'
                    }, {
                        name: 'Desvío Total',
                        data: [Math.abs(totales.desvio)],
                        color: '#e74a3b'
                    }]
                });
            },
            error: function (xhr, status, error) {
                console.error('Error al obtener datos para el balance de masas:', error);
                // Mostrar mensaje de error en el contenedor
                highchartsContainer.innerHTML = `
                    <div style="height: 100%; display: flex; align-items: center; justify-content: center;">
                        <p style="color: red; text-align: center;">Error al cargar los datos del balance de masas</p>
                    </div>
                `;
            }
        });
    }

    // Gráfico de Stock Final con checkboxes interactivos
    const stockPieCtx = document.getElementById('stockPieChart');
    if (stockPieCtx) {
        $.ajax({
            url: 'http://localhost:63152/api/ProductionStore/GetAllProductionStore',
            success: function (stockData) {
                const filteredData = stockData.filter(item =>
                    item.OT === 4 && item.TIPOMOV === 'STOCK FINAL'
                );

                let chart = new Chart(stockPieCtx, {
                    type: 'doughnut',
                    data: {
                        labels: filteredData.map(item => item.MATERIAL),
                        datasets: [{
                            data: filteredData.map(item => item.CANTIDAD),
                            backgroundColor: [
                                '#0c169f',    // Azul oscuro
                                '#e74a3b',    // Rojo
                                '#f6c23e',    // Amarillo
                                '#234990',    // Azul medio
                                '#ff8c00',    // Naranja
                                '#1e90ff',
                                '#0e2238'    // Azul claro
                            ],
                            borderWidth: 2,
                            borderColor: '#ffffff'
                        }]
                    },
                    options: {
                        maintainAspectRatio: false,
                        responsive: true,
                        cutout: '60%',
                        plugins: {
                            legend: {
                                position: 'right',
                                labels: {
                                    generateLabels: function (chart) {
                                        const data = chart.data;
                                        if (data.labels.length && data.datasets.length) {
                                            return data.labels.map((label, index) => {
                                                const dataset = data.datasets[0];
                                                const value = dataset.data[index];
                                                return {
                                                    text: `${label}: ${value}`,
                                                    fillStyle: dataset.backgroundColor[index],
                                                    hidden: !chart.getDataVisibility(index),
                                                    lineCap: 'round',
                                                    lineDash: [],
                                                    lineDashOffset: 0,
                                                    lineJoin: 'round',
                                                    strokeStyle: dataset.borderColor,
                                                    pointStyle: 'rect', // Estilo de checkbox
                                                    datasetIndex: 0,
                                                    index: index
                                                };
                                            });
                                        }
                                        return [];
                                    },
                                    boxWidth: 20,
                                    padding: 15,
                                    usePointStyle: true,
                                },
                                onClick: function (e, legendItem, legend) {
                                    const index = legendItem.index;
                                    const chart = legend.chart;

                                    // Cambiar visibilidad del dataset
                                    chart.toggleDataVisibility(index);

                                    // Efecto visual en la leyenda
                                    legendItem.hidden = !chart.getDataVisibility(index);

                                    chart.update();
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        const label = context.label || '';
                                        const value = context.raw;
                                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                        const percentage = ((value / total) * 100).toFixed(1);
                                        return `${label}: ${value} (${percentage}%)`;
                                    }
                                }
                            }
                        }
                    }
                });
            }
        });
    }
}

//highcharts:

// Esta función se puede ejecutar cuando el documento esté listo
function prepareBalanceChart() {
    const balancePieChartContainer = document.querySelector('.chart-container-large');
    if (balancePieChartContainer) {
        // Asegurarnos de que el contenedor tenga las clases adecuadas
        balancePieChartContainer.classList.add('chart-container-large');
        balancePieChartContainer.style.display = 'flex';
        balancePieChartContainer.style.flexDirection = 'column';
        balancePieChartContainer.style.alignItems = 'center';
        balancePieChartContainer.style.justifyContent = 'space-between';

        // Asegurarnos de que tenemos un contenedor para el canvas con las clases adecuadas
        if (!balancePieChartContainer.querySelector('.chart-canvas-container')) {
            const canvasContainer = document.createElement('div');
            canvasContainer.className = 'chart-canvas-container';
            canvasContainer.style.width = '100%';
            canvasContainer.style.height = 'calc(100% - 60px)';

            const canvas = document.createElement('canvas');
            canvas.id = 'balancePieChart';

            canvasContainer.appendChild(canvas);
            balancePieChartContainer.appendChild(canvasContainer);
        }
    }
}




// Reemplazar la función existente calcularInventarioValorizado
async function calcularInventarioValorizado() {
    try {
        // Obtener todas las órdenes de trabajo
        const workOrdersResponse = await fetch('http://localhost:63152/api/WorkOrders/GetAllWorkOrders');
        const workOrdersData = await workOrdersResponse.json();
        
        // Filtrar órdenes con estado "PENDIENTE"
        const ordenesPendientes = workOrdersData.filter(order => order.ESTADO === 'PENDIENTE');
        
        // Obtener la tarjeta y aplicar estilos de manera forzada
        const counterCard = document.querySelector('#inventario-valorizado').closest('.counter-card');
        
        // Aplicar estilo directamente al elemento con !important
        counterCard.setAttribute('style', 'background-color:#f3d83d  !important; color: #000000 !important; border-radius: 8px !important; padding: 15px !important; text-align: center !important; box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important; height: 100% !important; display: flex !important; flex-direction: column !important; justify-content: center !important; margin-bottom: 15px !important;');
        
        // Si no hay órdenes pendientes, mostrar mensaje informativo
        if (ordenesPendientes.length === 0) {
            document.querySelector('#inventario-valorizado').textContent = 'No hay órdenes pendientes';
            
            // Cambiar también el título de la tarjeta para más claridad
            const cardTitle = counterCard.querySelector('h3');
            if (cardTitle) {
                cardTitle.textContent = 'ORDEN PENDIENTE';
                cardTitle.style.cssText = 'color: #000000 !important; font-size: 0.9rem !important; margin-bottom: 8px !important; font-weight: 600 !important;';
            }
            return;
        }
        
        // Ordenar las órdenes pendientes por OT (asumiendo que números más bajos van primero)
        ordenesPendientes.sort((a, b) => a.OT - b.OT);
        
        // Obtener la primera orden pendiente (la próxima a realizar)
        const proximaOrden = ordenesPendientes[0];
        
        // Cambiar el título de la tarjeta
        const cardTitle = counterCard.querySelector('h3');
        if (cardTitle) {
            cardTitle.textContent = 'ORDEN PENDIENTE';
            cardTitle.style.cssText = 'color: #000000 !important; font-size: 0.9rem !important; margin-bottom: 8px !important; font-weight: 600 !important;';
        }
        
        // Actualizar el contador con la información de OT y PRODUCTO
        const infoElement = document.querySelector('#inventario-valorizado');
        
        // Agregar icono de pendiente y formatar contenido con OT y PRODUCTO
        infoElement.innerHTML = `
            <div style="margin-bottom: 8px;">
                <i class="zmdi zmdi-time-countdown" style="font-size: 1.4rem; margin-right: 8px; vertical-align: middle; color: #000000;"></i>
            </div>
            <div style="font-size: 1.3rem; font-weight: bold; color: #0c169f; margin-bottom: 5px;">OT ${proximaOrden.OT}</div>
            <div style="font-size: 1rem; color: #000000;">${proximaOrden.PRODUCTO || 'Sin producto'}</div>
        `;
        
        // Eliminar cualquier clase de color que pueda existir
        infoElement.classList.remove('text-primary', 'text-info', 'text-warning', 'text-danger');
        
        // Asegurarse de que el texto dentro de la tarjeta sea negro
        Array.from(counterCard.querySelectorAll('*')).forEach(el => {
            if (el.tagName !== 'I' && !el.innerHTML.includes('OT')) { // Preservar el color del icono y el número de OT
                el.style.color = '#000000';
            }
        });
        
    } catch (error) {
        console.error('Error al obtener información de órdenes pendientes:', error);
        document.querySelector('#inventario-valorizado').textContent = 'Error de conexión';
    }
}

// Asegúrate de añadir la función a la lista de contadores que se actualizan
async function actualizarContadores() {
    await calcularInventarioValorizado();
    await calcularDesvioTotal();
    await calcularStockFinalValor();
    
    // Agregar evento de clic al contador de Stock Final
    document.querySelector('#stock-final-counter').addEventListener('click', function () {
        $('#stockModal').modal('show');
    });
}

// Reemplazar la función calcularDesvioTotal() en paste-3.txt (alrededor de línea 711)
async function calcularDesvioTotal() {
    try {
        // Obtener datos de balance de masas
        const balanceResponse = await fetch('http://localhost:63152/api/TheoricalConsumption/Consolidadobm');
        const balanceData = await balanceResponse.json();

        // Obtener precios de materiales
        const materialsResponse = await fetch('http://localhost:63152/api/Materials');
        const materialsData = await materialsResponse.json();

        // Calcular el valor monetario del desvío para cada material
        let desvioTotalValor = 0;

        balanceData.forEach(item => {
            const material = materialsData.find(m => m.MATERIAL === item.MATERIAL);
            if (material) {
                const desvio = parseFloat(item.DESVIO || 0);
                const precioMaterial = parseFloat(material.PRECIO || 0);
                const valorDesvio = desvio * precioMaterial;

                // Agregar el valor monetario del desvío al total
                desvioTotalValor += valorDesvio;
            }
        });

        // Modifica la parte final de la función calcularDesvioTotal() donde actualiza el contador
        document.querySelector('#desvio-total').textContent =
            `-$${Math.abs(desvioTotalValor).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    } catch (error) {
        console.error('Error al calcular desvío total:', error);
        document.querySelector('#desvio-total').textContent = 'Error al calcular';
    }
}

// Función para actualizar todos los contadores
async function actualizarContadores() {
    await calcularInventarioValorizado();
    await calcularDesvioTotal();
}

async function calcularStockFinalValor() {
    try {
        // Obtener la última OT realizada si no está ya guardada
        if (!window.ultimaOTRealizada) {
            const workOrdersResponse = await fetch('http://localhost:63152/api/WorkOrders/GetAllWorkOrders');
            const workOrdersData = await workOrdersResponse.json();
            const realizadas = workOrdersData.filter(item => item.ESTADO === 'REALIZADA');

            realizadas.sort((a, b) => {
                if (a.FECHA && b.FECHA) {
                    return new Date(b.FECHA) - new Date(a.FECHA);
                }
                return b.OT - a.OT;
            });

            window.ultimaOTRealizada = realizadas.length > 0 ? realizadas[0].OT : null;
        }

        if (!window.ultimaOTRealizada) {
            const stockFinalElement = document.querySelector('#stock-final-count');
            if (stockFinalElement) {
                stockFinalElement.textContent = "No hay OT realizada";
            }
            return;
        }

        // Obtener datos de stock final de la última OT
        const stockResponse = await fetch('http://localhost:63152/api/ProductionStore/GetAllProductionStore');
        const stockData = await stockResponse.json();
        const stockFinal = stockData.filter(item =>
            item.OT === window.ultimaOTRealizada && item.TIPOMOV === 'STOCK FINAL'
        );

        // Obtener precios de materiales
        const materialsResponse = await fetch('http://localhost:63152/api/Materials');
        const materialsData = await materialsResponse.json();

        // Calcular el valor total
        let valorTotal = 0;
        stockFinal.forEach(stockItem => {
            const material = materialsData.find(m => m.MATERIAL === stockItem.MATERIAL);
            if (material && material.PRECIO) {
                valorTotal += stockItem.CANTIDAD * material.PRECIO;
            }
        });

        // Actualizar el contador con el nuevo valor calculado
        const stockFinalElement = document.querySelector('#stock-final-count');
        if (stockFinalElement) {
            stockFinalElement.textContent = `$${valorTotal.toLocaleString('es-AR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;

            // También actualizar un info badge con el número de OT
            const stockFinalCounter = document.querySelector('#stock-final-counter');
            if (stockFinalCounter) {
                // Buscar si ya existe el badge
                let badge = stockFinalCounter.querySelector('.ot-badge');
                if (!badge) {
                    badge = document.createElement('div');
                    badge.className = 'ot-badge';
                    badge.style.fontSize = '11px';
                    badge.style.backgroundColor = '#0c169f';
                    badge.style.color = 'white';
                    badge.style.padding = '2px 6px';
                    badge.style.borderRadius = '10px';
                    badge.style.position = 'absolute';
                    badge.style.top = '10px';
                    badge.style.left = '10px';
                    stockFinalCounter.appendChild(badge);
                }
                badge.textContent = `OT ${window.ultimaOTRealizada}`;
            }
        }
    } catch (error) {
        console.error('Error al calcular stock final:', error);
        const stockFinalElement = document.querySelector('#stock-final-count');
        if (stockFinalElement) {
            stockFinalElement.textContent = 'Error';
        }
    }
}

// Actualizar la función actualizarContadores para incluir el nuevo cálculo
async function actualizarContadores() {
    await calcularInventarioValorizado();
    await calcularDesvioTotal();
    await calcularStockFinalValor();
    // Agregar evento de clic al contador de Stock Final
    document.querySelector('#stock-final-counter').addEventListener('click', function () {
        $('#stockModal').modal('show');
    });
}
// El resto de tu código existente continúa aquí...



function initializeAll() {
    // Destruir gráficos existentes
    Chart.helpers.each(Chart.instances, function (instance) {
        instance.destroy();
    });

    // Preparar el contenedor para el gráfico de balance
    prepareBalanceChart();

    // Inicializar los gráficos
    initPieCharts();
    actualizarContadores();
}
// Agregar estos estilos para el contador de Stock Final
const styleElement = document.createElement('style');
styleElement.textContent = `
.counter-clickable {
    cursor: pointer;
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

.counter-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 18px;
    color: #0c169f;
}
`;
document.head.appendChild(styleElement);


// 4. Añadir esto a tu función de inicialización para aplicar los arreglos
function applyHighchartsFixes() {
    // Asegurarse de que los arreglos se aplican después de que Highcharts está listo
    if (typeof Highcharts !== 'undefined') {
        // Configurar el menú contextual para que esté siempre por encima
        // y no afecte el layout de la página
        $(document).on('mousedown', '.highcharts-contextmenu', function (e) {
            // Prevenir que el evento bubbling afecte otros elementos
            e.stopPropagation();

            // Asegurar que el menú esté por encima de todo
            $(this).css('z-index', 9999);
        });

        // Ajustar cualquier menú contextual existente
        $('.highcharts-contextmenu').css('z-index', 9999);
    }
}

// 3. Función para inicializar todas las mejoras
function initializeChartImprovements() {
    // Aplicar correcciones al menú contextual
    fixContextMenuPosition();

    // Observar cambios en el DOM para capturar menús contextuales nuevos
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if (node.classList && node.classList.contains('highcharts-contextmenu')) {
                        fixContextMenuPosition();
                    }
                }
            }
        });
    });

    // Empezar a observar el documento
    observer.observe(document.body, { childList: true, subtree: true });

    // Añadir un manejador global para cerrar los menús contextuales al hacer clic fuera
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.highcharts-contextmenu').length) {
            $('.highcharts-contextmenu').hide();
        }
    });
}

// 5. Modificar la inicialización general
$(document).ready(function () {
    initializeAllHighcharts();
    initTables();
    actualizarContadores();

    // Aplicar los arreglos después de que se inicialicen los gráficos
    setTimeout(applyHighchartsFixes, initializeChartImprovements, 500);

    // Ajustar en cambios de tamaño
    $(window).on('resize', function () {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(function () {
            // Reajustar gráficos
            $('.highcharts-container').each(function () {
                const chart = $(this).highcharts();
                if (chart) chart.reflow();
            });

            // Volver a aplicar los arreglos
            applyHighchartsFixes();
        }, 250);

    });
});

// Agregar estilos CSS para controlar el menú contextual
const style = document.createElement('style');
style.textContent = `
    /* Estilos para controlar el menú contextual */
    .highcharts-contextmenu {
        position: absolute !important;
        z-index: 9999 !important;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        padding: 5px 0;
        overflow: visible !important;
    }
    
    /* Evitar que el contenedor se estire */
    .chart-container {
        overflow: hidden !important;
        position: relative !important;
    }
    
    /* Asegurar que los gráficos permanezcan dentro de sus contenedores */
    .highchart-wrapper {
        overflow: hidden !important;
        position: relative !important;
    }
    
    /* Mejorar la visibilidad de la leyenda */
    .highcharts-legend-item text {
        font-weight: normal !important;
    }
    
    /* Posicionar correctamente el botón consultar */
    .btn-consultar {
        position: relative !important;
        z-index: 5 !important;
    }
`;
document.head.appendChild(style);

// FINALMENTE, AGREGAR ESTOS EVENTOS JUSTO DESPUÉS DE initializeAll:
$('#stockModal').on('shown.bs.modal', function () {
    if (window.stockTable) {
        window.stockTable.ajax.reload();
        actualizarContadores();
    }
});

$('#balanceModal').on('shown.bs.modal', function () {
    actualizarContadores();
});




// Correcciones para el menú contextual de Highcharts y otros problemas
function fixHighchartsIssues() {
    // 1. Corregir problemas de posicionamiento del menú contextual
    function fixContextMenuPosition() {
        document.addEventListener('click', function (e) {
            // Verificar si el clic fue en un botón de menú contextual
            if (e.target.closest('.highcharts-button') || e.target.closest('.highcharts-contextmenu')) {
                // Dar tiempo a que el menú se muestre
                setTimeout(function () {
                    const menu = document.querySelector('.highcharts-contextmenu');
                    if (menu) {
                        // Obtener dimensiones del viewport
                        const viewportWidth = window.innerWidth;
                        const viewportHeight = window.innerHeight;

                        // Obtener dimensiones del menú
                        const menuWidth = menu.offsetWidth;
                        const menuHeight = menu.offsetHeight;

                        // Obtener posición del clic
                        const x = e.clientX;
                        const y = e.clientY;

                        // Calcular posición óptima
                        let newX = x;
                        let newY = y;

                        // Ajustar si sale por la derecha
                        if (x + menuWidth > viewportWidth) {
                            newX = viewportWidth - menuWidth - 10;
                        }

                        // Ajustar si sale por abajo
                        if (y + menuHeight > viewportHeight) {
                            newY = viewportHeight - menuHeight - 10;
                        }

                        // Aplicar nueva posición
                        menu.style.position = 'fixed';
                        menu.style.left = newX + 'px';
                        menu.style.top = newY + 'px';
                        menu.style.zIndex = '9999';
                    }
                }, 10);
            }
        }, true);

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.highcharts-contextmenu') && !e.target.closest('.highcharts-button')) {
                const menus = document.querySelectorAll('.highcharts-contextmenu');
                menus.forEach(menu => {
                    menu.style.display = 'none';
                });
            }
        });
    }

    // 2. Configurar opciones globales de Highcharts
    if (typeof Highcharts !== 'undefined') {
        Highcharts.setOptions({
            navigation: {
                menuItemStyle: {
                    padding: '0.5em 1em',
                    fontSize: '14px'
                },
                menuStyle: {
                    border: '1px solid #ccc',
                    background: '#fff',
                    padding: '5px 0',
                    borderRadius: '4px',
                    boxShadow: '2px 2px 10px rgba(0,0,0,0.3)',
                    zIndex: 9999
                },
                buttonOptions: {
                    theme: {
                        'stroke-width': 1,
                        stroke: '#666',
                        fill: '#f8f8f8',
                        r: 4
                    }
                }
            },
            exporting: {
                buttons: {
                    contextButton: {
                        menuClassName: 'highcharts-contextmenu-fixed',
                        symbol: 'menu',
                        symbolStrokeWidth: 1
                    }
                }
            }
        });
    }

    // 3. Fix para el error de SweetAlert
    if (typeof Swal !== 'undefined' && typeof swal !== 'undefined' && !swal.init) {
        swal.init = function () {
            console.log('SweetAlert init polyfill');
            return Swal.isVisible();
        };
    }

    // Ejecutar la función de corrección del menú contextual
    fixContextMenuPosition();
}

// Cargar estas correcciones cuando el documento esté listo
document.addEventListener('DOMContentLoaded', function () {
    fixHighchartsIssues();

    // Volver a aplicar correcciones después de un resize
    window.addEventListener('resize', function () {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(fixHighchartsIssues, 250);
    });
});




