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

    // デバッグ情報の追加
    console.log('デバッグ情報:', {
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      apiEndpoint: window.location.hostname === 'localhost'
        ? 'http://localhost:3000/nlweb-chat'
        : 'https://nlweb.effect.moe/nlweb-chat'
    });

    const apiEndpoint = window.location.hostname === 'localhost'
      ? 'http://localhost:3000/nlweb-chat'
      : 'https://nlweb.effect.moe/nlweb-chat';

    chatInput.disabled = true;
    chatSubmit.disabled = true;
    chatOutput.innerHTML += `<p><strong>あなた:</strong> ${query}</p>`;

    // 詳細なフェッチオプション
    const fetchOptions = {
      method: 'POST',
      mode: 'cors', // CORSモードを明示的に設定
      cache: 'no-cache',
      credentials: 'same-origin', // クレデンシャルポリシー
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query })
    };

    // 詳細なエラーロギング
    fetch(apiEndpoint, fetchOptions)
      .then(response => {
        console.log('レスポンスステータス:', response.status);
        console.log('レスポンスヘッダー:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          // より詳細なエラー情報の取得
          return response.text().then(errorText => {
            throw new Error(`HTTPエラー! ステータス: ${response.status}, メッセージ: ${errorText}`);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('受信データ:', data);
        chatOutput.innerHTML += `<p><strong>AI:</strong> ${data.response}</p>`;
        chatOutput.scrollTop = chatOutput.scrollHeight;
      })
      .catch(error => {
        console.error('詳細なチャットエラー:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });

        // より詳細なエラーメッセージ
        chatOutput.innerHTML += `
          <p><strong>エラー:</strong> 
          サービスに接続できません。
          詳細: ${error.message}
          </p>
        `;
      })
      .finally(() => {
        chatInput.disabled = false;
        chatSubmit.disabled = false;
        chatInput.value = '';
        chatInput.focus();
      });
  }
});