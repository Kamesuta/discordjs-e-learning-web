'use client';

import { Editor } from '@monaco-editor/react';
import { useState } from 'react';

interface CodeEditorProps {
  initialCode?: string;
  onCodeChange?: (code: string) => void;
  onExecute?: (code: string) => void;
  isExecuting?: boolean;
}

export default function CodeEditor({ 
  initialCode = '', 
  onCodeChange, 
  onExecute,
  isExecuting = false 
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  const handleExecute = () => {
    onExecute?.(code);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            renderWhitespace: 'selection',
            tabSize: 2,
          }}
        />
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          JavaScript (Discord.js v14)
        </div>
        <button
          onClick={handleExecute}
          disabled={isExecuting}
          className={`px-6 py-2 rounded-md font-medium text-white transition-colors duration-200 ${
            isExecuting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isExecuting ? '実行中...' : 'コードを実行'}
        </button>
      </div>
    </div>
  );
}