import Link from "next/link";

const lessons = [
  {
    id: 1,
    title: "Hello Discord",
    description: "最初のメッセージ送信",
    level: "初級",
    order: 1,
  },
  {
    id: 2,
    title: "コマンドに反応",
    description: "メッセージに応答するBot",
    level: "初級",
    order: 2,
  },
  {
    id: 3,
    title: "絵文字リアクション",
    description: "リアクション機能",
    level: "初級",
    order: 3,
  },
  {
    id: 4,
    title: "埋め込みメッセージ",
    description: "Embedの作成",
    level: "初級",
    order: 4,
  },
  {
    id: 5,
    title: "ボタンを作る",
    description: "インタラクション基礎",
    level: "初級",
    order: 5,
  },
];

export default function LessonsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            レッスン一覧
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discord.js の基礎から応用まで段階的に学習できます
          </p>
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {lesson.level}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Lesson {lesson.order}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {lesson.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {lesson.description}
                    </p>
                  </div>
                  <div className="ml-6">
                    <Link
                      href={`/lessons/${lesson.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                    >
                      開始する
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              ← ホームに戻る
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}