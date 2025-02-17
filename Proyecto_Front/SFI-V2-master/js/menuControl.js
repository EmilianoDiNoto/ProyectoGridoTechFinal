document.addEventListener('DOMContentLoaded', function() {
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

    hamBurger.addEventListener("click", function() {
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

    if (mainMetricsCtx) {
        new Chart(mainMetricsCtx, {
            type: 'line',
            data: {
                labels: ['Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb'],
                datasets: [{
                    label: 'Grido Cookie and Cream',
                    data: [80000, 82000, 78000, 85000, 88000, 84000, 87000, 90000, 86000, 89000, 85000, 88000],
                    borderColor: '#4e73df',
                    backgroundColor: 'rgba(78, 115, 223, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3
                }, {
                    label: 'Grido Mousse',
                    data: [70000, 73000, 71000, 75000, 78000, 74000, 77000, 80000, 76000, 79000, 75000, 78000],
                    borderColor: '#1cc88a',
                    backgroundColor: 'rgba(28, 200, 138, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3
                }, {
                    label: 'Grido con Relleno',
                    data: [90000, 92000, 88000, 95000, 98000, 94000, 97000, 100000, 96000, 99000, 95000, 98000],
                    borderColor: '#f6c23e',
                    backgroundColor: 'rgba(246, 194, 62, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            boxWidth: 10
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y.toLocaleString() + ' unidades';
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Producción (unidades)',
                            font: {
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
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

    if (workDistributionCtx) {
        new Chart(workDistributionCtx, {
            type: 'pie',
            data: {
                labels: ['Pendientes', 'Terminadas'],
                datasets: [{
                    data: [3,6],
                    backgroundColor: ['#4e73df', '#1cc88a', '#f6c23e', '#e74a3b']
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true
            }
        });
    }

    if (comparativeChartCtx) {
        new Chart(comparativeChartCtx, {
            type: 'bar', // Cambiado a tipo bar para mostrar barras agrupadas
            data: {
                labels: ['Grido Cookie and Cream', 'Grido Mousse', 'Grido con Relleno'],
                datasets: [{
                    label: 'Producción realizada en OT',
                    data: [80000, 70000, 90000],
                    backgroundColor: '#4e73df',
                    borderRadius: 5,
                    order: 2
                }, {
                    label: 'Producción establecida en OT',
                    data: [82567, 71230, 90120],
                    backgroundColor: '#1cc88a',
                    borderRadius: 5,
                    order: 2
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            // Hacer las leyendas clickeables para mostrar/ocultar datasets
                            generateLabels: function(chart) {
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
                        onClick: function(e, legendItem, legend) {
                            const index = legendItem.datasetIndex;
                            const chart = legend.chart;
                            const meta = chart.getDatasetMeta(index);
    
                            meta.hidden = meta.hidden === null ? !chart.data.datasets[index].hidden : null;
                            chart.update();
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
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
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Cantidad',
                            font: {
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            callback: function(value) {
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
                    data: [15,14,14],
                    backgroundColor: '#1cc88a'
                }, {
                    label: 'Ordenes de trabajo Pendientes',
                    data: [1,1,1],
                    backgroundColor: '#4e73df'
                }, {
                    label: 'Ordenes de trabajo Canceladas',
                    data: [0,0,1],
                    backgroundColor: '#f6c23e'
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
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

    if (monthlyProductionCtx) {
        new Chart(monthlyProductionCtx, {
            type: 'bar',
            data: {
                labels: ['Grido Cookie and Cream', 'Grido Mousse', 'Grido con Relleno',],
                datasets: [{
                    label: 'Producción febrero 2025',
                    data: [ 70000, 80000, 90000, 100000],
                    backgroundColor: '#4e73df',
                    borderRadius: 5
                }, {
                    label: 'Meta Mensual',
                    data: [95000,95000,95000],
                    type: 'line',
                    borderColor: '#1cc88a',
                    borderWidth: 5,
                    fill: false,
                    pointRadius: 0
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end'
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Cantidad Producida'
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
}

// Asegurarnos de que el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    initCharts();
});

// También podemos reinicializar los gráficos cuando se redimensiona la ventana
window.addEventListener('resize', function() {
    initCharts();
});

