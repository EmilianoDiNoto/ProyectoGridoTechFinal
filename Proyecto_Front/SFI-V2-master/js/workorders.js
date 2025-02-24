$(document).ready(function() {
    // Función auxiliar para formatear fechas
    function formatDate(dateString) {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    // Configuración común para las DataTables
    const commonConfig = {
        responsive: true,
        language: window.dataTablesLanguage || {
            // Configuración de idioma por defecto si no está definida globalmente
            "decimal": "",
            "emptyTable": "No hay datos disponibles",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
            "infoEmpty": "Mostrando 0 a 0 de 0 registros",
            "infoFiltered": "(filtrado de _MAX_ registros totales)",
            "thousands": ",",
            "lengthMenu": "Mostrar _MENU_ registros",
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

    // Inicializar la tabla principal de WorkOrders
    let workOrdersTable = $('#workOrdersTable').DataTable({
        ...commonConfig,
        dom: '<"top"Bfl>rt<"bottom"ip><"clear">',
        buttons: [
            {
                extend: 'excel',
                text: '<i class="zmdi zmdi-file-text"></i> Exportar a Excel',
                className: 'btn btn-success btn-sm me-2',
                exportOptions: {
                    columns: [0,1,2,3,4,5,6]
                }
            },
            {
                extend: 'csv',
                text: '<i class="zmdi zmdi-file"></i> Exportar a CSV',
                className: 'btn btn-info btn-sm',
                exportOptions: {
                    columns: [0,1,2,3,4,5,6]
                }
            }
        ],
        ajax: {
            url: 'http://localhost:63152/api/WorkOrders',
            dataSrc: ''
        },
        columns: [
            { data: "OT" },
            { data: "CODIGO" },
            { data: "PRODUCTO" },
            { data: "DEMANDA" },
            { data: "UM" },
            {
                data: "ESTADO",
                render: function(data) {
                    let color = data === "REALIZADA" ? '#28a745' :
                               data === "PENDIENTE" ? '#ffc107' : '#dc3545';
                    return `<span style="color: ${color}; font-weight: bold;">${data}</span>`;
                }
            },
            {
                data: "FECHAELABORACION",
                render: function(data) {
                    return formatDate(data);
                }
            },
            {
                data: null,
                orderable: false,
                render: function(data) {
                    return `<button class="btn btn-info btn-sm view-details" data-ot="${data.OT}">
                              <i class="zmdi zmdi-eye"></i>
                           </button>`;
                }
            }
        ],
        order: [[0, 'desc']],
        initComplete: function() {
            $('#workOrdersTable thead th').css({
                'background-color': '#0e2238',
                'color': 'white'
            });
        }
    });

      // Configuración específica para workOrdersTable
	  const workOrdersConfig = {
        ...commonConfig,
        dom: '<"top"Bfl>rt<"bottom"ip><"clear">',
        buttons: [
            {
                extend: 'excel',
                text: '<i class="zmdi zmdi-file-text"></i> Exportar a Excel',
                className: 'btn btn-success btn-sm me-2',
                exportOptions: {
                    columns: [0,1,2,3,4,5,6]
                }
            },
            {
                extend: 'csv',
                text: '<i class="zmdi zmdi-file"></i> Exportar a CSV',
                className: 'btn btn-info btn-sm',
                exportOptions: {
                    columns: [0,1,2,3,4,5,6]
                }
            }
        ],
        ajax: {
            url: 'http://localhost:63152/api/WorkOrders',
            dataSrc: ''
        },
        columns: [
            { data: "OT" },
            { data: "CODIGO" },
            { data: "PRODUCTO" },
            { data: "DEMANDA" },
            { data: "UM" },
            {
                data: "ESTADO",
                render: function(data) {
                    let color = data === "REALIZADA" ? '#28a745' :
                               data === "PENDIENTE" ? '#ffc107' : '#dc3545';
                    return `<span style="color: ${color}; font-weight: bold;">${data}</span>`;
                }
            },
            {
                data: "FECHAELABORACION",
                render: function(data) {
                    return formatDate(data);
                }
            },
            {
                data: null,
                orderable: false,
                render: function(data) {
                    return `<button class="btn btn-info btn-sm view-details" data-ot="${data.OT}">
                              <i class="zmdi zmdi-eye"></i>
                           </button>`;
                }
            }
        ],
        order: [[0, 'desc']],
        initComplete: function() {
            $('#workOrdersTable thead th').css({
                'background-color': '#0e2238',
                'color': 'white'
            });
        }
    };

    // Evento para el botón de ver detalles
    $('#workOrdersTable').on('click', '.view-details', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const ot = $(this).data('ot');
        const url = `http://localhost:63152/api/WorkOrderMaterial/GetWorkOrderMaterials?ot=${ot}`;

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                return response.json();
            })
            .then(materialsData => {
                if ($.fn.DataTable.isDataTable('#materialsTable')) {
                    materialsTable.clear().destroy();
                }

                materialsTable = $('#materialsTable').DataTable({
                    ...commonConfig,
                    dom: 'rt<"bottom"ip><"clear">',
                    data: materialsData,
                    columns: [
                        { data: "MATERIAL" },
                        {
                            data: "NECESIDAD",
                            render: function(data) {
                                return data ? parseFloat(data).toFixed(2) : '0.00';
                            }
                        },
                        { data: "UM" },
                        { data: "CODIGO" },
                        {
                            data: "FECHAENTREGA",
                            render: function(data) {
                                return data ? formatDate(data) : 'N/A';
                            }
                        }
                    ],
                    initComplete: function() {
                        $('#materialsTable thead th').css({
                            'background-color': '#0e2238',
                            'color': 'white'
                        });
                    }
                });

                $('#materialsModal').modal('show');
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al cargar materiales',
                    text: error.message
                });
            });
    });

// Función de filtro de fechas
$.fn.dataTable.ext.search.push(function(settings, data) {
	if (settings.nTable.id !== 'workOrdersTable') return true;

	const min = $('#filter-fecha-desde').val();
	const max = $('#filter-fecha-hasta').val();

	if (!min && !max) return true;

	const dateStr = data[6];
	if (!dateStr) return true;

	const [day, month, year] = dateStr.split('-');
	const date = new Date(year, month - 1, day);

	if (min && new Date(min) > date) return false;
	if (max && new Date(max) < date) return false;

	return true;
});

// Eventos de filtros de fecha
$('#filter-fecha-desde, #filter-fecha-hasta').on('change', function() {
	workOrdersTable.draw();
});
});