// import base libraries
const Discord = require("discord.js");
const fs = require("fs");
const log = require("./utils/logger");
const docker = require("./utils/docker.js");

// create the client
const client = new Discord.Client();

// storage object for commands
let commands = docker.getCommands();

console.log(commands);

// import manifest
const manifest = JSON.parse(fs.readFileSync("./manifest.json"));

client.on("error", (err) => {
    log.error(err);
});

client.on("ready", () => {
    log.info("Bot is online.");
    client.user.setActivity("LoL");
});

client.on("message", (message) => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    // grab our configured prefix & message content
    let prefix = manifest.bot.prefix;
    let content = message.content;

    // check if the message starts with our prefix
    if (content.indexOf(prefix) == 0) {
        // parse command arguments
        const args = content.splice(prefix).trim().split(/ +/g);

        // grab the intended command
        const command = args[0].toLowerCase();

        /**
         * Instead of having to manually check, we do it this way.
         * We register every command through an automated process
         * (see docker.js)
         * If the command is registered, it will execute with the data
         * If not, we'll just log and skip over it.
         */
        try {
            commands.get(command).execute({
                message: message,
                args: args,
                prefix: prefix,
            });
        } catch (err) {
            log.warn(`An attempt to run a non existing command was made. \n${command}`);
        }
    }
});
