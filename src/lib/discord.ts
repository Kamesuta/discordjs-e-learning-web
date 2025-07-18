import { Client, GatewayIntentBits } from 'discord.js';

let client: Client | null = null;

export function getDiscordClient(): Client {
  if (!client) {
    client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    client.once('ready', () => {
      console.log(`Discord bot is ready! Logged in as ${client?.user?.tag}`);
    });

    client.on('error', (error) => {
      console.error('Discord client error:', error);
    });
  }

  return client;
}

export async function initializeDiscordBot(): Promise<void> {
  const discordToken = process.env.DISCORD_TOKEN;
  
  if (!discordToken) {
    console.warn('DISCORD_TOKEN is not set. Discord bot will not be available.');
    return;
  }

  try {
    const discordClient = getDiscordClient();
    await discordClient.login(discordToken);
    console.log('Discord bot successfully logged in');
  } catch (error) {
    console.error('Failed to initialize Discord bot:', error);
    throw error;
  }
}

export async function sendMessageToChannel(message: string): Promise<void> {
  const channelId = process.env.DISCORD_CHANNEL_ID;
  
  if (!channelId) {
    console.warn('DISCORD_CHANNEL_ID is not set. Cannot send message.');
    return;
  }

  try {
    const discordClient = getDiscordClient();
    const channel = await discordClient.channels.fetch(channelId);
    
    if (channel?.isTextBased()) {
      await channel.send(message);
    } else {
      console.error('Channel is not text-based or not found');
    }
  } catch (error) {
    console.error('Failed to send message to Discord channel:', error);
    throw error;
  }
}

export async function cleanupDiscordBot(): Promise<void> {
  if (client) {
    try {
      await client.destroy();
      client = null;
      console.log('Discord bot disconnected');
    } catch (error) {
      console.error('Error during Discord bot cleanup:', error);
    }
  }
}