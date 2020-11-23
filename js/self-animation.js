$(window).on("scroll", function() {
    var coverTop = $("#cover").offset().top;
    var coverHeight = $("#cover").height();
    var scrollUp = document.documentElement.scrollTop % coverHeight;
    var scalePercentage = (coverTop + coverHeight - scrollUp) / (coverTop + coverHeight);
    scalePercentage = scalePercentage > 0.3 ? scalePercentage : 0.3;
    var projectTitle = document.getElementById("project-title");
    projectTitle.style.opacity = scalePercentage;
    projectTitle.style.transform = "scale(" +  scalePercentage + ")";
});

$(window).scroll(function() {
    var backToTop = $('#back-to-top-button');
    if (document.documentElement.scrollTop > $("#cover").height()) {
        console.log("!!!!");
        backToTop.addClass('show');
    } else {
        backToTop.removeClass('show');
    }
});

titleChanger();
textChanger();

function titleChanger() {
    var stack = document.getElementById("title-stack");
    var overflow = document.getElementById("title-overflow");

    var symbols = "?*&^%$#@!".split("");
    if (randomNumber(0, 5) < 3) {
        stack.innerHTML = textAggregater(symbols, 4);
        overflow.innerHTML = textAggregater(symbols, 7);
    } else {
        stack.innerHTML = "Stack";
        overflow.innerHTML = "Overflow";
    }
    setTimeout(titleChanger, randomNumber(1000, 5000));
}

function textAggregater(array, howmany) {
    var empty = new Array();
    for (let i = 0; i < howmany; i++) {
        var element = array[randomNumber(0, howmany)];
        empty.push(element);
    }
    return empty.join("");
}

function textChanger() {
    var thisOne = document.getElementById("nav-title");
    thisOne.style.color = "rgb(" + randomNumber(0, 255) + "," + randomNumber(0, 255) + "," + randomNumber(0, 255) + ")";
    setTimeout(textChanger, 1000);
}
function randomNumber(start,end) {
    return Math.floor(Math.random() * end) + start;
}