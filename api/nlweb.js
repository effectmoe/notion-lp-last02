// api/nlweb.js
// NLWebデモ用のモックAPI
export default async function handler(req, res) {
  // CORSヘッダーの設定
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

  // GETリクエストでヘルスチェック
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'ok',
      message: 'NLWeb デモAPI is working!',
      timestamp: new Date().toISOString()
    });
  }

  try {
    // POSTリクエストの処理
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'クエリパラメータが必要です' 
      });
    }

    // デモ用の応答を生成
    let response = '';
    
    // よくある質問への応答
    if (query.includes('持ち主') || query.includes('誰') || query.includes('運営')) {
      response = 'このサイトはEFFECT Co. Ltd.が運営しています。NotionとLLMOを活用したDXシステム構築サービスを提供しています。';
    } else if (query.includes('NLWeb') || query.includes('何')) {
      response = 'NLWebは、Microsoftが開発した技術で、AIチャットボットをウェブページに直接組み込むことができるプロジェクトです。この技術により、ユーザーはウェブサイト上で自然な会話形式でインタラクションできます。';
    } else if (query.includes('Notion') || query.includes('サービス')) {
      response = 'NotionとLLMOを組み合わせることで、AIを活用した業務効率化とDXを実現します。タスク管理、顧客管理、議事録管理など、様々な業務をNotion上で一元化し、業務効率を大幅に向上させます。';
    } else if (query.includes('料金') || query.includes('価格')) {
      response = '料金プランについては、お客様の具体的なニーズに応じてカスタマイズいたします。無料相談を予約いただければ、詳しくご説明いたします。';
    } else if (query.includes('問い合わせ') || query.includes('連絡')) {
      response = 'お問い合わせは、ページ下部のフォームからお願いいたします。お名前、メールアドレス、お問い合わせ内容をご記入ください。';
    } else if (query.includes('天気')) {
      response = '申し訳ございません。天気情報の取得機能は現在デモ版では利用できません。NLWebの実際の実装では、外部APIと連携して天気情報などのリアルタイムデータを提供することが可能です。';
    } else {
      // デフォルトの応答
      response = `「${query}」についてのご質問ありがとうございます。このデモでは限られた応答しかできませんが、実際のNLWeb実装では、より高度なAIモデルと連携して、幅広い質問に対応できます。詳しくは無料相談でご説明いたします。`;
    }

    // 応答を返す
    res.status(200).json({ 
      response: response,
      timestamp: new Date().toISOString(),
      query: query
    });

  } catch (error) {
    console.error('エラー:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: '処理中にエラーが発生しました',
      details: error.message 
    });
  }
}