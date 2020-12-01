UserBundle = function(_parentGeoSVG, _projection) {
    // TODO
    // Add whatever you need into param of this function, besides _parentGeoSVG and _projection function
    // Don't forget to change it in main function too.
    var vis = this;
    
    vis.geoSvg = _parentGeoSVG;

    vis.projection = _projection;
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

    vis.updateVis();
}

UserBundle.prototype.updateVis = function() {
    var vis = this;
    // Draw counties;
    // Draw total users and inactive usrs;
    // Draw top reputation;
}