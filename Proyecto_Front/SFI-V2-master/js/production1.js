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
                const stockFinalContainer = $(".tab-content .col-md-4");
                stockFinalContainer.empty(); // Limpiar antes de agregar nuevos datos

                // Agregar tabla con estilos en línea
                const table = `
                    <table class="table table-bordered">
                        <thead class="table-dark">
                            <tr class="material-row">
                                <th>Material</th>
                                <th>Cantidad</th>
                                <th>Proveedor</th>
                                <th>Lote</th>
                                <th>Seleccionar</th>
                            </tr>
                        </thead>
                        <tbody id="stockInicialTableBody"></tbody>
                    </table>
                    <button type="button" id="stockInicialForm" class="btn btn-primary mt-3">Enviar Stock Inicial</button>
                `;

                stockFinalContainer.append(table);
                const tableBody = $("#stockInicialTableBody");

                materials.forEach((material, index) => {
                    const row = `
                        <tr class="material-row">
                            <td><input type="text" class="form-control" id="material${index}" data-id="${material.ID}" value="${material.MATERIAL}" readonly></td>
                            <td><input type="number" class="form-control cantidad-input" id="cantidad${index}"></td>
                            <td><input type="text" class="form-control" id="proveedor${index}" data-id="${material.PROVEEDOR_ID}"></td>
                            <td><input type="text" class="form-control" id="lote${index}"></td>
                            <td style="text-align: center; vertical-align: middle;"><div class="form-check"><input class="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate${index}"></div></td>
                        </tr>
                    `;

                    tableBody.append(row);
                });
                //bloquea numero negativo
                document.querySelectorAll(".cantidad-input").forEach(input => {
                    input.addEventListener("input", function () {
                        if (this.value < 0) {
                            this.value = ""; // Borra el valor si es negativo
                        }
                    });
                });
                // Evento para verificar si se completaron los campos en Stock Final
                $(document).on("input", ".material-row input", function () {
                    const row = $(this).closest(".material-row");
                    const cantidad = row.find("input[id^='cantidad']").val().trim();
                    const proveedor = row.find("input[id^='proveedor']").val().trim();
                    const lote = row.find("input[id^='lote']").val().trim();
                    const checkbox = row.find("input[type='checkbox']");

                    // Si todos los campos tienen datos, marcar el checkbox
                    checkbox.prop("checked", cantidad !== "" && proveedor !== "" && lote !== "");
                });
            })
            .catch(error => console.error("Error al obtener materiales:", error));
    }

    // Evento click para enviar los datos a la API
    $(document).on("click", "#stockInicialForm", async function () {
        try {
            const fecha = $("#validationCustom04").val();
            const turnoNombre = $("#validationCustom05").val();
            const responsableNombre = $("#validationCustom06").val();
            const ot = $("#validationCustom01").val();

            if (!fecha || !turnoNombre || !responsableNombre) {
                alert("Por favor, complete todos los campos.");
                return;
            }

            // Filtrar filas seleccionadas con checkbox marcado
            let filasSeleccionadas = $(".material-row").filter(function () {
                return $(this).find("input[type='checkbox']").prop("checked");
            });

            console.log("Filas seleccionadas:", filasSeleccionadas.length);

            if (filasSeleccionadas.length === 0) {
                alert("Seleccione al menos un material para registrar.");
                return;
            }

            const dataToSend = [];

            for (let i = 0; i < filasSeleccionadas.length; i++) {
                let row = $(filasSeleccionadas[i]);

                const materialNombre = row.find("input[id^='material']").val();
                const proveedorNombre = row.find("input[id^='proveedor']").val();
                const cantidad = row.find("input[id^='cantidad']").val();
                const lote = row.find("input[id^='lote']").val();

                if (!materialNombre || !proveedorNombre || !cantidad || !lote) {
                    console.warn(`Fila ${i} tiene datos incompletos.`);
                    continue;
                }

                // Obtener los IDs desde la API
                let url = `http://localhost:63152/api/IDResponse/GetIDs?turno=${encodeURIComponent(turnoNombre)}&usuario=${encodeURIComponent(responsableNombre)}&material=${encodeURIComponent(materialNombre)}&proveedor=${encodeURIComponent(proveedorNombre)}`;
                console.log(`URL generada para fila ${i}:`, url);

                let response = await fetch(url);
                let ids = await response.json();
                console.log(`IDs obtenidos para fila ${i}:`, ids);

                let turnoID = ids.TurnoID || null;
                let usuarioID = ids.UsuarioID || null;
                let materialID = ids.MaterialID || null;
                let proveedorID = ids.ProveedorID || null;

                console.log(`Fila ${i} - MaterialID:`, materialID, "- ProveedorID:", proveedorID);

                if (!materialID || !proveedorID) {
                    console.warn(`Fila ${i} tiene IDs inválidos.`);
                    continue;
                }

                dataToSend.push({
                    FECHAMOV: fecha,
                    TURNO: turnoID,
                    RESPONSABLE: usuarioID,
                    OT: ot,
                    MATERIAL: materialID,
                    CANTIDAD: parseFloat(cantidad),
                    PROVEEDOR: proveedorID,
                    LOTE: lote,
                    TIPOMOV: "STOCK INICIAL"
                });
            }

            console.log("Datos listos para enviar:", JSON.stringify(dataToSend, null, 2));

            if (dataToSend.length === 0) {
                alert("No se encontraron materiales válidos para enviar.");
                return;
            }

            // Enviar cada movimiento por separado
            for (const movimiento of dataToSend) {
                let response2 = await fetch("http://localhost:63152/api/ProductionStore/InsertProductionStore", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(movimiento)
                });

                let responseText2 = await response2.text();
                console.log("Respuesta de la API InsertProductionStore:", responseText2);

                if (!response2.ok) throw new Error(`Error al enviar el stock final: ${response2.status} - ${responseText2}`);
            }

            // 🔹 Limpieza de inputs después del envío
            $(".material-row").each(function (index) {
                $("#cantidad" + index).val("");  // Borra la cantidad
                $("#proveedor" + index).val(""); // Borra el proveedor
                $("#lote" + index).val("");      // Borra el lote
                $("#flexCheckIndeterminate" + index).prop("checked", false);
            });

            // Opcional: Enfocar el primer campo de cantidad
            $("#cantidad0").focus();

            alert("✅ Stock Inicial enviado correctamente.");

        } catch (error) {
            console.error("Error:", error);
            alert("❌ Hubo un error en la operación. Revisa la consola para más detalles.");
        }
    });

});

// EXTRACCIÓN MATERIAL STOCK FINAL
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
                const stockFinalContainer = $(".tab-content .col-md-4");
                stockFinalContainer.empty(); // Limpiar antes de agregar nuevos datos

                // Agregar tabla con estilos en línea
                const table = `
                    <table class="table table-bordered">
                        <thead class="table-dark">
                            <tr class="material-row">
                                <th>Material</th>
                                <th>Cantidad</th>
                                <th>Proveedor</th>
                                <th>Lote</th>
                                <th>Seleccionar</th>
                            </tr>
                        </thead>
                        <tbody id="stockFinalTableBody"></tbody>
                    </table>
                    <button type="button" id="stockFinalForm" class="btn btn-primary mt-3">Enviar Stock Final</button>
                `;

                stockFinalContainer.append(table);
                const tableBody = $("#stockFinalTableBody");

                materials.forEach((material, index) => {
                    const row = `
                        <tr class="materialSF-row">
                            <td><input type="text" class="form-control" id="materialSF${index}" data-id="${material.ID}" value="${material.MATERIAL}" readonly></td>
                            <td><input type="number" class="form-control cantidad-input" id="cantidadSF${index}"></td>
                            <td><input type="text" class="form-control" id="proveedorSF${index}" data-id="${material.PROVEEDOR_ID}"></td>
                            <td><input type="text" class="form-control" id="loteSF${index}"></td>
                            <td style="text-align: center; vertical-align: middle;"><div class="form-check"><input class="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate${index}"></div></td>
                        </tr>
                    `;

                    tableBody.append(row);
                });
                //bloquea numero negativo
                document.querySelectorAll(".cantidad-input").forEach(input => {
                    input.addEventListener("input", function () {
                        if (this.value < 0) {
                            this.value = ""; // Borra el valor si es negativo
                        }
                    });
                });
                // Evento para verificar si se completaron los campos en Stock Final
                $(document).on("input", ".materialSF-row input", function () {
                    const row = $(this).closest(".materialSF-row");
                    const cantidad = row.find("input[id^='cantidadSF']").val().trim();
                    const proveedor = row.find("input[id^='proveedorSF']").val().trim();
                    const lote = row.find("input[id^='loteSF']").val().trim();
                    const checkbox = row.find("input[type='checkbox']");

                    // Si todos los campos tienen datos, marcar el checkbox
                    checkbox.prop("checked", cantidad !== "" && proveedor !== "" && lote !== "");
                });
            })
            .catch(error => console.error("Error al obtener materiales:", error));
    }

    // Evento click para enviar los datos a la API
    $(document).on("click", "#stockFinalForm", async function () {
        try {
            const fecha = $("#validationCustom04").val();
            const turnoNombre = $("#validationCustom05").val();
            const responsableNombre = $("#validationCustom06").val();
            const ot = $("#validationCustom01").val();

            if (!fecha || !turnoNombre || !responsableNombre) {
                alert("Por favor, complete todos los campos.");
                return;
            }

            // Filtrar filas seleccionadas con checkbox marcado
            let filasSeleccionadas = $(".materialSF-row").filter(function () {
                return $(this).find("input[type='checkbox']").prop("checked");
            });

            console.log("Filas seleccionadas:", filasSeleccionadas.length);

            if (filasSeleccionadas.length === 0) {
                alert("Seleccione al menos un material para registrar.");
                return;
            }

            const dataToSend = [];

            for (let i = 0; i < filasSeleccionadas.length; i++) {
                let row = $(filasSeleccionadas[i]);

                const materialSFNombre = row.find("input[id^='materialSF']").val();
                const proveedorSFNombre = row.find("input[id^='proveedorSF']").val();
                const cantidad = row.find("input[id^='cantidadSF']").val();
                const lote = row.find("input[id^='loteSF']").val();

                if (!materialSFNombre || !proveedorSFNombre || !cantidad || !lote) {
                    console.warn(`Fila ${i} tiene datos incompletos.`);
                    continue;
                }

                // Obtener los IDs desde la API
                let url = `http://localhost:63152/api/IDResponse/GetIDs?turno=${encodeURIComponent(turnoNombre)}&usuario=${encodeURIComponent(responsableNombre)}&material=${encodeURIComponent(materialSFNombre)}&proveedor=${encodeURIComponent(proveedorSFNombre)}`;
                console.log(`URL generada para fila ${i}:`, url);

                let response = await fetch(url);
                let ids = await response.json();
                console.log(`IDs obtenidos para fila ${i}:`, ids);

                let turnoID = ids.TurnoID || null;
                let usuarioID = ids.UsuarioID || null;
                let materialSFID = ids.MaterialID || null;
                let proveedorSFID = ids.ProveedorID || null;

                console.log(`Fila ${i} - MaterialID:`, materialSFID, "- ProveedorID:", proveedorSFID);

                if (!materialSFID || !proveedorSFID) {
                    console.warn(`Fila ${i} tiene IDs inválidos.`);
                    continue;
                }

                dataToSend.push({
                    FECHAMOV: fecha,
                    TURNO: turnoID,
                    RESPONSABLE: usuarioID,
                    OT: ot,
                    MATERIAL: materialSFID,
                    CANTIDAD: parseFloat(cantidad),
                    PROVEEDOR: proveedorSFID,
                    LOTE: lote,
                    TIPOMOV: "STOCK FINAL"
                });
            }

            console.log("Datos listos para enviar:", JSON.stringify(dataToSend, null, 2));

            if (dataToSend.length === 0) {
                alert("No se encontraron materiales válidos para enviar.");
                return;
            }

            // Enviar cada movimiento por separado
            for (const movimiento of dataToSend) {
                let response2 = await fetch("http://localhost:63152/api/ProductionStore/InsertProductionStore", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(movimiento)
                });

                let responseText2 = await response2.text();
                console.log("Respuesta de la API InsertProductionStore:", responseText2);

                if (!response2.ok) throw new Error(`Error al enviar el stock final: ${response2.status} - ${responseText2}`);
            }

            // 🔹 Limpieza de inputs después del envío
            $(".materialSF-row").each(function (index) {
                $("#cantidadSF" + index).val("");  // Borra la cantidad
                $("#proveedorSF" + index).val(""); // Borra el proveedor
                $("#loteSF" + index).val("");      // Borra el lote
                $("#flexCheckIndeterminate" + index).prop("checked", false);
            });

            // Opcional: Enfocar el primer campo de cantidad
            $("#cantidadSF0").focus();

            alert("✅ Stock Final enviado correctamente.");

        } catch (error) {
            console.error("Error:", error);
            alert("❌ Hubo un error en la operación. Revisa la consola para más detalles.");
        }
    });

});

// EXTRACCIÓN MATERIAL DEVOLUCION
$(document).ready(function () {
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const ot = urlParams.get("ot");
    const producto = urlParams.get("producto");

    if (ot && producto) {
        $("#validationCustom01").val(ot);
        $("#validationCustom02").val(producto);

        fetch(`http://localhost:63152/api/WorkOrderMaterial/GetWorkOrderMaterials?ot=${ot}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la API: ${response.status}`);
                }
                return response.json();
            })
            .then(materials => {
                const stockFinalContainer = $(".tab-content .col-md-4");
                stockFinalContainer.empty();

                const table = `
                    <table class="table table-bordered">
                        <thead class="table-dark">
                            <tr class="material-row">
                                <th>Material</th>
                                <th>Cantidad</th>
                                <th>Proveedor</th>
                                <th>Lote</th>
                                <th>Seleccionar</th>
                            </tr>
                        </thead>
                        <tbody id="devolucionTableBody"></tbody>
                    </table>
                    <button type="button" id="devolucionForm" class="btn btn-primary mt-3">Enviar Devolucion</button>
                `;

                stockFinalContainer.append(table);
                const tableBody = $("#devolucionTableBody");

                materials.forEach((material, index) => {
                    const row = `
                        <tr class="materialDE-row">
                            <td><input type="text" class="form-control" id="materialDE${index}" data-id="${material.ID}" value="${material.MATERIAL}" readonly></td>
                            <td><input type="number" class="form-control required-input cantidad-input" id="cantidadDE${index}"></td>
                            <td><input type="text" class="form-control required-input" id="proveedorDE${index}" data-id="${material.PROVEEDOR_ID}"></td>
                            <td><input type="text" class="form-control required-input" id="loteDE${index}"></td>
                            <td style="text-align: center; vertical-align: middle;"><div class="form-check"><input class="form-check-input material-checkbox" type="checkbox" value="" id="flexCheckIndeterminate${index}"></div></td>
                        </tr>
                    `;

                    tableBody.append(row);
                });
                //bloquea numero negativo
                document.querySelectorAll(".cantidad-input").forEach(input => {
                    input.addEventListener("input", function () {
                        if (this.value < 0) {
                            this.value = ""; // Borra el valor si es negativo
                        }
                    });
                });

                // Evento para verificar si se completaron los campos
                $(document).on("input", ".required-input", function () {
                    const row = $(this).closest(".materialDE-row");
                    const cantidad = row.find("input[id^='cantidadDE']").val().trim();
                    const proveedor = row.find("input[id^='proveedorDE']").val().trim();
                    const lote = row.find("input[id^='loteDE']").val().trim();
                    const checkbox = row.find(".material-checkbox");

                    // Si todos los campos tienen datos, marcar el checkbox
                    if (cantidad !== "" && proveedor !== "" && lote !== "") {
                        checkbox.prop("checked", true);
                    } else {
                        checkbox.prop("checked", false);
                    }
                });
            })
            .catch(error => console.error("Error al obtener materiales:", error));
    }

    // Evento click para enviar los datos a la API
    $(document).on("click", "#devolucionForm", async function () {
        try {
            const fecha = $("#validationCustom04").val();
            const turnoNombre = $("#validationCustom05").val();
            const responsableNombre = $("#validationCustom06").val();
            const ot = $("#validationCustom01").val();

            if (!fecha || !turnoNombre || !responsableNombre) {
                alert("Por favor, complete todos los campos.");
                return;
            }

            let filasSeleccionadas = $(".materialDE-row").filter(function () {
                return $(this).find("input[type='checkbox']").prop("checked");
            });

            if (filasSeleccionadas.length === 0) {
                alert("Seleccione al menos un material para devolver.");
                return;
            }

            const dataToSend = [];

            for (let i = 0; i < filasSeleccionadas.length; i++) {
                let row = $(filasSeleccionadas[i]);

                const materialDENombre = row.find("input[id^='materialDE']").val();
                const proveedorDENombre = row.find("input[id^='proveedorDE']").val();
                const cantidad = row.find("input[id^='cantidadDE']").val();
                const lote = row.find("input[id^='loteDE']").val();

                if (!materialDENombre || !proveedorDENombre || !cantidad || !lote) {
                    console.warn(`Fila ${i} tiene datos incompletos.`);
                    continue;
                }

                let url = `http://localhost:63152/api/IDResponse/GetIDs?turno=${encodeURIComponent(turnoNombre)}&usuario=${encodeURIComponent(responsableNombre)}&material=${encodeURIComponent(materialDENombre)}&proveedor=${encodeURIComponent(proveedorDENombre)}`;

                let response = await fetch(url);
                let ids = await response.json();

                let turnoID = ids.TurnoID || null;
                let usuarioID = ids.UsuarioID || null;
                let materialDEID = ids.MaterialID || null;
                let proveedorDEID = ids.ProveedorID || null;

                if (!materialDEID || !proveedorDEID) {
                    console.warn(`Fila ${i} tiene IDs inválidos.`);
                    continue;
                }

                dataToSend.push({
                    FECHAMOV: fecha,
                    TURNO: turnoID,
                    RESPONSABLE: usuarioID,
                    OT: ot,
                    MATERIAL: materialDEID,
                    CANTIDAD: parseFloat(cantidad),
                    PROVEEDOR: proveedorDEID,
                    LOTE: lote,
                    TIPOMOV: "DEVOLUCION"
                });
            }

            if (dataToSend.length === 0) {
                alert("No se encontraron materiales válidos para enviar.");
                return;
            }

            // Enviar cada movimiento por separado
            for (const movimiento of dataToSend) {
                let response2 = await fetch("http://localhost:63152/api/ProductionStore/InsertProductionStore", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(movimiento)
                });

                let responseText2 = await response2.text();

                if (!response2.ok) throw new Error(`Error al enviar la devolución: ${response2.status} - ${responseText2}`);
            }

            // 🔹 Limpieza de inputs después del envío
            $(".materialDE-row").each(function (index) {
                $("#cantidadDE" + index).val("");  // Borra la cantidad
                $("#proveedorDE" + index).val(""); // Borra el proveedor
                $("#loteDE" + index).val("");      // Borra el lote
                $(".material-checkbox").prop("checked", false);

            });

            // Opcional: Enfocar el primer campo de cantidad
            $("#cantidadDE0").focus();

            alert("✅ Devolución enviada correctamente.");

        } catch (error) {
            console.error("Error:", error);
            alert("❌ Hubo un error en la operación. Revisa la consola para más detalles.");
        }
    });
});

// EXTRACCIÓN MATERIAL SCRAP
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
                const scrapContainer = $(".tab-content .col-md-4");
                scrapContainer.empty(); // Limpiar antes de agregar nuevos datos

                // Agregar tabla con estilos en línea
                const table = `
                    <table class="table table-bordered">
                        <thead class="table-dark">
                            <tr class="material-row">
                                <th>Material</th>
                                <th>Cantidad</th>
                                <th>Proveedor</th>
                                <th>Lote</th>
                                <th>Seleccionar</th>
                            </tr>
                        </thead>
                        <tbody id="scrapTableBody"></tbody>
                    </table>
                    <button type="button" id="scrapForm" class="btn btn-primary mt-3">Enviar Scrap</button>
                `;

                scrapContainer.append(table);
                const tableBody = $("#scrapTableBody");

                materials.forEach((material, index) => {
                    const row = `
                        <tr class="materialSC-row">
                            <td><input type="text" class="form-control" id="materialSC${index}" data-id="${material.ID}" value="${material.MATERIAL}" readonly></td>
                            <td><input type="number" class="form-control cantidad-input" id="cantidadSC${index}"></td>
                            <td><input type="text" class="form-control" id="proveedorSC${index}" data-id="${material.PROVEEDOR_ID}"></td>
                            <td><input type="text" class="form-control" id="loteSC${index}"></td>
                            <td style="text-align: center; vertical-align: middle;"><div class="form-check"><input class="form-check-input" type="checkbox" value="" id="flexCheckIndeterminate${index}"></div></td>
                        </tr>
                    `;

                    tableBody.append(row);
                });
                //bloquea numero negativo
                document.querySelectorAll(".cantidad-input").forEach(input => {
                    input.addEventListener("input", function () {
                        if (this.value < 0) {
                            this.value = ""; // Borra el valor si es negativo
                        }
                    });
                });
                // Evento para verificar si se completaron los campos en Stock Final
                $(document).on("input", ".materialSC-row input", function () {
                    const row = $(this).closest(".materialSC-row");
                    const cantidad = row.find("input[id^='cantidadSC']").val().trim();
                    const proveedor = row.find("input[id^='proveedorSC']").val().trim();
                    const lote = row.find("input[id^='loteSC']").val().trim();
                    const checkbox = row.find("input[type='checkbox']");

                    // Si todos los campos tienen datos, marcar el checkbox
                    checkbox.prop("checked", cantidad !== "" && proveedor !== "" && lote !== "");
                });
            })
            .catch(error => console.error("Error al obtener materiales:", error));
    }

    // Evento click para enviar los datos a la API
    $(document).on("click", "#scrapForm", async function () {
        try {
            const fecha = $("#validationCustom04").val();
            const turnoNombre = $("#validationCustom05").val();
            const responsableNombre = $("#validationCustom06").val();
            const ot = $("#validationCustom01").val();

            if (!fecha || !turnoNombre || !responsableNombre) {
                alert("Por favor, complete todos los campos.");
                return;
            }

            // Filtrar filas seleccionadas con checkbox marcado
            let filasSeleccionadas = $(".materialSC-row").filter(function () {
                return $(this).find("input[type='checkbox']").prop("checked");
            });

            console.log("Filas seleccionadas:", filasSeleccionadas.length);

            if (filasSeleccionadas.length === 0) {
                alert("Seleccione al menos un material para registrar.");
                return;
            }

            const dataToSend = [];

            for (let i = 0; i < filasSeleccionadas.length; i++) {
                let row = $(filasSeleccionadas[i]);

                const materialSCNombre = row.find("input[id^='materialSC']").val();
                const proveedorSCNombre = row.find("input[id^='proveedorSC']").val();
                const cantidad = row.find("input[id^='cantidadSC']").val();
                const lote = row.find("input[id^='loteSC']").val();

                if (!materialSCNombre || !proveedorSCNombre || !cantidad || !lote) {
                    console.warn(`Fila ${i} tiene datos incompletos.`);
                    continue;
                }

                // Obtener los IDs desde la API
                let url = `http://localhost:63152/api/IDResponse/GetIDs?turno=${encodeURIComponent(turnoNombre)}&usuario=${encodeURIComponent(responsableNombre)}&material=${encodeURIComponent(materialSCNombre)}&proveedor=${encodeURIComponent(proveedorSCNombre)}`;
                console.log(`URL generada para fila ${i}:`, url);

                let response = await fetch(url);
                let ids = await response.json();
                console.log(`IDs obtenidos para fila ${i}:`, ids);

                let turnoID = ids.TurnoID || null;
                let usuarioID = ids.UsuarioID || null;
                let materialSCID = ids.MaterialID || null;
                let proveedorSCID = ids.ProveedorID || null;

                console.log(`Fila ${i} - MaterialID:`, materialSCID, "- ProveedorID:", proveedorSCID);

                if (!materialSCID || !proveedorSCID) {
                    console.warn(`Fila ${i} tiene IDs inválidos.`);
                    continue;
                }

                dataToSend.push({
                    FECHAMOV: fecha,
                    TURNO: turnoID,
                    RESPONSABLE: usuarioID,
                    OT: ot,
                    MATERIAL: materialSCID,
                    CANTIDAD: parseFloat(cantidad),
                    PROVEEDOR: proveedorSCID,
                    LOTE: lote,
                    TIPOMOV: "SCRAP"
                });
            }

            console.log("Datos listos para enviar:", JSON.stringify(dataToSend, null, 2));

            if (dataToSend.length === 0) {
                alert("No se encontraron materiales válidos para enviar.");
                return;
            }

            // Enviar cada movimiento por separado
            for (const movimiento of dataToSend) {
                let response2 = await fetch("http://localhost:63152/api/ProductionStore/InsertProductionStore", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(movimiento)
                });

                let responseText2 = await response2.text();
                console.log("Respuesta de la API InsertProductionStore:", responseText2);

                if (!response2.ok) throw new Error(`Error al enviar el stock final: ${response2.status} - ${responseText2}`);
            }

            // 🔹 Limpieza de inputs después del envío
            $(".materialSC-row").each(function (index) {
                $("#cantidadSC" + index).val("");  // Borra la cantidad
                $("#proveedorSC" + index).val(""); // Borra el proveedor
                $("#loteSC" + index).val("");      // Borra el lote
                $("#flexCheckIndeterminate" + index).prop("checked", false);
            });

            // Opcional: Enfocar el primer campo de cantidad
            $("#cantidadSC0").focus();

            alert("✅ Scrap enviado correctamente.");

        } catch (error) {
            console.error("Error:", error);
            alert("❌ Hubo un error en la operación. Revisa la consola para más detalles.");
        }
    });

});

// EXTRACION SOLICITUD
$(document).ready(function () {
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const ot = urlParams.get("ot");
    const producto = urlParams.get("producto");
    const usuario = "GONZALEZ CASTRO"; // Aquí puedes reemplazarlo por una variable dinámica si el usuario es variable

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
                const scrapContainer = $(".tab-content .col-md-4");
                scrapContainer.empty(); // Limpiar antes de agregar nuevos datos

                // Agregar tabla con estilos en línea
                const table = `
                    <table class="table table-bordered">
                        <thead class="table-dark">
                            <tr class="material-row">
                                <th>Material</th>
                                <th>Cantidad</th>
                                <th>Seleccionar</th>
                            </tr>
                        </thead>
                        <tbody id="solicitarTableBody"></tbody>
                    </table>
                    <button type="button" id="verSolicitudes" class="btn btn-primary mt-3">Enviar Solicitud</button>
                `;

                scrapContainer.append(table);
                const tableBody = $("#solicitarTableBody");

                materials.forEach((material, index) => {
                    const row = `
                        <tr class="materialSO-row">
                            <td><input type="text" class="form-control" id="materialSO${index}" data-id="${material.ID}" value="${material.MATERIAL}" readonly></td>
                            <td><input type="number" class="form-control cantidadSO cantidad-input" id="cantidadSO${index}" min="0"></td>
                            <td style="text-align: center; vertical-align: middle;">
                                <div class="form-check">
                                    <input class="form-check-input checkMaterial" type="checkbox" id="flexCheckIndeterminate${index}">
                                </div>
                            </td>
                        </tr>
                    `;

                    tableBody.append(row);
                });
                //bloquea numero negativo
                document.querySelectorAll(".cantidad-input").forEach(input => {
                    input.addEventListener("input", function () {
                        if (this.value < 0) {
                            this.value = ""; // Borra el valor si es negativo
                        }
                    });
                });

                // Evento para verificar si se completó el campo de cantidad
                $(document).on("input", ".cantidadSO", function () {
                    const row = $(this).closest(".materialSO-row");
                    const cantidad = $(this).val().trim();
                    const checkbox = row.find(".checkMaterial");

                    // Si la cantidad es mayor que 0, marcar el checkbox, si no, desmarcarlo
                    checkbox.prop("checked", cantidad > 0);
                });

                // Evento para el botón "Enviar Solicitud"
                $(document).on("click", "#verSolicitudes", function () {
                    const solicitud = {
                        FechaSolicitud: new Date().toISOString(),
                        Estado: "SOLICITADO",
                        Usuario: usuario,
                        DetalleMateriales: []
                    };

                    // Recorrer las filas y obtener los materiales seleccionados
                    $(".materialSO-row").each(function () {
                        const row = $(this);
                        const checkbox = row.find(".checkMaterial");
                        const cantidad = row.find(".cantidadSO").val().trim();
                        const material = row.find("input[id^='materialSO']").val();

                        if (checkbox.prop("checked") && cantidad > 0) {
                            solicitud.DetalleMateriales.push({
                                Material: material,
                                Cantidad: parseFloat(cantidad)
                            });
                        }
                    });

                    // Validar que haya al menos un material seleccionado
                    if (solicitud.DetalleMateriales.length === 0) {
                        alert("Debe seleccionar al menos un material con cantidad válida.");
                        return;
                    }

                    // Enviar los datos a la API
                    fetch("http://localhost:63152/api/SolicitudMaterialRepository/InsertSolicitud", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(solicitud)
                    })
                        .then(response => response.json())
                        .then(data => {
                            alert("Solicitud enviada con éxito.");
                            console.log("Respuesta API:", data);
                        })
                        .catch(error => {
                            console.error("Error al enviar la solicitud:", error);
                            alert("Hubo un error al enviar la solicitud.");
                        });
                });
            })
            .catch(error => console.error("Error al obtener materiales:", error));
    }
});

//MODAL VER SOLICITUD
$(document).ready(function () {
    let table = $('#myTable').DataTable({
        autoWidth: false,
        scrollX: true,  // Habilita desplazamiento horizontal
        responsive: true,
        order: [[0, "desc"]], // Ordena inicialmente por ID descendente
        ajax: {
            url: "http://localhost:63152/api/SolicitudMaterialRepository/GetAllSolicitudes",
            method: "GET",
            dataSrc: ""  // Porque la API devuelve un array directo
        },
        columnDefs: [
            {
                targets: 0,
                type: "num"  // Asegura que la columna `SolicitudID` se ordene como número
            },
            {
                targets: 1,
                render: function (data, type, row) {
                    let date = new Date(data);
                    return type === "display"
                        ? date.toLocaleString() // Muestra fecha formateada
                        : date.getTime(); // Devuelve timestamp para orden
                }
            }
        ],
        columns: [
            {
                data: "SolicitudID",
                orderable: true,
                render: function (data, type, row) {
                    let numericValue = parseInt(data, 10); // Convierte a número
                    return type === "display" ? `<button class='btn-expand'>▶</button> ${numericValue}` : numericValue;
                }
            },
            { data: "FechaSolicitud", orderable: true },
            { data: "Estado" }
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

    // Evento para cambiar el icono de flecha en expansión de fila
    $('#myTable tbody').on('click', '.btn-expand', function () {
        let btn = $(this);
        let row = table.row($(this).closest('tr'));

        if (row.child.isShown()) {
            row.child.hide();
            btn.html("▶"); // Flecha a la derecha cuando se cierra
        } else {
            row.child("<p>Detalles adicionales aquí...</p>").show();
            btn.html("▼"); // Flecha hacia abajo cuando se expande
            let solicitudID = row.data().SolicitudID;

            $.ajax({
                url: `http://localhost:63152/api/SolicitudMaterialRepository/GetSolicitud/${solicitudID}`,
                method: "GET",
                dataType: "json",
                success: function (data) {
                    let tableContent = `
        <table class="detalle-table">
            <thead>
                <tr>
                    <th>Material</th>
                    <th>Cantidad</th>
                </tr>
            </thead>
            <tbody>`;

                    data.DetalleMateriales.forEach(item => {
                        tableContent += `<tr>
            <td>${item.Material}</td>
            <td>${item.Cantidad}</td>
        </tr>`;
                    });

                    tableContent += `</tbody></table>`;

                    // Mostramos la fila expandida con el contenido
                    row.child(tableContent).show();
                    tr.addClass('shown');

                    // Cambiar el icono correctamente en todas las filas
                    $('.btn-expand').html('&#9654;'); // Reseteamos todas las filas a ▶
                    btn.html('&#9660;'); // ▼ Cambia solo el botón de la fila actual
                },
                error: function () {
                    alert("No se pudieron obtener los detalles.");
                }
            });
        }
    });

    // Evento click para abrir el modal y cargar los datos
    $('#verSolicitudes1').on('click', function () {
        console.log("El botón fue presionado.");

        // Mostrar el modal
        $("#modalSolicitudes").show();

        // Llamar a la API para obtener los datos
        $.ajax({
            url: "http://localhost:63152/api/SolicitudMaterialRepository/GetAllSolicitudes",
            method: "GET",
            dataType: "json",
            success: function (data) {
                console.log("✅ Datos recibidos:", data);
            },
            error: function (xhr, status, error) {
                console.error("❌ Error en la solicitud AJAX:", status, error);
            }
        });
    });

    // Cerrar modal al hacer clic en la "X"
    $(".close").on("click", function () {
        $("#modalSolicitudes").hide();
    });

    // Cerrar modal si el usuario hace clic fuera del contenido
    $(window).on("click", function (event) {
        if (event.target.id === "modalSolicitudes") {
            $("#modalSolicitudes").hide();
        }
    });
});

//ENVIAR PEDIDO
$(document).ready(function () {
    let table = $('#myTableR').DataTable({
        autoWidth: false,
        scrollX: true,  // Habilita desplazamiento horizontal
        responsive: true,
        order: [[0, "desc"]], // Ordena inicialmente por ID descendente
        ajax: {
            url: "http://localhost:63152/api/SolicitudMaterialRepository/GetAllSolicitudes",
            method: "GET",
            dataSrc: function (json) {
                // Filtramos solo las solicitudes con estado "SOLICITADO"
                return json.filter(solicitud => solicitud.Estado === "SOLICITADO");
            }

        },
        columnDefs: [
            {
                targets: 0,
                type: "num"  // Asegura que la columna `SolicitudID` se ordene como número
            },
            {
                targets: 1,
                render: function (data, type, row) {
                    let date = new Date(data);
                    return type === "display"
                        ? date.toLocaleString() // Muestra fecha formateada
                        : date.getTime(); // Devuelve timestamp para orden
                }
            }
        ],
        columns: [
            {
                data: "SolicitudID",
                orderable: true,
                render: function (data, type, row) {
                    let numericValue = parseInt(data, 10); // Convierte a número
                    return type === "display" ? `<button class='btn-expand'>▶</button> ${numericValue}` : numericValue;
                }
            },
            { data: "FechaSolicitud", orderable: true },
            { data: "Estado" }
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

    // Evento para cambiar el icono de flecha en expansión de fila
    $('#myTableR tbody').on('click', '.btn-expand', function () {
        let btn = $(this);
        let row = table.row($(this).closest('tr'));

        if (row.child.isShown()) {
            row.child.hide();
            btn.html("▶"); // Flecha a la derecha cuando se cierra
        } else {
            let solicitudID = row.data().SolicitudID;

            $.ajax({
                url: `http://localhost:63152/api/SolicitudMaterialRepository/GetSolicitud/${solicitudID}`,
                method: "GET",
                dataType: "json",
                success: function (data) {
                    console.log("Respuesta de la API:", data); // 🔴 Verifica la respuesta en la consola

                    let numeroOrdenSeguro = data.NumeroOrden ? data.NumeroOrden : "SIN-DATO";
                    console.log("Número de orden asignado:", numeroOrdenSeguro);

                    let tableContent = `
        <table class="detalle-table">
            <thead>
                <tr>
                    <th>Material</th>
                    <th>Cantidad</th>
                </tr>
            </thead>
            <tbody>`;

                    data.DetalleMateriales.forEach(item => {
                        tableContent += `
        <tr>
            <td>${item.Material}</td>
            <td>${item.Cantidad}</td>
        </tr>`;
                    });

                    tableContent += `</tbody></table>
    <button class="btn-agregar-todos" data-solicitud-id="${solicitudID}" data-orden="${solicitudID}">Recibido</button>`;

                    row.child(tableContent).show();
                    btn.html("▼"); // Flecha hacia abajo cuando se expande
                },
                error: function () {
                    alert("No se pudieron obtener los detalles.");
                }
            });
        }
    });

    //EXTRACCION DE DATOS DE LA SOLICITUD Y ACTUALIZACIÓN DEL NÚMERO DE ORDEN
    $(document).on("click", ".btn-agregar-todos", function () {
        let solicitudID = $(this).data("solicitud-id");
        let numeroOrden = $(this).data("orden");


        console.log("Solicitud ID:", solicitudID);
        console.log("Número de Orden capturado al hacer clic:", numeroOrden); // 🛑 Revisar en consola

        if (!numeroOrden) {
            alert("⚠️ Error: Número de orden no definido.");
        }

        // Actualizar el campo externo con el número de orden
        $("#numeroOrden").text(numeroOrden);

        $.ajax({
            url: `http://localhost:63152/api/SolicitudMaterialRepository/GetSolicitud/${solicitudID}`,
            method: "GET",
            dataType: "json",
            success: function (data) {
                data.DetalleMateriales.forEach(item => {
                    let material = item.Material;
                    let cantidad = item.Cantidad;

                    if ($("#recepcionarTableBody td:contains('" + material + "')").length === 0) {
                        let nuevaFila = `
            <tr>
                <td data-id="${item.MaterialID}">${item.Material}</td>
                <td>
                    <input type="number" class="form-control cantidad-input" value="${cantidad}" min="0">
                </td>
                <td data-id="${item.ProveedorID}">
                    <input type="text" class="form-control proveedor-input" value="${item.Proveedor ? item.Proveedor : ''}" placeholder="Ingrese proveedor">
                </td>
                <td>
                    <input type="text" class="form-control lote-input" placeholder="Ingrese lote">
                </td>
                <td style="text-align: center;">
                    <input type="checkbox" class="seleccionar-material">
                </td>
            </tr>`;

                        $("#recepcionarTableBody").append(nuevaFila);
                    }
                });
                //bloquea numero negativo
                document.querySelectorAll(".cantidad-input").forEach(input => {
                    input.addEventListener("input", function () {
                        if (this.value < 0) {
                            this.value = ""; // Borra el valor si es negativo
                        }
                    });
                });

                // 🔴 Cerrar el modal manualmente
                document.getElementById("modalSolicitudesR").style.display = "none";

                alert("✅ Todos los materiales han sido agregados correctamente.");
            },
            error: function () {
                alert("❌ No se pudieron obtener los detalles.");
            }
        });
    });



    // Evento para marcar automáticamente el checkbox cuando se llenen PROVEEDOR y LOTE
    $(document).on("input", ".proveedor-input, .lote-input", function () {
        let row = $(this).closest("tr"); // Encuentra la fila actual
        let proveedor = row.find(".proveedor-input").val().trim();
        let lote = row.find(".lote-input").val().trim();
        let checkbox = row.find(".seleccionar-material");

        console.log("🔍 Proveedor:", proveedor, " | Lote:", lote);

        // Si ambos campos tienen valor, marcar el checkbox; si no, desmarcarlo
        if (proveedor.length > 0 && lote.length > 0) {
            checkbox.prop("checked", true);
            console.log("✅ Checkbox marcado");
        } else {
            checkbox.prop("checked", false);
            console.log("❌ Checkbox desmarcado");
        }
    });

    // Evento para enviar los datos
    $("#recepcionarForm").on("click", function () {
        let fecha = $("#validationCustom04").val();
        let turno = $("#validationCustom05").val();
        let responsable = $("#validationCustom06").val();
        let ot = $("#validationCustom01").val();


        let registros = [];
        let peticiones = [];

        $("#recepcionarTableBody tr").each(function () {
            let row = $(this);
            let checkbox = row.find(".seleccionar-material").prop("checked");

            if (checkbox) {
                let material = row.find("td:eq(0)").text().trim();
                let cantidad = row.find(".cantidad-input").val().trim();
                let proveedor = row.find(".proveedor-input").val().trim();
                let lote = row.find(".lote-input").val().trim();

                let url = `http://localhost:63152/api/IDResponse/GetIDs?turno=${encodeURIComponent(turno)}&usuario=${encodeURIComponent(responsable)}&material=${encodeURIComponent(material)}&proveedor=${encodeURIComponent(proveedor)}`;

                console.log("🔍 Verificando URL API:", url);

                let peticion = $.getJSON(url).then(response => {
                    console.log("✅ Respuesta de la API:", response);

                    let obj = {
                        "FECHAMOV": new Date(fecha).toISOString(),
                        "TURNO": response.TurnoID,
                        "RESPONSABLE": response.UsuarioID,
                        "OT": ot,
                        "MATERIAL": response.MaterialID,
                        "CANTIDAD": cantidad,
                        "PROVEEDOR": response.ProveedorID,
                        "LOTE": lote,
                        "TIPOMOV": "PEDIDO",
                    };

                    registros.push(obj);
                    console.log("Objeto a enviar:", JSON.stringify(obj, ["FECHAMOV", "TURNO", "RESPONSABLE", "OT", "MATERIAL", "CANTIDAD", "PROVEEDOR", "LOTE", "TIPOMOV"], 2)); // Mostrar en consola cada objeto
                }).catch(error => {
                    console.error("❌ Error obteniendo los IDs:", error);
                });

                peticiones.push(peticion);
            }
        });
        console.log("📤 Enviando datos a la API:", JSON.stringify(registros, null, 2));

        // Después de guardar los datos, actualizar el estado de la solicitud
        let solicitudID = $("#numeroOrden").text().trim(); // Obtener la solicitud ID

        if (solicitudID) {
            let datosActualizacion = {
                "SolicitudID": parseInt(solicitudID),
                "Estado": "ENTREGADO"
            };

            $.ajax({
                url: "http://localhost:63152/api/SolicitudMaterialRepository/UpdateSolicitudEstado",
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify(datosActualizacion),
                success: function () {
                    console.log(`✅ Estado de la solicitud ${solicitudID} actualizado a ENTREGADO.`);
                    alert(`📦 La solicitud ${solicitudID} ha sido marcada como ENTREGADA.`);
                },
                error: function (xhr) {
                    console.error(`❌ Error al actualizar el estado de la solicitud ${solicitudID}:`, xhr.responseText);
                    alert(`⚠️ Hubo un problema al actualizar la solicitud.`);
                }
            });
        } else {
            console.warn("⚠️ No se encontró un ID de solicitud válido.");
        }


        // Esperar a que todas las peticiones se completen
        Promise.allSettled(peticiones).then(() => {
            console.log("📢 Todos los ID fueron procesados. Registros:", registros);

            console.log("📤 JSON enviado a la API:", JSON.stringify(registros, null, 2));

            if (registros.length > 0) {
                let total = registros.length;
                let exitos = 0;
                let errores = 0;
                let solicitudID = document.getElementById("numeroOrden").textContent.trim(); // Obtener ID de solicitud
                console.log(document.getElementById("numeroOrden").textContent);


                registros.forEach(obj => {
                    $.ajax({
                        url: "http://localhost:63152/api/ProductionStore/InsertProductionStore",
                        method: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(obj),
                        success: function () {
                            exitos++;
                            console.log("✅ Datos guardados correctamente:", obj);
                            // Buscar la fila correspondiente al material guardado
                            let fila = $(`td[data-id='${obj.MaterialID}']`).closest("tr");

                            // Limpiar los inputs dentro de la fila
                            fila.find(".cantidad-input").val(""); // Limpiar cantidad
                            fila.find(".proveedor-input").val(""); // Limpiar proveedor
                            fila.find(".lote-input").val(""); // Limpiar lote

                            // Volver a enfocar en cantidad
                            fila.find(".cantidad-input").focus();
                            verificarFinalizacion();
                        },
                        error: function (xhr) {
                            errores++;
                            console.error("❌ Error al guardar los datos:", xhr.responseText);
                            verificarFinalizacion();
                        }
                    });
                });

                function verificarFinalizacion() {
                    if (exitos + errores === total) {
                        limpiarFormulario(); // Llamar a la función de limpieza

                        if (exitos > 0) {
                            actualizarEstadoSolicitud(solicitudID);
                        } else {
                            alert(`⚠️ No se pudieron guardar los registros.`);
                        }
                    }
                }

                function actualizarEstadoSolicitud(solicitudID) {
                    let data = {
                        SolicitudID: parseInt(solicitudID),
                        Estado: "ENTREGADO"
                    };

                    $.ajax({
                        url: "http://localhost:63152/api/SolicitudMaterialRepository/UpdateSolicitudEstado",
                        method: "PUT",
                        contentType: "application/json",
                        data: JSON.stringify(data),
                        success: function () {
                            alert(`✅ ${exitos} registros guardados correctamente. Estado actualizado a ENTREGADO.`);
                        },
                        error: function (xhr) {
                            alert(`⚠️ ${exitos} registros guardados, pero no se pudo actualizar el estado: ${xhr.responseText}`);
                        }
                    });
                }
            } else {
                alert("❌ No hay materiales seleccionados.");
            }


            // Función para limpiar el formulario y vaciar la tabla
            function limpiarFormulario() {
                $("#validationCustom04").val(""); // Fecha
                $("#validationCustom05").val(""); // Turno
                $("#validationCustom06").val(""); // Responsable
                $("#validationCustom01").val(""); // OT

                $("#recepcionarTableBody").empty(); // Vacia la tabla

            }
        });
    });


    // Evento click para abrir el modal y cargar los datos
    $('#verSolicitudesR').on('click', function () {
        console.log("El botón fue presionado.");

        // Mostrar el modal
        $("#modalSolicitudesR").show();

        // Llamar a la API para obtener los datos
        $.ajax({
            url: "http://localhost:63152/api/SolicitudMaterialRepository/GetAllSolicitudes",
            method: "GET",
            dataType: "json",
            success: function (data) {
                console.log("✅ Datos recibidos:", data);
            },
            error: function (xhr, status, error) {
                console.error("❌ Error en la solicitud AJAX:", status, error);
            }
        });
    });

    // Cerrar modal al hacer clic en la "X"
    $(".close").on("click", function () {
        $("#modalSolicitudesR").hide();
    });

    // Cerrar modal si el usuario hace clic fuera del contenido
    $(window).on("click", function (event) {
        if (event.target.id === "modalSolicitudesR") {
            $("#modalSolicitudesR").hide();
        }
    });
});

//DECLARACION PRODUCCION
document.addEventListener("DOMContentLoaded", function () {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById("validationCustom04").value = today;

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

    // Evento click en el botón REALIZADO
    document.querySelector(".btn-primary").addEventListener("click", async function (event) {
        event.preventDefault(); // Evitar que el formulario se recargue

        // Capturar valores de los inputs
        let fecha = document.getElementById("validationCustom04").value;
        let turno = document.getElementById("validationCustom05").value;
        let responsable = document.getElementById("validationCustom06").value;
        let otValue = document.getElementById("validationCustom01").value;
        let productoValue = document.getElementById("validationCustom02").value;
        let producido = document.getElementById("validationCustom03").value;

        // Validar que los campos obligatorios no estén vacíos
        if (!fecha || !turno || !responsable || !otValue || !productoValue || !producido) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        try {
            // Obtener los IDs desde la API
            let response = await fetch(`http://localhost:63152/api/IDResponse/GetTRPIDs?turno=${encodeURIComponent(turno)}&usuario=${encodeURIComponent(responsable)}&producto=${encodeURIComponent(productoValue)}`);
            if (!response.ok) {
                throw new Error("Error al obtener los IDs: " + response.status);
            }
            let ids = await response.json();

            // Validar si se obtuvieron IDs válidos
            if (!ids.TurnoID || !ids.UsuarioID || !ids.ProductID) {
                throw new Error("No se encontraron IDs válidos para los valores ingresados.");
            }

            // Crear objeto con los datos finales
            let data = {
                FECHA: fecha,
                TURNO: ids.TurnoID,         // Reemplazado con el ID de turno
                RESPONSABLE: ids.UsuarioID, // Reemplazado con el ID del responsable
                OT: parseInt(otValue),
                PRODUCTO: ids.ProductID,    // Reemplazado con el ID del producto
                PRODUCIDO: parseInt(producido)
            };

            // Mostrar el objeto en la consola antes de enviarlo
            console.log("📦 Datos enviados a la API:", JSON.stringify(data, null, 2));

            // Enviar datos a la API de producción
            let saveResponse = await fetch("http://localhost:63152/api/Production/InsertProduction", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!saveResponse.ok) {
                throw new Error("Error en la solicitud: " + saveResponse.status);
            }

            let result = await saveResponse.json();
            alert("Producción registrada exitosamente.");
            

            // Limpiar el campo de PRODUCIDO
            document.getElementById("validationCustom01").value = "";
            document.getElementById("validationCustom02").value = "";
            document.getElementById("validationCustom03").value = "";

            document.getElementById("validationCustom03").focus();


        } catch (error) {
            console.error("❌ Error al guardar la producción:", error.message);
            alert("Error al guardar la producción. Verifique la consola.");
        }
    });
});
