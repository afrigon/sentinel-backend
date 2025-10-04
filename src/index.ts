import { REST, Routes, Client, Events, GatewayIntentBits, MessageFlags } from "discord.js"
import { Command as Program } from "commander"
import { Command, commands } from "./commands/index.ts"
import packageJson from "../package.json" with { type: "json" }

function exit(message: string, code: number = 1): never {
    console.error(message)
    process.exit(code)
}

const discordClientId = process.env.DISCORD_CLIENT_ID
const discordToken = process.env.DISCORD_TOKEN

async function deployCommands({ guild }: { guild: string | undefined }) {
    if (discordClientId == null) {
        exit("DISCORD_CLIENT_ID is not set")
    }

    if (discordToken == null) {
        exit("DISCORD_TOKEN is not set")
    }

    const rest = new REST().setToken(discordToken)

    const route = () => {
        if (guild == null) {
            console.log(`Started deploying ${commands.keys.length} application (/) commands globally.`)
            return Routes.applicationCommands(discordClientId)
        } else {
            console.log(`Started deploying ${commands.keys.length} application (/) commands to guild: ${guild}.`)
            return Routes.applicationGuildCommands(discordClientId, guild)
        }
    }

    try {
        const data = await rest.put(
            route(),
            { body: commands.map((c: Command) => c.data.toJSON()) }
        )

        const count = Array.isArray(data) ? data.length : 0
        console.log(`Successfully deployed ${count} application (/) commands.`)
    } catch (error) {
        console.error(error)
    }
}

async function serve() {
    const client = new Client({ intents: [GatewayIntentBits.Guilds] })

    client.once(Events.ClientReady, c => {
        console.log(`Logged in as ${c.user.tag}`)
    })

    client.on(Events.InteractionCreate, interaction => {
        void (async () => {
            if (!interaction.isChatInputCommand()) {
                return
            }

            const command = commands.get(interaction.commandName)

            if (command == null) {
                console.error(`Unknown command: ${interaction.commandName}`)
                return
            }

            try {
                await command.execute(interaction)
            } catch (error) {
                console.error(error)

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: "There was an error while executing this command!", flags: MessageFlags.Ephemeral })
                } else {
                    await interaction.reply({ content: "There was an error while executing this command!", flags: MessageFlags.Ephemeral })
                }
            }
        })()
    })

    await client.login(discordToken)
}

export function main() {
    const program = new Program()
        .version(packageJson.version)

    program
        .command("deploy-commands")
        .option("-g, --guild <string>", "the discord guild id to deploy to")
        .description("upload and register slash commands to the discord api. May take a moment to populate")
        .action(deployCommands)

    program
        .command("serve")
        .description("starts the server")
        .option("-p, --port <number>", "the port to use for inbound connections")
        .action(serve)

    program.parse()
}

main()
