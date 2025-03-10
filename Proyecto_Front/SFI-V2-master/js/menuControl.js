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


});


// 1. Mejora para el menú contextual de Highcharts - mostrar por fuera y con scroll
Highcharts.setOptions({
    navigation: {
        menuItemStyle: {
            padding: '0.5em 1em',
            color: '#333',
            fontSize: '12px'
        },
        menuStyle: {
            border: '1px solid #ccc',
            background: '#fff',
            padding: '5px 0',
            borderRadius: '4px',
            boxShadow: '2px 2px 8px rgba(0,0,0,0.3)',
            zIndex: 9999,
            overflow: 'auto',           // Permitir scroll si hay muchas opciones
            maxHeight: '300px',         // Altura máxima antes de activar scroll
            position: 'absolute',
            // Colocar el menú fuera de la zona de gráficos
            marginTop: '10px',
            marginLeft: '10px'
        },
        // Asegura que el menú contextual no afecte el tamaño del gráfico
        bindings: {
            contextMenu: function (e) {
                e.stopPropagation();
                e.preventDefault();
                
                // Referencia al gráfico actual
                const chart = this;
                
                // Posición del menú contextual
                let x = e.chartX;
                let y = e.chartY;
                
                // Comprobar si el menú saldría del viewport
                const menuWidth = 150;  // Ancho aproximado del menú
                const menuHeight = 200; // Altura aproximada del menú
                const chartRect = chart.container.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                
                // Ajustar posición si el menú sale del viewport
                if (chartRect.left + x + menuWidth > viewportWidth) {
                    x = Math.max(0, viewportWidth - chartRect.left - menuWidth - 10);
                }
                if (chartRect.top + y + menuHeight > viewportHeight) {
                    y = Math.max(0, viewportHeight - chartRect.top - menuHeight - 10);
                }
                
                // Mostrar el menú contextual en la posición ajustada
                if (chart.contextMenu) {
                    chart.contextMenu.style.left = x + 'px';
                    chart.contextMenu.style.top = y + 'px';
                    chart.contextMenu.style.zIndex = 9999;
                    chart.contextMenu.style.display = 'block';
                }
            }
        }
    }
});

// Función para detectar y corregir menús contextuales fuera de los límites
function fixContextMenuPosition() {
    // Aplicar después de que aparezca cualquier menú contextual
    $(document).on('mousedown', '.highcharts-contextmenu', function() {
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
    initProduccionOTChart();
    
    // 5. Producción Anual (líneas)
    initProduccionAnualChart();
    
    // 6. Balance de Masas (barras) - ya implementado previamente
    initBalanceMasasChart();
}


// 1. Última Producción (gráfico circular)
// 2. Para el gráfico de Última Producción - Mostrar la leyenda siempre visible
function initUltimaProduccionChart() {
    // Función para inicializar el gráfico de Última Producción con los 3 contadores
  window.initUltimaProduccionChart = function() {
    const container = document.getElementById('ultima-produccion-container');
    if (!container) return;
    
    // Obtener datos de producción
    $.ajax({
      url: 'http://localhost:63152/api/Production/GetAllProduction',
      success: function(productionData) {
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
      error: function(xhr, status, error) {
        console.error("Error al cargar datos de producción:", error);
        container.innerHTML = '<div class="error-message">Error al cargar datos de producción</div>';
      }
    });
  };
}

// 2. Órdenes de Trabajo (gráfico circular)
function initOrdenesTrabajoChart() {
    const container = document.getElementById('ordenes-trabajo-container');
    if (!container) return;
    
    $.ajax({
        url: 'http://localhost:63152/api/WorkOrders',
        success: function(workOrdersData) {
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
        error: function(xhr, status, error) {
            console.error("Error al cargar datos de órdenes de trabajo:", error);
            container.innerHTML = '<div class="error-message">Error al cargar datos de órdenes de trabajo</div>';
        }
    });
}

// 3. Producción por Temporada (barras)
function initProduccionTemporadaChart() {
    const container = document.getElementById('produccion-temporada-container');
    if (!container) return;
    
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
            categories: ['Grido Cookie and Cream', 'Grido Mousse', 'Grido con Relleno'],
            crosshair: true
        },
        yAxis: {
            min: 50000,
            max: 95000,
            title: {
                text: 'Cantidad'
            },
            labels: {
                formatter: function() {
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
            name: 'Producción febrero 2025',
            color: '#0c169f',
            data: [70000, 80000, 90000]
        }]
    });
}

// 4. Producción por Órdenes de Trabajo (barras)
function initProduccionOTChart() {
    const container = document.getElementById('produccion-ot-container');
    if (!container) return;
    
    Highcharts.chart('produccion-ot-container', {
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
            categories: ['Grido Cookie and Cream', 'Grido Mousse', 'Grido con Relleno'],
            crosshair: true
        },
        yAxis: {
            min: 50000,
            max: 100000,
            title: {
                text: 'Cantidad',
                style: {
                    fontWeight: 'bold'
                }
            },
            labels: {
                formatter: function() {
                    return this.value.toLocaleString();
                }
            }
        },
        legend: {
            align: 'center',
            verticalAlign: 'top',
            floating: false,
            backgroundColor: undefined,
            shadow: false
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
            name: 'Producción establecida en OT',
            color: '#1cc88a',
            data: [82567, 71230, 90120]
        }, {
            name: 'Producción realizada en OT',
            color: '#0c169f',
            data: [80000, 70000, 90000]
        }]
    });
}

// 5. Producción Anual (líneas)
function initProduccionAnualChart() {
    const container = document.getElementById('produccion-anual-container');
    if (!container) return;
    
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
            categories: ['Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb'],
            crosshair: true
        },
        yAxis: {
            min: 50000,
            max: 110000,
            title: {
                text: 'Cantidad'
            },
            labels: {
                formatter: function() {
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
        series: [{
            name: 'Grido Cookie and Cream',
            color: '#0e2238',
            data: [80000, 82000, 78000, 85000, 88000, 84000, 87000, 90000, 86000, 89000, 85000, 88000]
        }, {
            name: 'Grido Mousse',
            color: '#f6c23e',
            data: [70000, 73000, 71000, 75000, 78000, 74000, 77000, 80000, 76000, 79000, 75000, 78000]
        }, {
            name: 'Grido con Relleno',
            color: '#e74a3b',
            data: [90000, 92000, 88000, 95000, 98000, 94000, 97000, 100000, 96000, 99000, 95000, 98000]
        }]
    });
}

// Función mejorada para el gráfico Balance de Masas
// 3. Mejorar el gráfico de Balance de Masas
function initBalanceMasasChart() {
    const container = document.getElementById('balance-highchart-container');
    if (!container) {
        console.error('El contenedor balance-highchart-container no existe');
        return;
    }
    
    // Limpiar el contenedor antes de crear un nuevo gráfico
    container.innerHTML = '';
    
    $.ajax({
        url: 'http://localhost:63152/api/TheoricalConsumption/Consolidadobm',
        success: function(balanceData) {
            // Calcular totales
            const totales = balanceData.reduce((acc, item) => {
                return {
                    teorico: acc.teorico + parseFloat(item.TEORICO || 0),
                    real: acc.real + parseFloat(item.REAL || 0),
                    desvio: acc.desvio + parseFloat(item.DESVIO || 0)
                };
            }, { teorico: 0, real: 0, desvio: 0 });
            
            // Crear el gráfico con opciones mejoradas
            Highcharts.chart('balance-highchart-container', {
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent',
                    height: '100%',
                    reflow: true,
                    events: {
                        // Controlar dimensiones para evitar desbordamiento
                        load: function() {
                            const chart = this;
                            
                            // Reajustar el gráfico para asegurar que se mantenga
                            // dentro de sus límites al cargar
                            setTimeout(() => {
                                chart.reflow();
                            }, 100);
                        }
                    }
                },
                title: {
                    text: undefined
                },
                credits: {
                    enabled: false
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
                        formatter: function() {
                            return this.value.toLocaleString();
                        }
                    }
                },
                legend: {
                    align: 'center',
                    verticalAlign: 'top',
                    itemStyle: {
                        fontSize: '12px'
                    },
                    // Asegurar que la leyenda no cause desbordamiento
                    floating: false,
                    width: '100%'
                },
                tooltip: {
                    // Configurar el tooltip para que no cause desbordamiento
                    outside: true,
                    useHTML: true,
                    formatter: function() {
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
                        borderRadius: 5,
                        dataLabels: {
                            enabled: true,
                            crop: false,
                            overflow: 'none',
                            formatter: function() {
                                return this.y.toLocaleString(undefined, {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                });
                            }
                        }
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
        error: function(xhr, status, error) {
            console.error('Error al obtener datos para el balance de masas:', error);
            container.innerHTML = `
                <div style="height: 100%; display: flex; align-items: center; justify-content: center;">
                    <p style="color: red; text-align: center;">Error al cargar los datos del balance de masas</p>
                </div>
            `;
        }
    });
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
$(document).ready(function() {
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
                    beforeShowContextMenu: function() {
                        // Ajustar botones consultar
                        $('.btn-consultar').css('z-index', 5);
                    },
                    afterHideContextMenu: function() {
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
                render: function() {
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
        swal.init = function() {
            console.log('SweetAlert init polyfill');
            return Swal.isVisible();
        };
    }
}




















/// Función para inicializar las tablas DataTables
function initTables() {

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
            dom: 'Bfrtip', // Elimina el filtro de entries
            buttons: ['pdfHtml5', 'excelHtml5'],
            searching: false, // Elimina la búsqueda
            language: window.dataTablesLanguage || {
                "decimal": "",
                "emptyTable": "No hay datos disponibles",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
                "infoEmpty": "Mostrando 0 a 0 de 0 registros",
                "infoFiltered": "(filtrado de _MAX_ registros totales)",
                "thousands": ",",
                "search": "Buscar:",
                "zeroRecords": "No se encontraron coincidencias",
                "paginate": {
                    "first": "Primero",
                    "last": "Último",
                    "next": "Siguiente",
                    "previous": "Anterior"
                }
            }
        };



    // Tabla de Producción
     // Tabla de Producción
     let productionTable = $('#productionTable').DataTable({
        ...commonConfig,
        ajax: {
            url: 'http://localhost:63152/api/Production/GetAllProduction',
            dataSrc: function (json) {
                return json.filter(item => item.OT === 4);
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
            { data: "OT" },
            { data: "PRODUCTO" },
            { data: "PRODUCIDO" },
            {
                data: "PERFORMANCE",
                render: function (data) {
                    return (data / 100).toFixed(2) + '%';
                }
            }
        ],
        responsive: true,
        scrollX: false,
        language: window.dataTablesLanguage,
        initComplete: function () {
            // Estilo para el encabezado (thead)
            $('#productionTable thead th').css({
                'background-color': '#0e2238',
                'color': 'white'
            });
            // Estilo para las filas (tbody)
            $('#productionTable tbody tr').css({
                'background-color': 'white',
                'color': 'black'
            });
        }
    });
    window.productionTable = productionTable;



     // Tabla de Balance de Masas con colores en desvíos
    let theoricalTableInProduction = $('#theoricalTableInProduction').DataTable({
        ajax: {
            url: 'http://localhost:63152/api/TheoricalConsumption/GetTheoricalConsumption?ot=4',
            dataSrc: ''
        },
        language: window.dataTablesLanguage, 
        columns: [
            { data: "MATERIAL" },
            { data: "TEORICO" },
            { data: "REAL" },
            {
                data: "DESVIO",
                render: function (data) {
                    const value = parseFloat(data);
                    const color = value < 0 ? '#dc3545' : '#28a745'; // Rojo para negativos, verde para positivos
                    return `<span style="color: ${color}">${value.toFixed(2)}</span>`;
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
            render: function (data) {
                return parseFloat(data).toFixed(2);
            }
        },
        {
            data: "REAL",
            render: function (data) {
                return parseFloat(data).toFixed(2);
            }
        },
        {
            data: "DESVIO",
            render: function (data) {
                const value = parseFloat(data);
                const color = value < 0 ? '#dc3545' : '#28a745';
                return `<span style="color: ${color}">${value.toFixed(2)}</span>`;
            }
        },
        {
            data: null,
            render: function (data, type, row) {
                // Mapa de precios fijos para cada material
                const precios = {
                    "DULCE DE LECHE C/CACAO P/SEMBRAR": 1699.47,
                    "DULCE DE LECHE P/SEMBRAR": 1675.69,
                    "GALLETA OREO PICADA": 4049.75,
                    "GALLETAS MILKA MOUSSE": 5301.71,
                    "HELADO DE CHOCOLATE": 10000,
                    "HELADO DE CREMA AMERICANA": 10000,
                    "HELADO DE DULCE DE LECHE": 10000,
                    "PREPARADO ALMIBAR STANDART": 247.68,
                    "SALSA DULCE SABOR CHOCOLATE": 1379.57,
                    "TAPA GALLETA SABOR VAINILLA 17 CM": 1862.48
                };
                
                const desvio = parseFloat(row.DESVIO || 0);
                const precioMaterial = precios[row.MATERIAL] || 0;
                const valorDesvio = desvio * precioMaterial;
                
                // Función para formatear valores grandes
                function formatearValor(valor) {
                    const valorAbs = Math.abs(valor);
                    if (valorAbs >= 1000000) {
                        return `${(valorAbs / 1000000).toFixed(2)}M`;
                    } else if (valorAbs >= 1000) {
                        return `${(valorAbs / 1000).toFixed(2)}k`;
                    }
                    return valorAbs.toFixed(2);
                }
                
                const color = valorDesvio < 0 ? '#dc3545' : '#28a745';
                const formattedValue = formatearValor(valorDesvio);
                const fullValue = Math.abs(valorDesvio).toFixed(2);
                
                // Usar el atributo title nativo para mostrar el valor completo
                return `<span style="color: ${color}; cursor: help;" 
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
                    return (valorAbs / 1000000).toFixed(2) + 'M';
                } else if (valorAbs >= 1000) {
                    // Formato para miles (k)
                    return (valorAbs / 1000).toFixed(2) + 'k';
                } else {
                    // Formato normal para valores pequeños
                    return valorAbs.toFixed(2);
                }
            }
            
            // Actualizar cada celda de valor en la tabla
            $('.valor-desvio').each(function() {
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


    // Tabla de Stock Final
    let stockTable = $('#stockTable').DataTable({
        ajax: {
            url: 'http://localhost:63152/api/ProductionStore/GetAllProductionStore',
            dataSrc: function (json) {
                return json.filter(item => item.OT === 4 && item.TIPOMOV === 'STOCK FINAL');
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
            { data: "OT" },
            { data: "MATERIAL" },
            { data: "CANTIDAD" },
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




   // Recargar tablas cuando se abren los modales
   $('#productionModal').on('shown.bs.modal', function () {
    if (window.productionTable) window.productionTable.ajax.reload();
    if (window.theoricalTableInProduction) window.theoricalTableInProduction.ajax.reload();
});

$('#balanceModal').on('shown.bs.modal', function () {
    if (window.consolidadoBMTable) window.consolidadoBMTable.ajax.reload();
});

$('#stockModal').on('shown.bs.modal', function () {
    if (window.stockTable) window.stockTable.ajax.reload();
});
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
                            formatter: function() {
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
                        formatter: function() {
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
            error: function(xhr, status, error) {
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





// AGREGAR EL NUEVO CÓDIGO AQUÍ
async function calcularInventarioValorizado() {
    try {
        // Obtener datos de stock final
        const stockResponse = await fetch('http://localhost:63152/api/ProductionStore/GetAllProductionStore');
        const stockData = await stockResponse.json();
        const stockFinal = stockData.filter(item => item.OT === 4 && item.TIPOMOV === 'STOCK FINAL');

        // Obtener precios de materiales
        const materialsResponse = await fetch('http://localhost:63152/api/Materials');
        const materialsData = await materialsResponse.json();

        // Calcular el valor total
        let valorTotal = 0;
        stockFinal.forEach(stockItem => {
            const material = materialsData.find(m => m.MATERIAL === stockItem.MATERIAL);
            if (material) {
                valorTotal += stockItem.CANTIDAD * material.PRECIO;
            }
        });

        // Actualizar el contador
        document.querySelector('#inventario-valorizado').textContent =
            `$${valorTotal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } catch (error) {
        console.error('Error al calcular inventario valorizado:', error);
        document.querySelector('#inventario-valorizado').textContent = 'Error al calcular';
    }
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

// Modificar la función calcularStockFinalValor para mostrar un valor fijo
async function calcularStockFinalValor() {
    try {
        // Mostrar un valor fijo en lugar de contar los materiales
        const stockFinalElement = document.querySelector('#stock-final-count');
        if (stockFinalElement) {
            stockFinalElement.textContent = "$3.786.872,58";
        } else {
            console.error('Elemento #stock-final-count no encontrado');
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
    initCharts();
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
        $(document).on('mousedown', '.highcharts-contextmenu', function(e) {
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
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
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
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.highcharts-contextmenu').length) {
            $('.highcharts-contextmenu').hide();
        }
    });
}

// 5. Modificar la inicialización general
$(document).ready(function() {
    initializeAllHighcharts();
    initTables();
    actualizarContadores();
    
    // Aplicar los arreglos después de que se inicialicen los gráficos
    setTimeout(applyHighchartsFixes,initializeChartImprovements, 500);
    
    // Ajustar en cambios de tamaño
    $(window).on('resize', function() {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(function() {
            // Reajustar gráficos
            $('.highcharts-container').each(function() {
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



// Manejar el redimensionamiento de la ventana con debounce
let resizeTimeout;
window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
        initializeAll();
    }, 250);
});



