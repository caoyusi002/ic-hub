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
import cadenceLogo from './assets/logos/cadence.png';
import empyreanLogo from './assets/logos/empyrean-user.jpg';
import primariusLogo from './assets/logos/primarius-official.svg';
import samsungLogo from './assets/logos/samsung.svg';
import synopsysLogo from './assets/logos/synopsys-user.jpg';
import intelFoundryLogo from './assets/logos/intel-foundry.jpg';
import smicLogo from './assets/logos/smic.svg';
import tsmcLogo from './assets/logos/tsmc.svg';
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

const foundryResources = [
  {
    company: '台积电',
    tool: 'TSMC',
    ticker: 'TSM',
    verification: 'Verified',
    segment: 'Foundry & Logic',
    primaryCategory: '代工厂 Foundry',
    secondaryCategory: '晶圆代工',
    stage: '先进制程与生态平台',
    region: '台湾地区',
    operationMode: 'Foundry',
    headquarters: '新竹，台湾地区',
    founded: '1987',
    processNodes: ['3纳米', '5纳米', '7纳米', '12纳米', '16纳米', '20纳米', '22纳米', '28纳米', '40纳米', '45纳米', '55纳米', '65纳米', '80纳米', '90纳米', '110纳米', '130纳米', '150纳米', '180纳米', '250纳米', '350纳米'],
    supportAreas: ['PDK 支撑', 'EDA Flow 支撑', 'IP 生态支撑', '先进封装支撑'],
    tags: ['Pure-play Foundry', '先进制程', 'CoWoS', '3DFabric'],
    status: 'Demo',
    summary: '全球代表性的纯晶圆代工厂，是先进逻辑、AI 加速器、移动 SoC 与高性能计算芯片的重要制造平台。',
    detail: '台积电以晶圆代工为核心，覆盖先进逻辑、成熟节点、特色工艺和先进封装。厂商页重点展示制程节点、供应链依赖、客户关系与关键瓶颈。',
    detailSections: [
      {
        title: '产业定位',
        body: '台积电位于 Foundry & Logic 层，是全球先进逻辑制造能力最集中的公司之一，也是 AI、移动终端和高性能计算芯片供应链中的关键节点。',
      },
      {
        title: '关键能力',
        body: '能力画像覆盖先进节点量产、成熟制程平台、3DFabric 与 CoWoS 等先进封装，以及面向 EDA/IP 生态的设计支撑。',
      },
      {
        title: '风险观察',
        body: '需重点关注先进节点产能、CoWoS 先进封装吞吐、EUV 设备供给、台湾地区地缘集中度和上游硅片/材料供应。',
      },
    ],
    suppliers: ['ASML：EUV/DUV 光刻系统', 'Applied Materials：沉积与刻蚀设备', 'Lam Research：刻蚀系统', 'KLA：检测与量测', 'Shin-Etsu / SUMCO：硅片', 'Entegris：特种化学品', 'Advantest / Teradyne：测试系统'],
    customers: ['NVIDIA：AI GPU 制造', 'Apple：A/M 系列芯片', 'AMD：CPU/GPU/AI 加速器', 'Qualcomm：Snapdragon SoC', 'Broadcom：网络与定制 AI 芯片', 'MediaTek：移动 SoC', 'Intel：部分先进节点计算芯片'],
    bottlenecks: ['CoWoS 先进封装', '先进节点产能', 'EUV 光刻', '300mm 硅片', '地缘集中度'],
    sourceUrl: 'https://www.tsmc.com/',
    backplaneUrl: 'https://www.backplane.gg/company/tsmc',
  },
  {
    company: '中芯国际',
    tool: 'SMIC',
    ticker: '0981.HK',
    verification: 'Verified',
    segment: 'Foundry & Logic',
    primaryCategory: '代工厂 Foundry',
    secondaryCategory: '晶圆代工',
    stage: '成熟制程与特色工艺',
    region: '国内',
    operationMode: 'Foundry',
    headquarters: '上海，中国',
    founded: '2000',
    processNodes: ['7纳米', '12纳米', '28纳米', '40纳米', '55纳米', '65纳米', '90纳米', '110纳米', '130纳米', '150纳米', '180纳米', '250纳米', '350纳米'],
    supportAreas: ['PDK 支撑', 'MPW/试产', 'EDA Flow 支撑'],
    tags: ['Foundry', '成熟制程', '特色工艺', '国内制造'],
    status: 'Demo',
    summary: '国内代表性纯晶圆代工厂，覆盖成熟制程、特色工艺和国内设计企业制造支撑。',
    detail: '中芯国际以客户设计制造为核心，适合在本库中作为国内代工、成熟节点、特色工艺和国产供应链支撑能力的重点样本。',
    detailSections: [
      {
        title: '产业定位',
        body: '中芯国际位于 Foundry & Logic 层，是国内晶圆代工体系中的核心厂商，服务逻辑、RF、功率及其他成熟节点需求。',
      },
      {
        title: '关键能力',
        body: '公开官网产品页重点展示 28nm 与成熟制程平台；12nm 可按客户导入/风险生产口径记录，7nm 则按 TechInsights 对华为 Kirin 9000S 的拆解结论记录为 N+2 节点。',
      },
      {
        title: '风险观察',
        body: '7nm/12nm 与官网公开可订购平台不是同一信息口径，需区分“官方技术平台”“客户导入/风险生产”和“第三方拆解确认”；同时关注先进光刻设备限制与 DUV 多重曝光良率。',
      },
    ],
    suppliers: ['ASML：DUV/EUV 光刻相关系统', 'Applied Materials：沉积与刻蚀设备', 'ARM：CPU/GPU IP 生态', '国产设备与材料供应链：待补充'],
    customers: ['Qualcomm：SoC 制造合作', '华为/海思：国内先进与成熟节点需求', '国内 Fabless 客户：逻辑、RF、功率与 MCU'],
    bottlenecks: ['先进光刻设备限制', 'DUV 多重曝光', '国产供应链替代', '成熟节点价格周期'],
    sourceUrl: 'https://www.smics.com/',
    backplaneUrl: 'https://www.backplane.gg/company/smic',
  },
  {
    company: '三星',
    tool: 'Samsung Foundry',
    ticker: '005930.KS',
    verification: 'Verified',
    segment: 'Foundry & Logic',
    primaryCategory: 'IDM / Foundry 服务',
    secondaryCategory: '晶圆代工与系统半导体',
    stage: '先进制程与先进封装',
    region: '国际',
    operationMode: 'IDM',
    headquarters: '华城，韩国',
    founded: '1969',
    processNodes: ['3纳米', '5纳米', '7纳米', '12纳米', '16纳米', '20纳米', '28纳米', '45纳米', '65纳米'],
    supportAreas: ['PDK 支撑', 'EDA Flow 支撑', 'IP 生态支撑', '先进封装支撑'],
    tags: ['IDM', 'Foundry Service', 'GAA', '先进封装'],
    status: 'Demo',
    summary: '三星 Foundry 是三星电子 Device Solutions 下的先进逻辑代工业务，兼具 IDM 背景与外部代工服务能力。',
    detail: '三星 Foundry 适合用于展示 IDM 厂商开放代工能力，重点关注 GAA、先进节点、先进封装、EDA/IP 生态和外部客户支持。',
    detailSections: [
      {
        title: '产业定位',
        body: '三星 Foundry 位于 Foundry & Logic 层，既支撑内部 System LSI / Mobile 等业务，也面向外部 Fabless 客户提供制造服务。',
      },
      {
        title: '关键能力',
        body: '能力画像包括 3nm GAA、先进逻辑平台、成熟节点服务、封装协同和与主流 EDA/IP 生态的流程适配。',
      },
      {
        title: '风险观察',
        body: '需关注先进节点良率、EUV 设备供给、与 TSMC 的客户竞争、韩国地区产能集中度和 HBM/封装资源配置。',
      },
    ],
    suppliers: ['ASML：EUV 光刻系统', 'Applied Materials：沉积与刻蚀设备', 'Lam Research：刻蚀系统', 'Shin-Etsu：硅片', 'DuPont / JSR：先进材料与光刻胶', 'Screen / Lasertec：清洗与检测设备'],
    customers: ['Qualcomm：部分 Snapdragon 代工', 'Analog Devices：外部制造服务', 'NXP：合约制造', 'NVIDIA：先进封装/存储协同相关', 'AMD：高性能计算生态相关'],
    bottlenecks: ['EUV 光刻', '先进节点良率', 'GAA 工艺爬坡', '韩国地缘集中度'],
    sourceUrl: 'https://semiconductor.samsung.com/foundry/',
    backplaneUrl: 'https://www.backplane.gg/company/samsung-foundry',
  },
  {
    company: '英特尔',
    tool: 'Intel Foundry',
    ticker: 'INTC',
    verification: 'Needs Review',
    segment: 'IDM (Integrated)',
    primaryCategory: 'IDM / Foundry 服务',
    secondaryCategory: '先进制造与封装',
    stage: 'IDM 制造与开放代工',
    region: '国际',
    operationMode: 'IDM',
    headquarters: 'Santa Clara, CA，美国',
    founded: '1968',
    processNodes: ['3纳米', '5纳米', '7纳米', '16纳米', '22纳米', '65纳米'],
    supportAreas: ['PDK 支撑', 'EDA Flow 支撑', 'IP 生态支撑', '先进封装支撑'],
    tags: ['IDM', 'Intel Foundry', '先进封装', '先进制程'],
    status: 'Demo',
    summary: 'Intel Foundry 基于英特尔 IDM 制造和先进封装能力拓展开放代工，是系统级代工路线的重要样本。',
    detail: '英特尔厂商页重点展示 IDM 制造、开放代工、先进封装、玻璃基板/EUV 等瓶颈，以及与云、AI 和芯片客户的供应链关系。',
    detailSections: [
      {
        title: '产业定位',
        body: 'Intel 属于 IDM 厂商，同时通过 Intel Foundry 推进外部代工服务，覆盖逻辑制造、先进封装和系统级集成路线。',
      },
      {
        title: '关键能力',
        body: '能力画像包括先进制程路线、美国与欧洲制造布局、先进封装、Chiplet 生态、EDA/IP 合作和系统级代工能力。',
      },
      {
        title: '风险观察',
        body: '需关注先进节点量产节奏、EUV 设备供给、玻璃基板等新材料路线、外部客户导入速度和 IDM 内外部产能分配。',
      },
    ],
    suppliers: ['ASML：EUV 光刻系统', 'Teradyne：测试系统', 'DuPont：Fab 材料', 'Screen Holdings：湿法处理设备'],
    customers: ['Qualcomm：Intel Foundry Services 客户', 'Amazon Web Services：Xeon / Gaudi 相关算力供应链', 'Microsoft Azure：Xeon / Gaudi 相关算力供应链', 'Google Cloud：数据中心算力', 'Oracle Cloud：数据中心算力', 'TSMC：历史制造关系与外包调整'],
    bottlenecks: ['玻璃基板', 'EUV 光刻', '先进封装', '外部客户导入', 'IDM 产能分配'],
    sourceUrl: 'https://www.intel.com/content/www/us/en/foundry/overview.html',
    backplaneUrl: 'https://www.backplane.gg/company/intc',
  },
];

const foundryProcessNodeOptions = [
  '3纳米',
  '5纳米',
  '7纳米',
  '12纳米',
  '16纳米',
  '20纳米',
  '22纳米',
  '28纳米',
  '32纳米',
  '40纳米',
  '45纳米',
  '55纳米',
  '65纳米',
  '80纳米',
  '90纳米',
  '110纳米',
  '130纳米',
  '150纳米',
  '160纳米',
  '180纳米',
  '250纳米',
  '350纳米',
];

const companyVisuals = {
  Cadence: cadenceLogo,
  Synopsys: synopsysLogo,
  '华大九天': empyreanLogo,
  '概伦电子': primariusLogo,
  '合见工软': univistaLogo,
  '台积电': tsmcLogo,
  '中芯国际': smicLogo,
  三星: samsungLogo,
  英特尔: intelFoundryLogo,
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

const getResourceSlug = (resource) => encodeURIComponent(`${resource.company}-${resource.tool}`);

const findResourceBySlug = (resources, slug) => resources.find((resource) => getResourceSlug(resource) === slug);

const getCompanySlug = (company) => encodeURIComponent(company);

const getCompanyBySlug = (slug) =>
  Array.from(new Set(edaResources.map((resource) => resource.company))).find((company) => getCompanySlug(company) === slug);

const getCompanyResources = (company) => edaResources.filter((resource) => resource.company === company);

const getResourceVisual = (resource) => resource.imageUrl || companyVisuals[resource.company];

const getResourceSourceUrl = (resource) => resource.officialUrl || resource.sourceUrl || companySourceUrls[resource.company];

const getResourceChips = (resource) =>
  [resource.secondaryCategory, resource.stage, resource.region, resource.operationMode].filter(Boolean);

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

const getResourceDetailSections = (resource) => resource.detailSections || [
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

const companyDescriptions = {
  Cadence: 'Cadence 是全球头部 EDA 与系统设计软件厂商之一，产品覆盖定制 IC、数字实现、验证、封装/PCB、系统分析等多个设计环节。',
  Synopsys: 'Synopsys 是全球头部 EDA、IP 与软件安全解决方案厂商之一，EDA 产品覆盖数字前端、验证、后端实现、签核、工艺与制造相关流程。',
  '华大九天': '华大九天是国内 EDA 代表企业之一，产品覆盖模拟/混合信号设计、数字设计、平板显示、晶圆制造与先进封装等方向。',
  '概伦电子': '概伦电子聚焦器件建模、模型验证、仿真验证、良率提升和测试等 EDA 方向，产品常用于工艺开发、模拟设计与制造协同场景。',
  '合见工软': '合见工软聚焦芯片验证与系统级设计工具，产品覆盖仿真验证、硬件辅助验证、原型验证、DFT、PCB/原理图与工程数据管理等方向。',
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
    description: '围绕可复用芯片功能模块沉淀处理器、接口、存储、安全、模拟混合信号与基础库资源，支持从架构选型到集成验证的产业研究。',
    taxonomy: ipTaxonomy,
    resources: ipResources,
    metricResourceLabel: 'IP 样本',
    metricCompanyLabel: 'IP 企业',
    searchPlaceholder: '搜索公司、IP、协议、分类、阶段或标签',
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
        resource.sourceUrl,
        companySourceUrls[resource.company],
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
        (!keyword || searchable.includes(keyword))
      );
    });
  }, [activePrimary, activeSecondary, companyFilter, operationModeFilter, query, regionFilter, resources, stageFilter, supportFilter, supportFilterField, toolTypeFilter]);

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
                const MainElement = detailPath ? 'a' : 'button';
                const mainProps = detailPath
                  ? {
                      href: detailPath,
                      'aria-label': `打开${resource.company} ${resource.tool}内部详情页`,
                    }
                  : {
                      type: 'button',
                      onClick: () => setSelectedResource(resource),
                      'aria-label': `查看${resource.company} ${resource.tool}详情`,
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
                      <dt>二级分类</dt>
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
  const isFoundryDetail = resourceName === 'Foundry';
  const companyPath = resource && !isFoundryDetail ? `#/company/${getCompanySlug(resource.company)}` : null;
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
            <p className="eyebrow">{resourceName} DETAIL</p>
            <h1>{isFoundryDetail ? '未找到厂商' : '未找到产品'}</h1>
            <p>这个条目可能已经被调整。可以返回资源库后重新选择。</p>
          </section>
        ) : (
          <>
            <header className="product-detail-hero">
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
                <p className="eyebrow">{isFoundryDetail ? 'FOUNDRY COMPANY DETAIL' : `${resourceName} PRODUCT DETAIL`}</p>
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
                    官网详情
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
      </section>
    </main>
  );
}

function CompanyDetailPage({ company }) {
  const resources = company ? getCompanyResources(company) : [];
  const visual = company ? companyVisuals[company] : null;
  const sourceUrl = company ? companySourceUrls[company] : null;
  const categoryCount = new Set(resources.map((resource) => resource.primaryCategory)).size;
  const stageCount = new Set(resources.map((resource) => resource.stage)).size;

  return (
    <main
      className="app-shell library-shell"
      style={{
        '--bg-image': `url(${backgroundUrl})`,
        '--library-accent': libraryConfigs.eda.accentColor,
        '--library-accent-rgb': libraryConfigs.eda.accentRgb,
        '--library-contrast': libraryConfigs.eda.contrastColor,
      }}
    >
      <section className="resource-detail-page company-detail-page">
        <a className="library-back detail-back" href="#/eda">
          <ArrowLeft size={18} aria-hidden="true" />
          返回 EDA 资源库
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
                <p className="resource-company">EDA 厂商信息</p>
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
                      href={`#/eda/product/${getResourceSlug(resource)}`}
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
