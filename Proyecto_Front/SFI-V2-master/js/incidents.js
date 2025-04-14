$(document).ready(function () {
    // Hacer la solicitud a la API
    $.ajax({
        url: 'http://localhost:63152/api/Unplanned/GetAllUnplanned',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            // Inicializar DataTable con los datos de la API
            $('#example').DataTable({
                data: data,
                columns: [
                    { 
                        data: 'OT',
                        render: function(data, type) {
                            if (type === 'sort' || type === 'type') {
                                return data;
                            }
                            return `<span class="ot-badge">${data}</span>`;
                        }
                    },
                    { 
                        data: 'FECHA',
                        render: function(data, type) {
                            if (type === 'sort') {
                                return new Date(data).getTime();
                            }
                            return new Date(data).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit'
                            });
                        }
                    },
                    { data: 'HSINICIO' },
                    { data: 'HSFIN' },
                    { data: 'DETALLE' },
                    { 
                        data: 'TALLER',
                        render: function(data, type) {
                            if (type === 'sort' || type === 'type') {
                                return data;
                            }
                            
                            let tallerClass = '';
                            
                            // Asignar clase basada en el tipo de taller
                            if (data.toLowerCase().includes('mecanico') || data.toLowerCase().includes('mecánico')) {
                                tallerClass = 'taller-mecanico';
                            } else if (data.toLowerCase().includes('electrico') || data.toLowerCase().includes('eléctrico')) {
                                tallerClass = 'taller-electrico';
                            } else {
                                tallerClass = 'taller-general';
                            }
                            
                            return `<span class="${tallerClass}">${data}</span>`;
                        }
                    },
                    { 
                        data: 'DURACION',
                        render: function(data, type) {
                            if (type === 'sort' || type === 'type') {
                                return data;
                            }
                            
                            // Formato para la duración con color basado en la gravedad
                            let duracionClass = '';
                            
                            if (data > 120) {
                                duracionClass = 'text-danger';
                            } else if (data > 60) {
                                duracionClass = 'text-warning';
                            } else {
                                duracionClass = 'text-success';
                            }
                            
                            return `<span class="${duracionClass} fw-bold">${data} min</span>`;
                        }
                    }
                ],
                order: [[0, 'desc']], // Ordenar por OT en orden descendente
                paging: true,         // Activar paginación
                pageLength: 15,       // Filas por página
                scrollY: '60vh',      // Altura del scroll
                scrollCollapse: true,
                responsive: true,     // Hacer la tabla responsive
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
                },
                dom: '<"top"lf>rt<"bottom"ip>',  // Personalizar layout
                initComplete: function() {
                    // Agregar clases adicionales para mejorar el estilo
                    $('.dataTables_wrapper').addClass('container-fluid px-0');
                    $('.dataTables_filter').addClass('mb-3');
                    $('.dataTables_length').addClass('mb-3');
                    
                    // Añadir título con la fecha actual
                    var today = new Date();
                    var dateStr = today.toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });
                    
                    $('.container h2').html('Incidencias Registradas <small class="text-muted">Fecha: ' + dateStr + '</small>');
                }
            });
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener los datos:', error);
            // Mostrar mensaje de error amigable
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar datos',
                text: 'No se pudieron cargar las incidencias. Por favor, intente nuevamente.',
                confirmButtonColor: '#0e2238'
            });
        }
    });
    
    // Si quieres añadir interactividad a la tabla
    $('#example').on('click', 'tbody tr', function() {
        // Obtener datos de la fila seleccionada
        var table = $('#example').DataTable();
        var data = table.row(this).data();
        
        if (data) {
            // Mostrar detalles en un modal
            Swal.fire({
                title: 'Detalle de Incidencia',
                html: `
                    <div class="text-start">
                        <p><strong>OT:</strong> ${data.OT}</p>
                        <p><strong>Fecha:</strong> ${new Date(data.FECHA).toLocaleDateString('es-ES')}</p>
                        <p><strong>Horario:</strong> ${data.HSINICIO} a ${data.HSFIN}</p>
                        <p><strong>Taller:</strong> ${data.TALLER}</p>
                        <p><strong>Duración:</strong> ${data.DURACION} minutos</p>
                        <hr>
                        <p><strong>Descripción:</strong></p>
                        <p class="text-muted">${data.DETALLE}</p>
                    </div>
                `,
                confirmButtonColor: '#0e2238',
                confirmButtonText: 'Cerrar'
            });
        }
    });
});