// Verificar que jQuery esté disponible
if (typeof jQuery === 'undefined') {
    console.error('jQuery no está disponible. La funcionalidad puede verse comprometida.');
} else {
    console.log('jQuery está cargado correctamente:', jQuery.fn.jquery);
}

// Configuración de la URL de la API
const API_URL = "http://localhost:63152";
let usersTable;
let isEditMode = false;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Esperar a que el documento esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {
    // Verificar jQuery antes de continuar
    if (typeof jQuery !== 'undefined' && typeof $.fn.DataTable !== 'undefined') {
        // Inicializar DataTable
        initDataTable();

        // Cargar la lista de usuarios
        loadUsers();

        // Cargar la lista de roles para el formulario
        loadRoles();

        // Configurar eventos
        setupEventListeners();
    } else {
        console.error('jQuery o DataTables no están disponibles. Por favor, recargue la página.');
    }
});

// Inicialización de DataTable
function initDataTable() {
    usersTable = $('#usersTable').DataTable({
        responsive: true,
        language: {
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
            {
                data: "ProfileImage",
                render: function (data) {
                    if (data && data.trim() !== '') {
                        // Para depuración
                        console.log(`Renderizando imagen (primeros 30 caracteres): ${data.substring(0, 30)}...`);
                        
                        // Verifica si la cadena ya tiene el prefijo data:
                        if (data.startsWith('data:')) {
                            return `<img src="${data}" alt="Perfil" class="img-fluid rounded-circle" style="width: 40px; height: 40px; object-fit: cover;">`;
                        } else {
                            // Intenta agregar el prefijo data:image
                            return `<img src="data:image/jpeg;base64,${data}" alt="Perfil" class="img-fluid rounded-circle" style="width: 40px; height: 40px; object-fit: cover;">`;
                        }
                    } else {
                        return `<img src="assets/img/user-profile-icon-free-vector.png" alt="Perfil" class="img-fluid rounded-circle" style="width: 40px; height: 40px; object-fit: cover;">`;
                    }
                }
            },
            { data: "UserName" },
            { data: "UserLastName" },
            {
                data: null,
                render: function (data) {
                    return `${data.UserName}`;
                }
            },
            { data: "Email" },
            { data: "RolName" },
            {
                data: "UserState",
                render: function (data) {
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
                render: function (data) {
                    const editBtn = `<button class="btn btn-sm btn-primary me-1 edit-user" data-id="${data.UserID}"><i class="zmdi zmdi-edit"></i></button>`;

                    // Ahora usamos UserState (mayúscula) para mantener consistencia
                    let stateBtn = '';
                    if (data.UserState === true) {
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

// Cargar la lista de usuarios desde la API
function loadUsers() {
    // Mostrar indicador de carga
    const tableContainer = $('#usersTable').closest('.table-responsive');
    tableContainer.append('<div class="text-center my-3" id="loadingIndicator"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>');

    $.ajax({
        url: `${API_URL}/api/gestion-usuarios`,
        type: 'GET',
        success: function (response) {
            // Eliminar indicador de carga
            $('#loadingIndicator').remove();

            // Procesar datos antes de agregarlos a la tabla
            // Esto asegura que usamos las propiedades correctas
            const processedData = response.map(user => {
                return {
                    UserID: user.UserID,
                    UserName: user.UserName || '',
                    UserLastName: user.UserLastName || '',
                    Email: user.Email || '',
                    RolID: user.RolID || 0,
                    RolName: user.RolName || '',
                    UserState: typeof user.UserState === 'boolean' ? user.UserState : Boolean(user.UserState),
                    ProfileImage: user.ProfileImage || null
                };
            });

            usersTable.clear().rows.add(processedData).draw();

            // En la función loadUsers, agrega después de recibir la respuesta:
            console.log("Datos de usuarios recibidos:", response);
            // Verifica específicamente las imágenes
            response.forEach(user => {
                console.log(`Usuario ${user.UserID} - Imagen: ${user.ProfileImage ? 'Sí tiene' : 'No tiene'}`);
                if (user.ProfileImage) {
                    console.log(`Primeros 50 caracteres: ${user.ProfileImage.substring(0, 50)}`);
                }
            });
        },
        error: function (xhr, status, error) {
            // Eliminar indicador de carga
            $('#loadingIndicator').remove();

            console.error("Error al cargar usuarios:", error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudieron cargar los usuarios. Por favor, intente nuevamente.',
                icon: 'error'
            });
        }
    });
}

// Cargar la lista de roles desde la API
function loadRoles() {
    $.ajax({
        url: `${API_URL}/api/gestion-usuarios/roles`,
        type: 'GET',
        success: function (response) {
            const selectRol = $('#rolId');
            selectRol.empty();

            response.forEach(function (rol) {
                selectRol.append(`<option value="${rol.RolID}">${rol.RolName}</option>`);
            });
        },
        error: function (xhr, status, error) {
            console.error("Error al cargar roles:", error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudieron cargar los roles. Por favor, intente nuevamente.',
                icon: 'error'
            });
        }
    });
}

// Configurar eventos
function setupEventListeners() {
    // Evento para abrir el modal de nuevo usuario
    $('#btnAddUser').on('click', function () {
        openUserModal();
    });

    // Evento para editar usuario
    $('#usersTable').on('click', '.edit-user', function () {
        const UserID = $(this).data('id');
        getUserById(UserID);
    });

    // Evento para activar usuario
    $('#usersTable').on('click', '.activate-user', function () {
        const UserID = $(this).data('id');
        changeUserState(UserID, true);
    });

    // Evento para desactivar usuario
    $('#usersTable').on('click', '.deactivate-user', function () {
        const UserID = $(this).data('id');
        changeUserState(UserID, false);
    });

    // Evento para cambiar contraseña
    $('#usersTable').on('click', '.change-password', function () {
        const UserID = $(this).data('id');
        openChangePasswordModal(UserID);
    });

    // Evento para subir imagen de perfil
    $('#btnUploadImage').on('click', function () {
        uploadProfileImage();
    });

    // Evento para guardar usuario
    $('#userForm').on('submit', function (e) {
        e.preventDefault();
        saveUser();
    });

    // Agregar manejador para el botón Cancelar en el modal
    $('.modal .btn-secondary').on('click', function (e) {
        e.preventDefault();
        closeUserModal();
    });

    setupEmailValidation();
}

// Función para abrir el modal
function openUserModal(user = null) {
    resetUserForm();

    if (user) {
        isEditMode = true;
        $('#userModalLabel').text('Editar Usuario');

        $('#userId').val(user.UserID);
        $('#userName').val(user.UserName);
        $('#userLastName').val(user.UserLastName);
        $('#email').val(user.Email);
        $('#rolId').val(user.RolID);

        // Para edición, la contraseña es opcional
        $('.password-field input').prop('required', false);
        $('.edit-password-help').removeClass('d-none');

        // Mostrar imagen de perfil si existe
        if (user.ProfileImage) {
            $('#profileImage').val(user.ProfileImage);
            $('#imagePreview').html(`<img src="${user.ProfileImage}" alt="Imagen de perfil" class="img-thumbnail" style="max-height: 150px">`);
        }
    } else {
        isEditMode = false;
        $('#userModalLabel').text('Nuevo Usuario');

        // Para nuevo usuario, la contraseña es obligatoria
        $('.password-field input').prop('required', true);
        $('.edit-password-help').addClass('d-none');
    }

    // Usar la versión de Bootstrap del modal
    const userModal = new bootstrap.Modal(document.getElementById('userModal'), {
        backdrop: 'static',  // Esto evita que se cierre al hacer clic fuera
        keyboard: false      // Evita cerrar con tecla Escape
    });
    userModal.show();
}

// Función mejorada para cerrar el modal
function closeUserModal() {
    const userModalElement = document.getElementById('userModal');
    const userModal = bootstrap.Modal.getInstance(userModalElement);

    // Eliminar el foco de cualquier elemento dentro del modal antes de cerrarlo
    document.activeElement.blur();

    // Añadir un pequeño retraso para asegurar que el foco se ha perdido
    setTimeout(() => {
        userModal.hide();
    }, 10);
}

// Resetear formulario de usuario
function resetUserForm() {
    $('#userForm')[0].reset();
    $('#userId').val('');
    $('#profileImage').val('');
    $('#imagePreview').empty();
}

// Obtener usuario por ID
function getUserById(userId) {
    $.ajax({
        url: `${API_URL}/api/gestion-usuarios/${userId}`,
        type: 'GET',
        success: function (response) {
            openUserModal(response);
        },
        error: function (xhr, status, error) {
            console.error("Error al obtener usuario:", error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo cargar la información del usuario.',
                icon: 'error'
            });
        }
    });
}

// Cambiar estado del usuario (activar/desactivar)
function changeUserState(userId, newState) {
    const actionText = newState ? 'activar' : 'desactivar';

    Swal.fire({
        title: `¿Está seguro de ${actionText} este usuario?`,
        text: `El usuario será ${newState ? 'activado' : 'desactivado'} en el sistema.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `${API_URL}/api/gestion-usuarios/${userId}/state`,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({
                    UserID: userId,
                    UserState: newState
                }),
                success: function (response) {
                    Swal.fire({
                        title: 'Éxito',
                        text: response.message,
                        icon: 'success'
                    });
                    loadUsers();
                },
                error: function (xhr, status, error) {
                    console.error(`Error al ${actionText} usuario:`, error);
                    Swal.fire({
                        title: 'Error',
                        text: `No se pudo ${actionText} el usuario.`,
                        icon: 'error'
                    });
                }
            });
        }
    });
}

// Abrir modal para cambiar contraseña
function openChangePasswordModal(userId) {
    Swal.fire({
        title: 'Cambiar Contraseña',
        html: `
            <div class="form-group mb-3">
                <label class="form-label">Nueva Contraseña</label>
                <input type="password" id="newPassword" class="form-control">
            </div>
            <div class="form-group">
                <label class="form-label">Confirmar Contraseña</label>
                <input type="password" id="confirmNewPassword" class="form-control">
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Cambiar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const newPassword = Swal.getPopup().querySelector('#newPassword').value;
            const confirmNewPassword = Swal.getPopup().querySelector('#confirmNewPassword').value;

            if (!newPassword) {
                Swal.showValidationMessage('Por favor ingrese la nueva contraseña');
                return false;
            }

            if (newPassword !== confirmNewPassword) {
                Swal.showValidationMessage('Las contraseñas no coinciden');
                return false;
            }

            return { newPassword };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `${API_URL}/api/gestion-usuarios/${userId}/password`,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({
                    UserID: userId,
                    NewPassword: result.value.newPassword
                }),
                success: function (response) {
                    Swal.fire({
                        title: 'Éxito',
                        text: response.message,
                        icon: 'success'
                    });
                },
                error: function (xhr, status, error) {
                    console.error("Error al cambiar contraseña:", error);
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo cambiar la contraseña.',
                        icon: 'error'
                    });
                }
            });
        }
    });
}

// Agrega esto a la función uploadProfileImage para más depuración
function uploadProfileImage() {
    const fileInput = $('#profileImageFile')[0];
    
    if (!fileInput.files || fileInput.files.length === 0) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor seleccione una imagen',
            icon: 'error'
        });
        return;
    }
    
    console.log("Archivo a subir:", fileInput.files[0].name, "Tamaño:", fileInput.files[0].size);
    
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    
    // Mostrar indicador de carga
    Swal.fire({
        title: 'Subiendo...',
        text: 'Espere mientras se sube la imagen',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    $.ajax({
        url: `${API_URL}/api/gestion-usuarios/upload-image`,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            // Cerrar indicador de carga
            Swal.close();
            
            console.log("Respuesta completa del servidor:", response);
            
            // Verificar si la respuesta contiene la imagen
            if (response && response.imageBase64) {
                console.log("Imagen recibida correctamente. Longitud:", response.imageBase64.length);
                console.log("Primeros 50 caracteres:", response.imageBase64.substring(0, 50));
                
                $('#profileImage').val(response.imageBase64);
                $('#imagePreview').html(`<img src="${response.imageBase64}" alt="Imagen de perfil" class="img-thumbnail" style="max-height: 150px">`);
                
                Swal.fire({
                    title: 'Éxito',
                    text: 'Imagen subida correctamente',
                    icon: 'success'
                });
            } else {
                console.error("La respuesta no contiene la imagen en base64");
                Swal.fire({
                    title: 'Error',
                    text: 'La respuesta del servidor no contiene la imagen',
                    icon: 'error'
                });
            }
        },
        error: function (xhr, status, error) {
            // Cerrar indicador de carga
            Swal.close();
            
            console.error("Error al subir imagen:", error);
            console.error("Detalles:", xhr.responseText);
            let errorMessage = 'No se pudo subir la imagen.';
            
            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMessage = xhr.responseJSON.message;
            }
            
            Swal.fire({
                title: 'Error',
                text: errorMessage,
                icon: 'error'
            });
        }
    });
}

// Guardar usuario (crear o actualizar)
function saveUser() {
    // Validar formulario
    if (!validateUserForm()) {
        return;
    }

    const userData = {
        UserName: $('#userName').val(),
        UserLastName: $('#userLastName').val(),
        Email: $('#email').val(),
        RolID: parseInt($('#rolId').val()),
        ProfileImage: $('#profileImage').val() || null // Aseguramos que sea null si está vacío
    };

    if (isEditMode) {
        // Actualizar usuario existente
        const userId = $('#userId').val();
        userData.UserID = parseInt(userId);

        // Si hay contraseña nueva, la agregamos
        const password = $('#password').val();
        if (password) {
            userData.UserPass = password;
        }

        $.ajax({
            url: `${API_URL}/api/gestion-usuarios/${userId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function (response) {
                Swal.fire({
                    title: 'Éxito',
                    text: response.message,
                    icon: 'success'
                });

                // Cerrar modal correctamente
                closeUserModal();

                loadUsers();
            },
            error: function (xhr, status, error) {
                console.error("Error al actualizar usuario:", error);
                let errorMessage = 'No se pudo actualizar el usuario.';

                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage = xhr.responseJSON.message;
                }

                Swal.fire({
                    title: 'Error',
                    text: errorMessage,
                    icon: 'error'
                });
            }
        });
    } else {
        // Crear nuevo usuario
        userData.UserPass = $('#password').val(); // Usamos UserPass (mayúscula)

        $.ajax({
            url: `${API_URL}/api/gestion-usuarios`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function (response) {
                Swal.fire({
                    title: 'Éxito',
                    text: response.message,
                    icon: 'success'
                });

                // Cerrar modal correctamente
                closeUserModal();

                loadUsers();
            },
            error: function (xhr, status, error) {
                console.error("Error al crear usuario:", error);
                let errorMessage = 'No se pudo crear el usuario.';

                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage = xhr.responseJSON.message;
                }

                Swal.fire({
                    title: 'Error',
                    text: errorMessage,
                    icon: 'error'
                });
            }
        });
    }
}

// Validar formulario de usuario
function validateUserForm() {
    const userName = $('#userName').val();
    const userLastName = $('#userLastName').val();
    const email = $('#email').val();
    const password = $('#password').val();
    const confirmPassword = $('#confirmPassword').val();

    if (!userName || !userLastName || !email) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor complete todos los campos obligatorios',
            icon: 'error'
        });
        return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor ingrese un email válido',
            icon: 'error'
        });
        return false;
    }

    // Validar contraseña solo si no es modo edición o si se ingresó una contraseña nueva
    if (!isEditMode || password) {
        if (!isEditMode && !password) {
            Swal.fire({
                title: 'Error',
                text: 'Por favor ingrese una contraseña',
                icon: 'error'
            });
            return false;
        }

        if (password !== confirmPassword) {
            Swal.fire({
                title: 'Error',
                text: 'Las contraseñas no coinciden',
                icon: 'error'
            });
            return false;
        }
    }

    return true;
}

// Agregar esta función para verificar email duplicado
function checkEmailExists(email, userId = null) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${API_URL}/api/gestion-usuarios/check-email`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                email: email,
                userId: userId // Para excluir el usuario actual al editar
            }),
            success: function (response) {
                resolve(response.exists);
            },
            error: function (xhr, status, error) {
                console.error("Error al verificar email:", error);
                reject(error);
            }
        });
    });
}

// Agregar validación en tiempo real al campo de email
function setupEmailValidation() {
    $('#email').on('blur', async function () {
        const email = $(this).val();
        if (email && emailRegex.test(email)) {
            const userId = isEditMode ? parseInt($('#userId').val()) : null;
            try {
                const exists = await checkEmailExists(email, userId);
                if (exists) {
                    $(this).addClass('is-invalid');
                    $(this).after('<div class="invalid-feedback">Este correo ya está registrado.</div>');
                    Swal.fire({
                        title: 'Email duplicado',
                        text: 'Este correo electrónico ya está registrado en el sistema.',
                        icon: 'warning'
                    });
                } else {
                    $(this).removeClass('is-invalid');
                    $(this).siblings('.invalid-feedback').remove();
                }
            } catch (error) {
                console.error("Error en validación:", error);
            }
        }
    });
}