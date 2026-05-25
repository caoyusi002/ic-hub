import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft,
  Blocks,
  BookOpen,
  Bookmark,
  Calculator,
  ChevronDown,
  ChevronRight,
  Download,
  DraftingCompass,
  Factory,
  Grid2X2,
  List,
  Mail,
  MapPin,
  Microchip,
  Phone,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  Trash2,
  Workflow,
  X,
} from 'lucide-react';
import backgroundUrl from './assets/ic-background.png';
import waferDieCalculatorUrl from './assets/wafer-die-calculator.webp';
import { companyDescriptions, companySourceUrls, companyVisuals } from './data/company.js';
import { edaResources, edaTaxonomy } from './data/eda.js';
import { foundryProcessNodeOptions, foundryResources } from './data/foundry.js';
import {
  getIndustryNewsById,
  getIndustryNewsDirectory,
  industryNews,
  industryNewsCategories,
  industryNewsSortOptions,
} from './data/news.js';
import { ipResources, ipTaxonomy } from './data/ip.js';
import { chinaSemiconductorWebReport, getReportById, reportCategories, researchReports } from './data/reports.js';
import { chipAreaDefaultValues, chipAreaPresets, chipProfiles, onlineTools, processLibrary } from './data/tools.js';
import './styles.css';

const nodes = [
  {
    id: 'ip',
    label: 'IP',
    subtitle: '半导体 IP 核',
    position: { x: 50, y: 0.8 },
    accentColor: '#a995ff',
    icon: Blocks,
    meaning: 'IP 是可复用的芯片功能模块，如处理器、接口、存储和安全模块，可缩短研发周期，降低重复设计成本。',
  },
  {
    id: 'eda',
    label: 'EDA',
    subtitle: '电子设计自动化',
    position: { x: 6.8, y: 75.2 },
    accentColor: '#8bffcf',
    icon: DraftingCompass,
    meaning: 'EDA 是芯片设计软件工具体系，覆盖电路设计、仿真、验证、布局布线和签核，是 IC 设计企业完成复杂芯片开发的基础工具。',
  },
  {
    id: 'pdk',
    label: 'PDK',
    subtitle: '工艺设计套件',
    position: { x: 93.2, y: 75.2 },
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

const topNavItems = ['行业新闻', '研究报告', '技术文档', '产品试用', '厂商资源库', '在线工具'];

const getHomeNavHref = (item) => {
  if (item === '行业新闻') return '#/news';
  if (item === '研究报告') return '#/reports';
  if (item === '在线工具') return '#/tools';
  return '#';
};

const RESULTS_PAGE_SIZE = 8;

const getResourceSlug = (resource) => encodeURIComponent(`${resource.company}-${resource.tool}`);

const findResourceBySlug = (resources, slug) => resources.find((resource) => getResourceSlug(resource) === slug);

const getCompanySlug = (company) => encodeURIComponent(company);

const allResources = [...edaResources, ...ipResources];

const getResourceLibraryKey = (resource) => (ipResources.includes(resource) ? 'ip' : 'eda');

const getCompanyBySlug = (slug) =>
  Array.from(new Set(allResources.map((resource) => resource.company))).find((company) => getCompanySlug(company) === slug);

const getCompanyResources = (company) => allResources.filter((resource) => resource.company === company);

const getResourceVisual = (resource) => resource.imageUrl || companyVisuals[resource.company];

const getResourceSourceUrl = (resource) => resource.officialUrl || resource.sourceUrl || companySourceUrls[resource.company];

const getResourceDisplayName = (resource) =>
  resource.tool.startsWith(resource.company) ? resource.tool : `${resource.company} ${resource.tool}`;

const isIpDictionaryResource = (resource) =>
  Boolean(resource.fullName || resource.specs || resource.exampleApplications || resource.applicationDomains || resource.vendors);

const getResourceChips = (resource) => {
  if (isIpDictionaryResource(resource)) {
    return [
      resource.secondaryCategory,
      resource.primaryCategory.split('|')[0].trim(),
      resource.status,
    ].filter(Boolean);
  }

  return [resource.secondaryCategory, resource.stage, resource.region, resource.operationMode].filter(Boolean);
};

const getApplicationText = (resource) => resource.exampleApplications || resource.tags.slice(0, 3).join('、');

const getVendorPreview = (resource, limit = 4) => {
  if (!resource.vendors) return '';
  const vendors = resource.vendors
    .split(/[；;]/)
    .map((vendor) => vendor.trim())
    .filter(Boolean);
  if (vendors.length <= limit) return vendors.join('；');
  return `${vendors.slice(0, limit).join('；')} 等 ${vendors.length} 家`;
};

const getCompanyInitials = (company) => company
  .split(/\s+/)
  .map((part) => part[0])
  .join('')
  .slice(0, 2)
  .toUpperCase();

const getStageFlow = (resource) => {
  if (isIpDictionaryResource(resource)) return ['分类定位', '规格评估', '厂商选型', '集成验证'];
  if (resource.primaryCategory.includes('模拟')) return ['电路设计', '仿真验证', '版图/签核'];
  if (resource.primaryCategory.includes('数字前端')) return ['RTL 设计', '验证', '综合'];
  if (resource.primaryCategory.includes('数字后端')) return ['物理实现', '分析', '签核'];
  if (resource.primaryCategory.includes('工艺开发')) return ['工艺建模', '模型验证', '制造支持'];
  if (resource.primaryCategory.includes('封装') || resource.primaryCategory.includes('PCB')) return ['封装/PCB 设计', 'SI/PI 分析', '制造输出'];
  if (resource.primaryCategory.includes('FPGA')) return ['原型设计', '验证', '系统协同'];
  if (resource.primaryCategory.includes('系统')) return ['系统建模', '多物理仿真', '协同优化'];
  if (resource.primaryCategory.includes('处理器')) return ['架构选型', '软件生态适配', 'SoC 集成'];
  if (resource.primaryCategory.includes('接口')) return ['协议选型', '控制器/PHY 集成', '合规验证'];
  if (resource.primaryCategory.includes('存储')) return ['容量/带宽规划', '控制器/PHY 集成', '可靠性验证'];
  if (resource.primaryCategory.includes('安全')) return ['威胁建模', '安全子系统集成', '密钥生命周期'];
  if (resource.primaryCategory.includes('基础')) return ['工艺适配', '库验证', '后端实现'];
  if (resource.primaryCategory.includes('验证')) return ['测试平台', '协议检查', '覆盖率收敛'];
  return [resource.primaryCategory, resource.stage, resource.secondaryCategory];
};

const getResourceDetailSections = (resource) => {
  if (resource.detailSections) return resource.detailSections;

  if (isIpDictionaryResource(resource)) {
    return [
      { title: 'IP 全称', body: resource.fullName || resource.tool },
      { title: '核心功能', body: resource.detail || resource.summary },
      { title: '关键规格参数', body: resource.specs || '关键规格参数待结合具体厂商资料补充。' },
      { title: '典型应用与领域', body: `${resource.exampleApplications || '典型应用待补充'}；${resource.applicationDomains || '典型应用领域待补充'}` },
      { title: '代表厂商', body: resource.vendors || '代表厂商待补充。' },
      { title: '备注', body: resource.note || '具体性能、工艺节点、授权范围以厂商 datasheet/协议规范/NDA 资料为准。' },
    ];
  }

  return [
    {
      title: '产品定位',
      body: resource.detail || resource.summary,
    },
    {
      title: '核心用途',
      body: `${resource.summary} 该条目归入「${resource.primaryCategory} / ${resource.secondaryCategory}」，用于快速判断其在 EDA 流程中的位置。`,
    },
    {
      title: '典型应用',
      body: getApplicationText(resource) || '典型应用待补充，后续可随具体厂商资料继续扩写。',
    },
  ];
};

const getDetailSectionBody = (resource, titlePattern) =>
  resource.detailSections?.find((section) => titlePattern.test(section.title))?.body;

const getIpFoundryInfo = (resource) => {
  if (resource.foundry || resource.processNode || resource.maturity || resource.availability) {
    return {
      foundryNode: [resource.foundry, resource.processNode].filter(Boolean).join(' · ') || '公开资料未披露固定代工厂/节点。',
      maturity: resource.maturity || '需结合厂商 datasheet、硅验证报告或 NDA 资料确认。',
      availability: resource.availability || '需联系厂商确认授权范围、交付物和可用版本。',
    };
  }

  if (resource.company === 'Andes' || /Cortex|AndesCore|CPU|DSP|NPU|VPU|Security|System|Corstone/.test(`${resource.tool} ${resource.secondaryCategory}`)) {
    return {
      foundryNode: '可综合软核或系统级 IP，通常不绑定单一代工厂/节点；最终节点由 SoC 项目和后端实现决定。',
      maturity: '成熟度以对应 IP 版本、参考设计、软件栈和客户项目验证情况为准。',
      availability: '需联系厂商确认授权模式、交付物、验证包和目标工艺支持。',
    };
  }

  if (/PCIe|UCIe|HBM|Ethernet|SerDes|Datapath|Analog|RF|MIPI|USB/.test(`${resource.tool} ${resource.secondaryCategory}`)) {
    return {
      foundryNode: '高速接口、模拟/混合信号或 PHY 类 IP 通常与具体 foundry、节点和 PDK 强相关；公开页面未披露固定组合时需单独确认。',
      maturity: '需确认是否 silicon proven、是否已有目标节点 tape-out 记录，以及是否覆盖目标 PVT corner。',
      availability: '需向厂商确认可授权节点、硬宏/PHY 交付物、验证报告和集成支持范围。',
    };
  }

  return {
    foundryNode: '公开资料未披露固定代工厂/节点。',
    maturity: '需结合厂商 datasheet、硅验证报告或 NDA 资料确认。',
    availability: '需联系厂商确认授权范围、交付物和可用版本。',
  };
};

const getIpMarketSections = (resource) => {
  const representativeProducts = getDetailSectionBody(resource, /代表产品|系列/) || resource.secondaryCategory;
  const applications = getDetailSectionBody(resource, /典型应用|应用/) || resource.stage;
  const foundryInfo = getIpFoundryInfo(resource);
  const featureText = `代表产品/系列：${representativeProducts}。核心能力：${resource.tags.slice(0, 5).join('、')}。`;
  const customerText = resource.customers || '主要客户信息待补充，后续可根据公开客户案例、授权公告或厂商访谈资料完善。';
  const blockDiagramText = resource.blockDiagram || 'Block Diagram 待补充，后续可放置 IP 框图、接口关系图或集成示意图。';
  const specText = resource.specifications || '规格参数待补充，后续可补充工艺节点、接口协议、数据速率、面积、功耗、交付物和验证状态等信息。';

  return [
    {
      title: '概述',
      body: resource.detail || resource.summary,
    },
    {
      title: '主要特点',
      body: featureText,
    },
    {
      title: '适用范围',
      body: applications,
    },
    {
      title: '主要客户',
      body: customerText,
    },
    {
      title: 'Block Diagram',
      body: blockDiagramText,
    },
    {
      title: '规格',
      body: specText,
    },
    {
      title: '代工厂信息',
      body: `代工厂/节点：${foundryInfo.foundryNode} 成熟度：${foundryInfo.maturity} 可获得性：${foundryInfo.availability}`,
    },
  ];
};

const getIpSpecificationRows = (resource) => [
  { label: '产品编号', value: resource.partNumber || '待补充' },
  { label: '供应商', value: resource.company },
  { label: '类型', value: resource.ipType || '硅 IP' },
];

const getSourceStatus = (resource) => (getResourceSourceUrl(resource) ? '官网整理' : '待补充');

const getRelationParts = (item) => {
  const [name, ...descriptionParts] = item.split('：');

  return {
    name,
    description: descriptionParts.join('：'),
  };
};

const productContactItems = [
  { label: '地址', value: '地址信息待补充', icon: MapPin },
  { label: '联系方式', value: '联系方式待补充', icon: Phone },
  { label: '邮箱', value: '邮箱信息待补充', icon: Mail },
];

const productFollowChannels = [
  { label: '公众号', icon: 'wechat' },
  { label: '微博', icon: 'weibo' },
  { label: 'X', icon: 'x' },
  { label: 'Facebook', icon: 'facebook' },
  { label: 'Instagram', icon: 'instagram' },
];

function BrandIcon({ name }) {
  if (name === 'wechat') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" className="brand-icon">
        <path d="M13.6 8.5c-5.2 0-9.4 3.4-9.4 7.6 0 2.4 1.4 4.5 3.5 5.9l-.8 3 3.4-1.8c1 .3 2.1.5 3.3.5 5.2 0 9.4-3.4 9.4-7.6s-4.2-7.6-9.4-7.6Z" />
        <path d="M20 14.2c4.4.5 7.8 3.4 7.8 7 0 2.1-1.2 4-3.1 5.3l.7 2.6-3-1.6c-.9.3-1.9.4-3 .4-3.6 0-6.7-1.9-8-4.6" />
        <circle cx="10.5" cy="14.9" r="1.1" />
        <circle cx="16.3" cy="14.9" r="1.1" />
      </svg>
    );
  }

  if (name === 'weibo') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" className="brand-icon">
        <path d="M22.9 6.7c2.5.6 4.4 2.6 4.9 5.1" />
        <path d="M21.2 10.2c1.3.3 2.4 1.3 2.7 2.7" />
        <path d="M16 14.1c5.7 0 10.3 3.1 10.3 6.9S21.7 28 16 28 5.7 24.9 5.7 21.1c0-2.2 1.6-4.1 4-5.4.9-.5 1.1-1 .9-1.7-.2-.9.1-1.7.9-2.1.8-.4 1.8 0 2.4.9.4.7.8 1.3 2.1 1.3Z" />
        <ellipse cx="15.1" cy="21.3" rx="5.2" ry="3.8" />
        <circle cx="13.3" cy="20.6" r="1.1" />
        <circle cx="17.1" cy="21.9" r="0.85" />
      </svg>
    );
  }

  if (name === 'x') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" className="brand-icon brand-icon-solid">
        <path d="M7 6h5.1l5.1 6.8L23.2 6H26l-7.6 8.7L27 26h-5.1l-5.6-7.4L9.8 26H7l8.1-9.3L7 6Zm4.1 2.1 11.8 15.8h1L12.1 8.1h-1Z" />
      </svg>
    );
  }

  if (name === 'facebook') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" className="brand-icon brand-icon-solid">
        <path d="M18.6 28V17.4h3.6l.6-4.2h-4.2v-2.7c0-1.2.4-2 2.1-2h2.3V4.7c-.4-.1-1.8-.2-3.4-.2-3.4 0-5.8 2.1-5.8 5.9v2.8H10v4.2h3.8V28h4.8Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="brand-icon">
      <rect x="7" y="7" width="18" height="18" rx="5.4" />
      <circle cx="16" cy="16" r="4.4" />
      <circle cx="21.2" cy="10.8" r="1.1" />
    </svg>
  );
}

const productFlowTemplates = {
  analog: ['规格定义', '原理图设计', '电路仿真', '版图设计', '物理验证', '寄生提取/后仿', '模拟签核'],
  digitalFront: ['需求/架构', 'RTL 设计', '仿真/形式验证', '逻辑综合', 'DFT/等价检查', '前端收敛', '交付后端'],
  digitalBack: ['网表/约束输入', '地板规划', '布局布线', '寄生提取', '时序/功耗分析', '物理验证', '签核收敛'],
  assemblyPcb: ['系统/封装规划', '原理图设计', '版图/封装设计', 'SI/PI/热分析', '规则检查', '制造输出', '协同管理'],
  fpga: ['需求/架构', 'RTL 设计', '综合映射', '仿真验证', '原型实现', '调试迭代', '系统验证'],
  system: ['系统建模', '架构探索', '多物理仿真', '软硬件协同', '性能/功耗分析', '系统验证', '优化交付'],
  foundry: ['工艺开发', '器件建模', '参数提取', '模型验证', '光刻/OPC', '良率分析', '制造协同'],
  memsOpto: ['器件定义', '结构建模', '多物理仿真', '版图/工艺协同', '验证优化', '制造准备', '测试反馈'],
  testYield: ['测试规划', 'DFT 插入', '向量生成', '量测/ATE', '诊断分析', '良率优化', '量产反馈'],
  general: ['需求/架构', '设计输入', '仿真验证', '实现优化', '规则检查', '签核交付', '制造协同'],
};

const getProductFlowTemplateKey = (resource) => {
  if (resource.primaryCategory.includes('模拟')) return 'analog';
  if (resource.primaryCategory.includes('数字前端')) return 'digitalFront';
  if (resource.primaryCategory.includes('数字后端')) return 'digitalBack';
  if (resource.primaryCategory.includes('Assembly') || resource.primaryCategory.includes('PCB')) return 'assemblyPcb';
  if (resource.primaryCategory.includes('FPGA')) return 'fpga';
  if (resource.primaryCategory.includes('System')) return 'system';
  if (resource.primaryCategory.includes('Foundry')) return 'foundry';
  if (resource.primaryCategory.includes('MEMS') || resource.primaryCategory.includes('Opto')) return 'memsOpto';
  if (resource.primaryCategory.includes('其它') || /测试|良率|ATE|量测/.test(`${resource.secondaryCategory} ${resource.stage}`)) return 'testYield';
  return 'general';
};

const getProductFlowStepIndex = (resource, templateKey) => {
  const text = `${resource.primaryCategory} ${resource.secondaryCategory} ${resource.stage} ${resource.tags.join(' ')}`;
  const matchers = {
    analog: [
      /规格|需求/,
      /Schematic|原理图|Custom Compiler|Aether|设计平台/,
      /Simulation|SPICE|HSPICE|NanoSpice|ALPS|Spectre|仿真|RF/,
      /Layout|版图|PCell|Polas/,
      /DRC|LVS|物理验证|Pegasus|IC Validator/,
      /Extraction|寄生|RCExplorer|后仿|StarRC|Quantus/,
      /签核|Signoff/,
    ],
    digitalFront: [
      /需求|架构/,
      /RTL|设计输入/,
      /验证|仿真|Formal|VCS|Xcelium|Verdi|SpyGlass|UVS|UVD|VC Formal|形式/,
      /逻辑综合|Synthesis|Design Compiler|Genus/,
      /DFT|Test|ATPG|BIST|等价|Formality|Conformal/,
      /收敛|功耗|覆盖率/,
      /后端|交付/,
    ],
    digitalBack: [
      /网表|约束/,
      /地板规划|Floorplan/,
      /布局布线|物理实现|Place|Route|Innovus|Fusion Compiler|IC Compiler/,
      /Extraction|寄生|StarRC|Quantus/,
      /时序|Timing|PrimeTime|功耗|Power|Voltus|RedHawk/,
      /DRC|LVS|物理验证|IC Validator|Pegasus/,
      /签核|Signoff/,
    ],
    assemblyPcb: [
      /系统|封装规划/,
      /Schematic|原理图|OrCAD|Archer Schematic/,
      /Allegro|PCB|封装|Layout|Archer PCB/,
      /SI|PI|热|Sigrity|Clarity|Celsius/,
      /DRC|规则|检查/,
      /制造输出|Manufacturing/,
      /协同|管理|EDM/,
    ],
    fpga: [
      /需求|架构/,
      /RTL|设计/,
      /Synplify|综合|映射/,
      /仿真|验证/,
      /HAPS|ZeBu|Palladium|Protium|原型|硬件仿真/,
      /调试|Debug/,
      /系统验证/,
    ],
    system: [
      /系统建模|建模/,
      /架构/,
      /多物理|仿真|Clarity|Celsius|QuantumATK/,
      /协同/,
      /性能|功耗/,
      /验证/,
      /优化|交付/,
    ],
    foundry: [
      /工艺开发|TCAD|Sentaurus/,
      /器件建模|BSIM|模型/,
      /参数提取|提取/,
      /模型验证|验证|MeQLab/,
      /OPC|光刻|Proteus|ILT|LRC/,
      /良率|Yield|NanoYield/,
      /制造|Foundry|协同/,
    ],
    memsOpto: [
      /定义|需求/,
      /建模/,
      /仿真|多物理/,
      /版图|工艺/,
      /验证|优化/,
      /制造/,
      /测试/,
    ],
    testYield: [
      /测试规划|Test Plan/,
      /DFT|插入/,
      /向量|ATPG/,
      /ATE|量测|LabExpress|ATS|晶圆测试/,
      /诊断|DIAG|TRASTA/,
      /良率|Yield/,
      /量产|反馈/,
    ],
    general: [
      /需求|架构/,
      /设计|输入/,
      /仿真|验证/,
      /实现|优化/,
      /检查|规则/,
      /签核|交付/,
      /制造|协同/,
    ],
  };
  const templateMatchers = matchers[templateKey] || matchers.general;
  const matchedIndex = templateMatchers.findIndex((matcher) => matcher.test(text));
  if (matchedIndex >= 0) return matchedIndex;
  return 0;
};

const getProductFlow = (resource) => {
  const templateKey = getProductFlowTemplateKey(resource);
  return {
    steps: productFlowTemplates[templateKey],
    activeIndex: getProductFlowStepIndex(resource, templateKey),
  };
};

const libraryConfigs = {
  eda: {
    resourceName: 'EDA',
    accentColor: '#8bffcf',
    accentRgb: '139 255 207',
    contrastColor: '#07140f',
    eyebrow: 'EDA RESOURCE LIBRARY',
    title: 'EDA 资源库',
    description: '',
    taxonomy: edaTaxonomy,
    resources: edaResources,
    metricResourceLabel: '工具总数',
    metricCompanyLabel: '收录企业',
    searchPlaceholder: '搜索公司、工具、分类、阶段或标签',
    detailBasePath: 'eda',
  },
  ip: {
    resourceName: 'IP',
    accentColor: '#a995ff',
    accentRgb: '169 149 255',
    contrastColor: '#100b2d',
    eyebrow: 'IP RESOURCE LIBRARY',
    title: 'IP 资源库',
    description: 'IP 是芯片设计中可重复授权和集成的功能模块，相当于 SoC 里的成熟积木。通过处理器、接口、存储、安全、模拟混合信号等 IP，设计企业可以缩短研发周期、降低验证风险，并把更多精力放在系统架构和产品差异化上。您可以通过搜索和筛选，按具体需求定位合适的 IP，进一步找到匹配的 IP 解决方案。',
    taxonomy: ipTaxonomy,
    resources: ipResources,
    metricResourceLabel: 'IP 总数',
    metricCompanyLabel: '厂商数量',
    searchPlaceholder: '搜索公司、IP、协议、分类、阶段或标签',
    detailBasePath: 'ip',
  },
  foundry: {
    resourceName: 'Foundry',
    accentColor: '#6ee7ff',
    accentRgb: '110 231 255',
    contrastColor: '#06152a',
    eyebrow: 'FOUNDRY RESOURCE LIBRARY',
    title: '代工厂厂商库',
    description: '围绕晶圆制造、工艺平台、PDK、MPW、先进封装与生态支撑能力，沉淀代工厂厂商与服务能力信息。',
    taxonomy: [],
    resources: foundryResources,
    metricResourceLabel: '厂商样本',
    metricCompanyLabel: '代工厂商',
    metricThirdLabel: '地区分区',
    metricThirdValue: 3,
    metricFourthLabel: '制程节点',
    metricFourthValue: foundryProcessNodeOptions.length,
    searchPlaceholder: '搜索厂商、地区、制程节点、运营模式或标签',
    showCategoryTree: false,
    presetRegions: ['国际', '国内', '台湾地区'],
    supportOptions: foundryProcessNodeOptions,
    supportFilterLabel: '制程节点',
    supportPanelTitle: '按制程节点',
    supportFilterField: 'processNodes',
    showToolTypeFilter: false,
    operationModeOptions: ['Foundry', 'IDM'],
    operationModeFilterLabel: '运营模式',
    detailBasePath: 'foundry',
  },
};

function ResourceLibrary({ onBack, config }) {
  const {
    resourceName,
    accentColor,
    accentRgb,
    contrastColor,
    eyebrow,
    title,
    description,
    taxonomy,
    resources,
    metricResourceLabel,
    metricCompanyLabel,
    metricThirdLabel = '一级分类',
    metricThirdValue,
    metricFourthLabel = '二级分类',
    metricFourthValue,
    searchPlaceholder,
    detailBasePath,
    showCategoryTree = true,
    presetRegions = [],
    supportOptions = [],
    supportFilterLabel = '支撑能力',
    supportPanelTitle,
    supportFilterField = 'supportAreas',
    toolTypeFilterLabel = '工具类型',
    showToolTypeFilter = true,
    operationModeOptions = [],
    operationModeFilterLabel = '运营模式',
  } = config;
  const [query, setQuery] = useState('');
  const [activePrimary, setActivePrimary] = useState('全部');
  const [activeSecondary, setActiveSecondary] = useState('全部');
  const [companyFilter, setCompanyFilter] = useState('全部');
  const [regionFilter, setRegionFilter] = useState('全部');
  const [stageFilter, setStageFilter] = useState('全部');
  const [toolTypeFilter, setToolTypeFilter] = useState('全部');
  const [supportFilter, setSupportFilter] = useState('全部');
  const [operationModeFilter, setOperationModeFilter] = useState('全部');
  const [adoptionFilter, setAdoptionFilter] = useState('全部');
  const [isCategorySectionOpen, setIsCategorySectionOpen] = useState(true);
  const [isCompanySectionOpen, setIsCompanySectionOpen] = useState(true);
  const [expandedPrimaryCategories, setExpandedPrimaryCategories] = useState(
    () => new Set(taxonomy.map((category) => category.label)),
  );
  const [viewMode, setViewMode] = useState('card');
  const [sortMode, setSortMode] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedResource, setSelectedResource] = useState(null);

  const filterOptions = useMemo(() => {
    const getOptions = (key, presets = []) => [
      '全部',
      ...Array.from(new Set([...presets, ...resources.map((resource) => resource[key]).filter(Boolean)])),
    ];

    return {
      companies: getOptions('company'),
      regions: getOptions('region', presetRegions),
      stages: getOptions('stage'),
      toolTypes: getOptions('secondaryCategory'),
      supports: ['全部', ...Array.from(new Set(supportOptions))],
      operationModes: ['全部', ...Array.from(new Set([...operationModeOptions, ...resources.map((resource) => resource.operationMode).filter(Boolean)]))],
    };
  }, [operationModeOptions, presetRegions, resources, supportOptions]);

  const categoryCounts = useMemo(() => {
    return resources.reduce((counts, resource) => {
      counts[resource.primaryCategory] = (counts[resource.primaryCategory] || 0) + 1;
      const secondaryKey = `${resource.primaryCategory}::${resource.secondaryCategory}`;
      counts[secondaryKey] = (counts[secondaryKey] || 0) + 1;
      return counts;
    }, {});
  }, [resources]);

  const companyCounts = useMemo(() => {
    return resources.reduce((counts, resource) => {
      counts[resource.company] = (counts[resource.company] || 0) + 1;
      return counts;
    }, {});
  }, [resources]);

  const filteredResources = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesPrimary = activePrimary === '全部' || resource.primaryCategory === activePrimary;
      const matchesSecondary = activeSecondary === '全部' || resource.secondaryCategory === activeSecondary;
      const matchesCompany = companyFilter === '全部' || resource.company === companyFilter;
      const matchesRegion = regionFilter === '全部' || resource.region === regionFilter;
      const matchesStage = stageFilter === '全部' || resource.stage === stageFilter;
      const matchesToolType = toolTypeFilter === '全部' || resource.secondaryCategory === toolTypeFilter;
      const supportValues = resource[supportFilterField] || resource.supportAreas || [];
      const tags = resource.tags || [];
      const matchesSupport = supportFilter === '全部' || supportValues.includes(supportFilter) || tags.includes(supportFilter);
      const matchesOperationMode = operationModeFilter === '全部' || resource.operationMode === operationModeFilter;
      const hasAdoptionCases = Boolean(resource.adoptionCases?.length);
      const matchesAdoption = adoptionFilter === '全部' || hasAdoptionCases;
      const searchable = [
        resource.company,
        resource.tool,
        resource.primaryCategory,
        resource.secondaryCategory,
        resource.stage,
        resource.region,
        resource.operationMode,
        resource.summary,
        resource.detail,
        resource.fullName,
        resource.specs,
        resource.exampleApplications,
        resource.applicationDomains,
        resource.vendors,
        resource.note,
        resource.sourceUrl,
        companySourceUrls[resource.company],
        ...(resource.adoptionCases || []).flatMap((caseItem) => [
          caseItem.company,
          caseItem.chipType,
          caseItem.evidenceType,
          caseItem.accuracy,
          caseItem.sourceTitle,
          caseItem.note,
        ]),
        ...supportValues,
        ...(resource.supportAreas || []),
        ...tags,
      ].join(' ').toLowerCase();

      return (
        matchesPrimary &&
        matchesSecondary &&
        matchesCompany &&
        matchesRegion &&
        matchesStage &&
        matchesToolType &&
        matchesSupport &&
        matchesOperationMode &&
        matchesAdoption &&
        (!keyword || searchable.includes(keyword))
      );
    });
  }, [activePrimary, activeSecondary, adoptionFilter, companyFilter, operationModeFilter, query, regionFilter, resources, stageFilter, supportFilter, supportFilterField, toolTypeFilter]);

  const companyCount = new Set(resources.map((resource) => resource.company)).size;
  const secondaryCategoryCount = taxonomy.reduce((count, category) => count + category.items.length, 0);
  const thirdMetricValue = metricThirdValue ?? taxonomy.length;
  const fourthMetricValue = metricFourthValue ?? secondaryCategoryCount;
  const sortedResources = useMemo(() => {
    const next = [...filteredResources];
    const keyword = query.trim().toLowerCase();
    const getSearchScore = (resource) => {
      const company = resource.company.toLowerCase();
      const tool = resource.tool.toLowerCase();
      const secondary = resource.secondaryCategory.toLowerCase();
      const primary = resource.primaryCategory.toLowerCase();
      const tags = [...(resource.tags || []), ...(resource.supportAreas || [])].join(' ').toLowerCase();

      if (!keyword) return 0;
      if (company.startsWith(keyword)) return 100;
      if (tool.startsWith(keyword)) return 90;
      if (company.includes(keyword)) return 80;
      if (tool.includes(keyword)) return 70;
      if (secondary.includes(keyword)) return 55;
      if (primary.includes(keyword)) return 45;
      if (tags.includes(keyword)) return 35;
      return 10;
    };

    if (keyword) {
      next.sort((left, right) => {
        const scoreDiff = getSearchScore(right) - getSearchScore(left);
        if (scoreDiff !== 0) return scoreDiff;
        return `${left.company}${left.tool}`.localeCompare(`${right.company}${right.tool}`, 'zh-Hans-CN');
      });
    } else if (sortMode === 'company') {
      next.sort((left, right) => `${left.company}${left.tool}`.localeCompare(`${right.company}${right.tool}`, 'zh-Hans-CN'));
    } else if (sortMode === 'stage') {
      next.sort((left, right) => `${left.stage}${left.company}`.localeCompare(`${right.stage}${right.company}`, 'zh-Hans-CN'));
    }
    return next;
  }, [filteredResources, query, sortMode]);
  const totalPages = Math.max(1, Math.ceil(sortedResources.length / RESULTS_PAGE_SIZE));
  const currentSafePage = Math.min(currentPage, totalPages);
  const paginatedResources = useMemo(() => {
    const start = (currentSafePage - 1) * RESULTS_PAGE_SIZE;
    return sortedResources.slice(start, start + RESULTS_PAGE_SIZE);
  }, [currentSafePage, sortedResources]);
  const paginationItems = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = new Set([1, totalPages, currentSafePage - 1, currentSafePage, currentSafePage + 1]);
    if (currentSafePage <= 3) {
      pages.add(2);
      pages.add(3);
      pages.add(4);
    }
    if (currentSafePage >= totalPages - 2) {
      pages.add(totalPages - 3);
      pages.add(totalPages - 2);
      pages.add(totalPages - 1);
    }

    const sortedPages = Array.from(pages)
      .filter((page) => page >= 1 && page <= totalPages)
      .sort((left, right) => left - right);

    return sortedPages.flatMap((page, index) => {
      const previous = sortedPages[index - 1];
      if (index > 0 && page - previous > 1) {
        return [`ellipsis-${previous}-${page}`, page];
      }
      return [page];
    });
  }, [currentSafePage, totalPages]);
  const selectedCategoryLabel =
    activeSecondary !== '全部' ? activeSecondary : activePrimary !== '全部' ? activePrimary : '全部分类';
  const selectedCategorySummary =
    activeSecondary !== '全部'
      ? `${activePrimary} / ${activeSecondary}`
      : activePrimary !== '全部'
        ? activePrimary
        : `全部${resourceName}分类`;
  const selectedCompanySummary = companyFilter !== '全部' ? companyFilter : '全部公司';
  const getInternalDetailPath = (resource) =>
    detailBasePath ? `#/${detailBasePath}/product/${getResourceSlug(resource)}` : null;

  const handlePrimarySelect = (primaryCategory) => {
    setActivePrimary(primaryCategory);
    setActiveSecondary('全部');
    setCurrentPage(1);
  };

  const handlePrimaryToggle = (primaryCategory) => {
    setActivePrimary(primaryCategory);
    setActiveSecondary('全部');
    setCurrentPage(1);
    setExpandedPrimaryCategories((current) => {
      const next = new Set(current);
      if (next.has(primaryCategory)) {
        next.delete(primaryCategory);
      } else {
        next.add(primaryCategory);
      }
      return next;
    });
  };

  const handleSecondarySelect = (primaryCategory, secondaryCategory) => {
    setActivePrimary(primaryCategory);
    setActiveSecondary(secondaryCategory);
    setCurrentPage(1);
    setExpandedPrimaryCategories((current) => new Set(current).add(primaryCategory));
  };

  const resetFilters = () => {
    setQuery('');
    setActivePrimary('全部');
    setActiveSecondary('全部');
    setCompanyFilter('全部');
    setRegionFilter('全部');
    setStageFilter('全部');
    setToolTypeFilter('全部');
    setSupportFilter('全部');
    setOperationModeFilter('全部');
    setAdoptionFilter('全部');
    setCurrentPage(1);
    setExpandedPrimaryCategories(new Set(taxonomy.map((category) => category.label)));
  };

  return (
    <main
      className="app-shell library-shell"
      style={{
        '--bg-image': `url(${backgroundUrl})`,
        '--library-accent': accentColor,
        '--library-accent-rgb': accentRgb,
        '--library-contrast': contrastColor,
      }}
    >
      <section className="library-page">
        <header className="library-hero">
          <button className="library-back" onClick={onBack}>
            <ArrowLeft size={18} aria-hidden="true" />
            返回首页
          </button>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          {description ? <p>{description}</p> : null}
        </header>

        <section className="library-metrics" aria-label={`${resourceName} 资源概览`}>
          <div>
            <span>{resources.length}</span>
            <p>{metricResourceLabel}</p>
          </div>
          <div>
            <span>{companyCount}</span>
            <p>{metricCompanyLabel}</p>
          </div>
          <div>
            <span>{thirdMetricValue}</span>
            <p>{metricThirdLabel}</p>
          </div>
          <div>
            <span>{fourthMetricValue}</span>
            <p>{metricFourthLabel}</p>
          </div>
        </section>

        <section className={showCategoryTree ? 'library-layout' : 'library-layout library-layout-no-tree'}>
          {showCategoryTree ? (
          <aside className="category-tree" aria-label={`${resourceName} 分类树`}>
            <div className="tree-header">
              <h2>资源浏览</h2>
              <div className="tree-actions">
                <button onClick={resetFilters}>
                  <RotateCcw size={15} aria-hidden="true" />
                  重置
                </button>
              </div>
            </div>
            <section className="tree-section">
              <button className="tree-section-toggle" onClick={() => setIsCategorySectionOpen((open) => !open)}>
                <span>
                  {isCategorySectionOpen ? (
                    <ChevronDown size={16} aria-hidden="true" />
                  ) : (
                    <ChevronRight size={16} aria-hidden="true" />
                  )}
                  {resourceName} 分类
                </span>
                <span className="tree-toggle-meta">
                  <strong>{taxonomy.length}</strong>
                  <em>{isCategorySectionOpen ? '收起' : '展开'}</em>
                </span>
              </button>

              {!isCategorySectionOpen ? (
                <div className="tree-collapsed-selection" aria-live="polite">
                  <span>当前选择</span>
                  <strong>{selectedCategorySummary}</strong>
                </div>
              ) : null}

              {isCategorySectionOpen && (
                <div className="tree-section-body">
                  {taxonomy.map((category) => {
                    const isExpanded = expandedPrimaryCategories.has(category.label);

                    return (
                      <div className="tree-group" key={category.id}>
                        <button
                          className={activePrimary === category.label && activeSecondary === '全部' ? 'tree-primary active' : 'tree-primary'}
                          onClick={() => handlePrimaryToggle(category.label)}
                          aria-expanded={isExpanded}
                        >
                          <span className="tree-primary-label">
                            {isExpanded ? (
                              <ChevronDown size={15} aria-hidden="true" />
                            ) : (
                              <ChevronRight size={15} aria-hidden="true" />
                            )}
                            <span>{category.label}</span>
                          </span>
                          <strong>{categoryCounts[category.label] || 0}</strong>
                        </button>
                        {isExpanded && (
                          <div className="tree-children">
                            {category.items.map((item) => (
                              <button
                                key={`${category.id}-${item}`}
                                className={activePrimary === category.label && activeSecondary === item ? 'tree-child active' : 'tree-child'}
                                onClick={() => handleSecondarySelect(category.label, item)}
                              >
                                <span>{item}</span>
                                <em>{categoryCounts[`${category.label}::${item}`] || 0}</em>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="tree-section">
              <button className="tree-section-toggle" onClick={() => setIsCompanySectionOpen((open) => !open)}>
                <span>
                  {isCompanySectionOpen ? (
                    <ChevronDown size={16} aria-hidden="true" />
                  ) : (
                    <ChevronRight size={16} aria-hidden="true" />
                  )}
                  公司分类
                </span>
                <span className="tree-toggle-meta">
                  <strong>{companyCount}</strong>
                  <em>{isCompanySectionOpen ? '收起' : '展开'}</em>
                </span>
              </button>

              {!isCompanySectionOpen ? (
                <div className="tree-collapsed-selection" aria-live="polite">
                  <span>当前选择</span>
                  <strong>{selectedCompanySummary}</strong>
                </div>
              ) : null}

              {isCompanySectionOpen && (
                <div className="tree-section-body">
                  {filterOptions.companies.filter((company) => company !== '全部').map((company) => (
                    <button
                      key={company}
                      className={companyFilter === company ? 'tree-primary active' : 'tree-primary'}
                      onClick={() => {
                        setCompanyFilter(company);
                        setCurrentPage(1);
                      }}
                    >
                      <span>{company}</span>
                      <strong>{companyCounts[company] || 0}</strong>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </aside>
          ) : null}

          <div className="library-content">
            <section className="library-toolbar" aria-label={`${resourceName} 资源筛选`}>
              <label className="search-box">
                <Search size={18} aria-hidden="true" />
                <input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder={searchPlaceholder}
                />
              </label>

              <div className="filter-row">
                <label className="filter-field">
                  <span>厂商</span>
                  <select
                    value={companyFilter}
                    onChange={(event) => {
                      setCompanyFilter(event.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    {filterOptions.companies.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <label className="filter-field">
                  <span>地区</span>
                  <select
                    value={regionFilter}
                    onChange={(event) => {
                      setRegionFilter(event.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    {filterOptions.regions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
                {showToolTypeFilter ? (
                  <label className="filter-field">
                    <span>{toolTypeFilterLabel}</span>
                    <select
                      value={toolTypeFilter}
                      onChange={(event) => {
                        setToolTypeFilter(event.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      {filterOptions.toolTypes.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                ) : null}
                {filterOptions.operationModes.length > 1 ? (
                  <label className="filter-field">
                    <span>{operationModeFilterLabel}</span>
                    <select
                      value={operationModeFilter}
                      onChange={(event) => {
                        setOperationModeFilter(event.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      {filterOptions.operationModes.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                ) : null}
                <label className="filter-field">
                  <span>公开案例</span>
                  <select
                    value={adoptionFilter}
                    onChange={(event) => {
                      setAdoptionFilter(event.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option>全部</option>
                    <option>有公开案例</option>
                  </select>
                </label>
                <button className="reset-filter" onClick={resetFilters}>
                  <RotateCcw size={16} aria-hidden="true" />
                  重置
                </button>
              </div>
              {filterOptions.supports.length > 1 ? (
                <section className="support-filter-panel" aria-label={supportPanelTitle || `按${supportFilterLabel}检索`}>
                  <div className="support-filter-head">
                    <Sparkles size={16} aria-hidden="true" />
                    <span>{supportPanelTitle || `按${supportFilterLabel}检索`}</span>
                  </div>
                  <div className="support-filter-list">
                    {filterOptions.supports.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={supportFilter === option ? 'support-filter-chip active' : 'support-filter-chip'}
                        onClick={() => {
                          setSupportFilter(option);
                          setCurrentPage(1);
                        }}
                      >
                        {option === '全部' ? `全部${supportFilterLabel}` : option}
                      </button>
                    ))}
                  </div>
                </section>
              ) : null}
            </section>

            <div className="result-summary">
              <p>
                当前浏览：<strong>{selectedCategoryLabel}</strong>
              </p>
              <div className="result-tools" aria-label="结果视图">
                <span>{filteredResources.length} 条结果</span>
                <button
                  className={viewMode === 'card' ? 'view-toggle active' : 'view-toggle'}
                  onClick={() => setViewMode('card')}
                  aria-label="卡片视图"
                >
                  <Grid2X2 size={16} aria-hidden="true" />
                </button>
                <button
                  className={viewMode === 'list' ? 'view-toggle active' : 'view-toggle'}
                  onClick={() => setViewMode('list')}
                  aria-label="列表视图"
                >
                  <List size={17} aria-hidden="true" />
                </button>
                <select
                  aria-label="排序方式"
                  value={sortMode}
                  onChange={(event) => {
                    setSortMode(event.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="default">默认排序</option>
                  <option value="company">按公司</option>
                  <option value="stage">按阶段</option>
                </select>
              </div>
            </div>

            <section
              className={viewMode === 'list' ? 'resource-grid resource-grid-list' : 'resource-grid'}
              aria-label={`${resourceName} 资源列表`}
            >
              {paginatedResources.map((resource) => {
                const detailPath = getInternalDetailPath(resource);
                const sourceUrl = getResourceSourceUrl(resource);
                const isIpResource = isIpDictionaryResource(resource);
                const resourceDisplayName = getResourceDisplayName(resource);
                const adoptionCaseCount = resource.adoptionCases?.length || 0;
                const MainElement = detailPath ? 'a' : 'button';
                const mainProps = detailPath
                  ? {
                      href: detailPath,
                      'aria-label': `打开${resourceDisplayName}内部详情页`,
                    }
                  : {
                      type: 'button',
                      onClick: () => setSelectedResource(resource),
                      'aria-label': `查看${resourceDisplayName}详情`,
                    };

                return (
                  <article
                    key={`${resource.company}-${resource.tool}-${resource.secondaryCategory}`}
                    className={adoptionCaseCount > 0 ? 'resource-card has-adoption-cases' : 'resource-card'}
                  >
                    <MainElement className="resource-card-main" {...mainProps}>
                      <div className="resource-card-head">
                        <div className="resource-visual">
                          {getResourceVisual(resource) ? (
                            <img
                              src={getResourceVisual(resource)}
                              alt={`${resource.company} 图标`}
                              onError={(event) => {
                                event.currentTarget.style.display = 'none';
                                event.currentTarget.nextElementSibling.hidden = false;
                              }}
                            />
                          ) : null}
                          <span className="resource-visual-fallback" hidden={Boolean(getResourceVisual(resource))}>
                            {getCompanyInitials(resource.company)}
                          </span>
                        </div>
                        <div className="resource-title-block">
                          <p className="resource-company">{isIpResource ? resource.fullName : resource.company}</p>
                          <h2>{resource.tool}</h2>
                          {adoptionCaseCount > 0 ? (
                            <span className="public-case-badge">公开案例 {adoptionCaseCount}</span>
                          ) : null}
                          <div className="resource-chip-row">
                            {getResourceChips(resource).map((chip) => (
                              <span key={chip}>{chip}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="resource-browse-profile" aria-label={`${resource.tool}产品信息`}>
                        <p>
                          <Sparkles size={14} aria-hidden="true" />
                          <strong>{isIpResource ? 'IP 简介：' : '产品简介：'}</strong>
                          {resource.summary}
                        </p>
                        <p>
                          <Workflow size={14} aria-hidden="true" />
                          <strong>{isIpResource ? '核心功能：' : '典型应用：'}</strong>
                          {isIpResource ? resource.detail : getApplicationText(resource)}
                        </p>
                        <p>
                          <Workflow size={14} aria-hidden="true" />
                          <strong>{isIpResource ? '应用领域：' : '适用阶段：'}</strong>
                          {isIpResource ? resource.applicationDomains : getStageFlow(resource).join(' → ')}
                        </p>
                        {isIpResource && (
                          <p>
                            <Bookmark size={14} aria-hidden="true" />
                            <strong>代表厂商：</strong>
                            {getVendorPreview(resource)}
                          </p>
                        )}
                      </div>
                    </MainElement>
                    <div className="resource-card-footer">
                      {detailPath ? (
                        <a href={detailPath}>
                          <BookOpen size={14} aria-hidden="true" />
                          详情
                        </a>
                      ) : (
                        <button type="button" onClick={() => setSelectedResource(resource)}>
                          <BookOpen size={14} aria-hidden="true" />
                          详情
                        </button>
                      )}
                      {sourceUrl ? (
                        <a href={sourceUrl} target="_blank" rel="noreferrer">
                          <Download size={14} aria-hidden="true" />
                          官网
                        </a>
                      ) : (
                        <span>
                          <Download size={14} aria-hidden="true" />
                          待补充
                        </span>
                      )}
                      <span>
                        <Bookmark size={14} aria-hidden="true" />
                        收藏
                      </span>
                    </div>
                  </article>
                );
              })}
            </section>

            {filteredResources.length > 0 && (
              <nav className="resource-pagination" aria-label={`${resourceName} 资源分页`}>
                <button
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentSafePage === 1}
                >
                  上一页
                </button>
                <div className="page-number-list">
                  {paginationItems.map((item) =>
                    typeof item === 'number' ? (
                      <button
                        key={item}
                        className={item === currentSafePage ? 'active' : ''}
                        onClick={() => setCurrentPage(item)}
                        aria-current={item === currentSafePage ? 'page' : undefined}
                      >
                        {item}
                      </button>
                    ) : (
                      <span key={item}>...</span>
                    ),
                  )}
                </div>
                <button
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentSafePage === totalPages}
                >
                  下一页
                </button>
                <span className="page-size-note">
                  每页 {RESULTS_PAGE_SIZE} 个 · 第 {currentSafePage}/{totalPages} 页
                </span>
              </nav>
            )}

            {filteredResources.length === 0 && (
              <section className="empty-state">
                <h2>{resources.length === 0 ? '厂商数据待录入' : '暂无匹配资源'}</h2>
                <p>
                  {resources.length === 0
                    ? '当前页面已预留地区筛选与支撑能力检索，具体代工厂条目可在下一阶段继续录入。'
                    : '可以换一个关键词，或重置左侧分类与筛选条件继续浏览。'}
                </p>
              </section>
            )}
          </div>
        </section>
      </section>

      {selectedResource && (
        <div className="resource-modal" role="dialog" aria-modal="true" aria-label={`${selectedResource.tool}详情`}>
          <div className="modal-panel">
            <button className="modal-close" onClick={() => setSelectedResource(null)} aria-label="关闭详情">
              <X size={20} aria-hidden="true" />
            </button>
            <p className="eyebrow">{selectedResource.primaryCategory} / {selectedResource.secondaryCategory}</p>
            <h2>{selectedResource.tool}</h2>
            <p className="modal-company">{selectedResource.fullName || selectedResource.company}</p>
            <div className="resource-visual modal-visual">
              {getResourceVisual(selectedResource) ? (
                <img
                  src={getResourceVisual(selectedResource)}
                  alt={`${selectedResource.company} 图标`}
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                    event.currentTarget.nextElementSibling.hidden = false;
                  }}
                />
              ) : null}
              <span className="resource-visual-fallback" hidden={Boolean(getResourceVisual(selectedResource))}>
                {getCompanyInitials(selectedResource.company)}
              </span>
            </div>
            <p>{selectedResource.detail}</p>
            <dl>
              <div>
                <dt>{isIpDictionaryResource(selectedResource) ? '典型应用' : '适用阶段'}</dt>
                <dd>{selectedResource.exampleApplications || selectedResource.stage}</dd>
              </div>
              <div>
                <dt>{isIpDictionaryResource(selectedResource) ? '应用领域' : '来源类型'}</dt>
                <dd>{selectedResource.applicationDomains || selectedResource.region}</dd>
              </div>
              <div>
                <dt>二级分类</dt>
                <dd>{selectedResource.secondaryCategory}</dd>
              </div>
              {isIpDictionaryResource(selectedResource) && (
                <>
                  <div>
                    <dt>关键规格参数</dt>
                    <dd>{selectedResource.specs}</dd>
                  </div>
                  <div>
                    <dt>代表厂商</dt>
                    <dd>{selectedResource.vendors}</dd>
                  </div>
                  <div>
                    <dt>备注</dt>
                    <dd>{selectedResource.note}</dd>
                  </div>
                </>
              )}
            </dl>
            <div className="resource-tags">
              {selectedResource.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            {getResourceDetailSections(selectedResource).length > 0 && (
              <div className="modal-detail-sections">
                {getResourceDetailSections(selectedResource).map((section) => (
                  <section key={section.title} className="modal-detail-section">
                    <h3>{section.title}</h3>
                    <p>{section.body}</p>
                  </section>
                ))}
              </div>
            )}
            {getResourceSourceUrl(selectedResource) && (
              <a className="source-link" href={getResourceSourceUrl(selectedResource)} target="_blank" rel="noreferrer">
                官网来源
              </a>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function ResourceDetailPage({ config, resource }) {
  const {
    resourceName,
    accentColor,
    accentRgb,
    contrastColor,
    title,
    detailBasePath,
  } = config;
  const sourceUrl = resource ? getResourceSourceUrl(resource) : null;
  const visual = resource ? getResourceVisual(resource) : null;
  const detailSections = resource ? getResourceDetailSections(resource) : [];
  const isIpDetail = detailBasePath === 'ip';
  const isFoundryDetail = detailBasePath === 'foundry' || resourceName === 'Foundry';
  const ipMarketSections = resource && isIpDetail ? getIpMarketSections(resource) : [];
  const companyPath = resource && !isFoundryDetail ? `#/company/${getCompanySlug(resource.company)}` : null;
  const productFlow = resource ? getProductFlow(resource) : { steps: [], activeIndex: 0 };
  const adoptionCases = resource?.adoptionCases || [];

  const renderContactPanel = () => (
    <section className="detail-panel product-contact-panel">
      <p className="eyebrow">CONTACT</p>
      <h2>联系方式</h2>
      <div className="product-contact-list">
        {productContactItems.map((item) => {
          const Icon = item.icon;

          return (
            <div className="product-contact-row" key={item.label}>
              <Icon size={16} aria-hidden="true" />
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          );
        })}
      </div>
      <div className="follow-us-block">
        <p>Follow Us</p>
        <div className="follow-channel-list">
          {productFollowChannels.map((channel) => (
            <button
              type="button"
              className="follow-channel"
              key={channel.label}
              title={channel.label}
              data-label={channel.label}
              aria-label={`${channel.label}入口待补充`}
            >
              <BrandIcon name={channel.icon} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <main
      className="app-shell library-shell"
      style={{
        '--bg-image': `url(${backgroundUrl})`,
        '--library-accent': accentColor,
        '--library-accent-rgb': accentRgb,
        '--library-contrast': contrastColor,
      }}
    >
      <section className="resource-detail-page">
        <a className="library-back detail-back" href={`#/${detailBasePath}`}>
          <ArrowLeft size={18} aria-hidden="true" />
          返回 {title}
        </a>

        {!resource ? (
          <section className="empty-state detail-empty">
            <p className="eyebrow">{resourceName} DETAIL</p>
            <h1>{isFoundryDetail ? '未找到厂商' : '未找到产品'}</h1>
            <p>这个条目可能已经被调整。可以返回资源库后重新选择。</p>
          </section>
        ) : (
          <>
            <header className={isIpDetail ? 'product-detail-hero ip-product-hero' : 'product-detail-hero'}>
              <div className="product-logo-stack">
                {companyPath ? (
                  <a
                    className="product-logo-card company-entry-link"
                    href={companyPath}
                    aria-label={`查看${resource.company}厂商详情`}
                  >
                    {visual ? (
                      <img src={visual} alt={`${resource.company} 图标`} />
                    ) : (
                      <span className="resource-visual-fallback">{getCompanyInitials(resource.company)}</span>
                    )}
                  </a>
                ) : (
                  <div className="product-logo-card">
                    {visual ? (
                      <img src={visual} alt={`${resource.company} 图标`} />
                    ) : (
                      <span className="resource-visual-fallback">{getCompanyInitials(resource.company)}</span>
                    )}
                  </div>
                )}
                {companyPath ? (
                  <span className="company-logo-hint">点击logo进入厂商详细页</span>
                ) : null}
              </div>
              <div className="product-detail-title">
                <p className="eyebrow">
                  {isFoundryDetail ? 'FOUNDRY COMPANY DETAIL' : isIpDetail ? 'IP PRODUCT PROFILE' : `${resourceName} PRODUCT DETAIL`}
                </p>
                <p className="resource-company">{resource.company}</p>
                <h1>{resource.tool}</h1>
                <div className="resource-chip-row">
                  {getResourceChips(resource).map((chip) => (
                    <span key={chip}>{chip}</span>
                  ))}
                </div>
              </div>
              <div className="detail-actions">
                {sourceUrl ? (
                  <a className="source-link" href={sourceUrl} target="_blank" rel="noreferrer">
                    {isIpDetail ? '官网 / 来源' : '官网详情'}
                  </a>
                ) : (
                  <span className="source-link disabled-link">官网待补充</span>
                )}
                {resource.materialUrl ? (
                  <a className="source-link" href={resource.materialUrl} target="_blank" rel="noreferrer">
                    产品资料
                  </a>
                ) : null}
              </div>
            </header>

            {isIpDetail ? (
              <section className="detail-layout ip-detail-layout">
                <article className="detail-panel detail-main-panel ip-market-panel">
                  <p className="eyebrow">IP PRODUCT DATASHEET</p>
                  <h2>产品详情</h2>
                  <p>{resource.summary}</p>
                  <div className="ip-market-section-grid">
                    {ipMarketSections.map((section) => (
                      <section key={section.title} className="ip-market-section">
                        <h3>{section.title}</h3>
                        {section.title === '规格' ? (
                          <div className="ip-specification-table" aria-label={`${resource.tool}规格信息`}>
                            <h4>身份信息</h4>
                            <dl>
                              {getIpSpecificationRows(resource).map((row) => (
                                <div key={row.label}>
                                  <dt>{row.label}</dt>
                                  <dd>{row.value}</dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        ) : (
                          <p>{section.body}</p>
                        )}
                      </section>
                    ))}
                  </div>
                </article>

                <aside className="detail-side">
                  <section className="detail-panel">
                    <p className="eyebrow">CLASSIFICATION</p>
                    <h2>分类信息</h2>
                    <dl className="detail-meta">
                      <div>
                        <dt>一级分类</dt>
                        <dd>{resource.primaryCategory}</dd>
                      </div>
                      <div>
                        <dt>二级分类</dt>
                        <dd>{resource.secondaryCategory}</dd>
                      </div>
                      <div>
                        <dt>应用阶段</dt>
                        <dd>{resource.stage}</dd>
                      </div>
                    </dl>
                  </section>

                  <section className="detail-panel">
                    <p className="eyebrow">TAGS</p>
                    <h2>能力标签</h2>
                    <div className="resource-tags">
                      {resource.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </section>

                  <section className="detail-panel">
                    <p className="eyebrow">MATERIALS</p>
                    <h2>下载产品信息</h2>
                    {resource.materialUrl ? (
                      <a className="source-link" href={resource.materialUrl} target="_blank" rel="noreferrer">
                        下载资料
                      </a>
                    ) : (
                      <p className="material-note">产品信息文件整理上传后，可在此下载。当前可先通过官网来源查看公开资料。</p>
                    )}
                  </section>

                  {renderContactPanel()}
                </aside>
              </section>
            ) : (
              <section className="detail-layout">
                <article className="detail-panel detail-main-panel">
                  {!isFoundryDetail ? (
                    <section className="product-flow-panel" aria-label={`${resource.tool}产品流程位置`}>
                      <div className="product-flow-heading">
                        <p className="eyebrow">FLOW POSITION</p>
                        <h2>产品流程位置</h2>
                      </div>
                      <div className="product-flow-track">
                        {productFlow.steps.map((step, index) => {
                          const state = index < productFlow.activeIndex ? 'past' : index === productFlow.activeIndex ? 'active' : 'future';

                          return (
                            <div key={step} className={`product-flow-step ${state}`}>
                              <span className="flow-dot" aria-hidden="true" />
                              <strong>{step}</strong>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  ) : null}
                  <p className="eyebrow">OVERVIEW</p>
                  <h2>{isFoundryDetail ? '厂商说明' : '产品说明'}</h2>
                  <p>{resource.summary}</p>
                  <div className="detail-section-grid">
                    {detailSections.map((section) => (
                      <section key={section.title} className="detail-section">
                        <h3>{section.title}</h3>
                        <p>{section.body}</p>
                      </section>
                    ))}
                  </div>
                  {!isFoundryDetail && adoptionCases.length > 0 ? (
                    <section className="adoption-case-panel" aria-label={`${resource.tool}公开采用案例`}>
                      <div className="adoption-case-heading">
                        <p className="eyebrow">PUBLIC ADOPTION</p>
                        <h2>公开采用案例</h2>
                      </div>
                      <div className="adoption-case-list">
                        {adoptionCases.map((item) => (
                          <article className="adoption-case-card" key={`${item.company}-${item.sourceTitle}`}>
                            <div className="adoption-case-title">
                              <strong>{item.company}</strong>
                              <span>{item.accuracy}</span>
                            </div>
                            <dl className="adoption-case-meta">
                              <div>
                                <dt>芯片类型</dt>
                                <dd>{item.chipType || '未公开披露'}</dd>
                              </div>
                              <div>
                                <dt>证据类型</dt>
                                <dd>{item.evidenceType}</dd>
                              </div>
                              <div>
                                <dt>公开时间</dt>
                                <dd>{item.publishedAt}</dd>
                              </div>
                            </dl>
                            <p>{item.note}</p>
                            <a className="source-link adoption-source-link" href={item.sourceUrl} target="_blank" rel="noreferrer">
                              查看出处
                            </a>
                          </article>
                        ))}
                      </div>
                    </section>
                  ) : null}
                  {isFoundryDetail ? (
                    <>
                      <section className="foundry-node-panel" aria-label={`${resource.tool}制程节点`}>
                        <div>
                          <p className="eyebrow">PROCESS NODES</p>
                          <h2>制程节点</h2>
                        </div>
                        <div className="foundry-node-list">
                          {resource.processNodes.map((node) => (
                            <span key={node}>{node}</span>
                          ))}
                        </div>
                      </section>
                      <section className="foundry-relation-grid" aria-label={`${resource.tool}供应链关系`}>
                        <div className="foundry-relation-card">
                          <p className="eyebrow">SUPPLIERS</p>
                          <h3>主要供应商/上游依赖</h3>
                          <div className="foundry-relation-list">
                            {resource.suppliers.map((item) => {
                              const relation = getRelationParts(item);

                              return (
                                <div className="foundry-relation-item" key={item}>
                                  <span className="relation-dot" aria-hidden="true" />
                                  <div>
                                    <strong>{relation.name}</strong>
                                    {relation.description ? <span>{relation.description}</span> : null}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="foundry-relation-card">
                          <p className="eyebrow">CUSTOMERS</p>
                          <h3>主要客户/下游关系</h3>
                          <div className="foundry-relation-list">
                            {resource.customers.map((item) => {
                              const relation = getRelationParts(item);

                              return (
                                <div className="foundry-relation-item" key={item}>
                                  <span className="relation-dot" aria-hidden="true" />
                                  <div>
                                    <strong>{relation.name}</strong>
                                    {relation.description ? <span>{relation.description}</span> : null}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </section>
                    </>
                  ) : null}
                </article>

                <aside className="detail-side">
                  <section className="detail-panel">
                    <p className="eyebrow">CLASSIFICATION</p>
                    <h2>{isFoundryDetail ? '厂商画像' : '分类与流程'}</h2>
                    <dl className="detail-meta">
                      {isFoundryDetail ? (
                        <>
                          <div>
                            <dt>股票代码</dt>
                            <dd>{resource.ticker || '待补充'}</dd>
                          </div>
                          <div>
                            <dt>验证状态</dt>
                            <dd>{resource.verification || '待核验'}</dd>
                          </div>
                          <div>
                            <dt>供应链层级</dt>
                            <dd>{resource.segment || resource.primaryCategory}</dd>
                          </div>
                        </>
                      ) : null}
                      <div>
                        <dt>一级分类</dt>
                        <dd>{resource.primaryCategory}</dd>
                      </div>
                      <div>
                        <dt>二级分类</dt>
                        <dd>{resource.secondaryCategory}</dd>
                      </div>
                      <div>
                        <dt>适用阶段</dt>
                        <dd>{resource.stage}</dd>
                      </div>
                      <div>
                        <dt>来源地区</dt>
                        <dd>{resource.region}</dd>
                      </div>
                      {isFoundryDetail ? (
                        <>
                          <div>
                            <dt>运营模式</dt>
                            <dd>{resource.operationMode}</dd>
                          </div>
                          <div>
                            <dt>总部</dt>
                            <dd>{resource.headquarters}</dd>
                          </div>
                          <div>
                            <dt>成立时间</dt>
                            <dd>{resource.founded}</dd>
                          </div>
                        </>
                      ) : null}
                    </dl>
                  </section>

                  <section className="detail-panel">
                    <p className="eyebrow">TAGS</p>
                    <h2>能力标签</h2>
                    <div className="resource-tags">
                      {resource.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </section>

                  {!isFoundryDetail ? (
                    <section className="detail-panel">
                      <p className="eyebrow">MATERIALS</p>
                      <h2>下载产品信息</h2>
                      {resource.materialUrl ? (
                        <a className="source-link" href={resource.materialUrl} target="_blank" rel="noreferrer">
                          下载资料
                        </a>
                      ) : (
                        <p className="material-note">产品信息文件整理上传后，可在此下载。</p>
                      )}
                    </section>
                  ) : null}

                  {renderContactPanel()}
                </aside>
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}

function CompanyDetailPage({ company }) {
  const resources = company ? getCompanyResources(company) : [];
  const preferredLibraryKey = resources.some((resource) => getResourceLibraryKey(resource) === 'ip') ? 'ip' : 'eda';
  const preferredLibraryConfig = libraryConfigs[preferredLibraryKey];
  const visual = company ? companyVisuals[company] : null;
  const sourceUrl = company ? companySourceUrls[company] : null;
  const categoryCount = new Set(resources.map((resource) => resource.primaryCategory)).size;
  const stageCount = new Set(resources.map((resource) => resource.stage)).size;

  return (
    <main
      className="app-shell library-shell"
      style={{
        '--bg-image': `url(${backgroundUrl})`,
        '--library-accent': preferredLibraryConfig.accentColor,
        '--library-accent-rgb': preferredLibraryConfig.accentRgb,
        '--library-contrast': preferredLibraryConfig.contrastColor,
      }}
    >
      <section className="resource-detail-page company-detail-page">
        <a className="library-back detail-back" href={`#/${preferredLibraryKey}`}>
          <ArrowLeft size={18} aria-hidden="true" />
          返回 {preferredLibraryConfig.title}
        </a>

        {!company ? (
          <section className="empty-state detail-empty">
            <p className="eyebrow">COMPANY DETAIL</p>
            <h1>未找到厂商</h1>
            <p>这个厂商条目可能还没有被收录，可以返回资源库后重新选择。</p>
          </section>
        ) : (
          <>
            <header className="product-detail-hero company-detail-hero">
              <div className="product-logo-card company-logo-card">
                {visual ? (
                  <img src={visual} alt={`${company} 图标`} />
                ) : (
                  <span className="resource-visual-fallback">{getCompanyInitials(company)}</span>
                )}
              </div>
              <div className="product-detail-title">
                <p className="eyebrow">COMPANY PROFILE</p>
                <p className="resource-company">{preferredLibraryConfig.resourceName} 厂商信息</p>
                <h1>{company}</h1>
                <p className="company-profile-copy">
                  {companyDescriptions[company] || '厂商简介待补充，当前页面先聚合已收录产品与分类覆盖。'}
                </p>
              </div>
              <div className="detail-actions">
                {sourceUrl ? (
                  <a className="source-link" href={sourceUrl} target="_blank" rel="noreferrer">
                    厂商官网
                  </a>
                ) : (
                  <span className="source-link disabled-link">官网待补充</span>
                )}
              </div>
            </header>

            <section className="library-metrics company-metrics" aria-label={`${company}厂商概览`}>
              <div>
                <span>{resources.length}</span>
                <p>已收录产品</p>
              </div>
              <div>
                <span>{categoryCount}</span>
                <p>覆盖一级分类</p>
              </div>
              <div>
                <span>{stageCount}</span>
                <p>覆盖应用阶段</p>
              </div>
              <div>
                <span>{sourceUrl ? '1' : '0'}</span>
                <p>官网入口</p>
              </div>
            </section>

            <section className="detail-panel company-products-panel">
              <p className="eyebrow">COLLECTED PRODUCTS</p>
              <h2>已收录产品</h2>
              {resources.length > 0 ? (
                <div className="company-product-list">
                  {resources.map((resource) => (
                    <a
                      key={`${resource.company}-${resource.tool}-${resource.secondaryCategory}`}
                      className="company-product-row"
                      href={`#/${getResourceLibraryKey(resource)}/product/${getResourceSlug(resource)}`}
                    >
                      <span>
                        <strong>{resource.tool}</strong>
                        <em>{resource.summary}</em>
                      </span>
                      <span>{resource.primaryCategory}</span>
                      <span>{resource.stage}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="company-profile-copy">暂无已收录产品。</p>
              )}
            </section>
          </>
        )}
      </section>
    </main>
  );
}

function EdaLibrary({ onBack }) {
  return <ResourceLibrary onBack={onBack} config={libraryConfigs.eda} />;
}

function IpLibrary({ onBack }) {
  return <ResourceLibrary onBack={onBack} config={libraryConfigs.ip} />;
}

function FoundryLibrary({ onBack }) {
  return <ResourceLibrary onBack={onBack} config={libraryConfigs.foundry} />;
}

function formatNumber(value, digits = 2) {
  return Number(value).toFixed(digits);
}

function calculateChipArea(values) {
  const params = processLibrary[values.foundry].nodes[values.node];
  const profile = chipProfiles[values.chipType];
  const gatesM = Number(values.gatesM) || 0;
  const sramMbit = Number(values.sramMbit) || 0;
  const nvmMbit = Number(values.nvmMbit) || 0;
  const ioCount = Number(values.ioCount) || 0;
  const utilizationPct = Math.max(1, Number(values.utilization) || 0);
  const hardMacroArea = Number(values.hardMacroArea) || 0;
  const routingOverheadPct = Number(values.routingOverhead) || 0;
  const edgeArea = Number(values.edgeArea) || 0;
  const utilization = utilizationPct / 100;
  const logicArea = gatesM / (params.gateDensityM * utilization);
  const sramArea = sramMbit / params.sramDensity;
  const nvmArea = nvmMbit > 0 ? nvmMbit / params.nvmDensity : 0;
  const ioBaseArea = ioCount * (params.ioPitchUm / 1000) * (params.padDepthUm / 1000);
  const ioArea = ioBaseArea * profile.ioMultiplier;
  const memoryArea = sramArea + nvmArea;
  const baseArea = logicArea + memoryArea + ioArea + hardMacroArea;
  const routingArea = baseArea * (routingOverheadPct / 100) * profile.overheadBias;
  const totalArea = baseArea + routingArea + edgeArea;

  return {
    params,
    profile,
    inputs: { gatesM, sramMbit, nvmMbit, ioCount, utilizationPct, hardMacroArea, routingOverheadPct, edgeArea, utilization },
    logicArea,
    memoryArea,
    ioArea,
    hardMacroArea,
    routingArea,
    edgeArea,
    totalArea,
    lower: totalArea * (1 - profile.rangeMinus),
    upper: totalArea * (1 + profile.rangePlus),
  };
}

const diePerWaferPresets = {
  advanced: {
    waferDiameterMm: 300,
    dieWidthMm: 8,
    dieHeightMm: 10,
    scribeLineUm: 80,
    edgeExclusionMm: 3,
    defectDensity: 0.12,
    yieldModel: 'negative-binomial',
    clusteringFactor: 3,
  },
  mature: {
    waferDiameterMm: 200,
    dieWidthMm: 4,
    dieHeightMm: 4,
    scribeLineUm: 90,
    edgeExclusionMm: 2,
    defectDensity: 0.25,
    yieldModel: 'poisson',
    clusteringFactor: 3,
  },
  largeSoc: {
    waferDiameterMm: 300,
    dieWidthMm: 18,
    dieHeightMm: 22,
    scribeLineUm: 100,
    edgeExclusionMm: 3,
    defectDensity: 0.08,
    yieldModel: 'negative-binomial',
    clusteringFactor: 2,
  },
};

const diePerWaferDefaultValues = diePerWaferPresets.advanced;

function calculateDiePerWafer(values) {
  const waferDiameterMm = Math.max(1, Number(values.waferDiameterMm) || 0);
  const dieWidthMm = Math.max(0.001, Number(values.dieWidthMm) || 0);
  const dieHeightMm = Math.max(0.001, Number(values.dieHeightMm) || 0);
  const scribeLineUm = Math.max(0, Number(values.scribeLineUm) || 0);
  const edgeExclusionMm = Math.max(0, Number(values.edgeExclusionMm) || 0);
  const defectDensity = Math.max(0, Number(values.defectDensity) || 0);
  const clusteringFactor = Math.max(0.1, Number(values.clusteringFactor) || 1);
  const usableDiameterMm = Math.max(1, waferDiameterMm - edgeExclusionMm * 2);
  const effectiveDieWidthMm = dieWidthMm + scribeLineUm / 1000;
  const effectiveDieHeightMm = dieHeightMm + scribeLineUm / 1000;
  const bareDieAreaMm2 = dieWidthMm * dieHeightMm;
  const streetedDieAreaMm2 = effectiveDieWidthMm * effectiveDieHeightMm;
  const waferAreaMm2 = Math.PI * (usableDiameterMm / 2) ** 2;
  const idealAreaDies = waferAreaMm2 / streetedDieAreaMm2;
  const edgeLossDies = Math.PI * usableDiameterMm / Math.sqrt(2 * streetedDieAreaMm2);
  const grossDies = Math.max(0, Math.floor(idealAreaDies - edgeLossDies));
  const grossUtilization = waferAreaMm2 > 0 ? (grossDies * streetedDieAreaMm2) / waferAreaMm2 : 0;
  const bareDieAreaCm2 = bareDieAreaMm2 / 100;
  const poissonYield = Math.exp(-defectDensity * bareDieAreaCm2);
  const negativeBinomialYield = (1 + (defectDensity * bareDieAreaCm2) / clusteringFactor) ** (-clusteringFactor);
  const yieldRate = values.yieldModel === 'poisson' ? poissonYield : negativeBinomialYield;
  const goodDies = Math.floor(grossDies * yieldRate);
  const edgeExclusionAreaMm2 = Math.PI * (waferDiameterMm / 2) ** 2 - waferAreaMm2;
  const streetOverheadMm2 = streetedDieAreaMm2 - bareDieAreaMm2;

  return {
    inputs: {
      waferDiameterMm,
      dieWidthMm,
      dieHeightMm,
      scribeLineUm,
      edgeExclusionMm,
      defectDensity,
      clusteringFactor,
      yieldModel: values.yieldModel,
    },
    usableDiameterMm,
    effectiveDieWidthMm,
    effectiveDieHeightMm,
    bareDieAreaMm2,
    streetedDieAreaMm2,
    waferAreaMm2,
    idealAreaDies,
    edgeLossDies,
    grossDies,
    grossUtilization,
    poissonYield,
    negativeBinomialYield,
    yieldRate,
    goodDies,
    edgeExclusionAreaMm2,
    streetOverheadMm2,
  };
}

const bondingPackagePresets = {
  qfn32: {
    label: 'QFN 5×5mm / 32L / 0.50mm pitch',
    packageWidthMm: 5,
    packageHeightMm: 5,
    packagePins: 32,
    dieWidthUm: 2400,
    dieHeightUm: 2400,
  },
  qfn48: {
    label: 'QFN 7×7mm / 48L / 0.50mm pitch',
    packageWidthMm: 7,
    packageHeightMm: 7,
    packagePins: 48,
    dieWidthUm: 3200,
    dieHeightUm: 3200,
  },
  qfn64: {
    label: 'QFN 9×9mm / 64L / 0.50mm pitch',
    packageWidthMm: 9,
    packageHeightMm: 9,
    packagePins: 64,
    dieWidthUm: 4200,
    dieHeightUm: 4200,
  },
};

const bondingDefaultValues = bondingPackagePresets.qfn48;

const bondingSampleNetlist = `pin,pad,net,side
1,PAD_VDD1,VDD,top
2,PAD_GPIO0,GPIO0,top
3,PAD_GPIO1,GPIO1,top
4,PAD_RSTN,RSTN,top
12,PAD_CLK,CLK,right
13,PAD_SDA,I2C_SDA,right
14,PAD_SCL,I2C_SCL,right
24,PAD_VSS1,VSS,bottom
25,PAD_ADC0,ADC0,bottom
26,PAD_ADC1,ADC1,bottom
36,PAD_TXD,UART_TX,left
37,PAD_RXD,UART_RX,left
38,PAD_VDDIO,VDDIO,left`;

function getPackagePinSide(pin, packagePins) {
  const pinsPerSide = Math.ceil(packagePins / 4);
  if (pin <= pinsPerSide) return 'top';
  if (pin <= pinsPerSide * 2) return 'right';
  if (pin <= pinsPerSide * 3) return 'bottom';
  return 'left';
}

function parseBondingNetlist(rawNetlist, packagePins) {
  const lines = rawNetlist
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));

  if (lines.length === 0) {
    return { rows: [], warnings: ['Netlist 为空：请粘贴 CSV 内容，或点击“载入示例”。'] };
  }

  const separator = lines[0].includes('\t') ? '\t' : lines[0].includes(';') ? ';' : ',';
  const firstCells = lines[0].split(separator).map((cell) => cell.trim().toLowerCase());
  const hasHeader = firstCells.some((cell) => ['pin', 'package_pin', 'pad', 'die_pad', 'net', 'side'].includes(cell));
  const headers = hasHeader ? firstCells : ['pin', 'pad', 'net', 'side'];
  const dataLines = hasHeader ? lines.slice(1) : lines;
  const sideNames = new Set(['top', 'right', 'bottom', 'left']);
  const warnings = [];

  const rows = dataLines.map((line, index) => {
    const cells = line.split(separator).map((cell) => cell.trim());
    const getCell = (names, fallbackIndex) => {
      const headerIndex = names.map((name) => headers.indexOf(name)).find((cellIndex) => cellIndex >= 0);
      return cells[headerIndex ?? fallbackIndex] || '';
    };
    const pin = Number.parseInt(getCell(['pin', 'package_pin'], 0), 10);
    const pad = getCell(['pad', 'die_pad'], 1) || `PAD_${index + 1}`;
    const net = getCell(['net', 'signal'], 2) || 'NC';
    const rawSide = getCell(['side', 'edge'], 3).toLowerCase();
    const side = sideNames.has(rawSide) ? rawSide : getPackagePinSide(pin || index + 1, packagePins);

    if (!Number.isFinite(pin) || pin < 1 || pin > packagePins) {
      warnings.push(`第 ${index + 1} 行 pin 超出范围，已跳过：${line}`);
      return null;
    }

    return { id: `${pin}-${pad}-${index}`, pin, pad, net, side };
  }).filter(Boolean);

  const duplicatePins = rows
    .map((row) => row.pin)
    .filter((pin, index, pins) => pins.indexOf(pin) !== index);

  if (duplicatePins.length > 0) {
    warnings.push(`发现重复 package pin：${Array.from(new Set(duplicatePins)).join(', ')}。`);
  }

  return { rows, warnings };
}

function pointForPackagePin(pin, packagePins, rect) {
  const pinsPerSide = Math.ceil(packagePins / 4);
  const side = getPackagePinSide(pin, packagePins);
  const localIndex = side === 'top' ? pin - 1
    : side === 'right' ? pin - pinsPerSide - 1
      : side === 'bottom' ? pin - pinsPerSide * 2 - 1
        : pin - pinsPerSide * 3 - 1;
  const slots = side === 'top' || side === 'bottom' ? Math.min(pinsPerSide, packagePins) : pinsPerSide;
  const ratio = slots <= 1 ? 0.5 : (localIndex + 0.5) / slots;

  if (side === 'top') return { x: rect.x + rect.w * ratio, y: rect.y, side };
  if (side === 'right') return { x: rect.x + rect.w, y: rect.y + rect.h * ratio, side };
  if (side === 'bottom') return { x: rect.x + rect.w * (1 - ratio), y: rect.y + rect.h, side };
  return { x: rect.x, y: rect.y + rect.h * (1 - ratio), side };
}

function pointForDiePad(row, sideRows, dieRect) {
  const rowsOnSide = sideRows[row.side] || [];
  const localIndex = Math.max(0, rowsOnSide.findIndex((item) => item.id === row.id));
  const ratio = rowsOnSide.length <= 1 ? 0.5 : (localIndex + 0.5) / rowsOnSide.length;

  if (row.side === 'top') return { x: dieRect.x + dieRect.w * ratio, y: dieRect.y };
  if (row.side === 'right') return { x: dieRect.x + dieRect.w, y: dieRect.y + dieRect.h * ratio };
  if (row.side === 'bottom') return { x: dieRect.x + dieRect.w * (1 - ratio), y: dieRect.y + dieRect.h };
  return { x: dieRect.x, y: dieRect.y + dieRect.h * (1 - ratio) };
}

function makeBondingGeometry(values, rows) {
  const packageWidthMm = Math.max(1, Number(values.packageWidthMm) || 1);
  const packageHeightMm = Math.max(1, Number(values.packageHeightMm) || 1);
  const packagePins = Math.max(4, Number(values.packagePins) || 4);
  const dieWidthMm = Math.max(0.1, Number(values.dieWidthUm) / 1000 || 0.1);
  const dieHeightMm = Math.max(0.1, Number(values.dieHeightUm) / 1000 || 0.1);
  const packageRect = { x: 72, y: 72, w: 576, h: 576 };
  const dieScale = Math.min(packageRect.w * 0.68 / packageWidthMm, packageRect.h * 0.68 / packageHeightMm);
  const dieRect = {
    w: Math.max(108, Math.min(390, dieWidthMm * dieScale)),
    h: Math.max(108, Math.min(390, dieHeightMm * dieScale)),
  };
  dieRect.x = 360 - dieRect.w / 2;
  dieRect.y = 360 - dieRect.h / 2;

  const sideRows = rows.reduce((groups, row) => {
    groups[row.side] = [...(groups[row.side] || []), row];
    return groups;
  }, {});

  const pins = Array.from({ length: packagePins }, (_, index) => {
    const pin = index + 1;
    return { pin, ...pointForPackagePin(pin, packagePins, packageRect) };
  });

  const bonds = rows.map((row) => {
    const packagePoint = pointForPackagePin(row.pin, packagePins, packageRect);
    const diePoint = pointForDiePad(row, sideRows, dieRect);
    const dx = packagePoint.x - diePoint.x;
    const dy = packagePoint.y - diePoint.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const netName = row.net.toUpperCase();
    const netType = netName.includes('VDD') || netName.includes('PWR') ? 'power'
      : netName.includes('VSS') || netName.includes('GND') ? 'ground'
        : 'signal';
    return { ...row, packagePoint, diePoint, length, netType };
  });

  const averageWireLength = bonds.length > 0
    ? bonds.reduce((sum, bond) => sum + bond.length, 0) / bonds.length
    : 0;

  return {
    packagePins,
    packageRect,
    dieRect,
    pins,
    bonds,
    activePins: new Set(rows.map((row) => row.pin)),
    dieToPackageRatio: (dieWidthMm * dieHeightMm) / (packageWidthMm * packageHeightMm),
    averageWireLength,
  };
}

const assistantQuickQuestions = [
  'EDA、IP、PDK 分别是什么？',
  'Fabless 企业如何使用产业资源？',
  '芯片设计流程一般包括哪些阶段？',
];

const formatNewsDate = (date) =>
  new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(`${date}T00:00:00`));

function NewsVisual({ news }) {
  if (news.imageUrl) {
    return (
      <img
        src={news.imageUrl}
        alt={news.imageAlt}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div className={`news-visual-abstract ${news.visual || 'chip'}`} style={{ '--news-bg': `url(${backgroundUrl})` }}>
      <span className="news-visual-grid" aria-hidden="true" />
      {news.brandLabels ? (
        <span className="news-brand-pair" aria-label={news.imageAlt}>
          {news.brandLabels.map((label) => (
            <strong key={label}>{label}</strong>
          ))}
        </span>
      ) : (
        <span className="news-chip-symbol" aria-label={news.imageAlt}>
          <Microchip size={44} strokeWidth={1.35} />
        </span>
      )}
    </div>
  );
}

function IndustryNewsSection() {
  return (
    <section className="industry-news-section" id="industry-news" aria-labelledby="industry-news-title">
      <div className="industry-news-head">
        <div>
          <p className="eyebrow">INDUSTRY NEWS</p>
          <h2 id="industry-news-title">行业新闻</h2>
        </div>
        <div>
          <p>2026 年 5 月 1 日至 5 月 24 日的集成电路产业动态，先以静态内容预览，后续可持续更新。</p>
          <a className="industry-news-more" href="#/news">
            进入新闻目录
            <ChevronRight size={15} strokeWidth={1.9} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="industry-news-grid">
        {industryNews.map((news) => (
          <a className="industry-news-card" href={news.route} key={news.id}>
            <div className="industry-news-image">
              <NewsVisual news={news} />
              <span className="industry-news-source">{news.categoryLabel}</span>
            </div>
            <div className="industry-news-body">
              <div className="industry-news-meta">
                <time dateTime={news.date}>{formatNewsDate(news.date)}</time>
                <span>{news.tags[0]}</span>
              </div>
              <h3>{news.title}</h3>
              <p>{news.summary}</p>
              <div className="industry-news-tags" aria-label="新闻标签">
                {news.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="industry-news-footer">
                <small>{news.imageCredit}</small>
                <span>
                  阅读详情
                  <ChevronRight size={15} strokeWidth={1.9} aria-hidden="true" />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function IndustryNewsDirectoryPage() {
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('date-desc');
  const [searchTerm, setSearchTerm] = useState('');
  const filteredNews = useMemo(
    () => getIndustryNewsDirectory({ category, sort, search: searchTerm }),
    [category, sort, searchTerm],
  );

  return (
    <main className="app-shell news-page" style={{ '--bg-image': `url(${backgroundUrl})` }}>
      <section className="news-directory">
        <button className="back-button" type="button" onClick={() => { window.location.hash = ''; }}>
          <ArrowLeft size={18} aria-hidden="true" />
          返回首页
        </button>

        <div className="news-directory-hero">
          <div>
            <p className="eyebrow">INDUSTRY NEWS DIRECTORY</p>
            <h1>行业新闻目录</h1>
            <p>按日期、浏览量和产业分类筛选近期集成电路新闻，点击条目进入详细解读页面。</p>
          </div>
          <div className="news-directory-count">
            <strong>{filteredNews.length}</strong>
            <span>条结果</span>
          </div>
        </div>

        <div className="news-filter-panel" aria-label="行业新闻筛选">
          <label className="news-search-field">
            <Search size={16} strokeWidth={1.9} aria-hidden="true" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="搜索标题、来源、标签"
            />
          </label>
          <label className="news-sort-field">
            <span>排序</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              {industryNewsSortOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="news-category-tabs" aria-label="新闻分类">
          {industryNewsCategories.map((item) => (
            <button
              className={category === item.id ? 'active' : ''}
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="news-directory-list">
          {filteredNews.map((news) => (
            <a className="news-directory-item" href={news.route} key={news.id}>
              <div className="news-directory-copy">
                <div className="news-directory-meta">
                  <time dateTime={news.date}>{formatNewsDate(news.date)}</time>
                  <span>{news.categoryLabel}</span>
                  <span>{news.views.toLocaleString('zh-CN')} 浏览</span>
                </div>
                <h2>{news.title}</h2>
                <p>{news.summary}</p>
                <div className="industry-news-tags" aria-label="新闻标签">
                  {news.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <ChevronRight className="news-directory-arrow" size={20} strokeWidth={1.8} aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

function NewsDetailPage({ news }) {
  if (!news) {
    return (
      <main className="app-shell news-page" style={{ '--bg-image': `url(${backgroundUrl})` }}>
        <section className="resource-placeholder">
          <button className="back-button" type="button" onClick={() => { window.location.hash = '#/news'; }}>
            <ArrowLeft size={18} aria-hidden="true" />
            返回新闻目录
          </button>
          <p className="eyebrow">NEWS DETAIL</p>
          <h1>未找到新闻</h1>
          <p className="placeholder-copy">该新闻条目不存在或已被移除。</p>
        </section>
      </main>
    );
  }

  const relatedNews = industryNews
    .filter((item) => item.id !== news.id && (item.category === news.category || item.tags.some((tag) => news.tags.includes(tag))))
    .slice(0, 3);
  const relatedNewsIds = new Set(relatedNews.map((item) => item.id));
  const fallbackNews = [
    ...relatedNews,
    ...industryNews.filter((item) => item.id !== news.id && !relatedNewsIds.has(item.id)),
  ].slice(0, 3);

  return (
    <main className="app-shell news-page" style={{ '--bg-image': `url(${backgroundUrl})` }}>
      <article className="news-detail">
        <button className="back-button" type="button" onClick={() => { window.location.hash = '#/news'; }}>
          <ArrowLeft size={18} aria-hidden="true" />
          返回新闻目录
        </button>

        <header className="news-detail-hero">
          <div className="news-detail-copy">
            <p className="eyebrow">INDUSTRY NEWS DETAIL</p>
            <div className="news-directory-meta">
              <time dateTime={news.date}>{formatNewsDate(news.date)}</time>
              <span>{news.categoryLabel}</span>
              <span>{news.views.toLocaleString('zh-CN')} 浏览</span>
            </div>
            <h1>{news.title}</h1>
            <div className="industry-news-tags" aria-label="新闻标签">
              {news.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
          <div className="news-detail-visual">
            <NewsVisual news={news} />
          </div>
        </header>

        <div className="news-detail-layout">
          <div className="news-detail-body">
            {news.content.map((section) => (
              <section className="news-detail-section" key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
          <aside className="news-detail-side">
            <section className="news-side-module">
              <h2>相关厂商</h2>
              <div className="news-related-companies">
                {(news.relatedCompanies || []).map((company) => (
                  <span key={company}>{company}</span>
                ))}
              </div>
            </section>
            <section className="news-side-module">
              <h2>其他新闻</h2>
              <div className="news-related-list">
                {fallbackNews.map((item) => (
                  <a href={item.route} key={item.id}>
                    <strong>{item.title}</strong>
                    <span>{formatNewsDate(item.date)} · {item.categoryLabel}</span>
                  </a>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </article>
    </main>
  );
}

function HomeAssistantEntry() {
  return (
    <button
      className="assistant-entry-card"
      type="button"
      onClick={() => {
        window.location.hash = '#/assistant';
      }}
      aria-label="进入IC问答助手"
    >
      <span className="assistant-entry-orbit" aria-hidden="true">
        <span className="assistant-entry-core">
          <Microchip size={27} strokeWidth={1.55} />
        </span>
        <Sparkles className="assistant-entry-spark" size={17} strokeWidth={1.8} />
      </span>
      <span className="assistant-entry-copy">
        <strong>IC问答助手</strong>
        <span>AI for chip</span>
      </span>
      <ChevronRight size={18} strokeWidth={1.8} aria-hidden="true" />
    </button>
  );
}

function AssistantPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const inputLimit = 500;

  const sendQuestion = async (rawQuestion) => {
    const question = rawQuestion.trim();
    if (!question || isSending) return;

    const userMessage = { role: 'user', content: question };
    const nextMessages = [...messages, userMessage].slice(-6);
    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setInput('');
    setError('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.error || '助手暂时无法连接');
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        { role: 'assistant', content: payload.answer || '助手没有返回有效内容。' },
      ].slice(-8));
    } catch (requestError) {
      setError(requestError.message || '助手暂时无法连接');
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendQuestion(input);
  };

  const hasMessages = messages.length > 0;

  return (
    <main className="app-shell assistant-shell" style={{ '--bg-image': `url(${backgroundUrl})` }}>
      <header className="assistant-hero">
        <button
          className="back-button"
          type="button"
          onClick={() => {
            window.location.hash = '';
          }}
        >
          <ArrowLeft size={18} aria-hidden="true" />
          返回首页
        </button>
        <div className="assistant-title">
          <span className="assistant-title-mark" aria-hidden="true">
            <Microchip size={32} strokeWidth={1.5} />
          </span>
          <div>
            <p className="eyebrow">IC INDUSTRY ASSISTANT</p>
            <h1>IC问答助手</h1>
            <p>{isSending ? '正在生成回答' : '通用模型问答，暂未接入产业库检索'}</p>
          </div>
        </div>
      </header>

      <section className="assistant-workspace" aria-label="IC问答助手对话区">
        <div className="assistant-thread" aria-live="polite">
          {!hasMessages && (
            <div className="assistant-empty">
              <Sparkles size={28} strokeWidth={1.6} aria-hidden="true" />
              <h2>从一个产业问题开始</h2>
              <p>适合快速解释概念、梳理芯片设计流程、准备调研提纲。当前阶段不读取产业库数据库。</p>
              <div className="assistant-quick-grid">
                {assistantQuickQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => sendQuestion(question)}
                    disabled={isSending}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <article key={`${message.role}-${index}`} className={`assistant-message ${message.role}`}>
              <span>{message.role === 'user' ? '你' : '助手'}</span>
              <p>{message.content}</p>
            </article>
          ))}

          {isSending && (
            <article className="assistant-message assistant loading">
              <span>助手</span>
              <p>正在思考...</p>
            </article>
          )}

          {error && (
            <article className="assistant-message error">
              <span>提示</span>
              <p>{error}</p>
            </article>
          )}
        </div>

        <form className="assistant-input-bar" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="assistant-input">输入问题</label>
          <input
            id="assistant-input"
            value={input}
            maxLength={inputLimit}
            onChange={(event) => setInput(event.target.value)}
            placeholder="输入你的产业问题..."
            disabled={isSending}
          />
          <span>{input.length}/{inputLimit}</span>
          <button type="submit" disabled={!input.trim() || isSending}>
            <Send size={16} aria-hidden="true" />
            发送
          </button>
          <button
            type="button"
            className="assistant-clear"
            disabled={!hasMessages || isSending}
            onClick={() => {
              setMessages([]);
              setError('');
            }}
            aria-label="清空对话"
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </form>
      </section>
    </main>
  );
}

function OnlineToolPreview({ toolId }) {
  if (toolId === 'chip-area-calculator') {
    return (
      <svg viewBox="0 0 96 72" role="img" aria-label="芯片面积估算器预览">
        <rect className="preview-chip" x="20" y="12" width="56" height="46" rx="6" />
        {Array.from({ length: 7 }, (_, index) => (
          <g key={index}>
            <line x1="12" y1={18 + index * 6} x2="20" y2={18 + index * 6} />
            <line x1="76" y1={18 + index * 6} x2="84" y2={18 + index * 6} />
          </g>
        ))}
        {[
          ['逻辑', 28, 21, 23, 10],
          ['SRAM', 28, 36, 17, 12],
          ['IO', 50, 36, 16, 12],
        ].map(([label, x, y, width, height]) => (
          <g key={label}>
            <rect className="preview-chip-block" x={x} y={y} width={width} height={height} rx="2" />
            <text x={x + width / 2} y={y + height / 2 + 2} textAnchor="middle">{label}</text>
          </g>
        ))}
      </svg>
    );
  }

  if (toolId === 'die-per-wafer-calculator') {
    return (
      <svg viewBox="0 0 96 72" role="img" aria-label="晶圆芯片数量计算器预览">
        <circle className="preview-wafer" cx="48" cy="36" r="27" />
        {Array.from({ length: 7 }, (_, row) => (
          <g key={row}>
            {Array.from({ length: 9 }, (_, column) => {
              const x = 21 + column * 6;
              const y = 15 + row * 6;
              const inside = (x + 2 - 48) ** 2 + (y + 2 - 36) ** 2 < 25 ** 2;
              return inside ? <rect key={column} className="preview-die-cell" x={x} y={y} width="4" height="4" rx="0.8" /> : null;
            })}
          </g>
        ))}
        <path className="preview-scan" d="M22 46 C38 58 58 57 75 44" />
      </svg>
    );
  }

  if (toolId === 'bonding-diagram-tool') {
    return (
      <svg viewBox="0 0 96 72" role="img" aria-label="键合图生成器预览">
        <rect className="preview-package" x="15" y="8" width="66" height="56" rx="6" />
        <rect className="preview-die" x="35" y="24" width="26" height="24" rx="3" />
        {[
          [26, 8, 38, 24],
          [42, 8, 45, 24],
          [58, 8, 52, 24],
          [81, 24, 61, 31],
          [81, 44, 61, 42],
          [23, 64, 39, 48],
          [53, 64, 51, 48],
          [15, 31, 35, 35],
        ].map(([x1, y1, x2, y2], index) => (
          <path key={index} className={index < 2 ? 'preview-bond power' : 'preview-bond'} d={`M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 - 5} ${x2} ${y2}`} />
        ))}
      </svg>
    );
  }

  return <Calculator size={24} strokeWidth={1.7} />;
}

function OnlineToolsPage() {
  return (
    <main className="app-shell tools-shell" style={{ '--bg-image': `url(${backgroundUrl})` }}>
      <header className="library-hero tools-hero" style={{ '--library-accent': '#8bffcf', '--library-accent-rgb': '139 255 207' }}>
        <a className="back-button" href="#">
          <ArrowLeft size={18} aria-hidden="true" />
          返回首页
        </a>
        <div className="library-hero-copy">
          <p className="eyebrow">ONLINE TOOLS</p>
          <h1>在线工具</h1>
          <p>集中放置芯片设计、制造、封装、成本和供应链相关的小工具。当前先上线芯片面积估算器，其他工具保留入口，后续逐步补齐。</p>
        </div>
        <div className="library-hero-mark" aria-hidden="true">
          <Calculator size={58} strokeWidth={1.4} />
        </div>
      </header>

      <section className="tools-directory" aria-label="在线工具目录">
        {onlineTools.map((tool) => {
          const isReady = tool.status === '已上线';
          const card = (
            <article className={`tool-directory-card ${isReady ? 'ready' : 'reserved'}`}>
              <div className={isReady ? 'tool-directory-preview' : 'tool-directory-icon'} aria-hidden="true">
                <OnlineToolPreview toolId={tool.id} />
              </div>
              <div>
                <span className="tool-source">{tool.source}</span>
                <h2>{tool.title}</h2>
                <p>{tool.summary}</p>
              </div>
              <strong>{tool.status}</strong>
            </article>
          );

          return isReady ? (
            <a key={tool.id} className="tool-directory-link" href={tool.route}>
              {card}
            </a>
          ) : (
            <div key={tool.id} className="tool-directory-link tool-directory-disabled" aria-disabled="true">
              {card}
            </div>
          );
        })}
      </section>
    </main>
  );
}

function ChipAreaCalculator() {
  const [preset, setPreset] = useState('rp2040');
  const [values, setValues] = useState(chipAreaDefaultValues);
  const locked = preset !== 'custom';
  const availableNodes = Object.keys(processLibrary[values.foundry].nodes);
  const result = useMemo(() => calculateChipArea(values), [values]);
  const bars = [
    ['逻辑', result.logicArea],
    ['存储', result.memoryArea],
    ['IO', result.ioArea],
    ['硬宏', result.hardMacroArea],
    ['布线开销', result.routingArea],
    ['封边', result.edgeArea],
  ];

  const updateValue = (key, nextValue) => {
    setPreset('custom');
    setValues((current) => {
      if (key === 'foundry') {
        const nextNodes = processLibrary[nextValue].nodes;
        return { ...current, foundry: nextValue, node: nextNodes[current.node] ? current.node : Object.keys(nextNodes)[0] };
      }
      return { ...current, [key]: nextValue };
    });
  };

  const applyPreset = (nextPreset) => {
    setPreset(nextPreset);
    if (chipAreaPresets[nextPreset]) {
      setValues(chipAreaPresets[nextPreset]);
    }
  };

  return (
    <main className="app-shell tools-shell" style={{ '--bg-image': `url(${backgroundUrl})` }}>
      <header className="library-hero tools-hero" style={{ '--library-accent': '#8bffcf', '--library-accent-rgb': '139 255 207' }}>
        <a className="back-button" href="#" onClick={() => { window.location.hash = ''; }}>
          <ArrowLeft size={18} aria-hidden="true" />
          返回工具目录
        </a>
        <div className="library-hero-copy">
          <p className="eyebrow">ONLINE TOOL</p>
          <h1>芯片面积估算器</h1>
          <p>用于早期规格讨论的工程估算工具，把面积拆成逻辑、SRAM、NVM、IO、模拟/PHY、版图开销和封边开销，并根据芯片类型给出区间。</p>
        </div>
        <div className="library-hero-mark" aria-hidden="true">
          <Calculator size={58} strokeWidth={1.4} />
        </div>
      </header>

      <section className="tool-layout" aria-label="芯片面积估算器">
        <form className="tool-panel tool-inputs" onSubmit={(event) => event.preventDefault()}>
          <div className="tool-panel-head">
            <h2>输入参数</h2>
            <p>先选一个预设做 sanity check，再切到自定义修改。非自定义预设会锁定输入，避免误改参考参数。</p>
          </div>

          <div className="tool-field-grid">
            <label className="tool-field">
              <span>预设芯片</span>
              <select value={preset} onChange={(event) => applyPreset(event.target.value)}>
                <option value="custom">自定义</option>
                <option value="rp2040">RP2040</option>
                <option value="esp32">ESP32</option>
                <option value="stm32f103">STM32F103C8</option>
                <option value="digital-asic">中等规模纯数字 ASIC</option>
              </select>
            </label>
            <label className="tool-field">
              <span>芯片类型</span>
              <select value={values.chipType} disabled={locked} onChange={(event) => updateValue('chipType', event.target.value)}>
                {Object.entries(chipProfiles).map(([key, profile]) => (
                  <option key={key} value={key}>{profile.label}</option>
                ))}
              </select>
            </label>
            <label className="tool-field">
              <span>代工厂</span>
              <select value={values.foundry} disabled={locked} onChange={(event) => updateValue('foundry', event.target.value)}>
                {Object.entries(processLibrary).map(([key, foundry]) => (
                  <option key={key} value={key}>{foundry.label}</option>
                ))}
              </select>
            </label>
            <label className="tool-field">
              <span>工艺节点</span>
              <select value={values.node} disabled={locked} onChange={(event) => updateValue('node', event.target.value)}>
                {availableNodes.map((nodeName) => (
                  <option key={nodeName} value={nodeName}>{nodeName}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="tool-field-grid tool-field-grid-three">
            {[
              ['gatesM', '门数量 (M gates)', '0.1'],
              ['sramMbit', 'SRAM (Mbit)', '0.01'],
              ['nvmMbit', 'NVM / Flash (Mbit)', '0.01'],
              ['ioCount', 'IO 数量', '1'],
              ['utilization', '利用率 (%)', '1'],
              ['hardMacroArea', '模拟 / PHY 宏面积 (mm²)', '0.01'],
              ['routingOverhead', '版图与布线开销 (%)', '1'],
              ['edgeArea', '封边 / 测试 / Keepout (mm²)', '0.01'],
            ].map(([key, label, step]) => (
              <label className="tool-field" key={key}>
                <span>{label}</span>
                <input
                  type="number"
                  min="0"
                  step={step}
                  value={values[key]}
                  disabled={locked}
                  onChange={(event) => updateValue(key, event.target.value)}
                />
              </label>
            ))}
          </div>

          <p className="tool-note">建议：小 MCU、带 USB / ADC / PLL 的芯片，不要把模拟 / PHY 宏面积留在 0。纯数字 ASIC 才比较接近“门数 + SRAM + IO”这种简化模型。</p>

          <div className="tool-actions">
            <button type="button" className="tool-primary" onClick={() => setPreset('custom')}>进入自定义</button>
            <button type="button" className="tool-secondary" onClick={() => applyPreset('rp2040')}>恢复默认</button>
          </div>
        </form>

        <section className="tool-panel tool-results">
          <div className="tool-score-card">
            <span>Estimated Die Area</span>
            <strong>{formatNumber(result.totalArea, 2)} mm²</strong>
            <p>建议把这类芯片看成 {formatNumber(result.lower, 2)} - {formatNumber(result.upper, 2)} mm² 的区间，而不是单点。</p>
          </div>

          <div className="tool-metric-grid">
            {[
              ['核心逻辑面积', result.logicArea, '基于百万门、门密度和利用率计算。'],
              ['SRAM + NVM 面积', result.memoryArea, 'SRAM 和非易失存储分别按不同密度估算。'],
              ['IO / Pad Ring 面积', result.ioArea, '由 IO 数、pad pitch 和 pad depth 推导。'],
              ['模拟 / PHY / 其他硬宏', result.hardMacroArea, '把 ADC、PLL、USB、RF、PMU 等显式计入。'],
              ['布线 / Floorplan 开销', result.routingArea, '由基础面积、版图布线开销比例和芯片类型修正共同推导。'],
              ['封边 / 测试保留面积', result.edgeArea, '对应 seal ring、keepout、测试与边缘保留区域。'],
            ].map(([label, value, meta]) => (
              <div className="tool-metric" key={label}>
                <span>{label}</span>
                <strong>{formatNumber(value, 2)}</strong>
                <p>{meta}</p>
              </div>
            ))}
          </div>

          <div className="tool-breakdown">
            <h2>面积拆分</h2>
            {bars.map(([label, value]) => {
              const pct = result.totalArea > 0 ? (value / result.totalArea) * 100 : 0;
              return (
                <div className="tool-bar-row" key={label}>
                  <span>{label}</span>
                  <div className="tool-bar-track"><div style={{ width: `${pct}%` }} /></div>
                  <em>{formatNumber(pct, 1)}%</em>
                </div>
              );
            })}
          </div>

          <div className="tool-formula">
            <div>
              <span className="status-pill">置信度: {result.profile.confidence}</span>
              <p>{result.profile.note} 当前工艺参数采用经验库和公开口径，真正 tape-out 前仍需用 memory compiler、pad library、硬宏 datasheet 和 floorplan 复核。</p>
            </div>
            <code>
              {`Die Area = (Logic + SRAM + NVM + IO + Hard Macros) × (1 + Routing Overhead × ${formatNumber(result.profile.overheadBias, 2)}) + Edge Area\nLogic = ${result.inputs.gatesM}M / (${result.params.gateDensityM}M gates/mm² × ${formatNumber(result.inputs.utilization, 2)})\nSRAM = ${formatNumber(result.inputs.sramMbit, 2)} / ${result.params.sramDensity} | NVM = ${formatNumber(result.inputs.nvmMbit, 2)} / ${result.params.nvmDensity}\nIO = ${result.inputs.ioCount} × ${result.params.ioPitchUm}µm × ${result.params.padDepthUm}µm × ${formatNumber(result.profile.ioMultiplier, 2)}`}
            </code>
          </div>
        </section>
      </section>
    </main>
  );
}

function DiePerWaferCalculator() {
  const [preset, setPreset] = useState('advanced');
  const [values, setValues] = useState(diePerWaferDefaultValues);
  const result = useMemo(() => calculateDiePerWafer(values), [values]);

  const updateValue = (key, nextValue) => {
    setPreset('custom');
    setValues((current) => ({ ...current, [key]: nextValue }));
  };

  const applyPreset = (nextPreset) => {
    setPreset(nextPreset);
    if (diePerWaferPresets[nextPreset]) {
      setValues(diePerWaferPresets[nextPreset]);
    }
  };

  const utilizationPct = result.grossUtilization * 100;
  const yieldPct = result.yieldRate * 100;

  return (
    <main className="app-shell tools-shell" style={{ '--bg-image': `url(${backgroundUrl})` }}>
      <header className="library-hero tools-hero" style={{ '--library-accent': '#8bffcf', '--library-accent-rgb': '139 255 207' }}>
        <a className="back-button" href="#/tools">
          <ArrowLeft size={18} aria-hidden="true" />
          返回工具目录
        </a>
        <div className="library-hero-copy">
          <p className="eyebrow">ONLINE TOOL</p>
          <h1>晶圆芯片数量计算器</h1>
          <p>用于 wafer start、MPW、成本测算和早期 die size 讨论。输入晶圆直径、芯片尺寸、切割道、边缘排除和缺陷密度，估算每片晶圆可切割的总芯片数量与可用良品数量。</p>
        </div>
        <div className="library-hero-mark" aria-hidden="true">
          <Calculator size={58} strokeWidth={1.4} />
        </div>
      </header>

      <section className="tool-layout" aria-label="晶圆芯片数量计算器">
        <form className="tool-panel tool-inputs" onSubmit={(event) => event.preventDefault()}>
          <div className="tool-panel-head">
            <h2>输入参数</h2>
            <p>公式参考公开 DPW 估算口径，并加入切割道、边缘排除与良率模型。结果适合早期估算，不替代 foundry 排版、mask data 或真实 wafer map 计算。</p>
          </div>

          <div className="tool-field-grid">
            <label className="tool-field">
              <span>预设场景</span>
              <select value={preset} onChange={(event) => applyPreset(event.target.value)}>
                <option value="custom">自定义</option>
                <option value="advanced">300mm 先进制程中等 die</option>
                <option value="mature">200mm 成熟制程小 die</option>
                <option value="largeSoc">300mm 大型 SoC</option>
              </select>
            </label>
            <label className="tool-field">
              <span>良率模型</span>
              <select value={values.yieldModel} onChange={(event) => updateValue('yieldModel', event.target.value)}>
                <option value="negative-binomial">Negative Binomial</option>
                <option value="poisson">Poisson</option>
              </select>
            </label>
          </div>

          <div className="tool-field-grid tool-field-grid-three">
            {[
              ['waferDiameterMm', '晶圆直径 (mm)', '1', '常见为 150 / 200 / 300mm。'],
              ['dieWidthMm', '芯片宽度 (mm)', '0.01', '裸 die 的 X 方向尺寸，不含切割道。'],
              ['dieHeightMm', '芯片高度 (mm)', '0.01', '裸 die 的 Y 方向尺寸，不含切割道。'],
              ['scribeLineUm', 'Scribe line (µm)', '1', 'die 之间的切割道/划片道宽度，会计入有效 die pitch。'],
              ['edgeExclusionMm', '边缘排除 (mm)', '0.1', '晶圆边缘不能有效放置 die 或良率较低的保留环。'],
              ['defectDensity', '缺陷密度 D0 (/cm²)', '0.01', '用于 good die 估算；不知道时可先填 0 只看 gross DPW。'],
              ['clusteringFactor', '聚集因子 α', '0.1', 'Negative Binomial 模型使用，数值越大越接近 Poisson。'],
            ].map(([key, label, step, hint]) => (
              <label className="tool-field" key={key}>
                <span>{label}</span>
                <input
                  type="number"
                  min="0"
                  step={step}
                  value={values[key]}
                  onChange={(event) => updateValue(key, event.target.value)}
                />
                <em>{hint}</em>
              </label>
            ))}
          </div>

          <p className="tool-note">使用建议：估算晶圆可切割芯片总数时重点看芯片 pitch、边缘排除和切割道；估算良品数量时还要谨慎选择缺陷密度和良率模型。先进制程、大面积 SoC、模拟/RF 产品通常需要更保守的良率假设。</p>

          <div className="tool-actions">
            <button type="button" className="tool-primary" onClick={() => setPreset('custom')}>进入自定义</button>
            <button type="button" className="tool-secondary" onClick={() => applyPreset('advanced')}>恢复默认</button>
          </div>
        </form>

        <section className="tool-panel tool-results">
          <figure className="tool-wafer-visual">
            <img src={waferDieCalculatorUrl} alt="彩色晶圆与芯片矩阵示意图" />
            <figcaption>
              <strong>晶圆排布示意</strong>
              <span>圆形晶圆上排布矩形芯片，边缘区域会产生无法完整放置芯片的几何损失。</span>
            </figcaption>
          </figure>

          <div className="tool-score-card">
            <span>每片晶圆可切割芯片总数</span>
            <strong>{result.grossDies}</strong>
            <p>按可用晶圆面积与边缘修正估算。若计入当前良率模型，预计可用良品数量约为 {result.goodDies} 颗。</p>
          </div>

          <div className="tool-metric-grid">
            {[
              ['每片晶圆良品数', result.goodDies, `当前模型良率 ${formatNumber(yieldPct, 1)}%。`],
              ['裸芯片面积', `${formatNumber(result.bareDieAreaMm2, 2)} mm²`, '仅芯片宽度 × 芯片高度，不含切割道。'],
              ['有效芯片 pitch 面积', `${formatNumber(result.streetedDieAreaMm2, 2)} mm²`, '计入切割道后用于 DPW 排布估算。'],
              ['可用晶圆直径', `${formatNumber(result.usableDiameterMm, 2)} mm`, 'wafer diameter - 2 × edge exclusion。'],
              ['面积法理论上限', formatNumber(result.idealAreaDies, 1), '只按面积相除，不考虑圆形边缘损失。'],
              ['边缘损失估计', formatNumber(result.edgeLossDies, 1), '圆形晶圆边缘不能完整放置矩形 die 的修正量。'],
              ['Gross 利用率', `${formatNumber(utilizationPct, 1)}%`, 'gross dies × effective die area / usable wafer area。'],
              ['Edge exclusion 面积', `${formatNumber(result.edgeExclusionAreaMm2, 1)} mm²`, '从完整晶圆中排除的外圈面积。'],
              ['Scribe 额外面积 / die', `${formatNumber(result.streetOverheadMm2, 3)} mm²`, '每颗 die 因切割道带来的 pitch 面积增加。'],
            ].map(([label, value, meta]) => (
              <div className="tool-metric" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
                <p>{meta}</p>
              </div>
            ))}
          </div>

          <div className="tool-breakdown">
            <h2>关键比例</h2>
            {[
              ['晶圆面积利用率', utilizationPct],
              ['良率估算', yieldPct],
              ['边缘损失 / 理论上限', result.idealAreaDies > 0 ? (result.edgeLossDies / result.idealAreaDies) * 100 : 0],
              ['切割道开销 / 裸芯片面积', result.bareDieAreaMm2 > 0 ? (result.streetOverheadMm2 / result.bareDieAreaMm2) * 100 : 0],
            ].map(([label, pct]) => (
              <div className="tool-bar-row" key={label}>
                <span>{label}</span>
                <div className="tool-bar-track"><div style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} /></div>
                <em>{formatNumber(pct, 1)}%</em>
              </div>
            ))}
          </div>

          <div className="tool-formula">
            <div>
              <span className="status-pill">说明</span>
              <p>晶圆芯片总数主要回答“一片晶圆几何上能放多少颗 die”；良品数量才接近“电性测试后大约有多少颗好 die”。实际量产还会受到 reticle size、scribe test structure、晶圆缺陷分布、edge yield、PCM、binning、测试策略和封装良率影响。</p>
            </div>
            <code>
              {`Effective die width = Die width + Scribe line / 1000
Effective die height = Die height + Scribe line / 1000
Usable wafer diameter = Wafer diameter - 2 × Edge exclusion
Gross DPW ≈ floor(Wafer area / Effective die area - π × Usable wafer diameter / sqrt(2 × Effective die area))
Poisson yield = exp(-D0 × Bare die area cm²)
Negative binomial yield = (1 + D0 × Bare die area cm² / α)^(-α)
Good DPW = floor(Gross DPW × Yield)`}
            </code>
          </div>

          <div className="tool-explainer">
            <h2>参数解释、公式口径与使用边界</h2>
            <ul>
              <li><strong>计算目标：</strong>先估算每片晶圆几何上能切出的芯片总数，再根据缺陷密度估算可用良品数，适合早期成本、MPW 与 wafer start 讨论。</li>
              <li><strong>芯片宽度 / 高度：</strong>芯片裸片尺寸，通常来自 floorplan、GDS 版图或 foundry 报价所用 die size，不含切割道。</li>
              <li><strong>切割道 Scribe line：</strong>die 与 die 之间的划片道，可能包含对准标记、PCM、工艺监控结构和锯切余量；切割道越宽，有效 pitch 越大，可切芯片数量越少。</li>
              <li><strong>边缘排除 Edge exclusion：</strong>晶圆边缘保留区，边缘区域因工艺均匀性、夹持、污染和切割限制通常不能完全利用；数值越大，可用晶圆直径越小。</li>
              <li><strong>晶圆芯片总数：</strong>几何排布估算值，不等于最终可销售芯片数量；它没有考虑缺陷、测试 binning、封装损耗和客户筛选规则。</li>
              <li><strong>D0 缺陷密度：</strong>单位为每平方厘米缺陷数。die 越大，同样缺陷密度下良率越低。</li>
              <li><strong>Poisson 模型：</strong>假设缺陷随机独立分布，简单但可能偏保守或偏理想。</li>
              <li><strong>Negative Binomial 模型：</strong>允许缺陷聚集，更常用于工程估算；α 越大越接近 Poisson。</li>
              <li><strong>Reticle 与 stepper 限制：</strong>超大芯片或特殊拼接设计还要考虑光刻曝光场尺寸、step-and-repeat 排列、shot map 和 partial die 策略。</li>
              <li><strong>边缘芯片策略：</strong>有些 foundry/产品会保留 partial die 或 edge die 用于监控，有些会完全排除；本工具按保守几何修正估算。</li>
              <li><strong>量产复核：</strong>最终 DPW 需要用 foundry 的 die stepping、reticle 限制、scribe 规则、edge die 策略、真实 wafer map 和测试数据复核。</li>
            </ul>
          </div>
        </section>
      </section>
    </main>
  );
}

function BondingDiagramTool() {
  const [preset, setPreset] = useState('qfn48');
  const [values, setValues] = useState(bondingDefaultValues);
  const [netlist, setNetlist] = useState(bondingSampleNetlist);
  const parsedNetlist = useMemo(() => parseBondingNetlist(netlist, values.packagePins), [netlist, values.packagePins]);
  const diagram = useMemo(() => makeBondingGeometry(values, parsedNetlist.rows), [values, parsedNetlist.rows]);

  const updateValue = (key, nextValue) => {
    setPreset('custom');
    setValues((current) => ({ ...current, [key]: nextValue }));
  };

  const applyPreset = (nextPreset) => {
    setPreset(nextPreset);
    if (bondingPackagePresets[nextPreset]) {
      setValues(bondingPackagePresets[nextPreset]);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNetlist(String(reader.result || ''));
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const blob = new Blob([bondingSampleNetlist], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bonding-netlist-template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="app-shell tools-shell" style={{ '--bg-image': `url(${backgroundUrl})` }}>
      <header className="library-hero tools-hero" style={{ '--library-accent': '#8bffcf', '--library-accent-rgb': '139 255 207' }}>
        <a className="back-button" href="#/tools">
          <ArrowLeft size={18} aria-hidden="true" />
          返回工具目录
        </a>
        <div className="library-hero-copy">
          <p className="eyebrow">ONLINE TOOL</p>
          <h1>键合图生成器</h1>
          <p>用于封装早期沟通的 QFN bonding diagram 草图工具。选择封装尺寸、输入 die 尺寸和 pin-to-pad netlist 后，生成芯片 pad 到封装 pin 的键合连线示意。</p>
        </div>
        <div className="library-hero-mark" aria-hidden="true">
          <Workflow size={58} strokeWidth={1.4} />
        </div>
      </header>

      <section className="tool-layout bonding-tool-layout" aria-label="键合图生成器">
        <form className="tool-panel tool-inputs" onSubmit={(event) => event.preventDefault()}>
          <div className="tool-panel-head">
            <h2>封装与 netlist</h2>
            <p>当前先支持 QFN 类四边封装示意图。实际工程交付前仍需用封装厂模板、bonding rule、pad opening、lead frame 与 DRC 规则复核。</p>
          </div>

          <div className="tool-field-grid">
            <label className="tool-field">
              <span>封装预设</span>
              <select value={preset} onChange={(event) => applyPreset(event.target.value)}>
                <option value="custom">自定义</option>
                {Object.entries(bondingPackagePresets).map(([key, presetValue]) => (
                  <option key={key} value={key}>{presetValue.label}</option>
                ))}
              </select>
            </label>
            <label className="tool-field">
              <span>Package pins</span>
              <input
                type="number"
                min="4"
                step="4"
                value={values.packagePins}
                onChange={(event) => updateValue('packagePins', event.target.value)}
              />
              <em>建议输入 4 的倍数，便于四边均匀分配。</em>
            </label>
          </div>

          <div className="tool-field-grid tool-field-grid-three">
            {[
              ['packageWidthMm', '封装宽度 (mm)', '0.1', 'QFN body 的 X 方向尺寸。'],
              ['packageHeightMm', '封装高度 (mm)', '0.1', 'QFN body 的 Y 方向尺寸。'],
              ['dieWidthUm', 'Die 宽度 (µm)', '10', '芯片裸片 X 方向尺寸。'],
              ['dieHeightUm', 'Die 高度 (µm)', '10', '芯片裸片 Y 方向尺寸。'],
            ].map(([key, label, step, hint]) => (
              <label className="tool-field" key={key}>
                <span>{label}</span>
                <input
                  type="number"
                  min="0"
                  step={step}
                  value={values[key]}
                  onChange={(event) => updateValue(key, event.target.value)}
                />
                <em>{hint}</em>
              </label>
            ))}
          </div>

          <label className="tool-field bonding-netlist-field">
            <span>Netlist CSV</span>
            <textarea
              value={netlist}
              onChange={(event) => setNetlist(event.target.value)}
              spellCheck="false"
              placeholder="pin,pad,net,side"
            />
            <em>支持列名 pin,pad,net,side。side 可填 top/right/bottom/left；不填时按 package pin 编号自动推断。</em>
          </label>

          <div className="bonding-file-row">
            <label className="tool-secondary bonding-upload-button">
              上传 CSV / TXT
              <input type="file" accept=".csv,.txt" onChange={handleFileUpload} />
            </label>
            <button type="button" className="tool-secondary" onClick={() => setNetlist(bondingSampleNetlist)}>
              载入示例
            </button>
            <button type="button" className="tool-secondary" onClick={downloadTemplate}>
              下载模板
            </button>
          </div>

          <p className="tool-note">Netlist 是封装图的核心输入：每一行代表一根 bond wire，从 package pin 连接到 die pad，并带上网络名称。VDD/VSS/GND 会自动用不同颜色区分。</p>
        </form>

        <section className="tool-panel tool-results bonding-diagram-panel">
          <div className="tool-score-card">
            <span>Bonding Connections</span>
            <strong>{diagram.bonds.length}</strong>
            <p>当前封装 {values.packagePins} pin，已连接 {diagram.bonds.length} 条键合线，die/package 面积比例约 {formatNumber(diagram.dieToPackageRatio * 100, 1)}%。</p>
          </div>

          <div className="bonding-svg-shell" aria-label="键合图 SVG 示意">
            <svg className="bonding-diagram-svg" viewBox="0 0 720 720" role="img" aria-labelledby="bonding-diagram-title">
              <title id="bonding-diagram-title">QFN bonding diagram preview</title>
              <defs>
                <linearGradient id="bondingPackageStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#62d6ff" />
                  <stop offset="45%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#9b7cff" />
                </linearGradient>
                <radialGradient id="bondingDieFill" cx="50%" cy="45%" r="65%">
                  <stop offset="0%" stopColor="rgba(139,255,207,0.22)" />
                  <stop offset="100%" stopColor="rgba(5,20,38,0.9)" />
                </radialGradient>
                <filter id="bondingGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <rect
                className="bonding-package"
                x={diagram.packageRect.x}
                y={diagram.packageRect.y}
                width={diagram.packageRect.w}
                height={diagram.packageRect.h}
                rx="16"
              />
              <rect
                className="bonding-exposed-pad"
                x="272"
                y="272"
                width="176"
                height="176"
                rx="12"
              />
              <rect
                className="bonding-die"
                x={diagram.dieRect.x}
                y={diagram.dieRect.y}
                width={diagram.dieRect.w}
                height={diagram.dieRect.h}
                rx="10"
              />

              {diagram.pins.map((pinPoint) => (
                <g key={pinPoint.pin} className={diagram.activePins.has(pinPoint.pin) ? 'bonding-pin active' : 'bonding-pin'}>
                  <circle cx={pinPoint.x} cy={pinPoint.y} r={diagram.activePins.has(pinPoint.pin) ? 5.5 : 3.2} />
                  {(pinPoint.pin === 1 || pinPoint.pin % 8 === 0) && (
                    <text x={pinPoint.x} y={pinPoint.y - 10} textAnchor="middle">{pinPoint.pin}</text>
                  )}
                </g>
              ))}

              {diagram.bonds.map((bond) => {
                const midX = (bond.packagePoint.x + bond.diePoint.x) / 2;
                const midY = (bond.packagePoint.y + bond.diePoint.y) / 2;
                return (
                  <g key={bond.id} className={`bonding-wire-group ${bond.netType}`}>
                    <path
                      className="bonding-wire"
                      d={`M ${bond.packagePoint.x} ${bond.packagePoint.y} Q ${midX} ${midY - 18} ${bond.diePoint.x} ${bond.diePoint.y}`}
                    />
                    <circle className="bonding-pad" cx={bond.diePoint.x} cy={bond.diePoint.y} r="5" />
                  </g>
                );
              })}

              {diagram.bonds.slice(0, 18).map((bond) => (
                <text
                  key={`${bond.id}-label`}
                  className="bonding-net-label"
                  x={bond.diePoint.x}
                  y={bond.diePoint.y - 9}
                  textAnchor="middle"
                >
                  {bond.net}
                </text>
              ))}
            </svg>
          </div>

          <div className="bonding-legend">
            <span><i className="signal" />Signal</span>
            <span><i className="power" />Power</span>
            <span><i className="ground" />Ground</span>
            <span>平均线长: {formatNumber(diagram.averageWireLength, 1)} px</span>
          </div>

          {parsedNetlist.warnings.length > 0 && (
            <div className="bonding-warning-list" role="status">
              {parsedNetlist.warnings.map((warning) => (
                <p key={warning}>{warning}</p>
              ))}
            </div>
          )}

          <div className="tool-metric-grid">
            {[
              ['封装尺寸', `${values.packageWidthMm} × ${values.packageHeightMm} mm`, 'QFN body 的外形尺寸。'],
              ['Die 尺寸', `${values.dieWidthUm} × ${values.dieHeightUm} µm`, '用于估算 die 在封装中心的相对大小。'],
              ['未连接 pin', Math.max(0, diagram.packagePins - diagram.bonds.length), '没有出现在 netlist 中的 package pin。'],
              ['电源/地线数量', diagram.bonds.filter((bond) => bond.netType !== 'signal').length, 'VDD/VSS/GND/PWR 会被识别为供电相关网络。'],
              ['最大线长', `${formatNumber(Math.max(0, ...diagram.bonds.map((bond) => bond.length)), 1)} px`, '示意图中的相对长度，用于观察长线风险。'],
              ['连接密度', `${formatNumber((diagram.bonds.length / Math.max(1, diagram.packagePins)) * 100, 1)}%`, '已连接 pin 数 / package pin 总数。'],
            ].map(([label, value, meta]) => (
              <div className="tool-metric" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
                <p>{meta}</p>
              </div>
            ))}
          </div>

          <div className="tool-explainer">
            <h2>说明、输入格式与工程边界</h2>
            <ul>
              <li><strong>工具用途：</strong>生成早期 bonding diagram 草图，帮助芯片设计、封装设计和测试团队对齐 package pin、die pad 与网络连接关系。</li>
              <li><strong>封装类型：</strong>当前演示稿按 QFN 四边引脚封装处理，适合 QFN/DFN 类封装的概念图。BGA、WLCSP、QFP、SIP 等封装后续可扩展独立模板。</li>
              <li><strong>Die 尺寸：</strong>输入裸片宽高后，图中 die 会按 package 尺寸比例缩放。真实封装还需要考虑 die attach pad、die offset、keepout 和 wire sweep。</li>
              <li><strong>Netlist 格式：</strong>推荐 CSV 表头为 pin,pad,net,side。pin 是封装引脚号，pad 是芯片 pad 名称，net 是网络名，side 是 pad 所在边。</li>
              <li><strong>自动边推断：</strong>side 留空时，工具会按 pin 编号顺序自动分配 top/right/bottom/left，便于快速生成草图，但正式设计应使用真实 pad ring 坐标。</li>
              <li><strong>颜色规则：</strong>普通信号为青绿色，VDD/PWR 类电源为金色，VSS/GND 类地线为蓝色，便于快速检查供电网络是否分布均衡。</li>
              <li><strong>检查重点：</strong>初版图应重点看 pin 是否重复、未连接 pin 是否合理、长线是否过多、电源/地是否分散、相邻敏感信号是否需要调整。</li>
              <li><strong>不能替代：</strong>本工具不替代封装厂 CAD、bonding rule check、wire loop profile、capillary clearance、mold flow、SI/PI 分析和量产签核文件。</li>
            </ul>
          </div>
        </section>
      </section>
    </main>
  );
}

function ResearchReportsPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedReport, setSelectedReport] = useState(null);
  const [activePanel, setActivePanel] = useState('all');
  const [downloadedReportIds, setDownloadedReportIds] = useState(() => new Set(researchReports.slice(0, 3).map((report) => report.id)));

  const filteredReports = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return researchReports.filter((report) => {
      const matchesCategory = activeCategory === '全部' || report.category === activeCategory;
      const searchable = [
        report.title,
        report.category,
        report.publishDate,
        report.summary,
        ...report.tags,
      ].join(' ').toLowerCase();
      return matchesCategory && (!keyword || searchable.includes(keyword));
    });
  }, [activeCategory, query]);

  const visibleReports = filteredReports.slice(0, visibleCount);
  const latestReports = researchReports.slice(0, 5);
  const downloadedReports = researchReports.filter((report) => downloadedReportIds.has(report.id));

  const unlockReport = (report) => {
    setDownloadedReportIds((current) => new Set(current).add(report.id));
    setSelectedReport(report);
  };

  const openReport = (report) => {
    if (report.formats?.includes('web')) {
      window.location.hash = `#/reports/${report.id}`;
      return;
    }
    setSelectedReport(report);
  };

  const resetReports = () => {
    setQuery('');
    setActiveCategory('全部');
    setVisibleCount(8);
  };

  return (
    <main
      className="app-shell reports-shell"
      style={{
        '--bg-image': `url(${backgroundUrl})`,
        '--library-accent': '#62d6ff',
        '--library-accent-rgb': '98 214 255',
        '--library-contrast': '#06152a',
      }}
    >
      <section className="reports-page">
        <header className="reports-hero">
          <a className="library-back" href="#" onClick={() => { window.location.hash = ''; }}>
            <ArrowLeft size={18} aria-hidden="true" />
            返回首页
          </a>
          <div className="reports-hero-grid">
            <div>
              <p className="eyebrow">IC RESEARCH REPORTS</p>
              <h1>研究报告</h1>
              <p>沉淀半导体产业发展、上市公司、投融资、政策和细分赛道研究，先以报告列表与检索入口为主。</p>
            </div>
          </div>

          <form className="reports-search" onSubmit={(event) => event.preventDefault()}>
            <Search size={18} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setVisibleCount(8);
              }}
              placeholder="请输入您查询的报告列表内容"
            />
            <button type="submit">搜索</button>
          </form>
        </header>

        <nav className="reports-section-nav" aria-label="报告模块导航">
          <button className={activePanel === 'all' ? 'active' : ''} onClick={() => setActivePanel('all')}>
            全部报告
          </button>
          <button className={activePanel === 'mine' ? 'active' : ''} onClick={() => setActivePanel('mine')}>
            我的报告
            <span>{downloadedReports.length}</span>
          </button>
        </nav>

        {activePanel === 'mine' ? (
          <section className="my-reports-panel" aria-label="我的报告">
            <div className="my-reports-head">
              <div>
                <p className="eyebrow">MY REPORTS</p>
                <h2>我的报告</h2>
                <p>这里展示已经下载或解锁的报告，当前 demo 默认放入几份样例报告。</p>
              </div>
              <button onClick={() => setActivePanel('all')}>返回全部报告</button>
            </div>

            <div className="my-report-grid">
              {downloadedReports.map((report) => (
                <article className="my-report-card" key={report.id}>
                  <div className="report-cover" aria-hidden="true">
                    <BookOpen size={34} strokeWidth={1.45} />
                    <em>{report.category}</em>
                  </div>
                  <h3>{report.title}</h3>
                  <p>{report.summary}</p>
                  <div className="my-report-meta">
                    <span>{report.publishDate}</span>
                    <strong>已下载</strong>
                  </div>
                  <button onClick={() => setSelectedReport(report)}>查看报告</button>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <>
        <section className="reports-toolbar" aria-label="报告筛选">
          <div className="category-tabs">
            {reportCategories.map((category) => (
              <button
                key={category}
                className={activeCategory === category ? 'active' : ''}
                onClick={() => {
                  setActiveCategory(category);
                  setVisibleCount(8);
                }}
              >
                {category}
              </button>
            ))}
          </div>
          <button className="reports-reset" onClick={resetReports}>
            <RotateCcw size={15} aria-hidden="true" />
            重置
          </button>
        </section>

        <section className="reports-layout">
          <div className="reports-list" aria-label="研究报告列表">
            {visibleReports.map((report, index) => (
              <article
                className={`report-card ${report.formats?.includes('web') ? 'report-card-web' : ''}`}
                key={report.id}
                onClick={() => openReport(report)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') openReport(report);
                }}
                role="button"
                tabIndex={0}
              >
                <div className="report-cover" aria-hidden="true">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <BookOpen size={34} strokeWidth={1.45} />
                  <em>{report.category}</em>
                </div>
                <div className="report-main">
                  <div className="report-title-row">
                    <h2>{report.title}</h2>
                    <div className="report-format-row">
                      {report.formats?.includes('web') ? <span className="format-badge format-web">网页应用</span> : null}
                      {report.formats?.includes('pdf') ? <span className="format-badge">PDF</span> : null}
                      {report.formats?.includes('ppt') ? <span className="format-badge">PPT</span> : null}
                      <span>{report.category}</span>
                    </div>
                  </div>
                  <p>{report.summary}</p>
                  <div className="report-tags">
                    {report.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="report-meta">
                  <div>
                    <span>发布时间</span>
                    <strong>{report.publishDate}</strong>
                  </div>
                  <div>
                    <span>报告价格</span>
                    <strong className="report-price">0元</strong>
                  </div>
                  <div>
                    <span>会员</span>
                    <strong className="report-member">免费</strong>
                  </div>
                  <button onClick={(event) => {
                    event.stopPropagation();
                    if (report.formats?.includes('web')) {
                      window.location.hash = `#/reports/${report.id}`;
                    } else {
                      unlockReport(report);
                    }
                  }}>
                    {report.formats?.includes('web') ? '查看报告' : '下载报告'}
                  </button>
                </div>
              </article>
            ))}

            {visibleReports.length === 0 ? (
              <div className="empty-state">
                <h3>没有找到匹配报告</h3>
                <p>换一个关键词或分类试试。</p>
              </div>
            ) : null}

            {visibleCount < filteredReports.length ? (
              <button className="reports-load-more" onClick={() => setVisibleCount((count) => count + 4)}>
                加载更多
              </button>
            ) : (
              <p className="reports-no-more">没有更多了</p>
            )}
          </div>

          <aside className="reports-side" aria-label="报告侧栏">
            <section>
              <h2>最新报告</h2>
              <div className="reports-rank-list">
                {latestReports.map((report, index) => (
                  <button key={report.id} onClick={() => openReport(report)}>
                    <span>{index + 1}</span>
                    <strong>{report.title}</strong>
                    <em>{report.publishDate}</em>
                  </button>
                ))}
              </div>
            </section>
            <section>
              <h2>价格规则</h2>
              <div className="reports-price-note">
                <p>当前 demo 阶段所有单个报告价格统一为：</p>
                <strong>0元</strong>
                <span>会员免费</span>
              </div>
            </section>
          </aside>
        </section>
          </>
        )}
      </section>

      {selectedReport ? (
        <div className="report-modal" role="dialog" aria-modal="true" aria-label={`${selectedReport.title}详情`}>
          <div className="report-modal-panel">
            <button className="report-modal-close" onClick={() => setSelectedReport(null)} aria-label="关闭">
              <X size={18} aria-hidden="true" />
            </button>
            <p className="eyebrow">{selectedReport.category}</p>
            <h2>{selectedReport.title}</h2>
            <p>{selectedReport.summary}</p>
            <dl>
              <div>
                <dt>发布时间</dt>
                <dd>{selectedReport.publishDate}</dd>
              </div>
              <div>
                <dt>页数</dt>
                <dd>{selectedReport.pages} 页</dd>
              </div>
              <div>
                <dt>报告价格</dt>
                <dd>0元</dd>
              </div>
              <div>
                <dt>会员</dt>
                <dd>免费</dd>
              </div>
            </dl>
            <button className="report-unlock-button" onClick={() => setDownloadedReportIds((current) => new Set(current).add(selectedReport.id))}>
              <Download size={16} aria-hidden="true" />
              {downloadedReportIds.has(selectedReport.id) ? '查看已下载报告' : '立即解锁'}
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function ReportDetailPage({ report, initialMode = 'summary' }) {
  const [mode, setMode] = useState(initialMode === 'download' ? 'download' : 'summary');

  if (!report) {
    return (
      <main className="app-shell reports-shell" style={{ '--bg-image': `url(${backgroundUrl})` }}>
        <section className="reports-page">
          <a className="library-back" href="#/reports">
            <ArrowLeft size={18} aria-hidden="true" />
            返回研究报告
          </a>
          <div className="empty-state">
            <h3>未找到报告</h3>
            <p>请返回研究报告列表重新选择。</p>
          </div>
        </section>
      </main>
    );
  }

  const hasWebReport = report.formats?.includes('web');

  return (
    <main
      className="app-shell reports-shell"
      style={{
        '--bg-image': `url(${backgroundUrl})`,
        '--library-accent': '#62d6ff',
        '--library-accent-rgb': '98 214 255',
        '--library-contrast': '#06152a',
      }}
    >
      <section className="report-detail-page">
        <a className="library-back" href="#/reports">
          <ArrowLeft size={18} aria-hidden="true" />
          返回研究报告
        </a>

        <header className="report-detail-hero">
          <div>
            <p className="eyebrow">RESEARCH REPORT</p>
            <h1>{report.title}</h1>
            <p>{report.summary}</p>
            <div className="report-detail-tags">
              {hasWebReport ? <span className="format-badge format-web">网页应用</span> : null}
              {report.formats?.includes('pdf') ? <span className="format-badge">PDF</span> : null}
              {report.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </div>
          <aside className="report-detail-card">
            <dl>
              <div>
                <dt>发布时间</dt>
                <dd>{report.publishDate}</dd>
              </div>
              <div>
                <dt>报告价格</dt>
                <dd>0元</dd>
              </div>
              <div>
                <dt>会员</dt>
                <dd>免费</dd>
              </div>
              <div>
                <dt>附件格式</dt>
                <dd>{report.formats?.filter((format) => format !== 'web').join(' / ')?.toUpperCase() || '暂无'}</dd>
              </div>
            </dl>
          </aside>
        </header>

        <nav className="report-view-switch" aria-label="报告查看方式">
          <button className={mode === 'summary' ? 'active' : ''} onClick={() => setMode('summary')}>
            报告详情
          </button>
          {hasWebReport ? (
            <button className={mode === 'web' ? 'active' : ''} onClick={() => setMode('web')}>
              网页端
            </button>
          ) : null}
          <button className={mode === 'download' ? 'active' : ''} onClick={() => setMode('download')}>
            下载附件
          </button>
        </nav>

        {mode === 'web' && hasWebReport ? (
          <ChinaSemiconductorReportApp fileUrl={report.fileUrl} />
        ) : mode === 'download' ? (
          <section className="report-download-panel">
            <div>
              <p className="eyebrow">ATTACHMENT</p>
              <h2>下载附件</h2>
              <p>当前附件为你提供的 PDF 报告文件。后续如果有 PPT，可以继续加入同一区域。</p>
            </div>
            {report.fileUrl ? (
              <a className="report-download-button" href={report.fileUrl} download>
                <Download size={17} aria-hidden="true" />
                下载 PDF
              </a>
            ) : (
              <button className="report-download-button" disabled>
                暂无附件
              </button>
            )}
          </section>
        ) : (
          <section className="report-summary-panel">
            <div className="report-cover report-summary-cover" aria-hidden="true">
              <BookOpen size={44} strokeWidth={1.4} />
              <em>{report.category}</em>
            </div>
            <div>
              <p className="eyebrow">REPORT DETAIL</p>
              <h2>{report.title}</h2>
              <p>{report.summary}</p>
              <div className="report-summary-actions">
                {hasWebReport ? <button onClick={() => setMode('web')}>进入网页端</button> : null}
                {report.fileUrl ? <a href={report.fileUrl} download>下载附件</a> : null}
              </div>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

function ChinaSemiconductorReportApp({ fileUrl }) {
  const scrollToReportSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="web-report-app" aria-label="2025中国半导体产业发展报告网页端">
      <aside className="web-report-toc">
        <span>目录</span>
        {chinaSemiconductorWebReport.chapters.map((chapter) => (
          <button key={chapter.id} onClick={() => scrollToReportSection(chapter.id)}>{chapter.label}</button>
        ))}
        {fileUrl ? <button onClick={() => scrollToReportSection('report-original')}>完整图表原文</button> : null}
      </aside>

      <div className="web-report-content">
        <header className="web-report-cover">
          <p className="eyebrow">{chinaSemiconductorWebReport.subtitle}</p>
          <h2>2025中国半导体产业发展报告</h2>
          <p>根据你提供的 PDF 报告整理为网页端阅读结构，先呈现目录、关键数据、全球市场、中国产业和2026重点方向。</p>
        </header>

        <section className="web-report-metrics" aria-label="关键数据">
          {chinaSemiconductorWebReport.metrics.map((metric) => (
            <div key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <p>{metric.note}</p>
            </div>
          ))}
        </section>

        <section className="web-report-panel" id="global-market">
          <div className="web-report-panel-head">
            <span>01</span>
            <h3>全球半导体市场发展形势</h3>
          </div>
          <p>{chinaSemiconductorWebReport.sections[0].summary}</p>
          <div className="web-report-signal-grid">
            {chinaSemiconductorWebReport.globalSignals.map((signal) => (
              <div key={signal.label} className="web-report-signal">
                <div>
                  <strong>{signal.label}</strong>
                  <em>{signal.value}%</em>
                </div>
                <span><i style={{ width: `${signal.value}%` }} /></span>
              </div>
            ))}
          </div>
          <ul>
            {chinaSemiconductorWebReport.sections[0].points.map((point) => <li key={point}>{point}</li>)}
          </ul>
        </section>

        {chinaSemiconductorWebReport.sections.slice(1).map((section, index) => (
          <section className="web-report-panel" id={section.id} key={section.id}>
            <div className="web-report-panel-head">
              <span>{String(index + 2).padStart(2, '0')}</span>
              <h3>{section.title}</h3>
            </div>
            <p>{section.summary}</p>
            <ul>
              {section.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </section>
        ))}

        {fileUrl ? (
          <section className="web-report-panel web-report-original" id="report-original">
            <div className="web-report-panel-head">
              <span>PDF</span>
              <h3>完整图表原文</h3>
            </div>
            <p>下方嵌入原始 PDF 报告，保留完整页面、图表和视觉内容。若浏览器不显示内嵌 PDF，可使用下载附件查看。</p>
            <iframe
              title="2025中国半导体产业发展报告 PDF 原文"
              src={`${fileUrl}#toolbar=1&navpanes=0`}
            />
          </section>
        ) : null}
      </div>
    </section>
  );
}

function App() {
  const [activeNode, setActiveNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [routeHash, setRouteHash] = useState(() => window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setRouteHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const currentResource = useMemo(
    () => nodes.find((node) => node.id === selectedNode),
    [selectedNode],
  );

  const companyRouteMatch = routeHash.match(/^#\/company\/(.+)$/);
  if (companyRouteMatch) {
    const [, companySlug] = companyRouteMatch;
    return <CompanyDetailPage company={getCompanyBySlug(companySlug)} />;
  }

  if (routeHash === '#/tools') {
    return <OnlineToolsPage />;
  }

  if (routeHash === '#/reports') {
    return <ResearchReportsPage />;
  }

  if (routeHash === '#/news') {
    return <IndustryNewsDirectoryPage />;
  }

  const newsRouteMatch = routeHash.match(/^#\/news\/([^/]+)$/);
  if (newsRouteMatch) {
    const [, newsId] = newsRouteMatch;
    return <NewsDetailPage news={getIndustryNewsById(decodeURIComponent(newsId))} />;
  }

  if (routeHash === '#/tools/chip-area-calculator') {
    return <ChipAreaCalculator />;
  }

  if (routeHash === '#/tools/die-per-wafer-calculator') {
    return <DiePerWaferCalculator />;
  }

  if (routeHash === '#/tools/bonding-diagram-tool') {
    return <BondingDiagramTool />;
  }

  if (routeHash === '#/assistant') {
    return <AssistantPage />;
  }

  const reportRouteMatch = routeHash.match(/^#\/reports\/([^/]+)(?:\/(web|download))?$/);
  if (reportRouteMatch) {
    const [, reportId, viewMode] = reportRouteMatch;
    return <ReportDetailPage report={getReportById(reportId)} initialMode={viewMode || 'summary'} />;
  }

  const libraryRouteMatch = routeHash.match(/^#\/(eda|ip|foundry)(?:\/product\/(.+))?$/);
  if (libraryRouteMatch) {
    const [, libraryKey, productSlug] = libraryRouteMatch;
    const config = libraryConfigs[libraryKey];
    const handleRouteBack = () => {
      window.location.hash = '';
      setSelectedNode(null);
    };

    if (productSlug) {
      const resource = config.detailBasePath ? findResourceBySlug(config.resources, productSlug) : null;
      return <ResourceDetailPage config={config} resource={resource} />;
    }

    if (libraryKey === 'eda') {
      return <EdaLibrary onBack={handleRouteBack} />;
    }

    if (libraryKey === 'ip') {
      return <IpLibrary onBack={handleRouteBack} />;
    }

    if (libraryKey === 'foundry') {
      return <FoundryLibrary onBack={handleRouteBack} />;
    }
  }

  if (selectedNode === 'eda') {
    return <EdaLibrary onBack={() => setSelectedNode(null)} />;
  }

  if (selectedNode === 'ip') {
    return <IpLibrary onBack={() => setSelectedNode(null)} />;
  }

  if (selectedNode === 'pdk') {
    return <FoundryLibrary onBack={() => setSelectedNode(null)} />;
  }

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
      <header className="home-top-nav" aria-label="首页导航">
        <a className="home-nav-brand" href="#" aria-label="返回 IC HUB 首页">
          <span>IC HUB</span>
          <strong>集成电路产业库</strong>
        </a>
        <nav className="home-nav-links" aria-label="产业库导航">
          {topNavItems.map((item) => (
            <a key={item} href={getHomeNavHref(item)}>
              {item}
            </a>
          ))}
        </nav>
        <div className="home-nav-actions">
          <a className="home-nav-search" href="#" aria-label="搜索">
            <Search size={16} aria-hidden="true" />
          </a>
          <a className="home-nav-entry" href="#">
            登录/入口
          </a>
        </div>
      </header>
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
                <rect x="41" y="0" width="18" height="13" fill="rgba(255,255,255,0.3)" />
                <rect x="0" y="63" width="24" height="18" fill="rgba(255,255,255,0.3)" />
                <rect x="76" y="63" width="24" height="18" fill="rgba(255,255,255,0.3)" />
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
          <HomeAssistantEntry />
        </div>
      </section>
      <IndustryNewsSection />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
