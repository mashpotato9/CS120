let map;
let directionsService;
let directionsRenderer;
let geocoder;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 42.4085253, lng: -71.1183164 },
        zoom: 15,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    geocoder = new google.maps.Geocoder();

    directionsRenderer.setMap(map);
    directionsRenderer.setPanel(document.getElementById('directions-panel'));
}

function geocodeAddress(address, callback) {
    console.log("Geocoding address:", address);
    if (!address) {
        console.error('Geocode error: Empty address input');
        return;
    }
    geocoder.geocode({ 'address': address }, function(results, status) {
        console.log("Geocode result status for", address, ":", status);
        if (status === 'OK') {
            callback(results[0].geometry.location);
        } else {
            console.error('Geocode error:', status);
            console.error('Address attempted:', address);
            alert('Geocode was not successful for the address: ' + address + '. Reason: ' + status);
        }
    });
}

function calculateRoute() {
    const start = document.getElementById('start').value.trim();
    const end = document.getElementById('end').value.trim();
    const waypointString = document.getElementById('waypoints').value.trim();
    
    console.log("Start:", start);
    console.log("End:", end);
    console.log("Waypoints:", waypointString);

    if (!start || !end) {
        alert('Both start and end locations are required');
        return;
    }

    const waypoints = waypointString ? waypointString.split(',').map(location => ({
        location: location.trim(),
        stopover: true
    })).filter(wp => wp.location !== "") : [];

    geocodeAddress(start, function(startLocation) {
        geocodeAddress(end, function(endLocation) {
            if (waypoints.length === 0) {
                makeDirectionsRequest(startLocation, endLocation, []);
            } else {
                let processedWaypoints = 0;
                const validWaypoints = [];

                waypoints.forEach(waypoint => {
                    geocodeAddress(waypoint.location, function(waypointLocation) {
                        validWaypoints.push({
                            location: waypointLocation,
                            stopover: true
                        });
                        processedWaypoints++;
                        if (processedWaypoints === waypoints.length) {
                            makeDirectionsRequest(startLocation, endLocation, validWaypoints);
                        }
                    });
                });
            }
        });
    });
}

function makeDirectionsRequest(start, end, waypoints) {
    const request = {
        origin: start,
        destination: end,
        waypoints: waypoints,
        travelMode: 'DRIVING',
    };

    directionsService.route(request, (result, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);
        } else {
            alert('Directions request failed due to ' + status);
        }
    });
}

