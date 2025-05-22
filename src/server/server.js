require('dotenv').config({ 
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local' 
});

const express = require('express');
const cors = require('cors');
const path = require('path');
const { OpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// デバッグ設定
const DEBUG = process.env.NODE_ENV !== 'production';

// CORS設定
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['https://notion.effect.moe', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // デバッグ出力
    if (DEBUG) {
      console.log('受信したオリジン:', origin);
      console.log('許可されたオリジン:', ALLOWED_ORIGINS);
    }

    // オリジンチェック
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORSポリシーにより許可されていないオリジン: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// リクエストロギングミドルウェア
app.use((req, res, next) => {
  if (DEBUG) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
      origin: req.get('origin'),
      referer: req.get('referer'),
      userAgent: req.get('user-agent'),
      ip: req.ip
    });
  }
  next();
});

// JSONパーサーミドルウェア
app.use(express.json());

// 静的ファイル提供
app.use(express.static(path.join(__dirname, '../..')));

// ルートパスハンドラー
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../index.html'));
});

// OpenAI初期化
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// チャットエンドポイント
app.post('/nlweb-chat', async (req, res) => {
  try {
    const { query } = req.body;
    
    // 入力バリデーション
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: '有効な質問を入力してください' });
    }

    // デバッグログ
    if (DEBUG) {
      console.log('受信したクエリ:', query);
    }

    // OpenAI APIコール
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system", 
          content: `あなたはEFFECT Co. Ltd.の公式AIアシスタントです。以下のガイドラインに従ってください：

1. 常に丁寧で専門的な言葉遣いを心がけてください
2. 会社のサービス（Notion関連）について、具体的かつ正確な情報を提供してください
3. 返答は簡潔明瞭に、最大200文字程度でお答えください
4. ユーザーの質問に対して、親切かつ有益な情報を提供してください
5. 不明な点がある場合は、お問い合わせフォームをご利用いただくようお勧めしてください

会社の主なサービス：
- オールインワン情報管理
- Notionシステム構築
- API連携と自動化
- 業務フロー自動化
- 多角的データ分析
- セキュアなアクセス管理

会社の特徴：
- カスタマイズされたアプリ開発
- 業務効率の向上
- デジタルトランスフォーメーション支援`
        },
        { 
          role: "user", 
          content: query 
        }
      ],
      max_tokens: 200,  // トークン数を制限
      temperature: 0.7  // クリエイティビティと一貫性のバランス
    });

    const response = completion.choices[0].message.content;

    // デバッグログ
    if (DEBUG) {
      console.log('AI応答:', response);
    }

    res.json({ response });

  } catch (error) {
    // エラーハンドリング
    console.error('チャットエラー:', error);
    
    if (error.response) {
      switch (error.response.status) {
        case 429:
          res.status(429).json({ 
            error: 'リクエスト制限に達しました。後でお試しください。',
            details: 'Rate limit exceeded'
          });
          break;
        case 401:
          res.status(401).json({ 
            error: '認証エラーが発生しました。APIキーを確認してください。',
            details: 'Authentication error'
          });
          break;
        case 500:
          res.status(500).json({ 
            error: 'サーバー側で問題が発生しました。',
            details: 'Internal server error'
          });
          break;
        default:
          res.status(500).json({ 
            error: '予期せぬエラーが発生しました。',
            details: error.message
          });
      }
    } else {
      res.status(500).json({ 
        error: 'サービスに接続できません。',
        details: error.message
      });
    }
  }
});

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  // エラーの詳細なログ出力
  console.error('サーバーエラー:', {
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    origin: req.get('origin'),
    timestamp: new Date().toISOString()
  });

  // クライアントへの応答
  res.status(err.status || 500).json({
    error: 'サーバー側で問題が発生しました',
    message: process.env.NODE_ENV === 'production' 
      ? 'エラーが発生しました' 
      : err.message
  });
});

// サーバー起動
const server = app.listen(PORT, () => {
  console.log(`NLWebサーバーが${PORT}ポートで起動しました`);
  
  // デバッグ情報
  if (DEBUG) {
    console.log('デバッグモード: 有効');
    console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
    console.log('許可されたオリジン:', ALLOWED_ORIGINS);
    console.log('環境:', process.env.NODE_ENV);
  }
});

// グレースフルシャットダウン
process.on('SIGTERM', () => {
  console.log('SIGTERMシグナル受信。サーバーをシャットダウンします。');
  server.close(() => {
    console.log('HTTPサーバーが正常にシャットダウンされました。');
    process.exit(0);
  });
});

// 未処理の例外をキャッチ
process.on('uncaughtException', (error) => {
  console.error('未処理の例外:', error);
  process.exit(1);
});