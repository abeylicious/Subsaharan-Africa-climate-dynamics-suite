// Defined Point Coordinates [Longitude, Latitude] of study areas(Maiduguri and Lagos)
var maiduguriPoint = ee.Geometry.Point([13.1500, 11.8333]); // Maiduguri City
var lagosPoint = ee.Geometry.Point([3.3792, 6.5244]);       // Lagos City
print('Maiduguri Point:', maiduguriPoint);
print('Lagos Point:', lagosPoint);

Map.centerObject(lagosPoint, 6);
Map.addLayer(maiduguriPoint, {color: 'red'}, 'Maiduguri Point');
Map.addLayer(lagosPoint, {color: 'blue'}, 'Lagos Point');

// Loaded TerraClimate & filtered out images of the last 20 years
var terraClimate20 = ee.ImageCollection('IDAHO_EPSCOR/TERRACLIMATE')
                     .filter(ee.Filter.date('2006-07-29', '2026-07-30'));

// Created a function to isolate the maxtemp, mintemp and precipitation bands
var prepClimate = function(image) {
  var maxTempC = image.select('tmmx').multiply(0.1).rename('temp_max_c');
  var minTempC = image.select('tmmn').multiply(0.1).rename('temp_min_c');
  var precip = image.select('pr').rename('precipitation_mm');
  return image.addBands([maxTempC, minTempC, precip]);
};
// Mapping the function on the terraClimate20 image collection
var climateData = terraClimate20.map(prepClimate);

// Creating an average temperature chart (point reduction) for each image for 20years
var maiduguriTempChart = ui.Chart.image.series({
  imageCollection: climateData.select(['temp_max_c', 'temp_min_c']),
  region: maiduguriPoint, // <-- Point geometry passed directly here
  reducer: ee.Reducer.mean(), // Returns the value of the grid cell intersecting the point
  scale: 4638.3
}).setOptions({
  title: 'Maiduguri City Monthly Temperature (Point Extraction)',
  hAxis: {title: 'Date', format: 'YYYY-MMM'},
  vAxis: {title: 'Temperature (°C)'},
  lineWidth: 2,
  pointSize: 3,
  series: {
    0: {color: '#d95f02', labelInLegend: 'Max Temp (°C)'},
    1: {color: '#7570b3', labelInLegend: 'Min Temp (°C)'}
  }
});

print(maiduguriTempChart);

// 4. Lagos Precipitation Chart (Point Reduction)
  var lagosPrecipChart = ui.Chart.image.series({
  imageCollection: climateData.select('precipitation_mm'),
  region: lagosPoint, // <-- Point geometry passed directly here
  reducer: ee.Reducer.mean(),
  scale: 4638.3
}).setOptions({
  title: 'Lagos City Monthly Precipitation (Point Extraction)',
  hAxis: {title: 'Date', format: 'YYYY-MMM'},
  vAxis: {title: 'Precipitation (mm)'},
  lineWidth: 2,
  pointSize: 3,
  series: {
    0: {color: '#1f78b4', labelInLegend: 'Precipitation (mm)'}
  }
});

print(lagosPrecipChart); 

