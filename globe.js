// globe.js

const width = 800;
const height = 600;

const svg = d3.select("#globe-container").append("svg")
    .attr("width", width)
    .attr("height", height);

const projection = d3.geoOrthographic()
    .scale(300)
    .translate([width / 2, height / 2]);

const path = d3.geoPath(projection);

// Append a sphere to represent the globe
svg.append("path")
    .datum({ type: "Sphere" })
    .attr("class", "sphere")
    .attr("d", path);

// Load world data and draw country borders
d3.json("https://raw.githubusercontent.com/aurashak/aurashak.github.io/main/globe.json")
    .then(data => {
        const countries = topojson.feature(data, data.objects.countries);

        // Append country paths with styling through CSS classes
        svg.selectAll(".country")
            .data(countries.features)
            .enter().append("path")
            .attr("class", "country")
            .attr("d", path);
    });
