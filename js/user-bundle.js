UserBundle = function(_parentGeoSVG, _projection, _geo, _year) {
    // TODO
    // Add whatever you need into param of this function, besides _parentGeoSVG and _projection function
    // Don't forget to change it in main function too.
    var vis = this;
    
    vis.geoSvg = _parentGeoSVG;
    vis.projection = _projection;
    vis.geo = _geo;
    vis.year = _year;

    vis.initVis();
}

UserBundle.prototype.initVis = function() {
    var vis = this;

    // TODO:
    // besides draw countires directly on geoSVG, we need two new svg
    // one for usr growth and inactive, another one for top reputation

    // Init svg for usr growth
    d3.select("#growth").append("img").attr("src", "images/usergrowth.png").attr("width", 500).attr("height", 270);
    

    // Init svg for top usr
    d3.select("#top-user").append("img").attr("src", "images/topusers.png").attr("width", 500).attr("height", 270);

    vis.wrangleData();
}

UserBundle.prototype.wrangleData = function() {
    var vis = this;

    var ks = Object.keys(vis.year);
    ks = ks.slice(1, ks.length - 1);

    vis.displayData = [];

    ks.forEach(p => {
        vis.displayData.push({name: p, number: parseInt(vis.year[p])});
    });

    console.log(vis.displayData);
    vis.updateVis();
}

UserBundle.prototype.updateVis = function() {
    var vis = this;
    // Draw counties;
    vis.nodes = vis.geoSvg.selectAll(".node")
        .data(vis.displayData)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("fill", "green");

    vis.nodes
        .attr("fill", "green")
        .attr("r", 5)
        .attr("cx", d => {
            var thisGeo = vis.geo[d.name];
            return vis.projection([thisGeo.lo, thisGeo.la])[0];
        })
        .attr("cy", d => {
            var thisGeo = vis.geo[d.name];
            return vis.projection([thisGeo.lo, thisGeo.la])[1];
        });

    vis.nodes.exit().remove();
    // Draw total users and inactive usrs;
    // Draw top reputation;
}