The com20**.json contains the first 70 most frequent tags used in that year and the combination among them in that year. The format is basically designed for a bundling chart like this: https://observablehq.com/@d3/hierarchical-edge-bundling. The target and source do not means directions, just mean there is a link between the two nodes.

The top200Tag20**.json counts the first 200 most frequent tags and their frequency in that year

The totalPostCountPerMonth is the number of posts counted for each year from 2008-07, when the first posts was recorded in the dataset, to 2020-09, when the last posts was recorded in the dataset by the time we cleaned the data.

monthlyCountPerTag.csv counts the frequency of tags that, according to tag.xml file posted by the stackoverflow, have total counts that are greater than 1000. This can help us reduce the number of tags from 150000+ to about 4786. 
