$(document).ready(function () {
    let tableWorkOrders = $('#workOrdersTable').DataTable({
        autoWidth: false,
        scrollX: true,  // Habilita desplazamiento horizontal
        responsive: true,
        order: [[0, "desc"]], // Ordena inicialmente por OT descendente
        ajax: {
            url: "http://localhost:63152/api/WorkOrders",
            method: "GET",
            dataSrc: "" // La API devuelve un array directamente
        },
        columns: [
            { data: "OT", orderable: true },
            { data: "CODIGO" },
            { data: "PRODUCTO" },
            { data: "DEMANDA" },
            { data: "UM" },
            { data: "ESTADO" },
            {
                data: "FECHAELABORACION",
                title: "Fecha Elaboración",
                render: function (data) {
                    let date = new Date(data);
                    return date.toLocaleDateString(); // Formatea la fecha en dd/mm/aaaa
                }
            }
        ],
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
            }
        }
    });

    // Botón para recargar la tabla manualmente
    $('#reloadWorkOrders').on('click', function () {
        tableWorkOrders.ajax.reload(null, false); // Recarga sin cambiar de página
    });
});