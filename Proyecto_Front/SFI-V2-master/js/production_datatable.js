$(document).ready(function() {
    let table = $('#productionTable').DataTable({
        responsive: true,
        dom: 'Bfrtip',
        buttons: [
            'excel', 'csv'
        ],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
        },
        pageLength: 10,
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
        columnDefs: [
            {
                targets: '_all',
                className: 'dt-center'
            }
        ],
        order: [[0, 'desc']],
        initComplete: function() {
            $('.dataTables_wrapper').addClass('container-fluid');
            $('.dataTables_filter input').addClass('form-control form-control-sm');
            $('.dataTables_length select').addClass('form-control form-control-sm');
        },
        columns: [
            { 
                data: 'FECHA',
                render: function(data) {
                    // Formatear la fecha para mostrar solo YYYY-MM-DD
                    return data.split('T')[0];
                }
            },
            { data: 'TURNO' },
            { data: 'RESPONSABLE' },
            { data: 'OT' },
            { data: 'PRODUCTO' },
            { data: 'PRODUCIDO' },
            { 
                data: 'PERFORMANCE',
                render: function(data) {
                    // Formatear el performance como porcentaje
                    return (data / 100).toFixed(2) + '%';
                }
            }
        ],
        ajax: {
            url: 'http://localhost:63152/api/Production/GetAllProduction',
            dataSrc: ''
        }
    });
});
