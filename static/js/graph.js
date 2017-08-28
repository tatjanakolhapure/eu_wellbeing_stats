/**
 * Created by Tatjana Kolhapure on 28/08/2017.
 */

queue()
    .defer(d3.json, "/EuropeStats/wellbeing")
    .defer(d3.json, "static/geojson/world-countries.json")
    .await(makeGraphs);

function makeGraphs(error, EuropeStatsWellbeing, countriesJson) {
    if (error) {
        console.error("makeGraphs error on receiving dataset:", error.statusText);
        throw error;
    }

    //Clean EuropeStatsWellbeing data
    EuropeStatsWellbeing.forEach(function (d) {
        d["country"] = d.country;
        d["life_satisfaction"] = +d.life_satisfaction;
        d["soc_support"] = +d.soc_support;
        d["life_expectancy"] = +d.life_expectancy;
        d["good_health"] = +d.good_health;
        d["unemployment_rate"] = +d.unemployment_rate;
        d["feel_safe"] = +d.feel_safe;
        d["life_is_worthwhile"]["agree"] = +d.life_is_worthwhile_agree;
        d["life_is_worthwhile"]["strongly_agree"] = +d.life_is_worthwhile_strongly_agree;
        d["mental_health_index"] = +d.mental_health_index;
        d["pers_relationships_satisfaction"] = +d.pers_relationships_satisfaction;
        d["job_satisfaction"] = +d.job_satisfaction;
        d["green_areas_satisfaction"] = +d.green_areas_satisfaction;
        d["close_to_neighbours"]["agree"] = +d.close_to_neighbours_agree;
        d["close_to_neighbours"]["strongly_agree"] = +d.close_to_neighbours_strongly_agree;
        d["accommodation_satisfaction"] = +d.accommodation_satisfaction;
        d["risk_of_poverty"] = +d.risk_of_poverty;
        d["net_income"] = +d.net_income;
        d["finances_satisfaction"] = +d.finances_satisfaction;
        d["ends_meet"] = +d.ends_meet;
        d["happiness"]["extremely_unhappy"] = +d.happiness_extremely_unhappy;
        d["happiness"]["1"] = +d.happiness_1;
        d["happiness"]["2"] = +d.happiness_2;
        d["happiness"]["3"] = +d.happiness_3;
        d["happiness"]["4"] = +d.happiness_4;
        d["happiness"]["5"] = +d.happiness_5;
        d["happiness"]["6"] = +d.happiness_6;
        d["happiness"]["7"] = +d.happiness_7;
        d["happiness"]["8"] = +d.happiness_8;
        d["happiness"]["9"] = +d.happiness_9;
        d["happiness"]["extremely_happy"] = +d.happiness_extremely_happy;
        d["loneliness"] = +d.loneliness;
    });

}