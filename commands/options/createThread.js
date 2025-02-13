const { SlashCommandBuilder, ChannelType, ThreadAutoArchiveDuration } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create-thread")
        .setDescription("Creates a thread with content filtered by a tag from a forum channel.")

        .addChannelOption(option =>
            option.setName("forum_channel")
                .setDescription("Select the forum channel where posts are located")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildForum)
        )

        .addStringOption(option =>
            option.setName("tag")
                .setDescription("Select a tag from the available options")
                .setRequired(true)
                .addChoices(
                    { name: "Design", value: "design" },
                    { name: "Marketing", value: "marketing" },
                    { name: "Communication", value: "communication" },
                    { name: "Code", value: "code" },
                    { name: "Science", value: "science" },
                    { name: "Art", value: "art" },
                    { name: "Livres", value: "livres" },
                    { name: "PDF", value: "pdf" }
                )
        )

        .addChannelOption(option =>
            option.setName("thread_channel")
                .setDescription("Select the channel where the new thread will be created")
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            // ✅ Defer the reply immediately to prevent timeout
            await interaction.deferReply({ ephemeral: false });

            const forumChannel = interaction.options.getChannel("forum_channel");
            const selectedTag = interaction.options.getString("tag");
            const threadChannel = interaction.options.getChannel("thread_channel");

            if (!forumChannel || forumChannel.type !== ChannelType.GuildForum) {
                return interaction.followUp({ content: "Please select a **valid forum channel**!" });
            }

            console.log("📌 Fetching available tags...");
            const availableTagMap = Object.fromEntries(
                forumChannel.availableTags.map(tag => [tag.id, tag.name.toLowerCase()])
            );
            console.log("Available Tags:", availableTagMap);

            console.log(`📂 Fetching threads from forum: ${forumChannel.name}`);

            const threads = await forumChannel.threads.fetch();
            const allThreads = [...threads.threads.values()];

            if (allThreads.length === 0) {
                return interaction.followUp({ content: "No forum posts found in this forum!" });
            }

            console.log(`🔍 Found ${allThreads.length} threads.`);

            let urlsContent = [];
            let imagesContent = [];

            for (const thread of allThreads) {
                const threadTags = thread.appliedTags.map(tagId => availableTagMap[tagId] || "unknown");

                console.log(`🔍 Thread: ${thread.name}, Tags: ${threadTags}`);

                if (!threadTags.includes(selectedTag.toLowerCase())) continue;

                console.log(`✔️ Thread Matched: ${thread.name}`);

                const messages = await thread.messages.fetch();

                for (const message of messages.values()) {
                    const messageText = message.content.trim();

                    const urls = messageText.match(/https?:\/\/[^\s]+/g);
                    if (urls) {
                        urls.forEach(url => urlsContent.push({ text: messageText, url }));
                    }

                    const images = message.attachments
                        .filter(attachment => attachment.contentType?.startsWith("image/"))
                        .map(img => ({ text: messageText, url: img.url }));
                    imagesContent.push(...images);
                }
            }

            console.log("📌 Extracted URLs:", urlsContent);
            console.log("🖼 Extracted Images:", imagesContent);

            if (urlsContent.length === 0 && imagesContent.length === 0) {
                return interaction.followUp({ content: "No relevant content found in the selected forum posts!" });
            }

            // ✅ Create a new thread in the target channel
            const newThread = await threadChannel.threads.create({
                name: `Filtered: ${selectedTag}`,
                autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
            });

            // ✅ Send each URL as an individual message
            if (urlsContent.length > 0) {
                await newThread.send("**📌 Extracted URLs:**");
                for (const item of urlsContent) {
                    await newThread.send(`${item.text}\n${item.url}`);
                }
            }

            // ✅ Send each image as an individual message
            if (imagesContent.length > 0) {
                await newThread.send("\n\n**🖼 Extracted Images:**");
                for (const item of imagesContent) {
                    await newThread.send(`${item.text}\n${item.url}`);
                }
            }

            await interaction.followUp({ content: `Thread created: <#${newThread.id}>` });

        } catch (error) {
            console.error("❌ Error in create-thread command:", error);
            await interaction.followUp({ content: "An error occurred while executing this command!" });
        }
    },
};
