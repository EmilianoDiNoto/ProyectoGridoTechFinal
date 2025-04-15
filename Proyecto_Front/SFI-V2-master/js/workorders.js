// Modificar la inicialización de la tabla para asegurar que todas las columnas estén centradas

$(document).ready(function () {
    let tableWorkOrders = $('#workOrdersTable').DataTable({
        autoWidth: false,
        scrollX: true,
        responsive: true,
        order: [[0, "desc"]],
        ajax: {
            url: "http://localhost:63152/api/WorkOrders/GetAllWorkOrders",
            method: "GET",
            dataSrc: ""
        },
        columns: [
            {
                data: "OT",
                orderable: true,
                className: "text-center" // Añadir la clase para centrar
            },
            {
                data: "CODIGO",
                className: "text-center" // Añadir la clase para centrar
            },
            {
                data: "PRODUCTO",
                className: "text-center" // Añadir la clase para centrar
            },
            {
                data: "DEMANDA",
                className: "text-center", // Cambiar de text-end a text-center
                render: function (data) {
                    return new Intl.NumberFormat("es-ES").format(data) + " Pack"; // Mantener el formato con separador de miles
                }
            },
            {
                data: "ESTADO",
                className: "text-center" // Añadir la clase para centrar
            },
            {
                data: "FECHAELABORACION",
                className: "text-center", // Ya está centrado, mantener la clase
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
            }, 500); // Pequeño retraso para asegurarse de que se ajusta después de la carga

            // Alinear correctamente el buscador
            $("#workOrdersTable_filter").addClass("d-flex align-items-center mb-3");
            $("#workOrdersTable_filter label").addClass("me-2 fw-bold"); // Espaciado entre texto e input
        }
    });


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

//importar excel
$(document).ready(function () {
    let previewTable = null;
    let dataToSend = [];

    // Cuando el modal se muestre, limpiar y aplicar estilos
    $('#previewModal').on('shown.bs.modal', function() {
        // Dar tiempo a que el DOM se actualice completamente
        setTimeout(function() {
            // Remover todas las clases de ordenamiento y atributos adicionales
            $('#previewTable thead th').removeClass('sorting sorting_asc sorting_desc sorting_disabled');
            $('#previewTable thead th').removeAttr('rowspan colspan');
            
            // Eliminar manejadores de eventos de clic que DataTables pudo haber agregado
            $('#previewTable thead th').off('click.DT');
            
            // Aplicar estilos directamente (mayor prioridad)
            $('#previewTable thead th').attr('style', 
                'text-align: center !important; ' +
                'vertical-align: middle !important; ' +
                'background-color: #375d89 !important; ' +
                'color: white !important; ' +
                'font-weight: bold !important; ' +
                'padding: 10px !important; ' +
                'border: 1px solid #dee2e6 !important'
            );
            
            // Ajustar ancho de contenedores
            $('.dataTables_scrollHeadInner, .dataTables_scrollHeadInner table').css({
                'width': '100% !important'
            });
            
            // Ajustar las columnas de la tabla
            if (previewTable) {
                previewTable.columns.adjust();
            }
        }, 100);
    });

    document.getElementById("input-excel").addEventListener("change", function (event) {
        let file = event.target.files[0];

        if (file) {
            readXlsxFile(file).then(function (rows) {
                console.log("Datos del Excel:", rows);

                let headers = rows[0];
                dataToSend = [];

                let indexes = {
                    PRODUCTOID: headers.indexOf("PRODUCTOID"),
                    CODIGO: headers.indexOf("CODIGO"),
                    DEMANDA: headers.indexOf("DEMANDA"),
                    UM: headers.indexOf("UM"),
                    FECHACREADA: headers.indexOf("FECHACREADA"),
                    FECHAMODIFICADA: headers.indexOf("FECHAMODIFICADA"),
                    ESTADO: headers.indexOf("ESTADO"),
                    FECHAELABORACION: headers.indexOf("FECHAELABORACION")
                };

                let tbody = document.querySelector("#previewTable tbody");
                tbody.innerHTML = "";

                rows.slice(1).forEach(row => {
                    let order = {
                        PRODUCTOID: parseInt(row[indexes.PRODUCTOID]) || 0,
                        CODIGO: parseInt(row[indexes.CODIGO]) || 0,
                        DEMANDA: parseInt(row[indexes.DEMANDA]) || 0,
                        UM: row[indexes.UM] || "",
                        FECHACREADA: formatDate(row[indexes.FECHACREADA]),
                        FECHAMODIFICADA: formatDate(row[indexes.FECHAMODIFICADA]),
                        ESTADO: row[indexes.ESTADO] || "PENDIENTE",
                        FECHAELABORACION: formatDate(row[indexes.FECHAELABORACION])
                    };

                    dataToSend.push(order);

                    let tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td class="text-center">${order.PRODUCTOID}</td>
                        <td class="text-center">${order.CODIGO}</td>
                        <td class="text-center">${order.DEMANDA}</td>
                        <td class="text-center">${order.UM}</td>
                        <td class="text-center">${order.FECHACREADA}</td>
                        <td class="text-center">${order.FECHAMODIFICADA}</td>
                        <td class="text-center">${order.ESTADO}</td>
                        <td class="text-center">${order.FECHAELABORACION}</td>
                    `;
                    tbody.appendChild(tr);
                });

                if (!previewTable) {
                    previewTable = new DataTable("#previewTable", {
                        paging: false,
                        scrollCollapse: true,
                        scrollY: "60vh",
                        scrollX: true,
                        searching: false,
                        autoWidth: false,
                        responsive: false,
                        fixedHeader: true,
                        info: false,
                        ordering: false,       // Desactivar completamente el ordenamiento
                        dom: 't',              // Solo mostrar la tabla sin controles

                        // Definir columnas explícitamente para evitar atributos automáticos
                        columns: [
                            { title: "ID", orderable: false, className: "text-center" },
                            { title: "CODIGO", orderable: false, className: "text-center" },
                            { title: "DEMANDA", orderable: false, className: "text-center" },
                            { title: "UM", orderable: false, className: "text-center" },
                            { title: "FECHACREADA", orderable: false, className: "text-center" },
                            { title: "FECHAMODIFICADA", orderable: false, className: "text-center" },
                            { title: "ESTADO", orderable: false, className: "text-center" },
                            { title: "FECHAELABORACION", orderable: false, className: "text-center" }
                        ],

                        columnDefs: [
                            { orderable: false, targets: '_all' },  // Deshabilitar ordenamiento en todas las columnas
                            { className: "text-center", targets: "_all" },  // Centrar todas las columnas
                            // Definir anchos específicos
                            { width: "7%", targets: 0 },
                            { width: "10%", targets: 1 },
                            { width: "10%", targets: 2 },
                            { width: "7%", targets: 3 },
                            { width: "15%", targets: 4 },
                            { width: "15%", targets: 5 },
                            { width: "13%", targets: 6 },
                            { width: "15%", targets: 7 }
                        ],
                        
                        language: {
                            lengthMenu: "Mostrar _MENU_ registros",
                            info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
                            infoEmpty: "No hay registros disponibles",
                            infoFiltered: "(filtrado de _MAX_ registros totales)",
                            zeroRecords: "No se encontraron registros",
                            emptyTable: "No hay datos disponibles",
                            paginate: {
                                first: "Primero",
                                last: "Último",
                                next: "Siguiente",
                                previous: "Anterior"
                            }
                        },
                        
                        // Eventos importantes para eliminar clases no deseadas
                        initComplete: function() {
                            // Remover todas las clases de ordenamiento y atributos adicionales
                            $('#previewTable thead th').removeClass('sorting sorting_asc sorting_desc sorting_disabled');
                            $('#previewTable thead th').removeAttr('rowspan colspan');

                            // Aplicar estilos limpios
                            $('#previewTable thead th').css({
                                'text-align': 'center',
                                'vertical-align': 'middle',
                                'background-color': '#375d89',
                                'color': 'white',
                                'font-weight': 'bold',
                                'border': '1px solid #dee2e6'
                            });
                        },

                        drawCallback: function() {
                            // Ajustar anchos y centrado después de cada dibujado
                            $('.dataTables_scrollHeadInner, .dataTables_scrollHeadInner table').css('width', '100%');

                            // Remover clases de ordenamiento cada vez que se redibuja
                            $('#previewTable thead th').removeClass('sorting sorting_asc sorting_desc sorting_disabled');
                            $('#previewTable thead th').removeAttr('rowspan colspan');

                            // Aplicar estilos limpios nuevamente
                            $('#previewTable thead th').css({
                                'text-align': 'center',
                                'vertical-align': 'middle',
                                'background-color': '#375d89',
                                'color': 'white',
                                'font-weight': 'bold',
                                'border': '1px solid #dee2e6'
                            });
                        }
                    });
                } else {
                    // Limpiar y actualizar la tabla existente
                    previewTable.clear();
                    previewTable.rows.add($("#previewTable tbody tr"));
                    previewTable.draw();

                    // Volver a aplicar limpieza de clases y atributos
                    $('#previewTable thead th').removeClass('sorting sorting_asc sorting_desc sorting_disabled');
                    $('#previewTable thead th').removeAttr('rowspan colspan');

                    // Aplicar estilos limpios
                    $('#previewTable thead th').css({
                        'text-align': 'center',
                        'vertical-align': 'middle',
                        'background-color': '#375d89',
                        'color': 'white',
                        'font-weight': 'bold',
                        'border': '1px solid #dee2e6'
                    });
                }

                // Mostrar el botón para abrir el modal
                document.getElementById("btnMostrarModal").click();
            }).catch(error => console.error("Error al leer el archivo:", error));
        }
    });

    function formatDate(date) {
        if (!date) return "";
        if (typeof date === "string") return date;
        if (date instanceof Date) {
            return date.toISOString().split("T")[0];
        }
        return "";
    }

    function reloadWorkOrdersTable() {
        fetch("http://localhost:63152/api/WorkOrders/GetAllWorkOrders")
            .then(response => response.json())
            .then(data => {
                let table = $('#workOrdersTable').DataTable();
                table.clear();
                table.rows.add(data).draw();
            })
            .catch(error => console.error("Error al cargar las órdenes:", error));
    }

    document.getElementById("btnEnviar").addEventListener("click", function () {
        if (dataToSend.length === 0) {
            alert("No hay datos para enviar.");
            return;
        }

        let errores = 0;

        let promises = dataToSend.map(order =>
            fetch("http://localhost:63152/api/WorkOrders/InsertWorkOrderse", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(order)
            })
                .then(response => {
                    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
                    return response.json();
                })
                .then(result => console.log("Insertado:", result))
                .catch(error => {
                    console.error("Error en la inserción:", error);
                    errores++;
                })
        );

        Promise.all(promises).then(() => {
            setTimeout(() => {
                if (errores === 0) {
                    Swal.fire({ title: "Órdenes Insertadas!", icon: "success" });
                    $("#previewModal").modal("hide");
                    document.getElementById("input-excel").value = "";
                    reloadWorkOrdersTable(); // 🔥 Refrescar tabla
                } else {
                    Swal.fire({ icon: "error", title: "Oops...", text: "Hubo errores en algunas inserciones." });
                }
            }, 1000);
        });
    });
});