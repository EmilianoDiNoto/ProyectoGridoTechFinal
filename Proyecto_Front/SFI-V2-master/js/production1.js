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

//NOTIFICACION
$(document).ready(function () {
    fetch("http://localhost:63152/api/WorkOrders/by-status/PENDIENTE")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) return; // No hay órdenes pendientes

            // Obtener la orden más antigua
            const oldestPendingOrder = data.reduce((oldest, current) =>
                new Date(current.FECHAELABORACION) < new Date(oldest.FECHAELABORACION) ? current : oldest
            );

            $(".ice-cream-item").each(function () {
                const productElement = $(this);
                const productName = productElement.data("product");
                const orderButton = productElement.find(".order-btn");

                if (productName === oldestPendingOrder.PRODUCTO) {
                    orderButton.text("⚠️").addClass("btn-warning").show();

                    // Evento de clic para mostrar detalles de la orden
                    orderButton.off("click").on("click", function () {
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
                                window.location.href = `production1.html?ot=${ot}&producto=${producto}`;
                            }
                        });
                    });
                } else {
                    // Si no tiene orden pendiente, ocultar el botón
                    orderButton.hide();
                }
            });
        })
        .catch(error => console.error("Error al obtener órdenes pendientes:", error));
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
        $("#validationCustom01").val(ot);
        $("#validationCustom02").val(producto);

        fetch(`http://localhost:63152/api/WorkOrderMaterial/GetWorkOrderMaterials?ot=${ot}`)
            .then(response => response.ok ? response.json() : Promise.reject(`Error: ${response.status}`))
            .then(materials => {
                const stockFinalContainer = $(".tab-content .col-md-4");
                stockFinalContainer.empty();

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

                stockFinalContainer.append(table);
                const tableBody = $("#stockInicialTableBody");

                materials.forEach((material, index) => {
                    const row = `
                        <tr class="material-row">
                            <td style="display: flex; align-items: center; gap: 8px;">
                                ${material.MATERIAL}
                                <span id="icono${index}" style="display: none; color: green; font-size: 20px;">
                                    <i class="fa-solid fa-check"></i>
                                </span>
                            </td>
                            <td>
                                <input type="number" class="form-control cantidad-input" id="cantidad${index}" 
                                    style="height: 24px; padding: 2px; text-align: center">
                            </td>
                            <td>
                                <select class="form-control proveedor-select" id="proveedor${index}" 
                                        style="height: 24px; padding: 2px; text-align: center">
                                    <option value=""></option>
                                </select>
                            </td>
                            <td>
                                <input type="text" class="form-control lote-input" id="lote${index}" 
                                    style="height: 24px; padding: 2px; text-align: center">
                            </td>
                        </tr>
                    `;
                    tableBody.append(row);

                    // Llamar a la API para obtener los proveedores del material actual
                    fetch(`http://localhost:63152/api/MaterialSupplier/by-material/${encodeURIComponent(material.MATERIAL)}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`Error: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(proveedores => {
                            const selectProveedor = $(`#proveedor${index}`);
                            selectProveedor.empty(); // Limpiar opciones previas

                            // Añadir la opción vacía solo al inicio
                            selectProveedor.append('<option value="" selected disabled hidden></option>');

                            if (Array.isArray(proveedores) && proveedores.length > 0) {
                                proveedores.forEach(proveedor => {
                                    selectProveedor.append(
                                        `<option value="${proveedor.PROVEEDOR}">${proveedor.PROVEEDOR}</option>`
                                    );
                                });
                            } else {
                                selectProveedor.append('<option value="" disabled>Sin proveedores disponibles</option>');
                            }
                        })
                        .catch(error => console.error(`❌ Error al obtener proveedores para ${material.MATERIAL}:`, error));
                });

                // Evitar números negativos en "cantidad"
                $(".cantidad-input").on("input", function () {
                    if ($(this).val() < 0) $(this).val("");
                });

                // Evento para verificar si los campos están completos
                $(document).on("input change", ".material-row input, .material-row select", function () {
                    const row = $(this).closest(".material-row");
                    const cantidad = row.find("input[id^='cantidad']").val().trim();
                    const proveedor = row.find("select[id^='proveedor']").val().trim();
                    const lote = row.find("input[id^='lote']").val().trim();
                    const icono = row.find("span[id^='icono']");

                    // Mostrar icono si los campos están completos
                    if (cantidad !== "" && proveedor !== "" && lote !== "") {
                        icono.css("display", "block");
                    } else {
                        icono.css("display", "none");
                    }
                });
            })
            .catch(error => console.error("Error al obtener materiales:", error)
            );
    }


    // Evento click para enviar los datos a la API
    $(document).on("click", "#stockInicialForm", async function () {
        try {
            const fecha = $("#validationCustom04").val();
            const turnoNombre = $("#validationCustom05").val();
            const responsableNombre = $("#validationCustom06").val();
            const ot = $("#validationCustom01").val();

            if (!fecha || !turnoNombre || !responsableNombre) {
                Swal.fire({
                    icon: "error",
                    title: "Por favor, complete todos los campos....",
                });
                return;
            }

            // Filtrar filas seleccionadas donde el ícono está visible
            let filasSeleccionadas = $(".material-row").filter(function () {
                return $(this).find("span[id^='icono']").is(":visible");
            });

            console.log("Filas seleccionadas:", filasSeleccionadas.length);

            if (filasSeleccionadas.length === 0) {
                Swal.fire({
                    icon: "error",
                    title: "Seleccione al menos un material para registrar...",
                });
                return;
            }

            const dataToSend = [];

            for (let i = 0; i < filasSeleccionadas.length; i++) {
                let row = $(filasSeleccionadas[i]);

                const materialNombre = row.find("td:first").text().trim(); // El nombre del material está en el primer <td>
                const proveedorNombre = row.find("select[id^='proveedor']").val().trim();
                const cantidad = row.find("input[id^='cantidad']").val().trim();
                const lote = row.find("input[id^='lote']").val().trim();

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
                Swal.fire({
                    icon: "error",
                    title: "No se encontraron materiales válidos para enviar....",
                });
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
                $("#icono" + index).css("display", "none");
            });

            // Opcional: Enfocar el primer campo de cantidad
            $("#cantidad0").focus();

            /* alert("✅ Stock Inicial enviado correctamente."); */
            Swal.fire({
                title: "✅ Stock Inicial enviado correctamente.",
            });

        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: "error",
                title: "❌ Hubo un error en la operación.",
                text: "Revisa los datos cargados!",
            });
        }
    });

});

// EXTRACCIÓN MATERIAL STOCK FINAL
$(document).ready(function () {
    if (ot && producto) {
        $("#validationCustom01").val(ot);
        $("#validationCustom02").val(producto);

        fetch(`http://localhost:63152/api/WorkOrderMaterial/GetWorkOrderMaterials?ot=${ot}`)
            .then(response => response.ok ? response.json() : Promise.reject(`Error: ${response.status}`))
            .then(materials => {
                const stockFinalContainer = $(".tab-content .col-md-4");
                stockFinalContainer.empty();

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
                        <tbody id="stockFinalTableBody"></tbody>
                    </table>
                    <button type="button" id="stockFinalForm" class="btn btn-primary mt-3">Enviar Stock Final</button>
                `;

                stockFinalContainer.append(table);
                const tableBody = $("#stockFinalTableBody");

                materials.forEach((material, index) => {
                    const row = `
                        <tr class="materialSF-row">
                            <td style="display: flex; align-items: center; gap: 8px;">
                            ${material.MATERIAL}
                                <span id="iconoSF${index}" style="display: none; color: green; font-size: 20px;">
                                    <i class="fa-solid fa-check"></i>
                                </span>
                            </td>
                            <td><input type="number" class="form-control cantidad-input" id="cantidadSF${index}" style="height: 24px; padding: 2px; text-align: center"></td>
                           <td>
                                <select class="form-control proveedor-select" id="proveedorSF${index}" 
                                        style="height: 24px; padding: 2px; text-align: center">
                                    <option value=""></option>
                                </select>
                            </td>
                            <td>
                                <input type="text" class="form-control lote-input" id="loteSF${index}" 
                                    style="height: 24px; padding: 2px; text-align: center">
                            </td>
                        </tr>
                    `;
                    tableBody.append(row);

                    // Llamar a la API para obtener los proveedores del material actual
                    fetch(`http://localhost:63152/api/MaterialSupplier/by-material/${encodeURIComponent(material.MATERIAL)}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`Error: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(proveedores => {
                            const selectProveedor = $(`#proveedorSF${index}`);
                            selectProveedor.empty(); // Limpiar opciones previas
                            selectProveedor.append('<option value="" selected disabled hidden></option>');

                            if (Array.isArray(proveedores) && proveedores.length > 0) {
                                proveedores.forEach(proveedor => {
                                    selectProveedor.append(`<option value="${proveedor.PROVEEDOR}">${proveedor.PROVEEDOR}</option>`);
                                });

                                // Forzar actualización del select
                                selectProveedor.trigger("change");

                            } else {
                                selectProveedor.append('<option value="">Sin proveedores disponibles</option>');
                            }
                        })
                        .catch(error => console.error(`❌ Error al obtener proveedores para ${material.MATERIAL}:`, error));
                });

                // Evitar números negativos en "cantidad"
                $(".cantidadSF-input").on("input", function () {
                    if ($(this).val() < 0) $(this).val("");
                });

                // Evento para verificar si los campos están completos
                $(document).on("input change", ".materialSF-row input, .materialSF-row select", function () {
                    const row = $(this).closest(".materialSF-row");
                    const cantidadSF = row.find("input[id^='cantidadSF']").val().trim();
                    const proveedorSF = row.find("select[id^='proveedorSF']").val().trim();
                    const loteSF = row.find("input[id^='loteSF']").val().trim();
                    const iconoSF = row.find("span[id^='iconoSF']");

                    // Mostrar icono si los campos están completos
                    if (cantidadSF !== "" && proveedorSF !== "" && loteSF !== "") {
                        iconoSF.css("display", "block");
                    } else {
                        iconoSF.css("display", "none");
                    }
                });
            })
            .catch(error => console.error("Error al obtener materiales:", error)
            );
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

            // Filtrar filas seleccionadas donde el ícono está visible
            let filasSeleccionadas = $(".materialSF-row").filter(function () {
                return $(this).find("span[id^='iconoSF']").is(":visible");
            });

            console.log("Filas seleccionadas:", filasSeleccionadas.length);

            if (filasSeleccionadas.length === 0) {
                alert("Seleccione al menos un material para registrar.");
                return;
            }

            const dataToSend = [];

            for (let i = 0; i < filasSeleccionadas.length; i++) {
                let row = $(filasSeleccionadas[i]);

                const materialSFNombre = row.find("td:first").text().trim(); // El nombre del material está en el primer <td>
                const proveedorSFNombre = row.find("select[id^='proveedorSF']").val().trim();
                const cantidadSF = row.find("input[id^='cantidadSF']").val().trim();
                const loteSF = row.find("input[id^='loteSF']").val().trim();

                if (!materialSFNombre || !proveedorSFNombre || !cantidadSF || !loteSF) {
                    console.warn(`Fila ${i} tiene datos incompletos.`);
                    continue;
                }
                //HASTA ACA
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
                    CANTIDAD: parseFloat(cantidadSF),
                    PROVEEDOR: proveedorSFID,
                    LOTE: loteSF,
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
                $("#iconoSF" + index).css("display", "none");
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
            .then(response => response.ok ? response.json() : Promise.reject(`Error: ${response.status}`))
            .then(materials => {
                const stockFinalContainer = $(".tab-content .col-md-4");
                stockFinalContainer.empty();

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
                        <tbody id="DevolucionTableBody"></tbody>
                    </table>
                    <button type="button" id="DevolucionForm" class="btn btn-primary mt-3">Enviar Devolucion</button>
                `;

                stockFinalContainer.append(table);
                const tableBody = $("#DevolucionTableBody");

                materials.forEach((material, index) => {
                    const row = `
                        <tr class="materialDE-row">
                            <td style="display: flex; align-items: center; gap: 8px;">
                            ${material.MATERIAL}
                                <span id="iconoDE${index}" style="display: none; color: green; font-size: 20px;">
                                    <i class="fa-solid fa-check"></i>
                                </span>
                            </td>
                            <td><input type="number" class="form-control cantidad-input" id="cantidadDE${index}" style="height: 24px; padding: 2px; text-align: center"></td>
                            <td>
                                <select class="form-control proveedor-select" id="proveedorDE${index}" 
                                        style="height: 24px; padding: 2px; text-align: center">
                                    <option value=""></option>
                                </select>
                            </td>
                            <td>
                                <input type="text" class="form-control lote-input" id="loteDE${index}" 
                                    style="height: 24px; padding: 2px; text-align: center">
                            </td>
                        </tr>
                    `;
                    tableBody.append(row);

                    // Llamar a la API para obtener los proveedores del material actual
                    fetch(`http://localhost:63152/api/MaterialSupplier/by-material/${encodeURIComponent(material.MATERIAL)}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`Error: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(proveedores => {
                            const selectProveedor = $(`#proveedorDE${index}`);
                            selectProveedor.empty(); // Limpiar opciones previas
                            selectProveedor.append('<option value="" selected disabled hidden></option>');

                            if (Array.isArray(proveedores) && proveedores.length > 0) {
                                proveedores.forEach(proveedor => {
                                    selectProveedor.append(`<option value="${proveedor.PROVEEDOR}">${proveedor.PROVEEDOR}</option>`);
                                });

                                // Forzar actualización del select
                                selectProveedor.trigger("change");

                            } else {
                                selectProveedor.append('<option value="">Sin proveedores disponibles</option>');
                            }
                        })
                        .catch(error => console.error(`❌ Error al obtener proveedores para ${material.MATERIAL}:`, error));
                });

                // Evitar números negativos en "cantidad"
                $(".cantidadDE-input").on("input", function () {
                    if ($(this).val() < 0) $(this).val("");
                });

                // Evento para verificar si los campos están completos
                $(document).on("input change", ".materialDE-row input, .materialDE-row select", function () {
                    const row = $(this).closest(".materialDE-row");
                    const cantidadDE = row.find("input[id^='cantidadDE']").val().trim();
                    const proveedorDE = row.find("select[id^='proveedorDE']").val().trim();
                    const loteDE = row.find("input[id^='loteDE']").val().trim();
                    const iconoDE = row.find("span[id^='iconoDE']");

                    // Mostrar icono si los campos están completos
                    if (cantidadDE !== "" && proveedorDE !== "" && loteDE !== "") {
                        iconoDE.css("display", "block");
                    } else {
                        iconoDE.css("display", "none");
                    }
                });
            })
            .catch(error => console.error("Error al obtener materiales:", error));
    }


    // Evento click para enviar los datos a la API
    $(document).on("click", "#DevolucionForm", async function () {
        try {
            const fecha = $("#validationCustom04").val();
            const turnoNombre = $("#validationCustom05").val();
            const responsableNombre = $("#validationCustom06").val();
            const ot = $("#validationCustom01").val();

            if (!fecha || !turnoNombre || !responsableNombre) {
                alert("Por favor, complete todos los campos.");
                return;
            }

            // Filtrar filas seleccionadas donde el ícono está visible
            let filasSeleccionadas = $(".materialDE-row").filter(function () {
                return $(this).find("span[id^='iconoDE']").is(":visible");
            });

            console.log("Filas seleccionadas:", filasSeleccionadas.length);

            if (filasSeleccionadas.length === 0) {
                alert("Seleccione al menos un material para registrar.");
                return;
            }

            const dataToSend = [];

            for (let i = 0; i < filasSeleccionadas.length; i++) {
                let row = $(filasSeleccionadas[i]);

                const materialDENombre = row.find("td:first").text().trim(); // El nombre del material está en el primer <td>
                const proveedorDENombre = row.find("select[id^='proveedorDE']").val().trim();
                const cantidadDE = row.find("input[id^='cantidadDE']").val().trim();
                const loteDE = row.find("input[id^='loteDE']").val().trim();

                if (!materialDENombre || !proveedorDENombre || !cantidadDE || !loteDE) {
                    console.warn(`Fila ${i} tiene datos incompletos.`);
                    continue;
                }

                //HASTA ACA
                // Obtener los IDs desde la API
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
                    CANTIDAD: parseFloat(cantidadDE),
                    PROVEEDOR: proveedorDEID,
                    LOTE: loteDE,
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
                $("#iconoDE" + index).css("display", "none");

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
        $("#validationCustom01").val(ot);
        $("#validationCustom02").val(producto);

        fetch(`http://localhost:63152/api/WorkOrderMaterial/GetWorkOrderMaterials?ot=${ot}`)
            .then(response => response.ok ? response.json() : Promise.reject(`Error: ${response.status}`))
            .then(materials => {
                const stockFinalContainer = $(".tab-content .col-md-4");
                stockFinalContainer.empty();

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
                        <tbody id="scrapTableBody"></tbody>
                    </table>
                    <button type="button" id="scrapForm" class="btn btn-primary mt-3">Enviar Scrap</button>
                `;

                stockFinalContainer.append(table);
                const tableBody = $("#scrapTableBody");

                materials.forEach((material, index) => {
                    const row = `
                        <tr class="materialSC-row">
                            <td style="display: flex; align-items: center; gap: 8px;">
                            ${material.MATERIAL}
                                <span id="iconoSC${index}" style="display: none; color: green; font-size: 20px;">
                                    <i class="fa-solid fa-check"></i>
                                </span>
                            </td>
                            <td><input type="number" class="form-control cantidad-input" id="cantidadSC${index}" style="height: 24px; padding: 2px; text-align: center"></td>
                            <td>
                                <select class="form-control proveedor-select" id="proveedorSC${index}" 
                                        style="height: 24px; padding: 2px; text-align: center">
                                    <option value=""></option>
                                </select>
                            </td>
                            <td>
                                <input type="text" class="form-control lote-input" id="loteSC${index}" 
                                    style="height: 24px; padding: 2px; text-align: center">
                            </td>
                        </tr>
                    `;
                    tableBody.append(row);

                    // Llamar a la API para obtener los proveedores del material actual
                    fetch(`http://localhost:63152/api/MaterialSupplier/by-material/${encodeURIComponent(material.MATERIAL)}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`Error: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(proveedores => {
                            const selectProveedor = $(`#proveedorSC${index}`);
                            selectProveedor.empty(); // Limpiar opciones previas
                            selectProveedor.append('<option value="" selected disabled hidden></option>');

                            if (Array.isArray(proveedores) && proveedores.length > 0) {
                                proveedores.forEach(proveedor => {
                                    selectProveedor.append(`<option value="${proveedor.PROVEEDOR}">${proveedor.PROVEEDOR}</option>`);
                                });

                                // Forzar actualización del select
                                selectProveedor.trigger("change");

                            } else {
                                selectProveedor.append('<option value="">Sin proveedores disponibles</option>');
                            }
                        })
                        .catch(error => console.error(`❌ Error al obtener proveedores para ${material.MATERIAL}:`, error));
                });

                // Evitar números negativos en "cantidad"
                $(".cantidadSC-input").on("input", function () {
                    if ($(this).val() < 0) $(this).val("");
                });

                // Evento para verificar si los campos están completos
                $(document).on("input change", ".materialSC-row input, .materialSC-row select", function () {
                    const row = $(this).closest(".materialSC-row");
                    const cantidadSC = row.find("input[id^='cantidadSC']").val().trim();
                    const proveedorSC = row.find("select[id^='proveedorSC']").val().trim();
                    const loteSC = row.find("input[id^='loteSC']").val().trim();
                    const iconoSC = row.find("span[id^='iconoSC']");

                    // Mostrar icono si los campos están completos
                    if (cantidadSC !== "" && proveedorSC !== "" && loteSC !== "") {
                        iconoSC.css("display", "block");
                    } else {
                        iconoSC.css("display", "none");
                    }
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

            // Filtrar filas seleccionadas donde el ícono está visible
            let filasSeleccionadas = $(".materialSC-row").filter(function () {
                return $(this).find("span[id^='iconoSC']").is(":visible");
            });

            console.log("Filas seleccionadas:", filasSeleccionadas.length);

            if (filasSeleccionadas.length === 0) {
                alert("Seleccione al menos un material para registrar.");
                return;
            }

            const dataToSend = [];

            for (let i = 0; i < filasSeleccionadas.length; i++) {
                let row = $(filasSeleccionadas[i]);

                const materialSCNombre = row.find("td:first").text().trim(); // El nombre del material está en el primer <td>
                const proveedorSCNombre = row.find("select[id^='proveedorSC']").val().trim();
                const cantidadSC = row.find("input[id^='cantidadSC']").val().trim();
                const loteSC = row.find("input[id^='loteSC']").val().trim();

                if (!materialSCNombre || !proveedorSCNombre || !cantidadSC || !loteSC) {
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
                    CANTIDAD: parseFloat(cantidadSC),
                    PROVEEDOR: proveedorSCID,
                    LOTE: loteSC,
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
                $("#iconoSC" + index).css("display", "none"); // 🔹 Oculta el ícono de check
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
                           <td style="display: flex; align-items: center; gap: 8px;">
                            ${material.MATERIAL}
                                <span id="iconoSO${index}" style="display: none; color: green; font-size: 20px;">
                                    <i class="fa-solid fa-check"></i>
                                </span>
                            </td>
                            <td><input type="number" class="form-control cantidadSO cantidad-input" id="cantidadSO${index}" style="height: 24px; padding: 2px; text-align: center" min="0"></td>
                           
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
                    const cantidadSO = row.find("input[id^='cantidadSO']").val().trim();
                    const iconoSO = row.find("span[id^='iconoSO']");

                    // Mostrar icono si los campos están completos
                    if (cantidadSO !== "") {
                        iconoSO.css("display", "block");
                    } else {
                        iconoSO.css("display", "none");
                    }

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
                        const cantidad = row.find(".cantidadSO").val().trim();
                        const icono = row.find("span[id^='iconoSO']");

                        // Verificar si el icono está visible y la cantidad es mayor a 0
                        if (icono.is(":visible") && cantidad > 0) {
                            const material = row.find("td:first").text().trim(); // Obtener el nombre del material
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

                            // Limpiar los campos de cantidad y ocultar iconos después del envío exitoso
                            $(".materialSO-row").each(function () {
                                $(this).find(".cantidadSO").val('');  // Limpiar cantidad
                                $(this).find("span[id^='iconoSO']").hide(); // Ocultar icono
                            });
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
    $('#verSolicitudes1').on('click', function () {
        // Recargar la tabla antes de mostrar el modal
        table.ajax.reload(null, false); // 'false' mantiene la página actual

        // Mostrar el modal después de recargar los datos
        setTimeout(() => {
            $("#modalSolicitudesR").show();
        }, 500); // Pequeño retraso para garantizar la actualización

    });
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
        console.log("El botón fue presionado. Recargando la tabla...");

        // Mostrar un indicador de carga (opcional)
        $("#loadingIndicator").show();

        // Recargar la tabla y esperar a que termine
        table.ajax.reload(function () {
            // Esta función se ejecuta cuando la recarga de datos se completa
            console.log("✅ Tabla recargada correctamente");

            // Ocultar indicador de carga (si existe)
            $("#loadingIndicator").hide();

            // Mostrar el modal
            $("#modalSolicitudes").show();
        }, false); // 'false' mantiene la página actual

        // No es necesario hacer otra llamada AJAX aquí, ya que DataTables ya la hizo
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
    $('#verSolicitudes1').on('click', function () {
        // Recargar la tabla antes de mostrar el modal
        table.ajax.reload(null, false); // 'false' mantiene la página actual

        // Mostrar el modal después de recargar los datos
        setTimeout(() => {
            $("#modalSolicitudesR").show();
        }, 500); // Pequeño retraso para garantizar la actualización

    });

    if ($.fn.DataTable.isDataTable('#myTableR')) {
        $('#myTableR').DataTable().destroy(); // Destruir instancia previa
    }

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
    // EXTRACCIÓN DE DATOS DE LA SOLICITUD Y ACTUALIZACIÓN DEL NÚMERO DE ORDEN
    $(document).on("click", ".btn-agregar-todos", function () {
        let solicitudID = $(this).data("solicitud-id");
        let numeroOrden = $(this).data("orden");

        console.log("Solicitud ID:", solicitudID);
        console.log("Número de Orden capturado al hacer clic:", numeroOrden);

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
                console.log('Datos de la solicitud:', data); // Verifica que los datos de la solicitud se reciban correctamente
                data.DetalleMateriales.forEach((item, index) => {
                    let material = item.Material;
                    let cantidad = item.Cantidad;

                    if ($("#recepcionarTableBody td:contains('" + material + "')").length === 0) {
                        let nuevaFila = `
                        <tr>
                            <td data-id="${item.MaterialID}">
                                ${item.Material}
                                <span id="iconoSC${index}" style="display: none; color: green; font-size: 20px;">
                                    <i class="fa-solid fa-check"></i>
                                </span>
                            </td>
                            <td>
                                <input type="number" class="form-control cantidad-input" value="${cantidad}" style="height: 24px; padding: 2px; text-align: center" min="0">
                            </td>
                            <td>
                                <select class="form-control proveedor-select" id="proveedorRE${index}" 
                                        style="height: 24px; padding: 2px; text-align: center">
                                    <option value=""></option>
                                </select>
                            </td>
                            <td>
                                <input type="text" class="form-control lote-input" style="height: 24px; padding: 2px; text-align: center">
                            </td>
                        </tr>`;

                        $("#recepcionarTableBody").append(nuevaFila);
                        console.log(`🆔 Select generado: #proveedor${index} para material ${item.Material}`);

                        // Llamar a la API para obtener los proveedores del material actual
                        fetch(`http://localhost:63152/api/MaterialSupplier/by-material/${encodeURIComponent(item.Material)}`)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`Error: ${response.status}`);
                                }
                                return response.json();
                            })
                            .then(proveedores => {
                                console.log('Proveedores obtenidos:', proveedores); // Verifica los datos de proveedores
                                const selectProveedor = $(`#proveedorRE${index}`);
                                selectProveedor.empty();
                                selectProveedor.append('<option value="" selected disabled hidden></option>');

                                if (Array.isArray(proveedores) && proveedores.length > 0) {
                                    proveedores.forEach(proveedor => {
                                        console.log('Proveedor:', proveedor); // Verifica la estructura del proveedor
                                        if (proveedor.PROVEEDOR) { // Asegúrate de que la propiedad existe
                                            selectProveedor.append(`<option value="${proveedor.PROVEEDOR}">${proveedor.PROVEEDOR}</option>`);
                                        } else {
                                            console.warn(`⚠️ La propiedad PROVEEDOR no existe en el objeto:`, proveedor);
                                        }
                                    });
                                    console.log(`✅ Proveedores agregados para ${item.Material}:`, proveedores);
                                } else {
                                    selectProveedor.append('<option value="">Sin proveedores disponibles</option>');
                                    console.warn(`⚠️ No hay proveedores disponibles para ${item.Material}`);
                                }
                            })
                            .catch(error => console.error(`❌ Error al obtener proveedores para ${item.Material}:`, error));
                    }
                });

                // Bloquear números negativos
                document.querySelectorAll(".cantidad-input").forEach(input => {
                    input.addEventListener("input", function () {
                        if (this.value < 0) {
                            this.value = "";
                        }
                    });
                });

                // 🔴 Cerrar el modal manualmente
                document.getElementById("modalSolicitudesR").style.display = "none";

                alert("✅ Todos los materiales han sido agregados correctamente.");
                table.ajax.reload(null, false); // Recargar la tabla

                setTimeout(() => {
                    $("#modalSolicitudes").show();
                }, 500);
            },
            error: function () {
                alert("❌ No se pudieron obtener los detalles.");
            }
        });
    });

    // Evento para mostrar el icono cuando PROVEEDOR y LOTE están completos
    $(document).on("input", ".proveedorRE-input, .proveedorRE-select, .lote-input", function () {
        let row = $(this).closest("tr");
        let proveedor = row.find(".proveedor-select").val().trim();
        let lote = row.find(".lote-input").val().trim();
        let icono = row.find("span[id^='iconoSC']");

        console.log("🔍 Proveedor:", proveedor, " | Lote:", lote);

        // Si ambos campos tienen valor, mostrar el icono; si no, ocultarlo
        if (proveedor.length > 0 && lote.length > 0) {
            icono.show();
            console.log("✅ Icono mostrado");
        } else {
            icono.hide();
            console.log("❌ Icono ocultado");
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
            let iconoVisible = row.find("td:eq(0)").find("span[id^='iconoSC']").is(":visible"); // Verifica si el icono está visible

            if (iconoVisible) {
                let material = row.find("td:eq(0)").text().trim();
                let cantidad = row.find(".cantidad-input").val().trim();
                let proveedor = row.find(".proveedor-select").val().trim();
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
                    console.log("Objeto a enviar:", JSON.stringify(obj, null, 2));
                }).catch(error => {
                    console.error("❌ Error obteniendo los IDs:", error);
                });

                peticiones.push(peticion);
            }
        });

        console.log("📤 Enviando datos a la API:", JSON.stringify(registros, null, 2));

        Promise.allSettled(peticiones).then(() => {
            console.log("📢 Todos los ID fueron procesados. Registros:", registros);

            if (registros.length > 0) {
                let total = registros.length;
                let exitos = 0;
                let errores = 0;
                let solicitudID = document.getElementById("numeroOrden").textContent.trim();

                registros.forEach(obj => {
                    $.ajax({
                        url: "http://localhost:63152/api/ProductionStore/InsertProductionStore",
                        method: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(obj),
                        success: function () {
                            exitos++;
                            console.log("✅ Datos guardados correctamente:", obj);

                            let fila = $(`td[data-id='${obj.MaterialID}']`).closest("tr");
                            fila.find(".cantidad-input").val("");
                            fila.find(".proveedor-select").val("");
                            fila.find(".lote-input").val("");
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
                        if (exitos > 0) {
                            actualizarEstadoSolicitud(solicitudID);
                        } else {
                            alert("⚠️ No se pudieron guardar los registros.");
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

                function verificarFinalizacion() {
                    if (exitos + errores === total) {
                        if (exitos > 0) {
                            actualizarEstadoSolicitud(solicitudID);

                            // Vaciar la tabla de recepción de materiales
                            $("#recepcionarTableBody").empty();

                            // Recargar la tabla de solicitudes
                            table.ajax.reload(null, false);

                            alert("✅ Datos guardados y tabla actualizada correctamente.");
                        } else {
                            alert("❌ No se pudo guardar ningún dato.");
                        }
                    }
                }

            } else {
                alert("❌ No hay materiales con el icono de verificación.");
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
            Swal.fire({
                title: "Producción registrada exitosamente.",
                text: "Que tengas una excelente jornada",
                icon: "success"
            }).then(() => {
                window.location.href = "home1.html"; // Redirige después de presionar "OK"
            });

            // Limpiar el campo de PRODUCIDO
            document.getElementById("validationCustom01").value = "";
            document.getElementById("validationCustom02").value = "";
            document.getElementById("validationCustom03").value = "";
            document.getElementById("validationCustom03").focus();

            localStorage.removeItem('datosFormularioOT');


        } catch (error) {
            console.error("❌ Error al guardar la producción:", error.message);
            alert("Error al guardar la producción. Verifique la consola.");
        }
    });
});

//INCIDENCIA
document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Script cargado correctamente");

    const icono = document.getElementById("iconoAbrirDetencion");
    const modal = document.getElementById("modalDetencionLinea");
    const cerrarModal = document.querySelector(".close-detencion");

    // Obtener los campos del modal
    const inputOT = document.getElementById("modalOTDetencion");
    const inputFecha = document.getElementById("modalFechaDetencion");
    const inputHora = document.getElementById("modalHoraDetencion");

    icono.addEventListener("click", function (event) {
        event.stopPropagation(); // Evita que otros eventos lo activen

        if (modal.style.display === "flex") {
            console.warn("⚠️ El modal ya está abierto, no se volverá a abrir.");
            return;
        }

        console.log("✅ Se abrirá el modal desde el icono.");

        const otValue = document.getElementById("validationCustom01").value;

        // Obtener la fecha y hora actual
        const fechaActual = new Date();
        const fechaFormateada = fechaActual.toISOString().split("T")[0]; // Formato YYYY-MM-DD
        const horaFormateada = fechaActual.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        inputOT.value = otValue;
        inputFecha.value = fechaFormateada;
        inputHora.value = horaFormateada;

        modal.style.display = "flex";

        // Agregar la animación de parpadeo
        document.querySelector(".modal-content-detencion").classList.add("borde-parpadeante");
    });

    document.getElementById("validationCustom01").addEventListener("change", function () {
        console.log("🔄 Cambio en OT detectado, pero el modal NO se abrirá.");
    });

    // INSERT DE DETENCIÓN
    const botonReinicio = document.querySelector(".btn-guardar-detencion");

    if (!botonReinicio) {
        console.error("❌ No se encontró el botón REINICIO. Verifica el selector.");
        return;
    }

    botonReinicio.addEventListener("click", async function (event) {
        event.preventDefault(); // ⛔ Evita que el formulario se envíe automáticamente

        const otValue = inputOT?.value;
        const detalleValue = document.getElementById("modalDetalleDetencion")?.value;
        const tallerValue = document.getElementById("modalTallerDetencion")?.value;
        const fechaInicioValue = inputFecha?.value;
        const horaInicioValue = inputHora?.value;

        if (!otValue || !fechaInicioValue || !horaInicioValue || !detalleValue || !tallerValue) {
            console.error("❌ Datos incompletos, revisa los campos del formulario.");
            alert("Faltan datos por completar. Verifica la OT, fecha, hora y detalles.");
            return;
        }

        const fechaFin = new Date();
        const fechaFinFormateada = fechaFin.toISOString().split("T")[0]; // YYYY-MM-DD
        const horaFinFormateada = fechaFin.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        const datos = {
            OT: parseInt(otValue),
            FECHA: `${fechaInicioValue}T00:00:00.000Z`,
            HSINICIO: horaInicioValue,
            FECHAFIN: `${fechaFinFormateada}T00:00:00.000Z`,
            HSFIN: horaFinFormateada,
            DETALLE: detalleValue,
            TALLER: tallerValue
        };

        console.log("📤 Enviando datos a la API:", datos);

        try {
            const response = await fetch("http://localhost:63152/api/Unplanned/InsertUnplanned", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });

            console.log("📥 Respuesta recibida:", response);

            if (!response.ok) {
                throw new Error(`Error en la API: ${response.status} - ${response.statusText}`);
            }

            const resultado = await response.json();

            alert("Reinicio registrado exitosamente");

            // Limpiar los campos después del reinicio
            inputOT.value = "";
            inputFecha.value = "";
            inputHora.value = "";
            document.getElementById("modalDetalleDetencion").value = "";
            document.getElementById("modalTallerDetencion").value = "";

            // Cerrar el modal
            modal.style.display = "none";

        } catch (error) {
            console.error("❌ Error al insertar:", error);
            alert(`Error al registrar: ${error.message}`);
        }
    });

    cerrarModal.addEventListener("click", function () {
        modal.style.display = "none";

        document.querySelector(".modal-content-detencion").classList.remove("borde-parpadeante");
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
            document.querySelector(".modal-content-detencion").classList.remove("borde-parpadeante");
        }
    });
});

//Asignacion de Turno
function asignarTurno() {
    const inputTurno = document.getElementById("validationCustom05");
    const horaActual = new Date().getHours();

    let turno = "";
    if (horaActual >= 6 && horaActual < 14) {
        turno = "MAÑANA";
    } else if (horaActual >= 14 && horaActual < 22) {
        turno = "TARDE";
    } else {
        turno = "NOCHE";
    }

    inputTurno.value = turno;
}
// Llamar a la función cuando se carga la página
window.onload = asignarTurno;

//Barras de progreso con pasos numerados
async function cargarMovimientos(ordenTrabajoID) {
    try {
        const response = await fetch("http://localhost:63152/api/ProductionStore/GetAllProductionStore");
        if (!response.ok) throw new Error("Error al obtener los datos");

        const data = await response.json();

        // Filtrar los datos por la OT seleccionada
        const movimientosOT = data.filter(item => item.OT == ordenTrabajoID);

        // Definir los tipos de movimiento en orden secuencial
        const tiposOrdenados = ["STOCK INICIAL", "PEDIDO", "DEVOLUCION", "SCRAP", "STOCK FINAL"];

        // Identificar qué niveles tienen al menos un registro
        let nivelesAlcanzados = tiposOrdenados.map(tipo =>
            movimientosOT.some(item => item.TIPOMOV.toUpperCase() === tipo)
        );

        // Calcular el porcentaje de avance según los niveles alcanzados
        let totalNiveles = tiposOrdenados.length;
        let nivelesCompletados = nivelesAlcanzados.filter(v => v).length;
        let progreso = (nivelesCompletados / totalNiveles) * 100;

        // Ajustar la barra de progreso
        let progressBar = document.getElementById("progressBar");
        progressBar.style.width = `${progreso}%`;

        // Ajustar la posición de los botones en la barra de progreso
        let buttons = document.querySelectorAll(".progress-btn");

        buttons.forEach((btn, index) => {
            if (index < totalNiveles) {
                // Solo actualizamos los colores, no la posición
                if (nivelesAlcanzados[index]) {
                    btn.classList.remove("btn-secondary");
                    btn.classList.add("btn-primary");
                } else {
                    btn.classList.remove("btn-primary");
                    btn.classList.add("btn-secondary");
                }
            }
        });

        console.log(`✅ Progreso actualizado para OT ${ordenTrabajoID}: ${progreso.toFixed(2)}%`);

    } catch (error) {
        console.error("Error:", error);
    }
}

// Iniciar el monitoreo de la OT ingresada y actualizar la barra de progreso
document.addEventListener("DOMContentLoaded", function () {
    const otInput = document.getElementById("validationCustom01");

    function actualizarProgreso() {
        const currentValue = otInput.value.trim();
        if (currentValue !== "") {
            cargarMovimientos(currentValue);
        }
    }

    // Ejecutar la función inmediatamente al cargar la página
    actualizarProgreso();

    // Configurar actualización automática cada 5 segundos
    setInterval(actualizarProgreso, 5000);
});

function guardarEnLocalStorage() {
    const datosFormulario = {
        fecha: document.getElementById('validationCustom04').value,
        turno: document.getElementById('validationCustom05').value,
        responsable: document.getElementById('validationCustom06').value,
        orden: document.getElementById('validationCustom01').value,
        producto: document.getElementById('validationCustom02').value,
        cantidad: document.getElementById('validationCustom03').value,
        modalAbierto: document.getElementById('modalDetencionLinea').style.display === 'block',
    };
    localStorage.setItem('datosFormularioOT', JSON.stringify(datosFormulario));
}

function cargarDesdeLocalStorage() {
    const datosGuardados = JSON.parse(localStorage.getItem('datosFormularioOT'));
    if (datosGuardados) {
        document.getElementById('validationCustom04').value = datosGuardados.fecha || '';
        document.getElementById('validationCustom05').value = datosGuardados.turno || '';
        document.getElementById('validationCustom06').value = datosGuardados.responsable || '';
        document.getElementById('validationCustom01').value = datosGuardados.orden || '';
        document.getElementById('validationCustom02').value = datosGuardados.producto || '';
        document.getElementById('validationCustom03').value = datosGuardados.cantidad || '';
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const datosGuardados = JSON.parse(localStorage.getItem('datosFormularioOT'));

    if (datosGuardados) {
        document.getElementById('validationCustom04').value = datosGuardados.fecha || '';
        document.getElementById('validationCustom05').value = datosGuardados.turno || '';
        document.getElementById('validationCustom06').value = datosGuardados.responsable || '';
        document.getElementById('validationCustom01').value = datosGuardados.orden || '';
        document.getElementById('validationCustom02').value = datosGuardados.producto || '';
        document.getElementById('validationCustom03').value = datosGuardados.cantidad || '';

        // 👇 Asegurate de que el fetch se dispare después de setear todo
        const ot = datosGuardados.orden;
        const producto = datosGuardados.producto;

        if (ot && producto) {
            cargarMaterialesPorOT(ot);
        }
    }

    // Eventos para guardar automáticamente
    document.getElementById('validationCustom06').addEventListener('input', guardarEnLocalStorage);
    document.getElementById('validationCustom03').addEventListener('input', guardarEnLocalStorage);
    document.getElementById('validationCustom01').addEventListener('change', guardarEnLocalStorage);
    document.getElementById('validationCustom02').addEventListener('change', guardarEnLocalStorage);
});

