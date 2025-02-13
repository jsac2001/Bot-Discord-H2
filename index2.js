const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const { Player } = require('discord-player');
const axios = require('axios');
const { token, newsApiKey, meteoApiKey, openaiApiKey } = require('./config.json');

// Initialisation du bot Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers
    ]
});

// Initialisation du Player pour la musique
const player = new Player(client);

const prefix = '!';
let chatSessionActive = false; // Indique si une session ChatGPT est active

client.once('ready', async () => {
    console.log(`✅ Connecté en tant que ${client.user.tag}`);

        client.guilds.cache.forEach(async (guild) => {
            try {
                // 🔹 1️⃣ Vérifier et créer le salon "commandes-bot" si inexistant
                let commandChannel = guild.channels.cache.find(ch => ch.name === "commandes-bot");
    
                if (!commandChannel) {
                    commandChannel = await guild.channels.create({
                        name: "commandes-bot",
                        type: 0, // 0 = salon texte
                        permissionOverwrites: [
                            {
                                id: guild.roles.everyone.id, // Tous les membres
                                allow: ["ViewChannel", "ReadMessageHistory"], // Voir les messages
                                deny: ["SendMessages"], // Empêcher d'envoyer des messages
                            },
                            {
                                id: client.user.id, // Le bot
                                allow: ["ViewChannel", "SendMessages"], // Autoriser le bot à envoyer des messages
                            }
                        ],
                    });
    
                    console.log(`✅ Salon "commandes-bot" créé dans ${guild.name}`);
                    await commandChannel.send("📌 **Liste des commandes du bot :**\n\n"
                        + "🛠️ **Modération**\n"
                        + "`!mute @user X` → Mute un membre pour X minutes.\n"
                        + "`!unmute @user` → Unmute un membre.\n"
                        + "`!kick @user` → Expulse un membre.\n"
                        + "`!ban @user` → Bannit un membre.\n"
                        + "`!clear X` → Supprime X messages dans le chat.\n\n"
                        + "🎵 **Musique**\n"
                        + "`!play [titre/url]` → Joue une musique.\n"
                        + "`!pause` → Met en pause.\n"
                        + "`!resume` → Reprend la musique.\n"
                        + "`!stop` → Arrête la musique.\n"
                        + "`!skip` → Passe à la musique suivante.\n\n"
                        + "💬 **ChatGPT**\n"
                        + "`!u up` → Active la discussion avec ChatGPT.\n"
                        + "`!stop` → Arrête la session ChatGPT.\n\n"
                        + "📢 **Autres**\n"
                        + "`!weather [ville]` → Donne la météo.\n"
                        + "`!news` → Affiche les dernières actualités.\n"
                        + "`!userinfo @user` → Affiche les infos d'un membre.\n\n"
                        + "🔥 **Amuse-toi bien !**"
                    );
                } else {
                    console.log(`📌 Le salon "commandes-bot" existe déjà dans ${guild.name}`);
                }
    
                // 🔹 2️⃣ Envoyer "Salut les loulous" dans le salon "général"
                let generalChannel = guild.channels.cache.find(ch => ch.name.toLowerCase() === "général");
    
                if (!generalChannel) {
                    // Si "général" n'existe pas, prendre le premier canal texte disponible
                    generalChannel = guild.channels.cache
                        .filter(ch => ch.isTextBased() && ch.permissionsFor(client.user).has("SendMessages"))
                        .sort((a, b) => a.position - b.position) // Trier pour choisir le premier canal disponible
                        .first();
                }
    
                if (generalChannel) {
                    await generalChannel.send(' Salut les loulous 👋 !');
                    console.log(`✅ Message envoyé dans "${guild.name}" → ${generalChannel.name}`);
                } else {
                    console.warn(`⚠️ Aucun canal valide trouvé dans "${guild.name}".`);
                }
    
            } catch (error) {
                console.error(`❌ Erreur dans "${guild.name}":`, error);
            }
        });
    
});

// Événement pour gérer l'arrivée d'un nouveau membre
client.on('guildMemberAdd', (member) => {
    member.send(`bienvenu dans le serveur des trans!`)
        .then(() => console.log(`Message de bienvenue envoyé à ${member.user.tag}.`))
        .catch((err) => console.error(`Erreur lors de l'envoi du message privé :`, err));

    const channel = member.guild.channels.cache.find(ch => ch.name === 'general'); 
    if (channel) {
        channel.send(`@${member.user.tag}, bienvenu dans le serveur des trans !`);
    }
});

// Gestion des commandes
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Liste des mots-clés déclencheurs
    const keywords = ['ali', 'quentin', 'juan'];
    if (keywords.some(keyword => message.content.toLowerCase().includes(keyword))) {
        message.channel.send('the best');
        return;
    }

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();


    // Commande `!u up` pour démarrer une session avec ChatGPT
if (command === 'u' && args[0] === 'up') {
    chatSessionActive = true;
    message.channel.send(`Salut ${message.author.username}, que puis-je faire pour vous ?`);
    return;
}

// Commande pour arrêter la session ChatGPT
if (command === 'stop') {
    if (chatSessionActive) {
        chatSessionActive = false;
        message.channel.send(`Session terminée. À bientôt, ${message.author.username} !`);
    } else {
        message.channel.send('Aucune session n\'est active actuellement.');
    }
    return;
}

// Gestion de ChatGPT pour les sessions actives
if (chatSessionActive) {
    const userMessage = message.content;
    try {
        const gptResponse = await getChatGPTResponse(userMessage);
        message.channel.send(gptResponse);
    } catch (err) {
        console.error('Erreur avec ChatGPT :', err);
        message.channel.send('Désolé, une erreur est survenue en parlant avec ChatGPT.');
    }
    return;
}
    // Commande `!weather` pour afficher la météo
    if (command === 'weather') {
        const ville = args.join(' ');
        if (!ville) {
            return message.channel.send('❌ Veuillez indiquer une ville. Exemple : `!weather Paris`');
        }

        try {
            const url = `https://api.meteo-concept.com/api/forecast/daily?token=${meteoApiKey}&insee=${encodeURIComponent(ville)}`;
            const response = await axios.get(url);

            if (response.data.forecast && response.data.forecast.length > 0) {
                const forecast = response.data.forecast[0];
                const weatherMessage = `
🌦 **Météo pour ${ville} :**
- **Température minimale :** ${forecast.tmin}°C
- **Température maximale :** ${forecast.tmax}°C
- **Prévisions :** ${forecast.weather}.
                `;
                message.channel.send(weatherMessage);
            } else {
                message.channel.send('❌ Je n\'ai pas trouvé de données météo pour cette ville.');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des données météo :', error);
            message.channel.send('❌ Une erreur est survenue en essayant de récupérer les données météo.');
        }
    }
    //cmd mute
    if (command === "mute") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return message.channel.send("❌ Vous n'avez pas la permission de mute.");
        }
    
        const member = message.mentions.members.first();
        if (!member) {
            return message.channel.send("❌ Veuillez mentionner un utilisateur à mute.");
        }
    
        const duration = parseInt(args[1]);
        if (isNaN(duration) || duration <= 0) {
            return message.channel.send("❌ Spécifiez une durée en minutes. Exemple : `!mute @utilisateur 10`");
        }
    
        try {
            await member.timeout(duration * 60 * 1000, "Mute par un modérateur");
            message.channel.send(`🔇 **${member.user.tag}** a été mute pour ${duration} minutes.`);
        } catch (error) {
            console.error("❌ Erreur lors du mute :", error);
            message.channel.send("❌ Impossible de mute cet utilisateur. Vérifiez mes permissions !");
        }
    }
    //cmd unmute
    if (command === "unmute") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return message.channel.send("❌ Vous n'avez pas la permission d'unmute.");
        }
    
        const member = message.mentions.members.first();
        if (!member) {
            return message.channel.send("❌ Veuillez mentionner un utilisateur à unmute.");
        }
    
        if (member.communicationDisabledUntilTimestamp === null) {
            return message.channel.send("❌ Cet utilisateur n'est pas mute.");
        }
    
        try {
            await member.timeout(null);
            message.channel.send(`🔊 **${member.user.tag}** a été unmute.`);
        } catch (error) {
            console.error("❌ Erreur lors de l'unmute :", error);
            message.channel.send("❌ Impossible d'unmute cet utilisateur. Vérifiez mes permissions !");
        }
    }

    // Commande `!news` pour afficher les actualités
    if (command === 'news') {
        try {
            const url = `https://newsapi.org/v2/top-headlines?country=fr&apiKey=${newsApiKey}`;
            const response = await axios.get(url);
            const articles = response.data.articles;

            if (!articles.length) {
                return message.channel.send('Aucune actualité récente trouvée.');
            }

            let newsMessage = '**Voici les dernières actualités en France :**\n';
            articles.slice(0, 3).forEach((article, index) => {
                newsMessage += `\n**${index + 1}. ${article.title}**\n${article.description || 'Pas de description disponible.'}\n[Lire l\'article complet](${article.url})\n`;
            });

            message.channel.send(newsMessage);
        } catch (error) {
            console.error('Erreur lors de la récupération des actualités :', error);
            message.channel.send('❌ Une erreur est survenue en essayant de récupérer les actualités.');
        }
    }
    //cmd clear des messages suprimer les msg
    if (command === "clear") {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.channel.send("❌ Vous n'avez pas la permission de supprimer des messages.");
        }
    
        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount <= 0 || amount > 100) {
            return message.channel.send("❌ Spécifiez un nombre de messages à supprimer (entre 1 et 100).");
        }
    
        try {
            const fetched = await message.channel.messages.fetch({ limit: amount });
            const filtered = fetched.filter(msg => (Date.now() - msg.createdTimestamp) < 14 * 24 * 60 * 60 * 1000);
    
            if (filtered.size === 0) {
                return message.channel.send("❌ Aucun message supprimable (plus de 14 jours).");
            }
    
            await message.channel.bulkDelete(filtered, true);
            message.channel.send(`🧹 **${filtered.size} messages ont été supprimés.**`).then(msg => {
                setTimeout(() => msg.delete(), 3000);
            });
        } catch (error) {
            console.error("❌ Erreur lors de la suppression :", error);
            message.channel.send("❌ Une erreur est survenue lors de la suppression des messages.");
        }
    }
    // Commandes musicales
    if (command === 'play') {
        const query = args.join(' ');
        if (!query) return message.channel.send('❌ Veuillez fournir un titre ou une URL YouTube.');

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('❌ Vous devez être dans un salon vocal pour jouer de la musique.');

        try {
            const searchResult = await player.search(query, {
                requestedBy: message.author
            });

            if (!searchResult || !searchResult.tracks.length) {
                return message.channel.send('❌ Aucun résultat trouvé pour votre requête.');
            }

            const queue = await player.createQueue(message.guild, {
                metadata: {
                    channel: message.channel
                }
            });

            if (!queue.connection) await queue.connect(voiceChannel);

            queue.addTrack(searchResult.tracks[0]);
            if (!queue.playing) await queue.play();
            message.channel.send(`🎶 Lecture en cours : **${searchResult.tracks[0].title}**`);
        } catch (error) {
            console.error('❌ Une erreur est survenue en essayant de lire la musique.', error);
        }
    }

    if (command === 'pause') {
        const queue = player.getQueue(message.guild);
        if (!queue || !queue.playing) return message.channel.send('❌ Aucune musique en cours.');

        queue.setPaused(true);
        message.channel.send('⏸️ Musique mise en pause.');
    }

    if (command === 'resume') {
        const queue = player.getQueue(message.guild);
        if (!queue || !queue.paused) return message.channel.send('❌ Aucune musique en pause.');

        queue.setPaused(false);
        message.channel.send('▶️ Musique reprise.');
    }

    if (command === 'stop') {
        const queue = player.getQueue(message.guild);
        if (!queue) return message.channel.send('❌ Aucune musique en cours.');

        queue.destroy();
        message.channel.send('🛑 Musique arrêtée.');
    }

    if (command === 'skip') {
        const queue = player.getQueue(message.guild);
        if (!queue || !queue.playing) return message.channel.send('❌ Aucune musique en cours.');

        const currentTrack = queue.current;
        queue.skip();
        message.channel.send(`⏭️ Musique passée : **${currentTrack.title}**`);
    }

    // Commande `!userinfo`
    if (command === 'userinfo') {
        const user = message.mentions.users.first() || message.author;
        const member = message.guild.members.cache.get(user.id);

        const userInfo = `
👤 **Infos sur l'utilisateur :**
- **Nom d'utilisateur :** ${user.username}
- **ID :** ${user.id}
- **Rejoint le serveur :** ${new Date(member.joinedAt).toLocaleDateString()}
- **Compte créé le :** ${new Date(user.createdAt).toLocaleDateString()}
        `;
        message.channel.send(userInfo);
    }

    // Commande `hello`
    if (command === 'hello') {
        message.channel.send(`Salut ${message.author.username} !`);
    }

    // Commande `say`
    if (command === 'say') {
        const text = args.join(' ');
        if (!text) {
            message.channel.send('Veuillez fournir un texte à dire.');
            return;
        }
        message.channel.send(text);
    }
    // Commande `!kick`
    if (command === 'kick') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.channel.send('❌ Vous n\'avez pas la permission de kick.');
        }

        const member = message.mentions.members.first();
        if (!member) {
            return message.channel.send('❌ Veuillez mentionner un utilisateur à kick.');
        }

        if (!member.kickable) {
            return message.channel.send('❌ Je ne peux pas kick cet utilisateur.');
        }

        try {
            await member.kick();
            message.channel.send(`✅ **${member.user.tag}** a été kick avec succès.`);
        } catch (error) {
            console.error('Erreur lors du kick :', error);
            message.channel.send('❌ Une erreur est survenue en essayant de kick cet utilisateur.');
        }
    }

    // Commande `!ban`
    if (command === 'ban') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.channel.send('❌ Vous n\'avez pas la permission de bannir.');
        }

        const member = message.mentions.members.first();
        if (!member) {
            return message.channel.send('❌ Veuillez mentionner un utilisateur à bannir.');
        }

        if (!member.bannable) {
            return message.channel.send('❌ Je ne peux pas bannir cet utilisateur.');
        }

        try {
            await member.ban();
            message.channel.send(`✅ **${member.user.tag}** a été banni avec succès.`);
        } catch (error) {
            console.error('Erreur lors du bannissement :', error);
            message.channel.send('❌ Une erreur est survenue en essayant de bannir cet utilisateur.');
        }
    }
});

// Fonction pour interagir avec OpenAI via GPT-4o-mini
async function getChatGPTResponse(userMessage) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            store: true,
            messages: [
                { "role": "user", "content": userMessage }
            ],
        });

        return completion.choices[0].message.content.trim();
    } catch (error) {
        console.error("Erreur avec OpenAI :", error);
        return "Désolé, une erreur est survenue en parlant avec ChatGPT.";
    }
}

// Connexion au bot avec le token
client.login(token).catch((err) => {
    console.error('Erreur lors de la connexion au bot :', err);
});