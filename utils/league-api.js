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
 * Function to return overarching summoner information by their name
 * @param {String} name Name of the summoner to query.
 */
functions.getTagByName = async (name, callback) => {
    // retrieve the summoner so we can get the puuid
    api.get(region, "summoner.getBySummonerName", name)
        .then((summoner) => {
            if (!summoner) return callback(-1);

            // the acc endpoint uses special routing values
            api.get(manifest.api.arv, "account.getByPuuid", summoner.puuid)
                .then((account) => {
                    if (!account) return callback(-1);

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

module.exports = functions;
