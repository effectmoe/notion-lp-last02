document.addEventListener('DOMContentLoaded', () => {
  // チャットボタンの作成
  const chatButton = document.createElement('button');
  chatButton.id = 'nlweb-chat-toggle';
  chatButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  `;
  chatButton.classList.add('nlweb-chat-button');

  // チャットコンテナの作成
  const chatContainer = document.createElement('div');
  chatContainer.id = 'nlweb-chat-container';
  chatContainer.innerHTML = `
    <div class="nlweb-chat-header">
      <h3>NLWeb チャット</h3>
      <button id="nlweb-chat-close">×</button>
    </div>
    <div class="nlweb-chat-content">
      <div id="nlweb-output"></div>
      <div class="nlweb-input-area">
        <input type="text" id="nlweb-input" placeholder="メッセージを入力">
        <button id="nlweb-submit">送信</button>
      </div>
    </div>
  `;

  // スタイルの追加
  const style = document.createElement('style');
  style.textContent = `
    .nlweb-chat-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 1000;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .nlweb-chat-button:hover {
      background-color: #0056b3;
    }

    #nlweb-chat-container {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 350px;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      display: none;
      flex-direction: column;
      z-index: 1000;
      border: 1px solid #e0e0e0;
    }

    .nlweb-chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #f1f1f1;
      padding: 10px;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }

    .nlweb-chat-content {
      padding: 15px;
      max-height: 400px;
      display: flex;
      flex-direction: column;
    }

    #nlweb-output {
      flex-grow: 1;
      overflow-y: auto;
      margin-bottom: 10px;
      max-height: 300px;
      padding: 10px;
      background-color: #f9f9f9;
      border-radius: 5px;
    }

    .nlweb-input-area {
      display: flex;
    }

    #nlweb-input {
      flex-grow: 1;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-right: 10px;
    }

    #nlweb-submit {
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 10px 15px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    #nlweb-submit:hover {
      background-color: #0056b3;
    }
  `;

  // DOMに追加
  document.body.appendChild(chatButton);
  document.body.appendChild(chatContainer);
  document.head.appendChild(style);

  // イベントリスナー
  chatButton.addEventListener('click', () => {
    chatContainer.style.display =
      chatContainer.style.display === 'flex' ? 'none' : 'flex';
  });

  document.getElementById('nlweb-chat-close').addEventListener('click', () => {
    chatContainer.style.display = 'none';
  });

  // チャット機能
  const chatInput = document.getElementById('nlweb-input');
  const chatSubmit = document.getElementById('nlweb-submit');
  const chatOutput = document.getElementById('nlweb-output');

  chatSubmit.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  function sendMessage() {
    const query = chatInput.value.trim();
    if (!query) return;

    // デプロイメント環境に応じたエンドポイント判定
    const determineApiEndpoint = () => {
      const hostMap = {
        'localhost': 'http://localhost:3000/api/nlweb',
        'notion.effect.moe': '/api/nlweb',
        // Vercelのプレビューデプロイメント用
        'vercel.app': '/api/nlweb'
      };

      // 現在のホスト名を取得
      const hostname = window.location.hostname;

      // デバッグ情報
      console.group('NLWeb Chat Deployment');
      console.log('現在のホスト:', hostname);
      console.log('プロトコル:', window.location.protocol);
      console.log('完全URL:', window.location.href);

      // エンドポイントの決定
      // Vercelのプレビューデプロイメント(.vercel.app)の場合も対応
      let endpoint = hostMap[hostname];
      
      // Vercelのプレビューデプロイメントの場合
      if (!endpoint && hostname.includes('.vercel.app')) {
        endpoint = '/api/nlweb';
      }
      
      // デフォルトは相対パス（Vercel用）
      if (!endpoint) {
        endpoint = '/api/nlweb';
      }

      console.log('選択されたエンドポイント:', endpoint);
      console.groupEnd();

      return endpoint;
    };

    const apiEndpoint = determineApiEndpoint();

    // UIの更新
    chatInput.disabled = true;
    chatSubmit.disabled = true;

    // ユーザーメッセージの表示
    const userMessageElement = document.createElement('p');
    userMessageElement.classList.add('nlweb-message-user');
    userMessageElement.textContent = query;
    chatOutput.appendChild(userMessageElement);
    chatOutput.scrollTop = chatOutput.scrollHeight;

    // フェッチオプション
    const fetchOptions = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query })
    };

    // メッセージ送信
    fetch(apiEndpoint, fetchOptions)
      .then(response => {
        console.log('レスポンスステータス:', response.status);

        if (!response.ok) {
          // 詳細なエラー情報の取得
          return response.text().then(errorText => {
            throw new Error(`通信エラー: ${response.status} - ${errorText}`);
          });
        }
        return response.json();
      })
      .then(data => {
        // AIメッセージの表示
        const aiMessageElement = document.createElement('p');
        aiMessageElement.classList.add('nlweb-message-ai');
        aiMessageElement.textContent = data.response;
        chatOutput.appendChild(aiMessageElement);
        chatOutput.scrollTop = chatOutput.scrollHeight;
      })
      .catch(error => {
        console.error('チャットエラー詳細:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });

        // エラーメッセージの表示
        const errorMessageElement = document.createElement('p');
        errorMessageElement.classList.add('nlweb-message-ai');
        errorMessageElement.textContent = `接続エラー: ${error.message}`;
        chatOutput.appendChild(errorMessageElement);
      })
      .finally(() => {
        // UI状態の復元
        chatInput.disabled = false;
        chatSubmit.disabled = false;
        chatInput.value = '';
        chatInput.focus();
      });
  }

  // 既存のイベントリスナー部分はそのまま維持
  chatSubmit.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

});