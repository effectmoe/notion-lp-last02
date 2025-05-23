// api/nlweb.js
export default async function handler(req, res) {
  // CORSヘッダーの設定（すべてのオリジンを許可）
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // OPTIONSリクエスト（プリフライト）の処理
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // ここに実際のAPIのURLを入力してください
    // 例: https://api.example.com/nlweb
    const API_URL = 'https://your-actual-api.com/nlweb';  // ← ここを変更！
    
    // 元のAPIにリクエストを転送
    const response = await fetch(API_URL, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    // レスポンスを取得
    const data = await response.json();
    
    // クライアントに返す
    res.status(response.status).json(data);
  } catch (error) {
    console.error('プロキシエラー:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'APIへの接続に失敗しました' 
    });
  }
}