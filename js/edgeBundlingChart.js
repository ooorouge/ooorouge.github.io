function EdgeBundlingChart(parentElement) {
    // Add whatever param you need to this function
    // Don't forget to change it in main function too.
    let vis = this;
    vis.parentElement = parentElement;
    vis.initVis();
}

EdgeBundlingChart.prototype.initVis = function() {
    let vis = this;

    vis.margin = {top: 80, right: 70, bottom: 70, left: 70};
    vis.height = 600;
    vis.width = 600;

    // generate the canvas
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width",vis.width + vis.margin.left + vis.margin.right)
        .attr("height",vis.height + vis.margin.top + vis.margin.bottom)
	.append("g")
	.attr("transform", "translate(" + vis.margin.left + ", " + vis.margin.top + ")");

    // compute the scale of the angle
    vis.angleScale = d3.scaleLinear()
	.range([- Math.PI, Math.PI]);

    // compute the scale of the link-width
    vis.linkScale = d3.scaleLinear()
	.range([2, 10]);

    // define the radius of the circle
    vis.radius = vis.height * 0.4;

    // define the curve link between nodes
    vis.curve = d3.line()
	.curve(d3.curveBundle.beta(0.75));  
}

EdgeBundlingChart.prototype.wrangleData = function(data) {
    let vis = this;
    vis.data = data;
    vis.data.nodes.sort((a, b) => {return b.count - a.count});
    
    let nodesNum = data.nodes.length;

    // update the range of the angleScale
    vis.angleScale.domain([0, nodesNum]);

    // update the range of the linkwidthScale
    vis.linkScale.domain([d3.min(vis.data.links, d => d.value), d3.max(vis.data.links, d => d.value)]);

    // compute the location info into the data
    let map = new Map();
    vis.data.nodes.forEach((d, i) => {
	d.angle = vis.angleScale(i); // Calculate the angle at which the element will be placed.
        d.x = (vis.radius * Math.cos(d.angle)) + vis.radius; // Calculate the x position of the element.
        d.y = (vis.radius * Math.sin(d.angle)) + vis.radius; // Calculate the y position of the element.

	map.set(d.tagName, {x: d.x, y: d.y});
    })
    vis.map = map;
}

EdgeBundlingChart.prototype.updateVis = function(data) {
    let vis = this;
    // generate the angel for each node
    vis.wrangleData(data);

    // add the text
    let text = vis.svg.selectAll("text")
	.data(vis.data.nodes)
	.join(
	    enter => enter.append("text")
	)
	.attr("x", d => d.x)
	.attr("y", d => {
	    if(d.angle > Math.PI/2 || d.angle < - Math.PI / 2) {
		return d.y + 5;
	    }
	    return d.y + 5;
	})
	.attr("transform", d => {
	    if(d.angle > Math.PI/2 || d.angle < - Math.PI / 2) {
		return `rotate(${d.angle * 180 / Math.PI + 180}, ${d.x}, ${d.y})`;
	    }
	    return `rotate(${d.angle * 180 / Math.PI}, ${d.x}, ${d.y})`;
	})
	.attr("text-anchor", d => {
	    if(d.angle > Math.PI/2 || d.angle < - Math.PI / 2) {
		return "end";
	    }
	    return "start";
	})
	.attr("class", d => "n_" + d.tagName)
	.text(d => d.tagName)
	.on("mouseover", over)
	.on("mouseout", out);

    // add the link
    let links = vis.svg.selectAll("path")
	.data(vis.data.links)
	.join(
	    enter => enter.append("path")
		.attr("stroke-width", d => vis.linkScale(d.value))
		.attr("stroke", "rgba(150, 16, 69, 0.2)")
		.attr("fill", "none")
		.attr("d", d => {
		    let points = [[vis.map.get(d.source).x, vis.map.get(d.source).y], [vis.radius, vis.radius], [vis.map.get(d.target).x, vis.map.get(d.target).y]]
		    return vis.curve(points);
		})
		.attr("class", d => {
		    return "l_" + d.target + " l_" + d.source;
		}),
	    update => update.attr("stroke-width", d => vis.linkScale(d.value))
		.attr("stroke", "rgba(150, 16, 69, 0.2)")
		.attr("fill", "none")
		.attr("d", d => {
		    let points = [[vis.map.get(d.source).x, vis.map.get(d.source).y], [vis.radius, vis.radius], [vis.map.get(d.target).x, vis.map.get(d.target).y]]
		    return vis.curve(points);
		})
		.attr("class", d => {
		    return "l_" + d.target + " l_" + d.source;
		}),
	    exit => exit.remove()
	);

    // defined the over function
    function over(event, d) {
	links.attr("stroke", "rgba(150, 16, 69, 0.05)");
	let tn = d.tagName.replace(/(\+|\.|\#)/g, `\\$1`);
	vis.svg.selectAll(".l_" + tn)
	    .attr("stroke", "rgba(150, 16, 69, 0.8)")
	    .raise();
	vis.svg.selectAll(".n_" + tn)
	    .attr("font-weight", "bold")
	    .attr("fill", "#cc3300");
    }

    function out(event, d) {
	links.attr("stroke", "rgba(150, 16, 69, 0.2)")
	let tn = d.tagName.replace(/(\+|\.|\#)/g, `\\$1`);
	vis.svg.selectAll('.l_' + tn)
	    .attr("stroke", "rgba(150, 16, 69, 0.2)")
	    .raise();
	vis.svg.selectAll(".n_" + tn)
	    .attr("font-weight", null)
	    .attr("fill", "black");
    }
}
