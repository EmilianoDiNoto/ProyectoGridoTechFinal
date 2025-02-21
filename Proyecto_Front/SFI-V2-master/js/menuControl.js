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

// Creamos una función separada para inicializar los gráficos
function initCharts() {
    // Asegurarnos de que los elementos canvas existen
    const mainMetricsCtx = document.getElementById('mainMetrics');
    const workDistributionCtx = document.getElementById('workDistribution');
    const comparativeChartCtx = document.getElementById('comparativeChart');
    const monthlyProgressCtx = document.getElementById('monthlyProgress');
    const monthlyProductionCtx = document.getElementById('monthlyProduction');

    // Gráfico de Producción Anual (Rediseñado)
    if (mainMetricsCtx) {
        new Chart(mainMetricsCtx, {
            type: 'line',
            data: {
                labels: ['Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb'],
                datasets: [{
                    label: 'Grido Cookie and Cream',
                    data: [80000, 82000, 78000, 85000, 88000, 84000, 87000, 90000, 86000, 89000, 85000, 88000],
                    borderColor: '#0e2238',
                    backgroundColor: '0c169f',
                    borderWidth: 3
                }, {
                    label: 'Grido Mousse',
                    data: [70000, 73000, 71000, 75000, 78000, 74000, 77000, 80000, 76000, 79000, 75000, 78000],
                    borderColor: '#f6c23e',
                    backgroundColor: 'rgba(246, 194, 62, 0.1)',
                    borderWidth: 3
                }, {
                    label: 'Grido con Relleno',
                    data: [90000, 92000, 88000, 95000, 98000, 94000, 97000, 100000, 96000, 99000, 95000, 98000],
                    borderColor: '#e74a3b',
                    backgroundColor: 'rgba(231, 74, 59, 0.1)',
                    borderWidth: 3
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 50000,
                        max: 110000,
                        ticks: {
                            callback: function (value) {
                                return value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                }
            }
        });
    }
    
    if (workDistributionCtx) {
        // Hacer la llamada a la API
        $.ajax({
            url: 'http://localhost:63152/api/WorkOrders',
            success: function(workOrdersData) {
                // Contar órdenes por estado
                const realizadas = workOrdersData.filter(item => item.ESTADO === 'REALIZADA').length;
                const pendientes = workOrdersData.filter(item => item.ESTADO === 'PENDIENTE').length;
    
                let chart = new Chart(workDistributionCtx, {
                    type: 'doughnut', // Cambiado a doughnut para mejor estética
                    data: {
                        labels: ['Pendientes', 'Realizadas'],
                        datasets: [{
                            data: [pendientes, realizadas],
                            backgroundColor: ['#0c169f', '#1cc88a'],
                            borderWidth: 2,
                            borderColor: '#ffffff'
                        }]
                    },
                    options: {
                        maintainAspectRatio: false,
                        responsive: true,
                        layout: {
                            padding: {
                                left: 10,
                                right: 10,
                                top: 10,
                                bottom: 10
                            }
                        },
                        plugins: {
                            legend: {
                                position: 'right',
                                labels: {
                                    padding: 20,
                                    font: {
                                        size: 14
                                    },
                                    generateLabels: function(chart) {
                                        const data = chart.data;
                                        if (data.labels.length && data.datasets.length) {
                                            return data.labels.map((label, i) => ({
                                                text: `${label}: ${data.datasets[0].data[i]}`,
                                                fillStyle: data.datasets[0].backgroundColor[i],
                                                hidden: !chart.getDataVisibility(i),
                                                lineCap: 'round',
                                                lineDash: [],
                                                lineDashOffset: 0,
                                                lineJoin: 'round',
                                                strokeStyle: data.datasets[0].borderColor,
                                                pointStyle: 'rect', // Cambiado a rect para mejor visibilidad
                                                rotation: 0,
                                                datasetIndex: 0,
                                                index: i
                                            }));
                                        }
                                        return [];
                                    },
                                    usePointStyle: true,
                                    boxWidth: 20
                                },
                                onClick: function(e, legendItem, legend) {
                                    const index = legendItem.index;
                                    const chart = legend.chart;
                                    
                                    chart.toggleDataVisibility(index);
                                    chart.update();
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const label = context.label || '';
                                        const value = context.raw;
                                        const total = context.dataset.data.reduce((acc, current) => acc + current, 0);
                                        const percentage = ((value / total) * 100).toFixed(1);
                                        return `${label}: ${value} (${percentage}%)`;
                                    }
                                }
                            }
                        }
                    }
                });
            },
            error: function(xhr, status, error) {
                console.error('Error al cargar datos de órdenes de trabajo:', error);
                const ctx = workDistributionCtx.getContext('2d');
                ctx.font = '14px Arial';
                ctx.fillStyle = 'red';
                ctx.textAlign = 'center';
                ctx.fillText('Error al cargar datos', workDistributionCtx.width/2, workDistributionCtx.height/2);
            }
        });
    }

    if (comparativeChartCtx) {
        new Chart(comparativeChartCtx, {
            type: 'bar', // Cambiado a tipo bar para mostrar barras agrupadas
            data: {
                labels: ['Grido Cookie and Cream', 'Grido Mousse', 'Grido con Relleno'],
                datasets: [ {
                    label: 'Producción establecida en OT',
                    data: [82567, 71230, 90120],
                    backgroundColor: '#1cc88a',
                    borderRadius: 5,
                    order: 2
                },
                {
                    label: 'Producción realizada en OT',
                    data: [80000, 70000, 90000],
                    backgroundColor: '#0c169f',
                    borderRadius: 5,
                    order: 2
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                barPercentage: 0.5,
                categoryPercentage: 0.8,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            // Hacer las leyendas clickeables para mostrar/ocultar datasets
                            generateLabels: function (chart) {
                                const datasets = chart.data.datasets;
                                return datasets.map((dataset, i) => ({
                                    text: dataset.label,
                                    fillStyle: dataset.backgroundColor,
                                    hidden: !chart.isDatasetVisible(i),
                                    lineCap: 'round',
                                    lineDash: [],
                                    lineDashOffset: 0,
                                    lineJoin: 'round',
                                    strokeStyle: dataset.backgroundColor,
                                    pointStyle: 'rect',
                                    datasetIndex: i
                                }));
                            }
                        },
                        onClick: function (e, legendItem, legend) {
                            const index = legendItem.datasetIndex;
                            const chart = legend.chart;
                            const meta = chart.getDatasetMeta(index);

                            meta.hidden = meta.hidden === null ? !chart.data.datasets[index].hidden : null;
                            chart.update();
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y.toLocaleString();
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 50000,
                        max: 100000,
                        title: {
                            display: true,
                            text: 'Cantidad',
                            font: {
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            callback: function (value) {
                                return value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    if (monthlyProgressCtx) {
        new Chart(monthlyProgressCtx, {
            type: 'bar',
            data: {
                labels: ['Turno Mañana', 'Turno Tarde', 'Turno Noche'],
                datasets: [{
                    label: 'Ordenes de trabajo Completadas',
                    data: [15, 14, 14],
                    backgroundColor: '#0c169f'
                }, {
                    label: 'Ordenes de trabajo Pendientes',
                    data: [1, 1, 1],
                    backgroundColor: '#4e73df'
                }, {
                    label: 'Ordenes de trabajo Canceladas',
                    data: [0, 0, 1],
                    backgroundColor: '#f6c23e'
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                barPercentage: 0.4,
                categoryPercentage: 0.8,
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Gráfico de Producción Mensual
    if (monthlyProductionCtx) {
        new Chart(monthlyProductionCtx, {
            type: 'bar',
            data: {
                labels: ['Grido Cookie and Cream', 'Grido Mousse', 'Grido con Relleno'],
                datasets: [{
                    label: 'Producción febrero 2025',
                    data: [70000, 80000, 90000],
                    backgroundColor: '#0c169f',
                    borderRadius: 5,
                    barPercentage: 0.4 // Barras más delgadas
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 50000,
                        max: 95000,
                        ticks: {
                            callback: function (value) {
                                return value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
}

/// Función para inicializar las tablas DataTables
function initTables() {
    // Configuración común para las DataTables
    let commonConfig = {
        dom: 'Bfrtip', // Elimina el filtro de entries
        buttons: ['pdfHtml5', 'excelHtml5'],
        searching: false, // Elimina la búsqueda
        language: {
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
        language: {
            url: "//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json"
        },
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

    // Tabla de Balance de Masas con colores en desvíos
    let theoricalTableInProduction = $('#theoricalTableInProduction').DataTable({
        ajax: {
            url: 'http://localhost:63152/api/TheoricalConsumption/GetTheoricalConsumption?ot=4',
            dataSrc: ''
        },
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



    // Tabla de Balance de Masas Consolidado
    let consolidadoBMTable = $('#consolidadoBMTable').DataTable({
        ...commonConfig,
        searching: true, // Mantener la búsqueda para esta tabla
        language: {
            ...commonConfig.language,
            search: "Buscar:" // Cambiar el texto del buscador
        },
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

    // Tabla de Stock Final sin el campo redundante
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
            // Se eliminó la columna TIPOMOV ya que es redundante
        ],
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




    // Recargar tablas cuando se abren los modales
    $('#productionModal').on('shown.bs.modal', function () {
        productionTable.ajax.reload();
        theoricalTableInProduction.ajax.reload();
    });

    $('#balanceModal').on('shown.bs.modal', function () {
        consolidadoBMTable.ajax.reload();
    });
}

function initPieCharts() {
    // Gráfico de Producción
    const productionPieCtx = document.getElementById('productionPieChart');
    if (productionPieCtx) {
        $.ajax({
            url: 'http://localhost:63152/api/Production/GetAllProduction',
            success: function (productionData) {
                const otData = productionData.filter(item => item.OT === 4);
                const totalProducido = otData.reduce((sum, item) => sum + item.PRODUCIDO, 0);

                new Chart(productionPieCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Producción OT 4'],
                        datasets: [{
                            label: 'Producción Solicitada',
                            data: [1466],
                            backgroundColor: '#1cc88a',
                            barPercentage: 0.25
                        },
                        {
                            label: 'Producción Real',
                            data: [totalProducido],
                            backgroundColor: '#0c169f',
                            barPercentage: 0.25
                        }]
                    },
                    options: {
                        indexAxis: 'x',
                        maintainAspectRatio: false,
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                                labels: {
                                    boxWidth: 12,
                                    padding: 10
                                }
                            },
                            title: {
                                display: true,
                                text: 'Comparación de Producción'
                            }
                        },
                        scales: {
                            y: {
                                min: 1000, // Establecer mínimo en 1000
                                max: 1600, // Establecer máximo en 1600
                                ticks: {
                                    stepSize: 100, // Incrementos de 100
                                    callback: function (value) {
                                        return value.toLocaleString();
                                    }
                                }
                            }
                        }
                    }
                });
            }
        });
    }

    // Gráfico de Balance de Masas - Barras apiladas
    const balancePieCtx = document.getElementById('balancePieChart');
    if (balancePieCtx) {
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

                new Chart(balancePieCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Balance de Masas'],
                        datasets: [
                            {
                                label: 'Consumo Teórico',
                                data: [Math.abs(totales.teorico)],
                                backgroundColor: '#0c169f',
                                borderWidth: 1,
                                borderColor: '#ffffff'
                            },
                            {
                                label: 'Consumo Real',
                                data: [Math.abs(totales.real)],
                                backgroundColor: '#1cc88a',
                                borderWidth: 1,
                                borderColor: '#ffffff'
                            },
                            {
                                label: 'Desvío Total',
                                data: [Math.abs(totales.desvio)],
                                backgroundColor: '#e74a3b',
                                borderWidth: 1,
                                borderColor: '#ffffff'
                            }
                        ]
                    },
                    options: {
                        maintainAspectRatio: false,
                        responsive: true,
                        scales: {
                            x: {
                                stacked: false,
                                grid: {
                                    display: false
                                }
                            },
                            y: {
                                stacked: false,
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Cantidad Total'
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                position: 'top',
                                labels: {
                                    usePointStyle: true,
                                    padding: 15,
                                    font: {
                                        size: 12
                                    }
                                }
                            },
                            title: {
                                display: true,
                                text: 'Balance de Masas Total',
                                font: {
                                    size: 16
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        let label = context.dataset.label || '';
                                        let value = context.raw;

                                        // Si es el desvío y es negativo en los datos originales
                                        if (context.dataset.label === 'Desvío Total' && totales.desvio < 0) {
                                            value = -value;
                                        }

                                        return `${label}: ${value.toFixed(2)}`;
                                    }
                                }
                            }
                        }
                    }
                });
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
function initializeAll() {
    // Destruir gráficos existentes
    Chart.helpers.each(Chart.instances, function (instance) {
        instance.destroy();
    });

    // Inicializar los gráficos
    initPieCharts();
    initCharts();
}

// Modificar la inicialización
$(document).ready(function () {
    initializeAll();
    initTables();
});

// Manejar el redimensionamiento de la ventana con debounce
let resizeTimeout;
window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
        initializeAll();
    }, 250);
});



