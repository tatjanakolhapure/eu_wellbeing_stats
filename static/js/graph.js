/**
 * Created by Tatjana Kolhapure on 28/08/2017.
 */

queue()
    .defer(d3.json, "/europeStats/wellbeing")
    .defer(d3.json, "static/geojson/world-countries.json")
    .await(makeGraphs);

function makeGraphs(error, europeStatsWellbeing, countriesJson) {
    if (error) {
        console.error("makeGraphs error on receiving dataset:", error.statusText);
        throw error;
    }

    //Clean europeStatsWellbeing data
    europeStatsWellbeing.forEach(function (d) {
        d.life_satisfaction = +d.life_satisfaction;
        d.soc_support = +d.soc_support;
        d.life_expectancy = +d.life_expectancy;
        d.good_health = +d.good_health;
        d.unemployment_rate = +d.unemployment_rate;
        d.feel_safe = +d.feel_safe;
        if (d.life_is_worthwhile)
		{
        	d.life_is_worthwhile_agree = +d.life_is_worthwhile.agree;
        	d.life_is_worthwhile_strongly_agree = +d.life_is_worthwhile.strongly_agree;
		}
        d.mental_health_index = +d.mental_health_index;
        d.pers_relationships_satisfaction = +d.pers_relationships_satisfaction;
        d.job_satisfaction = +d.job_satisfaction;
        d.green_areas_satisfaction = +d.green_areas_satisfaction;
        if (d.close_to_neighbours)
        {
            d.close_to_neighbours_agree = +d.close_to_neighbours.agree;
            d.close_to_neighbours_strongly_agree = +d.close_to_neighbours.strongly_agree;
        }
        d.accommodation_satisfaction = +d.accommodation_satisfaction;
        d.risk_of_poverty = +d.risk_of_poverty;
        d.net_income = +d.net_income;
        d.finances_satisfaction = +d.finances_satisfaction;
        d.ends_meet = +d.ends_meet;
        if (d.happiness)
		{
			d.happiness_extremely_unhappy = +d.happiness.extremely_unhappy;
			d.happiness_1 = +d.happiness["1"];
			d.happiness_2 = +d.happiness["2"];
			d.happiness_3 = +d.happiness["3"];
			d.happiness_4 = +d.happiness["4"];
			d.happiness_5 = +d.happiness["5"];
			d.happiness_6 = +d.happiness["6"];
			d.happiness_7 = +d.happiness["7"];
			d.happiness_8 = +d.happiness["8"];
			d.happiness_9 = +d.happiness["9"];
			d.happiness_happy = +d.happiness.happy;
		}
        d.loneliness = +d.loneliness;
    });

    //Create a Crossfilter instance
    var ndx = crossfilter(europeStatsWellbeing);

    //Define Dimensions
    var lifeSatDim = ndx.dimension(function(d) {return d.country;});
    var countryDim = ndx.dimension(function(d) {return d.country;});
    var happinessDim = ndx.dimension(function(d) { if (d.happiness) {return d.country;} else { return "undefined";}});
    var neighbourhoodDim = ndx.dimension(function(d) { if (d.close_to_neighbours) {return d.country;} else { return "undefined";}});

	//Define Groups
    var lifeSatGroup = lifeSatDim.group().reduceSum(function(d) {return d.life_satisfaction;});
    var happiness_unhappy_group = happinessDim.group().reduceSum(function(d) {return d.happiness_extremely_unhappy;});
    var happiness_1_group = happinessDim.group().reduceSum(function(d) {return d.happiness_1;});
    var happiness_2_group = happinessDim.group().reduceSum(function(d) {return d.happiness_2;});
    var happiness_3_group = happinessDim.group().reduceSum(function(d) {return d.happiness_3;});
    var happiness_4_group = happinessDim.group().reduceSum(function(d) {return d.happiness_4;});
    var happiness_5_group = happinessDim.group().reduceSum(function(d) {return d.happiness_5;});
    var happiness_6_group = happinessDim.group().reduceSum(function(d) {return d.happiness_6;});
    var happiness_7_group = happinessDim.group().reduceSum(function(d) {return d.happiness_7;});
    var happiness_8_group = happinessDim.group().reduceSum(function(d) {return d.happiness_8;});
    var happiness_9_group = happinessDim.group().reduceSum(function(d) {return d.happiness_9;});
    var happiness_happy_group = happinessDim.group().reduceSum(function(d) {return d.happiness_happy;});
    var ends_meet_group = countryDim.group().reduceSum(function(d) {return d.ends_meet;});
    var risk_of_poverty_group = countryDim.group().reduceSum(function(d) {return d.risk_of_poverty;});
    var job_satisfaction_group = countryDim.group().reduceSum(function(d) {return d.job_satisfaction;});
    var finances_satisfaction_group = countryDim.group().reduceSum(function(d) {return d.finances_satisfaction;});
    var close_to_neighbours_agree_group = neighbourhoodDim.group().reduceSum(function(d) {return d.close_to_neighbours_agree;});
    var close_to_neighbours_strongly_agree_group = neighbourhoodDim.group().reduceSum(function(d) {return d.close_to_neighbours_strongly_agree;});

    //Charts
    var lifeSatisfactionChart = dc.geoChoroplethChart("#life-satisfaction-map");
    var happinessChart = dc.compositeChart('#happiness-chart');
    var personalFinanceChart = dc.compositeChart('#personal-finance-chart');
    var neighbourhoodChart = dc.compositeChart('#neighbourhood-chart');

    lifeSatisfactionChart
		.width(570)
		.height(520)
		.dimension(lifeSatDim)
		.group(lifeSatGroup)
		.overlayGeoJson(countriesJson.features, "country", function (d) {return d.properties.name;})
		.title(function (p)
			{
				if (isNaN(p["value"])) {return p["key"] + ": undefined";}
				else {return p["key"] + ": " + p["value"] + " out of 10";}
			})
		.colors(['#ccc','#E2F2FF','#C4E4FF','#9ED2FF','#81C5FF','#C4E4FF','#81C5FF','#51AEFF','#1E96FF','#0061B5','#0055b5'])
        .colorDomain([0, 10])
		.projection(d3.geo.mercator()
			.center([32,50])
			.rotate([4.4, 0])
			.scale(700)
			);

   happinessChart
		.width(650)
		.height(550)
		.margins({top: 10, right: 50, bottom: 75, left: 50})
		.x(d3.scale.ordinal().domain(happinessDim.bottom(Infinity).map(function(d) { if (d.happiness) {return d.country} else {return "undefined"}})))
		.xUnits(dc.units.ordinal)
		.renderHorizontalGridLines(true)
		.legend(dc.legend().x(565).y(20).itemHeight(13).gap(5))
		.brushOn(false)
		.compose([
			dc.lineChart(happinessChart)
				.dimension(happinessDim)
				.group(happiness_unhappy_group, 'very unhappy')
				.defined(function(d) { return !isNaN(d.y)}),
			dc.lineChart(happinessChart)
				.dimension(happinessDim)
				.group(happiness_1_group, '1')
				.defined(function(d) { return !isNaN(d.y)}),
            dc.lineChart(happinessChart)
				.dimension(happinessDim)
				.group(happiness_2_group, '2')
				.defined(function(d) { return !isNaN(d.y)}),
            dc.lineChart(happinessChart)
				.dimension(happinessDim)
				.group(happiness_3_group, '3')
				.defined(function(d) { return !isNaN(d.y)}),
			dc.lineChart(happinessChart)
				.dimension(happinessDim)
				.group(happiness_4_group, '4')
				.defined(function(d) { return !isNaN(d.y)}),
            dc.lineChart(happinessChart)
				.dimension(happinessDim)
				.group(happiness_5_group, '5')
				.defined(function(d) { return !isNaN(d.y)}),
            dc.lineChart(happinessChart)
				.dimension(happinessDim)
				.group(happiness_6_group, '6')
				.defined(function(d) { return !isNaN(d.y)}),
			dc.lineChart(happinessChart)
				.dimension(happinessDim)
				.group(happiness_7_group, '7')
				.defined(function(d) { return !isNaN(d.y)}),
            dc.lineChart(happinessChart)
				.dimension(happinessDim)
				.group(happiness_8_group, '8')
				.defined(function(d) { return !isNaN(d.y)}),
            dc.lineChart(happinessChart)
				.dimension(happinessDim)
				.group(happiness_9_group, '9')
				.defined(function(d) { return !isNaN(d.y)}),
            dc.lineChart(happinessChart)
				.dimension(happinessDim)
				.group(happiness_happy_group, 'very happy')
				.defined(function(d) { return !isNaN(d.y)})
            ]);

   personalFinanceChart
		.width(790)
		.height(350)
		.margins({top: 10, right: 50, bottom: 75, left: 50})
		.x(d3.scale.ordinal().domain(countryDim.bottom(Infinity).map(function(d) {return d.country})))
		.xUnits(dc.units.ordinal)
		.renderHorizontalGridLines(true)
		.legend(dc.legend().x(650).y(20).itemHeight(13).gap(5))
		.brushOn(false)
		.compose([
			dc.lineChart(personalFinanceChart)
				.dimension(countryDim)
				.group(ends_meet_group, 'ends meet'),
			dc.lineChart(personalFinanceChart)
				.dimension(countryDim)
				.group(risk_of_poverty_group, 'at poverty risk'),
            dc.lineChart(personalFinanceChart)
				.dimension(countryDim)
				.group(job_satisfaction_group, 'job satisfaction'),
            dc.lineChart(personalFinanceChart)
				.dimension(countryDim)
				.group(finances_satisfaction_group, 'finances satisfaction')
		]);

   neighbourhoodChart
		.width(770)
		.height(350)
		.margins({top: 10, right: 50, bottom: 75, left: 50})
		.x(d3.scale.ordinal().domain(neighbourhoodDim.bottom(Infinity).map(function(d) {if (d.close_to_neighbours) {return d.country} else {return "undefined"}})))
		.xUnits(dc.units.ordinal)
		.renderHorizontalGridLines(true)
		.legend(dc.legend().x(670).y(20).itemHeight(13).gap(5))
		.brushOn(false)
		.compose([
			dc.lineChart(neighbourhoodChart)
				.dimension(neighbourhoodDim)
				.group(close_to_neighbours_agree_group, 'agree')
				.defined(function(d) { return !isNaN(d.y)}),
			dc.lineChart(neighbourhoodChart)
				.dimension(neighbourhoodDim)
				.group(close_to_neighbours_strongly_agree_group, 'strongly agree')
				.defined(function(d) { return !isNaN(d.y)})
		]);

    dc.renderAll();

}