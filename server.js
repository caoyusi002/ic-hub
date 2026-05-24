const path = require('node:path');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), quiet: true });
dotenv.config({ quiet: true });

const app = express();
const port = Number(process.env.PORT) || 5177;
const hmrPort = Number(process.env.HMR_PORT) || 24678 + Math.max(0, port - 5177);
const hmrConfig = process.env.HMR_PORT
  ? {
      host: '127.0.0.1',
      port: hmrPort,
      clientPort: hmrPort,
    }
  : false;
const isProduction = process.env.NODE_ENV === 'production';

const systemPrompt = '你是 IC 产业问答助手，服务于集成电路产业库 demo。当前阶段只提供通用问答和页面导航建议，不声称已接入产业库数据库。回答使用中文，简洁、专业、适合产业研究和产品调研场景。';

app.use(express.json({ limit: '32kb' }));

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return [];

  return messages
    .filter((message) => ['user', 'assistant'].includes(message?.role) && typeof message?.content === 'string')
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, 800),
    }))
    .filter((message) => message.content.length > 0)
    .slice(-6);
}

app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.MODEL_API_KEY;
  const baseUrl = (process.env.MODEL_BASE_URL || '').replace(/\/+$/, '');
  const model = process.env.MODEL_NAME;
  const maxTokens = Number(process.env.MODEL_MAX_TOKENS) || 800;
  const temperature = Number(process.env.MODEL_TEMPERATURE) || 0.4;
  const messages = normalizeMessages(req.body?.messages);

  if (!apiKey || !baseUrl || !model) {
    return res.status(503).json({
      error: 'IC 产业问答助手暂未配置模型服务，请检查 MODEL_API_KEY、MODEL_BASE_URL 和 MODEL_NAME。',
    });
  }

  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    return res.status(400).json({ error: '请先输入一个有效问题。' });
  }

  try {
    const upstreamResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: maxTokens,
        temperature,
      }),
    });

    const payload = await upstreamResponse.json().catch(() => ({}));
    if (!upstreamResponse.ok) {
      return res.status(upstreamResponse.status).json({
        error: payload?.error?.message || '模型服务暂时无法响应。',
      });
    }

    const answer = payload?.choices?.[0]?.message?.content?.trim();
    return res.json({ answer: answer || '模型没有返回有效内容。' });
  } catch (error) {
    return res.status(502).json({
      error: '助手暂时无法连接模型服务，请稍后重试。',
    });
  }
});

async function start() {
  if (isProduction) {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.use((_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist/index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        host: '127.0.0.1',
        middlewareMode: true,
        hmr: hmrConfig,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '127.0.0.1', () => {
    console.log(`IC Hub server running at http://127.0.0.1:${port}/`);
    if (!isProduction && hmrConfig) {
      console.log(`Vite HMR WebSocket running on ws://127.0.0.1:${hmrPort}/`);
    }
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
