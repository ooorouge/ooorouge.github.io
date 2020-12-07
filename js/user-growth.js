UserGrowth = function(userCreation, userLastAccess) {
    var vis = this;
    vis.userCreation = userCreation;
    vis.userLastAccess = userLastAccess;
    vis.initVis();
}

UserGrowth.prototype.initVis = function() {
    var vis = this;

    vis.svgMargin = {top: 20, bottom: 20, left: 0, right: 20};
    vis.svgWidth = 380 - vis.svgMargin.left - vis.svgMargin.right;
    vis.svgHeight = 200 - vis.svgMargin.top - vis.svgMargin.bottom;
    vis.svg = d3.select("#growth")
        .append("svg")
        .attr("width", vis.svgWidth + vis.svgMargin.left + vis.svgMargin.right)
        .attr("height", vis.svgHeight + vis.svgMargin.top + vis.svgMargin.bottom)
        .attr("transform", "translate(" + vis.svgMargin.left + "," + vis.svgMargin.top + ")")

    vis.x = d3.scaleTime().range([60, vis.svgWidth]);
    vis.y = d3.scaleLinear().range([vis.svgHeight, 0])


    vis.svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + vis.svgHeight + ")");

    vis.svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(60, 0)");

    vis.legend = vis.svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "start")
        .selectAll("g")
        .data(["active", "inactive"])
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(" + i * 50 + ", 0)"; });

    vis.legend.append("rect")
        .attr("x", 70)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", function(d) {
            if(d == "active") {
                return "rgb(82,133,236)"
            }
            return "lightgrey"
        });

    vis.legend.append("text")
        .attr("x", 85)
        .attr("y", 5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });


    vis.wrangleData();
}

UserGrowth.prototype.wrangleData = function() {
    var vis = this;

    vis.lastAccessData = [];
    for(var i = 0; i < 6; i++) {
        var thisYear = {};
        thisYear.year = 2015+i;
        thisYear.prev = +vis.userLastAccess[0][thisYear.year];
        for(var j = 1; j < 13; j++) {
            if(j == 1) {
                thisYear[j] = +vis.userLastAccess[j][thisYear.year] + thisYear.prev;
            } else {
                thisYear[j] = +vis.userLastAccess[j][thisYear.year] + thisYear[j - 1];
            }
        }
        vis.lastAccessData.push(thisYear);
    }

    vis.creationData = [];
    for(var i = 0; i < 6; i++) {
        var thisYear = {};
        thisYear.year = 2015+i;
        thisYear.prev = +vis.userCreation[0][thisYear.year];
        for(var j = 1; j < 13; j++) {
            if(j == 1) {
                thisYear[j] = +vis.userCreation[j][thisYear.year] + thisYear.prev;
            } else {
                thisYear[j] = +vis.userCreation[j][thisYear.year] + thisYear[j - 1];
            }
        }
        vis.creationData.push(thisYear);
    }

    vis.parseTime = d3.timeParse("%m");

    vis.mergeData = [];
    for(var i = 0; i < 6; i++) {
        var yearData = [];
        for(var j = 1; j < 13; j++) {
            var monthData = {};
            monthData.month = vis.parseTime(j);
            monthData.inactive = vis.lastAccessData[i][j];
            monthData.active = vis.creationData[i][j] - monthData.inactive;
            yearData.push(monthData);
        }
        vis.mergeData.push(yearData);
    }
    console.log(vis.mergeData);
    vis.updateVis(0);
}

UserGrowth.prototype.updateVis = function(i) {
    var vis = this;


    if(i < 5) {
        vis.x.domain([vis.parseTime(1), vis.parseTime(12)]);
    } else {
        vis.x.domain([vis.parseTime(1), vis.parseTime(9)]);
        vis.mergeData[i] = vis.mergeData[i].slice(0, 9);
    }


    vis.y.domain([0, d3.max(vis.mergeData[5], function(d) {
            return d.active+d.inactive;
        })
    ]);

    vis.xAxis = d3.axisBottom(vis.x).tickFormat(d3.timeFormat("%b"));

    vis.yAxis = d3.axisLeft(vis.y);

    var stackedData = d3.stack().keys(["inactive", "active"])(vis.mergeData[i]);


    vis.area = d3.area()
        .x(function(d) {
            return vis.x(d.data.month)
        })
        .y0(function(d) {
            return vis.y(d[0])
        })
        .y1(function(d) {
            return vis.y(d[1])
        })


    vis.users = vis.svg.selectAll(".area")
        .data(stackedData);

    vis.users.enter().append("path")
        .attr("class", "area")
        .merge(vis.users)
        .style("fill-opacity", 0.3)
        .transition()
        .duration(300)
        .style("fill", function(d,i) {
            if(i == 0) {
                return "lightgray";
            }
            return "rgb(82,133,236)";
        })
        .style("fill-opacity", 1)
        .attr("d", function(d) {
            return vis.area(d);
        })


    vis.users.exit().remove();

    vis.svg.select(".x-axis").call(vis.xAxis);
    vis.svg.select(".y-axis").call(vis.yAxis);


}
