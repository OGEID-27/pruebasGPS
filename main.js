// Seleccionamos los iconos del DOM
var coordenadas = document.getElementById('coordenadas');
var tiempo_actu = document.getElementById('tiempo_actu');

// Crea el mapa
var map = L.map('map').setView([19.2907, -99.2141], 10);

// Crea la ubicacion usando OPENSTREETMAP
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Segundos 
var tiempo = 5000

// Creamos el contador
var contador = 0
/* USO DE LA API DE GEOLOCALIZACION DE HTML5 ------ PARA ALGUNOS NAVEGADORES NO ESTA DISPONIBLE ESTA API*/
if (!navigator.geolocation) { // Creamos la condicional para saber si el navegador acepta la API
    console.log('Tu navegador no tiene geolocalizacion disponible')
} else {
    // Creamos esta funcion para que se repita la funcion "obtenerPosicion" cada cierto tiempo
    var actualizarMapa = setInterval(() => {
        contador++ // Aumentamos el contador para que asi la funcion no se repita mas de 12 veces
        navigator.geolocation.getCurrentPosition(obtenerPosicion)
        if (contador >= 36) {
            clearInterval(actualizarMapa);// Aparamos la funcion "actualizarMapa"
        }
    }, tiempo);
}

// Variables para los marcadores
var circulo
var previo_marker = null
var linea = null

function obtenerPosicion(posicion) {
    console.log('CONTADOR: ' + contador)

    //console.log(posicion)

    // Obtenemos latitud, longitud y exactud del dispositivo mediante el Navegador
    latitud = posicion.coords.latitude
    longitid = posicion.coords.longitude
    exactitud = posicion.coords.accuracy

    if (circulo) {
        map.removeLayer(circulo)
    }

    // Creamos los marcadores
    var nuevo_marker = L.marker([latitud, longitid])
    circulo = L.circle([latitud, longitid], { radius: exactitud })

    // Pintamos los marcadores en el mapa
    let grupoMarcadores = L.featureGroup([nuevo_marker, circulo]).addTo(map)
    // Figamos el mapa para que se obtenga mejor visibilidad de la ubicacion en tiempo real
    map.fitBounds(grupoMarcadores.getBounds())

    // Si hay un marcador anterior, dibujar una línea desde el marcador anterior al nuevo marcador
    if (previo_marker !== null) {
        if (linea !== null) {
            map.removeLayer(linea);
        }
        linea = L.polyline([previo_marker.getLatLng(), nuevo_marker.getLatLng()], { color: 'red' }).addTo(map);
    }

    // Actualizar el marcador anterior con el nuevo marcador
    previo_marker = nuevo_marker;

    // Imprimimos las Coordenadas en pantalla
    coordenadas.textContent = 'Latitud: ' + latitud + ', ' + 'Longitud: ' + longitid + ', ' + 'Exactitud: ' + exactitud
    tiempo_actu.textContent = 'Tiempo de actualizacion cada ' + tiempo / 1000 + ' segundos... ' + 'Contador: ' + contador

}


