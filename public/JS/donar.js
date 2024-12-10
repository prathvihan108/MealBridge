document.addEventListener("DOMContentLoaded", () => {
	const numProductsInput = document.getElementById("numProducts");
	const productRowsContainer = document.getElementById("productRows");

	// Function to create a product row
	function createProductRow(index) {
		return `
            <div class="row product-row">
                <div class="mb-3 col-md-4">
                    <label for="itemName-${index}" class="form-location">Item ${index}</label>
                    <input
                        id="itemName-${index}"
                        name="products[${index}][itemName]"
                        placeholder=""
                        type="text"
                        class="form-control"
                        required
                    />
                </div>
                <div class="mb-2 col-md-4">
                    <label for="quantity-${index}" class="form-country">Quantity</label>
                    <input
                        id="quantity-${index}"
                        name="products[${index}][quantity]"
                        placeholder=""
                        type="text"
                        class="form-control"
                        required
                    />
                </div>
                <div class="mb-2 col-md-4">
                    <label for="expiresAt-${index}" class="form-country">Expires At</label>
                    <input
                        id="expiresAt-${index}"
                        name="products[${index}][expireDate]"
                        type="date"
                        class="form-control"
                        required
                    />
                </div>
            </div>
			<hr />`;

	}

	// Event listener to generate rows based on the number input
	numProductsInput.addEventListener("input", () => {
		const numProducts = parseInt(numProductsInput.value, 10);

		// Clear existing rows
		productRowsContainer.innerHTML = "";

		if (numProducts > 0) {
			for (let i = 1; i <= numProducts; i++) {
				productRowsContainer.innerHTML += createProductRow(i);
			}
		}
	});
});

// Set your Mapbox access token
mapboxgl.accessToken = mapToken;

// Initialize the map
const map = new mapboxgl.Map({
	container: "map", // The ID of the map container in the HTML
	style: "mapbox://styles/mapbox/streets-v11", // Map style
	center: [77.7139906, 12.9675794], // Default coordinates [longitude, latitude]
	zoom: 13,
});

// Create a marker (initially placed at a default location)
const marker = new mapboxgl.Marker({ draggable: true })
	.setLngLat([77.7140693, 12.9677017]) // Initial position
	.addTo(map);

// Display latitude and longitude values on the page
const displayLocation = (lng, lat) => {
	document.getElementById("latitude").value = lat;
	document.getElementById("longitude").value = lng;
};
displayLocation(77.7140693, 12.9677017);

// Update location when the marker is dragged
marker.on("dragend", function () {
	const lngLat = marker.getLngLat();
	displayLocation(lngLat.lng, lngLat.lat);
});

// Allow users to click on the map to move the marker
map.on("click", function (e) {
	const { lng, lat } = e.lngLat;
	marker.setLngLat([lng, lat]); // Move the marker
	displayLocation(lng, lat); // Update location details
});

// Create a search control (for geocoding)
const geocoder = new MapboxGeocoder({
	accessToken: mapboxgl.accessToken,
	mapboxgl: mapboxgl,
	marker: false, // Disable the default marker
});

// Add geocoder to the map
map.addControl(geocoder);

// Handle location search and move the marker
geocoder.on("result", function (e) {
	console.log("Search result:", e.result); // Log the search result to check the selected location

	// Access the coordinates from the 'center' array
	const [lng, lat] = e.result.center;

	console.log(`Selected location: Longitude = ${lng}, Latitude = ${lat}`); // Log the coordinates for debugging

	// Move the marker to the selected location
	marker.setLngLat([lng, lat]);

	// Fly to the selected location
	map.flyTo({ center: [lng, lat], zoom: 13 });

	// Update location details in the input fields
	displayLocation(lng, lat);
});

// Toggle map visibility on button click
const mapContainer = document.getElementById("map-container");
const chooseLocationBtn = document.getElementById("choose-location-btn");
const overlay = document.getElementById("overlay");
const selectLoc = document.getElementById("select-loc");

selectLoc.addEventListener("click", (e) => {
	e.preventDefault();
	overlay.style.display = "none";
	mapContainer.style.display = "none";
	chooseLocationBtn.style.display = "block";
});

chooseLocationBtn.addEventListener("click", (e) => {
	e.preventDefault();
	mapContainer.style.display = "flex";
	mapContainer.style.flexDirection = "column";
	mapContainer.style.gap = "0.9rem";
	map.resize(); // Ensure the map renders correctly
	chooseLocationBtn.style.display = "none";
	overlay.style.display = "block"; // Show the overlay
});

// Hide map when clicking outside
document.addEventListener("click", (event) => {
	if (
		!mapContainer.contains(event.target) &&
		event.target !== chooseLocationBtn
	) {
		mapContainer.style.display = "none"; // Hide the map
		chooseLocationBtn.style.display = "block";
		overlay.style.display = "none";
	}
});
