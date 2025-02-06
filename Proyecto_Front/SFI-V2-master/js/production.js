

// Definir showMaterials globalmente (fuera del DOMContentLoaded)
window.showMaterials = function (ot) {
    fetch(`http://localhost:63152/api/WorkOrderMaterial/GetWorkOrderMaterials?ot=${ot}`)
        .then((response) => {
            if (!response.ok) throw new Error("Error al obtener los materiales");
            return response.json();
        })
        .then((data) => {
            const tbody = document.querySelector('#materials-table tbody');
            tbody.innerHTML = '';

            data.forEach((material) => {
                const fechaEntrega = formatDate(material.FECHAENTREGA);
                const row = `
                <tr>
                    <td>${material.MATERIAL}</td>
                    <td>${material.NECESIDAD}</td>
                    <td>${material.UM}</td>
                    <td>${material.CODIGO}</td>
                    <td>${fechaEntrega}</td>
                </tr>`;
                tbody.innerHTML += row;
            });

            const materialsModal = document.getElementById("materials-modal");
            materialsModal.style.display = "block";

            // Event listener para cerrar el modal de materiales
            const closeBtn = materialsModal.querySelector(".close");
            if (closeBtn) {
                closeBtn.addEventListener("click", () => {
                    materialsModal.style.display = "none";
                });
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los materiales'
            });
        });
};



// Función formatDate global
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Función para cargar órdenes de trabajo filtradas
function loadFilteredWorkOrders(productFilter = null) {
    fetch('http://localhost:63152/api/WorkOrders')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const filteredData = data.filter(item => {
                const isPending = (item.ESTADO || '').toUpperCase().trim().includes('PEND') ||
                    (item.ESTADO || '').toUpperCase().trim() === 'P';

                if (productFilter) {
                    const isCorrectProduct = item.PRODUCTO &&
                        item.PRODUCTO.toUpperCase().includes(productFilter.toUpperCase());
                    return isPending && isCorrectProduct;
                }
                return isPending;
            });

            const tableBody = document.getElementById('workOrderTableBody');
            tableBody.innerHTML = '';

            filteredData.forEach(item => {
                const row = `
                <tr class="row-pending" onclick="showMaterials(${item.OT})" style="cursor: pointer">
                    <td>${item.OT || '-'}</td>
                    <td>${item.CODIGO || '-'}</td>
                    <td>${item.PRODUCTO || '-'}</td>
                    <td>${item.DEMANDA || '-'}</td>
                    <td>${item.UM || '-'}</td>
                    <td>${formatDate(item.FECHAELABORACION)}</td>
                    <td>${item.ESTADO || '-'}</td>
                </tr>
            `;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar las órdenes de trabajo'
            });
        });
}

// Función para mostrar los materiales de una OT
function showMaterials(ot) {
    fetch(`http://localhost:63152/api/WorkOrderMaterial/GetWorkOrderMaterials?ot=${ot}`)
        .then((response) => {
            if (!response.ok) throw new Error("Error al obtener los materiales");
            return response.json();
        })
        .then((data) => {
            const tbody = document.querySelector('#materials-table tbody');
            tbody.innerHTML = '';

            data.forEach((material) => {
                const fechaEntrega = formatDate(material.FECHAENTREGA);
                const row = `
                <tr>
                    <td>${material.MATERIAL}</td>
                    <td>${material.NECESIDAD}</td>
                    <td>${material.UM}</td>
                    <td>${material.CODIGO}</td>
                    <td>${fechaEntrega}</td>
                </tr>`;
                tbody.innerHTML += row;
            });

            const materialsModal = document.getElementById("materials-modal");
            materialsModal.style.display = "block";

            // Event listener para cerrar el modal de materiales
            const closeBtn = materialsModal.querySelector(".close");
            if (closeBtn) {
                closeBtn.addEventListener("click", () => {
                    materialsModal.style.display = "none";
                });
            }

            // Cerrar al hacer clic fuera del modal
            window.onclick = function (event) {
                if (event.target === materialsModal) {
                    materialsModal.style.display = "none";
                }
            };
        })
        .catch((error) => {
            console.error("Error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los materiales'
            });
        });
}



document.addEventListener('DOMContentLoaded', function () {

    // Función para reinicializar las pestañas cuando se abre el modal
    function reinitializeTabsOnModalOpen() {
        const modal = document.getElementById('workOrderModal');
        const modalContent = modal.querySelector('.modal-content');

        // Asegurarse de que la primera pestaña esté activa
        const firstTab = modalContent.querySelector('.modal-tab');
        const firstContent = modalContent.querySelector('.tab-content');

        if (firstTab && firstContent) {
            // Desactivar todas las pestañas y contenidos
            modalContent.querySelectorAll('.modal-tab').forEach(tab =>
                tab.classList.remove('active'));
            modalContent.querySelectorAll('.tab-content').forEach(content =>
                content.classList.remove('active'));

            // Activar la primera pestaña y contenido
            firstTab.classList.add('active');
            firstContent.classList.add('active');
        }
    }



    // Referencias a elementos del DOM
    const modal = document.getElementById('workOrderModal');
    const alertBox = document.querySelector('.production-alert');
    const closeBtn = document.querySelector('.modal-close');
    const modalTitle = document.getElementById('modalProductTitle');
    const btnMenu = document.getElementById('btn-menu');
    const navLateral = document.querySelector('.navLateral');

    loadProductionData();

    // Event listener para el alert box (Hoy toca grido cookie)
    if (alertBox) {
        alertBox.addEventListener('click', function () {
            modal.style.display = 'block';
            modalTitle.textContent = 'Órdenes de Trabajo Pendientes - Grido Cookie';

            // Crear la tabla dentro del modal
            const modalContent = document.querySelector('.modal-content');
            modalContent.innerHTML = `
                  <span class="modal-close">&times;</span>
                  <h2 class="modal-product-title text-center">Órdenes de Trabajo Pendientes - Grido Cookie</h2>
                  <div class="table-container">
            <table class="production-table">
                <thead>
                    <tr>
                        <th>OT</th>
                        <th>CÓDIGO</th>
                        <th>PRODUCTO</th>
                        <th>DEMANDA</th>
                        <th>UM</th>
                        <th>FECHA DE ELABORACIÓN</th>
                        <th>ESTADO</th>
                    </tr>
                </thead>
                <tbody id="workOrderTableBody">
                </tbody>
            </table>
                  </div>
        
                 <!-- Modal para la receta -->
                  <div id="materials-modal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h3>NECESIDAD DE MATERIALES</h3>
                <table id="materials-table" class="production-table">
                    <thead>
                        <tr>
                            <th>MATERIAL</th>
                            <th>NECESIDAD</th>
                            <th>UM</th>
                            <th>CODIGO</th>
                            <th>FECHA ENTREGA</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>`;

            // Cargar las órdenes de trabajo
            loadFilteredWorkOrders('COOKIE');

            // Agregar el event listener para cerrar el modal principal
            const newCloseBtn = modalContent.querySelector('.modal-close');
            if (newCloseBtn) {
                newCloseBtn.addEventListener('click', () => {
                    modal.style.display = 'none';
                });
            }
            // Función para inicializar los event listeners de las pestañas
            function initializeTabs() {
                const tabs = document.querySelectorAll('.modal-tab');
                const tabContents = document.querySelectorAll('.tab-content');

                tabs.forEach(tab => {
                    tab.addEventListener('click', function () {
                        // Remover active de todas las pestañas
                        tabs.forEach(t => t.classList.remove('active'));
                        // Remover active de todos los contenidos
                        tabContents.forEach(content => content.classList.remove('active'));

                        // Agregar active a la pestaña seleccionada
                        this.classList.add('active');

                        // Mostrar el contenido correspondiente
                        const targetId = this.getAttribute('data-tab');
                        const targetContent = document.getElementById(targetId);
                        if (targetContent) {
                            targetContent.classList.add('active');
                        }
                    });
                });
            }

            // Función para inicializar el cierre del modal
            function initializeModalClose() {
                const modal = document.getElementById('workOrderModal');
                const closeButtons = document.querySelectorAll('.modal-close');

                closeButtons.forEach(button => {
                    button.addEventListener('click', function () {
                        modal.style.display = 'none';
                    });
                });

                // Cerrar modal al hacer clic fuera
                window.addEventListener('click', function (event) {
                    if (event.target === modal) {
                        modal.style.display = 'none';
                    }
                });
            }



        });
    }





    // Event listeners
const btnVisual = document.getElementById('btn-menu');
const navLatVisual = document.querySelector('.navLateral');
const navLateralBg = document.querySelector('.navLateral-bg');

function toggleMenu(e) {
if (e) {
e.preventDefault();
e.stopPropagation();
}
navLateral.classList.toggle('active-menu');
document.body.style.overflow = navLateral.classList.contains('active-menu') ? 'hidden' : '';
}

// Event listeners
btnVisual.addEventListener('click', toggleMenu);

// Cerrar el menú cuando se hace clic en el fondo
document.querySelector('.navLateral-bg').addEventListener('click', toggleMenu);

// Cerrar el menú cuando se hace clic en el botón de cerrar
document.querySelector('.navLateral .btn-menu').addEventListener('click', toggleMenu);




    // Mapa de productos y sus nombres en la API
    const productMapping = {
        'Cookie and Cream': 'COOKIE',
        'Mousse': 'MOUSSE',
        'Torta Grido': 'TORTA GRIDO'
    };

    // Función para cargar los datos de producción
    function loadProductionData() {
        fetch('http://localhost:63152/api/Production/GetAllProduction')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const tableBody = document.getElementById('productionTableBody');
                tableBody.innerHTML = '';

                data.forEach(item => {
                    // Convertir el número con coma a número con punto y luego formatear
                    const performance = item.PERFORMANCE ?
                        item.PERFORMANCE >= 10000 ?
                            String(item.PERFORMANCE).slice(0, 3) + '.' + String(item.PERFORMANCE).slice(3, 5) + '%' :
                            String(item.PERFORMANCE).slice(0, 2) + '.' + String(item.PERFORMANCE).slice(2, 4) + '%' :
                        '-';

                    const row = `
            <tr>
                <td>${formatDate(item.FECHA)}</td>
                <td>${item.TURNO || '-'}</td>
                <td>${item.RESPONSABLE || '-'}</td>
                <td>${item.OT || '-'}</td>
                <td>${item.PRODUCTO || '-'}</td>
                <td>${item.PRODUCIDO || '-'}</td>
                <td>${performance}</td>
            </tr>
        `;
                    tableBody.innerHTML += row;
                });
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudieron cargar los datos de producción'
                });
            });
    }


    //algo sonso



    // Event listener para las imágenes de tortas (modal con formulario y pestañas)
    document.querySelectorAll('.ice-cream-item').forEach(item => {
        item.addEventListener('click', function () {
            const productName = this.querySelector('p').textContent;
            const apiProductName = productMapping[productName];

            document.querySelector('.modal-product-title').textContent = `Declarar producción de Torta - ${productName}`;
            modal.style.display = 'block';

            // Agregar después de modal.style.display = 'block';
            initializeTabSystem();
            reinitializeTabsOnModalOpen();

            // Restaurar el contenido original del modal para el formulario
            const modalContent = document.querySelector('.modal-content');

            document.querySelector('.modal-product-title').textContent = modalTitle.textContent;
            modal.style.display = 'block';
            modalContent.innerHTML = `
            <span class="modal-close">&times;</span>
            <h2 class="modal-product-title text-center">${modalTitle.textContent}</h2>
            <div class="tab-container">
             <div class="modal-tabs">
                <button class="modal-tab active" data-tab="stock-inicial">STOCK INICIAL</button>
                <button class="modal-tab" data-tab="pedidos">SOLICITUD DE PEDIDO</button>
                <button class="modal-tab" data-tab="stock-final">STOCK FINAL</button>
                <button class="modal-tab" data-tab="producto-terminado">PRODUCCION FINAL</button>
            </div>
            <div class="tab-panels">
                    <!-- Stock Inicial -->
                    <div id="stock-inicial" class="tab-content active">
                        <form id="stockInicialForm" class="p-4">
                            <div id="materialesContainer" class="grid grid-cols-2 gap-4">
                                <div class="mb-4 col-span-2">
                                    <label>Fecha Movimiento:</label>
                                    <input type="date" id="fechamov_inicial" name="fechamov" required>
                                </div>
                                <div class="mb-4">
                                    <label>Turno:</label>
                                    <select id="turnoid_inicial" name="turnoid" required>
                                        <option value="">Seleccione un turno</option>
                                        <option value="1">MAÑANA</option>
                                        <option value="2">TARDE</option>
                                        <option value="3">NOCHE</option>
                                    </select>
                                </div>
                                <div class="mb-4">
                                    <label>Usuario:</label>
                                    <select id="usuarioid_inicial" name="usuarioid" required>
                                        <option value="">Seleccione un usuario</option>
                                        <option value="1">EMMANUEL GONZALEZ CASTRO</option>
                                        <option value="2">EMILIANO DI NOTO</option>
                                        <option value="3">SOFIA ROURE</option>
                                    </select>
                                </div>
                                <div class="mb-4">
                                    <label>OT:</label>
                                    <select id="otid_inicial" name="otid" required>
                                        <option value="">Seleccione una OT</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                    </select>
                                </div>
                                <div class="mb-4">
                                    <label>Proveedor:</label>
                                    <select id="proveedorid_inicial" name="proveedorid" required>
                                        <option value="">Seleccione un proveedor</option>
                                        <option value="1">PARNOR</option>
                                        <option value="2">MONDELEZ</option>
                                        <option value="3">SABORISIMO</option>
                                        <option value="4">LIVIAN FERCO</option>
                                        <option value="5">FACHITAS</option>
                                        <option value="6">CHAMMAS</option>
                                        <option value="7">JAMER</option>
                                        <option value="8">BEMER</option>
                                        <option value="9">PETIT FOUR</option>
                                        <option value="10">SANTA LUCIA</option>
                                        <option value="11">LA BLANCA</option>
                                    </select>
                                </div>

                                  <div class="mb-4">
                                    <label>Lote:</label>
                                    <input type="text" id="lote_inicial" name="lote">
                                </div>

                                <!-- Material Entry Template -->
                                <div class="material-entry col-span-2 grid grid-cols-2 gap-4">
                                    <div class="mb-4">
                                        <label>Material:</label>
                                        <select class="materialid" name="materialid" required>
                                            <option value="">Seleccione un material</option>
                                            <option value="1">DULCE DE LECHE P/SEMBRAR</option>
                                            <option value="2">TAPA GALLETA SABOR VAINILLA 17 CM</option>
                                            <option value="3">SALSA DULCE SABOR CHOCOLATE</option>
                                            <option value="4">DULCE DE LECHE C/CACAO P/SEMBRAR</option>
                                            <option value="5">GALLETAS MILKA MOUSSE</option>
                                            <option value="6">GALLETA OREO PICADA</option>
                                            <option value="7">PREPARADO ALMIBAR STANDART</option>
                                            <option value="8">HELADO DE CREMA AMERICANA</option>
                                            <option value="9">HELADO DE CHOCOLATE</option>
                                            <option value="10">HELADO DE DULCE DE LECHE</option>
                                        </select>
                                    </div>
                                    <div class="mb-4">
                                        <label>Cantidad:</label>
                                        <input type="number" class="cantidad" name="cantidad" required min="1">
                                    </div>
                                </div>

                                <!-- Botón para agregar material -->
                                <div class="col-span-2 text-center mb-4">
                                    <button type="button" id="addMaterial"
                                        class="bg-green-500 text-white px-4 py-2 rounded">
                                        + Agregar Material
                                    </button>
                                </div>
                            </div>
                            <div class="text-center mt-4">
                                <button type="submit" class="submit-btn">Guardar</button>
                            </div>
                        </form>
                    </div>

                    <!-- Contenido para la pestaña "Solicitud de Pedido" -->
                    <div id="pedidos" class="tab-content">
                        <form id="solicitudPedidoForm" class="p-4">
                            <div id="materialesContainerPedido" class="grid grid-cols-2 gap-4">
                                <div class="mb-4">
                                    <label>Fecha Movimiento:</label>
                                    <input type="date" id="fechamov_pedido" name="fechamov" required>
                                </div>
                                <div class="mb-4">
                                    <label>Turno:</label>
                                    <select id="turnoid_pedido" name="turnoid" required>
                                        <option value="">Seleccione un turno</option>
                                        <option value="1">MAÑANA</option>
                                        <option value="2">TARDE</option>
                                        <option value="3">NOCHE</option>
                                    </select>
                                </div>
                                <div class="mb-4">
                                    <label>Usuario:</label>
                                    <select id="usuarioid_pedido" name="usuarioid" required>
                                        <option value="">Seleccione un usuario</option>
                                        <option value="1">EMMANUEL GONZALEZ CASTRO</option>
                                        <option value="2">EMILIANO DI NOTO</option>
                                        <option value="3">SOFIA ROURE</option>
                                    </select>
                                </div>
                                <div class="mb-4">
                                    <label>OT:</label>
                                    <select id="otid_pedido" name="otid" required>
                                        <option value="">Seleccione una OT</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                    </select>
                                </div>
                                <div class="mb-4">
                                    <label>Proveedor:</label>
                                    <select id="proveedorid_pedido" name="proveedorid" required>
                                        <option value="">Seleccione un proveedor</option>
                                        <option value="1">PARNOR</option>
                                        <option value="2">MONDELEZ</option>
                                        <option value="3">SABORISIMO</option>
                                        <option value="4">LIVIAN FERCO</option>
                                        <option value="5">FACHITAS</option>
                                        <option value="6">CHAMMAS</option>
                                        <option value="7">JAMER</option>
                                        <option value="8">BEMER</option>
                                        <option value="9">PETIT FOUR</option>
                                        <option value="10">SANTA LUCIA</option>
                                        <option value="11">LA BLANCA</option>
                                    </select>
                                </div>

                                   <div class="mb-4">
                                    <label>Lote:</label>
                                    <input type="text" id="lote_pedido" name="lote">
                                </div>

                                <!-- Material Entry Template -->
                                <div class="material-entry col-span-2 grid grid-cols-2 gap-4">
                                    <div class="mb-4">
                                        <label>Material:</label>
                                        <select class="materialid" name="materialid" required>
                                            <option value="">Seleccione un material</option>
                                            <option value="1">DULCE DE LECHE P/SEMBRAR</option>
                                            <option value="2">TAPA GALLETA SABOR VAINILLA 17 CM</option>
                                            <option value="3">SALSA DULCE SABOR CHOCOLATE</option>
                                            <option value="4">DULCE DE LECHE C/CACAO P/SEMBRAR</option>
                                            <option value="5">GALLETAS MILKA MOUSSE</option>
                                            <option value="6">GALLETA OREO PICADA</option>
                                            <option value="7">PREPARADO ALMIBAR STANDART</option>
                                            <option value="8">HELADO DE CREMA AMERICANA</option>
                                            <option value="9">HELADO DE CHOCOLATE</option>
                                            <option value="10">HELADO DE DULCE DE LECHE</option>
                                        </select>
                                    </div>
                                    <div class="mb-4">
                                        <label>Cantidad:</label>
                                        <input type="number" class="cantidad" name="cantidad" required min="1">
                                    </div>
                                </div>

                                <!-- Botón para agregar material -->
                                <div class="col-span-2 text-center mb-4">
                                    <button type="button" id="addMaterialPedido"
                                        class="bg-green-500 text-white px-4 py-2 rounded">
                                        + Agregar Material
                                    </button>
                                </div>

                             
                            </div>
                            <div class="text-center mt-4">
                                <button type="submit" class="submit-btn">Guardar</button>
                            </div>
                        </form>
                    </div>

                    <!-- Contenido para la pestaña "Stock Final" -->
                    <div id="stock-final" class="tab-content">
                        <form id="stockFinalForm" class="p-4">
                            <div id="materialesContainerFinal" class="grid grid-cols-2 gap-4">
                                <div class="mb-4">
                                    <label>Fecha Movimiento:</label>
                                    <input type="date" id="fechamov_final" name="fechamov" required>
                                </div>
                                <div class="mb-4">
                                    <label>Turno:</label>
                                    <select id="turnoid_final" name="turnoid" required>
                                        <option value="">Seleccione un turno</option>
                                        <option value="1">MAÑANA</option>
                                        <option value="2">TARDE</option>
                                        <option value="3">NOCHE</option>
                                    </select>
                                </div>
                                <div class="mb-4">
                                    <label>Usuario:</label>
                                    <select id="usuarioid_final" name="usuarioid" required>
                                        <option value="">Seleccione un usuario</option>
                                        <option value="1">EMMANUEL GONZALEZ CASTRO</option>
                                        <option value="2">EMILIANO DI NOTO</option>
                                        <option value="3">SOFIA ROURE</option>
                                    </select>
                                </div>
                                <div class="mb-4">
                                    <label>OT:</label>
                                    <select id="otid_final" name="otid" required>
                                        <option value="">Seleccione una OT</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                    </select>
                                </div>
                                <div class="mb-4">
                                    <label>Proveedor:</label>
                                    <select id="proveedorid_final" name="proveedorid" required>
                                        <option value="">Seleccione un proveedor</option>
                                        <option value="1">PARNOR</option>
                                        <option value="2">MONDELEZ</option>
                                        <option value="3">SABORISIMO</option>
                                        <option value="4">LIVIAN FERCO</option>
                                        <option value="5">FACHITAS</option>
                                        <option value="6">CHAMMAS</option>
                                        <option value="7">JAMER</option>
                                        <option value="8">BEMER</option>
                                        <option value="9">PETIT FOUR</option>
                                        <option value="10">SANTA LUCIA</option>
                                        <option value="11">LA BLANCA</option>
                                    </select>
                                </div>

                                 <div class="mb-4">
                                    <label>Lote:</label>
                                    <input type="text" id="lote_final" name="lote">
                                </div>

                                <!-- Material Entry Template -->
                                <div class="material-entry col-span-2 grid grid-cols-2 gap-4">
                                    <div class="mb-4">
                                        <label>Material:</label>
                                        <select class="materialid" name="materialid" required>
                                            <option value="">Seleccione un material</option>
                                            <option value="1">DULCE DE LECHE P/SEMBRAR</option>
                                            <option value="2">TAPA GALLETA SABOR VAINILLA 17 CM</option>
                                            <option value="3">SALSA DULCE SABOR CHOCOLATE</option>
                                            <option value="4">DULCE DE LECHE C/CACAO P/SEMBRAR</option>
                                            <option value="5">GALLETAS MILKA MOUSSE</option>
                                            <option value="6">GALLETA OREO PICADA</option>
                                            <option value="7">PREPARADO ALMIBAR STANDART</option>
                                            <option value="8">HELADO DE CREMA AMERICANA</option>
                                            <option value="9">HELADO DE CHOCOLATE</option>
                                            <option value="10">HELADO DE DULCE DE LECHE</option>
                                        </select>
                                    </div>
                                    <div class="mb-4">
                                        <label>Cantidad:</label>
                                        <input type="number" class="cantidad" name="cantidad" required min="1">
                                    </div>
                                </div>

                                <!-- Botón para agregar material -->
                                <div class="col-span-2 text-center mb-4">
                                    <button type="button" id="addMaterialFinal"
                                        class="bg-green-500 text-white px-4 py-2 rounded">
                                        + Agregar Material
                                    </button>
                                </div>
                            </div>
                            <div class="text-center mt-4">
                                <button type="submit" class="submit-btn">Guardar</button>
                            </div>
                        </form>
                    </div>

                    <!-- Contenido para la pestaña "Producción Final" -->
                    <div id="producto-terminado" class="tab-content">
                        <form id="produccionFinalForm" class="p-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div class="mb-4">
                                    <label>Fecha:</label>
                                    <input type="date" id="fecha_produccion" name="fecha" required>
                                </div>
                                <div class="mb-4">
                                    <label>Turno:</label>
                                    <select id="turnoid_produccion" name="turnoid" required>
                                        <option value="">Seleccione un turno</option>
                                        <option value="1">MAÑANA</option>
                                        <option value="2">TARDE</option>
                                        <option value="3">NOCHE</option>
                                    </select>
                                </div>
                                <div class="mb-4">
                                    <label>Responsable:</label>
                                    <select id="usuarioid_produccion" name="usuarioid" required>
                                        <option value="">Seleccione un usuario</option>
                                        <option value="1">EMMANUEL GONZALEZ CASTRO</option>
                                        <option value="2">EMILIANO DI NOTO</option>
                                        <option value="3">SOFIA ROURE</option>
                                    </select>
                                </div>
                                <div class="mb-4">
                                    <label>Orden de Trabajo:</label>
                                    <select id="otid_produccion" name="otid" required>
                                        <option value="">Seleccione una OT</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                    </select>
                                </div>
                                <div class="mb-4">
                                    <label>Producido:</label>
                                    <input type="number" id="producido" name="producido" required min="1">
                                </div>
                            </div>
                            <div class="text-center mt-4">
                                <button type="submit" class="submit-btn">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>`;


            // AÑADIR AQUÍ - justo después del innerHTML y antes del código del addMaterialBtn
            setTimeout(() => {
                const tabs = document.querySelectorAll('.modal-tab');
                tabs.forEach(tab => {
                    tab.addEventListener('click', function () {
                        const tabId = this.getAttribute('data-tab');

                        // Desactivar todas las pestañas y contenidos
                        document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
                        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

                        // Activar la pestaña actual y su contenido
                        this.classList.add('active');
                        const content = document.getElementById(tabId);
                        if (content) {
                            content.classList.add('active');
                        }
                    });
                });

                // Activar la primera pestaña por defecto
                const firstTab = document.querySelector('.modal-tab');
                const firstContent = document.querySelector('.tab-content');
                if (firstTab && firstContent) {
                    firstTab.classList.add('active');
                    firstContent.classList.add('active');
                }
            }, 100);

            // AÑADIR ESTE CÓDIGO AQUÍ
            const newCloseBtn = modalContent.querySelector('.modal-close');
            if (newCloseBtn) {
                newCloseBtn.addEventListener('click', () => {
                    modal.style.display = 'none';
                });
            }




            // Y luego, después del innerHTML, agrega este código para manejar el formulario:

            // Para el botón de agregar material en Stock Inicial
            const addMaterialBtn = document.getElementById('addMaterial');
            if (addMaterialBtn) {
                addMaterialBtn.addEventListener('click', function () {
                    const materialsContainer = document.getElementById('materialesContainer');

                    // Crear el nuevo material
                    const newMaterial = document.createElement('div');
                    newMaterial.className = 'material-entry col-span-2 grid grid-cols-2 gap-4';
                    newMaterial.innerHTML = `<div class="mb-4">
                    <label>Proveedor:</label>
                    <select id="proveedorid" name="proveedorid" required>
                        <option value="">Seleccione un proveedor</option>
                        <option value="1">PARNOR</option>
                        <option value="2">MONDELEZ</option>
                        <option value="3">SABORISIMO</option>
                        <option value="4">LIVIAN FERCO</option>
                        <option value="5">FACHITAS</option>
                        <option value="6">CHAMMAS</option>
                        <option value="7">JAMER</option>
                        <option value="8">BEMER</option>
                        <option value="9">PETIT FOUR</option>
                        <option value="10">SANTA LUCIA</option>
                        <option value="11">LA BLANCA</option>
                    </select>
                </div>
    <div class="mb-4">
        <label>Material:</label>
        <select class="materialid" name="materialid" required>
            <option value="">Seleccione un material</option>
            <option value="1">DULCE DE LECHE P/SEMBRAR</option>
            <option value="2">TAPA GALLETA SABOR VAINILLA 17 CM</option>
            <option value="3">SALSA DULCE SABOR CHOCOLATE</option>
            <option value="4">DULCE DE LECHE C/CACAO P/SEMBRAR</option>
            <option value="5">GALLETAS MILKA MOUSSE</option>
            <option value="6">GALLETA OREO PICADA</option>
            <option value="7">PREPARADO ALMIBAR STANDART</option>
            <option value="8">HELADO DE CREMA AMERICANA</option>
            <option value="9">HELADO DE CHOCOLATE</option>
            <option value="10">HELADO DE DULCE DE LECHE</option>
        </select>
    </div>
    <div class="mb-4">
        <label>Cantidad:</label>
        <input type="number" class="cantidad" name="cantidad" required min="1">
    </div>
    <button type="button" onclick="this.parentElement.remove()" class="remove-material absolute right-0 top-0 text-red-500">
        Eliminar
    </button>`;

                    // Encontrar el botón "Agregar Material" y su contenedor
                    const addButtonContainer = document.querySelector('#addMaterial').parentElement;

                    // Insertar el nuevo material antes del contenedor del botón
                    addButtonContainer.before(newMaterial);

                    // Agregar event listener para el botón eliminar
                    const deleteButton = newMaterial.querySelector('.remove-material');
                    deleteButton.addEventListener('click', function () {
                        newMaterial.remove();
                    });
                });
            }

            // Para el formulario de Stock Inicial
            const formInicial = document.getElementById('stockInicialForm');
            if (formInicial) {
                formInicial.addEventListener('submit', function (e) {
                    e.preventDefault();

                    const materialEntries = formInicial.querySelectorAll('.material-entry');
                    const baseDatos = {
                        FECHAMOV: document.getElementById('fechamov_inicial').value,
                        TURNO: parseInt(document.getElementById('turnoid_inicial').value),
                        RESPONSABLE: parseInt(document.getElementById('usuarioid_inicial').value),
                        OT: parseInt(document.getElementById('otid_inicial').value),
                        LOTE: document.getElementById('lote_inicial').value,
                        TIPOMOV: 'STOCK INICIAL'
                    };

                    try {
                        const promesas = Array.from(materialEntries).map((entry) => {
                            const proveedorId = parseInt(document.getElementById('proveedorid_inicial').value);
                            const materialSelect = entry.querySelector('.materialid');
                            const cantidadInput = entry.querySelector('.cantidad');

                            if (!materialSelect || !cantidadInput) {
                                throw new Error('Faltan campos en alguna entrada de material');
                            }

                            const formData = {
                                ...baseDatos,
                                PROVEEDOR: proveedorId,
                                MATERIAL: parseInt(materialSelect.value),
                                CANTIDAD: parseInt(cantidadInput.value)
                            };

                            // Validar que todos los campos tengan valor
                            if (!formData.PROVEEDOR || !formData.MATERIAL || !formData.CANTIDAD) {
                                throw new Error('Todos los campos son requeridos para cada material');
                            }

                            return fetch('http://localhost:63152/api/ProductionStore/InsertProductionStore', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(formData)
                            });
                        });

                        Promise.all(promesas)
                            .then(responses => {
                                const todosOk = responses.every(response => response.ok);
                                if (!todosOk) throw new Error('Uno o más registros fallaron');
                                return Promise.all(responses.map(r => r.text()));
                            })
                            .then(data => {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Éxito',
                                    text: 'Todos los materiales fueron guardados correctamente'
                                });
                                formInicial.reset();
                                document.getElementById('lote_inicial').value = 'AB0909';

                                const container = document.getElementById('materialesContainer');
                                const entries = container.querySelectorAll('.material-entry');
                                entries.forEach((entry, index) => {
                                    if (index > 0) entry.remove();
                                });
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: error.message || 'No se pudieron guardar todos los registros'
                                });
                            });
                    } catch (error) {
                        console.error('Error:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: error.message || 'No se pudieron guardar todos los registros'
                        });
                    }
                });
            }

            // Para Pedidos
            const addMaterialPedidoBtn = document.getElementById('addMaterialPedido');
            if (addMaterialPedidoBtn) {
                addMaterialPedidoBtn.addEventListener('click', function () {
                    const materialsContainer = document.getElementById('materialesContainerPedido');

                    // Crear el nuevo material
                    const newMaterial = document.createElement('div');
                    newMaterial.className = 'material-entry col-span-2 grid grid-cols-2 gap-4';
                    newMaterial.innerHTML = `<div class="mb-4">
                    <label>Proveedor:</label>
                    <select id="proveedorid" name="proveedorid" required>
                        <option value="">Seleccione un proveedor</option>
                        <option value="1">PARNOR</option>
                        <option value="2">MONDELEZ</option>
                        <option value="3">SABORISIMO</option>
                        <option value="4">LIVIAN FERCO</option>
                        <option value="5">FACHITAS</option>
                        <option value="6">CHAMMAS</option>
                        <option value="7">JAMER</option>
                        <option value="8">BEMER</option>
                        <option value="9">PETIT FOUR</option>
                        <option value="10">SANTA LUCIA</option>
                        <option value="11">LA BLANCA</option>
                    </select>
                </div>
    <div class="mb-4">
        <label>Material:</label>
        <select class="materialid" name="materialid" required>
            <option value="">Seleccione un material</option>
            <option value="1">DULCE DE LECHE P/SEMBRAR</option>
            <option value="2">TAPA GALLETA SABOR VAINILLA 17 CM</option>
            <option value="3">SALSA DULCE SABOR CHOCOLATE</option>
            <option value="4">DULCE DE LECHE C/CACAO P/SEMBRAR</option>
            <option value="5">GALLETAS MILKA MOUSSE</option>
            <option value="6">GALLETA OREO PICADA</option>
            <option value="7">PREPARADO ALMIBAR STANDART</option>
            <option value="8">HELADO DE CREMA AMERICANA</option>
            <option value="9">HELADO DE CHOCOLATE</option>
            <option value="10">HELADO DE DULCE DE LECHE</option>
        </select>
    </div>
    <div class="mb-4">
        <label>Cantidad:</label>
        <input type="number" class="cantidad" name="cantidad" required min="1">
    </div>
    <button type="button" onclick="this.parentElement.remove()" class="remove-material absolute right-0 top-0 text-red-500">
        Eliminar
    </button>`;

                    // Encontrar el botón "Agregar Material" y su contenedor
                    const addButtonContainer = document.querySelector('#addMaterialPedido').parentElement;

                    // Insertar el nuevo material antes del contenedor del botón
                    addButtonContainer.before(newMaterial);

                    // Agregar event listener para el botón eliminar
                    const deleteButton = newMaterial.querySelector('.remove-material');
                    deleteButton.addEventListener('click', function () {
                        newMaterial.remove();
                    });
                });



                // Para el formulario de Pedidos
                const formPedido = document.getElementById('solicitudPedidoForm');
                if (formPedido) {
                    formPedido.addEventListener('submit', function (e) {
                        e.preventDefault();

                        const materialEntries = formPedido.querySelectorAll('.material-entry');
                        const baseDatos = {
                            FECHAMOV: document.getElementById('fechamov_pedido').value,
                            TURNO: parseInt(document.getElementById('turnoid_pedido').value),
                            RESPONSABLE: parseInt(document.getElementById('usuarioid_pedido').value),
                            OT: parseInt(document.getElementById('otid_pedido').value),
                            LOTE: document.getElementById('lote_pedido').value,
                            TIPOMOV: 'PEDIDO' // Siempre será PEDIDO
                        };

                        try {
                            const promesas = Array.from(materialEntries).map((entry) => {
                                const proveedorId = parseInt(document.getElementById('proveedorid_pedido').value);
                                const materialSelect = entry.querySelector('.materialid');
                                const cantidadInput = entry.querySelector('.cantidad');

                                if (!materialSelect || !cantidadInput) {
                                    throw new Error('Faltan campos en alguna entrada de material');
                                }

                                const formData = {
                                    ...baseDatos,
                                    PROVEEDOR: proveedorId,
                                    MATERIAL: parseInt(materialSelect.value),
                                    CANTIDAD: parseInt(cantidadInput.value)
                                };

                                if (!formData.PROVEEDOR || !formData.MATERIAL || !formData.CANTIDAD) {
                                    throw new Error('Todos los campos son requeridos para cada material');
                                }

                                return fetch('http://localhost:63152/api/ProductionStore/InsertProductionStore', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(formData)
                                });
                            });

                            Promise.all(promesas)
                                .then(responses => {
                                    const todosOk = responses.every(response => response.ok);
                                    if (!todosOk) throw new Error('Uno o más registros fallaron');
                                    return Promise.all(responses.map(r => r.text()));
                                })
                                .then(data => {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Éxito',
                                        text: 'Todos los materiales fueron guardados correctamente'
                                    });
                                    formPedido.reset();
                                    document.getElementById('lote_pedido').value = 'AB0909';

                                    const container = document.getElementById('materialesContainerPedido');
                                    const entries = container.querySelectorAll('.material-entry');
                                    entries.forEach((entry, index) => {
                                        if (index > 0) entry.remove();
                                    });
                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: error.message || 'No se pudieron guardar todos los registros'
                                    });
                                });
                        } catch (error) {
                            console.error('Error:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: error.message || 'No se pudieron guardar todos los registros'
                            });
                        }
                    });
                }

            }


            // Para Stock Final const addMaterialFinalBtn = document.getElementById('addMaterialFinal'); if (addMaterialFinalBtn) { addMaterialFinalBtn.addEventListener('click', function () { cons

            // Para Stock Final
            const formFinal = document.getElementById('stockFinalForm');

            // Para Stock Final
            const addMaterialFinalBtn = document.getElementById('addMaterialFinal');
            if (addMaterialFinalBtn) {
                addMaterialFinalBtn.addEventListener('click', function () {
                    const materialsContainer = document.getElementById('materialesContainerFinal');
                    const lastMaterialEntry = materialsContainer.querySelector('.material-entry:last-of-type');

                    // Crear el nuevo material
                    const newMaterial = document.createElement('div');
                    newMaterial.className = 'material-entry col-span-2 grid grid-cols-2 gap-4';
                    newMaterial.innerHTML = `<div class="mb-4">
                    <label>Proveedor:</label>
                    <select id="proveedorid" name="proveedorid" required>
                        <option value="">Seleccione un proveedor</option>
                        <option value="1">PARNOR</option>
                        <option value="2">MONDELEZ</option>
                        <option value="3">SABORISIMO</option>
                        <option value="4">LIVIAN FERCO</option>
                        <option value="5">FACHITAS</option>
                        <option value="6">CHAMMAS</option>
                        <option value="7">JAMER</option>
                        <option value="8">BEMER</option>
                        <option value="9">PETIT FOUR</option>
                        <option value="10">SANTA LUCIA</option>
                        <option value="11">LA BLANCA</option>
                    </select>
                </div>
    <div class="mb-4">
        <label>Material:</label>
        <select class="materialid" name="materialid" required>
            <option value="">Seleccione un material</option>
            <option value="1">DULCE DE LECHE P/SEMBRAR</option>
            <option value="2">TAPA GALLETA SABOR VAINILLA 17 CM</option>
            <option value="3">SALSA DULCE SABOR CHOCOLATE</option>
            <option value="4">DULCE DE LECHE C/CACAO P/SEMBRAR</option>
            <option value="5">GALLETAS MILKA MOUSSE</option>
            <option value="6">GALLETA OREO PICADA</option>
            <option value="7">PREPARADO ALMIBAR STANDART</option>
            <option value="8">HELADO DE CREMA AMERICANA</option>
            <option value="9">HELADO DE CHOCOLATE</option>
            <option value="10">HELADO DE DULCE DE LECHE</option>
        </select>
    </div>
    <div class="mb-4">
        <label>Cantidad:</label>
        <input type="number" class="cantidad" name="cantidad" required min="1">
    </div>
    <button type="button" onclick="this.parentElement.remove()" class="remove-material absolute right-0 top-0 text-red-500">
        Eliminar
    </button>`;

                    // Insertar después del último material o al inicio si no hay materiales
                    if (lastMaterialEntry) {
                        lastMaterialEntry.insertAdjacentElement('afterend', newMaterial);
                    } else {
                        // Insertar antes del botón de agregar
                        const addButtonContainer = addMaterialFinalBtn.closest('.col-span-2');
                        addButtonContainer.insertAdjacentElement('beforebegin', newMaterial);
                    }

                    // Agregar event listener para el botón eliminar
                    const deleteButton = newMaterial.querySelector('.remove-material');
                    deleteButton.addEventListener('click', function () {
                        newMaterial.remove();
                    });
                });



                // Para el formulario de Stock Final
                const formFinal = document.getElementById('stockFinalForm');
                if (formFinal) {
                    formFinal.addEventListener('submit', function (e) {
                        e.preventDefault();

                        const materialEntries = formFinal.querySelectorAll('.material-entry');
                        const baseDatos = {
                            FECHAMOV: document.getElementById('fechamov_final').value,
                            TURNO: parseInt(document.getElementById('turnoid_final').value),
                            RESPONSABLE: parseInt(document.getElementById('usuarioid_final').value),
                            OT: parseInt(document.getElementById('otid_final').value),
                            LOTE: document.getElementById('lote_final').value,
                            TIPOMOV: 'STOCK FINAL'
                        };

                        try {
                            const promesas = Array.from(materialEntries).map((entry) => {
                                const proveedorId = parseInt(document.getElementById('proveedorid_final').value);
                                const materialSelect = entry.querySelector('.materialid');
                                const cantidadInput = entry.querySelector('.cantidad');

                                if (!materialSelect || !cantidadInput) {
                                    throw new Error('Faltan campos en alguna entrada de material');
                                }

                                const formData = {
                                    ...baseDatos,
                                    PROVEEDOR: proveedorId,
                                    MATERIAL: parseInt(materialSelect.value),
                                    CANTIDAD: parseInt(cantidadInput.value)
                                };

                                if (!formData.PROVEEDOR || !formData.MATERIAL || !formData.CANTIDAD) {
                                    throw new Error('Todos los campos son requeridos para cada material');
                                }

                                return fetch('http://localhost:63152/api/ProductionStore/InsertProductionStore', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(formData)
                                });
                            });

                            Promise.all(promesas)
                                .then(responses => {
                                    const todosOk = responses.every(response => response.ok);
                                    if (!todosOk) throw new Error('Uno o más registros fallaron');
                                    return Promise.all(responses.map(r => r.text()));
                                })
                                .then(data => {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Éxito',
                                        text: 'Todos los materiales fueron guardados correctamente'
                                    });
                                    formFinal.reset();
                                    document.getElementById('lote_final').value = 'AB0909';

                                    const container = document.getElementById('materialesContainerFinal');
                                    const entries = container.querySelectorAll('.material-entry');
                                    entries.forEach((entry, index) => {
                                        if (index > 0) entry.remove();
                                    });
                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: error.message || 'No se pudieron guardar todos los registros'
                                    });
                                });
                        } catch (error) {
                            console.error('Error:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: error.message || 'No se pudieron guardar todos los registros'
                            });
                        }
                    });
                }
            }
            // Configuración para el formulario de Producción Final
            const formProduccion = document.getElementById('produccionFinalForm');
            if (formProduccion) {
                formProduccion.addEventListener('submit', function (e) {
                    e.preventDefault();

                    const fecha = document.getElementById('fecha_produccion').value;
                    const turno = parseInt(document.getElementById('turnoid_produccion').value);
                    const usuario = parseInt(document.getElementById('usuarioid_produccion').value);
                    const ot = parseInt(document.getElementById('otid_produccion').value);
                    const producido = parseInt(document.getElementById('producido').value);

                    const formData = {
                        FECHA: fecha,
                        TURNO: turno,
                        RESPONSABLE: usuario,
                        OT: ot,
                        PRODUCTO: apiProductName, // Utiliza el valor de apiProductName que obtuviste anteriormente
                        PRODUCIDO: producido
                    };

                    fetch('http://localhost:63152/api/Production/InsertProduction', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Error al guardar los datos de producción');
                            }
                            return response.json();
                        })
                        .then(data => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Éxito',
                                text: 'Los datos de producción se guardaron correctamente'
                            });
                            formProduccion.reset();
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: error.message || 'No se pudieron guardar los datos de producción'
                            });
                        });
                });
            }




            // Reconectar los event listeners de las pestañas
            const newTabs = modalContent.querySelectorAll('.modal-tab');
            const newTabContents = modalContent.querySelectorAll('.tab-content');



            // Función para cargar datos específicos de cada pestaña
            function loadTabData(tabId, productName) {
                const tabContent = document.getElementById(tabId);
                const tableContainer = tabContent.querySelector('.table-container');

                switch (tabId) {
                    case 'stock-inicial':
                        fetchStockInicial(productName, tableContainer);
                        break;
                    case 'pedidos':
                        fetchPedidos(productName, tableContainer);
                        break;
                    case 'stock-final':
                        fetchStockFinal(productName, tableContainer);
                        break;
                    case 'producto-terminado':
                        fetchProductoTerminado(productName, tableContainer);
                        break;
                }
            }




            // Event listener para las pestañas
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));

                    tab.classList.add('active');
                    const tabContentId = tab.getAttribute('data-tab');
                    document.getElementById(tabContentId).classList.add('active');
                });
            });

            // Función para formatear fechas
            function formatDate(dateString) {
                if (!dateString) return '-';
                const date = new Date(dateString);
                return date.toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            }


            window.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                    reinitializeTabsOnModalOpen(); // Agregar esta línea
                }
            });


        });
    });

});

// Función para manejar el cambio de pestañas
function initializeTabSystem() {
    const tabs = document.querySelectorAll('.modal-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Remover la clase active de todas las pestañas
            tabs.forEach(t => t.classList.remove('active'));
            // Remover la clase active de todos los contenidos
            tabContents.forEach(content => content.classList.remove('active'));

            // Agregar la clase active a la pestaña seleccionada
            this.classList.add('active');

            // Mostrar el contenido correspondiente
            const tabId = this.getAttribute('data-tab');
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
            }

            // Reinicializar los formularios si es necesario
            const form = targetContent.querySelector('form');
            if (form) {
                form.reset();
                // Restaurar valores por defecto específicos
                const loteInput = form.querySelector('[name="lote"]');
                const tipoMovInput = form.querySelector('[name="tipomov"]');

                if (loteInput) loteInput.value = 'AB0909';
                if (tipoMovInput) {
                    switch (tabId) {
                        case 'stock-inicial':
                            tipoMovInput.value = 'STOCK INICIAL';
                            break;
                        case 'pedidos':
                            tipoMovInput.value = 'SOLICITUD DE PEDIDO';
                            break;
                        case 'stock-final':
                            tipoMovInput.value = 'STOCK FINAL';
                            break;
                    }
                }
            }
        });
    });
}
