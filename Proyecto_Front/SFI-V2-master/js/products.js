
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
	
			function Get() {
				fetch("http://localhost:63152/api/Products")
					.then((response) => response.json())
					.then((data) => {
						const tbody = document.querySelector(`tbody`);

						data.forEach((o) => {
							let _tr = `<tr>
						  <td>${o.CODIGO}</td>
						  <td>${o.PRODUCTO}</td>
						  <td>${o.DESCRIPCION}</td>
						  <td>${o.UM}</td>
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
				fetch("http://localhost:63152/api/Products")
					.then((response) => response.json())
					.then((data) => {
						const tbody = document.querySelector('tbody');
						tbody.innerHTML = ''; // Limpiar tbody antes de agregar nuevos datos

						data.forEach((o) => {
							let _tr = `<tr>
                    <td>${o.CODIGO}</td>
                    <td>${o.PRODUCTO}</td>
                    <td>${o.DESCRIPCION}</td>
                    <td>${o.UM}</td>
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

			function filterByCountry() {
    const countryFilter = document.getElementById('countryFilter').value;
    const tbody = document.querySelector('tbody');
    const rows = tbody.getElementsByTagName('tr');

    for (let row of rows) {
        let producto = row.cells[1].textContent.trim(); // Columna del nombre del producto
        let showRow = false;

        if (countryFilter === 'all') {
            showRow = true;
        } else {
            switch (countryFilter) {
                case 'Argentina':
                    showRow = producto.endsWith('GRIDO');
                    break;
                case 'Chile':
                    showRow = producto.endsWith('CL');
                    break;
                case 'Paraguay':
                    showRow = producto.endsWith('EXPO');
                    break;
                case 'Uruguay':
                    showRow = producto.endsWith('UY');
                    break;
                case 'Peru':
                    showRow = producto.endsWith('PE');
                    break;
            }
        }

        row.style.display = showRow ? '' : 'none';
    }

    // Mostrar mensaje si no hay resultados
    const visibleRows = [...rows].filter(row => row.style.display !== 'none');
    let noResultsMessage = document.getElementById('noResultsMessage');

    if (visibleRows.length === 0) {
        if (!noResultsMessage) {
            noResultsMessage = document.createElement('div');
            noResultsMessage.id = 'noResultsMessage';
            noResultsMessage.className = 'no-results';
            noResultsMessage.textContent = 'No se encontraron productos para el país seleccionado';
            tbody.parentNode.insertBefore(noResultsMessage, tbody.nextSibling);
        }
    } else if (noResultsMessage) {
        noResultsMessage.remove();
    }
}

// Asegúrate de que este evento esté configurado
document.addEventListener('DOMContentLoaded', function() {
    const filterButton = document.getElementById('filterButton');
    if (filterButton) {
        filterButton.addEventListener('click', filterByCountry);
    }

    // También puedes hacer que se filtre automáticamente al cambiar el select
    const countryFilter = document.getElementById('countryFilter');
    if (countryFilter) {
        countryFilter.addEventListener('change', filterByCountry);
    }
});

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
				fetch("http://localhost:63152/api/Products")
					.then((response) => response.json())
					.then((data) => {
						const tbody = document.querySelector('tbody');
						tbody.innerHTML = ''; // Limpiar tbody antes de agregar nuevos datos

						data.forEach((o) => {
							let _tr = `<tr>
                            <td>${o.CODIGO}</td>
                            <td>${o.PRODUCTO}</td>
                            <td>${o.DESCRIPCION}</td>
                            <td>${o.UM}</td>
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