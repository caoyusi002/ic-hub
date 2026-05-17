import React, { useEffect, useMemo, useState } from 'react';
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
  Mail,
  MapPin,
  Microchip,
  Phone,
  RotateCcw,
  Search,
  Sparkles,
  Workflow,
  X,
} from 'lucide-react';
import backgroundUrl from './assets/ic-background.png';
import armLogo from './assets/logos/arm.svg';
import andesLogo from './assets/logos/andes.png';
import cambriconLogo from './assets/logos/cambricon.png';
import cadenceLogo from './assets/logos/cadence.png';
import empyreanLogo from './assets/logos/empyrean-user.jpg';
import primariusLogo from './assets/logos/primarius-official.svg';
import synopsysLogo from './assets/logos/synopsys-user.jpg';
import univistaLogo from './assets/logos/univista.svg';
import verisiliconLogo from './assets/logos/verisilicon.jpg';
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
    label: '处理器 | Processor',
    items: [
      'CPU',
      'DPU',
      'GPU',
      'NPU',
      'VPU',
      'DSP',
      'TPU',
      'eFPGA',
      'AI Processor/Accelerator',
    ],
  },
  {
    id: 'foundation',
    label: '基础 | Foundation',
    items: [
      'Standard Cell Library',
      'Memory Compilers',
      'General Purpose IOs',
    ],
  },
  {
    id: 'analog-mixed-signal',
    label: '模拟和混合信号 | Analog & Mixed Signal',
    items: [
      'ADC',
      'DAC',
      'CODEC',
      'PLL',
      'DLL',
      'Crystal driver',
      'RC/LC OSC',
      'DCDC',
      'LDO',
      'POR/BOR',
      'PVT Monitors',
      'Amplifier',
      'Sensor',
    ],
  },
  {
    id: 'interface-bus-protocol',
    label: '接口和总线协议 | Interface & BUS Protocol(Controller&PHY)',
    items: [
      'PCIe',
      'SATA',
      'AMBA',
      'CXL',
      'CCIX',
      'DDR',
      'DP',
      'HDMI',
      'MIPI',
      'PCIE',
      'XAUI',
      'LVDS',
      'USB',
      'HBM',
      'Ethernet',
      'Die-to-Die',
      'Thread',
      'EMMC',
      'Mobile Storage',
      'Datapath IP(PHY & Controller)',
    ],
  },
  {
    id: 'memory-logic-library',
    label: '存储与逻辑库 | Memory & Logic Library',
    items: [
      'TCAM Compiler',
      'eFlash',
      'MTP/OTP',
      'SRAM',
      'RRAM',
      'MRAM',
      'FRAM',
      'ROM',
      'Memory Compilers',
    ],
  },
  {
    id: 'security',
    label: '安全加密 | Security',
    items: [
      'Cryptography Cores',
      'PUF',
      'tRNG',
      'Light/Voltage/Freq.Detector',
      'Temperature Sensor',
    ],
  },
  {
    id: 'rf-wireless-communication',
    label: '射频和无线通信 | RF & Wireless Communication',
    items: [
      '3GPP-5G/LTE',
      'WiFi',
      'Bluetooth',
      'Zigbee',
      'NB-IoT',
      'Sub-G',
      'RFID',
      'NFC',
      'UWB',
      'CAT-1',
      'GPS/北斗',
    ],
  },
  {
    id: 'graphic-multimedia',
    label: '图形处理和多媒体 | Graphic & Multimedia',
    items: [
      'ISP',
      'MPEG-4',
      'VGA',
      'Audio Interfaces',
      '2D/3D',
      'H.263/H.264/H.265/H.266',
    ],
  },
  {
    id: 'automotive',
    label: '汽车电子 | Automotive',
    items: [
      'CAN',
      'CAN-FD',
      'FlexRay',
      'LIN',
      'Safe Ethernet',
    ],
  },
];

const ipResources = [
  {
    company: 'Arm',
    tool: 'Arm Cortex CPU',
    primaryCategory: '处理器 | Processor',
    secondaryCategory: 'CPU',
    stage: '架构授权与 SoC 集成',
    region: '国际',
    tags: ['Cortex', 'CPU', '移动终端', '嵌入式', '汽车电子'],
    status: '精选演示',
    summary: 'Arm Cortex 处理器 IP 覆盖应用处理器、实时控制与微控制器场景，是 Arm 生态中最典型的 CPU IP 产品线。',
    detail: '适合用于手机、消费电子、工业控制、车载电子和嵌入式 SoC 的主控计算核心，强调性能、功耗、软件生态和授权灵活性。',
    sourceUrl: 'https://www.arm.com/products',
    detailSections: [
      { title: '代表产品 / 系列', body: 'Cortex-A、Cortex-R、Cortex-M 等处理器系列。' },
      { title: '典型应用', body: '移动终端、IoT、工业控制、汽车电子、边缘计算。' },
      { title: '资料来源', body: 'Arm 官方 Products 页面列出 CPUs 作为核心产品入口。' },
    ],
  },
  {
    company: 'Arm',
    tool: 'Arm Mali GPU',
    primaryCategory: '图形处理和多媒体 | Graphic & Multimedia',
    secondaryCategory: '2D/3D',
    stage: '图形与视觉计算集成',
    region: '国际',
    tags: ['Mali', 'GPU', '图形渲染', '移动终端', '视觉计算'],
    status: '精选演示',
    summary: 'Mali GPU 是 Arm 面向图形渲染和视觉计算的 GPU IP 产品线。',
    detail: '主要服务移动设备、消费电子、嵌入式显示和车载座舱等场景，可与 CPU、NPU 和显示链路共同组成多媒体子系统。',
    sourceUrl: 'https://www.arm.com/products',
    detailSections: [
      { title: '代表产品 / 系列', body: 'Mali GPU 产品线。' },
      { title: '典型应用', body: '智能手机、平板、可穿戴、智能座舱、嵌入式图形。' },
      { title: '资料来源', body: 'Arm 官方 Products 页面列出 Mali GPUs 作为产品入口。' },
    ],
  },
  {
    company: 'Arm',
    tool: 'Arm Ethos NPU',
    primaryCategory: '处理器 | Processor',
    secondaryCategory: 'NPU',
    stage: '边缘 AI 加速集成',
    region: '国际',
    tags: ['Ethos', 'NPU', 'AI', '边缘智能', '机器学习'],
    status: '精选演示',
    summary: 'Ethos NPU 是 Arm 面向机器学习推理的神经网络处理器 IP。',
    detail: '用于在端侧和边缘设备中加速 AI 推理，常与 Cortex CPU、Mali GPU 或 Corstone 子系统组合。',
    sourceUrl: 'https://www.arm.com/products',
    detailSections: [
      { title: '代表产品 / 系列', body: 'Ethos NPU 产品线。' },
      { title: '典型应用', body: '语音识别、视觉检测、智能摄像头、工业和消费类边缘 AI。' },
      { title: '资料来源', body: 'Arm 官方 Products 页面列出 Ethos NPUs 作为产品入口。' },
    ],
  },
  {
    company: 'Arm',
    tool: 'Arm System IP',
    primaryCategory: '接口和总线协议 | Interface & BUS Protocol(Controller&PHY)',
    secondaryCategory: 'AMBA',
    stage: 'SoC 互连与系统集成',
    region: '国际',
    tags: ['System IP', 'CoreLink', 'CoreSight', '互连', '调试'],
    status: '精选演示',
    summary: 'Arm System IP 支撑片上互连、调试追踪、内存与系统级集成。',
    detail: '这类 IP 帮助芯片团队把处理器、加速器、存储和外设组织成可验证、可调试的完整 SoC。',
    sourceUrl: 'https://www.arm.com/products',
    detailSections: [
      { title: '代表产品 / 系列', body: 'System IP、CoreLink、CoreSight 等系统级 IP 方向。' },
      { title: '典型应用', body: '复杂 SoC 互连、调试追踪、系统一致性和平台集成。' },
      { title: '资料来源', body: 'Arm 官方 Products 页面列出 System IP 作为产品入口。' },
    ],
  },
  {
    company: 'Arm',
    tool: 'Arm Security IP',
    primaryCategory: '安全加密 | Security',
    secondaryCategory: 'Cryptography Cores',
    stage: '安全子系统集成',
    region: '国际',
    tags: ['Security IP', 'TrustZone', 'Crypto', '安全启动', '密钥保护'],
    status: '精选演示',
    summary: 'Arm Security IP 面向芯片安全防护、隔离、加密和可信执行。',
    detail: '适合需要可信启动、密钥保护、硬件隔离和安全生命周期管理的终端、IoT、汽车和基础设施芯片。',
    sourceUrl: 'https://www.arm.com/products/silicon-ip-security',
    detailSections: [
      { title: '代表产品 / 系列', body: 'TrustZone 相关安全架构与 Arm Security IP 产品线。' },
      { title: '典型应用', body: '安全启动、可信执行环境、设备身份、加密和密钥管理。' },
      { title: '资料来源', body: 'Arm 官方 Security IP 页面。' },
    ],
  },
  {
    company: 'Arm',
    tool: 'Arm Corstone Subsystems',
    primaryCategory: '基础 | Foundation',
    secondaryCategory: 'General Purpose IOs',
    stage: '参考子系统与快速集成',
    region: '国际',
    tags: ['Corstone', 'Subsystem', 'Cortex', 'Ethos', '参考设计'],
    status: '精选演示',
    summary: 'Corstone 是 Arm 面向特定终端和 IoT 场景的参考子系统 IP。',
    detail: '通过预集成处理器、安全、系统 IP 和软件参考，降低端侧 AI、IoT 与嵌入式 SoC 的集成复杂度。',
    sourceUrl: 'https://www.arm.com/products',
    detailSections: [
      { title: '代表产品 / 系列', body: 'Corstone 子系统与参考设计包。' },
      { title: '典型应用', body: 'IoT、端侧 AI、低功耗嵌入式平台、快速原型设计。' },
      { title: '资料来源', body: 'Arm 官方 Products 页面列出 Compute Subsystems / Subsystem IP 入口。' },
    ],
  },
  {
    company: 'Andes',
    tool: 'AndesCore N / NX 系列',
    primaryCategory: '处理器 | Processor',
    secondaryCategory: 'CPU',
    stage: 'RISC-V CPU 选型',
    region: '台湾地区',
    tags: ['AndesCore', 'RISC-V', 'N25F', 'NX25F', '低功耗'],
    status: '精选演示',
    summary: 'AndesCore N / NX 系列面向快速、紧凑、低功耗的 RISC-V CPU 核。',
    detail: '适合 MCU、控制器、IoT 和成本敏感型 SoC，用于替代或补充传统嵌入式 CPU 核。',
    sourceUrl: 'https://www.andestech.com/en/products-solutions/andescore-processors/',
    detailSections: [
      { title: '代表产品 / 系列', body: 'N25F、NX25F 等 N / NX 系列处理器核。' },
      { title: '典型应用', body: 'MCU、IoT、低功耗控制、嵌入式 SoC。' },
      { title: '资料来源', body: 'Andes 官方 AndesCore Processors 页面。' },
    ],
  },
  {
    company: 'Andes',
    tool: 'AndesCore D 系列',
    primaryCategory: '处理器 | Processor',
    secondaryCategory: 'DSP',
    stage: 'RISC-V CPU 选型',
    region: '台湾地区',
    tags: ['AndesCore', 'RISC-V', 'D25F', 'DSP', '控制计算'],
    status: '精选演示',
    summary: 'AndesCore D 系列偏向带 DSP/控制增强能力的 RISC-V 处理器核。',
    detail: '用于需要信号处理、控制算法或特定指令扩展的嵌入式 SoC。',
    sourceUrl: 'https://www.andestech.com/en/products-solutions/andescore-processors/',
    detailSections: [
      { title: '代表产品 / 系列', body: 'D25F、D45 等 D 系列处理器核。' },
      { title: '典型应用', body: '数字信号处理、传感器控制、电机控制、嵌入式加速。' },
      { title: '资料来源', body: 'Andes 官方 AndesCore Processors 页面。' },
    ],
  },
  {
    company: 'Andes',
    tool: 'AndesCore A / AX25 系列',
    primaryCategory: '处理器 | Processor',
    secondaryCategory: 'CPU',
    stage: 'RISC-V CPU 选型',
    region: '台湾地区',
    tags: ['AndesCore', 'RISC-V', 'A25', 'AX25', '应用处理器'],
    status: '精选演示',
    summary: 'A / AX25 系列面向更高性能的 RISC-V 应用处理和 SoC 主控场景。',
    detail: '适合需要较高主频、Linux 或复杂软件栈支持的应用型芯片。',
    sourceUrl: 'https://www.andestech.com/en/products-solutions/andescore-processors/v5-64bit/',
    detailSections: [
      { title: '代表产品 / 系列', body: 'A25、AX25、A25MP、AX25MP 等。' },
      { title: '典型应用', body: '应用处理器、边缘网关、工业控制、智能设备。' },
      { title: '资料来源', body: 'Andes 官方 64-bit AndesCore 页面。' },
    ],
  },
  {
    company: 'Andes',
    tool: 'AndesCore AX45 / AX45MPV 系列',
    primaryCategory: '处理器 | Processor',
    secondaryCategory: 'CPU',
    stage: '高性能 RISC-V 集成',
    region: '台湾地区',
    tags: ['AndesCore', 'RISC-V', 'AX45', 'AX45MPV', '多核'],
    status: '精选演示',
    summary: 'AX45 / AX45MPV 系列面向多核、向量计算和更高性能 RISC-V SoC。',
    detail: '适合 AI 边缘推理、网络处理、存储控制和高性能嵌入式计算。',
    sourceUrl: 'https://www.andestech.com/en/products-solutions/andescore-processors/',
    detailSections: [
      { title: '代表产品 / 系列', body: 'AX45、AX45MP、AX45MPV 等。' },
      { title: '典型应用', body: '边缘 AI、网络芯片、存储控制、工业计算。' },
      { title: '资料来源', body: 'Andes 官方 AndesCore Processors 页面。' },
    ],
  },
  {
    company: 'Andes',
    tool: 'AndesCore AX60 / AX65 系列',
    primaryCategory: '处理器 | Processor',
    secondaryCategory: 'CPU',
    stage: '高性能 RISC-V 集成',
    region: '台湾地区',
    tags: ['AndesCore', 'RISC-V', 'AX65', '乱序执行', 'Linux'],
    status: '精选演示',
    summary: 'AX60 / AX65 系列面向中高端 RISC-V 应用处理器和 Linux 级计算场景。',
    detail: '适合需要更强单核性能、多核扩展和复杂操作系统生态的芯片项目。',
    sourceUrl: 'https://www.andestech.com/en/products-solutions/andescore-processors/riscv-ax65/',
    detailSections: [
      { title: '代表产品 / 系列', body: 'AX65 以及 AX60 系列相关产品线。' },
      { title: '典型应用', body: '边缘服务器、AI SoC、网络处理、Linux 应用处理器。' },
      { title: '资料来源', body: 'Andes 官方 AX65 产品页面。' },
    ],
  },
  {
    company: '芯原股份',
    tool: 'Vivante GPU IP',
    primaryCategory: '图形处理和多媒体 | Graphic & Multimedia',
    secondaryCategory: '2D/3D',
    stage: '图形与显示子系统集成',
    region: '国内',
    tags: ['Vivante', 'GPU', '图形渲染', '显示', '芯原'],
    status: '精选演示',
    summary: 'Vivante GPU IP 是芯原自研处理器 IP 组合中的图形处理产品线。',
    detail: '用于图形渲染、GUI、2D/3D 显示和低功耗视觉系统，可与 ISP、VPU 和 Display Processing IP 组合。',
    sourceUrl: 'https://verisilicon.com/en/IPPORTFOLIO',
    detailSections: [
      { title: '代表产品 / 系列', body: 'Vivante GPU IP。' },
      { title: '典型应用', body: '消费电子、智能显示、车载座舱、边缘多媒体 SoC。' },
      { title: '资料来源', body: '芯原官方 IP Portfolio 页面。' },
    ],
  },
  {
    company: '芯原股份',
    tool: 'VeriSilicon NPU IP',
    primaryCategory: '处理器 | Processor',
    secondaryCategory: 'NPU',
    stage: 'AI 推理加速集成',
    region: '国内',
    tags: ['NPU', 'AI', '计算机视觉', '边缘设备', '芯原'],
    status: '精选演示',
    summary: '芯原 NPU IP 是面向计算机视觉和人工智能推理的可扩展处理器 IP。',
    detail: '用于端侧、边缘和云侧设备的 AI 推理加速，可结合软件栈与多媒体处理 IP 形成视觉 AI 子系统。',
    sourceUrl: 'https://verisilicon.com/en/IPPORTFOLIO',
    detailSections: [
      { title: '代表产品 / 系列', body: 'VeriSilicon NPU IP、Coral NPU 相关公开 IP 方向。' },
      { title: '典型应用', body: '智能摄像头、边缘 AI、机器视觉、AIoT、数据中心边缘推理。' },
      { title: '资料来源', body: '芯原官方 IP Portfolio 页面。' },
    ],
  },
  {
    company: '芯原股份',
    tool: 'Hantro VPU IP',
    primaryCategory: '处理器 | Processor',
    secondaryCategory: 'VPU',
    stage: '视频编解码子系统集成',
    region: '国内',
    tags: ['Hantro', 'VPU', '视频编解码', '多媒体', '芯原'],
    status: '精选演示',
    summary: 'Hantro VPU IP 是芯原面向视频编解码和视频处理的处理器 IP。',
    detail: '支持主流视频格式处理和多核扩展，适合视频监控、消费电子、IoT、云服务和数据中心视频场景。',
    sourceUrl: 'https://verisilicon.com/en/IPPORTFOLIO',
    detailSections: [
      { title: '代表产品 / 系列', body: 'Hantro Video Processing Unit IP。' },
      { title: '典型应用', body: '视频监控、OTT/机顶盒、智能摄像头、无人机、云视频处理。' },
      { title: '资料来源', body: '芯原官方 IP Portfolio 页面。' },
    ],
  },
  {
    company: '芯原股份',
    tool: 'ZSP DSP IP',
    primaryCategory: '处理器 | Processor',
    secondaryCategory: 'DSP',
    stage: '信号处理子系统集成',
    region: '国内',
    tags: ['ZSP', 'DSP', '音频', '语音', '无线连接'],
    status: '精选演示',
    summary: 'ZSP DSP IP 是芯原面向信号处理和数据流计算的可编程 DSP 内核。',
    detail: '适合音频、语音、影像、视觉、无线连接和电力线通信等嵌入式信号处理任务。',
    sourceUrl: 'https://verisilicon.com/en/IPPORTFOLIO',
    detailSections: [
      { title: '代表产品 / 系列', body: 'ZSP Digital Signal Processing IP。' },
      { title: '典型应用', body: '音频处理、语音处理、图像与视觉算法、无线连接、低功耗 DSP。' },
      { title: '资料来源', body: '芯原官方 IP Portfolio 页面。' },
    ],
  },
  {
    company: '芯原股份',
    tool: 'Vivante ISP / Display Processing IP',
    primaryCategory: '图形处理和多媒体 | Graphic & Multimedia',
    secondaryCategory: 'ISP',
    stage: '图像与显示链路集成',
    region: '国内',
    tags: ['Vivante', 'ISP', 'Display', '图像处理', '显示处理'],
    status: '精选演示',
    summary: '芯原 ISP 与 Display Processing IP 覆盖摄像头输入、图像质量处理和显示输出链路。',
    detail: '用于移动设备、视频会议、视频监控、汽车视觉和智能显示，能与 VPU、GPU、NPU 组合成完整视觉处理链路。',
    sourceUrl: 'https://verisilicon.com/en/IPPORTFOLIO',
    detailSections: [
      { title: '代表产品 / 系列', body: 'Vivante ISP IP、Vivante Display Processing IP。' },
      { title: '典型应用', body: '摄像头 ISP、视频会议、智能座舱、图像增强、显示合成。' },
      { title: '资料来源', body: '芯原官方 IP Portfolio 页面。' },
    ],
  },
  {
    company: '芯原股份',
    tool: 'VeriSilicon Analog / Interface / RF IP',
    primaryCategory: '模拟和混合信号 | Analog & Mixed Signal',
    secondaryCategory: 'ADC',
    stage: '物理接口与基础 IP 集成',
    region: '国内',
    tags: ['模拟混合信号', 'RF', 'MIPI', 'USB', 'PCIe', 'Foundation IP'],
    status: '精选演示',
    summary: '芯原提供模拟混合信号、RF、接口和基础库 IP 组合，用于补齐 SoC 的物理接口与工艺相关模块。',
    detail: '公开资料显示其组合覆盖模拟/混合信号、MIPI、USB、PCIe、RF、Foundation IP 等方向，具体规格需以项目资料确认。',
    sourceUrl: 'https://verisilicon.com/en/IPPORTFOLIO',
    detailSections: [
      { title: '代表产品 / 系列', body: 'Analog and Mixed Signal IP、RF IP、Foundation IP、MIPI / USB / PCIe 等接口 IP。' },
      { title: '典型应用', body: 'SoC 基础库、低功耗模拟模块、高速接口、IoT 无线连接、先进工艺适配。' },
      { title: '资料来源', body: '芯原官方 IP Portfolio 页面。' },
    ],
  },
  {
    company: '寒武纪',
    tool: 'Cambricon-1H16',
    primaryCategory: '处理器 | Processor',
    secondaryCategory: 'AI Processor/Accelerator',
    stage: '终端 AI 处理器 IP 集成',
    region: '国内',
    tags: ['Cambricon-1H', '1H16', 'AI', '终端智能', '寒武纪'],
    status: '精选演示',
    summary: 'Cambricon-1H16 是寒武纪终端智能处理器 IP 系列中的代表型号。',
    detail: '面向终端侧智能计算和神经网络推理场景，用于在 SoC 中集成专用 AI 加速能力。',
    sourceUrl: 'https://www.cambricon.com/index.php?a=lists&c=index&catid=13&m=content',
    detailSections: [
      { title: '代表产品 / 系列', body: 'Cambricon-1H16。' },
      { title: '典型应用', body: '智能终端、视觉识别、语音交互、端侧 AI 推理。' },
      { title: '资料来源', body: '寒武纪官方 Cambricon-1H 页面。' },
    ],
  },
  {
    company: '寒武纪',
    tool: 'Cambricon-1H8',
    primaryCategory: '处理器 | Processor',
    secondaryCategory: 'AI Processor/Accelerator',
    stage: '终端 AI 处理器 IP 集成',
    region: '国内',
    tags: ['Cambricon-1H', '1H8', 'AI', '终端智能', '寒武纪'],
    status: '精选演示',
    summary: 'Cambricon-1H8 是寒武纪终端智能处理器 IP 系列中的轻量化产品方向。',
    detail: '用于在功耗、面积和 AI 算力之间做平衡的终端 SoC 场景。',
    sourceUrl: 'https://www.cambricon.com/index.php?a=lists&c=index&catid=13&m=content',
    detailSections: [
      { title: '代表产品 / 系列', body: 'Cambricon-1H8。' },
      { title: '典型应用', body: '智能摄像头、可穿戴、IoT 终端、低功耗 AI 推理。' },
      { title: '资料来源', body: '寒武纪官方 Cambricon-1H 页面。' },
    ],
  },
  {
    company: '寒武纪',
    tool: 'Cambricon-1H8mini',
    primaryCategory: '处理器 | Processor',
    secondaryCategory: 'AI Processor/Accelerator',
    stage: '终端 AI 处理器 IP 集成',
    region: '国内',
    tags: ['Cambricon-1H', '1H8mini', 'AI', '低功耗', '寒武纪'],
    status: '精选演示',
    summary: 'Cambricon-1H8mini 是寒武纪终端智能处理器 IP 系列中更小型的嵌入式 AI IP。',
    detail: '适合面积与功耗约束更强的端侧智能设备，作为 demo 中寒武纪轻量 IP 代表。',
    sourceUrl: 'https://www.cambricon.com/index.php?a=lists&c=index&catid=13&m=content',
    detailSections: [
      { title: '代表产品 / 系列', body: 'Cambricon-1H8mini。' },
      { title: '典型应用', body: '小型智能终端、传感器节点、低功耗视觉或语音 AI。' },
      { title: '资料来源', body: '寒武纪官方 Cambricon-1H 页面。' },
    ],
  },
  {
    company: '合见工软',
    tool: 'UniVista PCIe Gen5 IP',
    primaryCategory: '接口和总线协议 | Interface & BUS Protocol(Controller&PHY)',
    secondaryCategory: 'PCIe',
    stage: '高速互连接口集成',
    region: '国内',
    tags: ['PCIe Gen5', '高速接口', '控制器', 'PHY', '合见工软'],
    status: '精选演示',
    summary: 'UniVista PCIe Gen5 IP 是合见工软高性能 IP 组合中的高速接口产品线。',
    detail: '面向高性能计算、AI 加速器、存储和网络芯片中的 PCIe 高速互连需求。',
    sourceUrl: 'https://www.univista-isg.com/site/high_performance',
    detailSections: [
      { title: '代表产品 / 系列', body: 'PCIe Gen5 IP。' },
      { title: '典型应用', body: 'AI 加速卡、服务器 SoC、存储控制器、网络处理器。' },
      { title: '资料来源', body: '合见工软官方高性能 IP 页面。' },
    ],
  },
  {
    company: '合见工软',
    tool: 'UniVista UCIe IP',
    primaryCategory: '接口和总线协议 | Interface & BUS Protocol(Controller&PHY)',
    secondaryCategory: 'Die-to-Die',
    stage: 'Chiplet 互连集成',
    region: '国内',
    tags: ['UCIe', 'Chiplet', 'Die-to-Die', '先进封装', '合见工软'],
    status: '精选演示',
    summary: 'UniVista UCIe IP 面向 Chiplet 和先进封装中的 Die-to-Die 互连。',
    detail: '用于多芯粒系统中的高速互联、封装内通信和异构集成。',
    sourceUrl: 'https://www.univista-isg.com/site/high_performance',
    detailSections: [
      { title: '代表产品 / 系列', body: 'UCIe IP。' },
      { title: '典型应用', body: 'Chiplet、先进封装、AI/HPC 多芯粒系统、D2D/C2C 互连。' },
      { title: '资料来源', body: '合见工软官方高性能 IP 页面。' },
    ],
  },
  {
    company: '合见工软',
    tool: 'UniVista HBM3/E IP',
    primaryCategory: '接口和总线协议 | Interface & BUS Protocol(Controller&PHY)',
    secondaryCategory: 'HBM',
    stage: '高带宽存储接口集成',
    region: '国内',
    tags: ['HBM3', 'HBM3E', 'Memory IP', 'AI 芯片', '合见工软'],
    status: '精选演示',
    summary: 'UniVista HBM3/E IP 面向 AI、HPC 和高带宽存储接口场景。',
    detail: '用于需要极高片外存储带宽的 AI 加速器、GPU、HPC 和数据中心芯片。',
    sourceUrl: 'https://www.univista-isg.com/site/high_performance',
    detailSections: [
      { title: '代表产品 / 系列', body: 'HBM3/E IP。' },
      { title: '典型应用', body: 'AI 训练/推理芯片、HPC、GPU、数据中心加速器。' },
      { title: '资料来源', body: '合见工软官方高性能 IP 页面。' },
    ],
  },
  {
    company: '合见工软',
    tool: 'UniVista Ethernet Controller IP',
    primaryCategory: '接口和总线协议 | Interface & BUS Protocol(Controller&PHY)',
    secondaryCategory: 'Ethernet',
    stage: '高速网络接口集成',
    region: '国内',
    tags: ['Ethernet', '400G', '800G', '网络芯片', '合见工软'],
    status: '精选演示',
    summary: '合见工软 Ethernet Controller IP 面向高速以太网控制器和网络芯片。',
    detail: '公开资料显示其以太网控制器覆盖 400G / 800G 等高速网络芯片场景，并支持定制化子系统集成。',
    sourceUrl: 'https://www.univista-isg.com/site/product_detail/21',
    detailSections: [
      { title: '代表产品 / 系列', body: 'Ethernet Controller IP。' },
      { title: '典型应用', body: '交换芯片、网络处理器、服务器芯片、数据中心互连。' },
      { title: '资料来源', body: '合见工软官方 Ethernet Controller IP 产品详情页。' },
    ],
  },
  {
    company: '合见工软',
    tool: 'UniVista UEC MAC IP',
    primaryCategory: '接口和总线协议 | Interface & BUS Protocol(Controller&PHY)',
    secondaryCategory: 'Ethernet',
    stage: '智算网络互连集成',
    region: '国内',
    tags: ['UEC', 'MAC', 'AI/ML', 'HPC', '数据中心'],
    status: '精选演示',
    summary: 'UniVista UEC MAC IP 面向超以太网和智算网络互连。',
    detail: '用于 AI/ML、HPC 和云数据中心的高性能网络连接，公开资料强调 LLR、CBFC 等可靠传输能力。',
    sourceUrl: 'https://www.univista-isg.com/site/product_detail/444',
    detailSections: [
      { title: '代表产品 / 系列', body: 'UEC MAC IP。' },
      { title: '典型应用', body: 'AI 集群互连、HPC、云数据中心、智算网络。' },
      { title: '资料来源', body: '合见工软官方 UEC MAC IP 产品详情页。' },
    ],
  },
  {
    company: '合见工软',
    tool: 'UniVista 32G MPS IP',
    primaryCategory: '接口和总线协议 | Interface & BUS Protocol(Controller&PHY)',
    secondaryCategory: 'Datapath IP(PHY & Controller)',
    stage: '多协议 SerDes PHY 集成',
    region: '国内',
    tags: ['SerDes', '32G', 'Multi-Protocol', 'PHY', '高速接口'],
    status: '精选演示',
    summary: 'UniVista 32G Multi-Protocol SerDes IP 是合见工软面向多协议高速传输接口的 SerDes IP。',
    detail: '适合 PCIe、以太网、Interlaken 等多种高速互连协议的物理层传输接口集成。',
    sourceUrl: 'https://www.univista-isg.com/site/news_detail/454',
    detailSections: [
      { title: '代表产品 / 系列', body: 'UniVista 32G Multi-Protocol SerDes IP。' },
      { title: '典型应用', body: '高速接口 PHY、AI/HPC 芯片、网络芯片、数据中心互连。' },
      { title: '资料来源', body: '合见工软官方新闻与高性能 IP 页面。' },
    ],
  },
];

const companyVisuals = {
  Cadence: cadenceLogo,
  Synopsys: synopsysLogo,
  '华大九天': empyreanLogo,
  '概伦电子': primariusLogo,
  '合见工软': univistaLogo,
  Arm: armLogo,
  Andes: andesLogo,
  '芯原股份': verisiliconLogo,
  '寒武纪': cambriconLogo,
};

const companySourceUrls = {
  Cadence: 'https://www.cadence.com/en_US/home/tools.html',
  Synopsys: 'https://www.synopsys.com/products.html',
  '华大九天': 'https://www.empyrean.com.cn/product/eda.html',
  '概伦电子': 'https://www.primarius-tech.com/',
  '合见工软': 'https://www.univista-isg.com/',
  Arm: 'https://www.arm.com/products/silicon-ip',
  Andes: 'https://www.andestech.com/en/products-solutions/andescore-processors/',
  SiFive: 'https://www.sifive.com/risc-v-core-ip',
  Rambus: 'https://www.rambus.com/interface-ip/',
  eMemory: 'https://www.ememory.com.tw/en-US/Products',
  '芯原股份': 'https://www.verisilicon.com/en/IPPortfolio',
  '寒武纪': 'https://www.cambricon.com/index.php?a=lists&c=index&catid=13&m=content',
  '芯动科技': 'https://www.innosilicon.com/',
  '灿芯股份': 'https://www.brite-semi.com/',
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

  return [resource.secondaryCategory, resource.stage, resource.region].filter(Boolean);
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

const getSourceStatus = (resource) => (getResourceSourceUrl(resource) ? '官网整理' : '待补充');

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

const companyDescriptions = {
  Cadence: 'Cadence 是全球头部 EDA 与系统设计软件厂商之一，产品覆盖定制 IC、数字实现、验证、封装/PCB、系统分析等多个设计环节。',
  Synopsys: 'Synopsys 是全球头部 EDA、IP 与软件安全解决方案厂商之一，EDA 产品覆盖数字前端、验证、后端实现、签核、工艺与制造相关流程。',
  '华大九天': '华大九天是国内 EDA 代表企业之一，产品覆盖模拟/混合信号设计、数字设计、平板显示、晶圆制造与先进封装等方向。',
  '概伦电子': '概伦电子聚焦器件建模、模型验证、仿真验证、良率提升和测试等 EDA 方向，产品常用于工艺开发、模拟设计与制造协同场景。',
  '合见工软': '合见工软聚焦芯片验证与系统级设计工具，产品覆盖仿真验证、硬件辅助验证、原型验证、DFT、PCB/原理图与工程数据管理等方向。',
  Arm: 'Arm 提供处理器、GPU、NPU、系统与安全 IP 等可授权芯片 IP，广泛用于移动终端、嵌入式、汽车电子、IoT 与基础设施芯片。',
  Andes: 'Andes 聚焦 RISC-V 处理器 IP，产品覆盖低功耗嵌入式核、DSP/控制核、高性能应用处理器和多核向量计算方向。',
  '芯原股份': '芯原股份提供 GPU、NPU、VPU、DSP、ISP、显示处理以及模拟/接口/RF 等半导体 IP，并结合芯片设计服务形成平台化能力。',
  '寒武纪': '寒武纪终端智能处理器 IP 面向端侧人工智能推理场景，可用于智能终端、视觉识别、语音交互和低功耗 AI 设备。',
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
    detailBasePath,
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
        resource.fullName,
        resource.specs,
        resource.exampleApplications,
        resource.applicationDomains,
        resource.vendors,
        resource.note,
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
    const keyword = query.trim().toLowerCase();
    const getSearchScore = (resource) => {
      const company = resource.company.toLowerCase();
      const tool = resource.tool.toLowerCase();
      const secondary = resource.secondaryCategory.toLowerCase();
      const primary = resource.primaryCategory.toLowerCase();
      const tags = resource.tags.join(' ').toLowerCase();

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
            <span>{taxonomy.length}</span>
            <p>一级分类</p>
          </div>
          <div>
            <span>{secondaryCategoryCount}</span>
            <p>二级分类</p>
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
                <span className="tree-toggle-meta">
                  <strong>{taxonomy.length}</strong>
                  <em>{isCategorySectionOpen ? '收起' : '展开'}</em>
                </span>
              </button>

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
              {paginatedResources.map((resource) => {
                const detailPath = getInternalDetailPath(resource);
                const sourceUrl = getResourceSourceUrl(resource);
                const isIpResource = isIpDictionaryResource(resource);
                const resourceDisplayName = getResourceDisplayName(resource);
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
                    className="resource-card"
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
  const ipMarketSections = resource && isIpDetail ? getIpMarketSections(resource) : [];
  const companyPath = resource ? `#/company/${getCompanySlug(resource.company)}` : null;
  const productFlow = resource ? getProductFlow(resource) : { steps: [], activeIndex: 0 };

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
            <p className="eyebrow">{resourceName} PRODUCT DETAIL</p>
            <h1>未找到产品</h1>
            <p>这个产品条目可能已经被调整。可以返回资源库后重新选择。</p>
          </section>
        ) : (
          <>
            <header className={isIpDetail ? 'product-detail-hero ip-product-hero' : 'product-detail-hero'}>
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
              <div className="product-detail-title">
                <p className="eyebrow">{isIpDetail ? 'IP PRODUCT PROFILE' : `${resourceName} PRODUCT DETAIL`}</p>
                {companyPath ? (
                  <a className="resource-company company-name-link" href={companyPath}>
                    {resource.company}
                  </a>
                ) : (
                  <p className="resource-company">{resource.company}</p>
                )}
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
                        <p>{section.body}</p>
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
                </aside>
              </section>
            ) : (
              <>
                <section className="detail-layout">
                  <article className="detail-panel detail-main-panel">
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
                    <p className="eyebrow">OVERVIEW</p>
                    <h2>产品说明</h2>
                    <p>{resource.summary}</p>
                    <div className="detail-section-grid">
                      {detailSections.map((section) => (
                        <section key={section.title} className="detail-section">
                          <h3>{section.title}</h3>
                          <p>{section.body}</p>
                        </section>
                      ))}
                    </div>
                  </article>

                  <aside className="detail-side">
                    <section className="detail-panel">
                      <p className="eyebrow">CLASSIFICATION</p>
                      <h2>分类与流程</h2>
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
                          <dt>适用阶段</dt>
                          <dd>{resource.stage}</dd>
                        </div>
                        <div>
                          <dt>来源地区</dt>
                          <dd>{resource.region}</dd>
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
                        <p className="material-note">产品信息文件整理上传后，可在此下载。</p>
                      )}
                    </section>

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
                  </aside>
                </section>
              </>
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

  const libraryRouteMatch = routeHash.match(/^#\/(eda|ip)(?:\/product\/(.+))?$/);
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
  }

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
