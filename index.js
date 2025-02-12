// Import required packages & token
const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const corsOptions = {
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

// Create a new client to run the bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Create a command collection
client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

// Get the individual commands from their respective subfolder inside "commands"
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// Get the events from the "event" folder
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(token);

//Shows a "hello world" message
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Fetch forum posts from bot-veille channel
app.get("/api/forum-posts", async (req, res) => {
  try {
    const channel = client.channels.cache.find(
      (channel) => channel.name === "bot-veille" && channel.type === 15
    );
    
    if (!channel) {
      return res.status(404).json({ error: "Forum channel not found" });
    }

    const threads = await channel.threads.fetch();
    const activePosts = threads.threads.map(thread => ({
      id: thread.id,
      name: thread.name
    }));

    res.json(activePosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch forum posts" });
  }
});

// Handle submissions to forum posts
app.post("/api/submit", async (req, res) => {
  try {
    const { threadId, type, data, message } = req.body;
    
    const thread = await client.channels.fetch(threadId);
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    let content = message || "";
    if (type === "url") {
      content += content ? `\n${data}` : data;
      await thread.send(content);
    } else if (type === "image") {
      await thread.send({
        content: content || null,
        files: [data]
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit to forum" });
  }
});

//Error handling for undefined routes
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({
    message: err.message,
  });
  return;
});
