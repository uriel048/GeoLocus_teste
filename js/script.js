window.addEventListener('load', () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZXN0b3BlbmciLCJhIjoiY203NTM2bHJ1MDlvaDJrcThpNDRvdHoweSJ9.XT2Le6CrUG3t4Va8OO-j_Q';

    const params = new URLSearchParams(window.location.search);
    const latitude = parseFloat(params.get('latitude')?.replace(',', '.'));
    const longitude = parseFloat(params.get('longitude')?.replace(',', '.'));
    const pontoFinal = [longitude, latitude];

    const quadra = params.get('quadra') || 'Desconhecida';
    const lote = params.get('lote') || 'Desconhecido';
    const descricao = `QUADRA: ${quadra}, LOTE: ${lote}`;

    try {
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/estopeng/cm7570g5e002101s06iwcaqld',
            center: pontoFinal,
            zoom: 17
        });

        map.addControl(new mapboxgl.NavigationControl());

        new mapboxgl.Marker({
                color: 'red'
            })
            .setLngLat(pontoFinal)
            .setPopup(new mapboxgl.Popup({
                offset: 25
            }).setText(descricao))
            .addTo(map);

        map.on('load', () => {
            map.flyTo({
                center: pontoFinal,
                zoom: 19,
                speed: 0.5,
                curve: 1,
                essential: true
            });
        });

        function updateUserLocation(position) {
            const userCoords = [position.coords.longitude, position.coords.latitude];

            if (map.getSource('user-location')) {
                map.getSource('user-location').setData({
                    type: "FeatureCollection",
                    features: [{
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: userCoords
                        }
                    }]
                });
            } else {
                map.addSource('user-location', {
                    type: 'geojson',
                    data: {
                        type: "FeatureCollection",
                        features: [{
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: userCoords
                            }
                        }]
                    }
                });

                map.addLayer({
                    id: 'user-location-accuracy',
                    type: 'circle',
                    source: 'user-location',
                    paint: {
                        'circle-radius': {
                            base: 2,
                            stops: [
                                [12, position.coords.accuracy / 2],
                                [22, position.coords.accuracy]
                            ]
                        },
                        'circle-color': '#007AFF',
                        'circle-opacity': 0.3
                    }
                });

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

        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(updateUserLocation, (error) => {
                console.error("Erro na geolocalização:", error); // Log do erro para depuração
                alert("Erro ao obter a localização. Verifique as permissões e tente novamente."); // Mensagem de erro amigável
            }, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }); // Adicione timeout e maximumAge
        } else {
            alert("Geolocalização não suportada no seu navegador.");
        }
    } catch (error) {
        console.error("Erro ao inicializar o mapa:", error);
        alert("Ocorreu um erro ao carregar o mapa. Tente novamente mais tarde.");
    }
});