import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const lessons = [
    {
      title: 'Hello Discord',
      description: '最初のメッセージ送信',
      initialCode: `const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.once('ready', () => {
  console.log('Bot is ready!');
  
  // チャンネルIDを指定してメッセージを送信
  const channel = client.channels.cache.get('CHANNEL_ID');
  if (channel) {
    channel.send('Hello, Discord!');
  }
});

client.login('YOUR_BOT_TOKEN');`,
      order: 1,
    },
    {
      title: 'コマンドに反応',
      description: 'メッセージに応答するBot',
      initialCode: `const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on('messageCreate', (message) => {
  // Botのメッセージは無視
  if (message.author.bot) return;
  
  // 「こんにちは」と言われたら応答
  if (message.content === 'こんにちは') {
    message.reply('こんにちは！元気ですか？');
  }
});

client.login('YOUR_BOT_TOKEN');`,
      order: 2,
    },
    {
      title: '絵文字リアクション',
      description: 'リアクション機能',
      initialCode: `const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  
  // 「いいね」というメッセージに👍リアクションを追加
  if (message.content.includes('いいね')) {
    message.react('👍');
  }
});

client.login('YOUR_BOT_TOKEN');`,
      order: 3,
    },
    {
      title: '埋め込みメッセージ',
      description: 'Embedの作成',
      initialCode: `const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  
  if (message.content === '!embed') {
    const embed = new EmbedBuilder()
      .setTitle('埋め込みメッセージ')
      .setDescription('これは埋め込みメッセージです')
      .setColor('#0099ff')
      .addFields(
        { name: 'フィールド1', value: '値1', inline: true },
        { name: 'フィールド2', value: '値2', inline: true }
      )
      .setTimestamp();
    
    message.reply({ embeds: [embed] });
  }
});

client.login('YOUR_BOT_TOKEN');`,
      order: 4,
    },
    {
      title: 'ボタンを作る',
      description: 'インタラクション基礎',
      initialCode: `const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  
  if (message.content === '!button') {
    const button = new ButtonBuilder()
      .setCustomId('hello_button')
      .setLabel('クリックしてね！')
      .setStyle(ButtonStyle.Primary);
    
    const row = new ActionRowBuilder()
      .addComponents(button);
    
    message.reply({ content: 'ボタンをクリックしてください', components: [row] });
  }
});

client.on('interactionCreate', (interaction) => {
  if (!interaction.isButton()) return;
  
  if (interaction.customId === 'hello_button') {
    interaction.reply('ボタンがクリックされました！');
  }
});

client.login('YOUR_BOT_TOKEN');`,
      order: 5,
    },
  ];

  for (const lesson of lessons) {
    await prisma.lesson.upsert({
      where: { order: lesson.order },
      update: lesson,
      create: lesson,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });