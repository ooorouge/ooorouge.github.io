function TagForceChart(parentElement) {
    // Add whatever param you need to this function
    // Don't forget to change it in main function too.
    let vis = this;
    vis.parentElement = parentElement;
    vis.initVis();
}

TagForceChart.prototype.initVis = function() {
    let vis = this;

    vis.margin = {top: 10, right: 20, bottom: 30, left: 20};
    vis.height = 600;
    vis.width = 600;

    // generate the canvas
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width",vis.width + vis.margin.left + vis.margin.right)
        .attr("height",vis.height + vis.margin.top + vis.margin.bottom)
	.append("g")
	.attr("transform", "translate(" + vis.margin.left + ", " + vis.margin.top + ")");

    // generate the scaler for radius
    vis.rScale = d3.scaleLinear()
	.rangeRound([0, 100]);
}

TagForceChart.prototype.wrangleData = function() {
    let vis = this;

    vis.updateVis();
}

TagForceChart.prototype.updateVis = function(data) {
    let vis = this;
    vis.data = data;

    // update the range of the rScale
    vis.rScale
//	.domain([0, 270000]);
    	.domain([0, d3.max(vis.data.nodes, d => d.count)]);
    
    // set the simulation
    let force = d3.forceSimulation(vis.data.nodes)
	.force("charge", d3.forceManyBody().strength(8))
        .force("collide", d3.forceCollide().radius(d => vis.rScale(d.count) + 0.5))
        .force("center", d3.forceCenter().x(vis.width/2).y(vis.height/2));

    // add tooltip for the circles
    let tip = d3.tip()
	.attr("class", "d3-tip")
	.direction("n")
	.offset([-5, 0])
	.html((event, d) => d.tagName);

    vis.svg.call(tip);

    // add text for the big circles
    let popularTag = vis.data.nodes.filter(d => vis.rScale(d.count) > 30);
    let tags = vis.svg.selectAll(".tagName")
        .data(popularTag)
        .join(
	    enter => enter.append("text")
		.attr("class", "tagName")
		.text(d => { return d.tagName;} ),
	    update => update.text(d => { return d.tagName;} ),
	    exit => exit.remove()
	);
    
    // Create nodes as circles
    let nodes = vis.svg.selectAll("circle")
        .data(vis.data.nodes)
	.join(
	    enter => enter.append("circle")
		.attr("r", d => vis.rScale(d.count))
		.attr("class", "tagCircle"),
	    update => update.attr("r", d => vis.rScale(d.count))
	)
	.on("mouseover", over)
	.on("mouseout", out);
    
    // change the x,y because of the force
    force.on("tick", function() {
	nodes.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
	tags.attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });
    });

    function over(event, d){
	tip.show(event, d);
	let com = d3.select("#combinations");
	com.selectAll("path")
	    .attr("stroke", "rgba(150, 16, 69, 0.05)");
	
	let tn = d.tagName.replace(/(\+|\.|\#)/g, `\\$1`);
	com.selectAll(".l_" + tn)
	    .attr("stroke", "rgba(150, 16, 69, 0.8)")
	    .raise();
	com.selectAll(".n_" + tn)
	    .attr("font-weight", "bold")
	    .attr("fill", "#cc3300");
    }

    function out(event, d){
	tip.hide(event, d);
	let com = d3.select("#combinations");
	com.selectAll("path")
	    .attr("stroke", "rgba(150, 16, 69, 0.2)");
	
	let tn = d.tagName.replace(/(\+|\.|\#)/g, `\\$1`);
	com.selectAll(".l_" + tn)
	    .attr("stroke", "rgba(150, 16, 69, 0.2)")
	    .raise();
	com.selectAll(".n_" + tn)
	    .attr("font-weight", null)
	    .attr("fill", "black");
    }
}
