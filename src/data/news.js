export const industryNewsCategories = [
  { id: 'all', label: '全部新闻' },
  { id: 'eda', label: 'EDA' },
  { id: 'ip', label: 'IP' },
  { id: 'foundry', label: '代工厂' },
  { id: 'ai-chip', label: 'AI 芯片' },
  { id: 'industry', label: '产业相关' },
  { id: 'supply-chain', label: '供应链' },
  { id: 'other', label: '其他' },
];

export const industryNewsSortOptions = [
  { id: 'date-desc', label: '按日期从新到旧' },
  { id: 'date-asc', label: '按日期从旧到新' },
  { id: 'views-desc', label: '按浏览量从高到低' },
  { id: 'views-asc', label: '按浏览量从低到高' },
];

export const industryNews = [
  {
    id: 'nvidia-china-ai-gpu-share',
    title: '黄仁勋称英伟达 AI GPU 中国市占率已降为零',
    date: '2026-05-05',
    source: '爱集微',
    originalUrl: 'https://www.laoyaoba.com/n/1032106',
    route: '#/news/nvidia-china-ai-gpu-share',
    category: 'ai-chip',
    categoryLabel: 'AI 芯片',
    views: 12860,
    tags: ['AI 芯片', 'GPU', '出口管制'],
    relatedCompanies: ['NVIDIA', '国产 AI 芯片企业', '云计算厂商'],
    summary: '英伟达管理层再度谈及中国市场变化，AI GPU 供给与本土替代成为产业链关注焦点。',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Jensen_Huang_(cropped).jpg',
    imageAlt: 'NVIDIA CEO Jensen Huang',
    imageKeywords: ['Jensen Huang', 'NVIDIA', 'AI GPU'],
    imageCredit: 'Photo: Gage Skidmore, Wikimedia Commons, CC BY-SA 4.0',
    sourceNote: '新闻摘要根据公开报道改写；配图来自 Wikimedia Commons，不使用新闻站正文图片。',
    detailLead: '围绕 AI GPU 供给、出口管制和中国市场竞争格局，英伟达相关表态再次把高端算力芯片的产业安全问题推到台前。',
    content: [
      {
        heading: '事件概览',
        paragraphs: [
          '报道提到，英伟达管理层在近期交流中谈及中国 AI GPU 市场变化，并表示公司在中国相关市场的份额出现大幅下降。这个表态并不只是单一公司的商业结果，也反映了高端算力芯片在出口限制、客户采购策略和国产替代之间的复杂拉扯。',
          '对集成电路产业库来说，这类新闻的价值在于提示用户关注 GPU、HBM、先进封装、EDA 设计流程、晶圆代工能力以及服务器整机生态之间的联动关系。AI 芯片竞争已经不是单点芯片指标竞争，而是完整供应链和软件生态的综合竞争。',
        ],
      },
      {
        heading: '产业影响',
        paragraphs: [
          '中国客户在高端 AI 训练和推理场景中，会继续评估可获得性、性能、功耗、生态兼容性和交付风险。受限产品之外，本土 GPU、NPU、ASIC 方案的验证机会可能增加，但能否规模化进入数据中心仍取决于软件栈、互连能力、制造良率和系统级成本。',
          '对 EDA/IP/PDK 生态而言，AI 芯片需求会推高大规模 SoC、Chiplet、高速接口、片上网络、存储控制器和先进封装验证工具的重要性。产业库后续可以围绕 AI 芯片开发链条，把企业、工具、IP 和工艺节点组织成专题目录。',
        ],
      },
      {
        heading: '后续观察',
        paragraphs: [
          '建议持续跟踪英伟达可供中国市场的产品线变化、国产 AI 芯片量产进展、HBM 与先进封装供给，以及云厂商和大模型企业在硬件采购上的实际选择。',
        ],
      },
    ],
  },
  {
    id: 'cadence-tsmc-ai-design',
    title: 'Cadence 携手 TSMC 加速新一代 AI 芯片设计',
    date: '2026-05-12',
    source: '爱集微',
    originalUrl: 'https://www.laoyaoba.com/n/1034970',
    route: '#/news/cadence-tsmc-ai-design',
    category: 'eda',
    categoryLabel: 'EDA',
    views: 9420,
    tags: ['EDA', 'TSMC', 'AI 设计'],
    relatedCompanies: ['Cadence', 'TSMC', 'AI 芯片设计企业'],
    summary: '双方围绕先进制程、AI 设计流程和封装协同继续推进，强化高性能芯片设计生态。',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Semiconductor_Wafer_of_Microelectronics.jpg?width=900',
    imageAlt: '半导体晶圆与芯片设计制造',
    imageKeywords: ['EDA', 'TSMC', 'semiconductor wafer', 'AI chip design'],
    imageCredit: 'Photo: Wikimedia Commons, semiconductor wafer image, reusable under Commons license terms',
    sourceNote: '新闻摘要根据公开报道改写；配图按 EDA、TSMC、AI 芯片设计等关键词选取可复用相关图片。',
    detailLead: 'Cadence 与 TSMC 的合作方向集中在先进节点、AI 驱动设计流程和先进封装验证，代表 EDA 工具链与晶圆制造生态继续深度绑定。',
    content: [
      {
        heading: '事件概览',
        paragraphs: [
          '随着 AI 芯片规模持续扩大，设计团队需要在功耗、性能、面积、散热、良率和上市周期之间快速折中。Cadence 与 TSMC 的合作，本质上是把设计工具、参考流程、工艺规则和封装能力更早地打通。',
          '这种合作通常会覆盖物理实现、签核验证、电源完整性、热分析、多芯粒封装和系统级协同等环节。对 Fabless 企业来说，成熟的 EDA-to-foundry 流程可以降低先进制程导入的不确定性。',
        ],
      },
      {
        heading: '对 EDA 的意义',
        paragraphs: [
          'EDA 的战略价值正在从单一工具授权，转向与 PDK、IP、封装和制造数据协同的工程平台。越先进的 AI 芯片，越依赖工具链在早期发现拥塞、时序、功耗和封装互连问题。',
          '对于产业库建设，这条新闻可以放入 EDA 专题，并和 Cadence 工具、TSMC 工艺、先进封装、AI 芯片设计方法学等条目建立关联。',
        ],
      },
      {
        heading: '后续观察',
        paragraphs: [
          '后续可关注合作是否覆盖 N2、A16 等先进节点，以及是否延伸到 3DIC、CoWoS、热仿真和多物理场验证工具链。',
        ],
      },
    ],
  },
  {
    id: 'synopsys-tsmc-ai-alliance',
    title: 'Synopsys 与 TSMC 深化 AI 设计联盟',
    date: '2026-05-05',
    source: 'SemiWiki',
    originalUrl: 'https://semiwiki.com/3dic/368839-synopsys-and-tsmc-deepen-ai-design-alliance-what-it-means/',
    route: '#/news/synopsys-tsmc-ai-alliance',
    category: 'eda',
    categoryLabel: 'EDA',
    views: 8760,
    tags: ['EDA', '先进封装', '3DIC'],
    relatedCompanies: ['Synopsys', 'TSMC', '先进封装企业'],
    summary: '合作重点延伸至 AI 芯片设计、3DIC 与先进封装，加速从设计到制造的协同验证。',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Semiconductor_Wafer_of_Microelectronics.jpg?width=900',
    imageAlt: '半导体晶圆与先进芯片设计',
    imageKeywords: ['Synopsys', 'TSMC', '3DIC', 'advanced packaging', 'semiconductor wafer'],
    imageCredit: 'Photo: Wikimedia Commons, semiconductor wafer image, reusable under Commons license terms',
    sourceNote: '新闻摘要根据公开文章改写；配图按 EDA、TSMC、3DIC 和先进封装等关键词选取可复用相关图片。',
    detailLead: 'Synopsys 与 TSMC 的合作进一步说明，AI 芯片开发已进入工艺、EDA、IP、封装与系统验证高度耦合的阶段。',
    content: [
      {
        heading: '事件概览',
        paragraphs: [
          '这项合作关注 Synopsys 与 TSMC 在 AI 设计联盟上的深化协同。先进节点和 3DIC 使芯片设计不再只是平面版图问题，而是涉及芯粒划分、互连带宽、功耗密度、热管理和封装可靠性的系统工程。',
          '在这种背景下，EDA 厂商需要把实现、验证、签核、仿真和 IP 资产放进统一流程，帮助客户更快完成复杂 AI 芯片的设计收敛。',
        ],
      },
      {
        heading: '产业影响',
        paragraphs: [
          '对设计企业而言，成熟的 TSMC 认证流程和 Synopsys 工具支持可以减少先进制程项目的试错成本。对代工厂而言，EDA 生态越完善，客户越容易把高复杂度设计导入到目标工艺。',
          '这类新闻适合在产业库中作为“EDA 与代工协同”的案例，连接到 Synopsys、TSMC、3DIC、先进封装、时序签核和多物理场验证等条目。',
        ],
      },
      {
        heading: '后续观察',
        paragraphs: [
          '值得继续关注双方在 AI 自动化设计、硅生命周期管理、Chiplet 互连标准和先进封装参考流程方面的落地进展。',
        ],
      },
    ],
  },
  {
    id: 'tsmc-tool-orders-capex',
    title: 'TSMC 资本开支和设备订单继续受 AI 需求拉动',
    date: '2026-05-15',
    source: 'SemiWiki',
    originalUrl: 'https://semiwiki.com/semiconductor-manufacturers/tsmc/369288-tsmcs-record-tool-orders-hint-at-another-capex-shockwave/',
    route: '#/news/tsmc-tool-orders-capex',
    category: 'foundry',
    categoryLabel: '代工厂',
    views: 11840,
    tags: ['Foundry', '资本开支', '先进制程'],
    relatedCompanies: ['TSMC', '半导体设备供应商', '先进封装供应链'],
    summary: 'AI 训练与推理芯片需求推动晶圆厂设备订单和资本开支预期升温，先进节点仍是核心变量。',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/TSMC_Fab_18_and_fields_May_2025.jpg?width=900',
    imageAlt: 'TSMC Fab 18 厂区',
    imageKeywords: ['TSMC Fab', 'foundry', 'capex', 'advanced process'],
    imageCredit: 'Photo: Wikimedia Commons contributor, reusable under Commons license terms',
    sourceNote: '新闻摘要根据公开文章改写；配图来自 Wikimedia Commons，不使用新闻站正文图片。',
    detailLead: 'TSMC 设备订单和资本开支变化，是观察 AI 算力需求能否持续兑现到半导体制造端的重要信号。',
    content: [
      {
        heading: '事件概览',
        paragraphs: [
          '近期产业观察讨论了 TSMC 工具订单和资本开支预期。AI 芯片需求如果持续强劲，会沿着设计订单、晶圆投片、先进封装产能和设备采购向上游传导。',
          '代工厂扩产不是简单增加厂房面积，还包括光刻、刻蚀、薄膜、量测、良率管理和封装测试等环节的综合投资。先进节点和先进封装产能尤其容易成为供需瓶颈。',
        ],
      },
      {
        heading: '产业影响',
        paragraphs: [
          '对 Fabless 企业来说，TSMC 资本开支和设备订单变化关系到未来产能可获得性、价格、交期和工艺路线选择。对 EDA/IP 厂商来说，先进制程扩产也意味着更多设计导入和认证需求。',
          '产业库中可以把这类新闻归入“代工厂/先进制程/资本开支”目录，并与 TSMC、先进封装、AI 芯片、设备供应链等专题交叉引用。',
        ],
      },
      {
        heading: '后续观察',
        paragraphs: [
          '后续重点观察先进封装产能、N2/A16 节点进展、AI 客户订单持续性，以及设备供应商交付周期。',
        ],
      },
    ],
  },
  {
    id: 'siemens-eda-tsmc-packaging',
    title: 'Siemens EDA 扩展与 TSMC 在 AI 和先进封装方向的合作',
    date: '2026-05-20',
    source: 'SemiWiki',
    originalUrl: 'https://semiwiki.com/eda/siemens-eda/369271-siemens-eda-expands-ai-and-advanced-packaging-collaboration-with-tsmc/',
    route: '#/news/siemens-eda-tsmc-packaging',
    category: 'eda',
    categoryLabel: 'EDA',
    views: 10320,
    tags: ['EDA', '先进封装', 'AI'],
    relatedCompanies: ['Siemens EDA', 'TSMC', '先进封装企业'],
    summary: '合作覆盖 AI 设计自动化、封装验证和制造协同，反映系统级芯片开发对工具链的更高要求。',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Semiconductor_Wafer_of_Microelectronics.jpg?width=900',
    imageAlt: '半导体晶圆与先进封装设计',
    imageKeywords: ['Siemens EDA', 'TSMC', 'advanced packaging', 'AI chip', 'semiconductor wafer'],
    imageCredit: 'Photo: Wikimedia Commons, semiconductor wafer image, reusable under Commons license terms',
    sourceNote: '新闻摘要根据公开文章改写；配图按 Siemens EDA、TSMC、AI 和先进封装等关键词选取可复用相关图片。',
    detailLead: 'Siemens EDA 与 TSMC 在 AI 和先进封装方向扩展合作，体现封装、系统仿真和制造验证在 AI 芯片开发中的地位上升。',
    content: [
      {
        heading: '事件概览',
        paragraphs: [
          'AI 芯片对算力密度、内存带宽和能效的要求，使先进封装从后段制造环节变成前期架构决策的重要组成部分。Siemens EDA 与 TSMC 的合作，强调了封装验证、信号完整性、电源完整性和热管理的重要性。',
          '当单颗芯片难以继续无限扩大时，Chiplet、2.5D/3D 封装和高带宽互连成为主流方向。EDA 工具需要在芯片、封装、板级和系统之间提供更连续的分析能力。',
        ],
      },
      {
        heading: '对产业库的价值',
        paragraphs: [
          '这条新闻适合放在 EDA 与先进封装交叉目录下。它能够帮助用户理解，EDA 不只是画版图的软件，而是支撑先进工艺、封装、系统验证和制造协同的平台。',
          '后续建设三级页面时，可以把 Siemens EDA 工具、TSMC 封装能力、Chiplet 互连、热仿真和 SI/PI 分析放进同一个主题链路。',
        ],
      },
      {
        heading: '后续观察',
        paragraphs: [
          '建议关注 Siemens EDA 在 3DIC、封装协同设计、数字孪生和多物理场仿真方向的产品更新。',
        ],
      },
    ],
  },
  {
    id: 'trendforce-ai-optical-interconnect',
    title: 'AI 光互连需求推动供应链外包和扩产',
    date: '2026-05-05',
    source: 'TrendForce',
    originalUrl: 'https://www.trendforce.com/presscenter/news/20260505-13031.html',
    route: '#/news/trendforce-ai-optical-interconnect',
    category: 'supply-chain',
    categoryLabel: '供应链',
    views: 7680,
    tags: ['光互连', 'AI 基础设施', '供应链'],
    relatedCompanies: ['光模块厂商', '云计算厂商', '高速接口 IP 供应商'],
    summary: 'AI 集群带动高速互连需求上升，光通信与相关组件供应链的外包、扩产节奏受到关注。',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Optical-fibre-junction-box.jpg?width=900',
    imageAlt: '光纤连接与高速互连',
    imageKeywords: ['optical interconnect', 'optical fiber', 'AI infrastructure', 'supply chain'],
    imageCredit: 'Photo: Wikimedia Commons, optical fibre junction box image, reusable under Commons license terms',
    sourceNote: '新闻摘要根据公开新闻稿改写；配图按光互连、光纤和 AI 基础设施等关键词选取可复用相关图片。',
    detailLead: 'AI 数据中心的瓶颈正在从单卡算力延伸到集群互连，光互连、交换芯片和高速模块成为供应链关注点。',
    content: [
      {
        heading: '事件概览',
        paragraphs: [
          '近期产业观察关注 AI 光互连需求对供应链外包和扩产的推动。随着 AI 集群规模扩大，GPU、加速卡和服务器之间需要更高带宽、更低延迟、更低功耗的互连方案。',
          '光模块、硅光、交换芯片、高速 SerDes、封装与测试能力都会受到影响。互连能力不足时，即使单颗 AI 芯片性能很强，集群整体效率也可能受到限制。',
        ],
      },
      {
        heading: '产业影响',
        paragraphs: [
          '这类新闻与 IP、EDA、封装和供应链都有关系。高速 SerDes、PCIe、CXL、Ethernet、UCIe 等接口 IP 会成为 AI 基础设施的重要底座；相关设计还需要信号完整性、封装协同和系统仿真工具支持。',
          '在产业库中，这条新闻可以归入“供应链”目录，同时关联 IP 的高速接口分类和 EDA 的 SI/PI、封装验证工具。',
        ],
      },
      {
        heading: '后续观察',
        paragraphs: [
          '建议持续观察光模块厂商扩产、硅光方案落地、交换芯片平台变化，以及云厂商对高速互连架构的选择。',
        ],
      },
    ],
  },
];

export const getIndustryNewsById = (id) => industryNews.find((news) => news.id === id);

export const getIndustryNewsDirectory = ({
  category = 'all',
  sort = 'date-desc',
  search = '',
} = {}) => {
  const normalizedSearch = search.trim().toLowerCase();
  const filteredNews = industryNews.filter((news) => {
    const matchesCategory = category === 'all' || news.category === category;
    const matchesSearch = normalizedSearch
      ? [news.title, news.summary, news.categoryLabel, ...news.tags, ...(news.relatedCompanies || [])]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
      : true;
    return matchesCategory && matchesSearch;
  });

  return [...filteredNews].sort((a, b) => {
    if (sort === 'date-asc') return a.date.localeCompare(b.date);
    if (sort === 'views-desc') return b.views - a.views;
    if (sort === 'views-asc') return a.views - b.views;
    return b.date.localeCompare(a.date);
  });
};
