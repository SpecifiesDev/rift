// will be using teemo.js as a wrapper as it's lightweight and clears up some of the confusion.

// import libraries
const teemo = require("teemojs");
const fs = require("fs");
const path = require("path");

// import the manifest
const manifest = JSON.parse(
    fs.readFileSync(path.join(`${__dirname.split("utils")[0]}/manifest.json`))
);

// initialize the api object
const api = teemo(manifest.api.key);

// grab our region, gonna add sharding onto this.
const region = manifest.api.region;

// create an exportation object
let functions = {};

/**
 * Function to return a summoner's tag from their displayname.
 * @param {String} name Name of the summoner to query.
 * @param {Function} callback callback function containing data
 */
functions.getTagByName = (name, callback) => {
    // retrieve the summoner so we can get the puuid
    api.get(region, "summoner.getBySummonerName", name)
        .then((summoner) => {
            if (!summoner) return callback(null);

            // the acc endpoint uses special routing values
            api.get(manifest.api.arv, "account.getByPuuid", summoner.puuid)
                .then((account) => {
                    if (!account) return callback(null);

                    // calls back the user's tag.
                    callback(`${account.gameName}#${account.tagLine}`);
                })
                .catch((err) => {
                    callback(null, err);
                });
        })
        .catch((err) => {
            callback(null, err);
        });
};

/**
 * Function to get the matches of a summoner via their ID
 * @param {String} id SummonerID of the user
 * @param {Function} callback callback function containing data
 */
functions.getMatchesBySummonerId = (id, callback) => {
    api.get(region, "match.getMatchlist", id)
        .then((matches) => {
            if (!matches) return callback(null);

            callback(matches.matches);
        })
        .catch((err) => {
            callback(null, err);
        });
};

/**
 * Function to get the puuid of a summoner via their name
 * @param {String} name Displayname of the summoner.
 * @param {Function} callback callback function containing data
 */
functions.getPuuidByName = (name, callback) => {
    api.get(region, "summoner.getBySummonerName", name)
        .then((summoner) => {
            if (!summoner) return callback(null);

            callback(summoner.puuid);
        })
        .catch((err) => {
            callback(null, err);
        });
};

/**
 * Function to get the account id of a summoner via their name
 * @param {String} name Displayname of the summoner.
 * @param {Function} callback callback function containing data
 */
functions.getAccountIdByName = (name, callback) => {
    api.get(region, "summoner.getBySummonerName", name)
        .then((summoner) => {
            if (!summoner) return callback(null);

            callback(summoner.accountId);
        })
        .catch((err) => {
            callback(null, err);
        });
};

/**
 * Function to get match data via its id
 * @param {String} id ID of the match
 * @param {Function} callback callback function containing data
 * I've found conflicting information on how much riot raate limits these endpoints
 * I'm going to test this in a private environment and see how many matches I can query before
 * I get a 429. If it's low, I'll have to implement a more strict system with this.
 */
functions.getMatchById = (id, callback) => {
    api.get(region, "match.getMatch", id)
        .then((match) => {
            if (!match) return callback(null);

            callback(match);
        })
        .catch((err) => {
            callback(null, err);
        });
};

/**
 * Function to get the summonerID of a summoner via their name
 * @param {String} name Displayname of the summoner.
 * @param {Function} callback callback function containing data
 */
functions.getSummonerIdByName = (name, callback) => {
    api.get(region, "summoner.getBySummonerName", name)
        .then((summoner) => {
            if (!summoner) return callback(null);

            console.log(summoner);
            callback(summoner.id);
        })
        .catch((err) => {
            callback(null, err);
        });
};

/**
 * Function to get league information on a summopner via their summonerID
 * @param {String} id Id of the summoner
 * @param {Function} callback callback function containing data
 */
functions.getLeaguesBySummonerId = (id, callback) => {
    api.get(region, "league.getLeagueEntriesForSummoner", id)
        .then((leagues) => {
            if (!leagues) return callback(null);

            callback(leagues);
        })
        .catch((err) => {
            callback(null, err);
        });
};

module.exports = functions;
