# ooorouge.github.io
Final Project for CSE457A, url to our project: [Evolution of Stack Overflow](https://washuvis.github.io/stackoverflow/)

## Overview

We create a visualization that introduced the evolution of Stack Overflow which is a question and answer site for professional and enthusiast programmers. To show the evolution of Stack Overflow, we split it into three parts: users' information, 70 most popular tags used to describe questions and trends of 200 most popular tags over the years

## Non-obvious features

### Instruction

* You can click on *INSTRUCTIONS* on nav bar to review it  again
* You can move your mouse on ⓘ to see specific explanations of charts
* You can click on a button at the end of "Select a year, explore popular tags and the associated tag combinations in posts" to learn how to explore tags

### Tag

* You can move your mouse on either circles on the left chart or names on the right chart to highlight the tag you are interested in

### Trend

* You can sort tags
* You can search tags that you are interested in

## Code

This project is driven by javascript and a few data processing scripts

### Frontend

This interface was completed by three logical parts: map, tag, trend and a few util functions.

* [main.js](https://github.com/washuvis/stackoverflow/blob/main/js/main.js): Initialization and a few util functions
* [self-animation.js](https://github.com/washuvis/stackoverflow/blob/main/js/self-animation.js): Animation stuffs

#### Map

* [geo.js](https://github.com/washuvis/stackoverflow/blob/main/js/geo.js): Draws the map
* [user-bundle.js](https://github.com/washuvis/stackoverflow/blob/main/js/user-bundle.js): Places users onto the map
* [user-growth.js](https://github.com/washuvis/stackoverflow/blob/main/js/user-growth.js): Draws the chart that reflects the growth of users
* [popularUser.js](https://github.com/washuvis/stackoverflow/blob/main/js/popularUser.js): Shows users with highest reputation among these years

#### Tag

* [tagMain.js](https://github.com/washuvis/stackoverflow/blob/main/js/tagMain.js): Init charts for tags
* [edgeBundlingChart.js](https://github.com/washuvis/stackoverflow/blob/main/js/edgeBundlingChart.js): Shows the connections between tags
* [tagForceChart.js](https://github.com/washuvis/stackoverflow/blob/main/js/tagForceChart.js): Shows the 70 most popular tags of a specific year in the format of circles
* [postYearChart.js](https://github.com/washuvis/stackoverflow/blob/main/js/postYearChart.js): Draws the selector of tag charts

#### Trend

* [post-bundle.js](https://github.com/washuvis/stackoverflow/blob/main/js/post-bundle.js): Shows trends of tags

### Data Processing

* [PostDataProcessing.ipynb](https://github.com/washuvis/stackoverflow/blob/main/dataProcessingScript/PostDataProcessing.ipynb)
* And lots of SQL queries on https://data.stackexchange.com/

## Data

### Geo information

* [world-110m.json](https://github.com/washuvis/stackoverflow/blob/main/data/world-110m.json): Boundaries for every country

* [geo.csv](https://github.com/washuvis/stackoverflow/blob/main/data/geo.csv): Longitude and latitude of every country

### Users

* [userCreation.csv](https://github.com/washuvis/stackoverflow/blob/main/data/userCreation.csv): New users
* [userLastAccess.csv](https://github.com/washuvis/stackoverflow/blob/main/data/userLastAccess.csv): Inactive users
* [clean_survey_all.csv](https://github.com/washuvis/stackoverflow/blob/main/data/clean_survey_all.csv): Where are theses users
* [rep2015.json](https://github.com/washuvis/stackoverflow/blob/main/data/rep2015.json): Users with highest reputation in 2015, name format: repxxxx.json

### Tags

* [com2008_200.json](https://github.com/washuvis/stackoverflow/blob/main/data/com2008_200.json): Connections between tags, name format: comxxxx_200.json
* [top200Tag2008.json](https://github.com/washuvis/stackoverflow/blob/main/data/top200Tag2008.json): Most popular tags with count numbers, name format: top200Tagxxxx.json
* [totalPostCountPerMonth.json](https://github.com/washuvis/stackoverflow/blob/main/data/totalPostCountPerMonth.json): Total number of posts per month
* [totalPostCountPerYear.json](https://github.com/washuvis/stackoverflow/blob/main/data/totalPostCountPerYear.json): Total number of posts per year

### Trends

* [monthlyCountPerTag.csv](https://github.com/washuvis/stackoverflow/blob/main/data/monthlyCountPerTag.csv): Count number for every tag per month

## Library

* [d3.min.v6.js](https://github.com/washuvis/stackoverflow/blob/main/js/d3.min.v6.js)
* [d3-tip.js](https://github.com/washuvis/stackoverflow/blob/main/js/d3-tip.js)
* [topojson.min.js](https://github.com/washuvis/stackoverflow/blob/main/js/topojson.min.js)
* jQuery and bootstrap

## Cite

* To draw the arrow on the post edge bundling chart, I used the code from: https://stackoverflow.com/questions/11254806/interpolate-line-to-make-a-half-circle-arc-in-d3.  
* Simulate a click event to make the tag page show 2020 data by default. Resource: https://www.geeksforgeeks.org/how-to-simulate-a-click-with-javascript/.  
