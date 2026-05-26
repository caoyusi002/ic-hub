import React, { useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, Bookmark, Search } from 'lucide-react';
import backgroundUrl from '../assets/ic-background.png';
import { technicalDocEntries, technicalDocTypes } from '../data/docs.js';

export function TechnicalDocsPage() {
  const [activeType, setActiveType] = useState('全部');
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');

  const visibleDocs = useMemo(
    () => technicalDocEntries.filter((doc) => activeType === '全部' || doc.type === activeType),
    [activeType]
  );

  const showComingSoon = () => {
    setNotice('搜索功能即将上线');
  };

  return (
    <main
      className="app-shell docs-shell"
      style={{
        '--bg-image': `url(${backgroundUrl})`,
        '--library-accent': '#8bffcf',
        '--library-accent-rgb': '139 255 207',
        '--library-contrast': '#07140f',
      }}
    >
      <section className="docs-page">
        <header className="docs-hero">
          <a className="library-back" href="#" onClick={() => { window.location.hash = ''; }}>
            <ArrowLeft size={18} aria-hidden="true" />
            返回首页
          </a>
          <div className="docs-hero-grid">
            <p className="eyebrow">TECHNICAL DOCUMENTATION</p>
            <h1>技术文档</h1>
          </div>

          <form
            className="docs-search"
            onSubmit={(event) => {
              event.preventDefault();
              showComingSoon();
            }}
          >
            <Search size={18} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setNotice('')}
              placeholder="搜索技术文档、工具手册、产品应用"
            />
            <button type="submit">搜索</button>
          </form>
          {notice ? <p className="docs-notice" role="status">{notice}</p> : null}
        </header>

        <nav className="docs-type-nav" aria-label="文档类型筛选">
          {technicalDocTypes.map((type) => (
            <button
              key={type}
              className={activeType === type ? 'active' : ''}
              type="button"
              onClick={() => setActiveType(type)}
            >
              {type}
            </button>
          ))}
        </nav>

        <section className="docs-layout">
          <div className="docs-list" aria-label="技术文档占位列表">
            {visibleDocs.map((doc) => (
              <article className="doc-card" key={doc.title}>
                <div className="doc-card-mark" aria-hidden="true">
                  <BookOpen size={22} strokeWidth={1.8} />
                </div>
                <div>
                  <div className="doc-card-title-row">
                    <h2>{doc.title}</h2>
                    <span>{doc.status}</span>
                  </div>
                  <p>该文档条目为框架占位，后续将补充真实资料、摘要、附件和阅读入口。</p>
                  <div className="doc-card-meta">
                    <span>{doc.category}</span>
                    <span>{doc.type}</span>
                    <span>上传日期：{doc.uploadedAt}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="docs-side" aria-label="技术文档侧栏">
            <section className="docs-side-panel">
              <h2>最近更新</h2>
              <p>预留版本更新、文档发布和资料补充记录。</p>
            </section>
            <section className="docs-side-panel">
              <h2>热门文档</h2>
              <p>后续展示访问量较高的工具手册、技术前沿、产品应用和问题排查清单。</p>
            </section>
            <section className="docs-side-panel">
              <h2>推荐学习路径</h2>
              <p>规划 EDA 入门、IP 集成、PDK 验证和 IC 设计流程四类路径。</p>
            </section>
            <section className="docs-side-panel docs-contribution">
              <Bookmark size={18} aria-hidden="true" />
              <div>
                <h2>文档贡献提示</h2>
                <p>可先由内部维护资料目录，后续再增加提交入口与审核流程。</p>
              </div>
            </section>
          </aside>
        </section>
      </section>
    </main>
  );
}
