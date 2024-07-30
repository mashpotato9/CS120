let map;
let directionsService;
let directionsRenderer;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 42.4085253, lng: -71.1183164 },
        zoom: 15,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById('directions-panel'));
}

function calculateRoute() {
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;
    const waypointString = document.getElementById('waypoints').value;
    const waypoints = waypointString.split(',').map(location => ({
        location: location.trim(),
        stopover: true
    }));

    if (!start || !end) {
        alert('Both start and end locations are required');
        return;
    }

    const request = {
        origin: start,
        destination: end,
        waypoints: waypoints,
        travelMode: 'DRIVING',
    };

    directionsService.route(request, (result, status) => {
        if (status == 'OK') {
            directionsRenderer.setDirections(result);
        } else {
            alert('Directions request failed due to ' + status);
        }
    });
}
