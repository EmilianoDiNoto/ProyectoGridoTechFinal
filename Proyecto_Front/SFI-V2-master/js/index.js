// Configuración y funcionalidades para la página de login
$(document).ready(function() {
    // Configuración de la URL de la API
    const API_URL = "http://localhost:63152";
    
    // Comprobación de que SweetAlert está disponible
    if (typeof Swal === 'undefined') {
        console.error("SweetAlert no está disponible. Usando alerts estándar.");
        // Implementar una alternativa a SweetAlert si no está disponible
        window.Swal = {
            fire: function(options) {
                alert(options.title + "\n" + options.text);
            },
            showValidationMessage: function(message) {
                alert(message);
            }
        };
    }
    
 // Mostrar/ocultar contraseña
 $(".reveal").on('click', function () {
    const $pwd = $("#txtPassword");
    if ($pwd.attr('type') === 'password') {
        $pwd.attr('type', 'text');
        $('.glyphicon-eye-open').removeClass('glyphicon-eye-open').addClass('glyphicon-eye-close');
    } else {
        $pwd.attr('type', 'password');
        $('.glyphicon-eye-close').removeClass('glyphicon-eye-close').addClass('glyphicon-eye-open');
    }
});
    
    // Evento de login
    $(".login-button").on('click', function(e) {
        e.preventDefault();
        
        // Ocultar mensaje de error previo
        $("#formErrorMessage").hide();
        
        const username = $("#txtUser").val().trim();
        const password = $("#txtPassword").val().trim();
        
        // Validar campos
        if (username === "" || password === "") {
            // Mostrar mensaje de error en el formulario
            $("#formErrorMessage").show();
            return;
        }
        
        // Función de depuración para ver qué se está enviando
        console.log("Intentando login con:", {
            Username: username,
            Password: password
        });
        
        // Llamada a la API para autenticar
        authenticateUser(username, password);
    });
    
    // También permitir Enter para enviar el formulario
    $("#txtPassword, #txtUser").keypress(function(e) {
        if (e.which === 13) {
            $(".login-button").click();
        }
    });
    
    // Manejar el olvidó de contraseña
    $(".login-forgot").on('click', function(e) {
        e.preventDefault();
        showResetPasswordModal();
    });

    // Función para autenticar al usuario
    function authenticateUser(username, password) {
        // Mostrar indicador de carga (animación de una tuerca girando)
        $(".login-button").prop('disabled', true).html('<i class="fa fa-cog fa-spin"></i> Verificando...');
        
        // DEPURACIÓN: Mostrar en consola exactamente lo que se está enviando
        const requestData = {
            Username: username,
            Password: password
        };
        console.log("Enviando a la API:", requestData);
        console.log("URL completa:", `${API_URL}/api/usuarios/login`);
        
        $.ajax({
            url: `${API_URL}/api/usuarios/login`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function(response) {
                console.log("Login exitoso:", response);
                
                // Guardar información del usuario en sessionStorage
                sessionStorage.setItem('userId', response.userId);
                sessionStorage.setItem('userName', response.userName);
                if (response.userLastName) {
                    sessionStorage.setItem('userLastName', response.userLastName);
                }
                sessionStorage.setItem('rolId', response.rolId);
                if (response.email) {
                    sessionStorage.setItem('email', response.email);
                }
                
                // Mostrar mensaje de éxito con SweetAlert (modificado)
                Swal.fire({
                    title: '¡Bienvenido!',
                    text: 'Sesión iniciada correctamente',
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    width: '400px',
                    heightAuto: true,
                    padding: '2em',
                    customClass: {
                        popup: 'login-success-popup',
                        title: 'login-success-title',
                        content: 'login-success-content'
                    }
                }).then(() => {
                    // Redirigir al dashboard
                    window.location.href = 'home1.html';
                });
            },
            error: function(xhr, status, error) {
                console.error("Error en login:", xhr.status, error);
                console.error("Respuesta completa:", xhr.responseText);
                
                // Restaurar botón
                $(".login-button").prop('disabled', false).html('<i class="fa fa-sign-in"></i> Iniciar sesión');
                
                // Mostrar mensaje de error con SweetAlert
                if (xhr.status === 401) {
                    Swal.fire({
                        title: 'Error',
                        text: 'Credenciales incorrectas',
                        icon: 'error',
                        confirmButtonText: 'Intentar nuevamente'
                    });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Ocurrió un error al intentar iniciar sesión. Por favor intente nuevamente.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            }
        });
    }

    // Modal para recuperación de contraseña - Paso 1: Solicitar email
    function showResetPasswordModal() {
        Swal.fire({
            title: 'Recuperación de contraseña',
            html: `
                <div class="form-group">
                    <input id="resetEmail" type="email" class="form-control" placeholder="Correo electrónico">
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Enviar',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const email = document.getElementById('resetEmail').value.trim();
                if (!email) {
                    Swal.showValidationMessage('Por favor ingrese su correo electrónico');
                    return false;
                }
                
                if (!validateEmail(email)) {
                    Swal.showValidationMessage('Por favor ingrese un correo electrónico válido');
                    return false;
                }
                
                return requestPasswordReset(email);
            }
        });
    }

    // Función para solicitar reset de contraseña
    function requestPasswordReset(email) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${API_URL}/api/usuarios/reset-password`,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    Email: email
                }),
                success: function(response) {
                    console.log("Solicitud de reset exitosa:", response);
                    resolve({ email: email, token: response.developmentToken });
                },
                error: function(xhr, status, error) {
                    console.error("Error en solicitud de reset:", xhr.status, error);
                    reject(xhr.responseJSON ? xhr.responseJSON.message : "Error al procesar la solicitud");
                }
            });
        })
        .then(data => {
            // En modo desarrollo, usamos el token que nos devuelve la API
            if (data.token) {
                showNewPasswordModal(data.email, data.token);
            } else {
                // En producción, mostraríamos el modal para ingresar el token recibido por email
                showTokenInputModal(data.email);
            }
            return data;
        })
        .catch(error => {
            console.error("Error en el proceso de reset:", error);
            Swal.showValidationMessage(error || 'Error al procesar la solicitud');
        });
    }

    // Modal para recuperación de contraseña - Paso 2: Ingresar token (usado en producción)
    function showTokenInputModal(email) {
        Swal.fire({
            title: 'Verificación',
            text: 'Hemos enviado un código a tu correo electrónico. Por favor ingrésalo a continuación:',
            html: `
                <div class="form-group">
                    <input id="tokenInput" type="text" class="form-control" placeholder="Código de verificación" maxlength="6">
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Verificar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const token = document.getElementById('tokenInput').value.trim();
                if (!token) {
                    Swal.showValidationMessage('Por favor ingrese el código de verificación');
                    return false;
                }
                
                // Verificar token y mostrar modal para nueva contraseña
                showNewPasswordModal(email, token);
                return true;
            }
        });
    }

    // Modal para recuperación de contraseña - Paso 3: Ingresar nueva contraseña
    function showNewPasswordModal(email, token) {
        Swal.fire({
            title: 'Nueva contraseña',
            html: `
                <div class="form-group">
                    <input id="newPassword" type="password" class="form-control mb-3" placeholder="Nueva contraseña">
                </div>
                <div class="form-group">
                    <input id="confirmPassword" type="password" class="form-control" placeholder="Confirmar contraseña">
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Cambiar contraseña',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const newPassword = document.getElementById('newPassword').value.trim();
                const confirmPassword = document.getElementById('confirmPassword').value.trim();
                
                if (!newPassword) {
                    Swal.showValidationMessage('Por favor ingrese la nueva contraseña');
                    return false;
                }
                
                if (newPassword !== confirmPassword) {
                    Swal.showValidationMessage('Las contraseñas no coinciden');
                    return false;
                }
                
                return changePassword(email, token, newPassword);
            }
        });
    }

    // Función para cambiar la contraseña
    function changePassword(email, token, newPassword) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${API_URL}/api/usuarios/change-password`,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({
                    Email: email,
                    Token: token,
                    NewPassword: newPassword
                }),
                success: function(response) {
                    console.log("Cambio de contraseña exitoso:", response);
                    resolve(response);
                },
                error: function(xhr, status, error) {
                    console.error("Error en cambio de contraseña:", xhr.status, error);
                    reject(xhr.responseJSON ? xhr.responseJSON.message : "Error al cambiar la contraseña");
                }
            });
        })
        .then(response => {
            Swal.fire({
                title: '¡Éxito!',
                text: 'Tu contraseña ha sido actualizada correctamente. Ya puedes iniciar sesión con tu nueva contraseña.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
            return response;
        })
        .catch(error => {
            console.error("Error en el proceso de cambio de contraseña:", error);
            Swal.showValidationMessage(error || 'Error al cambiar la contraseña');
        });
    }

    // Función helper para validar email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});