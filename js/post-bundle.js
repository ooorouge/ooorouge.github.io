PostBundle = function(monthlyCount) {
    // Add whatever param you need to this function
    // Don't forget to change it in main function too.
    var vis = this;
    var parseTime = d3.timeParse("%Y-%m");
    vis.monthlyCount = monthlyCount.slice(0, monthlyCount.length-1);
    vis.monthlyCount.forEach(function(d) {
        d.month = parseTime(d.month);
        return d;
    })
    console.log(vis.monthlyCount);

    vis.initVis();
}

PostBundle.prototype.initVis = function() {
    var vis = this;

    // TODO:
    // Init SVG for bubble chart

    // Init SVG for connection

    // Init SVG for trends


    var tags = Object.keys(vis.monthlyCount[0]).filter(function(key) {
        return key != "month";
    })

    vis.tagsByFirstFreq = tags;

    vis.tagsByAlpha = [...tags].sort();

    var sumDic = {};
    vis.sumData = vis.monthlyCount.forEach(function(d, i) {
        tags.forEach(function(a) {
            var curr = +d[a];
            if(i == 0) {
                sumDic[a] = curr;
            } else {
                sumDic[a] = sumDic[a] + curr;
            }
        })
    })

    vis.tagsByFreqSum = [...tags].sort(function(a, b) {
        return sumDic[b] - sumDic[a];
    })

    console.log(tags)
    console.log(vis.tagsByFreqSum)

    vis.selectedTags = [];
    vis.selectedTags.push("java");
    vis.selectedTags.push("python");

    vis.setTags("init");

    // var checkboxs = document.getElementById("tags-area").getElementsByClassName("input");
    // // for(var i = 0; i < checkboxs.length; i++) {
    // //     // if(checkboxs[i].value == "java" || checkboxs[i].value == "python") {
    // //     //     checkboxs[i].checked = true;
    // //     // }
    // //     checkboxs[]
    // // }
    // checkboxs[1].checked = true;
    // checkboxs[2].checked = true;

    vis.monthlyMargin = {top: 30, bottom: 30, left: 30, right : 30};
    vis.monthlyWidth = 1200 - vis.monthlyMargin.left - vis.monthlyMargin.right;
    vis.monthlyHeight = 600 - vis.monthlyMargin.top - vis.monthlyMargin.bottom;
    vis.monthlySvg = d3.select("#trends-area").append("svg")
        .attr("width", vis.monthlyWidth + vis.monthlyMargin.left + vis.monthlyMargin.right)
        .attr("height", vis.monthlyHeight + vis.monthlyMargin.top + vis.monthlyMargin.bottom)
        .attr("transform", "translate(" + vis.monthlyMargin.left + "," + vis.monthlyMargin.top + ")");

    vis.topCountData = vis.monthlyCount.map(function(d) {
        //var thisYear = {};
        //return Object.fromEntries(Object.entries(d).slice(0, 6));
        var thisYear = {};
        thisYear.month = d.month;
        thisYear.java = d.java;
        thisYear.python = d.python;
        return thisYear;

    });
    console.log(vis.topCountData);

    vis.x = d3.scaleTime()
        //.domain(d3.extent(vis.topCountData, d => d.date))
        .range([40, vis.monthlyWidth])

    vis.y = d3.scaleLinear()
        .range([vis.monthlyHeight, 0])

    vis.monthlySvg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + vis.monthlyHeight + ")")

    vis.monthlySvg.append("g")
        .attr("class", "yAxis")
        .attr("transform", "translate(40, 0)")

    vis.monthlySvg.append("text").attr("x", 50).attr("y", 10).attr("fill", "black").text("Number of posts");
    vis.monthlySvg.append("text").attr("x", vis.monthlyWidth - 50).attr("y", vis.monthlyHeight - 15).attr("fill", "black").text("Month");

    vis.focus = vis.monthlySvg.append("g")
        .attr("class", "focus")
        .style("display", "none");

    vis.focus.append("line").attr("class", "lineHover")
        .style("stroke", "#999")
        .attr("stroke-width", 1)
        .style("shape-rendering", "crispEdges")
        .style("opacity", 0.5)
        .attr("y1", -vis.monthlyHeight)
        .attr("y2",0);

    vis.focus.append("text").attr("class", "lineHoverDate")
        .attr("text-anchor", "middle")
        .attr("font-size", 12);

    vis.overlay = vis.monthlySvg.append("rect")
        .attr("class", "overlay")
        .attr("x", 40)
        .attr("width", vis.monthlyWidth - 40)
        .attr("height", vis.monthlyHeight)
        .style("fill", "none")
        .style("pointer-events", "all")


    vis.wrangleData(vis.topCountData);
}

PostBundle.prototype.setTags = function(order) {
    var vis = this;

    var tags = [];

    if(order == "alpha") {
        tags = vis.tagsByAlpha;
    } else if(order == "search") {
        tags = vis.tagsBySearch;
    } else if(order == "selected") {
        tags = [...vis.tagsByAlpha].sort(function(a, b) {
            var aSelected = vis.selectedTags.includes(a);
            var bSelected = vis.selectedTags.includes(b);
            if((aSelected && bSelected) || (!aSelected && !bSelected)) {
                return 0;
            } else if(aSelected) {
                return -1;
            } else {
                return 1;
            }
        })
    }else {
        //tags = vis.tagsByFirstFreq;
        tags = vis.tagsByFreqSum;
    }

    tags.forEach((d, i) => {
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'tag';
        checkbox.value = d;
        // if(order == "init") {
        //     if(d == "java" || d == "python") {
        //         checkbox.checked = true;
        //     }
        // } else if(order == "search") {
        //     if(vis.matchTags.includes(d)) {
        //         checkbox.checked = true;
        //     }
        // }
        if(vis.selectedTags.includes(d)) {
            checkbox.checked = true;
        }

        var label = document.createElement('label')
        label.htmlFor = d;
        label.appendChild(document.createTextNode(d));

        var br = document.createElement('br');

        var container = document.getElementById("tags-area");
        var theDiv = container.appendChild(document.createElement("div"));
        theDiv.appendChild(checkbox);
        theDiv.appendChild(document.createTextNode(d));
    })
}

PostBundle.prototype.searchTags = function(str) {
    var vis = this;
    // var matchTags = [];
    // var leftTags = [...vis.tagsByAlpha];
    vis.matchTags = vis.tagsByAlpha.filter(function(value) {
        return value.includes(str);
    });
    var leftTags = vis.tagsByAlpha.filter(function(value) {
        return !value.includes(str);
    });
    vis.tagsBySearch = vis.matchTags.concat(leftTags);
    vis.setTags("search");
}


PostBundle.prototype.wrangleData = function(data) {
    var vis = this;
    vis.selectedData = data;
    vis.updateVis();
}

PostBundle.prototype.updateVis = function() {
    var vis = this;
    // draw SVG for bubble chart

    // draw SVG for connection

    // draw SVG for trends
    var formatDate = d3.timeFormat("%Y-%m");
    var bisectDate = d3.bisector(d => d.month).left;

    var color = d3.scaleOrdinal(d3.schemeCategory10);


    color.domain(Object.keys(vis.selectedData[0]).filter(function(key) {
        return key != "month";
    }))

    vis.lineData = color.domain().map(function(tag) {
        return {
            tag: tag,
            values: vis.selectedData.map(function(d) {
                return {
                    date: d.month,
                    count: +d[tag]
                }
            })
        }
    })

    console.log(vis.lineData);

    //vis.x.domain(d3.extent(vis.selectedData, d => parseTime(d.month)));
    vis.x.domain(d3.extent(vis.selectedData, d => d.month));

    vis.y.domain([
        d3.min(vis.lineData, function(tag) {
            return d3.min(tag.values, function(values) {return values.count})
        }),
        d3.max(vis.lineData, function(tag) {
            return d3.max(tag.values, function(values) {return values.count})
        })
    ])

    vis.xAxis = d3.axisBottom(vis.x);

    vis.yAxis = d3.axisLeft(vis.y);

    var line = d3.line()
        .x(function(d) {
            return vis.x(d.date)
        })
        .y(function(d) {
            return vis.y(d.count)
        })
        .curve(d3.curveMonotoneX)

    vis.monthlySvg.select(".xAxis").call(vis.xAxis);

    vis.monthlySvg.select(".yAxis").call(vis.yAxis);

    var lines = vis.monthlySvg.selectAll(".line")
        .data(vis.lineData)

    lines.exit().remove();

    lines.enter()
        .append("path")
        .attr("class", "line")

    vis.monthlySvg.selectAll(".line").attr("d", function(d) {return line(d.values)})
        .attr("fill", "none")
        .attr("stroke-width", 1)
        .attr("stroke", function(d) {
            return color(d.tag);
        })



    var labels = vis.focus.selectAll(".lineHoverText")
        .data(vis.lineData)

    labels.exit().remove();

    labels.enter().append("text")
        .attr("class", "lineHoverText")
        .style("fill", d => color(d.tag))
        .attr("text-anchor", "start")
        .attr("font-size",12)
        .attr("dy", (_, i) => 1 + i * 2 + "em")
        .merge(labels);

    var circles = vis.focus.selectAll(".hoverCircle")
        .data(vis.lineData)

    circles.exit().remove();

    circles.enter().append("circle")
        .attr("class", "hoverCircle")
        .style("fill", d => color(d.tag))
        .attr("r", 2.5)
        .merge(circles);

    vis.monthlySvg.selectAll(".overlay")
        .on("mouseover", function() { vis.focus.style("display", null); })
        .on("mouseout", function() { vis.focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove(event) {

        var x0 = vis.x.invert(d3.pointer(event)[0]),
            i = bisectDate(vis.selectedData, x0, 1),
            d0 = vis.selectedData[i - 1],
            d1 = vis.selectedData[i],
            d = x0 - d0.month > d1.month - x0 ? d1 : d0;

        vis.focus.select(".lineHover")
            .attr("transform", "translate(" + vis.x(d.month) + "," + vis.monthlyHeight + ")");

        vis.focus.select(".lineHoverDate")
            .attr("transform", "translate(" + vis.x(d.month) + "," + (vis.monthlyHeight + vis.monthlyMargin.bottom) + ")")
            .text(formatDate(d.month));

        vis.focus.selectAll(".hoverCircle")
            .attr("cy", e => vis.y(d[e.tag]))
            .attr("cx", vis.x(d.month));

        vis.focus.selectAll(".lineHoverText")
            .attr("transform", "translate(" + (vis.x(d.month)) + "," + vis.monthlyHeight / 2.5 + ")")
            .text(e => e.tag + " " + Math.round(d[e.tag]));

        vis.x(d.month) > (vis.monthlyWidth - vis.monthlyWidth / 4)
            ? vis.focus.selectAll("text.lineHoverText")
                .attr("text-anchor", "end")
                .attr("dx", -10)
            : vis.focus.selectAll("text.lineHoverText")
                .attr("text-anchor", "start")
                .attr("dx", 10)
    }


}