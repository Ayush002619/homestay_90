const mapElement = document.getElementById("map");

if (mapElement) {
    const coords = JSON.parse(mapElement.dataset.coordinates);
    const locationName = mapElement.dataset.location;

    const lng = coords[0];   // MongoDB: [lng, lat]
    const lat = coords[1];

    const map = L.map("map").setView([lat, lng], 11);

    L.tileLayer(
        `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${maptoken}`,
        {
            minZoom: 2,
            maxZoom: 20,
            attribution:
                'Powered by <a href="https://www.geoapify.com/">Geoapify</a> | © OpenStreetMap contributors'
        }
    ).addTo(map);

    L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<strong>${locationName}</strong>`)
        .openPopup();
}
