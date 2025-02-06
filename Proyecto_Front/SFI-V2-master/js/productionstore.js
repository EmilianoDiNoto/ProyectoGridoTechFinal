
			$(".nav").click(function () {
				$("#mySidenav").css("width", "70px");
				$("#main").css("margin-left", "70px");
				$(".logo").css("visibility", "hidden");
				$(".logo span").css("visibility", "visible");
				$(".logo span").css("margin-left", "-10px");
				$(".icon-a").css("visibility", "hidden");
				$(".icons").css("visibility", "visible");
				$(".icons").css("margin-left", "-8px");
				$(".nav").css("display", "none");
				$(".nav2").css("display", "block");
			});

			$(".nav2").click(function () {
				$("#mySidenav").css("width", "300px");
				$("#main").css("margin-left", "300px");
				$(".logo").css("visibility", "visible");
				$(".logo span").css("visibility", "visible");
				$(".icon-a").css("visibility", "visible");
				$(".icons").css("visibility", "visible");
				$(".nav").css("display", "block");
				$(".nav2").css("display", "none");
			});

			function formatDate(dateString) {
				const date = new Date(dateString);
				const day = String(date.getDate()).padStart(2, '0');
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const year = date.getFullYear();

				return `${day}-${month}-${year}`;
			}

			function Get() {
				fetch("http://localhost:63152/api/ProductionStore/GetAllProductionStore")
					.then((response) => response.json())
					.then((data) => {
						const tbody = document.querySelector(`tbody`);

						
						data.forEach((o) => {
							const fechaElaboracion = formatDate(o.FECHAMOV);
							let _tr = `<tr>
						  <td data-label="FECHA">${o.FECHAMOV}</td>
						  <td data-label="TURNO">${o.TURNO}</td>
						  <td data-label="RESPONSABLE">${o.RESPONSABLE}</td>
						<td data-label="OT">${o.OT}</td>
						<td data-label="MATERIAL">${o.MATERIAL}</td>
						  <td data-label="CANTIDAD">${o.CANTIDAD}</td>
						  <td data-label="PROVEEDOR">${o.PROVEEDOR}</td>
						  <td data-label="LOTE">${o.LOTE}</td>
						  <td data-label="TIPO DE MOVIMIENTO">${o.TIPOMOV}</td>
					  </tr>`;

							tbody.innerHTML += _tr;
						});
					});
			}
			Get();

			// Función para filtrar los productos
			function filterProducts(searchValue, searchType) {
				const tbody = document.querySelector('tbody');
				const rows = tbody.getElementsByTagName('tr');

				// Convertir el valor de búsqueda a minúsculas para hacer la búsqueda insensible a mayúsculas
				searchValue = searchValue.toLowerCase();

				for (let row of rows) {
					let codigo = row.cells[0].textContent.toLowerCase();
					let nombre = row.cells[1].textContent.toLowerCase();
					let descripcion = row.cells[2].textContent.toLowerCase();
					let showRow = false;

					switch (searchType) {
						case 'codigo':
							showRow = codigo.includes(searchValue);
							break;
						case 'nombre':
							showRow = nombre.includes(searchValue);
							break;
						case 'all':
							showRow = codigo.includes(searchValue) ||
								nombre.includes(searchValue) ||
								descripcion.includes(searchValue);
							break;
						default:
							showRow = true;
					}

					row.style.display = showRow ? '' : 'none';
				}
			}

			// Función para inicializar los event listeners
			function initializeSearch() {
				const searchInput = document.getElementById('searchInput');
				const searchType = document.getElementById('searchType');

				// Event listener para el input de búsqueda
				searchInput.addEventListener('input', function () {
					filterProducts(this.value, searchType.value);
				});

				// Event listener para el cambio de tipo de búsqueda
				searchType.addEventListener('change', function () {
					filterProducts(searchInput.value, this.value);
				});
			}

			// Modificar la función Get para inicializar la búsqueda después de cargar los datos
			function Get() {
				fetch("http://localhost:63152/api/ProductionStore/GetAllProductionStore")
					.then((response) => response.json())
					.then((data) => {
						const tbody = document.querySelector('tbody');
						tbody.innerHTML = ''; // Limpiar tbody antes de agregar nuevos datos

						data.forEach((o) => {
							const fechaElaboracion = formatDate(o.FECHAMOV);
							let _tr = `<tr>
                    <td data-label="FECHA">${o.FECHAMOV}</td>
						  <td data-label="TURNO">${o.TURNO}</td>
						  <td data-label="RESPONSABLE">${o.RESPONSABLE}</td>
						<td data-label="OT">${o.OT}</td>
						<td data-label="MATERIAL">${o.MATERIAL}</td>
						  <td data-label="CANTIDAD">${o.CANTIDAD}</td>
						  <td data-label="PROVEEDOR">${o.PROVEEDOR}</td>
						  <td data-label="LOTE">${o.LOTE}</td>
						  <td data-label="TIPO DE MOVIMIENTO">${o.TIPOMOV}</td>
                  </tr>`;
							tbody.innerHTML += _tr;
						});

						// Inicializar la búsqueda después de cargar los datos
						initializeSearch();
					})
					.catch(error => {
						console.error('Error al cargar los productos:', error);
					});
			}

			// Llamar a Get cuando se carga la página
			document.addEventListener('DOMContentLoaded', Get);

			// Función para filtrar productos por texto
			function filterProducts(searchValue, searchType) {
				const tbody = document.querySelector('tbody');
				const rows = tbody.getElementsByTagName('tr');

				searchValue = searchValue.toLowerCase();

				for (let row of rows) {
					let codigo = row.cells[0].textContent.toLowerCase();
					let nombre = row.cells[1].textContent.toLowerCase();
					let descripcion = row.cells[2].textContent.toLowerCase();
					let showRow = false;

					switch (searchType) {
						case 'codigo':
							showRow = codigo.includes(searchValue);
							break;
						case 'nombre':
							showRow = nombre.includes(searchValue);
							break;
						case 'all':
							showRow = codigo.includes(searchValue) ||
								nombre.includes(searchValue) ||
								descripcion.includes(searchValue);
							break;
						default:
							showRow = true;
					}

					row.style.display = showRow ? '' : 'none';
				}
			}

			// Función para filtrar por país
			function filterByCountry() {
				const countryFilter = document.getElementById('countryFilter').value;
				const tbody = document.querySelector('tbody');
				const rows = tbody.getElementsByTagName('tr');

				// Si hay texto en el buscador, primero aplicamos ese filtro
				const searchInput = document.getElementById('searchInput');
				const searchType = document.getElementById('searchType');
				if (searchInput.value) {
					filterProducts(searchInput.value, searchType.value);
				}

				// Luego aplicamos el filtro de país
				for (let row of rows) {
					// Solo procesamos las filas que están visibles después del filtro de búsqueda
					if (row.style.display !== 'none') {
						let nombre = row.cells[1].textContent.toLowerCase(); // Cambiamos a nombre en lugar de código
						let showRow = false;

						switch (countryFilter) {
							case 'Argentina':
								showRow = nombre.includes('GRIDO');
								break;
							case 'Paraguay':
								showRow = nombre.includes('EXPO');
								break;
							case 'Peru':
								showRow = nombre.includes('PE');
								break;
							case 'Uruguay':
								showRow = nombre.includes('UY');
								break;
							case 'Chile':
								showRow = nombre.includes('CL');
								break;
							case 'all':
								showRow = true;
								break;
						}

						row.style.display = showRow ? '' : 'none';
					}
				}

				// Mostrar mensaje si no hay resultados
				const visibleRows = [...rows].filter(row => row.style.display !== 'none');
				const noResultsMessage = document.getElementById('noResultsMessage');

				if (visibleRows.length === 0) {
					if (!noResultsMessage) {
						const message = document.createElement('div');
						message.id = 'noResultsMessage';
						message.className = 'no-results';
						message.textContent = 'No se encontraron productos para los filtros seleccionados';
						tbody.parentNode.insertBefore(message, tbody.nextSibling);
					}
				} else if (noResultsMessage) {
					noResultsMessage.remove();
				}
			}

			// Función para inicializar los event listeners
			function initializeSearch() {
				const searchInput = document.getElementById('searchInput');
				const searchType = document.getElementById('searchType');
				const filterButton = document.getElementById('filterButton');

				// Event listener para el input de búsqueda
				searchInput.addEventListener('input', function () {
					filterProducts(this.value, searchType.value);
				});

				// Event listener para el cambio de tipo de búsqueda
				searchType.addEventListener('change', function () {
					if (searchInput.value) {
						filterProducts(searchInput.value, this.value);
					}
				});

				// Event listener para el botón de filtrar
				filterButton.addEventListener('click', filterByCountry);
			}

			// Modificar la función Get para inicializar la búsqueda después de cargar los datos
			function Get() {
				fetch("http://localhost:63152/api/ProductionStore/GetAllProductionStore")
					.then((response) => response.json())
					.then((data) => {
						const tbody = document.querySelector('tbody');
						tbody.innerHTML = ''; // Limpiar tbody antes de agregar nuevos datos

						data.forEach((o) => {
							const fechaElaboracion = formatDate(o.FECHAMOV);
							let _tr = `<tr>
                            <td data-label="FECHA">${o.FECHAMOV}</td>
						  <td data-label="TURNO">${o.TURNO}</td>
						  <td data-label="RESPONSABLE">${o.RESPONSABLE}</td>
						<td data-label="OT">${o.OT}</td>
						<td data-label="MATERIAL">${o.MATERIAL}</td>
						  <td data-label="CANTIDAD">${o.CANTIDAD}</td>
						  <td data-label="PROVEEDOR">${o.PROVEEDOR}</td>
						  <td data-label="LOTE">${o.LOTE}</td>
						  <td data-label="TIPO DE MOVIMIENTO">${o.TIPOMOV}</td>
                          </tr>`;
							tbody.innerHTML += _tr;
						});

						// Inicializar la búsqueda después de cargar los datos
						initializeSearch();
					})
					.catch(error => {
						console.error('Error al cargar los productos:', error);
					});
			}

			// Llamar a Get cuando se carga la página
			document.addEventListener('DOMContentLoaded', Get);
