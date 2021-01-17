// import base libraries
const api = require("./utils/league-api");
const ddragon = require("./utils/ddragon");

ddragon.getChampionNameById(1, () => {});
//Rhaenyssx (acc that doesn't have a provisional rank)

api.getAccountIdByName("Rhaenyssx", (id, err) => {
    if (err) return console.log(err);

    api.getMatchesBySummonerId(id, (matches, err) => {
        if (err) return console.log(err);

        api.getMatchById(matches[0].gameId, (match, err) => {
            if (err) return console.log(err);

            let participants = new Map();

            for (participant of match.participantIdentities) {
                participants.set(participant.player.accountId, {
                    id: participant.participantId,
                    profileIcon: participant.player.profileIcon,
                    platform: participant.player.currentPlatformId,
                });
            }

            let player = { participant: participants.get(id) };

            for (participant of match.participants) {
                if (participant.participantId == player.participant.id) {
                    let ptp = participant; // easier naming
                    let stats = ptp.stats;
                    // predefined values we want to grab
                    let items = [];

                    // convert the object into a map, easier querying
                    let keys = new Map(Object.entries(stats));

                    // grab all of the player's items
                    for (let i = 0; i <= 6; i++) items.push(keys.get(`item${i}`));

                    player.data = {
                        items: items,
                        champion: ptp.championId,
                        role: ptp.timeline.role,
                        lane: ptp.timeline.lane,
                        summD: ptp.spell1Id,
                        summF: ptp.spell2Id,
                        win: stats.win,
                        kda: { k: stats.kills, d: stats.deaths, a: stats.assists },
                        damage_dealt: stats.totalDamageDealt,
                        heal: stats.totalHeal,
                        vision_score: stats.visionScore,
                        gold_earned: stats.goldEarned,
                        gold_spent: stats.goldSpent,
                        cs: stats.totalMinionsKilled,
                        level: stats.champLevel,
                    };
                    break;
                }
            }

            console.log(player);
        });
    });
});
