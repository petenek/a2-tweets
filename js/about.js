function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	const tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	let tweet1 = tweet_array[0].time;
	let tweet2 = tweet_array[0].time;
	for (let i=0;i<tweet_array.length;i++) {
		if (tweet_array[i].time < tweet1) {
			tweet1 = tweet_array[i].time;
		}
		if (tweet_array[i].time > tweet2) {
			tweet2 = tweet_array[i].time;
		}
	}
	let format = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	document.getElementById('firstDate').innerText = tweet1.toLocaleDateString('en-US', format);
	document.getElementById('lastDate').innerText = tweet2.toLocaleDateString('en-US', format);

	let completedCount=0;
	let liveCount=0;
	let achievementCount=0;
	let miscellaneousCount=0;
	for (let i=0;i<tweet_array.length;i++) {
		if (tweet_array[i].source == 'completed_event') {
			completedCount++;
		}
		else if (tweet_array[i].source == 'live_event') {
			liveCount++;
		}
		else if (tweet_array[i].source == 'achievement') {
			achievementCount++;
		}
		else {
			miscellaneousCount++;
		}
	}
	document.getElementsByClassName('completedEvents')[0].innerText = completedCount;
	document.getElementsByClassName('liveEvents')[0].innerText = liveCount;
	document.getElementsByClassName('achievements')[0].innerText = achievementCount;
	document.getElementsByClassName('miscellaneous')[0].innerText = miscellaneousCount;
	document.getElementsByClassName('completedEventsPct')[0].innerText = (completedCount/tweet_array.length*100).toFixed(2) + "%";
	document.getElementsByClassName('liveEventsPct')[0].innerText = (liveCount/tweet_array.length*100).toFixed(2) + "%";
	document.getElementsByClassName('achievementsPct')[0].innerText = (achievementCount/tweet_array.length*100).toFixed(2) + "%";
	document.getElementsByClassName('miscellaneousPct')[0].innerText = (miscellaneousCount/tweet_array.length*100).toFixed(2) + "%";
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});