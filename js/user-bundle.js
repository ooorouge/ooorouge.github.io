UserBundle = function(_parentSVG, _projection) {
    var vis = this;
    
    vis.svg = _parentSVG;
    vis.projection = _projection;
    vis.initVis();
}

UserBundle.prototype.initVis = function() {
    var vis = this;

    vis.wrangleData();
}

UserBundle.prototype.wrangleData = function() {
    var vis = this;

    vis.updateVis();
}

UserBundle.prototype.updateVis = function() {
    var vis = this;

}