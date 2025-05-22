const { OpenAI } = require('openai');
require('dotenv').config({ path: '.env.local' });

async function testOpenAIKey() {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    console.log('APIキーの基本検証:');
    console.log('APIキーが設定されています:', !!process.env.OPENAI_API_KEY);

    // モデルリストの取得でAPIキーを検証
    const models = await openai.models.list();
    console.log('利用可能なモデル数:', models.data.length);
    
    console.log('OpenAI API接続: 成功 ✅');
  } catch (error) {
    console.error('OpenAI API接続エラー: ❌');
    console.error('エラー詳細:', error.message);
    
    if (error.response) {
      console.error('ステータスコード:', error.response.status);
      console.error('エラーデータ:', error.response.data);
    }
  }
}

testOpenAIKey();