import { CommandInteraction, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from "discord.js"
import { Command } from "./index.ts"

const data = new SlashCommandBuilder()
    .setName("link")
    .setDescription("initiate the minecraft / sentinel pairing flow")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

async function execute(interaction: CommandInteraction) {
    await interaction.reply({ "content": "hello", flags: MessageFlags.Ephemeral })
}

export const link: Command = { data, execute }
