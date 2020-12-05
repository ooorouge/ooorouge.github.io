function PostYearChart(parentElement, tagForceChart, edgeBundlingChart, data) {
    // Add whatever param you need to this function
    // Don't forget to change it in main function too.
    let vis = this;
    vis.tagForceChart = tagForceChart;
    vis.edgeBundlingChart = edgeBundlingChart;
    vis.parentElement = parentElement;
    vis.data = data;
    vis.initVis();
}

PostYearChart.prototype.initVis = function() {
    let vis = this;
    vis.margin = {top: 25, right: 20, bottom: 25, left: 50};
    vis.height = 50;
    vis.width = 0.7 * window.innerWidth;

    // generate the canvas
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width",vis.width + vis.margin.left + vis.margin.right)
        .attr("height",vis.height + vis.margin.top + vis.margin.bottom)
	.append("g")
	.attr("transform", "translate(" + vis.margin.left + ", " + vis.margin.top + ")");
    
    vis.updateVis();
}

PostYearChart.prototype.updateVis = function() {
    let vis = this;

    // compute the xScale for each circle
    vis.xScale = d3.scaleLinear()
	.domain([d3.min(vis.data, d => d.year), d3.max(vis.data, d => d.year)])
	.range([0, vis.width - 30]);

    // compute the rScale for each circle
    vis.rScale = d3.scaleLinear()
	.domain([0, d3.max(vis.data, d => d.count)])
	.rangeRound([5, 20]);
    
    // plot the line
    vis.svg.append("line")
	.attr("x1", 0)
	.attr("x2", vis.width)
	.attr("y1", 0)
	.attr("y2", 0)
	.attr("class", "postYearChartLine");
    
    // plot the circle for each year    
    vis.svg.selectAll("circle")
	.data(vis.data)
	.enter()
	.append("circle")
	.attr("cx", d => vis.xScale(d.year))
	.attr("cy", 0)
	.attr("r", d => vis.rScale(d.count))
	.attr("class", "postYearCircle")
	.attr("id", d => {return "year_" + d.year;})
	.on("click", (event) => {
	    // Clicking on any specific year should highlight that circle
	    // HINT: Use .highlighted class to style the highlighted circle
	    // remove other clicked circle's class
	    d3.select(".highlighted")
		.classed("highlighted", false);
	    // add class highlighted for the clicked circle
	    d3.select(event.target)
		.classed("highlighted", true);
	    
	    // and update the rest of the visualizations
	    d3.json("data/com" + event.target.__data__.year + "_200.json")
		.then((data) => {
		    vis.edgeBundlingChart.updateVis(data);
		});
	    d3.json("data/com" + event.target.__data__.year + "_200.json")
		.then((data) => {
		    vis.tagForceChart.updateVis(data);
		});
	});
    
    // Append text information of each year right below the corresponding circle
    // HINT: Use .yeartext class to style your text elements
    vis.svg.selectAll("text")
	.data(vis.data)
	.enter()
	.append("text")
	.attr("class", "year-text")
	.attr("x", d => vis.xScale(d.year))
	.attr("y", 40)
	.text((d) => {return d.year});
}
