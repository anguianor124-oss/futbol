
var pedido = {
    nino: 0,
    ad: 0,
    psa: 550,
    psn: 380,
    psola: 350,
    psoln: 280,
    dinero: 0,
    personas: 0,

    calcular: function() {
        pedido.ad = Number(document.getElementById("adultos").value);
        pedido.nino = Number(document.getElementById("ninos").value);

        var zona = document.getElementById("zona").value;

        // Calcular precio
        if (zona == "sol") {
            pedido.dinero = (pedido.ad * pedido.psola) +
                            (pedido.nino * pedido.psoln);
        } else {
            pedido.dinero = (pedido.ad * pedido.psa) +
                            (pedido.nino * pedido.psn);
        }

        // Calcular IVA y total
        var subtotal = pedido.dinero;
        var iva = subtotal * 0.16;
        var total = subtotal + iva;

        // Contar personas
        pedido.personas = pedido.ad + pedido.nino;

        // Mostrar resultados
        document.getElementById("subtotal").innerHTML = subtotal.toFixed(2);
        document.getElementById("iva").innerHTML = iva.toFixed(2);
        document.getElementById("total").innerHTML = total.toFixed(2);
        document.getElementById("personas").innerHTML = pedido.personas;
    }
};

// Guardar
function guardar() {
    var cliente = {
        rfc: document.getElementById("rfc").value,
        nombre: document.getElementById("nombre").value,
        zona: document.getElementById("zona").value,
        adultos: document.getElementById("adultos").value,
        ninos: document.getElementById("ninos").value,
        total: pedido.dinero
    };

    localStorage.setItem("cliente", JSON.stringify(cliente));
    alert("Datos guardados");
}

// Recuperar
function recuperar() {
    var cliente = JSON.parse(localStorage.getItem("cliente"));

    if (cliente != null) {
        document.getElementById("rfc").value = cliente.rfc;
        document.getElementById("nombre").value = cliente.nombre;
        document.getElementById("zona").value = cliente.zona;
        document.getElementById("adultos").value = cliente.adultos;
        document.getElementById("ninos").value = cliente.ninos;

        pedido.calcular();
    } else {
        alert("No hay datos guardados");
    }
}


function generarTicket() {
    pedido.calcular();

    var nombre = document.getElementById("nombre").value;
    var rfc = document.getElementById("rfc").value;
    var zona = document.getElementById("zona").value;

    var adultos = pedido.ad;
    var ninos = pedido.nino;

    var subtotalAdultos;
    var subtotalNinos;

    if (zona == "sol") {
        subtotalAdultos = adultos * pedido.psola;
        subtotalNinos = ninos * pedido.psoln;
    } else {
        subtotalAdultos = adultos * pedido.psa;
        subtotalNinos = ninos * pedido.psn;
    }

    var subtotal = subtotalAdultos + subtotalNinos;
    var iva = subtotal * 0.16;
    var total = subtotal + iva;
    var personas = adultos + ninos;

    var zonaTexto;

    if (zona == "sol") {
        zonaTexto = "Zona Sol";
    } else {
        zonaTexto = "Zona Sombra";
    }

    var ventana = window.open("", "Ticket", "width=650,height=750");

    if (ventana == null) {
        alert("Permite las ventanas emergentes");
        return;
    }

    var documento = ventana.document;

    documento.body.innerHTML = "";

    // Fondo de toda la pantalla
    documento.body.style.backgroundColor = "#d9dedb";
    documento.body.style.fontFamily = "Arial";
    documento.body.style.margin = "0";
    documento.body.style.minHeight = "100vh";

    // Contenedor que centra todo
    var contenido = documento.createElement("div");

    contenido.style.width = "100%";
    contenido.style.minHeight = "100vh";
    contenido.style.display = "flex";
    contenido.style.flexDirection = "column";
    contenido.style.alignItems = "center";
    contenido.style.justifyContent = "center";
    contenido.style.textAlign = "center";
    contenido.style.boxSizing = "border-box";
    contenido.style.padding = "20px";

    documento.body.appendChild(contenido);

    var titulo = documento.createElement("h1");
    titulo.textContent = "Pantalla de Resultados";
    titulo.style.color = "#245b3b";
    contenido.appendChild(titulo);

    var resumen = documento.createElement("h2");
    resumen.textContent = "Resumen de Compra";
    resumen.style.color = "#245b3b";
    contenido.appendChild(resumen);

    function agregarLinea(texto, valor) {
        var parrafo = documento.createElement("p");
        var negrita = documento.createElement("b");

        negrita.textContent = texto;
        parrafo.appendChild(negrita);
        parrafo.appendChild(documento.createTextNode(" " + valor));

        parrafo.style.fontSize = "18px";
        parrafo.style.color = "#333333";
        parrafo.style.margin = "8px";

        contenido.appendChild(parrafo);
    }

    agregarLinea("Nombre:", nombre);
    agregarLinea("RFC:", rfc);

    var linea1 = documento.createElement("hr");
    linea1.style.width = "300px";
    linea1.style.borderColor = "#23834b";
    contenido.appendChild(linea1);

    agregarLinea("Zona asignada:", zonaTexto);
    agregarLinea("Total de personas:", personas);
    agregarLinea("Adultos:", adultos + " (Subtotal: $" + subtotalAdultos + ")");
    agregarLinea("Niños:", ninos + " (Subtotal: $" + subtotalNinos + ")");

    var linea2 = documento.createElement("hr");
    linea2.style.width = "300px";
    linea2.style.borderColor = "#23834b";
    contenido.appendChild(linea2);

    agregarLinea("Subtotal:", "$" + subtotal.toFixed(2));
    agregarLinea("IVA:", "$" + iva.toFixed(2));
    agregarLinea("Total a pagar:", "$" + total.toFixed(2));

    var imprimir = documento.createElement("button");
    imprimir.textContent = "Imprimir ticket";
    imprimir.style.backgroundColor = "#23834b";
    imprimir.style.color = "white";
    imprimir.style.padding = "10px 15px";
    imprimir.style.border = "none";
    imprimir.style.borderRadius = "5px";
    imprimir.style.cursor = "pointer";
    imprimir.style.marginTop = "15px";

    imprimir.onclick = function() {
        ventana.print();
    };

    contenido.appendChild(imprimir);

    documento.title = "Ticket de compra";
}
