//RECETA POR PRODUCTNAME
$(document).ready(function () {
    $(".ice-cream-item img").click(function () {
        var productName = $(this).parent().attr("data-product");
        var apiUrl = "http://localhost:63152/api/Recipe/GetRecipeMaterials?productName=" + encodeURIComponent(productName);

        $.ajax({
            url: apiUrl,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if (!data || data.length === 0) {
                    Swal.fire({
                        title: "Sin datos",
                        text: "No hay materiales registrados para este producto.",
                        icon: "warning",
                        confirmButtonText: "Cerrar"
                    });
                    return;
                }

                // Calcular el total de las cantidades
                let totalCantidad = data.reduce((sum, item) => sum + parseFloat(item.Quantity || 0), 0);

                // Generar la tabla con los datos recibidos
                let tableContent = `
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th style="text-align: left;">Material</th>
                            <th style="text-align: right;">Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>`;

                data.forEach(item => {
                    tableContent += `
                    <tr>
                        <td style="text-align: left;">${item.Material}</td>
                        <td style="text-align: right;">${parseFloat(item.Quantity || 0).toFixed(3)}</td>
                    </tr>`;
                });

                // Agregar la fila de total
                tableContent += `
                    <tr style="font-weight: bold; background-color: #f8f9fa;">
                        <td style="text-align: left;">PESO FINAL</td>
                        <td style="text-align: right;">${totalCantidad.toFixed(3)}</td>
                    </tr>
                </tbody>
                </table>`;

                // Mostrar la tabla en SweetAlert2
                Swal.fire({
                    title: `Estructura de ${productName} (Cálculo de un pack x 6 unidades)`,
                    html: tableContent,
                    icon: "info",
                    confirmButtonText: "Cerrar",
                    width: "600px"
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error en la petición AJAX:", textStatus, errorThrown);
                console.error("Respuesta del servidor:", jqXHR.responseText);

                Swal.fire({
                    title: "Error",
                    text: "No se pudo obtener la estructura del producto. Verifica la API y la conexión.",
                    icon: "error",
                    confirmButtonText: "Cerrar"
                });
            }
        });
    });
});

// Notificación de Órdenes de Trabajo por Producto
$(document).ready(function () {
    let oldestPendingOrder = null;
    let targetButton = null;

    $(".ice-cream-item").each(function () {
        const productElement = $(this);
        const productName = productElement.data("product");
        const orderButton = productElement.find(".order-btn");

        // Reemplazar caracteres problemáticos en la URL
        const safeProductName = encodeURIComponent(productName.replace(/\//g, "-"));

        fetch(`http://localhost:63152/api/WorkOrders/by-product/${safeProductName}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const pendingOrders = data.filter(order => order.ESTADO === "PENDIENTE");

                if (pendingOrders.length > 0) {
                    const oldestOrder = pendingOrders.reduce((oldest, current) =>
                        new Date(current.FECHAELABORACION) < new Date(oldest.FECHAELABORACION) ? current : oldest
                    );

                    if (!oldestPendingOrder || new Date(oldestOrder.FECHAELABORACION) < new Date(oldestPendingOrder.FECHAELABORACION)) {
                        oldestPendingOrder = oldestOrder;
                        targetButton = orderButton;
                    }
                }
            })
            .catch(error => console.error(`Error al consultar órdenes para ${productName}:`, error));
    });

    setTimeout(() => {
        if (targetButton) {
            targetButton.text("⚠️ Orden Pendiente").addClass("btn-warning").show();

            targetButton.on("click", function () {
                if (oldestPendingOrder) {
                    Swal.fire({
                        title: "Orden Pendiente",
                        html: `<strong>OT:</strong> ${oldestPendingOrder.OT}<br>                            
                        <strong>Producto:</strong> ${oldestPendingOrder.PRODUCTO}<br>                               
                               <strong>Demanda:</strong> ${oldestPendingOrder.DEMANDA}`,
                        icon: "info",
                        confirmButtonText: "COMENZAR A PRODUCIR"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const ot = encodeURIComponent(oldestPendingOrder.OT);
                            const producto = encodeURIComponent(oldestPendingOrder.PRODUCTO);

                            // Redirigir con parámetros en la URL
                            window.location.href = `production1.html?ot=${ot}&producto=${producto}`;
                        }
                    });
                }
            });
        }
    }, 1000);
});

//EXTRACION DE DATOS
document.addEventListener("DOMContentLoaded", function () {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById("validationCustom04").value = today;
});

document.addEventListener("DOMContentLoaded", function () {
    // Obtener los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const ot = params.get("ot");
    const producto = params.get("producto");

    // Asignar los valores a los inputs
    if (ot) {
        document.getElementById("validationCustom01").value = ot;
    }
    if (producto) {
        document.getElementById("validationCustom02").value = producto;
    }
});

// EXTRACCIÓN MATERIAL STOCK INICIAL
$(document).ready(function () {
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const ot = urlParams.get("ot");
    const producto = urlParams.get("producto");

    if (ot && producto) {
        // Autocompletar los campos del formulario
        $("#validationCustom01").val(ot);
        $("#validationCustom02").val(producto);

        // Llamar a la API para obtener los materiales de la OT
        fetch(`http://localhost:63152/api/WorkOrderMaterial/GetWorkOrderMaterials?ot=${ot}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la API: ${response.status}`);
                }
                return response.json();
            })
            .then(materials => {
                const stockInicialContainer = $(".tab-content .col-md-4");
                stockInicialContainer.empty(); // Limpiar antes de agregar nuevos datos

                // Agregar tabla con estilos en línea
                const table = `
                    <table class="table table-bordered">
                        <thead class="table-dark">
                            <tr>
                                <th>Material</th>
                                <th>Cantidad</th>
                                <th>Proveedor</th>
                                <th>Lote</th>
                            </tr>
                        </thead>
                        <tbody id="stockInicialTableBody"></tbody>
                    </table>
                    <button type="button" id="stockInicialForm" class="btn btn-primary mt-3">Enviar Stock Inicial</button>
                `;

                stockInicialContainer.append(table);
                const tableBody = $("#stockInicialTableBody");

                // Recorrer materiales y agregarlos a la tabla
                materials.forEach((material, index) => {
                    const row = `
                    <tr>
                        <td><input type="text" class="form-control" id="material${index}" data-id="${material.ID}" value="${material.MATERIAL}" readonly></td>
                        <td><input type="number" class="form-control" id="cantidad${index}"></td>
                        <td><input type="text" class="form-control" id="proveedor${index}" data-id="${material.PROVEEDOR_ID}"></td>
                        <td><input type="text" class="form-control" id="lote${index}"></td>
                    </tr>
                `;

                    tableBody.append(row);
                });
            })
            .catch(error => console.error("Error al obtener materiales:", error));
    }

    // Evento click para enviar los datos a la API
    console.log("Turno seleccionado:", $("#validationCustom05").val());
    console.log("Responsable seleccionado:", $("#validationCustom06").val());

    $(document).on("click", "#stockInicialForm", function () {
        const fecha = $("#validationCustom04").val();
        const turno = parseInt($("#validationCustom05").val()) || null;
        const responsable = parseInt($("#validationCustom06").val()) || null;
        const ot = $("#validationCustom01").val();
        const materiales = $("#stockInicialTableBody tr");

        const dataToSend = [];

        materiales.each(function (index) {
            const materialID = $("#material" + index).attr("data-id") || null;
            const cantidad = $("#cantidad" + index).val();
            const proveedorID = $("#proveedor" + index).attr("data-id") || null;
            const lote = $("#lote" + index).val();
        
            console.log(`Fila ${index} - MaterialID: ${materialID}, Cantidad: ${cantidad}, ProveedorID: ${proveedorID}, Lote: ${lote}`);
        
            if (materialID && cantidad && proveedorID && lote) {
                dataToSend.push({
                    FECHAMOV: fecha,
                    TURNO: parseInt(turno) || null,
                    RESPONSABLE: parseInt(responsable) || null,
                    OT: ot,
                    MATERIAL: parseInt(materialID) || null,
                    CANTIDAD: parseFloat(cantidad),
                    PROVEEDOR: parseInt(proveedorID) || null,
                    LOTE: lote,
                    TIPOMOV: "STOCK INICIAL"
                });
            }
        });

        if (dataToSend.length > 0) {
            console.log("Datos a enviar:", JSON.stringify(dataToSend, null, 2));
            fetch("http://localhost:63152/api/ProductionStore/InsertProductionStore", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataToSend)
            })
                .then(response => response.json())
                .then(data => {
                    alert("Stock Inicial enviado correctamente");
                })
                .catch(error => {
                    console.error("Error al enviar datos:", error);
                    alert("Error al enviar el stock inicial");
                });
        } else {
            alert("Por favor, complete todos los campos antes de enviar.");
        }
    });


});


//EXTRACION MATERIAL STOCK FINAL
$(document).ready(function () {
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const ot = urlParams.get("ot");
    const producto = urlParams.get("producto");

    if (ot && producto) {
        // Autocompletar los campos del formulario
        $("#otField").val(ot);
        $("#productField").val(producto);

        // Llamar a la API para obtener los materiales de la OT
        fetch(`http://localhost:63152/api/WorkOrderMaterial/GetWorkOrderMaterials?ot=${ot}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la API: ${response.status}`);
                }
                return response.json();
            })
            .then(materials => {
                const tableBody = $("#materialsTableBody2");
                tableBody.empty(); // Limpiar la tabla antes de agregar nuevos datos

                materials.forEach(material => {
                    const row = `
            <tr>
                <td>${material.MATERIAL}</td>
            </tr>
        `;
                    tableBody.append(row);
                });
            })
            .catch(error => console.error("Error al obtener materiales:", error));
    }
});