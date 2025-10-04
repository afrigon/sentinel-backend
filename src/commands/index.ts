import { Collection, SlashCommandBuilder, CommandInteraction } from "discord.js"
import { ping } from "./ping.ts"
import { link } from "./link.ts"

export interface Command {
    data: SlashCommandBuilder,
    execute(interaction: CommandInteraction): Promise<void>
}

export const commands = [
    ping,
    link
].reduce((acc, c) => {
    acc.set(c.data.name, c)
    return acc
}, new Collection<string, Command>)