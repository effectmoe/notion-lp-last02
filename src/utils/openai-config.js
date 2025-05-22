// src/utils/openai-config.js
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// APIキーの追加のバリデーション
if (!process.env.OPENAI_API_KEY) {
  console.error('OpenAI APIキーが設定されていません');
  process.exit(1);
}

module.exports = openai;