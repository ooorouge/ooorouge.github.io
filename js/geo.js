GeoBackground = function() {
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

    d3.json("data/world-110m.json").then(data => {

        // Convert TopoJSON to GeoJSON (target object = 'states')
        console.log("drawing...");
        var world = topojson.feature(data, data.objects.countries).features

        // Render the U.S. by using the path generator
        vis.svg.selectAll("path")
            .data(world)
            .enter()
            .append("path")
            .attr("d", path);
    });
}
