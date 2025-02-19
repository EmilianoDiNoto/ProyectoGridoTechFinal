let orderChart;

function formatDate(dateString) {
	const date = new Date(dateString);
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();

	return `${day}-${month}-${year}`;
}



function Get() {
	fetch("http://localhost:63152/api/WorkOrders")
		.then((response) => {
			if (!response.ok) throw new Error("Error al obtener las órdenes de trabajo");
			return response.json();
		})
		.then((data) => {
			const tbody = document.querySelector('tbody');
			tbody.innerHTML = ''; // Limpiar la tabla

			let completed = 0;
			let pending = 0;

			// Crear un objeto para contar órdenes por producto
			const productCounts = {};

			data.forEach((o) => {
				//Comparacion de realizadas/Pendientes
				if (o.ESTADO === "REALIZADA") completed++;
				else if (o.ESTADO === "PENDIENTE") pending++;

				const fechaElaboracion = formatDate(o.FECHAELABORACION);

				const _tr = `
							<tr class="order-row" data-ot="${o.OT}">
								<td data-label="OT">${o.OT}</td>
								<td data-label="CODIGO">${o.CODIGO}</td>
								<td data-label="PRODUCTO">${o.PRODUCTO}</td>
								<td data-label="DEMANDA">${o.DEMANDA}</td>
								<td data-label="UM">${o.UM}</td>
								<td data-label="ESTADO">${o.ESTADO}</td>
								<td data-label="FECHA ELABORACIÓN">${fechaElaboracion}</td>
								
							</tr>`;
				tbody.innerHTML += _tr;
			});

			updateOrderStatus(completed, pending);
			createChart(completed, pending);

			document.querySelectorAll('.order-row').forEach(row => {
				row.addEventListener('click', (e) => {
					const ot = e.currentTarget.dataset.ot;
					showMaterials(ot);
				});
			});
		})
		.catch((error) => {
			console.error("Error:", error);
		});
}


function updateOrderStatus(completed, pending) {
	const total = completed + pending;
	const percentage = total > 0 ? ((completed / total) * 100).toFixed(2) : 0;

	const orderStatus = document.getElementById("order-status");
	orderStatus.textContent = `Órdenes Realizadas: ${completed}, Pendientes: ${pending} (${percentage}% Completadas)`;
	orderStatus.style.backgroundColor = percentage === 100 ? "#4CAF50" : "#1E90FF";
}

function createChart(completed, pending) {
	const ctx = document.getElementById('orderChart').getContext('2d');

	if (orderChart) {
		orderChart.destroy();
	}

	orderChart = new Chart(ctx, {
		type: 'doughnut',
		data: {
			labels: ['Realizadas', 'Pendientes'],
			datasets: [{
				data: [completed, pending],
				backgroundColor: ['#4169E1', '#191970'],
				borderWidth: 1
			}]
		},
		options: {
			responsive: true,
			plugins: {
				legend: {
					position: 'top'
				},
				tooltip: {
					callbacks: {
						label: function (tooltipItem) {
							const total = completed + pending;
							const value = tooltipItem.raw;
							const percentage = ((value / total) * 100).toFixed(2);
							return `${tooltipItem.label}: ${percentage}% (${value})`;
						}
					}
				}
			}
		}
	});
}

//Materiales necesarios
document.addEventListener("DOMContentLoaded", function () {
	const modal = document.getElementById("materials-modal");
	const closeModal = document.querySelector(".close");

	// Evento para cerrar el modal
	if (closeModal) {
		closeModal.addEventListener("click", () => {
			modal.style.display = "none";
		});
	}

	// Cierra el modal si se hace clic fuera del contenido
	window.addEventListener("click", function (event) {
		if (event.target === modal) {
			modal.style.display = "none";
		}
	});

	// Agrega eventos a las filas de la tabla
	document.querySelectorAll("#orders-table tr").forEach(row => {
		row.addEventListener("click", function () {
			const ot = this.cells[0].textContent; // Obtener OT de la primera celda
			showMaterials(ot);
		});
	});
});

// Función para obtener y mostrar materiales
function showMaterials(ot) {
	fetch(`http://localhost:63152/api/WorkOrderMaterial/GetWorkOrderMaterials?ot=${ot}`)
		.then((response) => {
			if (!response.ok) throw new Error("Error al obtener los materiales");
			return response.json();
		})
		.then((data) => {
			const tbody = document.querySelector('#materials-table tbody');
			tbody.innerHTML = ''; // Limpiar tabla antes de agregar nuevos datos

			data.forEach((material) => {
				const fechaEntrega = formatDate(material.FECHAENTREGA);

				const _tr = `
							<tr>
								<td>${material.CODIGO}</td>
								<td>${material.MATERIAL}</td>
								<td>${material.NECESIDAD}</td>
								<td>${material.UM}</td>
								<td>${fechaEntrega}</td>
							</tr>`;
				tbody.innerHTML += _tr;
			});

			document.getElementById("materials-modal").style.display = "block";
		})
		.catch((error) => {
			console.error("Error:", error);
		});
}

// Función para formatear fecha (agregar si no existe)
function formatDate(dateString) {
	if (!dateString) return "N/A";
	const date = new Date(dateString);
	return date.toISOString().split('T')[0]; // Devuelve YYYY-MM-DD
}



//filtros
function applyFilters() {
	const otFilter = document.getElementById('filter-ot').value.toLowerCase();
	const productoFilter = document.getElementById('filter-producto').value.toLowerCase();
	const fechaDesde = document.getElementById('filter-fecha-desde').value;
	const fechaHasta = document.getElementById('filter-fecha-hasta').value;

	const rows = document.querySelectorAll('tbody tr');

	rows.forEach(row => {
		const ot = row.querySelector('[data-label="OT"]').textContent.toLowerCase();
		const producto = row.querySelector('[data-label="PRODUCTO"]').textContent.toLowerCase();
		const fecha = row.querySelector('[data-label="FECHA ELABORACIÓN"]').textContent;

		// Formatear la fecha de la fila para comparación
		const rowDate = new Date(fecha.split('-').reverse().join('-')); // Convertir DD-MM-YYYY a YYYY-MM-DD

		const matchesOt = ot.includes(otFilter);
		const matchesProducto = producto.includes(productoFilter);

		// Verificar si la fecha está en el rango
		const matchesFecha =
			(!fechaDesde || rowDate >= new Date(fechaDesde)) &&
			(!fechaHasta || rowDate <= new Date(fechaHasta));

		if (matchesOt && matchesProducto && matchesFecha) {
			row.style.display = ''; // Mostrar fila
		} else {
			row.style.display = 'none'; // Ocultar fila
		}
	});
}

// Asignar eventos a los filtros
document.getElementById('filter-ot').addEventListener('input', applyFilters);
document.getElementById('filter-producto').addEventListener('input', applyFilters);
document.getElementById('filter-fecha-desde').addEventListener('change', applyFilters);
document.getElementById('filter-fecha-hasta').addEventListener('change', applyFilters);

Get();
