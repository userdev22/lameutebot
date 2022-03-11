require('dotenv').config();
const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const { joinVoiceChannel } = require('@discordjs/voice');
const { SlashCommandBuilder } = require("@discordjs/builders");
const { optional } = require("zod");
const Canvas = require("canvas");
const Client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MEMBERS
    ]
});

const prefix = "!";
const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("renvoie Pong")
    .addUserOption(option => option
        .setName("utilisateur")
        .setDescription("Utilisteur que vous souhaitez mentionner")
        .setRequired(false));

Client.on("ready", async () => {
    console.log("bot opérationnel");
    //Client.guilds.cache.get("948662312577941594").commands.create(data);


    await Client.guilds.cache.get("948662312577941594").commands.fetch();

    function randomStatus(){
        let status = ["La Meute sur Youtube","!help"]
        let rstatus = Math.floor(Math.random() * status.length);

        Client.user.setActivity(status[rstatus], {type: "WATCHING", url: "https://www.youtube.com/channel/UCq_rgq4OolfZiYx-dvLNMaQ?view_as=subscriber"});

    }; setInterval(randomStatus, 2000)

});

Client.on("raw", event => {
    if(event.t === "MESSAGE_REACTION_ADD"){
        if(event.d.message_id === "951761961652195368"){
            let member = Client.guilds.cache.get(event.d.guilds_id).members.cache.get(event.d.user_id)
            console.log("ticket marche !");
            if(event.d.emoji.name === "🔴"){
                member.guild.channels.create(`🎟️ ${member.user.username}`, {type: "text"}).then(chan => {
                    let category = member.guild.channels.cache.get("951762219979391006", c => c.type == "category")
                    chan.setParent(category)

                    let role1 = member.guild.roles.cache.get("948663161857409024")
                    let role2 = member.guild.roles.cache.get("949314429122658404")
                    let everyone = member.guild.roles.cache.get("948662312577941594")

                    chan.updateOverwrite(role1, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true
                    })
                    chan.updateOverwrite(role2, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true
                    })
                    chan.updateOverwrite(member, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true
                    })
                    chan.updateOverwrite(everyone, {
                        SEND_MESSAGES: false,
                        VIEW_CHANNEL: false
                    })
                }).catch(console.error)
            }
        }
    }
});

Client.on("message", async message => {
    if(message.content === prefix + "close"){
        if(message.channel.parentID == "951762219979391006"){
            message.channel.send("Le probleme a éte régler, le salon va se fermer dans 30 secondes !")
            message.guild.channels.cache.get(message.channel.id).setName(`🎟️  Problème réglé !`)
            setTimeout(() => {
                message.channel.delete()
            }, 30 *600)
        }
    }
});

//Arrivé d'un membre
Client.on("guildMemberAdd", async member => {
    console.log("un membre est arrivé");
    Client.channels.cache.get("949296289756086324").send("Salut <@" + member.id + "> Bienvenue à toi dans le serveur !");
    member.roles.add("949314770870341713");

    var canvas = Canvas.createCanvas(1024, 500);

    ctx = canvas.getContext("2d");

    var background = await Canvas.loadImage("./background.png");
    ctx.drawImage(background, 0, 0, 1024, 500);

    ctx.font = "30px Impact";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.fillText(member.user.tag.toUpperCase(), 512, 410);

    var avatar = await Canvas.loadImage(member.user.displayAvatarURL({
        format: "png",
        size: 1024
    }));

    ctx.drawImage(avatar, 450, 270, 110, 110);

    var attachment = new Discord.MessageAttachment(canvas.toBuffer(), "welcome.png");

    Client.channels.cache.get("949296289756086324").send({files: [attachment]});
});

//Départ d'un membre
Client.on("guildMemberRemove", async member => {
    console.log("Un membre est partie");
    Client.channels.cache.get("949296829353304076").send("Aurevoir <@" + member.id + "> Revien Vite !");
});


Client.on("messageCreate", message => { 
    if (message.author.bot) return;
    //!help

    if (message.content === prefix + "help"){
        const embed = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Liste des commandes")
            .setDescription("Ici Vous trouverez la liste des commandes a utiliser Pour Interagir avec Moi")
            .setThumbnail("https://yt3.ggpht.com/73S9c9d77rCA776Cu_QJoMTa9veyEa5UNUMHR0nQEN3UvRdqBB41c61K0VMUCk0QjROEboiF=s88-c-k-c0x00ffffff-no-rj")
            .addField("__!help__", "Affiche la liste des commandes")
            .addField("__!yt__","Envoie le lien de la chaine youtube")
            .addField("__!idée__" , "Renvoi vers le salon #💡-𝐁𝐨𝐢𝐭𝐞-à-𝐢𝐝é𝐞-💡 pour proposer des idée ")
            .setTimestamp()
            .setFooter("La Meute Rework", "https://yt3.ggpht.com/73S9c9d77rCA776Cu_QJoMTa9veyEa5UNUMHR0nQEN3UvRdqBB41c61K0VMUCk0QjROEboiF=s88-c-k-c0x00ffffff-no-rj");
           

         message.channel.send({embeds: [embed]});
    }

    if (message.content === prefix +"yt"){
        message.reply("Voici le lien de la chaine youtube : https://www.youtube.com/channel/UCq_rgq4OolfZiYx-dvLNMaQ")
    }

     //idée
     if (message.content === prefix + "idée"){
        message.reply("oui hésite pas a l'envoiyée dans #💡-𝐁𝐨𝐢𝐭𝐞-à-𝐢𝐝é𝐞-💡 ! ---> https://discord.gg/nsrxbAzq")
    }
    if(message.content === prefix + "patch"){
     Client.channels.cache.get("950080954490298498").send("Patch Note 08/03/2022\n -Mise en Ligne du bot La Meute\n \n La Meute Rework ")
    
    }
    else if(message.content === prefix + "react"){
       let msg = message.channel.send("Vote");
       msg.then((m) =>{
        m.react("✅");
        m.react("❌");
        m.react("<:meute:949960531039625306>");
       })
    }
});



Client.on("interactionCreate", interaction => {
    if(interaction.isCommand()){
        if(interaction.commandName === "ping"){
            let user = interaction.options.getUser("utilisateur");

            if(user != undefined){
                //<@id>
                interaction.reply("pong <@" + user.id + ">" + " :ping_pong:");
            }
            else{
            interaction.reply("pong :ping_pong:");
            }
        }
    }
});


Client.login(process.env.token);