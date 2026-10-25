class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        if (this.text.includes("Just completed") || this.text.includes("Just posted")){
            return 'completed_event';
        }
        else if (this.text.includes("Watch my")){
            return 'live_event';
        }
        else if (this.text.includes("I just set a goal") || this.text.includes("Achieved a new personal record")){
            return 'achievement';
        }
        return 'miscellaneous';
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        if (this.source != 'completed_event') {
            return false;
        }
        if (this.text.includes("Check it out!")) {
            return false;
        }
        return true;
    }

    get writtenText():string {
        if (!this.written) {
            return "";
        }

        const index3 = this.text.indexOf(" - ");

        if (index3 === -1) {
            return "";
        }

        let endIndex = this.text.length;

        const linkIndex = this.text.indexOf("https://");
        const hashtagIndex = this.text.indexOf("#Runkeeper");

        if (linkIndex !== -1 && linkIndex < endIndex) {
            endIndex = linkIndex;
        }

        if (hashtagIndex !== -1 && hashtagIndex < endIndex) {
            endIndex = hashtagIndex;
        }

        return this.text.substring(index3 + 3, endIndex).trim();
    }

    get activityType():string {
        if (this.source !== "completed_event") {
            return "unknown";
        }

        const text = this.text.toLowerCase()

        if (text.includes("mountain bike") || text.includes("mtn bike")) {
            return "mtn bike";
        } else if (text.includes("nordic walk")) {
            return "nordic walk";
        } else if (text.includes("ski run")) {
            return "ski run";
        } else if (text.includes("elliptical workout")) {
            return "elliptical workout";
        } else if (text.includes("strength workout")) {
            return "strength workout";
        } else if (text.includes("crossfit workout")) {
            return "crossfit workout";
        } else if (text.includes("yoga practice")) {
            return "yoga practice";
        } else if (text.includes("spinning workout")) {
            return "spinning workout";
        } else if (text.includes("mysports freestyle")) {
            return "mysports freestyle";
        } else if (text.includes("circuit workout")) {
            return "circuit workout";
        } else if (text.includes("chair ride")) {
            return "chair ride";
        } else if (text.includes("bootcamp workout")) {
            return "bootcamp workout";
        } else if (text.includes("core workout")) {
            return "core workout";
        } else if (text.includes("boxing / mma")) {
            return "boxing / mma";
        } else if (text.includes("stairmaster / stepwell workout")) {
            return "stairmaster / stepwell workout";
        } else if (text.includes("group workout")) {
            return "group workout";
        } else if (text.includes("pilates session")) {
            return "pilates session";
        } else if (text.includes("barre workout")) {
            return "barre workout";
        } else if (text.includes("mysports gym")) {
            return "mysports gym";
        } else if (text.includes("meditation")) {
            return "meditation";
        } else if (text.includes("snowboard")) {
            return "snowboard";
        } else if (text.includes("sports")) {
            return "sports";
        } else if (text.includes("dance")) {
            return "dance";
        } else if (text.includes("elliptical")) {
            return "elliptical workout";
        } else if (text.includes("strength")) {
            return "strength workout";
        } else if (text.includes("hike")) {
            return "hike";
        } else if (text.includes("swim")) {
            return "swim";
        } else if (text.includes("row")) {
            return "row";
        } else if (text.includes("skate")) {
            return "skate";
        } else if (text.includes("run ")) {
            return "run";
        } else if (text.includes("walk")) {
            return "walk";
        } else if (text.includes("bike")) {
            return "bike";
        } else if (text.includes("activity")) {
            return "activity";
        }

        return "unknown";
    }

    get distance():number {
        if (this.source !== "completed_event") {
            return 0;
        }

        const words = this.text.split(" ");

        if (words[0] !== "Just" || !["completed", "posted"].includes(words[1]) || words[2] !== "a") {
            return 0;
        }

        const value = Number(words[3]);
        const unit = words[4];

        if (!Number.isFinite(value)) {
            return 0;
        }

        if (unit === "km") {
            return value / 1.609;
        } 
        else if (unit === "mi") {
            return value;
        }

        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        const linkIndex = this.text.indexOf("https://");

        let tweetHTML = this.text;

        if (linkIndex !== -1) {
            const urlEnd = this.text.indexOf(" ", linkIndex);
            const url = urlEnd === -1 ? this.text.substring(linkIndex) : this.text.substring(linkIndex, urlEnd);

            tweetHTML = this.text.replace(url,`<a href="${url}" target="_blank">${url}</a>`);
        }

        return `<tr>
            <td>${rowNumber}</td>
            <td>${this.activityType}</td>
            <td>${tweetHTML}</td>
        </tr>`;
    }
}