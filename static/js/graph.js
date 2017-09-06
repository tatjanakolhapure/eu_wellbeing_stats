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
        if (d.soc_support) {d.social_support = +d.soc_support;}
        d.life_expectancy_both = +d.life_expectancy.both;
        d.life_expectancy_female = +d.life_expectancy.female;
        d.life_expectancy_male = +d.life_expectancy.male;
        if (d.good_health) {d.good_health = +d.good_health;}
        if(d.unemployment_rate) {d.unemployment_rate = +d.unemployment_rate;}
        if (d.feel_safe) { d.feel_safe = +d.feel_safe;}
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
        if (d.loneliness) {d.loneliness = +d.loneliness;}
    });

    //Create a Crossfilter instance
    var ndx = crossfilter(europeStatsWellbeing);

    //Define Dimensions
    var lifeSatDim = ndx.dimension(function(d) {return d.country;});
    var personalFinanceDim = ndx.dimension(function(d) {return d.country;});
    var happinessDim = ndx.dimension(function(d) {if (d.happiness) {return d.country;} else { return "undefined";}});
    var neighbourhoodDim = ndx.dimension(function(d) {if (d.close_to_neighbours) {return d.country;} else { return "undefined";}});
    var lifeWorthwhilenessDim = ndx.dimension(function(d) {if (d.life_is_worthwhile) {return d.country;} else { return "undefined";}});
    var goodHealthDim = ndx.dimension(function(d) {if (d.good_health) {return d.country;} else { return "undefined";}});
    var mentalHealthDim = ndx.dimension(function(d) {if (d.mental_health_index) {return d.country;} else { return "undefined";}});
    var netIncomeDim = ndx.dimension(function(d) {return d.country;});
    var unemploymentDim = ndx.dimension(function(d) {if (d.unemployment_rate) {return d.country;} else { return "undefined";}});
    var whereEuropeansLiveDim = ndx.dimension(function(d) {return d.country;});
    var feelSafeDim = ndx.dimension(function(d) {if (d.feel_safe) {return d.country;} else { return "undefined";}});
    var socialSupportDim = ndx.dimension(function(d) {if (d.social_support) {return d.country;} else { return "undefined";}});
    var relationshipsSatDim = ndx.dimension(function(d) {return d.country;});
    var lonelinessDim = ndx.dimension(function(d) {if (d.loneliness) {return d.country;} else { return "undefined";}});

    //Get top 10 values for row charts
    function getTops(source_group) {
        return {
            all: function () {
                return source_group.top(10);
            }
        };
    }

    function remove_empty_bins(source_group) {
        return {
            all:function () {
                return source_group.all().filter(function(d) {
                    return !isNaN(d.value);
                });
            }
        };
    }

	//Define Groups
    var lifeSatGroup = lifeSatDim.group().reduceSum(function(d) {return d.life_satisfaction;});
    var happinessUnhappyGroup = happinessDim.group().reduceSum(function(d) {return d.happiness_extremely_unhappy;});
    var happinessUnhappyGroupFiltered = remove_empty_bins(happinessUnhappyGroup);
    var happinessOneGroup = happinessDim.group().reduceSum(function(d) {return d.happiness_1;});
    var happinessOneGroupFiltered = remove_empty_bins(happinessOneGroup);
    var happinessTwoGroup = happinessDim.group().reduceSum(function(d) {return d.happiness_2;});
    var happinessTwoGroupFiltered = remove_empty_bins(happinessTwoGroup);
    var happinessThreeGroup = happinessDim.group().reduceSum(function(d) {return d.happiness_3;});
    var happinessThreeGroupFiltered = remove_empty_bins(happinessThreeGroup);
    var happinessFourGroup = happinessDim.group().reduceSum(function(d) {return d.happiness_4;});
    var happinessFourGroupFiltered = remove_empty_bins(happinessFourGroup);
    var happinessFiveGroup = happinessDim.group().reduceSum(function(d) {return d.happiness_5;});
    var happinessFiveGroupFiltered = remove_empty_bins(happinessFiveGroup);
    var happinessSixGroup = happinessDim.group().reduceSum(function(d) {return d.happiness_6;});
    var happinessSixGroupFiltered = remove_empty_bins(happinessSixGroup);
    var happinessSevenGroup = happinessDim.group().reduceSum(function(d) {return d.happiness_7;});
    var happinessSevenGroupFiltered = remove_empty_bins(happinessSevenGroup);
    var happinessEightGroup = happinessDim.group().reduceSum(function(d) {return d.happiness_8;});
    var happinessEightGroupFiltered = remove_empty_bins(happinessEightGroup);
    var happinessNineGroup = happinessDim.group().reduceSum(function(d) {return d.happiness_9;});
    var happinessNineGroupFiltered = remove_empty_bins(happinessNineGroup);
    var happinessHappyGroup = happinessDim.group().reduceSum(function(d) {return d.happiness_happy;});
    var happinessHappyGroupFiltered = remove_empty_bins(happinessHappyGroup);
    var happinessHighGroup = happinessDim.group().reduceSum(function(d) {return d.happiness_high;});
    var happinessHighGroupFiltered = remove_empty_bins(happinessHighGroup);
    var endsMeetGroup = personalFinanceDim.group().reduceSum(function(d) {return d.ends_meet;});
    var riskOfPovertyGroup = personalFinanceDim.group().reduceSum(function(d) {return d.risk_of_poverty;});
    var jobSatisfactionGroup = personalFinanceDim.group().reduceSum(function(d) {return d.job_satisfaction;});
    var financesSatisfactionGroup = personalFinanceDim.group().reduceSum(function(d) {return d.finances_satisfaction;});
    var closeToNeighboursAgreeGroup = neighbourhoodDim.group().reduceSum(function(d) {return d.close_to_neighbours_agree;});
    var closeToNeighboursAgreeGroupFiltered = remove_empty_bins(closeToNeighboursAgreeGroup);
    var closeToNeighboursStronglyAgreeGroup = neighbourhoodDim.group().reduceSum(function(d) {return d.close_to_neighbours_strongly_agree;});
    var closeToNeighboursStronglyAgreeGroupFiltered = remove_empty_bins(closeToNeighboursStronglyAgreeGroup);
    var closeToNeighboursTotalGroup = neighbourhoodDim.group().reduceSum(function(d) {return d.close_to_neighbours_total;});
    var lifeWorthwhilenessAgreeGroup = lifeWorthwhilenessDim.group().reduceSum(function(d) {return d.life_is_worthwhile_agree;});
    var lifeWorthwhilenessAgreeGroupFiltered = remove_empty_bins(lifeWorthwhilenessAgreeGroup);
    var lifeWorthwhilenessStronglyAgreeGroup = lifeWorthwhilenessDim.group().reduceSum(function(d) {return d.life_is_worthwhile_strongly_agree;});
    var lifeWorthwhilenessStronglyAgreeGroupFiltered = remove_empty_bins(lifeWorthwhilenessStronglyAgreeGroup);
    var lifeWorthwhilenessTotalGroup = lifeWorthwhilenessDim.group().reduceSum(function(d) {return d.life_is_worthwhile_total;});
    var goodHealthGroup = goodHealthDim.group().reduceSum(function(d) {return d.good_health;});
    var mentalHealthGroup = mentalHealthDim.group().reduceSum(function(d) {return d.mental_health_index;});
    var netIncomeGroup = netIncomeDim.group().reduceSum(function(d) {return d.net_income;});
    var netIncomeGroupTop = getTops(netIncomeGroup);
    var unemploymentGroup = unemploymentDim.group().reduceSum(function(d) {return d.unemployment_rate;});
    var unemploymentGroupTop = getTops(unemploymentGroup);
    var accommodationSatGroup = whereEuropeansLiveDim.group().reduceSum(function(d) {return d.accommodation_satisfaction;});
    var accommodationSatGroupFiltered = remove_empty_bins(accommodationSatGroup);
    var feelSafeGroup = feelSafeDim.group().reduceSum(function(d) {return d.feel_safe;});
    var feelSafeGroupFiltered = remove_empty_bins(feelSafeGroup);
    var greenAreasSatGroup = whereEuropeansLiveDim.group().reduceSum(function(d) {return d.green_areas_satisfaction;});
    var greenAreasSatGroupFiltered = remove_empty_bins(greenAreasSatGroup);
    var socialSupportGroup = socialSupportDim.group().reduceSum(function(d) {return d.social_support;});
    var socialSupportGroupFiltered = remove_empty_bins(socialSupportGroup);
    var relationshipsSatGroup = relationshipsSatDim.group().reduceSum(function(d) {return d.pers_relationships_satisfaction;});
    var relationshipsSatGroupFiltered = remove_empty_bins(relationshipsSatGroup);
    var lonelinessGroup = lonelinessDim.group().reduceSum(function(d) {return d.loneliness;});
    var lonelinessGroupFiltered = remove_empty_bins(lonelinessGroup);

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
    lifeWorthwhilenessTotalGroup.top(Infinity).forEach(function (d) { if (!isNaN(d.value)) {lifeWorthwhilenessTotalByValue.push(d.key);}});

    var lifeWorthwhilenessStronglyAgreeByValue = [];
    lifeWorthwhilenessStronglyAgreeGroup.top(Infinity).forEach(function (d) { if (!isNaN(d.value)) {lifeWorthwhilenessStronglyAgreeByValue.push(d.key);}});

    var lifeWorthwhilenessAgreeByValue = [];
    lifeWorthwhilenessAgreeGroup.top(Infinity).forEach(function (d) { if (!isNaN(d.value)) {lifeWorthwhilenessAgreeByValue.push(d.key);}});

    var closeToNeighboursTotalByValue = [];
    closeToNeighboursTotalGroup.top(Infinity).forEach(function (d) { if (!isNaN(d.value)) {closeToNeighboursTotalByValue.push(d.key);}});

    var closeToNeighboursStronglyAgreeByValue = [];
    closeToNeighboursStronglyAgreeGroup.top(Infinity).forEach(function (d) { if (!isNaN(d.value)) {closeToNeighboursStronglyAgreeByValue.push(d.key);}});

    var closeToNeighboursAgreeByValue = [];
    closeToNeighboursAgreeGroup.top(Infinity).forEach(function (d) { if (!isNaN(d.value)) {closeToNeighboursAgreeByValue.push(d.key);}});

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

    var accommodationSatByValue = [];
    accommodationSatGroup.top(Infinity).forEach(function (d) {accommodationSatByValue.push(d.key)});

    var feelSafeByValue = [];
    feelSafeGroup.top(Infinity).forEach(function (d) {if (!isNaN(d.value)) {feelSafeByValue.push(d.key)}});

    var greenAreasSatByValue = [];
    greenAreasSatGroup.top(Infinity).forEach(function (d) {greenAreasSatByValue.push(d.key)});

    var socialSupportByValue = [];
    socialSupportGroup.top(Infinity).forEach(function (d) {if (!isNaN(d.value)) {socialSupportByValue.push(d.key)}});

    var relationshipsSatByValue = [];
    relationshipsSatGroup.top(Infinity).forEach(function (d) {relationshipsSatByValue.push(d.key)});

    var lonelinessByValue = [];
    lonelinessGroup.top(Infinity).forEach(function (d) {if (!isNaN(d.value)) {lonelinessByValue.push(d.key)}});

    //Charts
    var lifeSatisfactionChart = dc.geoChoroplethChart("#life-satisfaction-map");
	var happinessChart = dc.barChart('#happiness-chart');
    var personalFinanceChart = dc.barChart('#personal-finance-chart');
    var neighbourhoodChart = dc.barChart('#neighbourhood-chart');
    var lifeWorthwhilenessChart = dc.barChart('#life-worthwhileness-chart');
    var healthChart = dc.lineChart('#health-chart');
    var netIncomeChart = dc.rowChart('#net-income-chart');
    var unemploymentChart = dc.rowChart('#unemployment-rate-chart');
    var whereEuropeansLiveChart = dc.barChart('#where-europeans-live-chart');
    var relationshipsChart = dc.barChart('#relationships-chart');

    //Create event listeners
    $(document).ready(function()
    {
        $("#select-happiness-rating").on( "change", selectHappinessRating);
        $("#select-personal-finance").on( "change", selectPersonalFinance);
        $("#select-life-worthwhileness").on( "change", selectLifeWorthwhileness);
        $("#select-neighbourhood").on( "change", selectNeighbourhood);
        $("#select-where-europeans-live").on( "change", selectWhereEuropeansLive);
        $("#select-relationships").on( "change", selectRelationships);
        $(".chart-title button").on("click", sortChart);
    });


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
		.width(550)
		.height(200)
		.margins({top: 10, right: 50, bottom: 75, left: 50})
		.brushOn(false)
		.dimension(happinessDim)
		.group(happinessHighGroupFiltered)
        .title(function (p){return p["key"] + ": " + p["value"] + "%";})
        .elasticY(true)
        .renderHorizontalGridLines(true)
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


    unemploymentChart
    	.width(300).height(300)
		.margins({top: 20, left: 10, right: 10, bottom: 33})
		.gap(2)
		.elasticX(true)
		.dimension(unemploymentDim)
		.group(unemploymentGroupTop)
        .title(function (p){return p["key"] + ": " + p["value"] + "%";})
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
        .renderHorizontalGridLines(true)
		.dimension(personalFinanceDim)
		.group(jobSatisfactionGroup)
        .transitionDuration(800)
        .yAxisLabel("percentage %")
    	.yAxis().ticks(4);


    function selectPersonalFinance()
	{
        var chartTitle = $('#personal-finance-chart').parent().prev('div').prev('div').children('p');

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
        .renderHorizontalGridLines(true)
        .title(function (p){return p["key"] + ": " + p["value"] + "%";})
		.dimension(lifeWorthwhilenessDim)
		.group(lifeWorthwhilenessAgreeGroupFiltered)
		.stack(lifeWorthwhilenessStronglyAgreeGroupFiltered)
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


	whereEuropeansLiveChart
		.width(790)
		.height(200)
		.margins({top: 10, right: 50, bottom: 75, left: 50})
		.x(d3.scale.ordinal().domain(accommodationSatByValue))
		.xUnits(dc.units.ordinal)
        .title(function (p){return p["key"] + ": " + p["value"] + "%";})
        .elasticY(true)
		.brushOn(false)
        .renderHorizontalGridLines(true)
		.dimension(whereEuropeansLiveDim)
		.group(accommodationSatGroup)
        .transitionDuration(800)
        .yAxisLabel("percentage %")
    	.yAxis().ticks(4);


    function selectWhereEuropeansLive()
	{
        var chartTitle = $('#where-europeans-live-chart').parent().prev('div').prev('div').children('p');

	    if ($(this).val() == "accommodation-satisfaction")
        {
            whereEuropeansLiveChart.width(790).group(accommodationSatGroup).x(d3.scale.ordinal().domain(accommodationSatByValue)).render();
            chartTitle.text('Percentage of the population rating their satisfaction with their accommodation as high - 2013');
        }
        else if ($(this).val() == "feel-safe")
        {
            whereEuropeansLiveChart.width(650).group(feelSafeGroup).x(d3.scale.ordinal().domain(feelSafeByValue)).render();
            chartTitle.text('Percentage of the population declaring feeling safe when walking alone at night in the city or area where they live - 2014');
        }
        else if ($(this).val() == "green-areas-satisfaction")
        {
            whereEuropeansLiveChart.width(790).group(greenAreasSatGroup).x(d3.scale.ordinal().domain(greenAreasSatByValue)).render();
            chartTitle.text('Percentage of the population rating their satisfaction with recreational and green areas as high - 2013');
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
        .renderHorizontalGridLines(true)
        .title(function (p){return p["key"] + ": " + p["value"] + "%";})
		.dimension(neighbourhoodDim)
		.group(closeToNeighboursAgreeGroupFiltered)
		.stack(closeToNeighboursStronglyAgreeGroupFiltered)
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


	relationshipsChart
		.width(790)
		.height(200)
		.margins({top: 10, right: 50, bottom: 75, left: 50})
		.x(d3.scale.ordinal().domain(relationshipsSatByValue))
		.xUnits(dc.units.ordinal)
        .title(function (p){return p["key"] + ": " + p["value"] + "%";})
        .elasticY(true)
		.brushOn(false)
        .renderHorizontalGridLines(true)
		.dimension(relationshipsSatDim)
		.group(relationshipsSatGroup)
        .transitionDuration(800)
        .yAxisLabel("percentage %")
    	.yAxis().ticks(4);


    function selectRelationships()
	{
        var chartTitle = $('#relationships-chart').parent().prev('div').prev('div').children('p');

	    if ($(this).val() == "relationships-satisfaction")
        {
            relationshipsChart.width(790).group(relationshipsSatGroup).x(d3.scale.ordinal().domain(relationshipsSatByValue)).render();
            chartTitle.text('Average rating of satisfaction with personal relationships (1-10) 2013');
        }
        else if ($(this).val() == "social-support")
        {
            relationshipsChart.width(670).group(socialSupportGroup).x(d3.scale.ordinal().domain(socialSupportByValue)).render();
            chartTitle.text('Perceived social network support - 2015');
        }
        else if ($(this).val() == "loneliness")
        {
            relationshipsChart.width(550).group(lonelinessGroup).x(d3.scale.ordinal().domain(lonelinessByValue)).render();
            chartTitle.text('Feeling lonely all or most of the time - 2014');
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
                    happinessChart.x(d3.scale.ordinal().domain(happinessHighByValue)).group(happinessHighGroup).render();
                }
                else if (selectedOptionHappiness.val() == "ten") {
                    happinessChart.x(d3.scale.ordinal().domain(happinessHappyByValue)).group(happinessHappyGroup).render();
                }
                else if (selectedOptionHappiness.val() == "nine") {
                    happinessChart.x(d3.scale.ordinal().domain(happinessNineByValue)).group(happinessNineGroup).render();
                }
                else if (selectedOptionHappiness.val() == "eight") {
                    happinessChart.x(d3.scale.ordinal().domain(happinessEightByValue)).group(happinessEightGroup).render();
                }
                else if (selectedOptionHappiness.val() == "seven") {
                    happinessChart.x(d3.scale.ordinal().domain(happinessSevenByValue)).group(happinessSevenGroup).render();
                }
                else if (selectedOptionHappiness.val() == "six") {
                    happinessChart.x(d3.scale.ordinal().domain(happinessSixByValue)).group(happinessSixGroup).render();
                }
                else if (selectedOptionHappiness.val() == "five") {
                    happinessChart.x(d3.scale.ordinal().domain(happinessFiveByValue)).group(happinessFiveGroup).render();
                }
                else if (selectedOptionHappiness.val() == "four") {
                    happinessChart.x(d3.scale.ordinal().domain(happinessFourByValue)).group(happinessFourGroup).render();
                }
                else if (selectedOptionHappiness.val() == "three") {
                    happinessChart.x(d3.scale.ordinal().domain(happinessThreeByValue)).group(happinessThreeGroup).render();
                }
                else if (selectedOptionHappiness.val() == "two") {
                    happinessChart.x(d3.scale.ordinal().domain(happinessTwoByValue)).group(happinessTwoGroup).render();
                }
                else if (selectedOptionHappiness.val() == "one") {
                    happinessChart.x(d3.scale.ordinal().domain(happinessOneByValue)).group(happinessOneGroup).render();
                }
                else if (selectedOptionHappiness.val() == "zero") {
                    happinessChart.x(d3.scale.ordinal().domain(happinessUnhappyByValue)).group(happinessUnhappyGroup).render();
                }
            }
            else if ($(this).hasClass('sort-by-country')) {
                if (selectedOptionHappiness.val() == "high") {
                    happinessChart.x(d3.scale.ordinal()).group(happinessHighGroupFiltered).render();
                }
                else if (selectedOptionHappiness.val() == "ten") {
                    happinessChart.x(d3.scale.ordinal()).group(happinessHappyGroupFiltered).render();
                }
                else if (selectedOptionHappiness.val() == "nine") {
                    happinessChart.x(d3.scale.ordinal()).group(happinessNineGroupFiltered).render();
                }
                else if (selectedOptionHappiness.val() == "eight") {
                    happinessChart.x(d3.scale.ordinal()).group(happinessEightGroupFiltered).render();
                }
                else if (selectedOptionHappiness.val() == "seven") {
                    happinessChart.x(d3.scale.ordinal()).group(happinessSevenGroupFiltered).render();
                }
                else if (selectedOptionHappiness.val() == "six") {
                    happinessChart.x(d3.scale.ordinal()).group(happinessSixGroupFiltered).render();
                }
                else if (selectedOptionHappiness.val() == "five") {
                    happinessChart.x(d3.scale.ordinal()).group(happinessFiveGroupFiltered).render();
                }
                else if (selectedOptionHappiness.val() == "four") {
                    happinessChart.x(d3.scale.ordinal()).group(happinessFourGroupFiltered).render();
                }
                else if (selectedOptionHappiness.val() == "three") {
                    happinessChart.x(d3.scale.ordinal()).group(happinessThreeGroupFiltered).render();
                }
                else if (selectedOptionHappiness.val() == "two") {
                    happinessChart.x(d3.scale.ordinal()).group(happinessTwoGroupFiltered).render();
                }
                else if (selectedOptionHappiness.val() == "one") {
                    happinessChart.x(d3.scale.ordinal()).group(happinessOneGroupFiltered).render();
                }
                else if (selectedOptionHappiness.val() == "zero") {
                    happinessChart.x(d3.scale.ordinal()).group(happinessUnhappyGroupFiltered).render();
                }
            }
        }

         if ($(this).parent().next('div').children().attr('id') == "life-worthwhileness-chart") {
            var SelectedOptionLifeWorthwhileness = $('select#select-life-worthwhileness option:checked');
            if ($(this).hasClass('sort-by-value')) {
                if (SelectedOptionLifeWorthwhileness.val() == "agree-or-strongly-agree") {
                    lifeWorthwhilenessChart
                        .x(d3.scale.ordinal().domain(lifeWorthwhilenessTotalByValue))
                        .group(lifeWorthwhilenessAgreeGroup)
                        .stack(lifeWorthwhilenessStronglyAgreeGroup)
                        .render();
                }
                else if (SelectedOptionLifeWorthwhileness.val() == "strongly-agree") {
                    lifeWorthwhilenessChart
                        .x(d3.scale.ordinal().domain(lifeWorthwhilenessStronglyAgreeByValue))
                        .group(lifeWorthwhilenessStronglyAgreeGroup)
                        .render();
                }
                else if (SelectedOptionLifeWorthwhileness.val() == "agree") {
                    lifeWorthwhilenessChart
                        .x(d3.scale.ordinal().domain(lifeWorthwhilenessAgreeByValue))
                        .group(lifeWorthwhilenessAgreeGroup)
                        .render();
                }
            }
            else if ($(this).hasClass('sort-by-country')) {
                if (SelectedOptionLifeWorthwhileness.val() == "agree-or-strongly-agree") {
                    lifeWorthwhilenessChart
                        .x(d3.scale.ordinal())
                        .group(lifeWorthwhilenessAgreeGroupFiltered)
                        .stack(lifeWorthwhilenessStronglyAgreeGroupFiltered)
                        .render();
                }
                else if (SelectedOptionLifeWorthwhileness.val() == "strongly-agree") {
                    lifeWorthwhilenessChart.x(d3.scale.ordinal()).group(lifeWorthwhilenessStronglyAgreeGroupFiltered).render();
                }
                else if (SelectedOptionLifeWorthwhileness.val() == "agree") {
                    lifeWorthwhilenessChart.x(d3.scale.ordinal()).group(lifeWorthwhilenessAgreeGroupFiltered).render();
                }
            }
        }

        if ($(this).parent().next('div').children().attr('id') == "where-europeans-live-chart") {
            var SelectedOptionWhereEuropeansLive = $('select#select-where-europeans-live option:checked');
            if ($(this).hasClass('sort-by-value')) {
                if (SelectedOptionWhereEuropeansLive.val() == "accommodation-satisfaction") {
                    whereEuropeansLiveChart
                        .x(d3.scale.ordinal().domain(accommodationSatByValue))
                        .group(accommodationSatGroup)
                        .render();
                }
                else if (SelectedOptionWhereEuropeansLive.val() == "feel-safe") {
                    whereEuropeansLiveChart
                        .x(d3.scale.ordinal().domain(feelSafeByValue))
                        .group(feelSafeGroup)
                        .render();
                }
                else if (SelectedOptionWhereEuropeansLive.val() == "green-areas-satisfaction") {
                    whereEuropeansLiveChart
                        .x(d3.scale.ordinal().domain(greenAreasSatByValue))
                        .group(greenAreasSatGroup)
                        .render();
                }
            }
            else if ($(this).hasClass('sort-by-country')) {
                if (SelectedOptionWhereEuropeansLive.val() == "accommodation-satisfaction") {
                    whereEuropeansLiveChart.x(d3.scale.ordinal()).group(accommodationSatGroupFiltered).render();
                }
                else if (SelectedOptionWhereEuropeansLive.val() == "feel-safe") {
                    whereEuropeansLiveChart.x(d3.scale.ordinal()).group(feelSafeGroupFiltered).render();
                }
                else if (SelectedOptionWhereEuropeansLive.val() == "green-areas-satisfaction") {
                    whereEuropeansLiveChart.x(d3.scale.ordinal()).group(greenAreasSatGroupFiltered).render();
                }
            }
        }

        if ($(this).parent().next('div').children().attr('id') == "neighbourhood-chart") {
            var SelectedOptionNeighbourhood = $('select#select-neighbourhood option:checked');
            if ($(this).hasClass('sort-by-value')) {
                if (SelectedOptionNeighbourhood.val() == "agree-or-strongly-agree") {
                    neighbourhoodChart
                        .x(d3.scale.ordinal().domain(closeToNeighboursTotalByValue))
                        .group(closeToNeighboursAgreeGroup)
                        .stack(closeToNeighboursStronglyAgreeGroup)
                        .render();
                }
                else if (SelectedOptionNeighbourhood.val() == "strongly-agree") {
                    neighbourhoodChart
                        .x(d3.scale.ordinal().domain(closeToNeighboursStronglyAgreeByValue))
                        .group(closeToNeighboursStronglyAgreeGroup)
                        .render();
                }
                else if (SelectedOptionNeighbourhood.val() == "agree") {
                    neighbourhoodChart
                        .x(d3.scale.ordinal().domain(closeToNeighboursAgreeByValue))
                        .group(closeToNeighboursAgreeGroup)
                        .render();
                }
            }
            else if ($(this).hasClass('sort-by-country')) {
                if (SelectedOptionNeighbourhood.val() == "agree-or-strongly-agree") {
                    neighbourhoodChart
                        .x(d3.scale.ordinal())
                        .group(closeToNeighboursAgreeGroupFiltered)
                        .stack(closeToNeighboursStronglyAgreeGroupFiltered)
                        .render();
                }
                else if (SelectedOptionNeighbourhood.val() == "strongly-agree") {
                    neighbourhoodChart.x(d3.scale.ordinal()).group(closeToNeighboursStronglyAgreeGroupFiltered).render();
                }
                else if (SelectedOptionNeighbourhood.val() == "agree") {
                    neighbourhoodChart.x(d3.scale.ordinal()).group(closeToNeighboursAgreeGroupFiltered).render();
                }
            }
        }

        if ($(this).parent().next('div').children().attr('id') == "relationships-chart") {
            var SelectedOptionRelationships = $('select#select-relationships option:checked');
            if ($(this).hasClass('sort-by-value')) {
                if (SelectedOptionRelationships.val() == "relationships-satisfaction") {
                    relationshipsChart
                        .x(d3.scale.ordinal().domain(relationshipsSatByValue))
                        .group(relationshipsSatGroup)
                        .render();
                }
                else if (SelectedOptionRelationships.val() == "social-support") {
                    relationshipsChart
                        .x(d3.scale.ordinal().domain(socialSupportByValue))
                        .group(socialSupportGroup)
                        .render();
                }
                else if (SelectedOptionRelationships.val() == "loneliness") {
                    relationshipsChart
                        .x(d3.scale.ordinal().domain(lonelinessByValue))
                        .group(lonelinessGroup)
                        .render();
                }
            }
            else if ($(this).hasClass('sort-by-country')) {
                if (SelectedOptionRelationships.val() == "relationships-satisfaction") {
                    relationshipsChart.x(d3.scale.ordinal()).group(relationshipsSatGroupFiltered).render();
                }
                else if (SelectedOptionRelationships.val() == "social-support") {
                    relationshipsChart.x(d3.scale.ordinal()).group(socialSupportGroupFiltered).render();
                }
                else if (SelectedOptionRelationships.val() == "loneliness") {
                    relationshipsChart.x(d3.scale.ordinal()).group(lonelinessGroupFiltered).render();
                }
            }
        }
    }


    dc.renderAll();

}