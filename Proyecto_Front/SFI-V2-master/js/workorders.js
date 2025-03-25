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
            { data: "OT", orderable: true },
            { data: "CODIGO" },
            { data: "PRODUCTO" },
            {
                data: "DEMANDA",
                className: "text-end", // Alinear valores a la derecha
                render: function (data) {
                    return new Intl.NumberFormat("es-ES").format(data) + " Pack"; // Agregar separador de miles
                }
            },
            { data: "ESTADO" },
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

    function mostrarMateriales(materiales, ot) {
        let tbody = $("#materialsTable tbody");
        tbody.empty(); // Limpiar la tabla antes de agregar nuevos datos

        // Actualizar el título del modal con la OT
        $("#materialsModalLabel").text(`NECESIDAD DE MATERIAL ORDEN NRO ${ot}`);

        // Guardar la OT en un atributo del modal para usarlo luego
        $("#materialsModal").attr("data-ot", ot);

        if (materiales.length === 0) {
            tbody.append("<tr><td colspan='5'>No hay materiales</td></tr>");
            return;
        }

        materiales.forEach(m => {
            tbody.append(`
                <tr>
                    <td style="width: 10%;">${m.CODIGO}</td>
                    <td style="width: 20%;">${m.MATERIAL}</td>
                    <td style="width: 10%;" class="text-end">${m.NECESIDAD} Kg</td>
                    <td style="width: 10%;" class="text-center">${new Date(m.FECHAENTREGA).toLocaleDateString()}</td>
                </tr>
            `);
        });

        // Mostrar el modal con los materiales
        $("#materialsModal").modal("show");
    }

});

//importar excel
$(document).ready(function () {
    let previewTable = null;

    let dataToSend = [];

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
                <td>${order.PRODUCTOID}</td>
                <td>${order.CODIGO}</td>
                <td>${order.DEMANDA}</td>
                <td>${order.UM}</td>
                <td>${order.FECHACREADA}</td>
                <td>${order.FECHAMODIFICADA}</td>
                <td>${order.ESTADO}</td>
                <td>${order.FECHAELABORACION}</td>
            `;
                    tbody.appendChild(tr);
                });

                // Inicializar DataTable con ajustes de diseño
                if (!previewTable) {
                    previewTable = new DataTable("#previewTable", {
                        paging: false,
                        scrollCollapse: true,
                        scrollY: "400px",
                        scrollX: true,  // Deshabilita el scroll horizontal
                        searching: false, // Quita el cuadro de búsqueda
                        autoWidth: false, // Mantiene el ancho de las columnas correcto
                        responsive: true, // Hace que la tabla sea adaptable
                        fixedHeader: true, // 🔥 Mantiene el encabezado fijo al hacer scroll
                        columnDefs: [
                            { width: "10%", targets: 0 },
                            { width: "10%", targets: 1 },
                            { width: "10%", targets: 2 },
                            { width: "10%", targets: 3 },
                            { width: "10%", targets: 4 },
                            { width: "20%", targets: 5 },
                            { width: "20%", targets: 6 },
                            { width: "10%", targets: 7 }
                        ],
                        language: {
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
                    });
                } else {
                    previewTable.clear().draw();
                    previewTable.rows.add($("#previewTable tbody tr")).draw();
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

    document.getElementById("btnEnviar").addEventListener("click", function () {
        if (dataToSend.length === 0) {
            alert("No hay datos para enviar.");
            return;
        }

        let errores = 0;


        dataToSend.forEach(order => {
            fetch("http://localhost:63152/api/WorkOrders/InsertWorkOrderse", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(order)
            })
                .then(response => {
                    if (!response.ok) throw new Error(`Error en la inserción: ${response.statusText}`);
                    return response.json();
                })
                .then(result => {
                    console.log("Insertado correctamente:", result);
                })
                .catch(error => {
                    console.error("Error en la inserción:", error);
                    errores++;
                });
        });

        setTimeout(() => {
            if (errores === 0) {
                Swal.fire({
                    title: "Nuevas Ordenes Insertadas!",
                    icon: "success"
                });
                $("#previewModal").modal("hide"); // Cierra el modal
                document.getElementById("input-excel").value = "";
                
            } else {
                alert("Hubo errores en algunas inserciones.");
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Hubo errores en algunas inserciones.",
                    footer: '<a href="#">Why do I have this issue?</a>'
                });
            }
        }, 1000);

    });
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