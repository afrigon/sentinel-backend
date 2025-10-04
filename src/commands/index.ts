import { ping } from "./ping"
import { link } from "./link"
import { Collection, SlashCommandBuilder, CommandInteraction } from "discord.js"

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