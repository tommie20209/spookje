const discord = require("discord.js");
const botConfig = require("./botconfig.json");
const fs = require("fs");


const client = new discord.Client();
client.commands = new discord.Collection();
fs.readdir("./commands/", (err, files) => {

    if (err) console.log(err);

    var jsFiles = files.filter(f => f.split(".").pop() === "js");

    if (jsFiles.length <= 0) {
        console.log("kon geen files vinden");
        return;
    }

    jsFiles.forEach((f, i) => {

        var fileGet = require(`./commands/${f}`);
        console.log(`de file ${f} is geladen`);

        client.commands.set(fileGet.help.name, fileGet);
    })
});



client.on("guildMemberAdd", newMember => {
    var role = newMember.guild.roles.cache.find(ro => ro.name == "welkom");
    var welkom = newMember.guild.channels.cache.find(ch => ch.name == "regels");
    var channel = newMember.guild.channels.cache.find(ch => ch.name == "『👋🏻』welkom");
    var joinembed = new discord.MessageEmbed()
    .setColor("GREEN")
    .setThumbnail(newMember.author.AvatarURL());
    channel.send(joinembed);
    newMember.roles.add(role.id);
});

client.on("guildMemberRemove", doeimember => {
    var channel = doeimember.guild.channels.cache.find(dca => dca.name == "👋doei");
    var role = doeimember.guild.roles.cache.find(ro => ro.name == "welkom");
    channel.send(`${doeimember} heeft de server verlaten`);
})


client.on("ready", async () => {
    var prefix = botConfig.prefix;
    console.log(`${client.user.username} is online.`);
    client.user.setActivity(`fortnite | ${prefix}help`, { type: "PLAYING" });

});

// var swearwords = ["koe", "kalf", "varken"];
client.on("message", async message => {

    if (message.author.bot) return;

    if (message.channel.type === "dm") return;

    var swearwords = JSON.parse(fs.readFileSync("./data/swearwords.json"));

    var msg = message.content.toLowerCase();

    for (let i = 0; i < swearwords["vloekwoorden"].length; i++) {

        if (msg.includes(swearwords["vloekwoorden"][i])) {
            message.delete();

            return (await (message.reply("gelieve niet te schelden/vloeken"))).then({timeout: [5000]});
        }
    }

    var prefix = botConfig.prefix;

    var args = message.content.slice(prefix.length).split(/ +/);

    var messageArray = message.content.split(" ");

    var command = messageArray[0];
    if (!message.content.startsWith(prefix)) return;

    var categoryID = "733335844856791170";
    if(!message.channel.parentID == categoryID){
        message.delete();
    }

    var args = messageArray.slice(1);
    var commands = client.commands.get(command.slice(prefix.length));

    if (commands) commands.run(client, message, args);

    if (command === `${prefix}info`) {
        // Embed wat we gaan laten tonen.
        //     var botEmbed = new discord.MessageEmbed()
        //         .setTitle('titel')
        //         .setDescription("Zet de beschrijving")
        //         .setColor("#0099ff")
        //         .addField("Bot naam", client.user.username)

        //         .setThumbnail('https://i.imgur.com/wSTFkRM.png')
        //         .setImage('https://i.imgur.com/wSTFkRM.png')
        //         .setTimestamp()
        //         .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

        //     // Terug sturen van het bericht
        //     return message.channel.send(botEmbed);
        // }

        // .addFields(
        //     {name:"Bot naam",value: bot.user.username},
        //     {name:"Bot naam",value: bot.user.username}

    }

    if (command === `${prefix}serverinfo`) {

        // var serverEmbed = new discord.MessageEmbed()
        //     .setDescription("Zet de beschrijving")
        //     .setColor("#kleur")
        //     .addField("Bot naam", client.user.username)
        //     .addField("Je bent deze server gejoind op", message.member.joinedAt)
        //     .addField("Totaal memebers", message.guild.memberCount);

        // return message.channel.send(serverEmbed);
    }


});
client.login(botConfig.token);
