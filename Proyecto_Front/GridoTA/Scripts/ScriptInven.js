function GetSolicitante() {
    fetch("http://localhost:63152/api/Inventory")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
  
        const _txtTipo = document.getElementById("txtTipo");
  
        data.forEach((o) => {
          const option = document.createElement("option");
          option.value = o.Tipo;
          option.text = o.Tipo;
          _txtTipo.appendChild(option);
        });
      });
  }