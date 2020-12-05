PostBundle = function(tagForceChart, edgeBundlingChart) {
    // Add whatever param you need to this function
    // Don't forget to change it in main function too.
    var self = this;
    self.tagForceChart = tagForceChart;
    self.edgeBundlingChart = edgeBundlingChart;
    self.initVis();
}

PostBundle.prototype.initVis = function() {
    var vis = this;

    // TODO:
    // Init SVG for bubble chart

    // Init SVG for connection

    // Init SVG for trends

    vis.wrangleData();
}

PostBundle.prototype.wrangleData = function() {
    var vis = this;

    vis.updateVis();
}

PostBundle.prototype.updateVis = function() {
    var vis = this;
    // draw SVG for bubble chart

    // draw SVG for connection

    // draw SVG for trends
}
