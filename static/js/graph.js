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
			d.happiness_high = +(d.happiness_9 + d.happiness_happy);
		}
        d.loneliness = +d.loneliness;
    });

    $(document).ready(function()
    {
        $("#select-happiness-rating").on( "change", selectHappinessRating);
        $("#select-personal-finance").on( "change", selectPersonalFinance);
        $('.chart-title button').on("click", sortChart);
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
    var endsMeetGroup = countryDim.group().reduceSum(function(d) {return d.ends_meet;});
    var riskOfPovertyGroup = countryDim.group().reduceSum(function(d) {return d.risk_of_poverty;});
    var jobSatisfactionGroup = countryDim.group().reduceSum(function(d) {return d.job_satisfaction;});
    var financesSatisfactionGroup = countryDim.group().reduceSum(function(d) {return d.finances_satisfaction;});
    var closeToNeighboursAgreeGroup = neighbourhoodDim.group().reduceSum(function(d) {return d.close_to_neighbours_agree;});
    var closeToNeighboursStronglyAgreeGroup = neighbourhoodDim.group().reduceSum(function(d) {return d.close_to_neighbours_strongly_agree;});

    //Charts
    var lifeSatisfactionChart = dc.geoChoroplethChart("#life-satisfaction-map");
	var happinessChart = dc.barChart('#happiness-chart');
    var personalFinanceChart = dc.barChart('#personal-finance-chart');
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
		.width(600)
		.height(200)
		.margins({top: 10, right: 50, bottom: 75, left: 50})
		.brushOn(false)
		.dimension(happinessDim)
		.group(happinessHighGroup)
        .title(function (p){return p["key"] + ": " + p["value"] + "%";})
        .elasticY(true)
		.transitionDuration(500)
		.x(d3.scale.ordinal())
		.xUnits(dc.units.ordinal)
        .transitionDuration(800)
        .yAxisLabel("percentage %")
		.yAxis().ticks(4);

    function selectHappinessRating()
	{
        if ($(this).val() == "high")
        {
            happinessChart.group(happinessHighGroup).x(d3.scale.ordinal()).render();
            $('#happiness-chart').parent().prev('div').children('p').text('Rating of happiness as high (9 to 10 out of 10) - 2014');
            dc.redrawAll();
        }
        else if ($(this).val() == "ten")
        {
            happinessChart.group(happinessHappyGroup).x(d3.scale.ordinal()).render();
            $('#happiness-chart').parent().prev('div').children('p').text('Rating of happiness as extremely happy - 2014');
            dc.redrawAll();
        }
        else if ($(this).val() == "nine")
        {
            happinessChart.group(happinessNineGroup).x(d3.scale.ordinal()).render();
            $('#happiness-chart').parent().prev('div').children('p').text('Rating of happiness as 9 out of 10 - 2014');
            dc.redrawAll();
        }
        else if ($(this).val() == "eight")
        {
            happinessChart.group(happinessEightGroup).x(d3.scale.ordinal()).render();
            $('#happiness-chart').parent().prev('div').children('p').text('Rating of happiness as 8 out of 10 - 2014');
            dc.redrawAll();
        }
        else if ($(this).val() == "seven")
        {
            happinessChart.group(happinessSevenGroup).x(d3.scale.ordinal()).render();
            $('#happiness-chart').parent().prev('div').children('p').text('Rating of happiness as 7 out of 10 - 2014');
            dc.redrawAll();
        }
        else if ($(this).val() == "six")
        {
            happinessChart.group(happinessSixGroup).x(d3.scale.ordinal()).render();
            $('#happiness-chart').parent().prev('div').children('p').text('Rating of happiness as 6 out of 10 - 2014');
            dc.redrawAll();
        }
        else if ($(this).val() == "five")
        {
            happinessChart.group(happinessFiveGroup).x(d3.scale.ordinal()).render();
            $('#happiness-chart').parent().prev('div').children('p').text('Rating of happiness as 5 out of 10 - 2014');
            dc.redrawAll();
        }
        else if ($(this).val() == "four")
        {
            happinessChart.group(happinessFourGroup).x(d3.scale.ordinal()).render();
            $('#happiness-chart').parent().prev('div').children('p').text('Rating of happiness as 4 out of 10 - 2014');
            dc.redrawAll();
        }
        else if ($(this).val() == "three")
        {
            happinessChart.group(happinessThreeGroup).x(d3.scale.ordinal()).render();
            $('#happiness-chart').parent().prev('div').children('p').text('Rating of happiness as 3 out of 10 - 2014');
            dc.redrawAll();
        }
        else if ($(this).val() == "two")
        {
            happinessChart.group(happinessTwoGroup).x(d3.scale.ordinal()).render();
            $('#happiness-chart').parent().prev('div').children('p').text('Rating of happiness as 2 out of 10 - 2014');
            dc.redrawAll();
        }
        else if ($(this).val() == "one")
        {
            happinessChart.group(happinessOneGroup).x(d3.scale.ordinal()).render();
            $('#happiness-chart').parent().prev('div').children('p').text('Rating of happiness as 1 out of 10 - 2014');
            dc.redrawAll();
        }
        else if ($(this).val() == "zero")
        {
            happinessChart.group(happinessUnhappyGroup).x(d3.scale.ordinal()).render();
            $('#happiness-chart').parent().prev('div').children('p').text('Rating of happiness as extremely unhappy - 2014');
            dc.redrawAll();
        }
	}

   personalFinanceChart
		.width(790)
		.height(200)
		.margins({top: 10, right: 50, bottom: 75, left: 50})
		.x(d3.scale.ordinal())
		.xUnits(dc.units.ordinal)
        .title(function (p){return p["key"] + ": " + p["value"] + "%";})
        .elasticY(true)
		.brushOn(false)
		.dimension(countryDim)
		.group(jobSatisfactionGroup)
        .transitionDuration(800)
        .yAxisLabel("percentage %")
    	.yAxis().ticks(4);

    function selectPersonalFinance()
	{
        if ($(this).val() == "job-satisfaction")
        {
            personalFinanceChart.group(jobSatisfactionGroup).x(d3.scale.ordinal()).render();
            $('#personal-finance-chart').parent().prev('div').children('p').text('Percentage of the population rating their satisfaction with their job as high - 2013');
            dc.redrawAll();
        }
        else if ($(this).val() == "finances-satisfaction")
        {
            personalFinanceChart.group(financesSatisfactionGroup).x(d3.scale.ordinal()).render();
            $('#personal-finance-chart').parent().prev('div').children('p').text('High satisfaction with financial situation - 2013');
            dc.redrawAll();
        }
        else if ($(this).val() == "at-poverty-risk")
        {
            personalFinanceChart.group(riskOfPovertyGroup).x(d3.scale.ordinal()).render();
            $('#personal-finance-chart').parent().prev('div').children('p').text('At-risk-of-poverty rate - 2015');
            dc.redrawAll();
        }
        else if ($(this).val() == "ends-meet")
        {
            personalFinanceChart.group(endsMeetGroup).x(d3.scale.ordinal()).render();
            $('#personal-finance-chart').parent().prev('div').children('p').text('Inability to make ends meet with great difficulty or difficulty - 2015');
            dc.redrawAll();
        }
	}

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
				.group(closeToNeighboursAgreeGroup, 'agree')
				.defined(function(d) { return !isNaN(d.y)}),
			dc.lineChart(neighbourhoodChart)
				.dimension(neighbourhoodDim)
				.group(closeToNeighboursStronglyAgreeGroup, 'strongly agree')
				.defined(function(d) { return !isNaN(d.y)})
		]);

    function sortChart() {
        if ($(this).parent().next('div').children().attr('id') == "personal-finance-chart") {

            var SelectedOptionPersonalFinance = $('select#select-personal-finance option:checked');

            if ($(this).hasClass('sort-by-value')) {

                if (SelectedOptionPersonalFinance.val() == "job-satisfaction") {
                    var jobSatisfactionByValue = [];
                    jobSatisfactionGroup.top(Infinity).forEach(function (d) {
                        jobSatisfactionByValue.push(d.key);
                    });
                    personalFinanceChart.x(d3.scale.ordinal().domain(jobSatisfactionByValue)).render();
                    dc.redrawAll();
                }

                else if (SelectedOptionPersonalFinance.val() == "finances-satisfaction") {
                    var financesSatisfactionByValue = [];
                    financesSatisfactionGroup.top(Infinity).forEach(function (d) {
                        financesSatisfactionByValue.push(d.key);
                    });
                    personalFinanceChart.x(d3.scale.ordinal().domain(financesSatisfactionByValue)).render();
                    dc.redrawAll();
                }

                else if (SelectedOptionPersonalFinance.val() == "at-poverty-risk") {
                    var riskOfPovertyByValue = [];
                    riskOfPovertyGroup.top(Infinity).forEach(function (d) {
                        riskOfPovertyByValue.push(d.key);
                    });
                    personalFinanceChart.x(d3.scale.ordinal().domain(riskOfPovertyByValue)).render();
                    dc.redrawAll();
                }

                else if (SelectedOptionPersonalFinance.val() == "ends-meet") {
                    var endsMeetByValue = [];
                    endsMeetGroup.top(Infinity).forEach(function (d) {
                        endsMeetByValue.push(d.key);
                    });
                    personalFinanceChart.x(d3.scale.ordinal().domain(endsMeetByValue)).render();
                    dc.redrawAll();
                }

            }
            else if ($(this).hasClass('sort-by-country')) {

                personalFinanceChart.x(d3.scale.ordinal()).render();
                dc.redrawAll();
            }
        }

        if ($(this).parent().next('div').children().attr('id') == "happiness-chart") {

            var selectedOptionHappiness = $('select#select-happiness-rating option:checked');

            if ($(this).hasClass('sort-by-value')) {

                if (selectedOptionHappiness.val() == "high") {
                    var happinessHighByValue = [];
                    happinessHighGroup.top(Infinity).forEach(function (d) {
                        if (!isNaN(d.value)) {happinessHighByValue.push(d.key)}
                    });
                    happinessChart.x(d3.scale.ordinal().domain(happinessHighByValue)).render();
                    dc.redrawAll();
                }

                else if (selectedOptionHappiness.val() == "ten") {
                    var happinessHappyByValue = [];
                    happinessHappyGroup.top(Infinity).forEach(function (d) {
                        if (!isNaN(d.value)) {happinessHappyByValue.push(d.key)}
                    });
                    happinessChart.x(d3.scale.ordinal().domain(happinessHappyByValue)).render();
                    dc.redrawAll();
                }

                else if (selectedOptionHappiness.val() == "nine") {
                    var happinessNineByValue = [];
                    happinessNineGroup.top(Infinity).forEach(function (d) {
                        if (!isNaN(d.value)) {happinessNineByValue.push(d.key)}
                    });
                    happinessChart.x(d3.scale.ordinal().domain(happinessNineByValue)).render();
                    dc.redrawAll();
                }

                else if (selectedOptionHappiness.val() == "eight") {
                    var happinessEightByValue = [];
                    happinessEightGroup.top(Infinity).forEach(function (d) {
                        if (!isNaN(d.value)) {happinessEightByValue.push(d.key)}
                    });
                    happinessChart.x(d3.scale.ordinal().domain(happinessEightByValue)).render();
                    dc.redrawAll();
                }

                else if (selectedOptionHappiness.val() == "seven") {
                    var happinessSevenByValue = [];
                    happinessSevenGroup.top(Infinity).forEach(function (d) {
                        if (!isNaN(d.value)) {happinessSevenByValue.push(d.key)}
                    });
                    happinessChart.x(d3.scale.ordinal().domain(happinessSevenByValue)).render();
                    dc.redrawAll();
                }

                else if (selectedOptionHappiness.val() == "six") {
                    var happinessSixByValue = [];
                    happinessSixGroup.top(Infinity).forEach(function (d) {
                        if (!isNaN(d.value)) {happinessSixByValue.push(d.key)}
                    });
                    happinessChart.x(d3.scale.ordinal().domain(happinessSixByValue)).render();
                    dc.redrawAll();
                }

                else if (selectedOptionHappiness.val() == "five") {
                    var happinessFiveByValue = [];
                    happinessFiveGroup.top(Infinity).forEach(function (d) {
                        if (!isNaN(d.value)) {happinessFiveByValue.push(d.key)}
                    });
                    happinessChart.x(d3.scale.ordinal().domain(happinessFiveByValue)).render();
                    dc.redrawAll();
                }

                else if (selectedOptionHappiness.val() == "four") {
                    var happinessFourByValue = [];
                    happinessFourGroup.top(Infinity).forEach(function (d) {
                        if (!isNaN(d.value)) {happinessFourByValue.push(d.key)}
                    });
                    happinessChart.x(d3.scale.ordinal().domain(happinessFourByValue)).render();
                    dc.redrawAll();
                }

                else if (selectedOptionHappiness.val() == "three") {
                    var happinessThreeByValue = [];
                    happinessThreeGroup.top(Infinity).forEach(function (d) {
                        if (!isNaN(d.value)) {happinessThreeByValue.push(d.key)}
                    });
                    happinessChart.x(d3.scale.ordinal().domain(happinessThreeByValue)).render();
                    dc.redrawAll();
                }

                else if (selectedOptionHappiness.val() == "two") {
                    var happinessTwoByValue = [];
                    happinessTwoGroup.top(Infinity).forEach(function (d) {
                        if (!isNaN(d.value)) {happinessTwoByValue.push(d.key)}
                    });
                    happinessChart.x(d3.scale.ordinal().domain(happinessTwoByValue)).render();
                    dc.redrawAll();
                }

                else if (selectedOptionHappiness.val() == "one") {
                    var happinessOneByValue = [];
                    happinessOneGroup.top(Infinity).forEach(function (d) {
                        if (!isNaN(d.value)) {happinessOneByValue.push(d.key)}
                    });
                    happinessChart.x(d3.scale.ordinal().domain(happinessOneByValue)).render();
                    dc.redrawAll();
                }

                else if (selectedOptionHappiness.val() == "zero") {
                    var happinessUnhappyByValue = [];
                    happinessUnhappyGroup.top(Infinity).forEach(function (d) {
                        if (!isNaN(d.value)) {happinessUnhappyByValue.push(d.key)}
                    });
                    happinessChart.x(d3.scale.ordinal().domain(happinessUnhappyByValue)).render();
                    dc.redrawAll();
                }

            }
            else if ($(this).hasClass('sort-by-country')) {

                happinessChart.x(d3.scale.ordinal()).render();
                dc.redrawAll();
            }
        }
    }

    dc.renderAll();

}