# ooorouge.github.io
Final Project for CSE457A, url to our project: [ooorouge.github.io](ooorouge.github.io)

## Overview

We create a visualization that introduced the evolution of Stack Overflow which is a question and answer site for professional and enthusiast programmers. To show the evolution of Stack Overflow, we split it into three parts: users' information, tags used to describe questions and trends of tags.

## Code

This project is driven by javascript and a few data processing scripts

### Frontend

This interface was completed by three logical parts: map, tag, trend and a few util functions.

* [main.js](https://github.com/ooorouge/ooorouge.github.io/blob/main/js/main.js): Initialization and a few util functions
* [self-animation.js](https://github.com/ooorouge/ooorouge.github.io/blob/main/js/self-animation.js): Animation stuffs

#### Map

* [geo.js](https://github.com/ooorouge/ooorouge.github.io/blob/main/js/geo.js): Draws the map
* [user-bundle.js](https://github.com/ooorouge/ooorouge.github.io/blob/main/js/user-bundle.js): Places users onto the map
* [user-growth.js](https://github.com/ooorouge/ooorouge.github.io/blob/main/js/user-growth.js): Draws the chart that reflects the growth of users
* [popularUser.js](https://github.com/ooorouge/ooorouge.github.io/blob/main/js/popularUser.js): Shows users with highest reputation among these years

#### Tag

* [tagMain.js](https://github.com/ooorouge/ooorouge.github.io/blob/main/js/tagMain.js): Init charts for tags
* [edgeBundlingChart.js](https://github.com/ooorouge/ooorouge.github.io/blob/main/js/edgeBundlingChart.js): Shows the connections between tags
* [tagForceChart.js](https://github.com/ooorouge/ooorouge.github.io/blob/main/js/tagForceChart.js): Add force effects on circles
* [postYearChart.js](https://github.com/ooorouge/ooorouge.github.io/blob/main/js/postYearChart.js): Shows the 20 most popular tags of a specific year in the format of circles

#### Trend

* [post-bundle.js](https://github.com/ooorouge/ooorouge.github.io/blob/main/js/post-bundle.js): Shows trends of tags

### Data Processing

* [PostDataProcessing.ipynb](https://github.com/ooorouge/ooorouge.github.io/blob/main/dataProcessingScript/PostDataProcessing.ipynb)
* And lots of SQL queries on https://data.stackexchange.com/

## Data

### Geo information

* [world-110m.json](https://github.com/ooorouge/ooorouge.github.io/blob/main/data/world-110m.json): Boundaries for every country

* [geo.csv](https://github.com/ooorouge/ooorouge.github.io/blob/main/data/geo.csv): Longitude and latitude of every country

### Users

* [userCreation.csv](https://github.com/ooorouge/ooorouge.github.io/blob/main/data/userCreation.csv): New users
* [userLastAccess.csv](https://github.com/ooorouge/ooorouge.github.io/blob/main/data/userLastAccess.csv): Inactive users
* [clean_survey_all.csv](https://github.com/ooorouge/ooorouge.github.io/blob/main/data/clean_survey_all.csv): Where are theses users
* [rep2015.json](https://github.com/ooorouge/ooorouge.github.io/blob/main/data/rep2015.json): Users with highest reputation in 2015, name format: repxxxx.json

### Tags

* [com2008_200.json](https://github.com/ooorouge/ooorouge.github.io/blob/main/data/com2008_200.json): Connections between tags, name format: comxxxx_200.json
* [top200Tag2008.json](https://github.com/ooorouge/ooorouge.github.io/blob/main/data/top200Tag2008.json): Most popular tags with count numbers, name format: top200Tagxxxx.json
* [totalPostCountPerMonth.json](https://github.com/ooorouge/ooorouge.github.io/blob/main/data/totalPostCountPerMonth.json): Total number of posts per month
* [totalPostCountPerYear.json](https://github.com/ooorouge/ooorouge.github.io/blob/main/data/totalPostCountPerYear.json): Total number of posts per year

### Trends

* [monthlyCountPerTag.csv](https://github.com/ooorouge/ooorouge.github.io/blob/main/data/monthlyCountPerTag.csv): Count number for every tag per month

## Library

* [d3.min.v6.js](https://github.com/ooorouge/ooorouge.github.io/blob/main/js/d3.min.v6.js)
* [d3-tip.js](https://github.com/ooorouge/ooorouge.github.io/blob/main/js/d3-tip.js)
* [topojson.min.js](https://github.com/ooorouge/ooorouge.github.io/blob/main/js/topojson.min.js)
* jQuery and bootstrap

## Cite

* To draw the arrow on the post edge bundling chart, I used the code from: https://stackoverflow.com/questions/11254806/interpolate-line-to-make-a-half-circle-arc-in-d3.  

