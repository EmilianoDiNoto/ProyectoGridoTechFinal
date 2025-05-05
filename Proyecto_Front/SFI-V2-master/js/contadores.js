// // Archivo: init.js - Coloca este archivo en tu carpeta js y cárgalo al final en home1.html

// document.addEventListener('DOMContentLoaded', function() {
//     console.log("Inicializando aplicación...");

//     // 1. Configurar Highcharts globalmente primero
//     if (typeof Highcharts !== 'undefined') {
//         console.log("Configurando Highcharts...");
//         configureHighcharts();
//     } else {
//         console.error("Highcharts no está disponible!");
//     }

//     // 2. Inicializar gráficos
//     console.log("Inicializando gráficos...");
//     initializeAllHighcharts();

//     // 3. Inicializar tablas
//     console.log("Inicializando tablas...");
//     initTables();

//     // 4. Cargar datos de última producción
//     console.log("Cargando datos de última producción...");
//     cargarUltimaProduccion();

//     // 5. Actualizar contadores (esta función debe llamar a todas las funciones de cálculo)
//     console.log("Actualizando contadores...");
//     setTimeout(function() {
//         actualizarContadores();
//     }, 1000);

//     // 6. Configurar eventos modales
//     console.log("Configurando eventos modales...");
//     configurarEventosModales();

//     // 7. Aplicar correcciones visuales
//     console.log("Aplicando correcciones visuales...");
//     setTimeout(function() {
//         solucionarProblemasBotones();
//         mejorarMenuContextual();
//         fixHighchartsIssues();
//     }, 1500);
// });

// // Función para configurar eventos modales
// function configurarEventosModales() {
//     $('#productionModal').on('shown.bs.modal', function() {
//         if (window.productionTable) window.productionTable.ajax.reload();
//         if (window.theoricalTableInProduction) window.theoricalTableInProduction.ajax.reload();
//     });

//     $('#balanceModal').on('shown.bs.modal', function() {
//         if (window.consolidadoBMTable) window.consolidadoBMTable.ajax.reload();
//     });

//     $('#stockModal').on('shown.bs.modal', function() {
//         if (window.stockTable) {
//             window.stockTable.ajax.reload();
//         } else {
//             initStockTable(window.ultimaOTrealizada);
//         }
//     });

//     // Configurar evento de clic para el contador de stock final
//     document.getElementById('stock-final-counter').addEventListener('click', function() {
//         $('#stockModal').modal('show');
//     });
// }

// // Función unificada para actualizar todos los contadores
// async function actualizarContadores() {
//     console.log("Ejecutando actualizarContadores...");
    
//     try {
//         // Ejecutar todas las funciones de cálculo
//         await calcularInventarioValorizado();
//         await calcularDesvioTotal();
//         await calcularStockFinalValor();
//         await actualizarOrdenPendiente();
        
//         console.log("Contadores actualizados correctamente");
//     } catch (error) {
//         console.error("Error al actualizar contadores:", error);
//     }
// }