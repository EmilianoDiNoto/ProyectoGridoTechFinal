// Función para corregir el gráfico de Balance de Masas
document.addEventListener('DOMContentLoaded', function() {
    // Esperar a que Highcharts esté listo y los elementos estén en el DOM
    setTimeout(fixBalanceChart, 500);
    
    // Volver a aplicar el fix cuando cambie el tamaño de la ventana
    window.addEventListener('resize', function() {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(fixBalanceChart, 250);
    });
});

// Función principal para corregir el gráfico de Balance de Masas
function fixBalanceChart() {
    const container = document.getElementById('balance-highchart-container');
    if (!container) return;
    
    // 1. Asegurarse que el contenedor tenga las dimensiones correctas
    const parentContainer = container.closest('.chart-container-large');
    if (parentContainer) {
        // Asegurarse que el contenedor padre tenga posición relativa
        parentContainer.style.position = 'relative';
        parentContainer.style.overflow = 'hidden';
        
        // Ajustar las dimensiones del contenedor del gráfico
        container.style.width = '100%';
        container.style.height = 'calc(100% - 80px)'; // Dejar espacio para título y botón
        container.style.maxHeight = '370px'; // Limitar la altura máxima
        container.style.position = 'relative';
        container.style.margin = '0 auto';
    }
    
    // 2. Si el gráfico ya existe, redimensionarlo
    if (Highcharts && Highcharts.charts) {
        const chart = Highcharts.charts.find(chart => 
            chart && chart.renderTo && chart.renderTo.id === 'balance-highchart-container'
        );
        
        if (chart) {
            chart.setSize(null, null, false); // Hacer que el gráfico se ajuste al contenedor
            chart.reflow(); // Forzar el redimensionamiento
        }
    }
    
    // 3. Ajustar el botón de consulta
    const consultaBtn = parentContainer ? parentContainer.querySelector('.btn-consultar') : null;
    if (consultaBtn) {
        consultaBtn.style.position = 'relative';
        consultaBtn.style.zIndex = '100';
        consultaBtn.style.marginTop = '10px';
    }
    
    // 4. Asegurarse que los ejes y etiquetas estén dentro del contenedor
    if (Highcharts && Highcharts.charts) {
        const chart = Highcharts.charts.find(chart => 
            chart && chart.renderTo && chart.renderTo.id === 'balance-highchart-container'
        );
        
        if (chart) {
            // Ajustar márgenes para asegurar que todo quepa
            chart.update({
                chart: {
                    marginLeft: 120, // Más espacio para etiquetas del eje Y
                    marginRight: 20,
                    marginBottom: 30,
                    marginTop: 50 // Espacio para la leyenda
                },
                legend: {
                    y: 5 // Ajustar posición vertical de la leyenda
                }
            }, false);
            
            // Actualizar el gráfico
            chart.redraw();
        }
    }
}

// Función para corregir todos los gráficos Highcharts
function fixAllHighcharts() {
    // Verificar que Highcharts esté cargado
    if (!window.Highcharts) return;
    
    // Aplicar configuración global para mejorar el comportamiento responsive
    Highcharts.setOptions({
        chart: {
            reflow: true,
            backgroundColor: 'transparent',
            events: {
                load: function() {
                    // Asegurar que el gráfico se ajuste al contenedor
                    this.reflow();
                }
            }
        },
        // Mejorar el posicionamiento del menú contextual
        navigation: {
            buttonOptions: {
                verticalAlign: 'top',
                y: -5
            },
            menuStyle: {
                position: 'fixed',
                zIndex: 10000
            }
        }
    });
    
    // Iterar a través de todos los gráficos existentes
    if (Highcharts.charts) {
        Highcharts.charts.forEach(function(chart) {
            if (!chart) return;
            
            // Ajustar dimensiones
            chart.reflow();
        });
    }
}

// Llamar a esta función después de que se carguen todos los gráficos
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(fixAllHighcharts, 800);
});

// Detectar y corregir cuando el gráfico de balance de masas se dibuje
document.addEventListener('DOMContentLoaded', function() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    // Verificar si se agregó un elemento SVG (gráfico Highcharts)
                    if (node.tagName === 'svg' && node.closest('#balance-highchart-container')) {
                        setTimeout(fixBalanceChart, 100);
                        return;
                    }
                }
            }
        });
    });
    
    // Comenzar a observar el contenedor del gráfico
    const container = document.getElementById('balance-highchart-container');
    if (container) {
        observer.observe(container, { childList: true, subtree: true });
    }
});

// Añadir CSS adicional para mejorar la visualización
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        /* Mejorar la visualización del contenedor del gráfico */
        .chart-container-large {
            overflow: hidden !important;
            position: relative !important;
            height: 450px !important;
        }
        
        #balance-highchart-container {
            overflow: visible !important;
        }
        
        /* Asegurar que el eje Y y etiquetas estén visibles */
        .highcharts-axis-labels.highcharts-yaxis-labels {
            transform: translateX(5px);
        }
        
        /* Asegurar que el menú contextual de Highcharts esté siempre por encima */
        .highcharts-contextmenu {
            position: fixed !important;
            z-index: 10000 !important;
        }
    `;
    document.head.appendChild(style);
});