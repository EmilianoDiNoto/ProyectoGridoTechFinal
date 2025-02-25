document.addEventListener('DOMContentLoaded', function () {
    const hamBurger = document.querySelector(".toggle-btn");
    const sidebar = document.querySelector("#sidebar");

    function adjustTable() {
        if (window.materialsTable &&
            typeof window.materialsTable.columns?.adjust === 'function') {
            setTimeout(() => {
                window.materialsTable.columns.adjust();
                if (window.materialsTable.responsive) {
                    window.materialsTable.responsive.recalc();
                }
            }, 300);
        }
    }

    hamBurger.addEventListener("click", function () {
        sidebar.classList.toggle("expand");
        adjustTable();
    });

    function handleResize() {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove("expand");
        } else {
            if (!sidebar.classList.contains("expand")) {
                sidebar.classList.add("expand");
            }
        }
        adjustTable();
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    
});

// Inicialización de DataTable
function initDataTable() {
    usersTable = $('#usersTable').DataTable({
        responsive: true,
        language: {
            // Definición directa del idioma para evitar CORS
            "decimal": "",
            "emptyTable": "No hay datos disponibles",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
            "infoEmpty": "Mostrando 0 a 0 de 0 registros",
            "infoFiltered": "(filtrado de _MAX_ registros totales)",
            "thousands": ",",
            "lengthMenu": "Mostrar _MENU_ registros",
            "loadingRecords": "Cargando...",
            "processing": "Procesando...",
            "search": "Buscar:",
            "zeroRecords": "No se encontraron coincidencias",
            "paginate": {
                "first": "Primero",
                "last": "Último",
                "next": "Siguiente",
                "previous": "Anterior"
            }
        },
        columns: [
            { data: "UserID" },  // Cambiado de userID a UserID
            { data: "UserName" }, // Cambiado de userName a UserName
            { data: "UserLastName" }, // Cambiado de userLastName a UserLastName
            { 
                data: null,
                render: function(data) {
                    return `${data.UserName}`; // Cambiado a UserName
                }
            },
            { data: "Email" }, // Cambiado de email a Email
            { data: "RolName" }, // Cambiado de rolName a RolName
            { 
                data: "UserState", // Cambiado de userState a UserState
                render: function(data) {
                    if (data) {
                        return '<span class="badge bg-success">Activo</span>';
                    } else {
                        return '<span class="badge bg-danger">Inactivo</span>';
                    }
                }
            },
            {
                data: null,
                orderable: false,
                render: function(data) {
                    const editBtn = `<button class="btn btn-sm btn-primary me-1 edit-user" data-id="${data.UserID}"><i class="zmdi zmdi-edit"></i></button>`;
                    
                    let stateBtn = '';
                    if (data.UserState) {
                        stateBtn = `<button class="btn btn-sm btn-danger me-1 deactivate-user" data-id="${data.UserID}"><i class="zmdi zmdi-lock"></i></button>`;
                    } else {
                        stateBtn = `<button class="btn btn-sm btn-success me-1 activate-user" data-id="${data.UserID}"><i class="zmdi zmdi-lock-open"></i></button>`;
                    }
                    
                    const passwordBtn = `<button class="btn btn-sm btn-warning me-1 change-password" data-id="${data.UserID}"><i class="zmdi zmdi-key"></i></button>`;
                    
                    return editBtn + stateBtn + passwordBtn;
                }
            }
        ]
    });
}






