// Guardar datos del formulario en localStorage
function guardarDatosFormulario() {
    const datosFormulario = {
        ot: document.getElementById("validationCustom01").value,
        producto: document.getElementById("validationCustom02").value,
        fecha: document.getElementById("validationCustom04").value,
        turno: document.getElementById("validationCustom05").value,
        responsable: document.getElementById("validationCustom06").value,
        cantidad: document.getElementById("validationCustom03").value
    };
    
    localStorage.setItem('datosFormularioProceso', JSON.stringify(datosFormulario));
}

// Recuperar datos del formulario desde localStorage
function cargarDatosFormulario() {
    const datosGuardados = localStorage.getItem('datosFormularioProceso');
    
    if (datosGuardados) {
        const datos = JSON.parse(datosGuardados);
        
        // Cargar datos en los campos si existen
        if (datos.ot) document.getElementById("validationCustom01").value = datos.ot;
        if (datos.producto) document.getElementById("validationCustom02").value = datos.producto;
        if (datos.turno) document.getElementById("validationCustom05").value = datos.turno;
        if (datos.responsable) document.getElementById("validationCustom06").value = datos.responsable;
        if (datos.cantidad) document.getElementById("validationCustom03").value = datos.cantidad;
    }
    
    // Si no hay fecha guardada o si queremos actualizarla siempre
    const fechaActual = new Date().toISOString().split('T')[0];
    document.getElementById("validationCustom04").value = fechaActual;
    
    // También recuperamos de URL para compatibilidad con tu sistema actual
    const params = new URLSearchParams(window.location.search);
    const ot = params.get("ot");
    const producto = params.get("producto");
    
    if (ot) document.getElementById("validationCustom01").value = ot;
    if (producto) document.getElementById("validationCustom02").value = producto;
}

// Guardar datos cuando se haga submit o al cambiar de página
document.addEventListener("DOMContentLoaded", function() {
    // Cargar datos al iniciar
    cargarDatosFormulario();
    
    // Guardar datos al enviar el formulario
    const form = document.querySelector('form');
    form.addEventListener('submit', function() {
        guardarDatosFormulario();
    });
    
    // Guardar datos al cambiar de página (esto captura los clics en enlaces)
    document.addEventListener('click', function(event) {
        if (event.target.tagName === 'A') {
            guardarDatosFormulario();
        }
    });
    
    // Para botones que redirigen mediante JavaScript
    const botonesNavegacion = document.querySelectorAll('button[data-navega]');
    botonesNavegacion.forEach(btn => {
        btn.addEventListener('click', guardarDatosFormulario);
    });
});

// Opcional: Guardar datos periódicamente (cada 5 segundos)
setInterval(guardarDatosFormulario, 5000);

// Guardar también al cerrar la ventana o navegar fuera
window.addEventListener('beforeunload', guardarDatosFormulario);