function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	const tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	const completedTweets = tweet_array.filter(function (tweet) { return tweet.source === "completed_event"});

	const activityCounts = {};

	completedTweets.forEach(function(tweet) {
		if (tweet.activityType !== "unknown") {
			activityCounts[tweet.activityType] = (activityCounts[tweet.activityType] || 0) + 1;
		}
	});

	const activityData = Object.keys(activityCounts).map(function(type) {return { activity: type, count: activityCounts[type] };});

	activityData.sort(function(a, b) {return b.count - a.count;});

	document.getElementById("numberActivities").innerText = activityData.length;

	const topThree = activityData.slice(0, 3).map(function(item) {return item.activity;});

    document.getElementById("firstMost").innerText = topThree[0] || "N/A";
    document.getElementById("secondMost").innerText = topThree[1] || "N/A";
    document.getElementById("thirdMost").innerText = topThree[2] || "N/A";

	const activitySpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "Number of tweets for each activity type.",
        "data": {
            "values": activityData
        },
        "mark": "bar",
        "encoding": {
            "x": {
                "field": "activity",
                "type": "nominal",
                "sort": "-y",
                "title": "Activity type",
                "axis": { "labelAngle": -45 }
            },
            "y": {
                "field": "count",
                "type": "quantitative",
                "title": "Number of tweets"
            },
            "tooltip": [
                { "field": "activity", "type": "nominal", "title": "Activity" },
                { "field": "count", "type": "quantitative", "title": "Tweets" }
            ]
        }
    }; 

    vegaEmbed("#activityVis", activitySpec, { actions: false });

	const days = ["Sunday", "Monday", "Tuesday", "Wednesday","Thursday", "Friday", "Saturday"];	
	const weekdayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

	const distanceData = completedTweets.filter(function (tweet) {return topThree.includes(tweet.activityType) && tweet.distance > 0;})
        .map(function (tweet) {
            return {
                activity: tweet.activityType,
                distance: tweet.distance,
                day: days[tweet.time.getDay()]
            };
        });
	
	const distanceSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "Individual activity distances by day of the week.",
        "data": {
            "values": distanceData
        },
        "mark": {
            "type": "point",
            "filled": false,
			"size": 80,
            "opacity": 1
        },
        "encoding": {
            "x": {
                "field": "day",
                "type": "ordinal",
                "sort": weekdayOrder,
                "title": "time (day)"
            },
            "y": {
                "field": "distance",
                "type": "quantitative",
                "title": "Distance (miles)"
            },
            "color": {
                "field": "activity",
                "type": "nominal",
                "title": "Activity",
				"scale": {
					"domain": topThree,
					"range": ["blue","red","yellow"]
				}
            },
            "tooltip": [
                { "field": "activity", "type": "nominal", "title": "Activity" },
                { "field": "day", "type": "ordinal", "title": "Day" },
                { "field": "distance", "type": "quantitative", "title": "Miles" }
            ]
        }
    };

    vegaEmbed("#distanceVis", distanceSpec, { actions: false });

	const averageDistanceSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "Average activity distance by day of the week.",
        "data": {
            "values": distanceData
        },
        "mark": {
			"type": "point",
			"point": {
				"filled": false,
				"size": 80
			}
		},
        "encoding": {
            "x": {
                "field": "day",
                "type": "ordinal",
                "sort": weekdayOrder,
                "title": "time (day)"
            },
            "y": {
                "aggregate": "mean",
                "field": "distance",
                "type": "quantitative",
                "title": "Mean of Distance (miles)"
            },
            "color": {
                "field": "activity",
                "type": "nominal",
                "title": "Activity",
				"scale": {
					"domain": topThree,
					"range": ["blue","red","yellow"]
				}
            },
            "tooltip": [
                { "field": "activity", "type": "nominal", "title": "Activity" },
                { "field": "day", "type": "ordinal", "title": "Day" },
                {
                    "aggregate": "mean",
                    "field": "distance",
                    "type": "quantitative",
                    "title": "Average miles",
                    "format": ".2f"
                }
            ]
        }
    };

    vegaEmbed("#distanceVisAggregated", averageDistanceSpec,{ actions: false });

	const distancesByActivity = {};

    completedTweets.forEach(function (tweet) {
        if (tweet.distance > 0 && topThree.includes(tweet.activityType)) {
            if (distancesByActivity[tweet.activityType] === undefined) {
                distancesByActivity[tweet.activityType] = [];
            }
            distancesByActivity[tweet.activityType].push(tweet.distance);
        }
    });

    const averageByActivity = Object.keys(distancesByActivity).map(function (type) {
        const values = distancesByActivity[type];
        const total = values.reduce(function (sum, distance) {
            return sum + distance;
        }, 0);

        return {
            activity: type,
            average: total / values.length
        };
    });

    averageByActivity.sort(function (a, b) {
        return b.average - a.average;
    });

    document.getElementById("longestActivityType").innerText =
        averageByActivity.length > 0
            ? averageByActivity[0].activity
            : "N/A";

    document.getElementById("shortestActivityType").innerText =
        averageByActivity.length > 0
            ? averageByActivity[averageByActivity.length - 1].activity
            : "N/A";

    let weekdayTotal = 0;
    let weekdayCount = 0;
    let weekendTotal = 0;
    let weekendCount = 0;

    completedTweets.forEach(function (tweet) {
        if (tweet.distance > 0 && topThree.includes(tweet.activityType)) {
            const day = tweet.time.getDay();

            if (day === 0 || day === 6) {
                weekendTotal += tweet.distance;
                weekendCount++;
            } else {
                weekdayTotal += tweet.distance;
                weekdayCount++;
            }
        }
    });

    const weekdayAverage =
        weekdayCount > 0 ? weekdayTotal / weekdayCount : 0;
    const weekendAverage =
        weekendCount > 0 ? weekendTotal / weekendCount : 0;

    let longerPeriod = "About the same";

    if (weekdayAverage > weekendAverage) {
        longerPeriod = "Weekdays";
    } else if (weekendAverage > weekdayAverage) {
        longerPeriod = "Weekends";
    }

    document.getElementById("weekdayOrWeekendLonger").innerText = longerPeriod;
}

document.addEventListener("DOMContentLoaded", function () {
    const aggregateButton = document.getElementById("aggregate");
    const individualChart = document.getElementById("distanceVis");
    const averageChart = document.getElementById("distanceVisAggregated");

    averageChart.style.display = "none";

    aggregateButton.addEventListener("click", function () {
        const meansAreHidden = averageChart.style.display === "none";

        individualChart.style.display = meansAreHidden ? "none" : "block";
        averageChart.style.display = meansAreHidden ? "block" : "none";

        aggregateButton.innerText = meansAreHidden
            ? "All activities"
            : "Show means";
    });

    loadSavedRunkeeperTweets().then(parseTweets);
});