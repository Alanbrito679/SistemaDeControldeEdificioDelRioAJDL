// =====================================
// URL DE TU APPS SCRIPT
// =====================================

const URL_APPS_SCRIPT =
"https://script.google.com/macros/s/AKfycbzQXWSBYKLXHq2LLR0idTuFhLo9bD1KgEbxjr14youQp7R7CpEsQNGixVwA6cavFKjPTw/exec";

// =====================================
// VARIABLES GLOBALES
// =====================================

let datosDepartamentos = {};

// =====================================
// CARGAR AL INICIAR
// =====================================

window.onload = () => {

    cargarDepartamentos();

};

// =====================================
// OBTENER DATOS
// =====================================

async function cargarDepartamentos(){

    try{

        const respuesta =
        await fetch(URL_APPS_SCRIPT);

        const datos =
        await respuesta.json();

        datosDepartamentos = datos;

        mostrarDepartamentos(datos);

    }
    catch(error){

        console.error(error);

        alert(
        "Error al conectar con Google Sheets"
        );

    }

}

// =====================================
// CREAR TARJETAS
// =====================================

function mostrarDepartamentos(datos){

    const contenedor =
    document.getElementById(
    "contenedorDepartamentos"
    );

    contenedor.innerHTML = "";

    Object.keys(datos).forEach(id => {

        const depto = datos[id];

        let claseEstado = "";

        if(
            depto.estadoSheet
            .toLowerCase()
            .includes("día")
        ){

            claseEstado =
            "estado-verde";

        }
        else if(
            depto.estadoSheet
            .toLowerCase()
            .includes("pend")
        ){

            claseEstado =
            "estado-amarillo";

        }
        else{

            claseEstado =
            "estado-rojo";

        }

        contenedor.innerHTML += `

        <div class="col-lg-3 col-md-4 col-sm-6">

            <div
            class="card-departamento"
            onclick="abrirDepartamento('${id}')"
            >

                <div class="numero-depto">

                    ${id}

                </div>

                <div class="nombre-inquilino">

                    ${depto.inquilino}

                </div>

                <div
                class="estado ${claseEstado}"
                >

                    ${depto.estadoSheet}

                </div>

            </div>

        </div>

        `;

    });

}

// =====================================
// ABRIR MODAL
// =====================================

function abrirDepartamento(id){

    const depto =
    datosDepartamentos[id];

    document.getElementById(
    "idDepto"
    ).value = id;

    document.getElementById(
    "modalDepto"
    ).innerText =
    "Departamento " + id;

    document.getElementById(
    "modalInquilino"
    ).innerText =
    depto.inquilino;

    document.getElementById(
    "modalCorreo"
    ).innerText =
    depto.correo || "-";

    document.getElementById(
    "modalTelefono"
    ).innerText =
    depto.fono || "-";

    document.getElementById(
    "modalAlquiler"
    ).innerText =
    "$ " + depto.alquiler;

    document.getElementById(
    "modalMantenimiento"
    ).innerText =
    "$ " + depto.mantenimiento;

    document.getElementById(
    "modalAgua"
    ).innerText =
    "$ " + depto.agua;

    document.getElementById(
    "modalElectricidad"
    ).innerText =
    "$ " + depto.electricity;

    const total =

        Number(depto.alquiler) +
        Number(depto.mantenimiento) +
        Number(depto.agua) +
        Number(depto.electricity);

    document.getElementById(
    "modalTotal"
    ).innerText =
    "$ " + total;

    document.getElementById(
    "modalEstado"
    ).innerText =
    depto.estadoSheet;

    const modal =
    new bootstrap.Modal(
        document.getElementById(
        "modalDepartamento"
        )
    );

    modal.show();

}

// =====================================
// REGISTRAR PAGO
// =====================================

document.addEventListener(
"DOMContentLoaded",
function(){

const formulario =
document.getElementById(
"formPago"
);

if(formulario){

formulario.addEventListener(
"submit",
async function(e){

e.preventDefault();

const archivo =
document.getElementById(
"archivoPago"
).files[0];

if(!archivo){

alert(
"Seleccione un comprobante"
);

return;

}

const lector =
new FileReader();

lector.onload =
async function(){

const base64 =
lector.result
.split(",")[1];

const datos = {

idDepto:
document.getElementById(
"idDepto"
).value,

montoEnviado:
document.getElementById(
"montoPago"
).value,

nombreArchivo:
archivo.name,

tipoMime:
archivo.type,

datosBase64:
base64

};

try{

const respuesta =
await fetch(

URL_APPS_SCRIPT,

{

method:"POST",

body:
JSON.stringify(
datos
)

}

);

const resultado =
await respuesta.json();

alert(
resultado.mensaje
);

cargarDepartamentos();

}
catch(error){

console.error(error);

alert(
"Error al registrar pago"
);

}

};

lector.readAsDataURL(
archivo
);

});

}

});