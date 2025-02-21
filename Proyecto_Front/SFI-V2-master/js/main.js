$(document).ready(function(){
	/*Mostrar ocultar area de notificaciones*/
	$('.btn-Notification').on('click', function(){
        var ContainerNoty=$('.container-notifications');
        var NotificationArea=$('.NotificationArea');
        if(NotificationArea.hasClass('NotificationArea-show')&&ContainerNoty.hasClass('container-notifications-show')){
            NotificationArea.removeClass('NotificationArea-show');
            ContainerNoty.removeClass('container-notifications-show');
        }else{
            NotificationArea.addClass('NotificationArea-show');
            ContainerNoty.addClass('container-notifications-show');
        }
    });
    /*Salir del sistema*/
    $('.btn-exit').on('click', function(){
    	swal({
		  	title: '¿Desea cerrar la sesión?',
		 	text: "Su sesión se cerrará y volverá al Login",
		  	type: 'warning',
		  	showCancelButton: true,
		  	confirmButtonText: 'Si, Salir',
		  	closeOnConfirm: false
		},
		function(isConfirm) {
		  	if (isConfirm) {
		    	window.location='index.html'; 
		  	}
		});
    });
    /*Mostrar y ocultar submenus*/
    $('.btn-subMenu').on('click', function(){
    	var subMenu=$(this).next('ul');
    	var icon=$(this).children("span");
    	if(subMenu.hasClass('sub-menu-options-show')){
    		subMenu.removeClass('sub-menu-options-show');
    		icon.addClass('zmdi-chevron-left').removeClass('zmdi-chevron-down');
    	}else{
    		subMenu.addClass('sub-menu-options-show');
    		icon.addClass('zmdi-chevron-down').removeClass('zmdi-chevron-left');
    	}
    });
});
(function($){
        $(window).on("load",function(){
            $(".NotificationArea, .pageContent").mCustomScrollbar({
                theme:"dark-thin",
                scrollbarPosition: "inside",
                autoHideScrollbar: true,
                scrollButtons:{ enable: true }
            });
            $(".navLateral-body").mCustomScrollbar({
                theme:"light-thin",
                scrollbarPosition: "inside",
                autoHideScrollbar: true,
                scrollButtons:{ enable: true }
            });
        });
})(jQuery);

// Función para actualizar el reloj
function updateClock() {
    const clockElement = document.getElementById('clock');
    if (clockElement) { // Verificar que el elemento existe
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-AR', { 
            timeZone: 'America/Argentina/Cordoba',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        clockElement.textContent = timeString;
    }
}

// Actualizar el reloj cada segundo
setInterval(updateClock, 1000);
updateClock(); // Actualización inicial

// Creamos una función separada para inicializar los gráficos
function initCharts() {
    // Asegurarnos de que los elementos canvas existen
    const mainMetricsCtx = document.getElementById('mainMetrics');
    const workDistributionCtx = document.getElementById('workDistribution');
    const comparativeChartCtx = document.getElementById('comparativeChart');
    const monthlyProgressCtx = document.getElementById('monthlyProgress');

    if (mainMetricsCtx) {
        new Chart(mainMetricsCtx, {
            type: 'bar',
            data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
                datasets: [{
                    label: 'Productividad',
                    data: [65, 59, 80, 81, 56],
                    backgroundColor: '#4e73df'
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    if (workDistributionCtx) {
        new Chart(workDistributionCtx, {
            type: 'pie',
            data: {
                labels: ['En Proceso', 'Completado', 'Pendiente', 'Cancelado'],
                datasets: [{
                    data: [30, 40, 20, 10],
                    backgroundColor: ['#4e73df', '#1cc88a', '#f6c23e', '#e74a3b']
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true
            }
        });
    }

    if (comparativeChartCtx) {
        new Chart(comparativeChartCtx, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
                datasets: [{
                    label: '2024',
                    data: [65, 59, 80, 81, 56],
                    borderColor: '#4e73df',
                    tension: 0.1
                }, {
                    label: '2023',
                    data: [45, 70, 65, 75, 50],
                    borderColor: '#1cc88a',
                    tension: 0.1
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true
            }
        });
    }

    if (monthlyProgressCtx) {
        new Chart(monthlyProgressCtx, {
            type: 'bar',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
                datasets: [{
                    label: 'Completado',
                    data: [30, 40, 35, 45, 40],
                    backgroundColor: '#1cc88a'
                }, {
                    label: 'En Proceso',
                    data: [20, 15, 25, 20, 15],
                    backgroundColor: '#4e73df'
                }, {
                    label: 'Pendiente',
                    data: [10, 5, 15, 10, 5],
                    backgroundColor: '#f6c23e'
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true
                    }
                }
            }
        });
    }
}


