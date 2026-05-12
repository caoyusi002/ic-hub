import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Blocks, DraftingCompass, Factory, Microchip, RotateCcw } from 'lucide-react';
import backgroundUrl from './assets/ic-background.png';
import './styles.css';

const nodes = [
  {
    id: 'ip',
    label: 'IP',
    subtitle: '半导体 IP 核',
    position: { x: 50, y: 2 },
    accentColor: '#a995ff',
    icon: Blocks,
    meaning: 'IP 是可复用的芯片功能模块，如处理器、接口、存储和安全模块，可缩短研发周期，降低重复设计成本。',
  },
  {
    id: 'eda',
    label: 'EDA',
    subtitle: '电子设计自动化',
    position: { x: 12.5, y: 73 },
    accentColor: '#8bffcf',
    icon: DraftingCompass,
    meaning: 'EDA 是芯片设计软件工具体系，覆盖电路设计、仿真、验证、布局布线和签核，是 IC 设计企业完成复杂芯片开发的基础工具。',
  },
  {
    id: 'pdk',
    label: 'PDK',
    subtitle: '工艺设计套件',
    position: { x: 87.5, y: 73 },
    accentColor: '#6ee7ff',
    icon: Factory,
    meaning: 'PDK 是芯片设计与晶圆制造之间的工艺接口，提供器件模型、设计规则和验证文件，帮助设计能够被特定工艺稳定制造。',
  },
  {
    id: 'fabless',
    label: 'IC 设计企业',
    subtitle: 'Fabless',
    position: { x: 50, y: 47.67 },
    accentColor: '#ffd36e',
    icon: Microchip,
    meaning: 'IC 设计企业聚焦芯片定义、架构、设计和验证，不自建晶圆厂，而是协同 EDA、IP、PDK 与制造生态完成产品落地。',
  },
];

const triangle = {
  top: { x: 50, y: 8 },
  left: { x: 15, y: 68.62 },
  right: { x: 85, y: 68.62 },
};

const lines = [
  { id: 'ip-fabless', type: 'hub', from: 'ip', to: 'fabless', x1: 50, y1: 10.5, x2: 50, y2: 42 },
  { id: 'eda-fabless', type: 'hub', from: 'eda', to: 'fabless', x1: 21, y1: 68, x2: 41, y2: 54 },
  { id: 'pdk-fabless', type: 'hub', from: 'pdk', to: 'fabless', x1: 79, y1: 68, x2: 59, y2: 54 },
];

function App() {
  const [activeNode, setActiveNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const currentResource = useMemo(
    () => nodes.find((node) => node.id === selectedNode),
    [selectedNode],
  );

  if (currentResource) {
    const Icon = currentResource.icon;

    return (
      <main className="app-shell detail-shell" style={{ '--bg-image': `url(${backgroundUrl})` }}>
        <section className="resource-placeholder">
          <button className="back-button" onClick={() => setSelectedNode(null)}>
            <RotateCcw size={18} aria-hidden="true" />
            返回首页
          </button>
          <div className="placeholder-mark" style={{ '--accent': currentResource.accentColor }}>
            <Icon size={46} strokeWidth={1.65} aria-hidden="true" />
          </div>
          <p className="eyebrow">RESOURCE GATEWAY</p>
          <h1>{currentResource.label}</h1>
          <p className="placeholder-copy">
            {currentResource.meaning}
            <br />
            {currentResource.subtitle}资源库入口已预留，内容与分类将在下一阶段建设。
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell" style={{ '--bg-image': `url(${backgroundUrl})` }}>
      <section className="hero">
        <div className="triangle-stage" aria-label="集成电路产业库入口关系图">
          <svg className="triangle-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <filter id="lineGlow">
                <feGaussianBlur stdDeviation="1.8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="flareGlow">
                <feGaussianBlur stdDeviation="3.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="triangleStroke" x1="15%" y1="82%" x2="86%" y2="10%">
                <stop stopColor="#54d9ff" />
                <stop offset="0.42" stopColor="#ffffff" />
                <stop offset="0.72" stopColor="#8a78ff" />
                <stop offset="1" stopColor="#eff8ff" />
              </linearGradient>
              <linearGradient id="triangleHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop stopColor="rgba(84, 217, 255, 0)" />
                <stop offset="0.45" stopColor="#ffffff" />
                <stop offset="0.58" stopColor="#8a78ff" />
                <stop offset="1" stopColor="rgba(84, 217, 255, 0)" />
              </linearGradient>
              <mask id="resourceOverlapMask">
                <rect width="100" height="100" fill="white" />
                <rect x="41" y="0" width="18" height="14" fill="rgba(255,255,255,0.3)" />
                <rect x="5" y="63" width="20" height="18" fill="rgba(255,255,255,0.3)" />
                <rect x="75" y="63" width="20" height="18" fill="rgba(255,255,255,0.3)" />
              </mask>
            </defs>

            <polyline
              className="triangle-outline"
              points={`${triangle.top.x},${triangle.top.y} ${triangle.left.x},${triangle.left.y} ${triangle.right.x},${triangle.right.y} ${triangle.top.x},${triangle.top.y}`}
              fill="none"
              stroke="url(#triangleStroke)"
              filter="url(#lineGlow)"
              mask="url(#resourceOverlapMask)"
            />
            <polyline
              className="triangle-inner-glow"
              points={`${triangle.left.x + 2},${triangle.left.y} 50,${triangle.left.y} ${triangle.right.x - 2},${triangle.right.y}`}
              fill="none"
              stroke="url(#triangleHighlight)"
              filter="url(#flareGlow)"
              mask="url(#resourceOverlapMask)"
            />
            <circle className="triangle-flare base-flare" cx="50" cy={triangle.left.y} r="1.9" filter="url(#flareGlow)" />
            <circle className="triangle-flare side-flare" cx="74" cy="51" r="1.6" filter="url(#flareGlow)" />
            <circle className="triangle-spark spark-one" cx="55" cy="62" r="0.62" />
            <circle className="triangle-spark spark-two" cx="78" cy="49" r="0.52" />

            {lines.map((line) => {
              const isNodeActive = activeNode && (line.from === activeNode || line.to === activeNode);

              return (
                <line
                  key={line.id}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  className={[
                    'triangle-line',
                    line.type,
                    isNodeActive ? 'active-line' : '',
                  ].join(' ')}
                  stroke="#f0c766"
                  filter={isNodeActive ? 'url(#lineGlow)' : undefined}
                />
              );
            })}
          </svg>

          {nodes.map((node) => {
            const Icon = node.icon;
            const isActive = activeNode === node.id;

            return (
              <button
                key={node.id}
                className={`industry-node ${node.id} ${isActive ? 'active' : ''}`}
                style={{
                  '--x': `${node.position.x}%`,
                  '--y': `${node.position.y}%`,
                  '--accent': node.accentColor,
                }}
                onMouseEnter={() => setActiveNode(node.id)}
                onMouseLeave={() => setActiveNode(null)}
                onFocus={() => setActiveNode(node.id)}
                onBlur={() => setActiveNode(null)}
                onClick={() => setSelectedNode(node.id)}
                aria-label={`进入${node.label}资源库`}
              >
                <span className="node-frame" aria-hidden="true" />
                <span className="node-icon">
                  <Icon size={22} strokeWidth={1.7} aria-hidden="true" />
                </span>
                <span className="node-label">{node.label}</span>
                <span className="node-subtitle">{node.subtitle}</span>
              </button>
            );
          })}
        </div>

        <div className="hero-copy">
          <p className="eyebrow">IC INDUSTRY KNOWLEDGE BASE</p>
          <h1>
            集成电路
            <span>产业库</span>
          </h1>
          <p>以 IC 设计企业为核心，连接 EDA、IP 与 PDK 三类关键产业资源，构建可扩展的产业知识入口。</p>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
