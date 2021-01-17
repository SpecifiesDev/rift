// Component to handle requests for static assets // by ids

// import default libs
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// create exportation value
let functions = {};

// import manifest
const manifest = JSON.parse(
    fs.readFileSync(path.join(`${__dirname.split("utils")[0]}/manifest.json`))
);

// pull our version // language
let version = manifest.league.version;
let language = manifest.league.language;

// I still need to figure out how to work this part of the API

// local functions
const getChampions = async () => {
    try {
        let response = await axios.get(
            `https://ddragon.leagueoflegends.com/cdn/${version}/data/${language}/champion.json?api_key=${manifest.api.key}`
        );

        return response.data;
    } catch (err) {
        return { error: true, msg: err };
    }
};

const getChampion = async (name) => {
    try {
        let response = await axios.get(
            `https://ddragon.leagueoflegends.com/cdn/${version}/data/${language}/champion/${name}.json?api_key=${manifest.api.key}`
        );

        return response.data;
    } catch (err) {
        return { error: true, msg: err };
    }
};

functions.getChampionNameById = async (id, callback) => {
    let champs = await getChampions();

    if (champs.error) return callback(null, champs);

    for (const [key, val] of Object.entries(champs.data)) {
        if (val.key === id) {
            callback({ name: val.id, tags: val.tags });
            break;
        }
    }
};

functions.getChampionDataByName = async (name, callback) => {
    let champ = await getChampion(name);

    if (name.error) return callback(null, champ);

    console.log(champ);
};

module.exports = functions;
