PostBundle = function(monthlyCount) {
    // Add whatever param you need to this function
    // Don't forget to change it in main function too.
    var vis = this;

    vis.monthlyCount = monthlyCount.slice(0, monthlyCount.length-1);
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

    tags.forEach((d, i) => {
        // d3.select("#tags-area").append("div")
        //     .append("input")
        //     .attr("type", "checkbox")
        //     .attr("name", "tag")
        //     .attr("value", d)
        //     //.append("text")
        //     .text(d)
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'tag';
        checkbox.value = d;
        if(i < 5) {
            checkbox.checked = true;
        }

        var label = document.createElement('label')
        label.htmlFor = d;
        label.appendChild(document.createTextNode(d));

        var br = document.createElement('br');

        var container = document.getElementById("tags-area");
        var theDiv = container.appendChild(document.createElement("div"));
        //theDiv.class = "select-tag";
        theDiv.appendChild(checkbox);
        //container.appendChild(label);
        theDiv.appendChild(document.createTextNode(d));
        //container.appendChild(br);
    })

    vis.monthlyMargin = {top: 30, bottom: 30, left: 30, right : 30};
    vis.monthlyWidth = 1200 - vis.monthlyMargin.left - vis.monthlyMargin.right;
    vis.monthlyHeight = 600 - vis.monthlyMargin.top - vis.monthlyMargin.bottom;
    vis.monthlySvg = d3.select("#trends-area").append("svg")
        .attr("width", vis.monthlyWidth + vis.monthlyMargin.left + vis.monthlyMargin.right)
        .attr("height", vis.monthlyHeight + vis.monthlyMargin.top + vis.monthlyMargin.bottom)
        .attr("transform", "translate(" + vis.monthlyMargin.left + "," + vis.monthlyMargin.top + ")");

    vis.topCountData = vis.monthlyCount.map(function(d) {
        //var thisYear = {};
        return Object.fromEntries(Object.entries(d).slice(0, 6));
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

    vis.xAxis = d3.axisBottom(vis.x);

    vis.yAxis = d3.axisLeft(vis.y);



    vis.wrangleData(vis.topCountData);
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
    var parseTime = d3.timeParse("%Y-%m");

    // var x = d3.scaleTime()
    //     //.domain(d3.extent(vis.topCountData, d => d.date))
    //     .range([40, vis.monthlyWidth])
    //
    // var y = d3.scaleLinear()
    //     .range([vis.monthlyHeight, 0])

    var color = d3.scaleOrdinal(d3.schemeCategory10);
    //
    // var xAxis = d3.axisBottom(vis.x);
    //
    // var yAxis = d3.axisLeft(vis.y);



    color.domain(Object.keys(vis.selectedData[0]).filter(function(key) {
        return key != "month";
    }))

    vis.lineData = color.domain().map(function(tag) {
        return {
            tag: tag,
            values: vis.selectedData.map(function(d) {
                return {
                    date: parseTime(d.month),
                    count: +d[tag]
                }
            })
        }
    })

    console.log(vis.lineData);

    vis.x.domain(d3.extent(vis.selectedData, d => parseTime(d.month)));

    vis.y.domain([
        d3.min(vis.lineData, function(tag) {
            return d3.min(tag.values, function(values) {return values.count})
        }),
        d3.max(vis.lineData, function(tag) {
            return d3.max(tag.values, function(values) {return values.count})
        })
    ])

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

    var tooltip = vis.monthlySvg
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("a simple tooltip");

    lines.enter()
        .append("path")
        .attr("class", "line")
        .attr("d", function(d) {return line(d.values)})
        .attr("fill", "none")
        .attr("stroke-width", 1)
        .attr("stroke", function(d) {
            return color(d.tag);
        })
        .on("mouseover", function(d){
            // return tooltip.style("visibility", "visible").text(d.tag);
            var tooltip = vis.monthlySvg.append("text").attr("x", 200).attr("y", 200).text(d.tag);
            return tooltip;
            //return vis.monthlySvg.append("text").x(200).y(200).text(d.tag);
        })





}