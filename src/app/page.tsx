import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Discord.js E-Learning
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discord Botの開発を楽しく学べるインタラクティブなプラットフォーム
          </p>
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              学習の流れ
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">レッスンを選択</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      基礎から応用まで段階的に学習
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">コードを書く</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Monaco Editorでコードを編集
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">実行・確認</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      サンドボックスで安全に実行
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Discord で動作確認</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      実際のDiscordチャンネルで結果を確認
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/lessons"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              学習を開始する
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
