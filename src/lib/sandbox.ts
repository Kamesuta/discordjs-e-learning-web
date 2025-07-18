import { spawn } from 'child_process';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

export interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
}

export async function executeCode(code: string, lessonId: number): Promise<ExecutionResult> {
  const executionId = randomUUID();
  const tempDir = '/tmp';
  const scriptPath = join(tempDir, `script_${executionId}.js`);

  try {
    const sanitizedCode = sanitizeCode(code);
    const wrappedCode = wrapCodeForSandbox(sanitizedCode);

    await writeFile(scriptPath, wrappedCode);

    const result = await runInSandbox(scriptPath);

    await unlink(scriptPath);

    return result;
  } catch (error) {
    try {
      await unlink(scriptPath);
    } catch (unlinkError) {
      console.error('Failed to clean up temp file:', unlinkError);
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

function sanitizeCode(code: string): string {
  const dangerousPatterns = [
    /require\s*\(\s*['"]fs['"].*?\)/g,
    /require\s*\(\s*['"]child_process['"].*?\)/g,
    /require\s*\(\s*['"]os['"].*?\)/g,
    /require\s*\(\s*['"]net['"].*?\)/g,
    /require\s*\(\s*['"]http['"].*?\)/g,
    /require\s*\(\s*['"]https['"].*?\)/g,
    /process\.exit/g,
    /process\.kill/g,
    /eval\s*\(/g,
    /Function\s*\(/g,
  ];

  let sanitized = code;
  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '// BLOCKED: Dangerous operation');
  });

  return sanitized;
}

function wrapCodeForSandbox(code: string): string {
  return `
// Mock Discord.js environment
const mockChannel = {
  send: (message) => {
    console.log('📤 Discord message sent:', message);
    return Promise.resolve({ id: 'mock-message-id' });
  }
};

const mockClient = {
  channels: {
    cache: {
      get: (id) => mockChannel
    }
  },
  once: (event, callback) => {
    if (event === 'ready') {
      setTimeout(() => {
        console.log('🤖 Mock Discord client ready');
        callback();
      }, 100);
    }
  },
  on: (event, callback) => {
    console.log(\`👂 Listening for event: \${event}\`);
    // Mock event handling
    if (event === 'messageCreate') {
      setTimeout(() => {
        const mockMessage = {
          author: { bot: false },
          content: 'こんにちは',
          reply: (msg) => {
            console.log('💬 Bot replied:', msg);
            return Promise.resolve();
          },
          react: (emoji) => {
            console.log('😀 Bot reacted with:', emoji);
            return Promise.resolve();
          }
        };
        callback(mockMessage);
      }, 200);
    }
    
    if (event === 'interactionCreate') {
      setTimeout(() => {
        const mockInteraction = {
          isButton: () => true,
          customId: 'hello_button',
          reply: (msg) => {
            console.log('🔘 Button interaction reply:', msg);
            return Promise.resolve();
          }
        };
        callback(mockInteraction);
      }, 300);
    }
  },
  login: (token) => {
    console.log('🔑 Mock login successful');
    return Promise.resolve();
  }
};

// Mock Discord.js modules
const mockDiscordJS = {
  Client: function() { return mockClient; },
  GatewayIntentBits: {
    Guilds: 1,
    GuildMessages: 2,
    MessageContent: 4
  },
  EmbedBuilder: function() {
    return {
      setTitle: function(title) { this.title = title; return this; },
      setDescription: function(desc) { this.description = desc; return this; },
      setColor: function(color) { this.color = color; return this; },
      addFields: function(...fields) { this.fields = fields; return this; },
      setTimestamp: function() { this.timestamp = new Date(); return this; }
    };
  },
  ActionRowBuilder: function() {
    return {
      addComponents: function(...components) { 
        console.log('🎛️ ActionRow components added:', components.length);
        return this; 
      }
    };
  },
  ButtonBuilder: function() {
    return {
      setCustomId: function(id) { this.customId = id; return this; },
      setLabel: function(label) { this.label = label; return this; },
      setStyle: function(style) { this.style = style; return this; }
    };
  },
  ButtonStyle: {
    Primary: 1,
    Secondary: 2,
    Success: 3,
    Danger: 4,
    Link: 5
  }
};

// Override require for discord.js
const originalRequire = require;
require = function(module) {
  if (module === 'discord.js') {
    return mockDiscordJS;
  }
  return originalRequire(module);
};

// Set timeout for execution
const executionTimeout = setTimeout(() => {
  console.log('⏰ Execution timeout (30 seconds)');
  process.exit(1);
}, 30000);

try {
  console.log('🚀 Starting code execution...');
  ${code}
  
  // Wait for async operations
  setTimeout(() => {
    console.log('✅ Code execution completed');
    clearTimeout(executionTimeout);
    process.exit(0);
  }, 2000);
} catch (error) {
  console.error('❌ Runtime error:', error.message);
  clearTimeout(executionTimeout);
  process.exit(1);
}
`;
}

function runInSandbox(scriptPath: string): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    const child = spawn('node', [scriptPath], {
      stdio: 'pipe',
      timeout: 30000
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({
          success: true,
          output: stdout.trim()
        });
      } else {
        resolve({
          success: false,
          error: stderr.trim() || 'Process exited with non-zero code'
        });
      }
    });

    child.on('error', (error) => {
      resolve({
        success: false,
        error: error.message
      });
    });
  });
}