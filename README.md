# Discord.js E-Learning System

Discord.jsを使ったBot開発の楽しさを体験できるシンプルなe-ラーニングシステムです。

## 機能

- **インタラクティブなコードエディタ**: Monaco Editorを使用した高機能エディタ
- **サンドボックス実行環境**: 安全にコードを実行できる隔離環境
- **リアルタイム結果表示**: 実行結果を即座に確認
- **段階的な学習**: 初級から応用まで5つのレッスン
- **Discord.js v14対応**: 最新のDiscord.jsを使用

## 技術スタック

- **フロントエンド**: Next.js 14, React, TypeScript, Tailwind CSS
- **バックエンド**: Next.js API Routes, Prisma, MySQL
- **エディタ**: Monaco Editor
- **Discord**: discord.js v14

## セットアップ

### 1. プロジェクトのクローン

```bash
git clone <repository-url>
cd discordjs-e-learning-web
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env`ファイルを作成し、以下の内容を設定してください：

```env
DATABASE_URL="mysql://user:password@localhost:3306/discord_learning"
DISCORD_TOKEN="your_discord_bot_token_here"
DISCORD_CHANNEL_ID="your_channel_id_here"
DOCKER_HOST="unix:///var/run/docker.sock"
```

### 4. データベースの設定

```bash
# Prisma クライアントを生成
npx prisma generate

# データベースマイグレーション
npx prisma migrate dev

# サンプルデータの投入
npm run db:seed
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは `http://localhost:3000` で起動します。

## レッスン構成

### 初級編
1. **Hello Discord** - 最初のメッセージ送信
2. **コマンドに反応** - メッセージに応答するBot
3. **絵文字リアクション** - リアクション機能
4. **埋め込みメッセージ** - Embedの作成
5. **ボタンを作る** - インタラクション基礎

## セキュリティ機能

- コード実行は完全に隔離されたサンドボックス内で実行
- 危険なNode.jsモジュールはブロック
- 実行時間制限: 30秒
- メモリ制限: 128MB

## 開発

### プロジェクト構成

```
discordjs-e-learning-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── execute/       # コード実行API
│   │   │   ├── lessons/       # レッスン API
│   │   │   ├── users/         # ユーザー API
│   │   │   └── progress/      # 進捗 API
│   │   ├── lessons/           # レッスンページ
│   │   └── page.tsx           # ホームページ
│   ├── components/            # Reactコンポーネント
│   │   ├── CodeEditor.tsx     # コードエディタ
│   │   └── ResultView.tsx     # 結果表示
│   └── lib/                   # ユーティリティ
│       ├── prisma.ts          # Prisma クライアント
│       ├── sandbox.ts         # サンドボックス実行
│       └── discord.ts         # Discord Bot
├── prisma/                    # データベース設定
│   ├── schema.prisma          # データベーススキーマ
│   └── seed.ts                # サンプルデータ
└── public/                    # 静的ファイル
```

### コマンド

```bash
# 開発サーバー
npm run dev

# ビルド
npm run build

# プロダクション実行
npm start

# リンティング
npm run lint

# データベースシード
npm run db:seed
```

## ライセンス

MIT License
