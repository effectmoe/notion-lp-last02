document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded イベント発火 (script.js)');
    
    function setupHamburgerMenu() {
        // ハンバーガーメニュー機能
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (hamburgerBtn && mobileMenu) {
            console.log('ハンバーガーメニューを初期化');
            
            // 既存のイベントリスナーをクリアして重複を防止
            const newBtn = hamburgerBtn.cloneNode(true);
            hamburgerBtn.parentNode.replaceChild(newBtn, hamburgerBtn);
            
            // 新しいイベントリスナーを追加
            newBtn.addEventListener('click', function() {
                const isActive = mobileMenu.classList.contains('active');
                console.log('ハンバーガーメニュークリック:', isActive ? '閉じる' : '開く');
                
                mobileMenu.classList.toggle('active');
                newBtn.setAttribute('aria-expanded', !isActive);
                mobileMenu.setAttribute('aria-hidden', isActive);
                
                // ESCキーでモバイルメニューを閉じる機能
                const onKeyDown = (e) => {
                    if (e.key === 'Escape') {
                        mobileMenu.classList.remove('active');
                        newBtn.setAttribute('aria-expanded', 'false');
                        mobileMenu.setAttribute('aria-hidden', 'true');
                        document.removeEventListener('keydown', onKeyDown);
                    }
                };
                
                if (!isActive) {
                    document.addEventListener('keydown', onKeyDown);
                    
                    // モバイルメニュー内の最初のリンクにフォーカスを移動
                    const firstLink = mobileMenu.querySelector('a');
                    if (firstLink) {
                        setTimeout(() => firstLink.focus(), 100);
                    }
                }
            });
        }
    }
    
    // ハンバーガーメニュー設定を実行
    setupHamburgerMenu();
    
    // ヒーローセクションのフェードイン効果
    const heroText = document.querySelector('.hero-text');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroText) {
        setTimeout(() => {
            heroText.style.opacity = '1';
        }, 300);
    }
    
    if (heroImage) {
        setTimeout(() => {
            heroImage.style.opacity = '1';
        }, 600);
    }
    
    // スムーススクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // モバイルメニューが開いていれば閉じる
                if (mobileMenu && mobileMenu.classList.contains('active') && hamburgerBtn) {
                    mobileMenu.classList.remove('active');
                    hamburgerBtn.setAttribute('aria-expanded', 'false');
                    mobileMenu.setAttribute('aria-hidden', 'true');
                }
            }
        });
    });
    
    // フォーム送信処理
    const contactForm = document.getElementById('inquiry-form');
    if (contactForm) {
        console.log('フォームを初期化しています:', window.location.pathname);
        
        // バリデーション関数
        const validateField = (field) => {
            let isValid = true;
            let errorMessage = '';
            
            // 空白チェック
            if (!field.value.trim()) {
                isValid = false;
                errorMessage = '必須項目です';
            } 
            // メッセージフィールドの場合は追加チェック
            else if (field.id === 'message') {
                if (field.value.trim().length < 10) {
                    isValid = false;
                    errorMessage = '10文字以上入力してください';
                }
            }
            
            // エラー表示の更新
            const errorElement = document.getElementById(`${field.id}-error`);
            if (errorElement) {
                errorElement.textContent = errorMessage;
                errorElement.style.display = errorMessage ? 'block' : 'none';
            }
            
            // 入力フィールドのスタイル更新
            if (!isValid) {
                field.classList.add('error');
                field.setAttribute('aria-invalid', 'true');
            } else {
                field.classList.remove('error');
                field.setAttribute('aria-invalid', 'false');
            }
            
            return isValid;
        };
        
        // リアルタイムバリデーション設定
        const requiredFields = contactForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => {
                validateField(field);
            });
        });
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('フォーム送信をインターセプトしました');
            
            // 必須項目の検証
            const requiredFields = contactForm.querySelectorAll('[required]');
            console.log('必須フィールド数:', requiredFields.length);
            let isValid = true;
            
            requiredFields.forEach(field => {
                // フィールドごとのバリデーション実行
                const fieldValid = validateField(field);
                isValid = isValid && fieldValid;
            });
            
            if (isValid) {
                // フォームデータの取得
                const formData = new FormData(contactForm);
                const formValues = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    company: formData.get('company') || '',
                    phone: formData.get('phone') || '',
                    message: formData.get('message')
                };
                
                // 送信ボタンの状態変更
                const submitBtn = contactForm.querySelector('.submit-btn');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = '送信中...';
                submitBtn.disabled = true;
                
                // API送信
                fetch('/api/submit-to-notion', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ data: formValues })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`サーバーエラー: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('レスポンスデータ:', data);
                    // 成功判定：data.successがtrueまたはdata.status === 'success'
                    if (data.success || data.status === 'success') {
                        // 成功メッセージ表示
                        const successElement = document.getElementById('form-success');
                        if (successElement) {
                            successElement.style.display = 'block';
                        }
                        const errorElement = document.getElementById('form-error');
                        if (errorElement) {
                            errorElement.style.display = 'none';
                        }
                        contactForm.reset();
                    } else {
                        throw new Error(data.message || 'フォーム送信に失敗しました');
                    }
                })
                .catch(error => {
                    console.error('送信エラー:', error);
                    const errorElement = document.getElementById('form-error');
                    if (errorElement) {
                        errorElement.textContent = error.message || '送信中にエラーが発生しました。しばらく経ってから再度お試しください。';
                        errorElement.style.display = 'block';
                    }
                    const successElement = document.getElementById('form-success');
                    if (successElement) {
                        successElement.style.display = 'none';
                    }
                })
                .finally(() => {
                    // ボタンを元に戻す
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    
                    // 5秒後にメッセージを非表示
                    setTimeout(() => {
                        const successElement = document.getElementById('form-success');
                        const errorElement = document.getElementById('form-error');
                        if (successElement) successElement.style.display = 'none';
                        if (errorElement) errorElement.style.display = 'none';
                    }, 5000);
                });
            }
        });
    }
    
    // アニメーション効果
    const revealElements = document.querySelectorAll('.feature-card, .why-card, .testimonial-card');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        revealElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
        
        // リビールアニメーションのスタイル追加
        const style = document.createElement('style');
        style.textContent = `
            .revealed {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
});