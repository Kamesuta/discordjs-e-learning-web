# Discord.js E-Learning System 仕様書

## 1. 概要

Discord.jsを使ったBot開発の楽しさを体験できるシンプルなe-ラーニングシステム。
ユーザーがコードを書くと、サンドボックス環境で即座に実行され、専用のDiscordチャンネルで結果を確認できる。

## 2. システム構成

```
[ブラウザ] ←→ [Next.js App] ←→ [サンドボックス実行環境] ←→ [Discord]
                    ↓
                [MySQL DB]
```

### 主要コンポーネント
- **Next.js アプリ**: フロントエンド + API
- **サンドボックス**: Docker コンテナで隔離実行
- **共有Discord Bot**: 学習用の共有Bot
- **MySQL + Prisma**: ユーザーデータと進捗管理

## 3. 機能

### 3.1 基本機能
- コードエディタ（Monaco Editor）
- コード実行ボタン
- 実行結果のリアルタイム表示
- Discord チャンネルでの動作確認

### 3.2 ユーザー体験の流れ
1. サイトにアクセス
2. 簡単なユーザー登録（名前だけ）
3. レッスンを選択
4. コードを書く
5. 実行ボタンを押す
6. 結果をリアルタイムで確認

## 4. レッスン構成

### 初級編（サンドボックス使用）
1. **Hello Discord** - 最初のメッセージ送信
2. **コマンドに反応** - メッセージに応答するBot
3. **絵文字リアクション** - リアクション機能
4. **埋め込みメッセージ** - Embedの作成
5. **ボタンを作る** - インタラクション基礎

### 中級編（サンドボックス使用）
1. **スラッシュコマンド** - モダンなコマンド
2. **選択メニュー** - セレクトメニュー
3. **モーダル** - フォーム入力
4. **一時的なデータ保存** - メモリ内でのデータ管理

### 環境構築編（ガイドのみ）
1. **Botアカウント作成**
2. **トークン取得と管理**
3. **ローカル環境構築**
4. **Botの招待**

## 5. 技術仕様

### 5.1 技術スタック
- **フロントエンド**: Next.js 14 (App Router)
- **エディタ**: Monaco Editor
- **スタイリング**: Tailwind CSS
- **データベース**: MySQL + Prisma
- **実行環境**: Docker
- **Discord**: discord.js v14

### 5.2 データモデル（Prisma）
```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
  progress  Progress[]
  executions Execution[]
}

model Lesson {
  id          Int      @id @default(autoincrement())
  title       String
  description String   @db.Text
  initialCode String   @db.Text
  order       Int
  progress    Progress[]
}

model Progress {
  id        Int      @id @default(autoincrement())
  userId    Int
  lessonId  Int
  completed Boolean  @default(false)
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])
  lesson    Lesson   @relation(fields: [lessonId], references: [id])
  
  @@unique([userId, lessonId])
}

model Execution {
  id        Int      @id @default(autoincrement())
  userId    Int
  code      String   @db.Text
  result    String   @db.Text
  success   Boolean
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```

### 5.3 サンドボックス仕様
- **実行時間制限**: 30秒
- **メモリ制限**: 128MB
- **ネットワーク**: Discord APIのみ許可
- **ファイルシステム**: 読み取り専用

### 5.4 セキュリティ
- コード実行は完全に隔離されたDocker内
- 危険なNode.jsモジュールはブロック
- 実行回数制限: 60回/時間/ユーザー

## 6. API エンドポイント

```typescript
// ユーザー作成
POST /api/users
{ name: string }

// レッスン一覧
GET /api/lessons

// コード実行
POST /api/execute
{ lessonId: number, code: string }

// 進捗取得
GET /api/progress

// 進捗更新
POST /api/progress
{ lessonId: number, completed: boolean }
```

## 7. 環境変数

```env
DATABASE_URL="mysql://user:password@localhost:3306/discord_learning"
DISCORD_TOKEN="shared_bot_token"
DISCORD_CHANNEL_ID="learning_channel_id"
DOCKER_HOST="unix:///var/run/docker.sock"
```

## 8. MVP機能

### Phase 1（初期リリース）
- 5つの基本レッスン
- コード実行機能
- シンプルな進捗管理
- 基本的なUI

### Phase 2（追加機能）
- レッスン追加
- 実行履歴
- より詳細なエラーメッセージ

## 9. ディレクトリ構成

```
discord-learning/
├── app/
│   ├── api/
│   │   ├── users/
│   │   ├── lessons/
│   │   ├── execute/
│   │   └── progress/
│   ├── lessons/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── CodeEditor.tsx
│   ├── ResultView.tsx
│   └── LessonList.tsx
├── lib/
│   ├── prisma.ts
│   └── sandbox.ts
├── prisma/
│   └── schema.prisma
├── sandbox/
│   ├── Dockerfile
│   └── runner.js
└── public/
```

## 10. 開発手順

1. Next.jsプロジェクトセットアップ
2. Prisma + MySQLセットアップ
3. 基本UIの実装
4. サンドボックス環境の構築
5. Discord Bot接続
6. レッスンコンテンツ作成
7. テスト・デプロイ

## 11. 実装時の進め方

### コミットルール
- 作業の区切りごとに必ずコミットを行う
- コミットメッセージは50文字以内の簡潔な日本語
- プレフィックスを使用: `add:` `fix:` `refactor:` `update:` `remove:` など

### コミットメッセージ例
```
add: Next.jsプロジェクトの初期セットアップ
add: Prismaスキーマ定義とDB接続設定
fix: コード実行時のエラーハンドリング改善
refactor: サンドボックス実行ロジックの整理
update: Monaco Editorの設定調整
remove: 不要なテストファイルを削除
```

### 推奨コミット単位
- 機能単位（例: ユーザー登録機能、コード実行機能）
- ファイル単位（例: スキーマ定義、コンポーネント作成）
- バグ修正単位（例: エラーハンドリング、型定義修正）