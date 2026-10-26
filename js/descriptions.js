//descriptions.js

let writtenTweets=[];
function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	const tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	writtenTweets = tweet_array.filter(function(tweet) {
		return tweet.written;
	});

	updateSearchResults();

	//TODO: Filter to just the written tweets
}

function addEventHandlerForSearch() {
	const searchBox = document.getElementById('textFilter');

	if (searchBox==null){
		return;
	}

	searchBox.addEventListener('input', updateSearchResults);
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
}

function updateSearchResults(){
	const searchBox = document.getElementById('textFilter');
    const searchText = document.getElementById('searchText');
    const searchCount = document.getElementById('searchCount');
    const tweetTable = document.getElementById('tweetTable');

	if (!searchBox||!searchText||!searchCount||!tweetTable){
		return;
	}

	const query = searchBox.value.toLowerCase();
	searchText.innerText = searchBox.value;

	if (query.trim() === ''){
		searchCount.innerText = '0';
		tweetTable.innerHTML = '';
		return;
	}

	const matchingTweets = writtenTweets.filter(function(tweet) {return tweet.writtenText.toLowerCase().includes(query);});
	searchCount.innerText = matchingTweets.length;

	tweetTable.innerHTML = matchingTweets.map(function(tweet, index) {return tweet.getHTMLTableRow(index + 1);}).join('');
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});