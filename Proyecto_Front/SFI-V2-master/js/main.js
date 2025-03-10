function ajustarTamanoGraficos() {
    // Ajustar la altura de los contenedores de gráficos en la columna derecha
    const contenedoresDerecha = document.querySelectorAll('.col-md-6:nth-child(2) .chart-container-small');
    
    // Aumentar la altura de los contenedores para que sean más altos
    contenedoresDerecha.forEach(contenedor => {
      contenedor.style.height = '400px';  // Aumentar a 400px (antes 300px)
    });
    
    // Ajustar el espacio para los wrappers internos
    const wrappers = document.querySelectorAll('.highchart-wrapper');
    wrappers.forEach(wrapper => {
      // Establecer una altura relativa para asegurar que ocupe el espacio disponible
      wrapper.style.height = 'calc(100% - 70px)';
      // Necesario para que el contenido se muestre correctamente
      wrapper.style.overflow = 'visible';
    });
    
    // Aplicar estilos específicos para el contenedor de Última Producción
    const ultimaProduccionContainer = document.querySelector('#ultima-produccion-container');
    if (ultimaProduccionContainer) {
      ultimaProduccionContainer.parentElement.style.height = '450px'; // Aún más alto para los contadores
    }
  }

  // 2. CONFIGURAR HIGHCHARTS PARA PERMITIR QUE EL MENÚ CONTEXTUAL SE SUPERPONGA
function configurarMenuContextual() {
    // Sobrescribir la configuración global de Highcharts
    if (typeof Highcharts !== 'undefined') {
      Highcharts.setOptions({
        // Ajustar el comportamiento de exportación
        exporting: {
          buttons: {
            contextButton: {
              menuClassName: 'highcharts-contextmenu-overlay', // Clase personalizada
              symbol: 'menu',
              symbolStrokeWidth: 1,
              symbolFill: '#666',
              symbolStroke: '#666'
            }
          },
          // Asegurar que el menú se muestre sobre el gráfico
          fallbackToExportServer: false
        },
        navigation: {
          menuStyle: {
            // Estilos para el menú contextual
            border: '1px solid #ccc',
            background: '#fff',
            padding: '5px 0',
            borderRadius: '4px',
            boxShadow: '2px 2px 8px rgba(0,0,0,0.3)',
            zIndex: 9999,
            // Permitir scroll si hay muchas opciones
            overflow: 'auto',
            maxHeight: '300px',
            position: 'absolute'
          },
          // Estilos para los elementos del menú
          menuItemStyle: {
            padding: '0.5em 1em',
            color: '#333',
            fontSize: '12px',
            transition: 'background-color 0.15s ease',
            borderRadius: '0'
          },
          menuItemHoverStyle: {
            background: '#f0f0f0',
            color: '#000'
          }
        }
      });
      
      // Añadir estilos CSS específicos para los menús
      const style = document.createElement('style');
      style.textContent = `
        /* Asegurarse de que el menú contextual esté siempre visible */
        .highcharts-contextmenu-overlay {
          position: absolute !important;
          z-index: 9999 !important;
          background-color: white !important;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important;
          border-radius: 4px !important;
          border: 1px solid #ccc !important;
        }
        
        /* Hacer que los contenedores no oculten los menús */
        .highchart-wrapper {
          overflow: visible !important;
        }
        
        /* Mejorar la visibilidad de los elementos del menú */
        .highcharts-menu-item {
          padding: 8px 15px !important;
          cursor: pointer !important;
        }
        
        .highcharts-menu-item:hover {
          background-color: #f0f0f0 !important;
        }
      `;
      document.head.appendChild(style);
    }
  }
// 4. FUNCIÓN PRINCIPAL PARA INICIALIZAR TODAS LAS MEJORAS
function inicializarMejoras() {
    console.log("Inicializando mejoras para Highcharts...");
    
    // Paso 1: Ajustar tamaño de gráficos
    ajustarTamanoGraficos();
    
    // Paso 2: Configurar el menú contextual
    configurarMenuContextual();
    
    // Paso 3: Modificar el gráfico de Última Producción
    mejorarGraficoUltimaProduccion();
    
    // Reinicializar los gráficos para aplicar los cambios
    if (typeof initHighcharts === 'function') {
      // Llamar a initHighcharts después de un breve retraso para asegurar que todo esté listo
      setTimeout(function() {
        initHighcharts();
      }, 300);
    }
    
    // Añadir un observador de mutaciones para ajustar dinámicamente cuando cambie el DOM
    const observer = new MutationObserver(function(mutations) {
      // Verificar si se han añadido nuevos menús contextuales
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes && mutation.addedNodes.length) {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            // Si se detecta un nuevo menú, asegurar que esté correctamente posicionado
            if (node.classList && node.classList.contains('highcharts-contextmenu')) {
              node.style.zIndex = '9999';
            }
          }
        }
      });
    });
    
    // Iniciar observación del DOM
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
// Función para ajustar los estilos y tamaños de los elementos
function ajustarEstilosUltimaProduccion() {
    const styleElement = document.createElement('style');
    styleElement.id = 'ultima-produccion-fix-styles';
    styleElement.textContent = `
      /* Ajustes de tamaño para el gráfico de Última Producción */
      #ultima-produccion-container {
        height: 65% !important;
        max-height: 250px;
        margin-bottom: 10px !important;
        overflow: visible !important;
      }
      
      /* Estilos para los contadores */
      .production-counters {
        padding: 5px;
        width: 100%;
        background-color: #f8f9fa;
        border-radius: 6px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        margin-top: 5px;
      }
      
      /* Wrapper para los contadores */
      .counters-wrapper {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 5px;
      }
      
      /* Cada contador individual */
      .counter-box {
        flex: 1;
        min-width: 70px;
        text-align: center;
        padding: 6px 4px;
        background-color: white;
        border-radius: 5px;
        margin: 0 2px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        transition: all 0.3s ease;
      }
      
      /* Iconos de contadores */
      .counter-icon {
        font-size: 14px;
        margin-bottom: 2px;
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
      
      /* Valores de contadores más compactos */
      .counter-value {
        font-size: 14px;
        font-weight: bold;
        color: #333;
        margin-bottom: 1px;
      }
      
      /* Etiquetas de contadores más pequeñas */
      .counter-label {
        font-size: 10px;
        color: #666;
      }
      
      /* Ajuste para la información central */
      .highcharts-center-info {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        pointer-events: none;
        z-index: 5;
      }
      
      /* Asegurar que el gráfico completo se muestre */
      .chart-container-small {
        display: flex;
        flex-direction: column;
        height: 400px !important;
        padding-bottom: 10px;
      }
    `;
    
    // Eliminar estilos anteriores si existen
    const oldStyle = document.getElementById('ultima-produccion-fix-styles');
    if (oldStyle) oldStyle.remove();
    
    // Añadir los nuevos estilos
    document.head.appendChild(styleElement);
  }

  // 5. INICIALIZAR AL CARGAR LA PÁGINA
  // Necesitamos asegurarnos de que estas mejoras se apliquen después
  // de que Highcharts y el DOM estén completamente cargados
  document.addEventListener('DOMContentLoaded', function() {
    // Iniciar después de un breve retraso para asegurar que todo esté cargado
    setTimeout(inicializarMejoras, 500);
    
    // Agregar listener para el botón derecho del ratón en gráficos
    document.addEventListener('contextmenu', function(e) {
      const target = e.target;
      // Verificar si el clic fue dentro de un gráfico de Highcharts
      if (target.closest('.highcharts-container')) {
        // No prevenir el comportamiento predeterminado para que Highcharts
        // pueda mostrar su propio menú contextual
      }
    }, false);
  });
  

  // Ejecutar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Esperar a que todo esté cargado
    setTimeout(aplicarAjustesUltimaProduccion, 600);
  });
  


  // Aplicar también durante el redimensionamiento de la ventana
  window.addEventListener('resize', function() {
    // Usar debounce para evitar demasiadas llamadas
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(function() {
      ajustarTamanoGraficos();
    }, 250);
  });  

    // Si jQuery está disponible, también inicializar con jQuery
    if (typeof $ !== 'undefined') {
        $(document).ready(function() {
          setTimeout(inicializarMejoras, 500);
        });
      }
      