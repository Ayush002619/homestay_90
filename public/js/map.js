const myAPIKey = mytoken;
console.log(mapcoordinate);
const lat = 12.9716;
const lng = 77.5946;

const map = L.map("my-map").setView([lat, lng], 11);

L.tileLayer(
    `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${myAPIKey}`,
    {
        maxZoom: 18,
        attribution:
            'Powered by <a href="https://www.geoapify.com/">Geoapify</a> | © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }
).addTo(map);

L.marker([lat, lng])
    .addTo(map)
    .bindPopup("<strong>Bengaluru, Karnataka, India</strong>")
    .openPopup();

