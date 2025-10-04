import { CommandInteraction, SlashCommandBuilder } from "discord.js"
import { Command } from "."

const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("simple ping command")

async function execute(interaction: CommandInteraction) {
    await interaction.reply("pong")
}

export const ping: Command = { data, execute }
