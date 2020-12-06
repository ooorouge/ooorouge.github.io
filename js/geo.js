GeoBackground = function(worldData) {
    var vis = this;

    vis.width = $(".worldmap").width();
    vis.height = $(".worldmap").height();

    vis.svg = d3.select("#geomap").append("svg")
        .attr("width", vis.width)
        .attr("height", vis.height)

    vis.projection = d3.geoMercator()
        .translate([vis.width / 2, vis.height / 2]);

    path = d3.geoPath()
        .projection(vis.projection);

    console.log("drawing...");
    var world = topojson.feature(worldData, worldData.objects.countries).features

    // Render the U.S. by using the path generator
    vis.svg.append("g")
        .attr("id", "background-map")
        .attr("transform", "translate(0,0)")
        .selectAll("path")
        .data(world)
        .enter()
        .append("path")
        .attr("d", path);
}
