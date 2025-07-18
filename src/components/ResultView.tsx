'use client';

interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  timestamp: Date;
}

interface ResultViewProps {
  result?: ExecutionResult;
  isExecuting?: boolean;
}

export default function ResultView({ result, isExecuting }: ResultViewProps) {
  if (isExecuting) {
    return (
      <div className="h-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            コードを実行中...
          </span>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>実行結果がここに表示されます</p>
          <p className="text-sm mt-2">
            コードを書いて「実行」ボタンを押してください
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              result.success ? 'bg-green-500' : 'bg-red-500'
            }`}
          ></div>
          <span
            className={`text-sm font-medium ${
              result.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
            }`}
          >
            {result.success ? '実行成功' : '実行失敗'}
          </span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {result.timestamp.toLocaleTimeString()}
        </span>
      </div>

      <div className="space-y-4">
        {result.output && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              出力:
            </h4>
            <pre className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 text-sm overflow-x-auto">
              <code>{result.output}</code>
            </pre>
          </div>
        )}

        {result.error && (
          <div>
            <h4 className="text-sm font-medium text-red-700 dark:text-red-300 mb-2">
              エラー:
            </h4>
            <pre className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 text-sm text-red-700 dark:text-red-300 overflow-x-auto">
              <code>{result.error}</code>
            </pre>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          💡 <strong>ヒント:</strong> Discordチャンネルで実際の動作を確認してみましょう！
        </p>
      </div>
    </div>
  );
}