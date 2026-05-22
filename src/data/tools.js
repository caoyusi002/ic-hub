export const processLibrary = {
  tsmc: {
    label: 'TSMC',
    nodes: {
      '180nm': { gateDensityM: 0.25, sramDensity: 0.6, nvmDensity: 0.18, ioPitchUm: 4.0, padDepthUm: 120 },
      '130nm': { gateDensityM: 0.45, sramDensity: 1.0, nvmDensity: 0.3, ioPitchUm: 3.5, padDepthUm: 110 },
      '90nm': { gateDensityM: 0.8, sramDensity: 1.5, nvmDensity: 0.5, ioPitchUm: 3.0, padDepthUm: 105 },
      '65nm': { gateDensityM: 1.2, sramDensity: 2.0, nvmDensity: 0.7, ioPitchUm: 2.5, padDepthUm: 100 },
      '55nm': { gateDensityM: 1.35, sramDensity: 2.2, nvmDensity: 0.8, ioPitchUm: 2.35, padDepthUm: 98 },
      '40nm': { gateDensityM: 1.6, sramDensity: 2.8, nvmDensity: 0.95, ioPitchUm: 2.2, padDepthUm: 150 },
      '28nm': { gateDensityM: 3.0, sramDensity: 3.8, nvmDensity: 1.2, ioPitchUm: 2.0, padDepthUm: 145 },
      '22nm': { gateDensityM: 4.0, sramDensity: 4.2, nvmDensity: 1.3, ioPitchUm: 1.8, padDepthUm: 140 },
      '16nm': { gateDensityM: 6.5, sramDensity: 4.5, nvmDensity: 1.4, ioPitchUm: 1.5, padDepthUm: 135 },
      '7nm': { gateDensityM: 18, sramDensity: 5.5, nvmDensity: 1.65, ioPitchUm: 1.2, padDepthUm: 130 },
    },
  },
  smic: {
    label: 'SMIC',
    nodes: {
      '180nm': { gateDensityM: 0.22, sramDensity: 0.55, nvmDensity: 0.16, ioPitchUm: 4.2, padDepthUm: 122 },
      '130nm': { gateDensityM: 0.4, sramDensity: 0.95, nvmDensity: 0.28, ioPitchUm: 3.7, padDepthUm: 112 },
      '90nm': { gateDensityM: 0.72, sramDensity: 1.4, nvmDensity: 0.45, ioPitchUm: 3.1, padDepthUm: 108 },
      '65nm': { gateDensityM: 1.05, sramDensity: 1.9, nvmDensity: 0.62, ioPitchUm: 2.6, padDepthUm: 102 },
      '55nm': { gateDensityM: 1.18, sramDensity: 2.1, nvmDensity: 0.72, ioPitchUm: 2.5, padDepthUm: 100 },
      '40nm': { gateDensityM: 1.4, sramDensity: 2.5, nvmDensity: 0.82, ioPitchUm: 2.3, padDepthUm: 148 },
      '28nm': { gateDensityM: 2.55, sramDensity: 3.4, nvmDensity: 1.0, ioPitchUm: 2.05, padDepthUm: 145 },
    },
  },
  gf: {
    label: 'GlobalFoundries',
    nodes: {
      '130nm': { gateDensityM: 0.46, sramDensity: 1.0, nvmDensity: 0.3, ioPitchUm: 3.6, padDepthUm: 110 },
      '90nm': { gateDensityM: 0.82, sramDensity: 1.55, nvmDensity: 0.5, ioPitchUm: 3.1, padDepthUm: 106 },
      '65nm': { gateDensityM: 1.15, sramDensity: 2.05, nvmDensity: 0.68, ioPitchUm: 2.6, padDepthUm: 100 },
      '40nm': { gateDensityM: 1.55, sramDensity: 2.7, nvmDensity: 0.88, ioPitchUm: 2.25, padDepthUm: 148 },
      '28nm': { gateDensityM: 2.85, sramDensity: 3.7, nvmDensity: 1.1, ioPitchUm: 2.0, padDepthUm: 144 },
      '22nm': { gateDensityM: 3.8, sramDensity: 4.1, nvmDensity: 1.22, ioPitchUm: 1.8, padDepthUm: 140 },
      '12nm': { gateDensityM: 5.2, sramDensity: 4.3, nvmDensity: 1.3, ioPitchUm: 1.55, padDepthUm: 136 },
    },
  },
};

export const chipProfiles = {
  digital: { label: '纯数字 ASIC', ioMultiplier: 1.0, overheadBias: 0.9, rangeMinus: 0.1, rangePlus: 0.18, confidence: '较高', note: '纯数字 ASIC 和大块 SRAM 的组合最适合这种估算方式。' },
  mcu: { label: 'MCU / 控制类 SoC', ioMultiplier: 1.45, overheadBias: 1.12, rangeMinus: 0.18, rangePlus: 0.3, confidence: '中等', note: 'MCU 往往被 pad ring、模拟 IP、电源管理和测试结构拉大面积。' },
  mixed: { label: 'Mixed-Signal SoC', ioMultiplier: 1.6, overheadBias: 1.2, rangeMinus: 0.22, rangePlus: 0.36, confidence: '中等偏低', note: '如果片上有 ADC、DAC、PLL、USB、SerDes，这个区间会比纯数字估算更重要。' },
  rf: { label: 'RF / 无线 SoC', ioMultiplier: 1.75, overheadBias: 1.34, rangeMinus: 0.25, rangePlus: 0.42, confidence: '偏低', note: 'RF SoC 的前端、匹配网络、隔离和模拟宏会明显推高真实 die area。' },
};

export const chipAreaPresets = {
  custom: null,
  rp2040: { chipType: 'mcu', foundry: 'tsmc', node: '40nm', gatesM: 0.45, sramMbit: 2.16, nvmMbit: 0, ioCount: 36, utilization: 70, hardMacroArea: 0.25, routingOverhead: 24, edgeArea: 0.1 },
  esp32: { chipType: 'rf', foundry: 'tsmc', node: '40nm', gatesM: 2.5, sramMbit: 4.26, nvmMbit: 0, ioCount: 48, utilization: 64, hardMacroArea: 1.9, routingOverhead: 30, edgeArea: 0.12 },
  stm32f103: { chipType: 'mcu', foundry: 'tsmc', node: '180nm', gatesM: 0.45, sramMbit: 0.164, nvmMbit: 0.524, ioCount: 37, utilization: 62, hardMacroArea: 2.4, routingOverhead: 26, edgeArea: 0.18 },
  'digital-asic': { chipType: 'digital', foundry: 'tsmc', node: '28nm', gatesM: 12, sramMbit: 16, nvmMbit: 0, ioCount: 220, utilization: 72, hardMacroArea: 0.2, routingOverhead: 18, edgeArea: 0.1 },
};

export const chipAreaDefaultValues = chipAreaPresets.rp2040;

export const onlineTools = [
  {
    id: 'chip-area-calculator',
    title: '芯片面积估算器',
    source: 'IC HUB',
    status: '已上线',
    summary: '按逻辑、存储、IO、硬宏、布线开销和封边估算 die area，并给出工程区间。',
    route: '#/tools/chip-area-calculator',
  },
  {
    id: 'asic-price-calculator',
    title: 'ASIC Price Calculator',
    source: 'AnySilicon Resources',
    status: '预留',
    summary: '用于估算 ASIC 项目 NRE、制造、封装测试和量产成本的工具入口。',
  },
  {
    id: 'ic-package-price-estimator',
    title: 'IC Packages Price Calculator',
    source: 'AnySilicon Resources',
    status: '预留',
    summary: '面向封装类型、引脚数量、批量和测试需求的 IC 封装成本估算入口。',
  },
  {
    id: 'die-per-wafer-calculator',
    title: '晶圆芯片数量计算器',
    source: 'AnySilicon Resources',
    status: '已上线',
    summary: '根据晶圆尺寸、芯片尺寸、切割道、边缘排除和缺陷密度估算每片晶圆可切割芯片数量。',
    route: '#/tools/die-per-wafer-calculator',
  },
  {
    id: 'bonding-diagram-tool',
    title: '键合图生成器',
    source: 'AnySilicon Resources',
    status: '已上线',
    summary: '选择 QFN 封装、输入 die 尺寸和 netlist，生成芯片 pad 到封装 pin 的 bonding diagram。',
    route: '#/tools/bonding-diagram-tool',
  },
  {
    id: 'cpu-ip-core-search-engine',
    title: 'CPU IP Core Search Engine',
    source: 'AnySilicon Resources',
    status: '预留',
    summary: '面向 CPU / processor IP 的检索与筛选工具入口。',
  },
  {
    id: 'mpw-booking-tool',
    title: 'MPW Booking Tool',
    source: 'AnySilicon Resources',
    status: '预留',
    summary: '用于查看 MPW 班车、节点、时间窗口和预约信息的工具入口。',
  },
  {
    id: 'chip-size-calculator',
    title: 'Chip Size Calculator',
    source: 'AnySilicon Resources',
    status: '预留',
    summary: '面向早期芯片尺寸规划的公开工具入口，后续可与本面积估算器合并或对照。',
  },
  {
    id: 'semipedia',
    title: 'Semipedia',
    source: 'AnySilicon Resources',
    status: '预留',
    summary: '半导体术语与知识条目的查询入口。',
  },
  {
    id: 'fabless-boost',
    title: 'Fabless Boost',
    source: 'AnySilicon Resources',
    status: '预留',
    summary: '面向 Fabless 项目启动、供应商连接和设计制造路径的资源入口。',
  },
];
