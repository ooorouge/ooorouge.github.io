$(".section").height($(window).height()-50);
$(".description").height($(window).height()-50);

var width = 1000;
var height = 600;

var svg = d3.select("#geomap").append("svg")
.attr("width", width)
.attr("height", height)

var projection = d3.geoMercator()
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

d3.json("data/world-110m.json").then(data => {

    // Convert TopoJSON to GeoJSON (target object = 'states')
    console.log("drawing...");
    var world = topojson.feature(data, data.objects.countries).features

    // Render the U.S. by using the path generator
    svg.selectAll("path")
        .data(world)
        .enter()
        .append("path")
        .attr("d", path);

    d3.select("#growth").append("img").attr("src", "images/usergrowth.png").attr("width", 500).attr("height", 270);
    d3.select("#top-user").append("img").attr("src", "images/topusers.png").attr("width", 500).attr("height", 270);


    $(document).ready(function() {
        var $window = $(window);
        var div2 = $('#map');
        var div1 = $('#maps');
        var div1_top = div1.offset().top;
        var div1_height = div1.height();
        var div1_bottom = div1_top + div1_height;
        var div3 = $("#posts")
        var div3_height = div3.height();
        console.log(div1_bottom);
        $window.on('scroll', function() {
            var scrollTop = document.documentElement.scrollTop;
            var viewport_height = $window.height();
            var scrollTop_bottom = scrollTop + viewport_height;
            div2.toggleClass('show', scrollTop > div1_top/2 && (scrollTop + window.innerHeight) < (div1_bottom + div3_height/2));
        });
    });
});


console.log("last line");