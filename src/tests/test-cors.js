const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

async function testCORS() {
  const testOrigins = [
    'https://notion.effect.moe',
    'http://localhost:3000',
    'https://localhost:3000',
    'https://example.com'  // テスト用の許可されていないオリジン
  ];

  console.log('CORS検証テスト:');

  for (const origin of testOrigins) {
    try {
      const response = await axios.post(
        'http://localhost:3000/cors-test', 
        { query: 'CORSテスト' },
        {
          headers: {
            'Origin': origin,
            'Content-Type': 'application/json'
          },
          validateStatus: function (status) {
            // 全てのステータスコードを許可
            return true;
          }
        }
      );

      console.log(`テストオリジン: ${origin}`);
      console.log('ステータスコード:', response.status);
      console.log('レスポンスヘッダー:', response.headers);
      
      if (response.status === 200) {
        console.log(`${origin}: CORS許可 ✅`);
      } else {
        console.log(`${origin}: CORS制限 ❌`);
        console.log('レスポンスデータ:', response.data);
      }
    } catch (error) {
      console.error(`${origin}: CORS接続エラー ❌`);
      console.error('エラー詳細:', error.message);
      
      if (error.response) {
        console.error('エラーレスポンス:', error.response.data);
        console.error('ステータスコード:', error.response.status);
        console.error('ヘッダー:', error.response.headers);
      }
    }
  }
}

testCORS();