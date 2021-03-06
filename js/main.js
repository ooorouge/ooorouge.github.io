var geoBackgroud;
var userBundle;
var postBundle;

var userTotal;
var userGeoData = {};
var userGrowthData;
var popularUserChart;

function indexInit() {

    $(".section").height($(window).height()-50);
    $(".description").height($(window).height()-50);
    $("#submit-tags").on("click", resetTag);
    $("#year-slider").on("input", event => {

        // TODO: change post charts accordingly.
        var year = 2008 + parseInt($(event.currentTarget).val());
        console.log(year); //2008 to 2020, int

    });
    loadData();

    d3.csv("data/monthlyCountPerTag.csv").then(monthlyCount => {
        postBundle = new PostBundle(monthlyCount);
    })
}

function loadData() {
    var files = ["data/geo.csv", "data/clean_survey_all.csv", "data/userCreation.csv", "data/userLastAccess.csv"];
    var promises = [];

    files.forEach(f => {
        promises.push(d3.csv(f));
    });

    promises.push(d3.json("data/world-110m.json"));

    Promise.all(promises).then(v => {
        var g = v[1];
        var y = v[0];
        userTotal = g;
        var gks = Object.keys(g[0]);

        var co = gks.slice(1, gks.length - 1);

        co.forEach( c => {
            y.forEach(row => {
                if (row.country == c) {
                    userGeoData[c] = { lo : parseFloat(row.longitude), la : parseFloat(row.latitude)};
                }
            });
        });

        var maxCount = 0;
        var minCount = 0;
        for(var i = 0; i < 6; i++) {
            maxCount = Math.max(maxCount, Math.max(...Object.values(g[i])));
            minCount = Math.min(minCount, Math.min(...Object.values(g[i])));
        }

        geoBackgroud = new GeoBackground(v[4]);
        userBundle = new UserBundle(geoBackgroud.svg, geoBackgroud.projection, userGeoData, g[0], maxCount, minCount);
        console.log("start...")
        userGrowth = new UserGrowth(v[2], v[3]);
        popularUserChart = new PopularUserChart("top-user");
        popularUserChart.wrangleData(2015);
    });
}

function updateSpecificYear(whichone) {
    // TODO:
    // do something
    // param: whichone : Integer, example: 0 means 2015, 1 means 2016, etc
    // userBundle.instance.something = newData;
    // userBUndle.instance.wrangleData();
    $(".d3-tip.n").remove();
    $("#title-user-description").html("User Distribution " + String(2015 + whichone))
    $("#title-user-growth").html("Accumulated Users " + String(2015 + whichone))
    $("#title-top-user").html("Top Users " + String(2015 + whichone))
    userBundle.year = userTotal[whichone];
    userBundle.wrangleData();
    userGrowth.updateVis(whichone);
    popularUserChart.wrangleData(2015 + whichone);
}

function resetTag() {
    const checkboxes = document.querySelectorAll('input[name="tag"]');
    checkboxes.forEach( checkbox => {
        // if (checkbox.value != "java" && checkbox.value != "python") {
            $(checkbox).prop("checked", false);
        // } else {
        //     $(checkbox).prop("checked", true);
        // }
    });
    postBundle.selectedTags = [];
    postBundle.selectedData = [];
    postBundle.monthlySvg.selectAll(".line").remove();
    postBundle.focus.selectAll(".lineHoverText").remove();
    postBundle.focus.selectAll(".hoverCircle").remove();
    //updateTags();
}

function changeOrder(selectOrder) {
    //resetTag();
    //document.getElementById("tags-area").innerHTML = "";
    document.getElementById("search-input").value = "";
    var parent = document.getElementById("tags-area")
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    postBundle.setTags(selectOrder.value);
}

function updateTags() {
    const checkboxes = document.querySelectorAll('input[name="tag"]:checked');
    let tags = [];
    checkboxes.forEach((checkbox) => {
        tags.push(checkbox.value);
    });
    postBundle.selectedTags = tags;
    //alert(tags);
    //console.log(postBundle.monthlyCount);
    var data = postBundle.monthlyCount.map(function(d) {
        var selectedTags = {month: d.month};
        tags.forEach( tag => {
            selectedTags[tag] = d[tag];
        })
        return selectedTags
    })
    postBundle.wrangleData(data);
}

function searchTags() {
    var str = document.getElementById("search-input").value;
    console.log(str);
    // resetTag();
    var parent = document.getElementById("tags-area")
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    $("#search-results").prop("selected", "selected");
    postBundle.searchTags(str);
}

$(document).ready(function() {
    $(this).scrollTop(0);
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
    indexInit();



    // Get the modal
    var modal = document.getElementById("myModal");

// Get the button that opens the modal
    var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close");

// When the user clicks on the button, open the modal
    btn.onclick = function() {
        modal.style.display = "block";
    }

// When the user clicks on <span> (x), close the modal
    for(var i = 0; i < span.length; i++) {
        span[i].onclick = function() {
            modal.style.display = "none";
            document.getElementById("postsModal").style.display = "none";
        }
    }

    document.getElementById("posts-info-icon").onclick = function() {
        document.getElementById("postsModal").style.display = "block";
    }

// When the user clicks anywhere outside of the modal, close it
//     window.onclick = function(event) {
//         if (event.target == modal) {
//             modal.style.display = "none";
//         }
//     }

    $(document).on('change', 'input[type=checkbox]', updateTags);


    var $window = $(window);
    var div2 = $('#map');
    var div1 = $('#maps');
    var div1_top = div1.offset().top;
    var div1_height = div1.height();
    var div1_bottom = div1_top + div1_height;
    var div3 = $("#posts")
    var div3_height = div3.height();

    var triggers = [];

    // This two variables are used to avoid load user chart multi times even in the same year on scroll
    var YearOfLastScroll = 2015;
    var actionAlreadyTaken = false;

    var boundaries = [];
    for (var i = 0; i < 6; ++i) {
        triggers.push(false);

        var itemId = "#user-20" + String(i + 15);
        boundaries.push($(itemId).offset().top);
    }

    console.log(triggers);
    $window.on('scroll', function() {
        var scrollTop = document.documentElement.scrollTop;
        div2.addClass("show");
        if (scrollTop > (div1_top - window.innerHeight * 0.15) && (scrollTop + window.innerHeight) < (div1_bottom + window.innerHeight * 0.15)) {
            div2.css({"z-index": 1,});
        } else {
            div2.css({"z-index": -3});
        }
        // on scroll change user chart
        for (var i = 1; i < 6; ++i) {
            if (scrollTop < (boundaries[0] + 0.1 * window.innerHeight)) {
                for (var _j = 1; _j < 6; ++_j) {
                    triggers[_j] = false;
                }
                triggers[0] = true;
                actionAlreadyTaken = (2015 == YearOfLastScroll);
                updateSpecificYear(0);
                // Just for your convenience, if you feel like you don't need it anymore, delete it.
                // console.log("==== 2015"  + actionAlreadyTaken); 

                break; // no need for another round of if-else check;
            }
            if (scrollTop >= (boundaries[i-1] +  + 0.1 * window.innerHeight) && scrollTop < (boundaries[i] + 0.1 * window.innerHeight)) {
                for (var _k = 0; _k < 6; ++_k) {
                    triggers[_k] = false;
                }
                triggers[i] = true;
                actionAlreadyTaken = ((2015 + i) == YearOfLastScroll);

                // Just for your convenience, if you feel like you don't need it anymore, delete it.
                // console.log("=======" + actionAlreadyTaken);
                // console.log("on 20" + String(15 + i)); // Just for your convenience

                break; // no need for another round of if-else check;
            }
        }

        for (var i = 0; i < 6; ++i) {
            if (triggers[i] && !actionAlreadyTaken) {
                updateSpecificYear(i);
                actionAlreadyTaken = !actionAlreadyTaken;
                YearOfLastScroll = 2015 + i;
            }
        }
    });
});


