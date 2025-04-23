// Función para crear un botón de exportación personalizado para el gráfico de Balance de Masas
function crearBotonExportacionBalanceMasas() {
    // Configurar todos los gráficos para que no muestren el botón de exportación por defecto
    if (typeof Highcharts !== 'undefined') {
        // Configuración global para quitar botones de todos los gráficos
        Highcharts.setOptions({
            exporting: {
                enabled: false
            }
        });
        
        // Actualizar cualquier gráfico existente para quitar sus botones
        Highcharts.charts.forEach(chart => {
            if (chart) {
                chart.update({
                    exporting: {
                        enabled: false
                    }
                });
            }
        });
        
        // Ahora configurar específicamente el gráfico de Balance de Masas
        const balanceChart = Highcharts.charts.find(chart => 
            chart && chart.renderTo.id === 'balance-highchart-container'
        );
        
        if (balanceChart) {
            // Para el gráfico de Balance, habilitamos la exportación pero ocultamos el botón nativo
            balanceChart.update({
                exporting: {
                    enabled: true,
                    buttons: {
                        contextButton: {
                            enabled: false
                        }
                    }
                }
            });
        }
    }
    
    // Crear botón de exportación personalizado para Balance de Masas
    const balanceContainer = document.querySelector('.chart-container-large:has(#balance-highchart-container)');
    // Alternativa si el selector :has no está soportado en algunos navegadores
    const balanceContainerAlt = document.querySelector('.chart-container-large');
    const container = balanceContainer || balanceContainerAlt;
    
    if (container && !document.getElementById('export-balance-btn')) {
        // Crear el contenedor para el botón
        const btnContainer = document.createElement('div');
        btnContainer.style.position = 'absolute';
        btnContainer.style.top = '15px';
        btnContainer.style.left = '15px'; // Cambiado a 'left' en lugar de 'right'
        btnContainer.style.zIndex = '100';
        
        // Crear el botón
        const exportBtn = document.createElement('button');
        exportBtn.id = 'export-balance-btn';
        exportBtn.className = 'btn btn-sm btn-outline-secondary';
        exportBtn.innerHTML = '<i class="zmdi zmdi-download"></i> Exportar';
        exportBtn.style.padding = '5px 10px';
        exportBtn.style.backgroundColor = '#f8f9fa';
        exportBtn.style.border = '1px solid #ddd';
        
        // Agregar evento de clic
        exportBtn.addEventListener('click', function() {
            // Crear menú desplegable
            const existingMenu = document.getElementById('export-options-menu');
            if (existingMenu) {
                existingMenu.remove();
                return;
            }
            
            const menu = document.createElement('div');
            menu.id = 'export-options-menu';
            menu.style.position = 'absolute';
            menu.style.top = '40px';
            menu.style.left = '0'; // Cambiado a 'left' en lugar de 'right'
            menu.style.backgroundColor = 'white';
            menu.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
            menu.style.borderRadius = '4px';
            menu.style.padding = '5px 0';
            menu.style.zIndex = '1000';
            
            // Opciones de exportación
            menu.innerHTML = `
                <div style="padding: 8px 15px; cursor: pointer;" data-format="image/png">Exportar como PNG</div>
                <div style="padding: 8px 15px; cursor: pointer;" data-format="image/jpeg">Exportar como JPG</div>
                <div style="padding: 8px 15px; cursor: pointer;" data-format="application/pdf">Exportar como PDF</div>
                <div style="padding: 8px 15px; cursor: pointer;" data-format="print">Imprimir gráfico</div>
            `;
            
            // Agregar al botón
            btnContainer.appendChild(menu);
            
            // Agregar eventos a las opciones
            menu.querySelectorAll('div').forEach(option => {
                option.addEventListener('click', function() {
                    const format = this.getAttribute('data-format');
                    const chart = Highcharts.charts.find(chart => 
                        chart && chart.renderTo.id === 'balance-highchart-container'
                    );
                    
                    if (!chart) return;
                    
                    if (format === 'print') {
                        chart.print();
                    } else {
                        chart.exportChart({
                            type: format
                        });
                    }
                    
                    // Cerrar menú
                    menu.remove();
                });
            });
            
            // Cerrar menú al hacer clic fuera
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target) && e.target !== exportBtn) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        });
        
        // Agregar botón al contenedor
        btnContainer.appendChild(exportBtn);
        container.appendChild(btnContainer);
    }
}

// Función para mostrar el diálogo de confirmación de cierre de sesión
function mostrarConfirmacionCierreSesion(callback) {
    Swal.fire({
        title: '¿Cerrar sesión?',
        text: '¿Estás seguro que deseas cerrar tu sesión en Grido Tech Advance?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0e2238',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar',
        background: '#fff',
        customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: true
    }).then((result) => {
        // Si el usuario confirma, entonces procedemos con el cierre de sesión
        if (result.isConfirmed) {
            // Mostrar mensaje de despedida
            Swal.fire({
                title: '¡Hasta pronto!',
                text: 'Cerrando sesión...',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                // Ejecutar callback (si existe) o redirigir directamente
                if (typeof callback === 'function') {
                    callback();
                } else {
                    window.location.href = 'index.html';
                }
            });
        }
    });
}

// Función para prevenir la navegación hacia atrás y mostrar confirmación
function prevenirNavegacionAtras() {
    // Guardar el estado actual en el historial con un marcador
    history.pushState({page: 'home'}, '', window.location.href);

    // Detectar cuando el usuario intenta navegar hacia atrás
    window.addEventListener('popstate', function(event) {
        // Volver a agregar un estado para mantener la navegación controlada
        history.pushState({page: 'home'}, '', window.location.href);
        
        // Mostrar el SweetAlert de confirmación
        mostrarConfirmacionCierreSesion();
    });
}

// Ejecutar cuando el documento esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el botón de exportación después de que se carguen los gráficos
    setTimeout(crearBotonExportacionBalanceMasas, 1000);
    
    // Prevenir navegación hacia atrás en páginas de home
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'home1.html' || currentPage === 'home_estandar.html') {
        prevenirNavegacionAtras();
    }
    
    // Configurar confirmación en enlaces de cierre de sesión
    const cerrarSesionLinks = document.querySelectorAll('a[href="index.html"], .nav-link[href="index.html"]');
    
    cerrarSesionLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Prevenir la navegación inmediata
            event.preventDefault();
            
            // Guardar la referencia al enlace para usarla dentro del SweetAlert
            const enlace = this;
            
            // Mostrar el SweetAlert de confirmación
            mostrarConfirmacionCierreSesion(function() {
                // Limpiar sessionStorage antes de redirigir
                sessionStorage.clear();
                
                // Redirigir a la página de inicio de sesión
                window.location.href = enlace.getAttribute('href');
            });
        });
    });
});

// También ejecutar cuando los gráficos se actualicen
window.addEventListener('resize', function() {
    setTimeout(crearBotonExportacionBalanceMasas, 500);
});