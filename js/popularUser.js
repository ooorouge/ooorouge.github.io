PopularUserChart = function(parentElement) {
    var vis = this;
    vis.parentElement = parentElement;
    vis.initVis();
}

PopularUserChart.prototype.initVis = function() {
    var vis = this;

    vis.svgMargin = {top: 20, bottom: 20, left: 70, right: 20};
    vis.svgWidth = 380 - vis.svgMargin.left - vis.svgMargin.right;
    vis.svgHeight = 200 - vis.svgMargin.top - vis.svgMargin.bottom;
    vis.svg = d3.select("#" + vis.parentElement)
        .append("svg")
        .attr("width", vis.svgWidth + vis.svgMargin.left + vis.svgMargin.right)
        .attr("height", vis.svgHeight + vis.svgMargin.top + vis.svgMargin.bottom)
	.append("g")
        .attr("transform", "translate(" + vis.svgMargin.left + "," + vis.svgMargin.top + ")")

    vis.x = d3.scaleLinear()
	.domain([0, 142000])
	.range([0, vis.svgWidth]);
    vis.xAxis = d3.axisBottom(vis.x);
    
    vis.y = d3.scaleBand().range([0, vis.svgHeight]).paddingInner(0.2);
    
    vis.svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + vis.svgHeight + ")");

    vis.svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(0, 0)");

    vis.svg.append("text")
	.attr("class", "label")
	.attr("x", vis.svgWidth - 15)
	.attr("y", vis.svgHeight - 3)
	.attr("fill", "black")
	.attr("font-size", 12)
	.attr("font-weight", "normal")
	.attr("text-anchor", "middle")
	.text("Reputation");
}

PopularUserChart.prototype.wrangleData = function(year) {
    var vis = this;
    d3.json("data/rep" + year + ".json")
	.then(data => {
	    vis.data = data;
	    vis.updateVis();
	})
}

PopularUserChart.prototype.updateVis = function() {
    var vis = this;

    vis.y.domain(vis.data.map(d => d.name));
    
    vis.yAxis = d3.axisLeft(vis.y);

    let rects = vis.svg.selectAll("rect")
	.data(vis.data, d => d.name);
    
    rects.enter()
	.append("rect")
	.attr("height", vis.y.bandwidth)
	.attr("x", 1)
	.attr("y", d => vis.y(d.name))
	.transition()
	.duration(300)
	.attr("width", d => vis.x(d.rep))
	.attr("fill", "rgba(82, 133, 236)")
	.attr("stroke", "rgb(199, 51, 255, 0.4)");

    rects.transition()
	.duration(300)
	.attr("width", d => vis.x(d.rep))
	.attr("y", d => vis.y(d.name));

    rects.exit()
	.remove();

    vis.svg.select(".x-axis").call(vis.xAxis);
    vis.svg.select(".y-axis")
	.transition()
	.duration(300)
	.call(vis.yAxis);

    //vis.svg.append("text").attr("x", vis.svgWidth-100).attr("y", vis.svgHeight-100).attr("fill", "black").text("Reputation");
}
