GeoBackground = function() {
    var vis = this;

    vis.width = 1000;
    vis.height = 550;

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

        d3.select("#growth").append("img").attr("src", "images/usergrowth.png").attr("width", 500).attr("height", 270);
        d3.select("#top-user").append("img").attr("src", "images/topusers.png").attr("width", 500).attr("height", 270);
    });
}
