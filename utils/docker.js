// this is a general docking file used to load in certain modules in mass

// import default libraries
const fs = require("fs");
const path = require("path");

// import manifest
const manifest = JSON.parse(
    fs.readFileSync(path.join(`${__dirname.split("utils")[0]}/manifest.json`))
);

// create exportation object
let functions = {};

// docker to mass load commands and their aliases
functions.getCommands = () => {
    // create our map to return
    let commands = new Map();

    // grab an index of our base directory
    let base = __dirname.split("utils")[0];

    // grab all of the sub files
    let files = fs.readdirSync(path.join(`${base}/commands`));

    files
        .filter((file) => file.split(".").length == 1)
        .forEach((subfolder) => {
            let modules = fs
                .readdirSync(path.join(`${base}/commands/${subfolder}`))
                .filter((file) => file.endsWith(".js"));

            for (file of modules) {
                // get the command
                let command = require(path.join(`${base}/commands/${subfolder}/${file}`));

                // get the identifier
                let id = file.split(".js")[0].toLowerCase();

                // now we grab our configured commands
                let configuredCommands = new Map(Object.entries(manifest.bot.commands));

                let testAlias = configuredCommands.get(id);

                // if there's configured aliases, register them
                if (testAlias) for (alias of testAlias.aliases) commands.set(alias, command);

                // register the parent command
                commands.set(id, command);
            }
        });

    return commands;
};

module.exports = functions;
