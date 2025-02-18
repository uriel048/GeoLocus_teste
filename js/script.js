mapboxgl.accessToken = 'pk.eyJ1IjoiZXN0b3BlbmciLCJhIjoiY203NTM2bHJ1MDlvaDJrcThpNDRvdHoweSJ9.XT2Le6CrUG3t4Va8OO-j_Q';
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/estopeng/cm7570g5e002101s06iwcaqld',
            center: [-28.603619, -49.321768], // starting position [lng, lat]. Note that lat must be set between -90 and 90
            zoom: 17 // starting zoom
        });

// Atualiza localização do usuário
function updateUserLocation(position) {
    const userCoords = [position.coords.longitude, position.coords.latitude];
    const userSource = map.getSource('user-location');
    
    const geoJsonData = {
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
        id: 'user-location-accuracy',
        type: 'circle',
        source: 'user-location',
        paint: {
          'circle-radius': {
            base: 2,
            stops: [[12, position.coords.accuracy / 2], [22, position.coords.accuracy]]
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

  // Ativa geolocalização
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(updateUserLocation, console.error, { enableHighAccuracy: true });
  } else {
    alert("Geolocalização não suportada no seu navegador.");
  }