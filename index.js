// import base libraries
const api = require("./utils/league-api");

// I'm not going to start building the bot until I complete the api endpoints I need
api.getTagByName("Carson21", (data, err) => {
    if (err) return console.log(err);
    console.log(data);
});
