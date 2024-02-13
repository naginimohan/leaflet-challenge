// let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";
// Store our API endpoing as url
let url ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(url).then(function(data){
      // Console log the data retrieved 
  console.log(data);
    // Once e get a response, send the data.features and data.features object to the createFeatures function.
    createFeatures(data.features);
  });
    

  function createFeatures(earthquakeData) {
    // Define the getColor function to assign color based on depth.
    function getColor(depth) {
      if (depth < 10) {
        return '#00FF00';
      } else if (depth < 30) {
        return '#FFFF00';
      } else if (depth < 50) {
        return '#FFA500';
      } else if (depth < 70) {
        return '#FF0000';
      } else if (depth < 90) {
        return '#081d58';
      } else {
        return '#41b6c4';
      }
    }
   
    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place, magnitude, and depth of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }
  
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
     
      pointToLayer: function(feature, latlng) {
        console.log(feature.geometry.coordinates[2]);
        return L.circleMarker(latlng, {
          radius: feature.properties.mag * 5,
          fillColor: getColor(feature.geometry.coordinates[2]),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      onEachFeature: onEachFeature
    });
  
    // Send our earthquakes layer to the createMap function.
    createMap(earthquakes);
  }
  
  function createMap(earthquakes) {
    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create a baseMaps object.
    var baseMaps = {
      "Street Map": street
    };

    // Create an overlay object to hold our overlay.
    var overlayMaps = {
      Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [street, earthquakes]
    });

    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps,{
      collapsed: false
    }).addTo(myMap);

    // Create a legend control
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function(map) {
      var div = L.DomUtil.create('div', 'info legend');
      var depthColors = ['#00FF00', '#FFFF00', '#FFA500', '#FF0000', '#081d58','#41b6c4'];
      // var depthColors = ['#00FF00', '#a1dab4', '#41b6c4', '#2c7fb8', '#253494', '#081d58'];
      var depthLabels = ['0 - 10', '10 - 30', '30 - 50', '50 - 70', '70 - 90', '> 90'];
  
       for (var i = 0; i < depthColors.length; i++) {
        div.innerHTML +=
            '<i style="background:' + depthColors[i] + '; width: 20px; height: 20px; display: inline-block;"></i> ' +
            depthLabels[i] + '<br>';
    }
      return div;
  };
    // Add legend to the map
    legend.addTo(myMap);
  }