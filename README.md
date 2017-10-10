# Europe Wellbeing Statistics

## Overview and goals

This is Code Institute Stream Two Project as part of the Full Stack Development course. The project is focused on Data Visualisation.

The subject of the project is Europe Wellbeing Statistics. The data for the project has been collected from various online sources. The main source was a [dataset from Office for National Statistics](https://www.ons.gov.uk/peoplepopulationandcommunity/wellbeing/datasets/measuringnationalwellbeinginternationalcomparisons) (The UK's largest independent producer of official statistics and the recognised national statistical institute of the UK).

The goal of the project was to give an insight about wellbeing in Europe, showcase data in visually perceptive and interactive way and to be able to compare data in different countries and analyse it.

Target audience is anybody who is interested in Europe wellbeing, international statistics or data visualisation. Mostly young or middle age people who are experienced users. The project is also user-friedly enough for beginner users as it has a tour to guide a user through the website. 

The website is responsive so it is accessible on all devices and it works in all browsers.

## Design

Website design is minimalistic and simple with clean background so it is easier to read and analyse data. Blue colors are dominating in the project as they have calming effect and blue color is the corporate color. For the dashboard design Bootstrap and Keen Dashboards library stylesheets were used. For the website tour design Intro.js stylesheet was used. And for styling charts JavaScript charting library DC.js stylesheet was used. Custom CSS stylehseet was also created to tweak existing styles and add additional style features.

The website has fixed navigation with the name of the project on the left and two buttons. One for a guide tour and one to reset all data on the website. Fixed navigation helps to access navigation buttons at anytime. 

Bootstrap grid system was used for website layout. All the contents are placed on the website in a way and order to fit and look good on all devices.

## Content and Functionality

The content was placed on the website in a logical order, by purpose and topics. The first comes Europe map which shows life satisfaction data. It was important to show a map first as users would be attracted to a visual element and be interested to play with it. When you hover over the country a tooltip will appear showing the data. However it may be time consuming to hover over each country to get information. Also hover effect does not work on mobile. So an additonal chart which is a table is set next to the map showing the same data for more readability. Users can click on countries on the map to filter data. 

After life satisfaction charts comes happiness rating chart, healthy life expectancy chart and life worthwhileness chart - all related to personal wellbeing. 

Then follow charts related to personal finance and employment, charts related to accommodation and area Europeans live in, charts related to relationships and then charts related to health.  

All the charts are vertical or horizontal bar charts for consistency. Two charts are stacked bar charts. Each bar represents a country. Y or x axis respectively shows data mostly in percentage with 4 ticks for readability. Bar charts are easy to read visually comparing to e.g. line chart as you can see at which point each bar ends telling you what number it represents. Also you can click on bars to select different countries for filtering purposes. You cannot do it on e.g. line chart. When you hover over each bar a tolltip will also appear showing the data. Each chart has grid lines and elastic data axis for better readability.

Each chart has a title describing what it is about. And most of the charts have select drop down menu after the title. This is to select related charts. For example, happiness rating chart by default shows high rating of happiness data (rating 9 and 10), but in the drop down menu you can select happiness rating 9 or 5 or 3 etc. After selecting new data the chart will be rendered again and the chart title will change. It gives an opportunity to show more information using the same space on the website.

Most of the charts also have buttons "Sort by country" and "Sort by value" next to the select drop down menu. All data is sorted by default by value for more readability. However if you click on the button "Sort by country" next to the chart it will be rendered again sorted by country. If you click on "Sort by value" the chart will be rendered and sorted by value again. It gives more flexibility for users.

The Map and horizontal bar charts have a scroll bar for the case if they do not fit in the window so users can scroll chart to left or right to see all data (mostly for mobile screens). Vertical bar charts are limited to show only top 10 countries to save space. However if you select any other country on the map (or other chart) to filter data for it which is not in the top 10 it will still appear in the vertical bar chart.

The map chart is changing its size depending on device screen size to make sure that it fits on all screens. 

A tour guide on the website guides you through each chart highlighting it and explaining what each chart is about and how to use it. 

## Technology
The project is designed using micro web framework Flask. Data stored in noSQL database MongoDB. Data dashboard created using DC.js (JavaScript charting library), D3.js (JavaScript library for visualizing data) and crossfilter.js (JavaScript library for exploring large multivariate datasets). Languages used - HTML, CSS, jQuery and Python.

## Validation and Testing


## Deployment