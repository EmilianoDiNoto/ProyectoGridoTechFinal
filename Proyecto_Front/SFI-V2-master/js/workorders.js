// DataTable con paginación explícitamente habilitada
$(document).ready(function () {
    let tableWorkOrders = $('#workOrdersTable').DataTable({
        autoWidth: false,
        scrollX: true,
        responsive: true,
        order: [[0, "desc"]],
        // Asegurar que la paginación esté habilitada
        paging: true,          // Habilitar paginación explícitamente
        pageLength: 10,        // Establecer número de filas por página
        lengthMenu: [10, 25, 50, 100], // Opciones de registros por página
        
        ajax: {
            url: "http://localhost:63152/api/WorkOrders/GetAllWorkOrders",
            method: "GET",
            dataSrc: ""
        },
        columns: [
            {
                data: "OT",
                orderable: true,
                className: "text-center"
            },
            {
                data: "CODIGO",
                className: "text-center"
            },
            {
                data: "PRODUCTO",
                className: "text-center"
            },
            {
                data: "DEMANDA",
                className: "text-center",
                render: function (data) {
                    return new Intl.NumberFormat("es-ES").format(data) + " Pack";
                }
            },
            {
                data: "ESTADO",
                className: "text-center"
            },
            {
                data: "FECHAELABORACION",
                className: "text-center",
                title: "ELABORACION",
                render: function (data) {
                    let date = new Date(data);
                    return date.toLocaleDateString();
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
        },
        // Definir clases para todas las columnas
        columnDefs: [
            { className: "text-center", targets: "_all" }
        ],
        initComplete: function () {
            setTimeout(() => {
                tableWorkOrders.columns.adjust();
            }, 500);

            // Alinear correctamente el buscador
            $("#workOrdersTable_filter").addClass("d-flex align-items-center mb-3");
            $("#workOrdersTable_filter label").addClass("me-2 fw-bold");
        }
    });

    // Resto del código igual...



    // Evento de clic en la fila de la tabla
    $('#workOrdersTable tbody').on('click', 'tr', function () {
        let data = tableWorkOrders.row(this).data();
        let ot = data.OT;  // Obtener el número de orden de trabajo
        cargarMateriales(ot); // Llamar a la función que obtiene los materiales
    });

    function cargarMateriales(ot) {
        $.ajax({
            url: `http://localhost:63152/api/WorkOrderMaterial/GetWorkOrderMaterials?ot=${ot}`,
            method: "GET",
            success: function (data) {
                mostrarMateriales(data, ot);
            },
            error: function (xhr, status, error) {
                console.error("Error al obtener materiales:", error);
            }
        });
    }

    // Actualizar la función mostrarMateriales para asegurar que todas las celdas estén centradas
    function mostrarMateriales(materiales, ot) {
        let tbody = $("#materialsTable tbody");
        tbody.empty(); // Limpiar la tabla antes de agregar nuevos datos

        // Actualizar el título del modal con la OT
        $("#materialsModalLabel").text(`NECESIDAD DE MATERIAL ORDEN NRO ${ot}`);

        // Guardar la OT en un atributo del modal para usarlo luego
        $("#materialsModal").attr("data-ot", ot);

        if (materiales.length === 0) {
            tbody.append("<tr><td colspan='5' class='text-center'>No hay materiales</td></tr>");
            return;
        }

        materiales.forEach(m => {
            tbody.append(`
                <tr>
                    <td style="width: 10%;" class="text-center">${m.CODIGO}</td>
                    <td style="width: 20%;" class="text-center">${m.MATERIAL}</td>
                    <td style="width: 10%;" class="text-center">${m.NECESIDAD} Kg</td>
                    <td style="width: 10%;" class="text-center">${new Date(m.FECHAENTREGA).toLocaleDateString()}</td>
                </tr>
            `);
        });

        // Mostrar el modal con los materiales
        $("#materialsModal").modal("show");
    }
    // Modificar el modal al abrirse
    $('#previewModal').on('shown.bs.modal', function () {
        // Ajustar la tabla para que se adapte al nuevo tamaño del modal
        if (previewTable) {
            previewTable.columns.adjust().draw();
        }

        // Asegurar que las celdas estén centradas
        $('#previewTable thead th, #previewTable tbody td').css({
            'text-align': 'center',
            'vertical-align': 'middle'
        });

        // Aplicar estilos adicionales a la tabla para mejorar visualización
        $('#previewTable').css({
            'width': '100%'
        });

        // Ajustar la altura del contenedor scrollable
        $('.dataTables_scrollBody').css({
            'max-height': '65vh'
        });
    });

});

// Modificación mínima para añadir paginación manteniendo tu código existente
$(document).ready(function () {
    let dataToSend = [];
    let currentExcelFile = null;

    // Evento para cuando se selecciona un archivo Excel
    document.getElementById("input-excel").addEventListener("change", function(event) {
        const file = event.target.files[0];
        currentExcelFile = file;
        
        if (file) {
            // Mostrar un indicador de carga
            Swal.fire({
                title: 'Procesando archivo...',
                html: 'Esto puede tomar unos segundos',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            // Leer el archivo Excel
            readXlsxFile(file).then(function(rows) {
                // Cerrar el indicador de carga
                Swal.close();
                
                if (rows.length <= 1) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Archivo vacío',
                        text: 'El archivo Excel no contiene datos o solo tiene encabezados'
                    });
                    return;
                }
                
                console.log("Datos del Excel:", rows);
                
                // Obtener los encabezados desde la primera fila
                const headers = rows[0];
                dataToSend = [];
                
                // Mapear los índices de las columnas
                const indexes = {
                    PRODUCTOID: headers.indexOf("PRODUCTOID"),
                    CODIGO: headers.indexOf("CODIGO"),
                    DEMANDA: headers.indexOf("DEMANDA"),
                    UM: headers.indexOf("UM"),
                    FECHACREADA: headers.indexOf("FECHACREADA"),
                    FECHAMODIFICADA: headers.indexOf("FECHAMODIFICADA"),
                    ESTADO: headers.indexOf("ESTADO"),
                    FECHAELABORACION: headers.indexOf("FECHAELABORACION")
                };
                
                // Verificar que se encontraron todas las columnas necesarias
                for (const [key, value] of Object.entries(indexes)) {
                    if (value === -1) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Formato incorrecto',
                            text: `No se encontró la columna ${key} en el archivo Excel`
                        });
                        return;
                    }
                }
                
                // *** INICIO DE LOS CAMBIOS ***
                // Preparar datos para DataTable
                const tableData = [];
                
                // Destruir la tabla si ya existe
                if ($.fn.DataTable.isDataTable('#previewTable')) {
                    $('#previewTable').DataTable().destroy();
                }
                
                // Limpiar la tabla existente
                $("#previewTable tbody").empty();
                
                // Procesar las filas de datos (excluyendo la fila de encabezados)
                rows.slice(1).forEach((row, index) => {
                    // Crear un objeto con los datos de la orden
                    const order = {
                        PRODUCTOID: parseInt(row[indexes.PRODUCTOID]) || 0,
                        CODIGO: row[indexes.CODIGO] ? parseInt(row[indexes.CODIGO]) : 0,
                        DEMANDA: row[indexes.DEMANDA] ? parseInt(row[indexes.DEMANDA]) : 0,
                        UM: row[indexes.UM] || "",
                        FECHACREADA: formatDate(row[indexes.FECHACREADA]),
                        FECHAMODIFICADA: formatDate(row[indexes.FECHAMODIFICADA]),
                        ESTADO: row[indexes.ESTADO] || "PENDIENTE",
                        FECHAELABORACION: formatDate(row[indexes.FECHAELABORACION])
                    };
                    
                    // Añadir la orden al array de datos a enviar
                    dataToSend.push(order);
                    
                    // Añadir datos a la tabla
                    tableData.push([
                        order.PRODUCTOID,
                        order.CODIGO,
                        order.DEMANDA.toLocaleString(),
                        order.UM,
                        order.FECHACREADA,
                        order.FECHAMODIFICADA,
                        order.ESTADO,
                        order.FECHAELABORACION
                    ]);
                });
                
                // Inicializar DataTable con los datos
                $('#previewTable').DataTable({
                    data: tableData,
                    paging: true,               // Habilitar paginación explícitamente 
                    pageLength: 10,             // Número de registros por página
                    lengthMenu: [10, 25, 50, 100], // Opciones de registros por página
                    info: true,                 // Mostrar información (1-10 de 100 registros)
                    ordering: false,            // Deshabilitar ordenamiento para mantener las columnas como están
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
                    // Aplicar estilos consistentes después de inicializar/redibujar
                    drawCallback: function() {
                        applyTableStyles();
                    },
                    initComplete: function() {
                        applyTableStyles();
                    }
                });
                // *** FIN DE LOS CAMBIOS ***
                
                // Mostrar el modal con la vista previa
                $("#previewModal").modal("show");
                
                // Actualizar información sobre el archivo
                updateFileInfo(file, rows.length - 1);
                
            }).catch(error => {
                console.error("Error al leer el archivo:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al procesar el archivo',
                    text: 'Asegúrese de que es un archivo Excel válido con el formato correcto'
                });
            });
        }
    });
    
    // Nueva función para aplicar estilos a la tabla
    function applyTableStyles() {
        // Aplicar estilos a encabezados
        $('#previewTable thead th').css({
            'background-color': '#375d89',
            'color': 'white',
            'text-align': 'center',
            'vertical-align': 'middle',
            'font-weight': 'bold',
            'border': '1px solid #32383e'
        });
        
        // Aplicar estilos a celdas
        $('#previewTable tbody td').css({
            'text-align': 'center',
            'vertical-align': 'middle',
            'border': '1px solid #dee2e6'
        });
        
        // Aplicar colores alternos a las filas
        $('#previewTable tbody tr:odd').css('background-color', '#f8f9fa');
        $('#previewTable tbody tr:even').css('background-color', '#ffffff');
        
        // Asignar anchos proporcionales a las columnas
        const totalWidth = $("#previewTable").width();
        const widths = {
            0: 7,    // PRODUCTOID
            1: 10,   // CODIGO
            2: 10,   // DEMANDA
            3: 7,    // UM
            4: 15,   // FECHACREADA
            5: 15,   // FECHAMODIFICADA
            6: 13,   // ESTADO
            7: 15    // FECHAELABORACION
        };
        
        // Aplicar los anchos calculados
        for (let i = 0; i < 8; i++) {
            const columnWidth = Math.floor((totalWidth * widths[i]) / 100);
            $(`#previewTable th:nth-child(${i+1}), #previewTable td:nth-child(${i+1})`).css('width', columnWidth + 'px');
        }
        
        // Mejorar la apariencia de los controles
        $('.dataTables_length, .dataTables_filter').css({
            'margin-bottom': '15px'
        });
        
        $('.dataTables_info, .dataTables_paginate').css({
            'margin-top': '15px'
        });
    }
    
    // Función para mostrar información sobre el archivo (sin cambios)
    function updateFileInfo(file, rowCount) {
        const fileInfo = `
            <div class="file-info">
                <strong>Archivo:</strong> ${file.name} 
                <strong>Tamaño:</strong> ${formatFileSize(file.size)}
                <strong>Registros:</strong> ${rowCount} órdenes
            </div>
        `;
        $("#file-info-container").html(fileInfo);
    }
    
    // Función para formatear el tamaño del archivo (sin cambios)
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + " bytes";
        else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
        else return (bytes / 1048576).toFixed(2) + " MB";
    }
    
    // Función para formatear fechas (sin cambios)
    function formatDate(date) {
        if (!date) return "";
        
        // Si es un string, verificar si tiene formato de fecha
        if (typeof date === "string") {
            // Intentar construir una fecha desde el string
            const parsedDate = new Date(date);
            if (!isNaN(parsedDate.getTime())) {
                return parsedDate.toISOString().split("T")[0];
            }
            return date;
        }
        
        // Si es un objeto Date
        if (date instanceof Date) {
            return date.toISOString().split("T")[0];
        }
        
        // Si es un número (representación de Excel para fechas)
        if (typeof date === "number") {
            // Excel almacena fechas como días desde el 1/1/1900
            // Esto es una aproximación básica
            const excelEpoch = new Date(1899, 11, 30);
            const resultDate = new Date(excelEpoch);
            resultDate.setDate(excelEpoch.getDate() + date);
            return resultDate.toISOString().split("T")[0];
        }
        
        return "";
    }
    
    // Evento para el botón de enviar datos a la base de datos (sin cambios)
    document.getElementById("btnEnviar").addEventListener("click", function() {
        if (dataToSend.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'No hay datos',
                text: 'No hay órdenes de trabajo para enviar a la base de datos'
            });
            return;
        }
        
        // Confirmar la acción
        Swal.fire({
            title: '¿Está seguro?',
            text: `Se enviarán ${dataToSend.length} órdenes de trabajo a la base de datos`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, enviar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Mostrar indicador de carga durante el envío
                Swal.fire({
                    title: 'Enviando datos...',
                    html: `<div id="progress-container">
                             <div class="progress">
                               <div id="progress-bar" class="progress-bar progress-bar-striped progress-bar-animated" 
                                    role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">
                                 0%
                               </div>
                             </div>
                             <div id="progress-text">Procesando orden 0 de ${dataToSend.length}</div>
                           </div>`,
                    allowOutsideClick: false,
                    showConfirmButton: false
                });
                
                // Variables para seguimiento del progreso
                let completedRequests = 0;
                let errorCount = 0;
                
                // Procesar las órdenes de una en una para mejor control
                const processNextOrder = (index) => {
                    if (index >= dataToSend.length) {
                        // Todas las órdenes procesadas
                        setTimeout(() => {
                            if (errorCount === 0) {
                                Swal.fire({
                                    icon: 'success',
                                    title: '¡Órdenes enviadas!',
                                    text: `Se han insertado correctamente ${dataToSend.length} órdenes de trabajo`
                                });
                                $("#previewModal").modal("hide");
                                document.getElementById("input-excel").value = "";
                                // Recargar la tabla de órdenes
                                reloadWorkOrdersTable();
                            } else {
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'Proceso completado con errores',
                                    text: `Se insertaron ${dataToSend.length - errorCount} órdenes correctamente, pero ${errorCount} órdenes fallaron`
                                });
                            }
                        }, 500);
                        return;
                    }
                    
                    // Actualizar barra de progreso
                    const progressPercent = Math.round((index / dataToSend.length) * 100);
                    $("#progress-bar").css("width", progressPercent + "%").attr("aria-valuenow", progressPercent).text(progressPercent + "%");
                    $("#progress-text").text(`Procesando orden ${index + 1} de ${dataToSend.length}`);
                    
                    // Enviar la orden actual
                    fetch("http://localhost:63152/api/WorkOrders/InsertWorkOrderse", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(dataToSend[index])
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Error: ${response.status} ${response.statusText}`);
                        }
                        return response.json();
                    })
                    .then(result => {
                        console.log(`Orden ${index + 1} insertada:`, result);
                        completedRequests++;
                        // Procesar siguiente orden
                        processNextOrder(index + 1);
                    })
                    .catch(error => {
                        console.error(`Error al insertar orden ${index + 1}:`, error);
                        errorCount++;
                        completedRequests++;
                        // Continuar con la siguiente orden a pesar del error
                        processNextOrder(index + 1);
                    });
                };
                
                // Iniciar el procesamiento con la primera orden
                processNextOrder(0);
            }
        });
    });
    
    // Función para recargar la tabla de órdenes de trabajo (sin cambios)
    function reloadWorkOrdersTable() {
        const table = $('#workOrdersTable').DataTable();
        table.ajax.reload();
    }
    
    // Mostrar una vista previa del Excel seleccionado al hacer clic en el nombre del archivo (sin cambios)
    $(document).on('click', '.file-name', function() {
        if (currentExcelFile) {
            $("#previewModal").modal("show");
        }
    });
    
    // Evento cuando se muestra el modal (modificado para ajustar columnas)
    $('#previewModal').on('shown.bs.modal', function() {
        // Ajustar la tabla si ya está inicializada con DataTable
        if ($.fn.DataTable.isDataTable('#previewTable')) {
            $('#previewTable').DataTable().columns.adjust();
            applyTableStyles();
        }
    });
    
    // Ajustar tamaño de columnas cuando cambia el tamaño de la ventana
    $(window).resize(function() {
        if ($("#previewModal").hasClass('show') && $.fn.DataTable.isDataTable('#previewTable')) {
            $('#previewTable').DataTable().columns.adjust();
            applyTableStyles();
        }
    });
});