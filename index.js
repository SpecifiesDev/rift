// import base libraries
const api = require("./utils/league-api");

//Rhaenyssx (acc that doesn't have a provisional rank)

api.getAccountIdByName("Rhaenyssx", (id, err) => {
    if (err) return console.log(err);

    api.getMatchesBySummonerId(id, (matches, err) => {
        if (err) return console.log(err);

        api.getMatchById(matches.matches[0].gameId, (match, err) => {
            if (err) return console.log(err);

            console.log(match.participantIdentities);

            let participants = new Map();

            for (participant of match.participantIdentites) {
                participants.set(participant.player.accountId, {
                    id: participant.participantId,
                    profileIcon: participant.profileIcon,
                    platform: participant.currentPlatformId,
                });
            }

            for (team of match.teams) {
                console.log(team);
            }
        });
    });
});
