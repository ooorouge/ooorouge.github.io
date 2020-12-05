/*
 * Root file that handles instances of all the tag charts and loads the visualization
 */
function initTagVis() {
    //Creating instances for each visualization
    let tagForceChart = new TagForceChart("tags");
    let edgeBundlingChart = new EdgeBundlingChart("combinations");
    d3.json("data/totalPostCountPerYear.json")
	.then(data => {
	    data.forEach(d => {
		d.year = +d.year;
		d.count = +d.count;
	    })
	    let postYearChart = new PostYearChart("slider-area", tagForceChart, edgeBundlingChart, data);
	    // simulate a click event to make the page show 2016 data by default.
	    // Resource: https://www.geeksforgeeks.org/how-to-simulate-a-click-with-javascript/
	    let click_event = new CustomEvent('click'); 
	    let btn_element = document.querySelector('#year_2020'); 
	    btn_element.dispatchEvent(click_event);
	    // cite end -------------------------------------------------
	})
}

initTagVis();
