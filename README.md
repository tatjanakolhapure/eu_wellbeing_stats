# Europe Wellbeing Statistics

## Table of Contents
- [Overview and goals](##Overviewandgoals)
- [Design](##Design)
- [Content and Functionality](##ContentandFunctionality)
- [Technology](##Technology)
- [Validation and Testing](##ValidationandTesting)
- [Deployment](##Deployment)

## Overview and goals

This is Code Institute Stream Two Project as part of the Full Stack Development course. The project is focused on Data Visualisation.

The subject of the project is Europe Wellbeing Statistics. The data for the project has been collected from various online sources. The main source was a [dataset from Office for National Statistics](https://www.ons.gov.uk/peoplepopulationandcommunity/wellbeing/datasets/measuringnationalwellbeinginternationalcomparisons) (The UK's largest independent producer of official statistics and the recognised national statistical institute of the UK).

The goal of the project was to give an insight about wellbeing in Europe, showcase data in visually perceptive and interactive way and to be able to compare data in different countries and analyse it.

Target audience is anybody who is interested in Europe wellbeing, international statistics or data visualisation. Mostly young or middle age people who are experienced users. The project is also user-friendly enough for beginner users as it has a tour to guide a user through the website. 

The website is responsive so it is accessible on all devices and it works in all browsers.

## Design

Website design is minimalistic and simple with clean background so it is easier to read and analyse data. Blue colours are dominating in the project as they have calming effect and blue colour is the corporate colour. For the dashboard design Bootstrap and Keen Dashboards library stylesheets were used. For the design of the website tour Intro.js stylesheet was used. And for styling charts the stylesheet of JavaScript charting library DC.js was used.

The website has fixed navigation with the name of the project on the left and two buttons. One for a tour and one to reset all data filters on the website. Fixed navigation helps to access navigation buttons at anytime. 

Bootstrap grid system was used for website layout. All the contents are placed on the website in a way and order to fit and look good on all devices.

Custom CSS stylesheet was created to tweak existing styles and to add additional style features:

- stroke color and width changed for countries on the map
- font size changed for axis labels
- x axis labels transformed to be diagonal
- margin added to chart titles, buttons, select drop down menus
- maximum width set for select drop down menus
- life satisfaction table styled (column width, padding)
- scrollbar added to charts (in case if they do not fit in a container)
- font-weight set for chart titles (to make sure that it is rendered correctly in all browsers)
- select drop down menu displayed as a block on mobile screen with different margin
- navigation styled for mobile screen (different padding and margin)
- width of some containers changed on certain screen sizes (JavaScript was used to add and remove classes as overwriting bootstrap CSS code was not sufficient)

## Content and Functionality

The content was placed on the website in a logical order, by purpose and topics. The first comes Europe map which shows life satisfaction data. It was important to show a map first as users would be attracted to a visual element and be interested to play with it. When you hover over the country a tooltip will appear showing the data. However it may be time consuming to hover over each country to get information. Also hover effect does not work on mobile. So an additional chart which is a data table is set next to the map showing the same data for more readability. Users can click on countries on the map to filter data. 

After life satisfaction charts comes happiness rating chart, healthy life expectancy chart and life worthwhileness chart - all related to personal wellbeing. 

Then follow charts related to personal finance and employment, charts related to accommodation and area Europeans live in, charts related to relationships and then charts related to health.  

All the charts are vertical or horizontal bar charts for consistency. Two charts are stacked bar charts. Each bar represents a country. Y or x axis respectively shows data mostly in percentage with 4 ticks for readability. Bar charts are easy to read visually comparing to e.g. line chart as you can see at which point each bar ends telling you what number it represents. Also you can click on bars to select different countries for filtering purposes. You cannot do it on e.g. line chart. When you hover over each bar a tooltip will also appear showing the data. Each chart has grid lines and elastic data axis for better readability.

Each chart has a title describing what it is about. And most of the charts have select drop down menu after the title. This is to select related charts. For example, happiness rating chart by default shows high rating of happiness data (rating 9 and 10), but in the drop down menu you can select happiness rating 9 or 5 or 3 etc. After selecting new data the chart will be rendered again and the chart title will change. It gives an opportunity to show more information using the same space on the website.

Most of the charts also have buttons "Sort by country" and "Sort by value" next to the select drop down menu. All data is sorted by default by value for more readability. However if you click on the button "Sort by country" next to the chart it will be rendered again sorted by country. If you click on the button "Sort by value" the chart will be rendered and sorted by value again. It gives more flexibility for users.

The Map and horizontal bar charts have a scroll bar for cases when they do not fit in the window so users can scroll chart to left or right to see all data (mostly for mobile screens). Vertical bar charts are limited to show only top 10 countries to save space. However if you select any other country on the map (or on other chart) to filter data for it and this country is not in the top 10, it will still appear in the vertical bar chart.

The map chart is changing its size depending on the device screen size to make sure that it fits on all screens. 

The website tour guides you through each chart highlighting it and explaining what each chart is about and how to use it. 

## Technology

The project is designed using micro web framework Flask in JetBrains PyCharm to retrieve the data from the database and return it to the browser. Data stored in noSQL database MongoDB. The database itself was created using MongoDB Shell and populated with data and updated when required using Python. Data dashboard created using DC.js (JavaScript charting library), Keen Dashboards, D3.js (JavaScript library for visualizing data) and crossfilter.js (JavaScript library for exploring large multivariate datasets). Intro.js was used to create the website tour. Queue.js library was used to load multiple files (database data and geojson file for the map chart) before running the rest of the code. Geojson file with countries data was downloaded from [here](https://github.com/PublicaMundi/MappingAPI/blob/master/data/geojson/countries.geojson). DC.js, D3.js and Crossfilter.js documentation and examples were used for reference when creating charts. 

Each document in the database holds data for a separate country. And each country may hold different data (key value pairs or list or array). One country may have data for one subject but not for other etc. So the biggest challenge was to filter undefined data:
- if statement was used when defining data
- if statement was used when defining dimensions
- groups had to be filtered so the chart does not show undefined bar when sorting it by country
- domains had to be filtered when sorting data by value
- columns in life satisfaction data table had to be filtered
- if statement was used for title definition on the map chart

The function remove_empty_bins to filter groups for undefined data was used from DC.js documentation [here](https://github.com/dc-js/dc.js/wiki/FAQ#remove-empty-bins). And it was modified for the project accordingly. The solution for sorting charts by value was found on DC.js GitHub Issues page [here](https://github.com/dc-js/dc.js/issues/156).

Vertical bar charts show only top ten countries. In order to show only ten countries the function getTops was used to create fake groups. Solution was found on [this stack overflow page](https://stackoverflow.com/questions/30977987/plotting-top-values-of-a-group-on-dc-js-bar-chart). In order to sort data by value the chart property ordering was used. Solution found on DC.js GitHub Issues page [here](https://github.com/dc-js/dc.js/issues/384).

There are several custom jQuery functions set up. There is an event listener for each of these functions.

There is a function for each select drop down menu to render different charts depending on selection chosen. Depending on the selected option's value the chart's group and domain is changed, the chart is rendered again and its title updated. The last chart related to health has two select menus. By default it shows select menus for good health chart but if you choose mental health chart in the first select menu the second select menu will change accordingly. And the other way round.

The longest function is sortChart function. It checks which chart must be sorted, then which sort button is clicked ("sort by country" or "sort by value"). Then it checks which option has been selected in the select menu (by selected option's value). If the button "sort by value" is clicked it changes chart's domain and group accordingly and renders the chart. If the button "sort by country" is clicked it changes chart's group and renders the chart. Function differs for cases when there are no undefined values. 

The function setWidth adds and removes classes for specific containers to change their width at certain screen sizes. This function also renders the map chart but with different size depending on screen size. The function resize makes sure that function setWidth works when resizing a window.

And function resetAll is for the reset button in the navigation. It resets all filters and redraws charts. 

## Validation and Testing

During the development, the code was tested constantly. HTML and CSS was tested by using inspect tool in the browser (e.g. to make sure that the appropriate style was applied to the right element or to experiment with other CSS styles). JavaScript/ jQuery was tested by using console section in the browser's developer tools. If there were any errors in the browser console they would normally tell where exactly the mistake is. Console.log() function was also used in the code to check if function has been called or to check if the value of the variable is correct. 

The code was validated using HTML validator The W3C Markup Validation Service, CSS validator The W3C CSS Validation Service, JavaScript validator JSLint. No errors were found.

The website was tested in different browsers to make sure that each browser renders the website as expected. When testing was done it has been noted that  -ms-transform: rotate(-45deg) CSS property is not working in Internet Explorer and Microsoft Edge. No solution was found on the web. 

The website was also tested on few mobile devices - few Android phones (Samsung and HTC) and on Apple phones (iPhone 4 and iPhone 5). It has been noted that font-weight is rendered differently on Apple iPhone 4 for chart titles so the font-weight was defined in the custom stylesheet to make sure that browsers do not apply their own font-weight to chart titles. 

For responsiveness, the website was tested in Google Chrome using Toggle Device Toolbar in Developer Tools as also Responsive Web Design Tester extension.

## Deployment



