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

    vis.cScale = d3.scaleLinear().range([2, 8]);

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

    // Two places out of 207 countires that will cause projection return NaN
    delete vis.year["Isle of Man"];
    delete vis.year["U.S. Minor Outlying Islands"];

    var ks = Object.keys(vis.year);
    ks = ks.slice(1, ks.length - 1);

    vis.displayData = [];


    ks.forEach(p => {
        vis.displayData.push({tagName: p, count: parseInt(vis.year[p])});
    });

    vis.updateVis();
}

UserBundle.prototype.updateVis = function() {
    var vis = this;

    vis.cScale
        .domain(vis.displayData.map(d => d.count));

    var tip = d3.tip()
        .attr("class", "d3-tip")
        .direction("n")
        .html((event, d) => {
            return d.tagName + ": " + d.count;
        });

    vis.geoSvg.call(tip);
    // Draw counties;
    vis.nodes = vis.geoSvg.selectAll(".node").data(vis.displayData);

    vis.nodes
        .enter().append("circle").attr("class", "node")
        .attr("stroke", "orange")
        .attr("fill", "yellow")
        .attr("r", d => {
            return vis.cScale(d.count);
        })
        .attr("cx", d => {
            var thisGeo = vis.geo[d.tagName];
            return vis.projection([thisGeo.lo, thisGeo.la])[0];
        })
        .attr("cy", d => {
            var thisGeo = vis.geo[d.tagName];
            return vis.projection([thisGeo.lo, thisGeo.la])[1];
        })
        .style("fill-opacity", 0.7)
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

    vis.nodes.exit().remove();
    // Draw total users and inactive usrs;
    // Draw top reputation;
}