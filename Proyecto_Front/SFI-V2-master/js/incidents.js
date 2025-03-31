//tabla de incidencias
$(document).ready(function () {
    // Hacer la solicitud a la API
    $.ajax({
        url: 'http://localhost:63152/api/Unplanned/GetAllUnplanned',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            // Llenar la tabla con los datos
            var tableBody = $('#example tbody');
            data.forEach(function (incidente) {
                var row = `<tr>
                    <td>${incidente.OT}</td>
                    <td>${new Date(incidente.FECHA).toLocaleDateString()}</td>
                    <td>${incidente.HSINICIO}</td>
                    <td>${incidente.HSFIN}</td>
                    <td>${incidente.DETALLE}</td>
                    <td>${incidente.TALLER}</td>
                    <td>${incidente.DURACION}</td>
                </tr>`;
                tableBody.append(row);
            });

            // Inicializar DataTable
            new DataTable('#example', {
                paging: false,
                scrollCollapse: true,
                scrollY: '450px',
                language: {
                    search: "Buscar:",
                    lengthMenu: "Mostrar _MENU_ registros",
                    info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
                    infoEmpty: "No hay registros disponibles",
                    infoFiltered: "(filtrado de _MAX_ registros totales)",
                    zeroRecords: "No se encontraron registros",
                    paginate: {
                        first: "Primero",
                        last: "Último",
                        next: "Siguiente",
                        previous: "Anterior"
                    }}
            });
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener los datos:', error);
        }
    });
});

//Grafico duracion por taller
$(document).ready(function () {
    $.ajax({
        url: "http://localhost:63152/api/Unplanned/GetUnplanned", // Cambia la URL si es necesario
        method: "GET",
        success: function (data) {
            // Procesar los datos obtenidos de la API
            const talleres = data.map(item => item.TALLER);
            const duraciones = data.map(item => item.DURACION);

            // Crear el gráfico de Highcharts
            Highcharts.chart('container', {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Incidencias: detencion no planificada'
                },
                subtitle:{
                    text: 'Minutos por taller'
                },
                xAxis: {
                    categories: talleres, // Usar los nombres de los talleres
                    title: {
                        text: null
                    },
                    gridLineWidth: 1,
                    lineWidth: 0
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Duración (minutos)',
                        align: 'high'
                    },
                    labels: {
                        overflow: 'justify'
                    },
                    gridLineWidth: 0
                },
                tooltip: {
                    valueSuffix: ' minutos'
                },
                plotOptions: {
                    bar: {
                        borderRadius: '50%',
                        dataLabels: {
                            enabled: true
                        },
                        groupPadding: 0.1
                    }
                },
                series: [{
                    name: 'Duración',
                    data: duraciones // Usar las duraciones como los datos de las barras
                }]
            });
        },
        error: function () {
            alert("Error al cargar los datos de la API.");
        }
    });
});