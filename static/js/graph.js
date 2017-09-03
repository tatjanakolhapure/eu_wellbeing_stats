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
        if (d.good_health) {d.good_health = +d.good_health;}
        d.unemployment_rate = +d.unemployment_rate;
        d.feel_safe = +d.feel_safe;
        if (d.life_is_worthwhile)
		{
        	d.life_is_worthwhile_agree = +d.life_is_worthwhile.agree;
        	d.life_is_worthwhile_strongly_agree = +d.life_is_worthwhile.strongly_agree;
        	d.life_is_worthwhile_total = +(d.life_is_worthwhile_agree + d.life_is_worthwhile_strongly_agree)
		}
        if (d.mental_health_index) {d.mental_health_index = +d.mental_health_index;}
        d.pers_relationships_satisfaction = +d.pers_relationships_satisfaction;
        d.job_satisfaction = +d.job_satisfaction;
        d.green_areas_satisfaction = +d.green_areas_satisfaction;
        if (d.close_to_neighbours)
        {
            d.close_to_neighbours_agree = +d.close_to_neighbours.agree;
            d.close_to_neighbours_strongly_agree = +d.close_to_neighbours.strongly_agree;
            d.close_to_neighbours_total = +(d.close_to_neighbours_agree + d.close_to_neighbours_strongly_agree);
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
			d.happiness_high = +(d.happiness_9 + d.happiness_happy);
		}
        d.loneliness = +d.loneliness;
    });

    //Create event listeners
    $(document).ready(function()
    {
        $("#select-happiness-rating").on( "change", selectHappinessRating);
        $("#select-personal-finance").on( "change", selectPersonalFinance);
        $("#select-life-worthwhileness").on( "change", selectLifeWorthwhileness);
        $("#select-neighbourhood").on( "change", selectNeighbourhood);
        $('.chart-title button').on("click", sortChart);

    });

    //Create a Crossfilter instance
    var ndx = crossfilter(europeStatsWellbeing);

    //Define Dimensions
    var lifeSatDim = ndx.dimension(function(d) {return d.country;});
    var personalFinanceDim = ndx.dimension(function(d) {return d.country;});
    var happinessDim = ndx.dimension(function(d) { if (d.happiness) {return d.country;} else { return "undefined";}});
    var neighbourhoodDim = ndx.dimension(function(d) { if (d.close_to_neighbours) {return d.country;} else { return "undefined";}});
    var lifeWorthwhilenessDim = ndx.dimension(function(d) { if (d.life_is_worthwhile) {return d.country;} else { return "undefined";}});
    var goodHealthDim = ndx.dimension(function(d) { if (d.good_health) {return d.country;} else { return "undefined";}});
    var mentalHealthDim = ndx.dimension(function(d) { if (d.mental_health_index) {return d.country;} else { return "undefined";}});
    var netIncomeDim = ndx.dimension(function(d) {return d.country;});

    //Get top 10 values for row charts
    function getTops(source_group) {
        return {
            all: function () {
                return source_group.top(10);
            }
        };
    }

	//Define Groups
    var lifeSatGroup = lifeSatDim.group().reduceSum(function(d) {return d.life_satisfaction;});
    var happinessUnhappyGroup = happinessDim.group().reduceSum(function(d) {return d.happiness_extremely_unhappy;});
    var happinessOneGroup = happinessDim.group().reduceSum(function(d) {return d.happiness_1;});
    var happinessTwoGroup = happinessDim.group().reduceSum(function(d) {return d.happiness_2;});
    var happinessThreeGroup = happinessDim.group().reduceSum(function(d) {return d.happiness_3;});
    var happinessFourGroup = happinessDim.group().reduceSum(function(d) {return d.happiness_4;});
    var happinessFiveGroup = happinessDim.group().reduceSum(function(d) {return d.happiness_5;});
    var happinessSixGroup = happinessDim.group().reduceSum(function(d) {return d.happiness_6;});
    var happinessSevenGroup = happinessDim.group().reduceSum(function(d) {return d.happiness_7;});
    var happinessEightGroup = happinessDim.group().reduceSum(function(d) {return d.happiness_8;});
    var happinessNineGroup = happinessDim.group().reduceSum(function(d) {return d.happiness_9;});
    var happinessHappyGroup = happinessDim.group().reduceSum(function(d) {return d.happiness_happy;});
    var happinessHighGroup = happinessDim.group().reduceSum(function(d) {return d.happiness_high;});
    var endsMeetGroup = personalFinanceDim.group().reduceSum(function(d) {return d.ends_meet;});
    var riskOfPovertyGroup = personalFinanceDim.group().reduceSum(function(d) {return d.risk_of_poverty;});
    var jobSatisfactionGroup = personalFinanceDim.group().reduceSum(function(d) {return d.job_satisfaction;});
    var financesSatisfactionGroup = personalFinanceDim.group().reduceSum(function(d) {return d.finances_satisfaction;});
    var closeToNeighboursAgreeGroup = neighbourhoodDim.group().reduceSum(function(d) {return d.close_to_neighbours_agree;});
    var closeToNeighboursStronglyAgreeGroup = neighbourhoodDim.group().reduceSum(function(d) {return d.close_to_neighbours_strongly_agree;});
    var closeToNeighboursTotalGroup = neighbourhoodDim.group().reduceSum(function(d) {return d.close_to_neighbours_total;});
    var lifeWorthwhilenessAgreeGroup = lifeWorthwhilenessDim.group().reduceSum(function(d) {return d.life_is_worthwhile_agree;});
    var lifeWorthwhilenessStronglyAgreeGroup = lifeWorthwhilenessDim.group().reduceSum(function(d) {return d.life_is_worthwhile_strongly_agree;});
    var lifeWorthwhilenessTotalGroup = lifeWorthwhilenessDim.group().reduceSum(function(d) {return d.life_is_worthwhile_total;});
    var goodHealthGroup = goodHealthDim.group().reduceSum(function(d) {return d.good_health;});
    var mentalHealthGroup = mentalHealthDim.group().reduceSum(function(d) {return d.mental_health_index;});
    var netIncomeGroup = netIncomeDim.group().reduceSum(function(d) {return d.net_income;});
    var netIncomeGroupTop = getTops(netIncomeGroup);

    //Define domains for sorting charts by values
    var jobSatisfactionByValue = [];
    jobSatisfactionGroup.top(Infinity).forEach(function (d) {jobSatisfactionByValue.push(d.key);});

    var financesSatisfactionByValue = [];
    financesSatisfactionGroup.top(Infinity).forEach(function (d) {financesSatisfactionByValue.push(d.key);});

    var riskOfPovertyByValue = [];
    riskOfPovertyGroup.top(Infinity).forEach(function (d) {riskOfPovertyByValue.push(d.key);});

    var endsMeetByValue = [];
    endsMeetGroup.top(Infinity).forEach(function (d) {endsMeetByValue.push(d.key);});

    var lifeWorthwhilenessTotalByValue = [];
    lifeWorthwhilenessTotalGroup.top(Infinity).forEach(function (d) {lifeWorthwhilenessTotalByValue.push(d.key);});

    var lifeWorthwhilenessStronglyAgreeByValue = [];
    lifeWorthwhilenessStronglyAgreeGroup.top(Infinity).forEach(function (d) {lifeWorthwhilenessStronglyAgreeByValue.push(d.key);});

    var lifeWorthwhilenessAgreeByValue = [];
    lifeWorthwhilenessAgreeGroup.top(Infinity).forEach(function (d) {lifeWorthwhilenessAgreeByValue.push(d.key);});

    var closeToNeighboursTotalByValue = [];
    closeToNeighboursTotalGroup.top(Infinity).forEach(function (d) {closeToNeighboursTotalByValue.push(d.key);});

    var closeToNeighboursStronglyAgreeByValue = [];
    closeToNeighboursStronglyAgreeGroup.top(Infinity).forEach(function (d) {closeToNeighboursStronglyAgreeByValue.push(d.key);});

    var closeToNeighboursAgreeByValue = [];
    closeToNeighboursAgreeGroup.top(Infinity).forEach(function (d) {closeToNeighboursAgreeByValue.push(d.key);});

    var happinessHighByValue = [];
    happinessHighGroup.top(Infinity).forEach(function (d) {if (!isNaN(d.value)) {happinessHighByValue.push(d.key)}});

    var happinessHappyByValue = [];
    happinessHappyGroup.top(Infinity).forEach(function (d) {if (!isNaN(d.value)) {happinessHappyByValue.push(d.key)}});

    var happinessNineByValue = [];
    happinessNineGroup.top(Infinity).forEach(function (d) {if (!isNaN(d.value)) {happinessNineByValue.push(d.key)}});

    var happinessSevenByValue = [];
    happinessSevenGroup.top(Infinity).forEach(function (d) {if (!isNaN(d.value)) {happinessSevenByValue.push(d.key)}});

    var happinessEightByValue = [];
    happinessEightGroup.top(Infinity).forEach(function (d) {if (!isNaN(d.value)) {happinessEightByValue.push(d.key)}});

    var happinessSixByValue = [];
    happinessSixGroup.top(Infinity).forEach(function (d) {if (!isNaN(d.value)) {happinessSixByValue.push(d.key)}});

    var happinessFiveByValue = [];
    happinessFiveGroup.top(Infinity).forEach(function (d) {if (!isNaN(d.value)) {happinessFiveByValue.push(d.key)}});

    var happinessFourByValue = [];
    happinessFourGroup.top(Infinity).forEach(function (d) {if (!isNaN(d.value)) {happinessFourByValue.push(d.key)}});

    var happinessThreeByValue = [];
    happinessThreeGroup.top(Infinity).forEach(function (d) {if (!isNaN(d.value)) {happinessThreeByValue.push(d.key)}});

    var happinessTwoByValue = [];
    happinessTwoGroup.top(Infinity).forEach(function (d) {if (!isNaN(d.value)) {happinessTwoByValue.push(d.key)}});

    var happinessOneByValue = [];
    happinessOneGroup.top(Infinity).forEach(function (d) {if (!isNaN(d.value)) {happinessOneByValue.push(d.key)}});

    var happinessUnhappyByValue = [];
    happinessUnhappyGroup.top(Infinity).forEach(function (d) {if (!isNaN(d.value)) {happinessUnhappyByValue.push(d.key)}});

    //Charts
    var lifeSatisfactionChart = dc.geoChoroplethChart("#life-satisfaction-map");
	var happinessChart = dc.barChart('#happiness-chart');
    var personalFinanceChart = dc.barChart('#personal-finance-chart');
    var neighbourhoodChart = dc.barChart('#neighbourhood-chart');
    var lifeWorthwhilenessChart = dc.barChart('#life-worthwhileness-chart');
    var healthChart = dc.lineChart('#health-chart');
    var netIncomeChart = dc.rowChart('#net-income-chart');


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
		.width(600)
		.height(200)
		.margins({top: 10, right: 50, bottom: 75, left: 50})
		.brushOn(false)
		.dimension(happinessDim)
		.group(happinessHighGroup)
        .title(function (p){return p["key"] + ": " + p["value"] + "%";})
        .elasticY(true)
		.transitionDuration(500)
		.x(d3.scale.ordinal().domain(happinessHighByValue))
		.xUnits(dc.units.ordinal)
        .transitionDuration(800)
        .yAxisLabel("percentage %")
		.yAxis().ticks(4);


    function selectHappinessRating()
	{
        var chartTitle = $('#happiness-chart').parent().prev('div').prev('div').children('p');

	    if ($(this).val() == "high")
        {
            happinessChart.group(happinessHighGroup).x(d3.scale.ordinal().domain(happinessHighByValue)).render();
            chartTitle.text('Rating of happiness as high - 2014');
        }
        else if ($(this).val() == "ten")
        {
            happinessChart.group(happinessHappyGroup).x(d3.scale.ordinal().domain(happinessHappyByValue)).render();
            chartTitle.text('Rating of happiness as extremely happy - 2014');
        }
        else if ($(this).val() == "nine")
        {
            happinessChart.group(happinessNineGroup).x(d3.scale.ordinal().domain(happinessNineByValue)).render();
            chartTitle.text('Rating of happiness as 9 out of 10 - 2014');
        }
        else if ($(this).val() == "eight")
        {
            happinessChart.group(happinessEightGroup).x(d3.scale.ordinal().domain(happinessEightByValue)).render();
            chartTitle.text('Rating of happiness as 8 out of 10 - 2014');
        }
        else if ($(this).val() == "seven")
        {
            happinessChart.group(happinessSevenGroup).x(d3.scale.ordinal().domain(happinessSevenByValue)).render();
            chartTitle.text('Rating of happiness as 7 out of 10 - 2014');
        }
        else if ($(this).val() == "six")
        {
            happinessChart.group(happinessSixGroup).x(d3.scale.ordinal().domain(happinessSixByValue)).render();
            chartTitle.text('Rating of happiness as 6 out of 10 - 2014');
        }
        else if ($(this).val() == "five")
        {
            happinessChart.group(happinessFiveGroup).x(d3.scale.ordinal().domain(happinessFiveByValue)).render();
            chartTitle.text('Rating of happiness as 5 out of 10 - 2014');
        }
        else if ($(this).val() == "four")
        {
            happinessChart.group(happinessFourGroup).x(d3.scale.ordinal().domain(happinessFourByValue)).render();
            chartTitle.text('Rating of happiness as 4 out of 10 - 2014');
        }
        else if ($(this).val() == "three")
        {
            happinessChart.group(happinessThreeGroup).x(d3.scale.ordinal().domain(happinessThreeByValue)).render();
            chartTitle.text('Rating of happiness as 3 out of 10 - 2014');
        }
        else if ($(this).val() == "two")
        {
            happinessChart.group(happinessTwoGroup).x(d3.scale.ordinal().domain(happinessTwoByValue)).render();
            chartTitle.text('Rating of happiness as 2 out of 10 - 2014');
        }
        else if ($(this).val() == "one")
        {
            happinessChart.group(happinessOneGroup).x(d3.scale.ordinal().domain(happinessOneByValue)).render();
            chartTitle.text('Rating of happiness as 1 out of 10 - 2014');
        }
        else if ($(this).val() == "zero")
        {
            happinessChart.group(happinessUnhappyGroup).x(d3.scale.ordinal().domain(happinessUnhappyByValue)).render();
            chartTitle.text('Rating of happiness as extremely unhappy - 2014');
        }
	}


	netIncomeChart
    	.width(300).height(300)
		.margins({top: 20, left: 10, right: 10, bottom: 33})
		.gap(2)
		.elasticX(true)
		.dimension(netIncomeDim)
		.group(netIncomeGroupTop)
        .title(function (p){return p["key"] + ": " + d3.format(",d")(p["value"]) + " PPS";})
		.ordering(function(d) { return -d.value })
        .xAxis().ticks(4);


	personalFinanceChart
		.width(790)
		.height(200)
		.margins({top: 10, right: 50, bottom: 75, left: 50})
		.x(d3.scale.ordinal().domain(jobSatisfactionByValue))
		.xUnits(dc.units.ordinal)
        .title(function (p){return p["key"] + ": " + p["value"] + "%";})
        .elasticY(true)
		.brushOn(false)
		.dimension(personalFinanceDim)
		.group(jobSatisfactionGroup)
        .transitionDuration(800)
        .yAxisLabel("percentage %")
    	.yAxis().ticks(4);


    function selectPersonalFinance()
	{
        var chartTitle = $('#personal-finance-chart').parent().prev('div').children('p');

	    if ($(this).val() == "job-satisfaction")
        {
            personalFinanceChart.group(jobSatisfactionGroup).x(d3.scale.ordinal().domain(jobSatisfactionByValue)).render();
            chartTitle.text('Percentage of the population rating their satisfaction with their job as high - 2013');
        }
        else if ($(this).val() == "finances-satisfaction")
        {
            personalFinanceChart.group(financesSatisfactionGroup).x(d3.scale.ordinal().domain(financesSatisfactionByValue)).render();
            chartTitle.text('High satisfaction with financial situation - 2013');
        }
        else if ($(this).val() == "at-poverty-risk")
        {
            personalFinanceChart.group(riskOfPovertyGroup).x(d3.scale.ordinal().domain(riskOfPovertyByValue)).render();
            chartTitle.text('At-risk-of-poverty rate - 2015');
        }
        else if ($(this).val() == "ends-meet")
        {
            personalFinanceChart.group(endsMeetGroup).x(d3.scale.ordinal().domain(endsMeetByValue)).render();
            chartTitle.text('Inability to make ends meet with great difficulty or difficulty - 2015');
        }
	}


	lifeWorthwhilenessChart
		.width(770)
		.height(250)
		.margins({top: 10, right: 50, bottom: 75, left: 50})
		.x(d3.scale.ordinal().domain(lifeWorthwhilenessTotalByValue))
		.xUnits(dc.units.ordinal)
		.brushOn(false)
        .elasticY(true)
        .title(function (p){return p["key"] + ": " + p["value"] + "%";})
		.dimension(lifeWorthwhilenessDim)
		.group(lifeWorthwhilenessAgreeGroup)
		.stack(lifeWorthwhilenessStronglyAgreeGroup)
        .transitionDuration(800)
        .yAxisLabel("percentage %")
    	.yAxis().ticks(4);


    function selectLifeWorthwhileness()
	{
        var chartTitle = $('#life-worthwhileness-chart').parent().prev('div').prev('div').children('p');

	    if ($(this).val() == "agree-or-strongly-agree")
        {
            lifeWorthwhilenessChart
                .group(lifeWorthwhilenessAgreeGroup)
                .stack(lifeWorthwhilenessStronglyAgreeGroup)
                .x(d3.scale.ordinal().domain(lifeWorthwhilenessTotalByValue))
                .render();
            chartTitle.text('I strongly agree or agree what I do in life is worthwhile - 2012');
        }
        else if ($(this).val() == "strongly-agree")
        {
            lifeWorthwhilenessChart.group(lifeWorthwhilenessStronglyAgreeGroup).x(d3.scale.ordinal().domain(lifeWorthwhilenessStronglyAgreeByValue)).render();
            chartTitle.text('I strongly agree what I do in life is worthwhile - 2012');
        }
        else if ($(this).val() == "agree")
        {
            lifeWorthwhilenessChart.group(lifeWorthwhilenessAgreeGroup).x(d3.scale.ordinal().domain(lifeWorthwhilenessAgreeByValue)).render();
            chartTitle.text('I agree what I do in life is worthwhile - 2012');
        }
	}


    neighbourhoodChart
		.width(770)
		.height(250)
		.margins({top: 10, right: 50, bottom: 75, left: 50})
		.x(d3.scale.ordinal().domain(closeToNeighboursTotalByValue))
		.xUnits(dc.units.ordinal)
		.brushOn(false)
        .elasticY(true)
        .title(function (p){return p["key"] + ": " + p["value"] + "%";})
		.dimension(neighbourhoodDim)
		.group(closeToNeighboursAgreeGroup)
		.stack(closeToNeighboursStronglyAgreeGroup)
        .transitionDuration(800)
        .yAxisLabel("percentage %")
    	.yAxis().ticks(4);


    function selectNeighbourhood()
	{
        var chartTitle = $('#neighbourhood-chart').parent().prev('div').prev('div').children('p');

	    if ($(this).val() == "agree-or-strongly-agree")
        {
            neighbourhoodChart
                .group(closeToNeighboursAgreeGroup)
                .stack(closeToNeighboursStronglyAgreeGroup)
                .x(d3.scale.ordinal().domain(closeToNeighboursTotalByValue))
                .render();
            chartTitle.text('Feeling close to people in the area where I live - 2012');
        }
        else if ($(this).val() == "strongly-agree")
        {
            neighbourhoodChart.group(closeToNeighboursStronglyAgreeGroup).x(d3.scale.ordinal().domain(closeToNeighboursStronglyAgreeByValue)).render();
            chartTitle.text('I strongly agree that I feel close to people in the area where I live - 2012');
        }
        else if ($(this).val() == "agree")
        {
            neighbourhoodChart.group(closeToNeighboursAgreeGroup).x(d3.scale.ordinal().domain(closeToNeighboursAgreeByValue)).render();
            chartTitle.text('I agree that I feel close to people in the area where I live - 2012');
        }
	}


	healthChart
        .width(768)
		.height(250)
		.margins({top: 10, right: 50, bottom: 75, left: 50})
		.x(d3.scale.ordinal())
		.xUnits(dc.units.ordinal)
		.renderHorizontalGridLines(true)
		.brushOn(false)
        .renderArea(true)
        .elasticY(true)
        .title(function (p){return p["key"] + ": " + p["value"] + "%";})
        .transitionDuration(800)
		.dimension(goodHealthDim)
		.group(goodHealthGroup)
        .defined(function(d) { return !isNaN(d.y)})
        .yAxisLabel("percentage %")
    	.yAxis().ticks(4);


    function sortChart() {

        if ($(this).parent().next('div').children().attr('id') == "personal-finance-chart") {
            var SelectedOptionPersonalFinance = $('select#select-personal-finance option:checked');
            if ($(this).hasClass('sort-by-value')) {
                if (SelectedOptionPersonalFinance.val() == "job-satisfaction") {
                    personalFinanceChart.x(d3.scale.ordinal().domain(jobSatisfactionByValue)).render();
                }
                else if (SelectedOptionPersonalFinance.val() == "finances-satisfaction") {
                    personalFinanceChart.x(d3.scale.ordinal().domain(financesSatisfactionByValue)).render();
                }
                else if (SelectedOptionPersonalFinance.val() == "at-poverty-risk") {
                    personalFinanceChart.x(d3.scale.ordinal().domain(riskOfPovertyByValue)).render();
                }
                else if (SelectedOptionPersonalFinance.val() == "ends-meet") {
                    personalFinanceChart.x(d3.scale.ordinal().domain(endsMeetByValue)).render();
                }
            }
            else if ($(this).hasClass('sort-by-country')) {
                personalFinanceChart.x(d3.scale.ordinal()).render();
            }
        }

        if ($(this).parent().next('div').children().attr('id') == "happiness-chart") {
            var selectedOptionHappiness = $('select#select-happiness-rating option:checked');
            if ($(this).hasClass('sort-by-value')) {
                if (selectedOptionHappiness.val() == "high") {
                    happinessChart.x(d3.scale.ordinal().domain(happinessHighByValue)).render();
                }
                else if (selectedOptionHappiness.val() == "ten") {
                    happinessChart.x(d3.scale.ordinal().domain(happinessHappyByValue)).render();
                }
                else if (selectedOptionHappiness.val() == "nine") {
                    happinessChart.x(d3.scale.ordinal().domain(happinessNineByValue)).render();
                }
                else if (selectedOptionHappiness.val() == "eight") {
                    happinessChart.x(d3.scale.ordinal().domain(happinessEightByValue)).render();
                }
                else if (selectedOptionHappiness.val() == "seven") {
                    happinessChart.x(d3.scale.ordinal().domain(happinessSevenByValue)).render();
                }
                else if (selectedOptionHappiness.val() == "six") {
                    happinessChart.x(d3.scale.ordinal().domain(happinessSixByValue)).render();
                }
                else if (selectedOptionHappiness.val() == "five") {
                    happinessChart.x(d3.scale.ordinal().domain(happinessFiveByValue)).render();
                }
                else if (selectedOptionHappiness.val() == "four") {
                    happinessChart.x(d3.scale.ordinal().domain(happinessFourByValue)).render();
                }
                else if (selectedOptionHappiness.val() == "three") {
                    happinessChart.x(d3.scale.ordinal().domain(happinessThreeByValue)).render();
                }
                else if (selectedOptionHappiness.val() == "two") {
                    happinessChart.x(d3.scale.ordinal().domain(happinessTwoByValue)).render();
                }
                else if (selectedOptionHappiness.val() == "one") {
                    happinessChart.x(d3.scale.ordinal().domain(happinessOneByValue)).render();
                }
                else if (selectedOptionHappiness.val() == "zero") {
                    happinessChart.x(d3.scale.ordinal().domain(happinessUnhappyByValue)).render();
                }
            }
            else if ($(this).hasClass('sort-by-country')) {
                happinessChart.x(d3.scale.ordinal()).render();
            }
        }

         if ($(this).parent().next('div').children().attr('id') == "life-worthwhileness-chart") {
            var SelectedOptionLifeWorthwhileness = $('select#select-life-worthwhileness option:checked');
            if ($(this).hasClass('sort-by-value')) {
                if (SelectedOptionLifeWorthwhileness.val() == "agree-or-strongly-agree") {
                    lifeWorthwhilenessChart.x(d3.scale.ordinal().domain(lifeWorthwhilenessTotalByValue)).render();
                }
                else if (SelectedOptionLifeWorthwhileness.val() == "strongly-agree") {
                    lifeWorthwhilenessChart.x(d3.scale.ordinal().domain(lifeWorthwhilenessStronglyAgreeByValue)).render();
                }
                else if (SelectedOptionLifeWorthwhileness.val() == "agree") {
                    lifeWorthwhilenessChart.x(d3.scale.ordinal().domain(lifeWorthwhilenessAgreeByValue)).render();
                }
            }
            else if ($(this).hasClass('sort-by-country')) {
                lifeWorthwhilenessChart.x(d3.scale.ordinal()).render();
            }
        }

        if ($(this).parent().next('div').children().attr('id') == "neighbourhood-chart") {
            var SelectedOptionNeighbourhood = $('select#select-neighbourhood option:checked');
            if ($(this).hasClass('sort-by-value')) {
                if (SelectedOptionNeighbourhood.val() == "agree-or-strongly-agree") {
                    neighbourhoodChart.x(d3.scale.ordinal().domain(closeToNeighboursTotalByValue)).render();
                }
                else if (SelectedOptionNeighbourhood.val() == "strongly-agree") {
                    neighbourhoodChart.x(d3.scale.ordinal().domain(closeToNeighboursStronglyAgreeByValue)).render();
                }
                else if (SelectedOptionNeighbourhood.val() == "agree") {
                    neighbourhoodChart.x(d3.scale.ordinal().domain(closeToNeighboursAgreeByValue)).render();
                }
            }
            else if ($(this).hasClass('sort-by-country')) {
                neighbourhoodChart.x(d3.scale.ordinal()).render();
            }
        }
    }


    dc.renderAll();

}