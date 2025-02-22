function voltarPagina() {
    window.history.back();
}

window.onload = function() {
    // token Mapbox
    mapboxgl.accessToken = 'pk.eyJ1IjoiZXN0b3BlbmciLCJhIjoiY203NTM2bHJ1MDlvaDJrcThpNDRvdHoweSJ9.XT2Le6CrUG3t4Va8OO-j_Q';

    // parametros da url e coordenadas  
    var params = new URLSearchParams(window.location.search);
    var lat = params.get('latitude');
    var lon = params.get('longitude');

    // testa coordenadas
    if (!lat || !lon) {
        alert("Coordenadas inválidas! Certifique-se de fornecer latitude e longitude.");
        return;
    }

    // converte as coordenadas para float e troca as , por .
    var latitude = parseFloat(lat.replace(/,/g, '.'));
    var longitude = parseFloat(lon.replace(/,/g, '.'));

    var pontoFinal = [longitude, latitude];

    // quadra/lote da url e monta texto
    var quadra = params.get('quadra') || 'Desconhecida';
    var lote = params.get('lote') || 'Desconhecido';
    var descricao = `QUADRA: ${quadra} - LOTE: ${lote}`;
    document.getElementById("top-bar_text").innerText = descricao;

    // carrega o mapa
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/estopeng/cm7570g5e002101s06iwcaqld',
        center: pontoFinal,
        zoom: 17
    });

    // controles navegacao
    map.addControl(new mapboxgl.NavigationControl());

    // add ponto fixo
    var marker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(pontoFinal)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(descricao))
        .addTo(map);
    // abre o popup
    marker.togglePopup();

    // animacao ponto fixo
    map.on('load', function () {
        map.flyTo({
            center: pontoFinal,
            zoom: 19,
            speed: 0.5,
            curve: 1,
            essential: true
        });
    });

    // botao pra localizar
    setTimeout(function() {
        document.getElementById("localizar").style.display = "flex";
    }, 4000);

    // centraliza mapa
    document.getElementById("localizar").addEventListener("click", function() {
        if (userCoords) {
            var bounds = new mapboxgl.LngLatBounds();
            bounds.extend(userCoords);
            bounds.extend(pontoFinal);
    
            map.fitBounds(bounds, {
                padding: 50,
                maxZoom: 17,
                duration: 1000
            });
        } else {
            alert("Aguardando localização do usuário...");
        }
    });    
    
    var userCoords = null; // Armazena a posição do usuário

    // Atualiza a posição do usuário sempre que mudar
    function updateUserLocation(position) {
        userCoords = [position.coords.longitude, position.coords.latitude]; // Salva coordenadas atualizadas

        var userSource = map.getSource('user-location');
        var geoJsonData = {
            type: "FeatureCollection",
            features: [{
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: userCoords
                }
            }]
        };

        if (userSource) {
            userSource.setData(geoJsonData);
        } else {
            map.addSource('user-location', { type: 'geojson', data: geoJsonData });
            map.addLayer({
                id: 'user-location-point',
                type: 'circle',
                source: 'user-location',
                paint: {
                    'circle-radius': 10,
                    'circle-color': '#ffffff',
                    'circle-stroke-color': '#007AFF',
                    'circle-stroke-width': 3
                }
            });
        }
    }

    // Ativa rastreamento contínuo
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            updateUserLocation,
            function(error) {
                console.error("Erro ao obter localização: ", error);
                alert("Erro ao obter localização. Certifique-se de que a geolocalização está ativada.");
            },
            { enableHighAccuracy: true }
        );
    } else {
        alert("Geolocalização não suportada no seu navegador.");
    }
};