var geoBackgroud;
var userBundle;
var postBundle;

var userGeoData;
var userGrowthData;

indexInit();
document.getElementById("submit-tags").addEventListener("click", updateTags);

function indexInit() {
    $(".section").height($(window).height()-50);
    $(".description").height($(window).height()-50);
    $("#year-slider").on("input", event => {

        // TODO: change post charts accordingly.
        var year = 2008 + parseInt($(event.currentTarget).val());
        console.log(year); //2008 to 2020, int

    });
    loadData();
    d3.csv("data/monthlyCountPerTag.csv").then(monthlyCount => {
        loadInstance(monthlyCount);
    })
}

function loadData() {
    // TODO:
    // DON'T CHANGE POST CHART HERE, CHANGE IT IN Line 15
    // load and process geo
    // loadInstance();
    // then userBundle.geodata = whatData
    // userBundle.growthData = whatData
    // userBundle.topUserData = whatData
    // then userBundle.
}

function loadInstance(monthlyCount) {
    geoBackgroud = new GeoBackground();
    userBundle = new UserBundle();
    postBundle = new PostBundle(monthlyCount);
}

function updateSpecificYear(whichone) {
    // TODO:
    // do something
    // param: whichone : Integer, example: 0 means 2015, 1 means 2016, etc
    // userBundle.instance.something = newData;
    // userBUndle.instance.wrangleData();
}

function updateTags() {
    const checkboxes = document.querySelectorAll('input[name="tag"]:checked');
    let tags = [];
    checkboxes.forEach((checkbox) => {
        tags.push(checkbox.value);
    });
    //alert(tags);
    console.log(postBundle.monthlyCount);
    var data = postBundle.monthlyCount.map(function(d) {
        var selectedTags = {month: d.month};
        tags.forEach( tag => {
            selectedTags[tag] = d[tag];
        })
        return selectedTags
    })
    postBundle.wrangleData(data);
}

$(document).ready(function() {
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
        if (scrollTop > div1_top/2 && (scrollTop + window.innerHeight) < (div1_bottom + div3_height/2)) {
            div2.addClass("show");
        } else {
            div2.removeClass('show');
        }
        // on scroll change user chart
        for (var i = 1; i < 6; ++i) {
            if (scrollTop < boundaries[0]) {
                for (var _j = 1; _j < 6; ++_j) {
                    triggers[_j] = false;
                }
                triggers[0] = true;
                actionAlreadyTaken = (2015 == YearOfLastScroll);

                // Just for your convenience, if you feel like you don't need it anymore, delete it.
                console.log("==== 2015"  + actionAlreadyTaken); 

                break; // no need for another round of if-else check;
            }
            if (scrollTop >= boundaries[i-1] && scrollTop < boundaries[i]) {
                for (var _k = 0; _k < 6; ++_k) {
                    triggers[_k] = false;
                }
                triggers[i] = true;
                actionAlreadyTaken = ((2015 + i) == YearOfLastScroll);

                // Just for your convenience, if you feel like you don't need it anymore, delete it.
                console.log("=======" + actionAlreadyTaken);
                console.log("on 20" + String(15 + i)); // Just for your convenience

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