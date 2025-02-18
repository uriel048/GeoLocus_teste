mapboxgl.accessToken = 'pk.eyJ1IjoiZXN0b3BlbmciLCJhIjoiY203NTM2bHJ1MDlvaDJrcThpNDRvdHoweSJ9.XT2Le6CrUG3t4Va8OO-j_Q';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [-74.5, 40], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});