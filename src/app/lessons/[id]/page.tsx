'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import CodeEditor from '@/components/CodeEditor';
import ResultView from '@/components/ResultView';

interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  timestamp: Date;
}

const lessonData = {
  1: {
    title: "Hello Discord",
    description: "最初のメッセージ送信",
    instruction: "Discord.jsを使って、チャンネルにメッセージを送信してみましょう。",
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
    hints: [
      "client.once('ready', ...)でBotが起動したときの処理を書きます",
      "channel.send()でメッセージを送信できます",
      "実際のトークンとチャンネルIDは自動で設定されます",
    ],
  },
  2: {
    title: "コマンドに反応",
    description: "メッセージに応答するBot",
    instruction: "特定のメッセージに反応してBotが応答する機能を実装しましょう。",
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
    hints: [
      "client.on('messageCreate', ...)でメッセージを受信できます",
      "message.author.botでBotのメッセージかどうか判定できます",
      "message.reply()で返信できます",
    ],
  },
  3: {
    title: "絵文字リアクション",
    description: "リアクション機能",
    instruction: "メッセージに自動で絵文字リアクションを追加する機能を実装しましょう。",
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
    hints: [
      "message.react()でリアクションを追加できます",
      "絵文字はUnicodeまたはカスタム絵文字IDを使用できます",
      "message.content.includes()で部分一致を判定できます",
    ],
  },
  4: {
    title: "埋め込みメッセージ",
    description: "Embedの作成",
    instruction: "リッチな埋め込みメッセージ（Embed）を作成して送信しましょう。",
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
    hints: [
      "EmbedBuilder()でEmbedオブジェクトを作成します",
      "setTitle(), setDescription()でタイトルと説明を設定",
      "addFields()でフィールドを追加できます",
      "message.reply({ embeds: [embed] })で送信",
    ],
  },
  5: {
    title: "ボタンを作る",
    description: "インタラクション基礎",
    instruction: "ボタンを含むメッセージを送信し、ボタンのクリックに応答しましょう。",
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
    hints: [
      "ButtonBuilder()でボタンを作成します",
      "ActionRowBuilder()でボタンを行に配置",
      "interaction.isButton()でボタンクリックか判定",
      "interaction.reply()で応答",
    ],
  },
};

export default function LessonPage() {
  const params = useParams();
  const lessonId = parseInt(params.id as string);
  const lesson = lessonData[lessonId as keyof typeof lessonData];
  
  const [code, setCode] = useState(lesson?.initialCode || '');
  const [result, setResult] = useState<ExecutionResult | undefined>();
  const [isExecuting, setIsExecuting] = useState(false);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleExecute = async (codeToExecute: string) => {
    setIsExecuting(true);
    
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId,
          code: codeToExecute,
        }),
      });

      const data = await response.json();
      
      setResult({
        success: data.success,
        output: data.output,
        error: data.error,
        timestamp: new Date(),
      });
    } catch (error) {
      setResult({
        success: false,
        error: 'コードの実行中にエラーが発生しました',
        timestamp: new Date(),
      });
    } finally {
      setIsExecuting(false);
    }
  };

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            レッスンが見つかりません
          </h1>
          <Link
            href="/lessons"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            レッスン一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {lesson.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {lesson.description}
              </p>
            </div>
            <Link
              href="/lessons"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              ← 一覧に戻る
            </Link>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                レッスン内容
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {lesson.instruction}
              </p>
              
              <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
                💡 ヒント
              </h3>
              <ul className="space-y-2">
                {lesson.hints.map((hint, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                    • {hint}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-rows-2 gap-6 h-[800px]">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  コードエディタ
                </h2>
                <div className="h-80">
                  <CodeEditor
                    initialCode={lesson.initialCode}
                    onCodeChange={handleCodeChange}
                    onExecute={handleExecute}
                    isExecuting={isExecuting}
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  実行結果
                </h2>
                <div className="h-80">
                  <ResultView result={result} isExecuting={isExecuting} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}