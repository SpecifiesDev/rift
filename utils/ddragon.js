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
            `http://ddragon.leagueoflegends.com/cdn/${version}/data/${language}/champion.js`
        );

        return response;
    } catch (err) {
        return { error: true, msg: err };
    }
};

const getChampionById = async (id) => {
    try {
        let response = await axios.get(
            `http://ddragon.leagueoflegends.com/cdn/${version}/data/${language}/champion/37?api_key=${manifest.api.key}`
        );

        return response;
    } catch (err) {
        return { error: true, msg: err };
    }
};

functions.getChampionNameById = async (id, callback) => {
    let champs = await getChampionById(37);

    console.log(champs);
};

module.exports = functions;
