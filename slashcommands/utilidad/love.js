const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const Canvas = require("canvas");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("love")
    .setDescription("Check your love compatibility with another user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User with whom you want to measure your love.")
        .setRequired(true),
    ),
  async execute(interaction) {
    await interaction.deferReply(); // image generation takes time, avoid the 3s interaction timeout

    try {
      const target = interaction.options.getUser("user");
      const lovnum = Math.floor(Math.random() * 100) + 1; // random compatibility percentage (1-100)

      const canvas = Canvas.createCanvas(700, 250);
      const ctx = canvas.getContext("2d");

      const urlBackground = "https://i.imgur.com/VvwST6T.jpeg";
      const urlOverlay = "https://i.imgur.com/xXtjYAi.png";

      const avatarURL = interaction.user.displayAvatarURL({
        extension: "png",
        size: 256,
        forceStatic: true, // force PNG even if the user has an animated avatar (.gif breaks canvas)
      });
      const targetURL = target.displayAvatarURL({
        extension: "png",
        size: 256,
        forceStatic: true, // force PNG even if the user has an animated avatar (.gif breaks canvas)
      });

      const [imgBackground, imgOverlay, avatar, avatarr] = await Promise.all([
        Canvas.loadImage(urlBackground),
        Canvas.loadImage(urlOverlay),
        Canvas.loadImage(avatarURL),
        Canvas.loadImage(targetURL),
      ]);

      ctx.drawImage(imgBackground, 0, 0, canvas.width, canvas.height); // base background image
      ctx.drawImage(imgOverlay, 0, 0, canvas.width, canvas.height); // heart/frame overlay on top

      ctx.font = "bold 40px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(`${lovnum}%`, canvas.width / 2, canvas.height / 1.9); // draw the percentage in the middle

      const drawCircleAvatar = (img, x, y, size) => {
        ctx.save(); // isolate the clipping so it doesn't affect other drawings

        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2 + 2, 0, Math.PI * 2, true);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4;
        ctx.stroke(); // white circular border around the avatar
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 2 + 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip(); // clip drawing area to a circle so the avatar renders round

        ctx.drawImage(img, x, y, size, size);
        ctx.restore(); // remove the clip for future drawings
      };

      drawCircleAvatar(avatar, 40, 27, 195); // executor's avatar (left side)
      drawCircleAvatar(avatarr, 465, 27, 195); // target's avatar (right side)

      const attachment = new AttachmentBuilder(canvas.toBuffer(), {
        name: "love.png",
      });

      const embed = new EmbedBuilder()
        .setColor("#ffb6c1")
        .setImage("attachment://love.png"); // reference the attached file by name

      await interaction.editReply({
        content: `❤️ The compatibility between ${interaction.user} and ${target} is **${lovnum}%**`,
        embeds: [embed],
        files: [attachment], // must be an array
      });
    } catch (error) {
      console.error("Error in love command:", error);

      if (interaction.deferred) {
        await interaction.editReply({
          content: "There was an error in generating the image.",
        });
      }
    }
  },
};
