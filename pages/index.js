import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({ show: false, type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 入力データの変更を処理
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // フォーム送信処理
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 必須項目の検証
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        show: true,
        type: 'error',
        message: '必須項目を入力してください'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submit-to-notion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          databaseId: '1b7b802cb0c6801f8ba3de20a22e93b1',
          ...formData
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus({
          show: true,
          type: 'success',
          message: 'お問い合わせありがとうございます。近日中にご連絡いたします。'
        });
        setFormData({ name: '', email: '', company: '', phone: '', message: '' });
      } else {
        throw new Error(data.message || '送信中にエラーが発生しました。');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus({
        show: true,
        type: 'error',
        message: 'エラーが発生しました: ' + error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // クライアントサイドでのみ実行するコード
    if (typeof window === 'undefined') return;
    
    // フェードインアニメーション効果
    const heroText = document.querySelector('.hero-text');
    const heroImage = document.querySelector('.hero-image');

    if (heroText) setTimeout(() => { heroText.style.opacity = '1'; }, 300);
    if (heroImage) setTimeout(() => { heroImage.style.opacity = '1'; }, 600);

    // スムーススクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });

    // インタセクションオブザーバー
    if ('IntersectionObserver' in window) {
      const revealElements = document.querySelectorAll('.feature-card, .why-card, .testimonial-card');

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Notion プラスアルファ - EFFECT Co. Ltd.</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Notionを活用したシステム構築で業務プロセスを改革。低コスト・短期間で導入可能な次世代の業務システム" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <style jsx global>{`
      /* Features Section */
.features {
  padding: 80px 0;
  background-color: #fff;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 16px;
}

.section-desc {
  font-size: 18px;
  color: var(--text-light);
  text-align: center;
  max-width: 700px;
  margin: 0 auto 50px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

.feature-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  background-color: rgba(157, 122, 179, 0.1);
  color: #9D7AB3;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 24px;
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 15px;
}

.feature-card p {
  color: var(--text-light);
}

/* Integrations Section */
.integrations {
  padding: 80px 0;
  background-color: var(--bg-light);
}

.integration-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 30px;
  margin-top: 50px;
}

.integration-item {
  text-align: center;
}

.integration-icon {
  font-size: 36px;
  color: #4a4a4a;
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  transition: transform 0.3s ease;
}

.integration-icon i {
  font-size: 36px;
}

/* ここに色指定を追加（.integration-iconの閉じ括弧の外に） */
.integration-icon.slack i { color: #4A154B; }
.integration-icon.google-drive i { color: #0F9D58; }
.integration-icon.figma i { color: #F24E1E; }
.integration-icon.github i { color: #24292e; }
.integration-icon.asana i { color: #FC636B; }
.integration-icon.trello i { color: #0079BF; }
.integration-icon.jira i { color: #0052CC; }
.integration-icon.zoom i { color: #2D8CFF; }
.integration-icon.dropbox i { color: #0061FF; }

.integration-icon:hover {
  transform: scale(1.1);
}

.integration-icon i {
  font-size: 36px;
}

.more-integrations {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  font-size: 18px;
  color: var(--text-light);
  font-style: italic;
}

/* System Design Section */
.system-design {
  padding: 80px 0;
  background-color: #fff;
}

.design-content {
  display: flex;
  align-items: center;
  gap: 50px;
}

.design-text {
  flex: 1;
}

.design-text p {
  margin-bottom: 30px;
  color: var(--text-light);
}

.design-features {
  list-style: none;
  margin-top: 30px;
}

.design-features li {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.design-features i {
  color: #4db6ac;
  margin-right: 10px;
}

.design-image {
  flex: 1;
  display: flex;
  justify-content: center;
  color: #9D7AB3;
}

/* Why Notion Section */
.why-notion {
  padding: 80px 0;
  background-color: var(--bg-light);
}

.why-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
}

.why-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.why-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.why-icon {
  background-color: rgba(240, 178, 89, 0.1);
  color: #F0B259;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 24px;
}

.why-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 15px;
}

.why-card p {
  color: var(--text-light);
}

/* Testimonials Section */
.testimonials {
  padding: 80px 0;
  background-color: #fff;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.testimonial-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.rating {
  color: #F0B259;
  font-size: 24px;
  margin-bottom: 20px;
}

.quote {
  font-style: italic;
  color: var(--text-color);
  margin-bottom: 20px;
  position: relative;
}

.quote::before {
  content: '"';
  font-size: 50px;
  color: rgba(0, 0, 0, 0.1);
  position: absolute;
  top: -20px;
  left: -15px;
}

.author {
  border-top: 1px solid var(--border-color);
  padding-top: 20px;
}

.name {
  font-weight: 600;
  margin-bottom: 5px;
}

.position {
  font-size: 14px;
  color: var(--text-light);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .design-content {
    flex-direction: column;
  }
  
  .design-text, .design-image {
    flex: none;
    width: 100%;
  }
  
  .design-image {
    margin-top: 40px;
  }
  
  .integration-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .integration-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --primary-color: #37352f;
          --secondary-color: #e16259;
          --accent-color: #2eaadc;
          --bg-light: #f7f7f7;
          --text-color: #37352f;
          --text-light: #6b7280;
          --border-color: #e5e7eb;
          --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          --container-width: 1200px;
        }

        body {
          font-family: 'Noto Sans JP', 'Inter', sans-serif;
          line-height: 1.6;
          color: var(--text-color);
          background-color: #fff;
        }

        .container {
          max-width: var(--container-width);
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Header Styles */
        header {
          background-color: #37352f;
          padding: 15px 0;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: var(--container-width);
          margin: 0 auto;
          padding: 0 20px;
        }

        .logo {
          font-weight: 700;
          font-size: 18px;
          color: #ffffff;
        }

        .main-nav ul {
          display: flex;
          list-style: none;
          gap: 30px;
        }

        .main-nav a {
          text-decoration: none;
          color: #ffffff;
          font-weight: 500;
          transition: color 0.3s;
        }

        .main-nav a:hover {
          color: #F0B259;
        }

        .contact-btn {
          background-color: #9D7AB3;
          padding: 8px 16px;
          border-radius: 4px;
          color: #ffffff;
        }

        .contact-btn:hover {
          background-color: #9d7ab3a8;
        }

        .mobile-menu-btn {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
        }

        .mobile-menu-btn span {
          display: block;
          width: 25px;
          height: 3px;
          background-color: #ffffff;
          border-radius: 3px;
        }

        /* Hero Section */
        .hero {
          padding: 80px 0;
          background-color: var(--bg-light);
          overflow: hidden;
        }

        .hero-content {
          display: flex;
          gap: 50px;
          align-items: center;
          position: relative;
        }

        .hero-text {
          flex: 1;
          opacity: 0;
          transition: opacity 0.8s ease;
        }

        .notion-logo {
          margin-bottom: 30px;
        }

        .logo-container {
          display: flex;
          align-items: center;
        }

        .notion-img {
          width: 140px;
          height: auto;
        }

        .plus {
          font-size: 24px;
          margin: 0 10px;
          font-weight: bold;
        }

        .hero-text h1 {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 20px;
          line-height: 1.3;
          width: 280px;
        }

        .hero-text p {
          font-size: 16px;
          margin-bottom: 40px;
          color: var(--text-light);
        }

        .hero-image {
          flex: 1;
          position: relative;
          display: flex;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.8s ease;
        }

        .hero-image img {
          max-width: 100%;
          height: auto;
        }

        .cta-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .btn {
          padding: 10px 20px;
          border-radius: 4px;
          font-weight: 500;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s ease;
          font-size: 14px;
          text-align: center;
        }

        .primary-btn {
          background-color: #9D7AB3;
          color: #fff;
        }

        .primary-btn:hover {
          background-color: #9d7ab3a8;
        }

        .secondary-btn {
          background-color: #4db6ac;
          color: #fff;
        }

        .secondary-btn:hover {
          background-color: #4DB6AC;
        }

        .orange-btn {
          background-color: #F0B259;
          color: #fff;
        }

        .orange-btn:hover {
          background-color: #d15249;
        }

        /* Vertical Text Container */
        .vertical-container {
          position: absolute;
          top: -40px;
          right: 280px;
          display: flex;
          flex-direction: column;
        }
        
        .vertical-text-char {
          writing-mode: vertical-rl;
          text-orientation: upright;
          margin: 0;
          font-weight: 500;
          font-size: 16px;
          color: #333;
          animation: fadeIn 0.15s forwards;
          opacity: 0;
          line-height: 1;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        /* 各文字に対して遅延設定 */
        .char-1 { animation-delay: 0.1s; }
        .char-2 { animation-delay: 0.25s; }
        .char-3 { animation-delay: 0.4s; }
        .char-4 { animation-delay: 0.55s; }
        .char-5 { animation-delay: 0.7s; }
        .char-6 { animation-delay: 0.85s; }
        .char-7 { animation-delay: 1s; }
        .char-8 { animation-delay: 1.15s; }
        .char-9 { animation-delay: 1.3s; }
        .char-10 { animation-delay: 1.45s; }
        .char-11 { animation-delay: 1.6s; }
        .char-12 { animation-delay: 1.75s; }
        .char-13 { animation-delay: 1.9s; }
        .char-14 { animation-delay: 2.05s; }
        .char-15 { animation-delay: 2.2s; }

        /* Contact Form */
        .contact {
          padding: 80px 0;
        }

        .contact-content {
          display: flex;
          gap: 40px;
          margin-top: 40px;
        }

        .company-info {
          flex: 1;
        }

        .company-logo {
          font-weight: 700;
          font-size: 24px;
          margin-bottom: 20px;
        }

        .company-details p {
          margin-bottom: 15px;
          color: var(--text-light);
        }

        .company-links {
          list-style: none;
          margin-top: 30px;
        }

        .company-links li {
          margin-bottom: 8px;
        }

        .company-links a {
          color: var(--accent-color);
          text-decoration: none;
        }

        .company-links a:hover {
          text-decoration: underline;
        }

        .contact-form {
          flex: 1;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-family: inherit;
        }

        .required {
          color: #e16259;
        }

        .submit-btn {
          background-color: #8b5cf6;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          width: 100%;
          transition: background-color 0.3s;
        }

        .submit-btn:hover {
          background-color: #7c4fec;
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .form-status {
          margin-top: 15px;
          padding: 10px;
          border-radius: 4px;
        }
        
        .form-status.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        
        .form-status.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        /* Footer */
        footer {
          background-color: #37352f;
          color: white;
          padding: 60px 0 30px;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
        }

        .footer-logo {
          font-weight: 700;
          font-size: 20px;
        }

        .footer-links ul {
          list-style: none;
          display: flex;
          gap: 20px;
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: color 0.3s;
        }

        .footer-links a:hover {
          color: white;
        }

        .footer-social {
          display: flex;
          gap: 15px;
        }

        .footer-social a {
          color: rgba(255, 255, 255, 0.7);
          font-size: 20px;
          transition: color 0.3s;
        }

        .footer-social a:hover {
          color: white;
        }

        .copyright {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 20px;
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .main-nav {
            display: none;
          }
          
          .mobile-menu-btn {
            display: flex;
          }
          
          .hero-content {
            flex-direction: column;
          }
          
          .hero-text, .hero-image {
            flex: none;
            width: 100%;
          }
          
          .vertical-container {
            position: static;
            margin-top: 20px;
            flex-direction: row;
            justify-content: center;
          }
          
          .vertical-text-char {
            writing-mode: horizontal-tb;
          }
          
          .contact-content {
            flex-direction: column;
          }
          
          .footer-content {
            flex-direction: column;
            gap: 20px;
            align-items: center;
          }
          
          .footer-links ul {
            flex-wrap: wrap;
            justify-content: center;
          }
        }

        .revealed {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>

      <header>
        <div className="header-content">
          <div className="logo">EFFECT Co. Ltd.</div>
          <nav className="main-nav">
            <ul>
              <li><a href="#">ホーム</a></li>
              <li><a href="#">サービス</a></li>
              <li><a href="#">料金</a></li>
              <li><a href="#contact" className="contact-btn">お問い合わせはこちら</a></li>
            </ul>
          </nav>
          <div className="mobile-menu-btn">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <div className="hero-text">
                <div className="notion-logo">
                  <div className="logo-container">
                    <img src="/Notion-logo-s.svg.png" alt="Notion Logo" className="notion-img" />
                    <span className="plus">+</span>
                  </div>
                </div>
                <h1>Notionプラスア<br />ルファで作る<br />スマホ世代の簡単シス<br />テム</h1>
                <p>Notionを活用したシステム構築で業務プロセスを改革。<br />低コスト・短期間で導入可能な次世代の業務システムをご提案します。</p>
                <div className="cta-buttons">
                  <a href="#contact" className="btn primary-btn">無料相談を予約する</a>
                  <a href="#courses" className="btn secondary-btn">Notionで学ぶ</a>
                  <a href="#demo" className="btn orange-btn">デモを見る</a>
                </div>
              </div>
              <div className="hero-image">
                <img src="/1957dad0a3720.png" alt="ビジネスパーソンのイラスト" />

                <div className="vertical-container">
                  <div className="vertical-text-char char-1">そ</div>
                  <div className="vertical-text-char char-2">の</div>
                  <div className="vertical-text-char char-3">シ</div>
                  <div className="vertical-text-char char-4">ス</div>
                  <div className="vertical-text-char char-5">テ</div>
                  <div className="vertical-text-char char-6">ム</div>
                  <div className="vertical-text-char char-7">、</div>
                  <div className="vertical-text-char char-8">イ</div>
                  <div className="vertical-text-char char-9">マ</div>
                  <div className="vertical-text-char char-10">ド</div>
                  <div className="vertical-text-char char-11">キ</div>
                  <div className="vertical-text-char char-12">で</div>
                  <div className="vertical-text-char char-13">す</div>
                  <div className="vertical-text-char char-14">か</div>
                  <div className="vertical-text-char char-15">？</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="features">
          <div className="container">
            <h2 className="section-title">最先端のシステム統合機能</h2>
            <p className="section-desc">Notionはシンプルでありながらも、他システムとの連携やアドオンによって、柔らかな業務システムに進化した形になります。</p>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon"><i className="fas fa-database"></i></div>
                <h3>オールインワン情報管理</h3>
                <p>タスク、会議録、プロジェクト計画、顧客CRMなど、業務に必要な文書を統合的にコラボレーションできる環境を提供。情報が一箇所に集約され、すぐに見つけられます。</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon"><i className="fas fa-tools"></i></div>
                <h3>外部ツールと連携</h3>
                <p>Slack、Google Drive、Figma、GitHubなど200以上の外部サービス・ツールと連携。既存の業務ツールを活かしながら、情報を統合的に管理できます。</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon"><i className="fas fa-code"></i></div>
                <h3>APIによるデータ連携</h3>
                <p>NotionのAPIを活用して、既存のシステムとも柔軟につながるデータ連携が可能。カスタマイズされた自動化や連携機能により、業務効率を飛躍的に向上させます。</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon"><i className="fas fa-chart-line"></i></div>
                <h3>ワークフロー構築</h3>
                <p>ボタンやステータスの変更、タグや条件分岐などを活用し、シンプルながらも効率的なワークフローを構築でき、チーム内の業務を円滑に進めます。</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon"><i className="fas fa-mobile-alt"></i></div>
                <h3>マルチビューデータベース</h3>
                <p>同じデータをリスト、カレンダー、カンバン、ギャラリー、タイムラインなど、目的に合わせた表示形式で確認できます。</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon"><i className="fas fa-lock"></i></div>
                <h3>セキュリティとアクセス管理</h3>
                <p>ユーザーやグループごとに細かなアクセス権限を設定でき、適切に情報を管理。重要な情報へのアクセスを制御します。</p>
              </div>
            </div>
          </div>
        </section>

        <section className="integrations">
          <div className="container">
            <h2 className="section-title">主要サービスとの連携</h2>
            <p className="section-desc">多くの主要サービスと統合できます</p>

            <div className="integration-grid">
              <div className="integration-item">
                <div className="integration-icon slack"><i className="fab fa-slack"></i></div>
                <p>Slack</p>
              </div>
              <div className="integration-item">
                <div className="integration-icon google-drive"><i className="fab fa-google-drive"></i></div>
                <p>Google Drive</p>
              </div>
              <div className="integration-item">
                <div className="integration-icon figma"><i className="fab fa-figma"></i></div>
                <p>Figma</p>
              </div>
              <div className="integration-item">
                <div className="integration-icon github"><i className="fab fa-github"></i></div>
                <p>GitHub</p>
              </div>
              <div className="integration-item">
                <div className="integration-icon asana"><i className="fas fa-list-check"></i></div>
                <p>Asana</p>
              </div>
              <div className="integration-item">
                <div className="integration-icon trello"><i className="fab fa-trello"></i></div>
                <p>Trello</p>
              </div>
              <div className="integration-item">
                <div className="integration-icon jira"><i className="fab fa-atlassian"></i></div>
                <p>Jira</p>
              </div>
              <div className="integration-item">
                <div className="integration-icon zoom"><i className="fas fa-video"></i></div>
                <p>Zoom</p>
              </div>
              <div className="integration-item">
                <div className="integration-icon dropbox"><i className="fab fa-dropbox"></i></div>
                <p>Dropbox</p>
              </div>
              <div className="integration-item">
                <div className="more-integrations">and more...</div>
              </div>
            </div>
          </div>
        </section>

        <section className="system-design">
          <div className="container">
            <div className="design-content">
              <div className="design-text">
                <h2 className="section-title">効率的なシステム設計と統合</h2>
                <p>既存のシステムとNotionシステムとの連携は簡単です。データをCSVなどのファイルフォーマットでの取り込みはもちろん、APIを活用すれば、既存のウェブシステムからも自動でデータ連携が可能です。</p>

                <ul className="design-features">
                  <li><i className="fas fa-check"></i> 既存データの取り込みと管理</li>
                  <li><i className="fas fa-check"></i> 業務プロセスに合わせたテンプレート作成</li>
                  <li><i className="fas fa-check"></i> データ分析とレポート作成</li>
                  <li><i className="fas fa-check"></i> APIを活用した自動システム連携</li>
                </ul>
              </div>
              <div className="design-image">
                <i className="fas fa-database fa-5x"></i>
              </div>
            </div>
          </div>
        </section>

        <section className="why-notion">
          <div className="container">
            <h2 className="section-title">なぜ、今Notionなのか？</h2>
            <p className="section-desc">従来のシステムからの転換点、変更をしていくべき時期に最適解を提案します。</p>

            <div className="why-grid">
              <div className="why-card">
                <div className="why-icon"><i className="fas fa-chart-bar"></i></div>
                <h3>既存管理業務のサイロ化を解消</h3>
                <p>散らばった情報をNotionに一元化することで、部署間、チーム間、プロセス間のデータの流れをシームレスにします。</p>
              </div>

              <div className="why-card">
                <div className="why-icon"><i className="fas fa-users"></i></div>
                <h3>リモートチームコラボレーション</h3>
                <p>チーム全員がリアルタイムで同じ情報にアクセスでき、場所や時間を問わず、協働作業が可能です。在宅勤務でも情報共有がスムーズになります。</p>
              </div>

              <div className="why-card">
                <div className="why-icon"><i className="fas fa-cogs"></i></div>
                <h3>カスタマイズ可能なワークフロー</h3>
                <p>既存のプロセスを置き換えるのではなく、最適化するワークフローを構築。既存の業務フローを効率化します。</p>
              </div>

              <div className="why-card">
                <div className="why-icon"><i className="fas fa-rocket"></i></div>
                <h3>迅速な立上げと業務改善</h3>
                <p>従来の開発手法に比べて、APIを活用したシステム連携や、業務に最適化したデータベース設計が短期間で実現可能です。</p>
              </div>
            </div>
          </div>
        </section>

        <section className="testimonials">
          <div className="container">
            <h2 className="section-title">お客様の声</h2>
            <p className="section-desc">Notionシステムを導入されたお客様の声をフィードバックでご紹介します。</p>

            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="rating">★★★★★</div>
                <p className="quote">"Notionを導入してから、チームの連携スピードが劇的に改善しました。情報が分散していた問題が解消され、誰でも必要な情報にすぐアクセスできます。シンプルな操作性にも関わらず意外と高度な使い方ができることに驚きました。"</p>
                <div className="author">
                  <p className="name">田中 幸太</p>
                  <p className="position">マーケティング部長 / 株式会社ABC</p>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="rating">★★★★★</div>
                <p className="quote">"私たちのチームはNotionを使って業務管理プロジェクトを管理することができています。特にデータベース機能が気に入っています。異なるビューで同じデータを見ることができるのがとても便利です。サポートも素晴らしいです。"</p>
                <div className="author">
                  <p className="name">佐藤 剛史</p>
                  <p className="position">エンジニアリングマネージャー / スタートアップXYZ</p>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="rating">★★★★</div>
                <p className="quote">"以前はデータがバラバラだったため、必要な情報を探すのに時間がかかっていました。Notionを導入してからは、全てのプロジェクト情報が一カ所にまとめられています。特にEFFECTさんのサポートとカスタマイズは素晴らしく、当社専用の管理システムが実現しました。"</p>
                <div className="author">
                  <p className="name">山田 武彦</p>
                  <p className="position">ディレクター / コミュニケーション</p>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="rating">★★★★★</div>
                <p className="quote">"導入前はNotionを使いこなせるか不安でしたが、分かりやすいテンプレートで簡単に始められました。特に外部APIとの連携が強力で、既存システムとのデータ統合が驚くほど簡単に実現できました。業務効率が大幅に向上しています。"</p>
                <div className="author">
                  <p className="name">鈴木 拓也</p>
                  <p className="position">情報システム部 / ヘルスケア企業</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="contact" id="contact">
          <div className="container">
            <h2 className="section-title">お問い合わせ</h2>
            <p className="section-desc">Notionシステムに関するご質問やご相談は、お気軽にお問い合わせください。</p>

            <div className="contact-content">
              <div className="company-info">
                <div className="company-logo">EFFECT</div>
                <div className="company-details">
                  <p><strong>Notionセットアップサービス</strong></p>
                  <p>お客様のニーズに合わせたNotionワークスペースのセットアップと構築をお手伝いします。</p>
                  <ul className="company-links">
                    <li><a href="#">導入事例</a></li>
                    <li><a href="#">Notionシステム開発について</a></li>
                    <li><a href="#">料金プラン</a></li>
                    <li><a href="#">よくあるご質問</a></li>
                  </ul>
                </div>
              </div>
              <div className="contact-form">
                <form id="inquiry-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">お名前 <span className="required">*</span></label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">メールアドレス <span className="required">*</span></label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="company">会社名</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">電話番号</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">お問い合わせ内容 <span className="required">*</span></label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? '送信中...' : '無料相談を申し込む'}
                  </button>
                  <div className={`form-status ${formStatus.type}`} style={{display: formStatus.show ? 'block' : 'none'}}>
                    {formStatus.message}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">EFFECT Co. Ltd.</div>
            <div className="footer-links">
              <ul>
                <li><a href="#">ホーム</a></li>
                <li><a href="#">サービス</a></li>
                <li><a href="#">事例</a></li>
                <li><a href="#">会社概要</a></li>
                <li><a href="#">お問い合わせ</a></li>
              </ul>
            </div>
            <div className="footer-social">
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
          <div className="copyright">
            <p>&copy; 2025 EFFECT Co. Ltd. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}