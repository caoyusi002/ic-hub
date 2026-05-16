import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft,
  Blocks,
  BookOpen,
  Bookmark,
  ChevronDown,
  ChevronRight,
  Download,
  DraftingCompass,
  Factory,
  Grid2X2,
  List,
  Microchip,
  RotateCcw,
  Search,
  Sparkles,
  Workflow,
  X,
} from 'lucide-react';
import backgroundUrl from './assets/ic-background.png';
import cadenceLogo from './assets/logos/cadence.png';
import empyreanLogo from './assets/logos/empyrean-user.jpg';
import primariusLogo from './assets/logos/primarius-official.svg';
import synopsysLogo from './assets/logos/synopsys-user.jpg';
import univistaLogo from './assets/logos/univista.svg';
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

const edaTaxonomy = [
  {
    id: 'analog',
    label: '模拟 Analog',
    items: ['Schematic', 'Simulation', 'Layout'],
  },
  {
    id: 'digital-front',
    label: '数字前端 Digital Front',
    items: ['功能和指标定义', '架构设计', 'RTL 编写/检查', '功能验证/前仿真', 'FPGA 验证', '逻辑综合', 'CDC/SDC Validation', '静态时序分析 STA', '形式化验证', '逻辑等价性检查'],
  },
  {
    id: 'digital-back',
    label: '数字后端 Digital Back',
    items: ['DFT', '单元布局 FloorPlan', '时钟树综合 CTS', '布线 Place & Route', '时序收敛和 Sign-off', 'ECO', '参数提取', 'Pcell 建模', '功耗分析 Power Analysis', 'IR Drop Analysis', 'LVS', 'DRC', 'ERC', 'DFM', '良率分析', '后仿真 Gate Level Simulation', 'GDSII Tape Out'],
  },
  {
    id: 'digital-verification',
    label: '数字验证 / 硬件仿真',
    items: ['软件仿真', '数字调试', '验证管理', '硬件仿真', '原型验证', '虚拟原型', 'AI 平台'],
  },
  {
    id: 'assembly-pcb',
    label: '封装/电路板 Assembly/PCB',
    items: ['PCB Schematic', 'PCB Layout', '自动布线器', '建库/库管理工具', '数据管理工具 EDM', 'SI 前仿', 'SI 后仿', 'PI 仿真', 'EMC', '模拟和混合信号', 'RF & MicroWave', 'SI & Channel', 'Thermal & Reliability', '3DEM', 'DFM/DFT', 'MES', 'Gerber 处理', '生产制程准备'],
  },
  {
    id: 'advanced-packaging',
    label: '先进封装 Advanced Packaging',
    items: ['先进封装自动布线', '先进封装物理验证', '封装协同设计', '2.5D/3D 封装'],
  },
  {
    id: 'fpga',
    label: 'FPGA',
    items: ['设计输入', '高阶综合', '仿真', '与系统协同'],
  },
  {
    id: 'system',
    label: '系统 System',
    items: ['系统原理图输入', '系统原理图仿真', '板间接口和线缆', 'Simulation', '模拟', '热', '力学'],
  },
  {
    id: 'foundry',
    label: '工艺开发 Foundry',
    items: ['建模软件', '模型验证软件', '模型提取', 'PDK 开发', 'PDK 验证', 'OPC', 'DFM', 'TCAD', '标准单元库特征化', '存储器编译器'],
  },
  {
    id: 'test-system',
    label: '测试系统 Test System',
    items: ['参数化测试', '噪声测试', '综合量测', '晶圆测试', '测试管理', '测试向量生成', '缺陷诊断'],
  },
  {
    id: 'mems-opto',
    label: 'MEMS/Opto-electronics',
    items: ['MEMS/Opto-electronics'],
  },
  {
    id: 'others',
    label: '其它',
    items: ['线束仿真', 'EDA 仿真管理云平台', '测试管理系统平台'],
  },
];

const edaResources = [
  {
    company: 'Cadence',
    tool: 'Virtuoso Studio',
    primaryCategory: '模拟 Analog',
    secondaryCategory: 'Schematic',
    stage: '模拟设计',
    region: '美国/海外',
    tags: ['Custom IC', '原理图', '模拟/RF'],
    status: '已整理',
    summary: 'Cadence 面向定制 IC、模拟、混合信号与 RF 设计的核心平台。',
    detail: '归入模拟设计入口，覆盖原理图、版图、仿真环境协同和定制 IC 设计数据管理。',
  },
  {
    company: 'Cadence',
    tool: 'Virtuoso ADE Suite',
    primaryCategory: '模拟 Analog',
    secondaryCategory: 'Simulation',
    stage: '模拟仿真',
    region: '美国/海外',
    tags: ['仿真环境', 'AMS', '设计分析'],
    status: '已整理',
    summary: 'Cadence Virtuoso 体系中的模拟/混合信号仿真与分析环境。',
    detail: '归入模拟仿真，适合记录测试平台、角落分析、蒙特卡洛分析及与 Spectre 等仿真器联动能力。',
  },
  {
    company: 'Cadence',
    tool: 'Spectre X Simulator',
    primaryCategory: '模拟 Analog',
    secondaryCategory: 'Simulation',
    stage: '模拟仿真',
    region: '美国/海外',
    tags: ['SPICE', '电路仿真', 'AMS'],
    status: '已整理',
    summary: 'Cadence 高性能 SPICE 级电路仿真器，用于模拟、混合信号和定制电路验证。',
    detail: '归入模拟仿真，重点对应晶体管级电路仿真、精度与性能平衡、先进节点模拟/AMS 验证场景。',
  },
  {
    company: 'Cadence',
    tool: 'Virtuoso Layout Suite',
    primaryCategory: '模拟 Analog',
    secondaryCategory: 'Layout',
    stage: '模拟版图',
    region: '美国/海外',
    tags: ['版图', 'Custom Layout', '模拟/RF'],
    status: '已整理',
    summary: 'Cadence 用于定制 IC、模拟和 RF 电路的交互式版图设计工具。',
    detail: '归入模拟版图，适合记录器件级版图、约束驱动版图、与物理验证及寄生提取的衔接。',
  },
  {
    company: 'Cadence',
    tool: 'AWR Microwave Office',
    primaryCategory: '模拟 Analog',
    secondaryCategory: 'Simulation',
    stage: 'RF/微波设计',
    region: '美国/海外',
    tags: ['RF', 'Microwave', '射频仿真'],
    status: '已整理',
    summary: 'Cadence 面向 RF、微波和毫米波电路/系统设计的仿真设计环境。',
    detail: '按当前 PDF 体系先归入模拟仿真，并用标签标记 RF/Microwave，后续可扩展为独立射频分类。',
  },
  {
    company: 'Cadence',
    tool: 'Xcelium Logic Simulator',
    primaryCategory: '数字前端 Digital Front',
    secondaryCategory: '功能验证/前仿真',
    stage: '功能验证',
    region: '美国/海外',
    tags: ['仿真', 'SystemVerilog', '覆盖率'],
    status: '已整理',
    summary: 'Cadence 数字逻辑仿真器，用于 RTL 功能验证、覆盖率和回归仿真。',
    detail: '归入数字前端功能验证/前仿真，适合记录仿真性能、验证语言支持、覆盖率闭环和调试联动。',
  },
  {
    company: 'Cadence',
    tool: 'Jasper Formal Verification Platform',
    primaryCategory: '数字前端 Digital Front',
    secondaryCategory: '形式化验证',
    stage: '形式验证',
    region: '美国/海外',
    tags: ['Formal', '属性验证', '静态验证'],
    status: '已整理',
    summary: 'Cadence 形式化验证平台，用于 RTL 级属性验证、等价/一致性相关检查和早期缺陷发现。',
    detail: '归入数字前端形式化验证，可与仿真验证互补，用于无激励或少激励场景下发现深层逻辑问题。',
  },
  {
    company: 'Cadence',
    tool: 'Genus Synthesis Solution',
    primaryCategory: '数字前端 Digital Front',
    secondaryCategory: '逻辑综合',
    stage: '逻辑综合',
    region: '美国/海外',
    tags: ['Synthesis', 'RTL-to-gate', 'PPA'],
    status: '已整理',
    summary: 'Cadence 逻辑综合工具，用于 RTL 到门级网表转换与 PPA 优化。',
    detail: '归入数字前端逻辑综合，适合记录约束处理、低功耗综合、与 Innovus 后端实现的衔接。',
  },
  {
    company: 'Cadence',
    tool: 'Conformal Equivalence Checking',
    primaryCategory: '数字前端 Digital Front',
    secondaryCategory: '逻辑等价性检查',
    stage: '逻辑验证',
    region: '美国/海外',
    tags: ['LEC', '等价检查', 'ECO'],
    status: '已整理',
    summary: 'Cadence 逻辑等价性检查工具，用于综合、ECO 或实现前后逻辑一致性验证。',
    detail: '归入逻辑等价性检查，常用于 RTL 与门级网表、ECO 修改前后版本之间的一致性确认。',
  },
  {
    company: 'Cadence',
    tool: 'Joules RTL Design Studio',
    primaryCategory: '数字后端 Digital Back',
    secondaryCategory: '功耗分析 Power Analysis',
    stage: '功耗分析',
    region: '美国/海外',
    tags: ['RTL Power', '低功耗', 'Power'],
    status: '已整理',
    summary: 'Cadence 面向 RTL 阶段的功耗估算和低功耗设计分析工具。',
    detail: 'PDF 中功耗分析位于数字后端验证条目，Joules 发生在较早阶段，因此用阶段字段标记 RTL 功耗分析。',
  },
  {
    company: 'Cadence',
    tool: 'Innovus Implementation System',
    primaryCategory: '数字后端 Digital Back',
    secondaryCategory: '布线 Place & Route',
    stage: '物理实现',
    region: '美国/海外',
    tags: ['P&R', '布局布线', '数字后端'],
    status: '已整理',
    summary: 'Cadence 数字后端实现平台，用于 floorplan、placement、routing 和物理优化。',
    detail: '归入数字后端布线/Place & Route，是 Cadence 数字实现流程中的核心工具。',
  },
  {
    company: 'Cadence',
    tool: 'Tempus Timing Solution',
    primaryCategory: '数字后端 Digital Back',
    secondaryCategory: '时序收敛和 Sign-off',
    stage: '时序签核',
    region: '美国/海外',
    tags: ['STA', 'Sign-off', 'Timing'],
    status: '已整理',
    summary: 'Cadence 静态时序分析和时序签核工具。',
    detail: '归入数字后端时序收敛和 Sign-off，适合记录 MMMC、时序收敛、ECO 和签核相关能力。',
  },
  {
    company: 'Cadence',
    tool: 'Quantus Extraction Solution',
    primaryCategory: '数字后端 Digital Back',
    secondaryCategory: '参数提取',
    stage: '寄生提取',
    region: '美国/海外',
    tags: ['PEX', 'RC Extraction', 'Sign-off'],
    status: '已整理',
    summary: 'Cadence 寄生参数提取工具，用于数字、模拟和混合信号设计的签核级 RC 提取。',
    detail: '归入参数提取，可服务数字后端签核和模拟版图后仿真。',
  },
  {
    company: 'Cadence',
    tool: 'Voltus IC Power Integrity Solution',
    primaryCategory: '数字后端 Digital Back',
    secondaryCategory: 'IR Drop Analysis',
    stage: '电源完整性签核',
    region: '美国/海外',
    tags: ['IR Drop', 'EM', 'Power Integrity'],
    status: '已整理',
    summary: 'Cadence 电源完整性分析工具，用于 IR drop、EM 和功耗相关签核。',
    detail: '归入 IR Drop Analysis，适合记录芯片电源网络、电迁移和功耗完整性分析能力。',
  },
  {
    company: 'Cadence',
    tool: 'Pegasus Verification System',
    primaryCategory: '数字后端 Digital Back',
    secondaryCategory: 'DRC',
    stage: '物理验证',
    region: '美国/海外',
    tags: ['DRC', 'LVS', 'Physical Verification'],
    status: '已整理',
    summary: 'Cadence 物理验证和签核平台，覆盖 DRC、LVS 等版图验证任务。',
    detail: '按主用途归入 DRC，同时可通过标签检索 LVS、物理签核和 Virtuoso/Innovus 集成。',
  },
  {
    company: 'Cadence',
    tool: 'Modus DFT Software Solution',
    primaryCategory: '数字后端 Digital Back',
    secondaryCategory: 'DFT',
    stage: '可测性设计',
    region: '美国/海外',
    tags: ['DFT', 'ATPG', '测试'],
    status: '已整理',
    summary: 'Cadence DFT 和测试自动化工具，用于扫描链、压缩测试、ATPG 等流程。',
    detail: '归入数字后端 DFT，适合记录测试结构插入、测试向量生成和制造测试相关能力。',
  },
  {
    company: 'Cadence',
    tool: 'Allegro X Design Platform',
    primaryCategory: '封装/电路板 Assembly/PCB',
    secondaryCategory: 'PCB Layout',
    stage: 'PCB/封装设计',
    region: '美国/海外',
    tags: ['PCB', 'Package', 'Layout'],
    status: '已整理',
    summary: 'Cadence 面向 PCB 与封装设计的系统级布局布线平台。',
    detail: '归入 PCB Layout，适合记录高速板级设计、封装协同和制造输出能力。',
  },
  {
    company: 'Cadence',
    tool: 'OrCAD X',
    primaryCategory: '封装/电路板 Assembly/PCB',
    secondaryCategory: 'PCB Schematic',
    stage: 'PCB 原理图',
    region: '美国/海外',
    tags: ['PCB', '原理图', '工程设计'],
    status: '已整理',
    summary: 'Cadence 面向电子系统和 PCB 设计的原理图与板级设计工具线。',
    detail: '归入 PCB Schematic，适合中小型板级设计、原理图输入和与 PCB layout 的协同。',
  },
  {
    company: 'Cadence',
    tool: 'Sigrity X Platform',
    primaryCategory: '封装/电路板 Assembly/PCB',
    secondaryCategory: 'SI & Channel',
    stage: 'SI/PI 分析',
    region: '美国/海外',
    tags: ['SI', 'PI', 'Channel'],
    status: '已整理',
    summary: 'Cadence 高速 PCB、封装和系统互连的信号完整性/电源完整性分析平台。',
    detail: '归入 SI & Channel，并用标签标记 PI，可用于高速链路、PDN 和封装/板级协同分析。',
  },
  {
    company: 'Cadence',
    tool: 'Clarity 3D Solver',
    primaryCategory: '封装/电路板 Assembly/PCB',
    secondaryCategory: '3DEM',
    stage: '三维电磁仿真',
    region: '美国/海外',
    tags: ['3D EM', 'SI/PI', 'RF'],
    status: '已整理',
    summary: 'Cadence 3D 电磁场求解器，用于 PCB、封装、SoIC 和高速/高频系统建模。',
    detail: '归入 3DEM，适合记录电磁场仿真、S 参数建模、SI/PI 和 RF 互连分析。',
  },
  {
    company: 'Cadence',
    tool: 'Celsius Studio Platform',
    primaryCategory: '系统 System',
    secondaryCategory: '热',
    stage: '系统级热分析',
    region: '美国/海外',
    tags: ['Thermal', 'Multiphysics', '系统分析'],
    status: '已整理',
    summary: 'Cadence 多物理场热分析平台，覆盖芯片、封装、PCB 到系统层面的热仿真。',
    detail: '归入系统热仿真，也可服务封装/PCB 热可靠性分析。',
  },
  {
    company: 'Cadence',
    tool: 'Palladium Enterprise Emulation',
    primaryCategory: '数字前端 Digital Front',
    secondaryCategory: 'FPGA 验证',
    stage: '硬件仿真/加速验证',
    region: '美国/海外',
    tags: ['Emulation', 'SoC 验证', '软件验证'],
    status: '已整理',
    summary: 'Cadence 硬件仿真平台，用于大规模 SoC 验证、硬件/软件协同和回归加速。',
    detail: 'PDF 中归入数字前端 FPGA 验证附近，用标签标记为 emulation，后续可单独拆硬件辅助验证分类。',
  },
  {
    company: 'Cadence',
    tool: 'Protium Enterprise Prototyping',
    primaryCategory: 'FPGA',
    secondaryCategory: '与系统协同',
    stage: '原型验证',
    region: '美国/海外',
    tags: ['FPGA Prototyping', '软件开发', 'SoC 验证'],
    status: '已整理',
    summary: 'Cadence 企业级 FPGA 原型验证平台，用于早期软件开发和系统验证。',
    detail: '归入 FPGA 与系统协同，适合记录原型平台、软件 bring-up 和硬件/软件协同验证。',
  },
  {
    company: 'Synopsys',
    tool: 'Custom Compiler',
    primaryCategory: '模拟 Analog',
    secondaryCategory: 'Layout',
    stage: '模拟版图',
    region: '美国/海外',
    tags: ['Custom IC', '版图', 'AMS'],
    status: '已整理',
    summary: 'Synopsys 定制 IC 设计和版图环境，面向模拟、混合信号、RF 和存储器设计。',
    detail: '归入模拟 Layout，也可与 PrimeSim、StarRC、IC Validator 等组成定制设计流程。',
  },
  {
    company: 'Synopsys',
    tool: 'PrimeSim / HSPICE',
    primaryCategory: '模拟 Analog',
    secondaryCategory: 'Simulation',
    stage: '模拟仿真',
    region: '美国/海外',
    tags: ['SPICE', '电路仿真', 'AMS'],
    status: '已整理',
    summary: 'Synopsys 晶体管级电路仿真工具线，覆盖 SPICE 级模拟和混合信号仿真。',
    detail: '归入模拟仿真，适合记录 PrimeSim 系列、HSPICE 以及定制电路仿真能力。',
  },
  {
    company: 'Synopsys',
    tool: 'PrimeWave Design Environment',
    primaryCategory: '模拟 Analog',
    secondaryCategory: 'Simulation',
    stage: '模拟仿真环境',
    region: '美国/海外',
    tags: ['仿真环境', '波形分析', 'AMS'],
    status: '已整理',
    summary: 'Synopsys 面向模拟/混合信号设计的仿真环境与结果分析工具。',
    detail: '归入模拟仿真，用于组织测试平台、运行仿真、查看波形和分析结果。',
  },
  {
    company: 'Synopsys',
    tool: 'VCS',
    primaryCategory: '数字前端 Digital Front',
    secondaryCategory: '功能验证/前仿真',
    stage: '功能验证',
    region: '美国/海外',
    tags: ['仿真', 'SystemVerilog', '覆盖率'],
    status: '已整理',
    summary: 'Synopsys 数字功能验证仿真器，用于 RTL 仿真、覆盖率和大规模回归。',
    detail: '归入数字前端功能验证/前仿真，并与 Verdi、VC Formal、Verification IP 等验证工具联动。',
  },
  {
    company: 'Synopsys',
    tool: 'Verdi',
    primaryCategory: '数字前端 Digital Front',
    secondaryCategory: '功能验证/前仿真',
    stage: '验证调试',
    region: '美国/海外',
    tags: ['Debug', '波形', '验证调试'],
    status: '已整理',
    summary: 'Synopsys 调试平台，用于 RTL、门级、形式化和仿真结果的可视化调试。',
    detail: '归入功能验证/前仿真相关工具，作为验证调试平台与 VCS、VC Formal、SpyGlass 等工具联动。',
  },
  {
    company: 'Synopsys',
    tool: 'VC Formal',
    primaryCategory: '数字前端 Digital Front',
    secondaryCategory: '形式化验证',
    stage: '形式验证',
    region: '美国/海外',
    tags: ['Formal', '属性验证', 'Sign-off'],
    status: '已整理',
    summary: 'Synopsys 形式化验证平台，用于属性验证、覆盖不可达分析、等价和低功耗形式验证等。',
    detail: '归入数字前端形式化验证，适合记录 FPV、X 传播、连接性、低功耗和安全形式验证能力。',
  },
  {
    company: 'Synopsys',
    tool: 'VC SpyGlass',
    primaryCategory: '数字前端 Digital Front',
    secondaryCategory: 'RTL 编写/检查',
    stage: 'RTL 静态检查',
    region: '美国/海外',
    tags: ['Lint', 'CDC', 'RDC'],
    status: '已整理',
    summary: 'Synopsys RTL 静态签核平台，用于 Lint、CDC、RDC 和早期结构质量检查。',
    detail: '归入 RTL 编写/检查，是前端设计质量、时钟/复位域检查和早期风险发现工具。',
  },
  {
    company: 'Synopsys',
    tool: 'Design Compiler / Design Compiler NXT',
    primaryCategory: '数字前端 Digital Front',
    secondaryCategory: '逻辑综合',
    stage: '逻辑综合',
    region: '美国/海外',
    tags: ['Synthesis', 'RTL-to-gate', 'PPA'],
    status: '已整理',
    summary: 'Synopsys 逻辑综合工具线，用于 RTL 到门级网表转换和时序/面积/功耗优化。',
    detail: '归入逻辑综合，Design Compiler NXT 是 Synopsys 数字工具线的新一代综合产品方向。',
  },
  {
    company: 'Synopsys',
    tool: 'Formality',
    primaryCategory: '数字前端 Digital Front',
    secondaryCategory: '逻辑等价性检查',
    stage: '逻辑验证',
    region: '美国/海外',
    tags: ['LEC', '等价检查', 'ECO'],
    status: '已整理',
    summary: 'Synopsys 形式等价检查工具，用于确认 RTL、综合后网表和 ECO 后设计的一致性。',
    detail: '归入逻辑等价性检查，常用于综合和后端 ECO 流程中的逻辑一致性签核。',
  },
  {
    company: 'Synopsys',
    tool: 'Fusion Compiler',
    primaryCategory: '数字后端 Digital Back',
    secondaryCategory: '布线 Place & Route',
    stage: 'RTL-to-GDSII 实现',
    region: '美国/海外',
    tags: ['RTL-to-GDSII', 'P&R', '数字后端'],
    status: '已整理',
    summary: 'Synopsys 融合式 RTL-to-GDSII 实现平台，覆盖综合、物理实现与内建签核能力。',
    detail: '归入数字后端布线/Place & Route，同时标签标记 RTL-to-GDSII，体现其跨前后端融合特征。',
  },
  {
    company: 'Synopsys',
    tool: 'IC Compiler II',
    primaryCategory: '数字后端 Digital Back',
    secondaryCategory: '布线 Place & Route',
    stage: '物理实现',
    region: '美国/海外',
    tags: ['P&R', '布局布线', '数字后端'],
    status: '已整理',
    summary: 'Synopsys 数字物理实现工具，用于先进节点 SoC 的布局、布线和物理优化。',
    detail: '归入数字后端布线/Place & Route，可与 PrimeTime、StarRC、PrimePower 等签核工具联动。',
  },
  {
    company: 'Synopsys',
    tool: 'PrimeTime',
    primaryCategory: '数字后端 Digital Back',
    secondaryCategory: '时序收敛和 Sign-off',
    stage: '时序签核',
    region: '美国/海外',
    tags: ['STA', 'Timing', 'Sign-off'],
    status: '已整理',
    summary: 'Synopsys 静态时序分析和时序签核工具。',
    detail: '归入时序收敛和 Sign-off，用于多模式多角时序分析、ECO 支持和签核收敛。',
  },
  {
    company: 'Synopsys',
    tool: 'StarRC',
    primaryCategory: '数字后端 Digital Back',
    secondaryCategory: '参数提取',
    stage: '寄生提取',
    region: '美国/海外',
    tags: ['PEX', 'RC Extraction', 'Sign-off'],
    status: '已整理',
    summary: 'Synopsys 签核级寄生参数提取工具，用于先进节点数字和定制设计。',
    detail: '归入参数提取，可与 PrimeTime、PrimePower、Custom Compiler 等流程配合。',
  },
  {
    company: 'Synopsys',
    tool: 'PrimePower',
    primaryCategory: '数字后端 Digital Back',
    secondaryCategory: '功耗分析 Power Analysis',
    stage: '功耗分析',
    region: '美国/海外',
    tags: ['Power', 'RTL-to-signoff', '低功耗'],
    status: '已整理',
    summary: 'Synopsys 功耗分析工具，覆盖从 RTL 到实现和签核阶段的功耗估算与分析。',
    detail: '归入功耗分析 Power Analysis，适合记录功耗评估、低功耗优化和签核衔接。',
  },
  {
    company: 'Synopsys',
    tool: 'RedHawk-SC',
    primaryCategory: '数字后端 Digital Back',
    secondaryCategory: 'IR Drop Analysis',
    stage: '电源完整性签核',
    region: '美国/海外',
    tags: ['IR Drop', 'EM', 'Power Integrity'],
    status: '已整理',
    summary: 'Synopsys 电源完整性和多物理场签核平台，用于 IR drop、EM 和相关可靠性分析。',
    detail: '归入 IR Drop Analysis，可服务数字设计电源完整性签核与多物理场分析。',
  },
  {
    company: 'Synopsys',
    tool: 'IC Validator',
    primaryCategory: '数字后端 Digital Back',
    secondaryCategory: 'DRC',
    stage: '物理验证',
    region: '美国/海外',
    tags: ['DRC', 'LVS', 'Physical Verification'],
    status: '已整理',
    summary: 'Synopsys 物理验证工具，用于 DRC、LVS 等版图签核检查。',
    detail: '按主用途归入 DRC，同时通过标签支持 LVS、物理验证和签核相关检索。',
  },
  {
    company: 'Synopsys',
    tool: 'TestMAX DFT',
    primaryCategory: '数字后端 Digital Back',
    secondaryCategory: 'DFT',
    stage: '可测性设计',
    region: '美国/海外',
    tags: ['DFT', 'ATPG', '测试'],
    status: '已整理',
    summary: 'Synopsys DFT 工具，用于扫描链、测试压缩、ATPG 和制造测试相关流程。',
    detail: '归入数字后端 DFT，适合记录测试结构、测试覆盖率、ATPG 和后硅诊断能力。',
  },
  {
    company: 'Synopsys',
    tool: 'Synplify',
    primaryCategory: 'FPGA',
    secondaryCategory: '高阶综合',
    stage: 'FPGA 综合',
    region: '美国/海外',
    tags: ['FPGA', 'Synthesis', 'RTL'],
    status: '已整理',
    summary: 'Synopsys FPGA 逻辑综合工具，支持多家 FPGA 架构和高可靠设计需求。',
    detail: '归入 FPGA 高阶综合/综合相关条目，后续可按 FPGA 综合与 HLS 进一步拆分。',
  },
  {
    company: 'Synopsys',
    tool: 'HAPS',
    primaryCategory: 'FPGA',
    secondaryCategory: '与系统协同',
    stage: '原型验证',
    region: '美国/海外',
    tags: ['FPGA Prototyping', '软件开发', 'SoC 验证'],
    status: '已整理',
    summary: 'Synopsys FPGA 原型验证平台，用于 SoC 原型、早期软件开发和系统验证。',
    detail: '归入 FPGA 与系统协同，适合记录原型验证容量、调试和软硬件协同能力。',
  },
  {
    company: 'Synopsys',
    tool: 'ZeBu',
    primaryCategory: '数字前端 Digital Front',
    secondaryCategory: 'FPGA 验证',
    stage: '硬件仿真/加速验证',
    region: '美国/海外',
    tags: ['Emulation', 'SoC 验证', '软件验证'],
    status: '已整理',
    summary: 'Synopsys 硬件仿真平台，用于大规模 SoC 验证和软件 bring-up。',
    detail: '按当前分类归入数字前端 FPGA 验证附近，并用标签标记为 emulation。',
  },
  {
    company: 'Synopsys',
    tool: 'Sentaurus TCAD',
    primaryCategory: '工艺开发 Foundry',
    secondaryCategory: 'TCAD',
    stage: '工艺/器件仿真',
    region: '美国/海外',
    tags: ['TCAD', '工艺仿真', '器件仿真'],
    status: '已整理',
    summary: 'Synopsys TCAD 产品族，用于半导体工艺、器件、互连和 DTCO 相关仿真。',
    detail: '归入 Foundry TCAD，适合记录 Sentaurus Process、Device、Workbench 等工艺开发工具。',
  },
  {
    company: 'Synopsys',
    tool: 'Proteus OPC / ILT / LRC',
    primaryCategory: '工艺开发 Foundry',
    secondaryCategory: 'OPC',
    stage: '光刻/掩模优化',
    region: '美国/海外',
    tags: ['OPC', 'ILT', 'Mask'],
    status: '已整理',
    summary: 'Synopsys 面向光学邻近效应校正、反演光刻和掩模验证的制造工具线。',
    detail: '归入 Foundry OPC，适合记录光刻校正、热点检测、掩模验证和制造可行性相关能力。',
  },
  {
    company: 'Synopsys',
    tool: 'QuantumATK',
    primaryCategory: '工艺开发 Foundry',
    secondaryCategory: '建模软件',
    stage: '材料/器件建模',
    region: '美国/海外',
    tags: ['材料建模', 'Atomic-scale', 'TCAD'],
    status: '已整理',
    summary: 'Synopsys 原子尺度材料和器件建模工具，用于新材料和器件结构探索。',
    detail: '归入 Foundry 建模软件，适合记录材料筛选、输运机制分析和 TCAD 前期建模。',
  },
  {
    company: 'Synopsys',
    tool: 'Mystic',
    primaryCategory: '工艺开发 Foundry',
    secondaryCategory: '模型验证软件',
    stage: 'TCAD-to-SPICE',
    region: '美国/海外',
    tags: ['SPICE Model', '模型提取', 'DTCO'],
    status: '已整理',
    summary: 'Synopsys 从 TCAD 输出提取紧凑模型参数的工具，用于工艺到电路模型衔接。',
    detail: '归入模型验证/模型提取相关条目，适合记录 TCAD-to-SPICE 和 DTCO 流程。',
  },
  {
    company: '华大九天',
    tool: 'Empyrean Aether',
    primaryCategory: '模拟 Analog',
    secondaryCategory: 'Schematic',
    stage: '全定制设计',
    region: '中国/国产',
    tags: ['全定制', '原理图', '版图编辑'],
    status: '官网整理',
    summary: '华大九天全定制设计平台，覆盖模拟 IC 原理图与版图设计环境。',
    detail: '官网将 Aether 列入模拟电路设计全流程 EDA 工具系统，可与 ALPS、Argus、RCExplorer 等工具协同。',
    sourceUrl: 'https://www.empyrean.com.cn/product/eda.html',
  },
  {
    company: '华大九天',
    tool: 'Empyrean ALPS',
    primaryCategory: '模拟 Analog',
    secondaryCategory: 'Simulation',
    stage: '模拟仿真',
    region: '中国/国产',
    tags: ['SPICE', '电路仿真', 'AMS'],
    status: '官网整理',
    summary: '华大九天电路仿真工具，用于模拟、存储、射频和平板显示等场景。',
    detail: '官网将 ALPS 列为模拟电路设计全流程、存储电路设计全流程和射频电路设计解决方案中的电路仿真工具。',
    sourceUrl: 'https://www.empyrean.com.cn/products/eda/analog-design/spice-simulator.html',
  },
  {
    company: '华大九天',
    tool: 'Empyrean ALPS RF',
    primaryCategory: '模拟 Analog',
    secondaryCategory: 'Simulation',
    stage: '射频仿真',
    region: '中国/国产',
    tags: ['RF', 'SPICE RF', '射频电路'],
    status: '官网整理',
    summary: '面向射频电路的高效 SPICE RF 仿真器。',
    detail: '官网射频电路设计全流程工具系统包括射频模型提取、原理图/版图、RF 仿真和物理验证等环节。',
    sourceUrl: 'https://www.empyrean.com.cn/products/eda/rf-ic.html',
  },
  {
    company: '华大九天',
    tool: 'Empyrean Argus',
    primaryCategory: '数字后端 Digital Back',
    secondaryCategory: 'DRC',
    stage: '物理验证',
    region: '中国/国产',
    tags: ['DRC', 'LVS', '物理验证'],
    status: '官网整理',
    summary: '华大九天物理验证工具，服务模拟、存储、射频和平板显示设计流程。',
    detail: '官网将物理验证工具列入多个全流程 EDA 工具系统，适合归入 DRC/LVS 物理验证类。',
    sourceUrl: 'https://www.empyrean.com.cn/product/eda.html',
  },
  {
    company: '华大九天',
    tool: 'Empyrean RCExplorer',
    primaryCategory: '数字后端 Digital Back',
    secondaryCategory: '参数提取',
    stage: '寄生参数提取',
    region: '中国/国产',
    tags: ['PEX', 'RC Extraction', '后仿真'],
    status: '官网整理',
    summary: '华大九天寄生参数提取工具，用于版图后仿真和签核相关流程。',
    detail: '官网将寄生参数提取工具列入模拟、存储和平板显示电路设计全流程。',
    sourceUrl: 'https://www.empyrean.com.cn/product/eda.html',
  },
  {
    company: '华大九天',
    tool: 'Empyrean Patron',
    primaryCategory: '数字后端 Digital Back',
    secondaryCategory: 'IR Drop Analysis',
    stage: '晶体管级电源完整性',
    region: '中国/国产',
    tags: ['EM/IR', 'Power Integrity', '晶体管级'],
    status: '官网整理',
    summary: '晶体管级电源完整性分析工具，用于动态 EM/IR、自热和多状态分析。',
    detail: '官网客户评价中提到 Patron 具备动态 EM/IR、自热效应和多状态 EM/IR 分析能力。',
    sourceUrl: 'https://www.empyrean.com.cn/product/eda.html',
  },
  {
    company: '华大九天',
    tool: 'Empyrean Polas',
    primaryCategory: '数字后端 Digital Back',
    secondaryCategory: '功耗分析 Power Analysis',
    stage: '功率器件可靠性分析',
    region: '中国/国产',
    tags: ['Power IC', '可靠性', 'Rdson'],
    status: '官网整理',
    summary: '面向功率器件和电源芯片的可靠性分析工具。',
    detail: '官网将 Polas 列入功率器件可靠性分析工具，客户评价提到可用于 Rdson 和 EM 分析。',
    sourceUrl: 'https://www.empyrean.com.cn/product/eda.html',
  },
  {
    company: '华大九天',
    tool: 'Empyrean Liberal',
    primaryCategory: '工艺开发 Foundry',
    secondaryCategory: '标准单元库特征化',
    stage: '库特征化',
    region: '中国/国产',
    tags: ['Std Cell', 'Library', 'Characterization'],
    status: '官网整理',
    summary: '标准单元库、存储器和 IP 特征化工具。',
    detail: '官网数字 SoC 设计解决方案中列出 Liberal，用于 Std. Cell、Mem、IP Characterization。',
    sourceUrl: 'https://www.empyrean.com.cn/product/eda.html',
  },
  {
    company: '华大九天',
    tool: 'Empyrean Qualib',
    primaryCategory: '工艺开发 Foundry',
    secondaryCategory: '模型验证软件',
    stage: '标准单元库/IP 验证',
    region: '中国/国产',
    tags: ['Library QA', 'IP Validation', '标准单元库'],
    status: '官网整理',
    summary: '标准单元库和 IP 质量验证工具。',
    detail: '官网数字 SoC 设计解决方案和 Foundry EDA 解决方案中均包含单元库/IP 质量验证能力。',
    sourceUrl: 'https://www.empyrean.com.cn/product/eda.html',
  },
  {
    company: '华大九天',
    tool: 'Empyrean ICExplorer-XTop',
    primaryCategory: '数字后端 Digital Back',
    secondaryCategory: '时序收敛和 Sign-off',
    stage: '时序功耗优化',
    region: '中国/国产',
    tags: ['Timing', 'Power', 'Optimization'],
    status: '官网整理',
    summary: '用于数字 SoC 设计的时序与功耗优化工具。',
    detail: '官网数字 SoC 设计解决方案列出 ICExplorer-XTop，定位为 Timing and Power Optimization。',
    sourceUrl: 'https://www.empyrean.com.cn/product/eda.html',
  },
  {
    company: '华大九天',
    tool: 'Empyrean Skipper',
    primaryCategory: '数字后端 Digital Back',
    secondaryCategory: 'GDSII Tape Out',
    stage: '版图集成与分析',
    region: '中国/国产',
    tags: ['Layout', 'GDS', '版图分析'],
    status: '官网整理',
    summary: '版图集成及分析工具，服务超大规模版图浏览、集成和问题定位。',
    detail: '官网数字 SoC 和 Foundry EDA 解决方案中列出 Skipper，用于 Layout Integration and Analysis。',
    sourceUrl: 'https://www.empyrean.com.cn/product/eda.html',
  },
  {
    company: '华大九天',
    tool: 'Empyrean Formal MC',
    primaryCategory: '数字前端 Digital Front',
    secondaryCategory: '形式化验证',
    stage: '形式化属性验证',
    region: '中国/国产',
    tags: ['Formal', '属性验证', '数字验证'],
    status: '官网整理',
    summary: '形式化属性验证工具，支持通用硬件设计语言和常用断言语言。',
    detail: '官网介绍 Formal MC 具备形式化验证引擎和验证策略，覆盖空泛性检查、功能覆盖率分析等。',
    sourceUrl: 'https://www.empyrean.com.cn/products/eda/digital-soc/formal-property-verification.html',
  },
  {
    company: '华大九天',
    tool: '先进封装自动布线工具',
    primaryCategory: '先进封装 Advanced Packaging',
    secondaryCategory: '先进封装自动布线',
    stage: '先进封装设计',
    region: '中国/国产',
    tags: ['Advanced Packaging', 'Routing', '封装'],
    status: '官网整理',
    summary: '华大九天先进封装设计 EDA 工具中的自动布线能力。',
    detail: '官网先进封装设计 EDA 工具包括先进封装自动布线工具和先进封装物理验证工具。',
    sourceUrl: 'https://www.empyrean.com.cn/product/eda.html',
  },
  {
    company: '华大九天',
    tool: '先进封装物理验证工具',
    primaryCategory: '先进封装 Advanced Packaging',
    secondaryCategory: '先进封装物理验证',
    stage: '先进封装验证',
    region: '中国/国产',
    tags: ['Advanced Packaging', 'Physical Verification', '封装'],
    status: '官网整理',
    summary: '华大九天面向先进封装设计的物理验证工具。',
    detail: '归入扩展的先进封装分类，用于承接官网中不完全属于传统 PCB 或数字后端的封装 EDA 能力。',
    sourceUrl: 'https://www.empyrean.com.cn/product/eda.html',
  },
  {
    company: '概伦电子',
    tool: 'BSIMProPlus',
    primaryCategory: '工艺开发 Foundry',
    secondaryCategory: '建模软件',
    stage: 'SPICE 模型建模',
    region: '中国/国产',
    tags: ['SPICE Model', '基带建模', '制造类 EDA'],
    status: '官网整理',
    summary: '概伦电子制造类 EDA 中的基带 SPICE 建模工具。',
    detail: '官网产品与技术将 BSIMProPlus 放在制造类 EDA 的 SPICE 模型/基带建模方向。',
    sourceUrl: 'https://www.primarius-tech.com/',
  },
  {
    company: '概伦电子',
    tool: 'MeQLab',
    primaryCategory: '工艺开发 Foundry',
    secondaryCategory: '建模软件',
    stage: '射频建模',
    region: '中国/国产',
    tags: ['RF Model', 'SPICE 模型', '制造类 EDA'],
    status: '官网整理',
    summary: '概伦电子用于射频模型建模的制造类 EDA 工具。',
    detail: '官网产品结构中 MeQLab 位于 SPICE 模型下的射频建模方向。',
    sourceUrl: 'https://www.primarius-tech.com/',
  },
  {
    company: '概伦电子',
    tool: 'PCellLab',
    primaryCategory: '工艺开发 Foundry',
    secondaryCategory: 'PDK 开发',
    stage: 'PCell 开发',
    region: '中国/国产',
    tags: ['PDK', 'PCell', '制造类 EDA'],
    status: '官网整理',
    summary: '概伦电子 PDK 工具中的 PCell 开发产品。',
    detail: '官网将 PCellLab 放在制造类 EDA 的 PDK/PCell 开发方向。',
    sourceUrl: 'https://www.primarius-tech.com/',
  },
  {
    company: '概伦电子',
    tool: 'PQLab',
    primaryCategory: '工艺开发 Foundry',
    secondaryCategory: 'PDK 验证',
    stage: 'PDK 验证',
    region: '中国/国产',
    tags: ['PDK', 'Quality', 'Verification'],
    status: '官网整理',
    summary: '概伦电子 PDK 验证工具。',
    detail: '官网将 PQLab 放在制造类 EDA 的 PDK 验证方向。',
    sourceUrl: 'https://www.primarius-tech.com/',
  },
  {
    company: '概伦电子',
    tool: 'NanoDesigner SE',
    primaryCategory: '模拟 Analog',
    secondaryCategory: 'Schematic',
    stage: '原理图设计',
    region: '中国/国产',
    tags: ['Schematic', '泛模拟', '电路设计平台'],
    status: '官网整理',
    summary: '概伦电子泛模拟设计类 EDA 中的原理图设计工具。',
    detail: '官网将 NanoDesigner SE 归入泛模拟设计类 EDA 的电路设计平台/原理图设计。',
    sourceUrl: 'https://www.primarius-tech.com/',
  },
  {
    company: '概伦电子',
    tool: 'NanoDesigner LS',
    primaryCategory: '模拟 Analog',
    secondaryCategory: 'Layout',
    stage: '版图编辑',
    region: '中国/国产',
    tags: ['Layout', '泛模拟', '电路设计平台'],
    status: '官网整理',
    summary: '概伦电子泛模拟设计类 EDA 中的版图编辑工具。',
    detail: '官网将 NanoDesigner LS 归入电路设计平台/版图编辑方向。',
    sourceUrl: 'https://www.primarius-tech.com/',
  },
  {
    company: '概伦电子',
    tool: 'NanoSpice / NanoSpice X / NanoSpice Giga',
    primaryCategory: '模拟 Analog',
    secondaryCategory: 'Simulation',
    stage: 'SPICE 仿真',
    region: '中国/国产',
    tags: ['SPICE', 'FastSPICE', '混合信号'],
    status: '官网整理',
    summary: '概伦电子 NanoSpice 系列电路仿真工具，覆盖 SPICE、FastSPICE 与大规模仿真场景。',
    detail: '官网泛模拟设计类 EDA 中列出 NanoSpice、NanoSpice X、NanoSpice Giga、NanoSpice Pro、NanoSpice MS 等仿真产品。',
    sourceUrl: 'https://www.primarius-tech.com/',
  },
  {
    company: '概伦电子',
    tool: 'NanoWave',
    primaryCategory: '模拟 Analog',
    secondaryCategory: 'Simulation',
    stage: '波形查看分析',
    region: '中国/国产',
    tags: ['Waveform', 'Debug', '仿真分析'],
    status: '官网整理',
    summary: '概伦电子用于仿真结果波形查看与分析的工具。',
    detail: '官网将 NanoWave 放在泛模拟设计类 EDA 的电路仿真/波形查看分析方向。',
    sourceUrl: 'https://www.primarius-tech.com/',
  },
  {
    company: '概伦电子',
    tool: 'NanoYield',
    primaryCategory: '数字后端 Digital Back',
    secondaryCategory: '良率分析',
    stage: '良率分析',
    region: '中国/国产',
    tags: ['Yield', '电路分析', '良率'],
    status: '官网整理',
    summary: '概伦电子电路分析工具，用于良率分析。',
    detail: '官网泛模拟设计类 EDA 的电路分析中列出 NanoYield，媒体报道也提及其 EDA 产品奖项。',
    sourceUrl: 'https://www.primarius-tech.com/',
  },
  {
    company: '概伦电子',
    tool: 'VeriSim',
    primaryCategory: '数字验证 / 硬件仿真',
    secondaryCategory: '软件仿真',
    stage: '数字仿真',
    region: '中国/国产',
    tags: ['Digital Simulation', '数字设计', '验证'],
    status: '官网整理',
    summary: '概伦电子数字设计类 EDA 中的数字仿真工具。',
    detail: '官网数字设计类 EDA 的电路仿真方向列出 VeriSim。',
    sourceUrl: 'https://www.primarius-tech.com/',
  },
  {
    company: '概伦电子',
    tool: 'TRASTA',
    primaryCategory: '数字后端 Digital Back',
    secondaryCategory: '时序收敛和 Sign-off',
    stage: '时序分析',
    region: '中国/国产',
    tags: ['STA', 'Timing', 'SoC'],
    status: '官网整理',
    summary: '概伦电子 SoC 设计与验证中的时序分析工具。',
    detail: '官网数字设计类 EDA / SoC 设计与验证中列出 TRASTA 时序分析。',
    sourceUrl: 'https://www.primarius-tech.com/',
  },
  {
    company: '概伦电子',
    tool: 'NavisPro',
    primaryCategory: '数字后端 Digital Back',
    secondaryCategory: '单元布局 FloorPlan',
    stage: '设计布局规划',
    region: '中国/国产',
    tags: ['FloorPlan', 'SoC', '布局规划'],
    status: '官网整理',
    summary: '概伦电子 SoC 设计与验证中的设计布局规划工具。',
    detail: '官网数字设计类 EDA / SoC 设计与验证中列出 NavisPro 设计布局规划。',
    sourceUrl: 'https://www.primarius-tech.com/',
  },
  {
    company: '概伦电子',
    tool: 'FS-Pro / FS-MEMS / FS800',
    primaryCategory: '测试系统 Test System',
    secondaryCategory: '参数化测试',
    stage: '半导体参数测试',
    region: '中国/国产',
    tags: ['测试系统', '参数测试', '量测'],
    status: '官网整理',
    summary: '概伦电子测试系统中的半导体参数测试产品。',
    detail: '官网测试系统产品线中列出 FS-Pro、FS-MEMS、FS800 等参数化测试产品。',
    sourceUrl: 'https://www.primarius-tech.com/',
  },
  {
    company: '概伦电子',
    tool: 'LabExpress / ATS',
    primaryCategory: '测试系统 Test System',
    secondaryCategory: '综合量测',
    stage: '自动量测与电性测试',
    region: '中国/国产',
    tags: ['ATE', '测试软件', '量测'],
    status: '官网整理',
    summary: '概伦电子综合量测产品，覆盖自动量测方案和电性参数测试软件。',
    detail: '官网测试系统中列出 ATS 自动量测方案与 LabExpress 电性参数测试软件。',
    sourceUrl: 'https://www.primarius-tech.com/',
  },
  {
    company: '合见工软',
    tool: 'UVS+',
    primaryCategory: '数字验证 / 硬件仿真',
    secondaryCategory: '软件仿真',
    stage: '数字仿真',
    region: '中国/国产',
    tags: ['Simulator', '数字验证', 'RTL'],
    status: '官网整理',
    summary: '合见工软下一代数字仿真器，属于芯片级 EDA 的软件仿真产品。',
    detail: '官网芯片级 EDA 产品中将 UVS+ 列为下一代数字仿真器。',
    sourceUrl: 'https://www.univista-isg.com/site/product_detail/441',
  },
  {
    company: '合见工软',
    tool: 'UVD+',
    primaryCategory: '数字验证 / 硬件仿真',
    secondaryCategory: '数字调试',
    stage: '数字调试',
    region: '中国/国产',
    tags: ['Debug', '数字验证', '波形调试'],
    status: '官网整理',
    summary: '合见工软下一代数字调试器，服务数字芯片验证调试流程。',
    detail: '官网芯片级 EDA 软件仿真产品组中列出 UVD+。',
    sourceUrl: 'https://www.univista-isg.com/site/product_detail/442',
  },
  {
    company: '合见工软',
    tool: 'VPS',
    primaryCategory: '数字验证 / 硬件仿真',
    secondaryCategory: '验证管理',
    stage: '验证效率管理',
    region: '中国/国产',
    tags: ['Verification Management', '覆盖率', '效率管理'],
    status: '官网整理',
    summary: '合见工软验证效率管理系统。',
    detail: '官网芯片级 EDA 软件仿真产品组中列出 VPS 验证效率管理系统。',
    sourceUrl: 'https://www.univista-isg.com/site/product_detail/9',
  },
  {
    company: '合见工软',
    tool: 'UVHS / UVHS-2',
    primaryCategory: '数字验证 / 硬件仿真',
    secondaryCategory: '硬件仿真',
    stage: '硬件仿真',
    region: '中国/国产',
    tags: ['Hardware Emulation', 'SoC 验证', '加速验证'],
    status: '官网整理',
    summary: '合见工软全场景验证硬件系统及下一代全场景验证硬件系统。',
    detail: '官网芯片级 EDA 硬件仿真产品组中列出 UVHS 和 UVHS-2。',
    sourceUrl: 'https://www.univista-isg.com/site/product_detail/11',
  },
  {
    company: '合见工软',
    tool: 'UVHP',
    primaryCategory: '数字验证 / 硬件仿真',
    secondaryCategory: '硬件仿真',
    stage: '硬件仿真加速',
    region: '中国/国产',
    tags: ['Hardware Acceleration', 'Emulation', '验证'],
    status: '官网整理',
    summary: '合见工软硬件仿真加速验证平台。',
    detail: '官网芯片级 EDA 硬件仿真产品组中列出 UVHP。',
    sourceUrl: 'https://www.univista-isg.com/site/product_detail/350',
  },
  {
    company: '合见工软',
    tool: 'UV APS / PD-AS',
    primaryCategory: '数字验证 / 硬件仿真',
    secondaryCategory: '原型验证',
    stage: '原型验证',
    region: '中国/国产',
    tags: ['FPGA Prototyping', '原型验证', '系统验证'],
    status: '官网整理',
    summary: '合见工软原型验证系统和单系统先进原型验证平台。',
    detail: '官网芯片级 EDA 原型验证产品组中列出 UV APS、PD-AS 和 PD 其他产品系列。',
    sourceUrl: 'https://www.univista-isg.com/site/product_detail/359',
  },
  {
    company: '合见工软',
    tool: 'V-Builder / vSpace',
    primaryCategory: '数字验证 / 硬件仿真',
    secondaryCategory: '虚拟原型',
    stage: '虚拟及混合原型',
    region: '中国/国产',
    tags: ['Virtual Prototype', 'Hybrid Prototype', '软件开发'],
    status: '官网整理',
    summary: '合见工软虚拟原型平台及混合原型解决方案。',
    detail: '官网芯片级 EDA 中将 V-Builder/vSpace 放在虚拟及混合原型解决方案方向。',
    sourceUrl: 'https://www.univista-isg.com/site/product_detail/14',
  },
  {
    company: '合见工软',
    tool: 'Tespert BSCAN / MBIST / ATPG',
    primaryCategory: '数字后端 Digital Back',
    secondaryCategory: 'DFT',
    stage: '可测性设计',
    region: '中国/国产',
    tags: ['DFT', 'BSCAN', 'MBIST', 'ATPG'],
    status: '官网整理',
    summary: '合见工软 Tespert 系列可测性设计软件工具。',
    detail: '官网芯片级 EDA 的可测性设计 DFT 产品组列出 BSCAN、MBIST、ATPG、DIAG、YIELD 等工具。',
    sourceUrl: 'https://www.univista-isg.com/site/product_detail/410',
  },
  {
    company: '合见工软',
    tool: 'Tespert DIAG / YIELD',
    primaryCategory: '测试系统 Test System',
    secondaryCategory: '缺陷诊断',
    stage: '诊断与良率分析',
    region: '中国/国产',
    tags: ['DFT', '诊断', '良率'],
    status: '官网整理',
    summary: '合见工软缺陷诊断与良率分析工具。',
    detail: '官网芯片级 EDA 的 DFT 产品组中列出 Tespert DIAG 和 Tespert YIELD。',
    sourceUrl: 'https://www.univista-isg.com/site/product_detail/353',
  },
  {
    company: '合见工软',
    tool: 'UDA',
    primaryCategory: '数字验证 / 硬件仿真',
    secondaryCategory: 'AI 平台',
    stage: '数字设计 AI',
    region: '中国/国产',
    tags: ['AI', 'Agentic EDA', '数字设计'],
    status: '官网整理',
    summary: '合见工软数字设计 AI 智能平台。',
    detail: '官网芯片级 EDA 产品中列出 UDA，新闻中也提到智能体 UDA 2.0。',
    sourceUrl: 'https://www.univista-isg.com/site/product_detail/402',
  },
  {
    company: '合见工软',
    tool: 'Archer Schematic',
    primaryCategory: '系统 System',
    secondaryCategory: '系统原理图输入',
    stage: '电子系统设计',
    region: '中国/国产',
    tags: ['Schematic', '系统级 EDA', '电子系统'],
    status: '官网整理',
    summary: '合见工软系统级 EDA 中的原理图设计环境。',
    detail: '官网系统级 EDA / 电子系统设计中列出 Archer Schematic。',
    sourceUrl: 'https://www.univista-isg.com/site/product_detail/326',
  },
  {
    company: '合见工软',
    tool: 'Archer PCB',
    primaryCategory: '封装/电路板 Assembly/PCB',
    secondaryCategory: 'PCB Layout',
    stage: 'PCB 设计',
    region: '中国/国产',
    tags: ['PCB', '系统级 EDA', 'Layout'],
    status: '官网整理',
    summary: '合见工软系统级 EDA 中的 PCB 设计环境。',
    detail: '官网系统级 EDA / 电子系统设计中列出 Archer PCB，首页也作为重点入口展示。',
    sourceUrl: 'https://www.univista-isg.com/site/product_detail/327',
  },
  {
    company: '合见工软',
    tool: 'UVI',
    primaryCategory: '系统 System',
    secondaryCategory: '板间接口和线缆',
    stage: '协同设计',
    region: '中国/国产',
    tags: ['协同设计', '系统级 EDA', '电子系统'],
    status: '官网整理',
    summary: '合见工软协同设计平台。',
    detail: '官网系统级 EDA / 协同设计中列出 UVI，适合归入系统级协同设计和接口连接类。',
    sourceUrl: 'https://www.univista-isg.com/site/product_detail/18',
  },
  {
    company: '合见工软',
    tool: 'EDMPro',
    primaryCategory: '封装/电路板 Assembly/PCB',
    secondaryCategory: '数据管理工具 EDM',
    stage: '电子系统研发管理',
    region: '中国/国产',
    tags: ['EDM', '研发管理', '系统级 EDA'],
    status: '官网整理',
    summary: '合见工软电子系统研发管理环境。',
    detail: '官网系统级 EDA 中列出电子系统研发管理环境 EDMPro。',
    sourceUrl: 'https://www.univista-isg.com/site/product_detail/19',
  },
];

const ipTaxonomy = [
  {
    id: 'processor',
    label: '处理器|Processor',
    items: ['CPU', 'DPU', 'GPU', 'NPU', 'VPU', 'DSP', 'TPU', 'eFPGA', 'AI Processor/Accelerator'],
  },
  {
    id: 'foundation',
    label: '基础|Foundation',
    items: ['Standard Cell Library', 'Memory Compilers', 'General Purpose IOs'],
  },
  {
    id: 'analog-mixed',
    label: '模拟和混合信号|Analog & Mixed Signal',
    items: ['ADC', 'DAC', 'CODEC', 'PLL', 'DLL', 'Crystal driver', 'RC/LC OSC', 'DCDC', 'LDO', 'POR/BOR', 'PVT Monitors', 'Amplifier', 'Sensor'],
  },
  {
    id: 'interface',
    label: '接口和总线协议|Interface & BUS Protocol(PHY&Controller)',
    items: ['PCIe', 'SATA', 'AMBA', 'CXL', 'CCIX', 'DDR', 'DP', 'HDMI', 'MIPI', 'XAUI', 'LVDS', 'USB', 'HBM', 'Ethernet', 'Die-to-Die', 'Thread', 'EMMC', 'Mobile Storage', 'Datapath IP(PHY & Controller)'],
  },
  {
    id: 'memory',
    label: '存储与逻辑库|Memory & Logic Library',
    items: ['TCAM Compiler', 'eFlash', 'MTP/OTP', 'SRAM', 'RRAM', 'MRAM', 'FRAM', 'ROM', 'Memory Compilers'],
  },
  {
    id: 'security',
    label: '安全加密|Security',
    items: ['Cryptography Cores', 'PUF', 'tRNG', 'Light/Voltage/Freq.Detector', 'Temperature Sensor'],
  },
  {
    id: 'rf-wireless',
    label: '射频和无线通信|RF & Wireless Communication',
    items: ['3GPP-5G/LTE', 'WiFi', 'Bluetooth', 'Zigbee', 'NB-loT', 'Sub-G', 'RFID', 'NFC', 'UWB', 'CAT-1', 'GPS/北斗'],
  },
  {
    id: 'graphic-multimedia',
    label: '图形处理和多媒体|Graphic & Multimedia',
    items: ['ISP', 'MPEG-4', 'VGA', 'Audio Interfaces', '2D/3D', 'H.263/H.264/h.265/H.266'],
  },
  {
    id: 'automotive',
    label: '汽车电子|Automotive',
    items: ['CAN', 'CAN-FD', 'FlexRay', 'LIN', 'Safe Ethernet'],
  },
];

const ipResources = [
  {
    company: 'Arm',
    tool: 'Cortex-A / Cortex-M 系列',
    primaryCategory: '处理器|Processor',
    secondaryCategory: 'CPU',
    stage: 'SoC 架构与集成',
    region: '英国/海外',
    tags: ['CPU', '低功耗', '生态软件'],
    status: '示例整理',
    summary: 'Arm CPU IP 覆盖高性能应用处理器与低功耗 MCU 场景，是大量 SoC 的通用计算内核来源。',
    detail: '适合作为处理器 IP 条目记录指令集生态、软件工具链、互连与安全扩展，以及授权模式对芯片产品规划的影响。',
    sourceUrl: 'https://www.arm.com/products/silicon-ip-cpu',
  },
  {
    company: 'Arm',
    tool: 'Mali GPU / Ethos NPU',
    primaryCategory: '处理器|Processor',
    secondaryCategory: 'GPU',
    stage: '图形与 AI 加速',
    region: '英国/海外',
    tags: ['GPU', 'NPU', '边缘 AI'],
    status: '示例整理',
    summary: 'Arm 面向移动、嵌入式和边缘设备提供图形与神经网络加速 IP。',
    detail: '可用于记录多媒体 SoC、智能终端和边缘 AI 芯片中的图形渲染、视觉推理和软件栈适配能力。',
    sourceUrl: 'https://www.arm.com/products/silicon-ip-multimedia',
  },
  {
    company: 'Synopsys',
    tool: 'ARC Processor IP',
    primaryCategory: '处理器|Processor',
    secondaryCategory: 'DSP',
    stage: '可配置处理器集成',
    region: '美国/海外',
    tags: ['Configurable CPU', 'DSP', '嵌入式'],
    status: '示例整理',
    summary: 'Synopsys ARC 处理器 IP 面向可配置嵌入式处理和 DSP 场景。',
    detail: '适合记录可配置指令、处理器子系统、软件工具链，以及在存储、连接和低功耗控制芯片中的应用。',
    sourceUrl: 'https://www.synopsys.com/designware-ip/processor-solutions.html',
  },
  {
    company: 'SiFive',
    tool: 'SiFive RISC-V Core IP',
    primaryCategory: '处理器|Processor',
    secondaryCategory: 'CPU',
    stage: '开放指令集处理器',
    region: '美国/海外',
    tags: ['RISC-V', 'CPU', '可定制'],
    status: '示例整理',
    summary: 'SiFive 提供基于 RISC-V 的处理器 IP，覆盖 MCU、应用处理和高性能计算方向。',
    detail: '可用于观察 RISC-V IP 的授权、可扩展指令、生态工具链和面向国产替代或专用芯片的定制空间。',
    sourceUrl: 'https://www.sifive.com/risc-v-core-ip',
  },
  {
    company: 'Cadence',
    tool: 'Tensilica DSP IP',
    primaryCategory: '处理器|Processor',
    secondaryCategory: 'DSP',
    stage: '信号处理加速',
    region: '美国/海外',
    tags: ['DSP', '音频', '视觉'],
    status: '示例整理',
    summary: 'Cadence Tensilica 面向音频、视觉、通信和 AI 推理提供可配置 DSP IP。',
    detail: '适合记录专用信号处理、指令扩展、编译器支持，以及与算法团队协同优化的芯片设计流程。',
    sourceUrl: 'https://www.cadence.com/en_US/home/tools/ip/tensilica-ip.html',
  },
  {
    company: 'Synopsys',
    tool: 'DesignWare PCI Express IP',
    primaryCategory: '接口和总线协议|Interface & BUS Protocol(PHY&Controller)',
    secondaryCategory: 'PCIe',
    stage: '高速互连接口',
    region: '美国/海外',
    tags: ['PCIe', 'Controller', 'PHY'],
    status: '示例整理',
    summary: 'Synopsys DesignWare PCIe IP 覆盖控制器、PHY 与验证资源，是高速互连常用商用 IP。',
    detail: '适合记录不同 PCIe 代际、控制器/PHY 组合、验证 IP 与合规测试需求。',
    sourceUrl: 'https://www.synopsys.com/designware-ip/interface-ip/pci-express.html',
  },
  {
    company: 'Cadence',
    tool: 'Cadence PCIe / USB / Ethernet IP',
    primaryCategory: '接口和总线协议|Interface & BUS Protocol(PHY&Controller)',
    secondaryCategory: 'PCIe',
    stage: '协议接口集成',
    region: '美国/海外',
    tags: ['PCIe', 'USB', 'Ethernet'],
    status: '示例整理',
    summary: 'Cadence 提供多类接口 IP，覆盖常见高速协议控制器、PHY 和验证模型。',
    detail: '用于归档接口 IP 的协议版本、控制器能力、PHY 工艺适配和系统验证资源。',
    sourceUrl: 'https://www.cadence.com/en_US/home/tools/ip.html',
  },
  {
    company: 'Rambus',
    tool: 'DDR / HBM Memory Interface IP',
    primaryCategory: '存储与逻辑库|Memory & Logic Library',
    secondaryCategory: 'Memory Compilers',
    stage: '高带宽存储接口',
    region: '美国/海外',
    tags: ['DDR', 'HBM', 'PHY'],
    status: '示例整理',
    summary: 'Rambus 面向高性能 SoC 提供 DDR、GDDR、HBM 等存储接口 IP。',
    detail: '适合记录存储带宽、PHY 工艺节点、控制器兼容性和数据中心/AI 芯片中的接口需求。',
    sourceUrl: 'https://www.rambus.com/interface-ip/',
  },
  {
    company: 'Synopsys',
    tool: 'DesignWare DDR Controller / PHY',
    primaryCategory: '存储与逻辑库|Memory & Logic Library',
    secondaryCategory: 'Memory Compilers',
    stage: '外部存储控制',
    region: '美国/海外',
    tags: ['DDR', 'Controller', 'PHY'],
    status: '示例整理',
    summary: 'Synopsys DDR IP 提供控制器、PHY 与验证环境，服务高性能 SoC 外部存储接口。',
    detail: '可用于记录 DDR5/LPDDR/HBM 等存储协议、功耗模式、训练校准和一致性验证需求。',
    sourceUrl: 'https://www.synopsys.com/designware-ip/interface-ip/ddr.html',
  },
  {
    company: 'eMemory',
    tool: 'NeoFuse / NeoMTP NVM IP',
    primaryCategory: '存储与逻辑库|Memory & Logic Library',
    secondaryCategory: 'eFlash',
    stage: '嵌入式非易失存储',
    region: '中国台湾/国产生态',
    tags: ['NVM', 'eFlash', 'OTP/MTP'],
    status: '示例整理',
    summary: 'eMemory 提供嵌入式非易失存储 IP，用于芯片配置、校准、安全和少量数据保存。',
    detail: '适合记录一次性可编程、多次可编程、可靠性、工艺适配及与安全启动/密钥存储的关系。',
    sourceUrl: 'https://www.ememory.com.tw/en-US/Products',
  },
  {
    company: 'Rambus',
    tool: 'Root of Trust / Crypto IP',
    primaryCategory: '安全加密|Security',
    secondaryCategory: 'Cryptography Cores',
    stage: '芯片安全子系统',
    region: '美国/海外',
    tags: ['RoT', 'Crypto', 'Secure Boot'],
    status: '示例整理',
    summary: 'Rambus 安全 IP 覆盖硬件信任根、密码引擎和密钥保护能力。',
    detail: '可用于记录安全启动、固件认证、密钥管理、防篡改和面向车规/数据中心的安全合规需求。',
    sourceUrl: 'https://www.rambus.com/security/',
  },
  {
    company: 'Synopsys',
    tool: 'Security IP for SoC',
    primaryCategory: '安全加密|Security',
    secondaryCategory: 'Cryptography Cores',
    stage: '数据保护与认证',
    region: '美国/海外',
    tags: ['Crypto', 'TRNG', 'Security'],
    status: '示例整理',
    summary: 'Synopsys 安全 IP 包含密码、随机数、安全协议和保护模块。',
    detail: '适合记录算法覆盖、侧信道防护、密钥生命周期和与处理器/存储子系统的集成边界。',
    sourceUrl: 'https://www.synopsys.com/designware-ip/security-ip.html',
  },
  {
    company: '芯原股份',
    tool: 'Vivante GPU / NPU IP',
    primaryCategory: '处理器|Processor',
    secondaryCategory: 'GPU',
    stage: '图形与 AI 加速',
    region: '中国/国产',
    tags: ['GPU', 'NPU', '视觉处理'],
    status: '示例整理',
    summary: '芯原提供图形处理器、神经网络处理器和视频处理相关 IP，服务 SoC 平台化设计。',
    detail: '适合作为国产 IP 厂商样本，记录 GPU/NPU、VPU、显示处理和芯片定制服务之间的组合能力。',
    sourceUrl: 'https://www.verisilicon.com/en/IPPortfolio',
  },
  {
    company: '芯原股份',
    tool: 'Video Processor / Display Processor IP',
    primaryCategory: '模拟和混合信号|Analog & Mixed Signal',
    secondaryCategory: 'Sensor',
    stage: '多媒体子系统',
    region: '中国/国产',
    tags: ['Video', 'Display', 'Camera'],
    status: '示例整理',
    summary: '芯原多媒体 IP 面向视频编解码、图像信号处理和显示管线。',
    detail: '当前归入传感与多媒体接口，后续可单独拆为多媒体 IP 分类，便于研究智能终端与边缘视觉芯片。',
    sourceUrl: 'https://www.verisilicon.com/en/IPPortfolio',
  },
  {
    company: '芯动科技',
    tool: 'SerDes / DDR / PCIe IP',
    primaryCategory: '接口和总线协议|Interface & BUS Protocol(PHY&Controller)',
    secondaryCategory: 'Datapath IP(PHY & Controller)',
    stage: '高速接口与物理层',
    region: '中国/国产',
    tags: ['SerDes', 'DDR', 'PCIe'],
    status: '示例整理',
    summary: '芯动科技提供高速混合信号 IP，覆盖 SerDes、DDR、PCIe 等接口方向。',
    detail: '适合记录国产高速 PHY IP 的工艺节点、量产案例、协议覆盖和高性能芯片集成价值。',
    sourceUrl: 'https://www.innosilicon.com/',
  },
  {
    company: '芯动科技',
    tool: 'GPU IP',
    primaryCategory: '处理器|Processor',
    secondaryCategory: 'GPU',
    stage: '图形处理与显示',
    region: '中国/国产',
    tags: ['GPU', '国产 IP', '图形处理'],
    status: '示例整理',
    summary: '芯动科技布局国产 GPU IP，可服务图形显示、桌面和嵌入式图形处理需求。',
    detail: '适合跟踪国产 GPU IP 在生态驱动、性能档位、应用场景和 SoC 集成中的成熟度。',
    sourceUrl: 'https://www.innosilicon.com/',
  },
  {
    company: '灿芯股份',
    tool: 'SerDes / DDR / Analog IP',
    primaryCategory: '模拟和混合信号|Analog & Mixed Signal',
    secondaryCategory: 'PLL',
    stage: '定制芯片 IP 集成',
    region: '中国/国产',
    tags: ['SerDes', 'DDR', 'Analog IP'],
    status: '示例整理',
    summary: '灿芯在一站式芯片定制服务中提供接口、模拟和基础 IP 支持。',
    detail: '可作为 IP 与 ASIC 设计服务结合的样本，记录自有 IP、工艺平台和客户定制交付之间的关系。',
    sourceUrl: 'https://www.brite-semi.com/',
  },
  {
    company: 'Synopsys',
    tool: 'DesignWare Foundation IP',
    primaryCategory: '基础|Foundation',
    secondaryCategory: 'Standard Cell Library',
    stage: '工艺平台基础库',
    region: '美国/海外',
    tags: ['Foundation IP', 'Std Cell', 'I/O'],
    status: '示例整理',
    summary: 'Synopsys Foundation IP 覆盖标准单元库、存储器编译器和通用基础库。',
    detail: '用于记录不同工艺节点上的基础库、低功耗变体、编译器和 SoC 后端实现所需的工艺绑定资源。',
    sourceUrl: 'https://www.synopsys.com/designware-ip/foundation-ip.html',
  },
  {
    company: 'Cadence',
    tool: 'Verification IP Portfolio',
    primaryCategory: '接口和总线协议|Interface & BUS Protocol(PHY&Controller)',
    secondaryCategory: 'Datapath IP(PHY & Controller)',
    stage: '协议验证与合规',
    region: '美国/海外',
    tags: ['VIP', 'UVM', 'Protocol'],
    status: '示例整理',
    summary: 'Cadence 验证 IP 支持常见协议的测试平台、检查器和覆盖模型。',
    detail: '适合记录接口 IP 导入后的协议验证、合规套件、覆盖率收敛和仿真/硬件仿真复用能力。',
    sourceUrl: 'https://www.cadence.com/en_US/home/tools/system-design-and-verification/verification-ip.html',
  },
  {
    company: 'Synopsys',
    tool: 'Verification IP for Protocols',
    primaryCategory: '接口和总线协议|Interface & BUS Protocol(PHY&Controller)',
    secondaryCategory: 'Datapath IP(PHY & Controller)',
    stage: '协议验证与合规',
    region: '美国/海外',
    tags: ['VIP', 'Compliance', 'Protocol'],
    status: '示例整理',
    summary: 'Synopsys VIP 覆盖多类接口协议，支持仿真、形式验证和硬件辅助验证流程。',
    detail: '可用于跟踪协议覆盖、参考测试、UVM 集成和与 DesignWare 接口 IP 的协同验证。',
    sourceUrl: 'https://www.synopsys.com/verification/verification-ip.html',
  },
  {
    company: '华大九天',
    tool: 'Qualib 标准单元库/IP 验证',
    primaryCategory: '基础|Foundation',
    secondaryCategory: 'Standard Cell Library',
    stage: 'IP 质量验证',
    region: '中国/国产',
    tags: ['Library QA', 'IP Validation', '国产 EDA'],
    status: '示例整理',
    summary: '华大九天 Qualib 面向标准单元库与 IP 的质量验证，可作为基础 IP 质量流程样本。',
    detail: '虽然它本身属于 EDA 工具，但与 IP 入库、库质量评估和 Foundry/设计公司交付流程强相关。',
    sourceUrl: 'https://www.empyrean.com.cn/product/eda.html',
  },
];

const companyVisuals = {
  Cadence: cadenceLogo,
  Synopsys: synopsysLogo,
  '华大九天': empyreanLogo,
  '概伦电子': primariusLogo,
  '合见工软': univistaLogo,
};

const companySourceUrls = {
  Cadence: 'https://www.cadence.com/en_US/home/tools.html',
  Synopsys: 'https://www.synopsys.com/products.html',
  '华大九天': 'https://www.empyrean.com.cn/product/eda.html',
  '概伦电子': 'https://www.primarius-tech.com/',
  '合见工软': 'https://www.univista-isg.com/',
  Arm: 'https://www.arm.com/products/silicon-ip',
  SiFive: 'https://www.sifive.com/risc-v-core-ip',
  Rambus: 'https://www.rambus.com/interface-ip/',
  eMemory: 'https://www.ememory.com.tw/en-US/Products',
  '芯原股份': 'https://www.verisilicon.com/en/IPPortfolio',
  '芯动科技': 'https://www.innosilicon.com/',
  '灿芯股份': 'https://www.brite-semi.com/',
};

const RESULTS_PAGE_SIZE = 8;

const libraryConfigs = {
  eda: {
    resourceName: 'EDA',
    accentColor: '#8bffcf',
    accentRgb: '139 255 207',
    contrastColor: '#07140f',
    eyebrow: 'EDA RESOURCE LIBRARY',
    title: 'EDA 资源库',
    description: '面向产业研究的 EDA 资源框架，先沉淀工具类型、流程阶段、地域样本与典型能力，后续可替换为真实产业数据。',
    taxonomy: edaTaxonomy,
    resources: edaResources,
    metricResourceLabel: '示例资源',
    metricCompanyLabel: 'EDA 企业',
    searchPlaceholder: '搜索公司、工具、分类、阶段或标签',
  },
  ip: {
    resourceName: 'IP',
    accentColor: '#a995ff',
    accentRgb: '169 149 255',
    contrastColor: '#100b2d',
    eyebrow: 'IP RESOURCE LIBRARY',
    title: 'IP 资源库',
    description: '围绕可复用芯片功能模块沉淀处理器、接口、存储、安全、模拟混合信号与基础库资源，支持从架构选型到集成验证的产业研究。',
    taxonomy: ipTaxonomy,
    resources: ipResources,
    metricResourceLabel: 'IP 样本',
    metricCompanyLabel: 'IP 企业',
    searchPlaceholder: '搜索公司、IP、协议、分类、阶段或标签',
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
    searchPlaceholder,
  } = config;
  const [query, setQuery] = useState('');
  const [activePrimary, setActivePrimary] = useState('全部');
  const [activeSecondary, setActiveSecondary] = useState('全部');
  const [companyFilter, setCompanyFilter] = useState('全部');
  const [regionFilter, setRegionFilter] = useState('全部');
  const [stageFilter, setStageFilter] = useState('全部');
  const [toolTypeFilter, setToolTypeFilter] = useState('全部');
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
    const getOptions = (key) => ['全部', ...Array.from(new Set(resources.map((resource) => resource[key])))];

    return {
      companies: getOptions('company'),
      regions: getOptions('region'),
      stages: getOptions('stage'),
      toolTypes: getOptions('secondaryCategory'),
    };
  }, [resources]);

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
      const searchable = [
        resource.company,
        resource.tool,
        resource.primaryCategory,
        resource.secondaryCategory,
        resource.stage,
        resource.region,
        resource.summary,
        resource.detail,
        resource.sourceUrl,
        companySourceUrls[resource.company],
        ...resource.tags,
      ].join(' ').toLowerCase();

      return (
        matchesPrimary &&
        matchesSecondary &&
        matchesCompany &&
        matchesRegion &&
        matchesStage &&
        matchesToolType &&
        (!keyword || searchable.includes(keyword))
      );
    });
  }, [activePrimary, activeSecondary, companyFilter, query, regionFilter, resources, stageFilter, toolTypeFilter]);

  const companyCount = new Set(resources.map((resource) => resource.company)).size;
  const secondaryCategoryCount = taxonomy.reduce((count, category) => count + category.items.length, 0);
  const sortedResources = useMemo(() => {
    const next = [...filteredResources];
    if (sortMode === 'company') {
      next.sort((left, right) => `${left.company}${left.tool}`.localeCompare(`${right.company}${right.tool}`, 'zh-Hans-CN'));
    }
    if (sortMode === 'stage') {
      next.sort((left, right) => `${left.stage}${left.company}`.localeCompare(`${right.stage}${right.company}`, 'zh-Hans-CN'));
    }
    return next;
  }, [filteredResources, sortMode]);
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
  const getResourceVisual = (resource) => resource.imageUrl || companyVisuals[resource.company];
  const getResourceSourceUrl = (resource) => resource.sourceUrl || companySourceUrls[resource.company];
  const getResourceChips = (resource) => [resource.secondaryCategory, resource.stage, resource.region];
  const getApplicationText = (resource) => resource.tags.slice(0, 3).join('、');
  const getCompanyInitials = (company) => company
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const getStageFlow = (resource) => {
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
          <p>{description}</p>
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
            <span>{taxonomy.length}</span>
            <p>一级分类</p>
          </div>
          <div>
            <span>{secondaryCategoryCount}</span>
            <p>二级条目</p>
          </div>
        </section>

        <section className="library-layout">
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
                <strong>{taxonomy.length}</strong>
              </button>

              {isCategorySectionOpen && (
                <div className="tree-section-body">
                  <button
                    className={activePrimary === '全部' && activeSecondary === '全部' ? 'tree-all active' : 'tree-all'}
                    onClick={() => handlePrimarySelect('全部')}
                  >
                    <span>全部分类</span>
                    <strong>{resources.length}</strong>
                  </button>

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
                <strong>{companyCount}</strong>
              </button>

              {isCompanySectionOpen && (
                <div className="tree-section-body">
                  <button
                    className={companyFilter === '全部' ? 'tree-all active' : 'tree-all'}
                    onClick={() => {
                      setCompanyFilter('全部');
                      setCurrentPage(1);
                    }}
                  >
                    <span>全部公司</span>
                    <strong>{resources.length}</strong>
                  </button>
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
                <label className="filter-field">
                  <span>应用阶段</span>
                  <select
                    value={stageFilter}
                    onChange={(event) => {
                      setStageFilter(event.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    {filterOptions.stages.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <label className="filter-field">
                  <span>工具类型</span>
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
                <button className="reset-filter" onClick={resetFilters}>
                  <RotateCcw size={16} aria-hidden="true" />
                  重置
                </button>
              </div>
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
              {paginatedResources.map((resource) => (
                <button
                  key={`${resource.company}-${resource.tool}-${resource.secondaryCategory}`}
                  className="resource-card"
                  onClick={() => setSelectedResource(resource)}
                >
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
                      <p className="resource-company">{resource.company}</p>
                      <h2>{resource.tool}</h2>
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
                      <strong>产品简介：</strong>
                      {resource.summary}
                    </p>
                    <p>
                      <Workflow size={14} aria-hidden="true" />
                      <strong>典型应用：</strong>
                      {getApplicationText(resource)}
                    </p>
                    <p>
                      <Workflow size={14} aria-hidden="true" />
                      <strong>适用阶段：</strong>
                      {getStageFlow(resource).join(' → ')}
                    </p>
                  </div>
                  <div className="resource-card-footer">
                    <span>
                      <BookOpen size={14} aria-hidden="true" />
                      详情
                    </span>
                    <span>
                      <Download size={14} aria-hidden="true" />
                      官网
                    </span>
                    <span>
                      <Bookmark size={14} aria-hidden="true" />
                      收藏
                    </span>
                  </div>
                </button>
              ))}
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
                <h2>暂无匹配资源</h2>
                <p>可以换一个关键词，或重置左侧分类与筛选条件继续浏览。</p>
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
            <p className="modal-company">{selectedResource.company}</p>
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
                <dt>适用阶段</dt>
                <dd>{selectedResource.stage}</dd>
              </div>
              <div>
                <dt>来源类型</dt>
                <dd>{selectedResource.region}</dd>
              </div>
              <div>
                <dt>二级条目</dt>
                <dd>{selectedResource.secondaryCategory}</dd>
              </div>
            </dl>
            <div className="resource-tags">
              {selectedResource.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
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

function EdaLibrary({ onBack }) {
  return <ResourceLibrary onBack={onBack} config={libraryConfigs.eda} />;
}

function IpLibrary({ onBack }) {
  return <ResourceLibrary onBack={onBack} config={libraryConfigs.ip} />;
}

function App() {
  const [activeNode, setActiveNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const currentResource = useMemo(
    () => nodes.find((node) => node.id === selectedNode),
    [selectedNode],
  );

  if (selectedNode === 'eda') {
    return <EdaLibrary onBack={() => setSelectedNode(null)} />;
  }

  if (selectedNode === 'ip') {
    return <IpLibrary onBack={() => setSelectedNode(null)} />;
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
