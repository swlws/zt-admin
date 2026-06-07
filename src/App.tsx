import { useState } from 'react'
import './App.css'

type MenuKey =
  | 'dashboard'
  | 'orders'
  | 'devices'
  | 'engineers'
  | 'customers'
  | 'products'
  | 'preview'
  | 'settings'

type MenuItem = {
  key: MenuKey
  label: string
  icon: string
  badge?: number
}

type PrimaryMetric = {
  label: string
  value: string
  detail: string
  trend: 'up' | 'accent'
  icon: string
}

type SecondaryMetric = {
  label: string
  value: string
  icon: string
}

type FaultType = {
  label: string
  value: number
  color: string
}

type EngineerRanking = {
  name: string
  value: number
}

type TicketStatus = '维修中' | '待派单' | '待确认' | '已完成'

type RecentTicket = {
  id: string
  customer: string
  product: string
  fault: string
  engineer: string
  status: TicketStatus
  time: string
}

const MENU_ITEMS: MenuItem[] = [
  { key: 'dashboard', label: '数据看板', icon: 'dashboard' },
  { key: 'orders', label: '工单管理', icon: 'ticket', badge: 14 },
  { key: 'devices', label: '设备管理', icon: 'device' },
  { key: 'engineers', label: '工程师管理', icon: 'engineer' },
  { key: 'customers', label: '客户管理', icon: 'customer' },
  { key: 'products', label: '产品管理', icon: 'product' },
  { key: 'preview', label: '用户端预览', icon: 'mobile' },
  { key: 'settings', label: '系统配置', icon: 'settings' },
]

const PAGE_META: Record<MenuKey, { title: string; subtitle: string }> = {
  dashboard: { title: '数据统计看板', subtitle: '2024年7月12日 · 实时数据' },
  orders: { title: '工单管理', subtitle: '快速查看待跟进工单与最新动态' },
  devices: { title: '设备管理', subtitle: '统一维护设备资产与在线状态' },
  engineers: { title: '工程师管理', subtitle: '查看人员排班、效率与服务能力' },
  customers: { title: '客户管理', subtitle: '集中沉淀客户资料与服务记录' },
  products: { title: '产品管理', subtitle: '管理型号、版本与售后策略' },
  preview: { title: '用户端预览', subtitle: '预览移动端首页、设备与报修体验' },
  settings: { title: '系统配置', subtitle: '维护系统权限、消息通知与基础配置' },
}

const PRIMARY_METRICS: PrimaryMetric[] = [
  { label: '本月报修量', value: '89', detail: '+12% 较上月', trend: 'up', icon: 'signal' },
  { label: '待处理工单', value: '14', detail: '需及时跟进', trend: 'accent', icon: 'clock' },
  { label: '本月完工量', value: '82', detail: '完工率 92%', trend: 'up', icon: 'check' },
  { label: '平均响应时长', value: '2.4h', detail: '较上月提升 18%', trend: 'up', icon: 'flash' },
]

const SECONDARY_METRICS: SecondaryMetric[] = [
  { label: '注册客户', value: '1,243', icon: 'customer' },
  { label: '绑定设备', value: '3,891', icon: 'device' },
  { label: '工程师数', value: '18', icon: 'engineer' },
  { label: '平均评分', value: '4.7', icon: 'star' },
]

const TREND_MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
const REPAIR_VALUES = [42, 55, 61, 58, 73, 81, 89]
const FINISH_VALUES = [35, 49, 54, 53, 66, 75, 82]

const FAULT_TYPES: FaultType[] = [
  { label: '摄像头故障', value: 38, color: '#3b82f6' },
  { label: '网络连接', value: 22, color: '#22c55e' },
  { label: '存储异常', value: 18, color: '#f59e0b' },
  { label: '电源问题', value: 12, color: '#8b5cf6' },
  { label: '其他', value: 10, color: '#94a3b8' },
]

const ENGINEER_RANKINGS: EngineerRanking[] = [
  { name: '王工', value: 56 },
  { name: '李工', value: 49 },
  { name: '张工', value: 42 },
  { name: '刘工', value: 35 },
  { name: '陈工', value: 28 },
]

const RECENT_TICKETS: RecentTicket[] = [
  {
    id: 'WO-2024071201',
    customer: '广州某科技园',
    product: 'IPC-4K-2803',
    fault: '摄像头离线',
    engineer: '张工',
    status: '维修中',
    time: '10分钟前',
  },
  {
    id: 'WO-2024071198',
    customer: '深圳仓储物流',
    product: 'NVR-16CH-Pro',
    fault: '录像异常',
    engineer: '王工',
    status: '待派单',
    time: '32分钟前',
  },
  {
    id: 'WO-2024071195',
    customer: '东莞制造工厂',
    product: 'IPC-4K-2801',
    fault: '画面模糊',
    engineer: '李工',
    status: '待确认',
    time: '1小时前',
  },
  {
    id: 'WO-2024071190',
    customer: '佛山商业广场',
    product: 'PTZ-360-Pro',
    fault: '云台失控',
    engineer: '陈工',
    status: '已完成',
    time: '3小时前',
  },
  {
    id: 'WO-2024071185',
    customer: '中山办公楼',
    product: 'IPC-4K-2799',
    fault: '红外失效',
    engineer: '刘工',
    status: '已完成',
    time: '5小时前',
  },
  {
    id: 'WO-2024071179',
    customer: '珠海连锁门店',
    product: 'DoorCam-X2',
    fault: '网络波动',
    engineer: '王工',
    status: '维修中',
    time: '昨天 21:18',
  },
]

const SEARCH_FILTERS = ['全部', '工单', '客户', '设备'] as const

function buildLinePath(values: number[], width: number, height: number, maxValue: number) {
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width
      const y = height - (value / maxValue) * height
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')
}

function buildAreaPath(values: number[], width: number, height: number, maxValue: number) {
  const line = buildLinePath(values, width, height, maxValue)
  return `${line} L ${width} ${height} L 0 ${height} Z`
}

function getStatusClassName(status: TicketStatus) {
  if (status === '已完成') return 'status-pill status-pill-success'
  if (status === '维修中') return 'status-pill status-pill-warning'
  if (status === '待派单') return 'status-pill status-pill-neutral'
  return 'status-pill status-pill-pending'
}

function Icon({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const commonProps = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (name) {
    case 'dashboard':
      return (
        <svg {...commonProps}>
          <rect x="3" y="3" width="8" height="8" rx="2" />
          <rect x="13" y="3" width="8" height="5" rx="2" />
          <rect x="13" y="10" width="8" height="11" rx="2" />
          <rect x="3" y="13" width="8" height="8" rx="2" />
        </svg>
      )
    case 'ticket':
      return (
        <svg {...commonProps}>
          <path d="M5 7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v2.25a1.75 1.75 0 0 0 0 3.5v2.25A2.5 2.5 0 0 1 16.5 18h-9A2.5 2.5 0 0 1 5 15.5v-2.25a1.75 1.75 0 0 0 0-3.5Z" />
          <path d="M9 9h6M9 15h4" />
        </svg>
      )
    case 'device':
      return (
        <svg {...commonProps}>
          <rect x="4" y="5" width="16" height="11" rx="2.5" />
          <path d="M8 19h8M10 16v3M14 16v3" />
        </svg>
      )
    case 'engineer':
      return (
        <svg {...commonProps}>
          <path d="M12 13a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </svg>
      )
    case 'customer':
      return (
        <svg {...commonProps}>
          <path d="M8.5 12a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 8.5 12Z" />
          <path d="M15.5 11a2.5 2.5 0 1 0-2.5-2.5 2.5 2.5 0 0 0 2.5 2.5Z" />
          <path d="M3.5 19.5a5 5 0 0 1 10 0M13 19.5a4 4 0 0 1 7 0" />
        </svg>
      )
    case 'product':
      return (
        <svg {...commonProps}>
          <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9Z" />
          <path d="m12 12 8-4.5M12 12 4 7.5M12 12v9" />
        </svg>
      )
    case 'mobile':
      return (
        <svg {...commonProps}>
          <rect x="7" y="3" width="10" height="18" rx="2.5" />
          <path d="M11 6h2M10 18h4" />
        </svg>
      )
    case 'settings':
      return (
        <svg {...commonProps}>
          <path d="M12 8.25A3.75 3.75 0 1 0 15.75 12 3.75 3.75 0 0 0 12 8.25Z" />
          <path d="M19.4 15a1 1 0 0 0 .2 1.1l.05.05a2 2 0 0 1-2.82 2.82l-.05-.05a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.91V20a2 2 0 0 1-4 0v-.08a1 1 0 0 0-.66-.94 1 1 0 0 0-1.1.2l-.05.05a2 2 0 1 1-2.82-2.82l.05-.05a1 1 0 0 0 .2-1.1 1 1 0 0 0-.91-.6H4a2 2 0 0 1 0-4h.08a1 1 0 0 0 .94-.66 1 1 0 0 0-.2-1.1l-.05-.05a2 2 0 0 1 2.82-2.82l.05.05a1 1 0 0 0 1.1.2H9a1 1 0 0 0 .6-.91V4a2 2 0 0 1 4 0v.08a1 1 0 0 0 .66.94 1 1 0 0 0 1.1-.2l.05-.05a2 2 0 0 1 2.82 2.82l-.05.05a1 1 0 0 0-.2 1.1V9c0 .41.25.78.63.93a1 1 0 0 0 .35.07H20a2 2 0 0 1 0 4h-.08a1 1 0 0 0-.52.1Z" />
        </svg>
      )
    case 'signal':
      return (
        <svg {...commonProps}>
          <path d="M4 18h16" />
          <path d="M7 18V9M12 18V6M17 18v-4" />
        </svg>
      )
    case 'clock':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l2.75 2.75" />
        </svg>
      )
    case 'check':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="8" />
          <path d="m8.5 12.2 2.3 2.3 4.8-5.1" />
        </svg>
      )
    case 'flash':
      return (
        <svg {...commonProps}>
          <path d="M13 2 6 13h5l-1 9 8-12h-5l0-8Z" />
        </svg>
      )
    case 'star':
      return (
        <svg {...commonProps}>
          <path d="m12 3 2.7 5.46 6.03.88-4.37 4.26 1.03 6.01L12 16.8l-5.39 2.81 1.03-6.01-4.37-4.26 6.03-.88Z" />
        </svg>
      )
    case 'search':
      return (
        <svg {...commonProps}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
      )
    case 'bell':
      return (
        <svg {...commonProps}>
          <path d="M7 10a5 5 0 0 1 10 0c0 5 2 6 2 6H5s2-1 2-6" />
          <path d="M10 19a2 2 0 0 0 4 0" />
        </svg>
      )
    case 'chevron':
      return (
        <svg {...commonProps}>
          <path d="m9 6 6 6-6 6" />
        </svg>
      )
    case 'menu':
      return (
        <svg {...commonProps}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      )
    case 'close':
      return (
        <svg {...commonProps}>
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      )
    default:
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      )
  }
}

function DashboardPage({
  searchValue,
  searchScope,
  showAllTickets,
  onToggleTickets,
}: {
  searchValue: string
  searchScope: (typeof SEARCH_FILTERS)[number]
  showAllTickets: boolean
  onToggleTickets: () => void
}) {
  const chartWidth = 660
  const chartHeight = 230
  const chartMax = 100
  const repairPath = buildLinePath(REPAIR_VALUES, chartWidth, chartHeight, chartMax)
  const finishPath = buildLinePath(FINISH_VALUES, chartWidth, chartHeight, chartMax)
  const repairAreaPath = buildAreaPath(REPAIR_VALUES, chartWidth, chartHeight, chartMax)

  const keyword = searchValue.trim().toLowerCase()
  const filteredTickets = RECENT_TICKETS.filter((ticket) => {
    const matchesKeyword =
      keyword.length === 0 ||
      [
        ticket.id,
        ticket.customer,
        ticket.product,
        ticket.fault,
        ticket.engineer,
        ticket.status,
      ]
        .join(' ')
        .toLowerCase()
        .includes(keyword)

    if (!matchesKeyword) {
      return false
    }

    if (searchScope === '工单') {
      return ticket.id.toLowerCase().includes(keyword) || ticket.fault.toLowerCase().includes(keyword)
    }

    if (searchScope === '客户') {
      return ticket.customer.toLowerCase().includes(keyword)
    }

    if (searchScope === '设备') {
      return ticket.product.toLowerCase().includes(keyword)
    }

    return true
  })

  const visibleTickets = showAllTickets ? filteredTickets : filteredTickets.slice(0, 5)

  const totalFaultValue = FAULT_TYPES.reduce((total, item) => total + item.value, 0)
  let accumulated = 0
  const donutSegments = FAULT_TYPES.map((item) => {
    const start = (accumulated / totalFaultValue) * 360
    accumulated += item.value
    return {
      ...item,
      start,
      end: (accumulated / totalFaultValue) * 360,
    }
  })

  return (
    <div className="dashboard-page">
      <section className="page-heading">
        <div>
          <p className="eyebrow">运营总览</p>
          <h1>数据统计看板</h1>
          <p className="page-subtitle">2024年7月12日 · 实时数据</p>
        </div>
        <div className="heading-actions">
          <button className="ghost-button" type="button">
            导出报表
          </button>
          <button className="primary-button" type="button">
            创建工单
          </button>
        </div>
      </section>

      <section className="metric-grid primary-grid">
        {PRIMARY_METRICS.map((metric) => (
          <article className="metric-card feature-card" key={metric.label}>
            <div className="metric-card-header">
              <span className="metric-icon">
                <Icon name={metric.icon} />
              </span>
              <span className={`trend-badge trend-badge-${metric.trend}`}>{metric.detail}</span>
            </div>
            <div className="metric-value">{metric.value}</div>
            <div className="metric-label">{metric.label}</div>
          </article>
        ))}
      </section>

      <section className="metric-grid secondary-grid">
        {SECONDARY_METRICS.map((metric) => (
          <article className="metric-card compact-card" key={metric.label}>
            <div>
              <div className="compact-label">{metric.label}</div>
              <div className="compact-value">{metric.value}</div>
            </div>
            <span className="compact-icon">
              <Icon name={metric.icon} />
            </span>
          </article>
        ))}
      </section>

      <section className="panel-grid panel-grid-top">
        <article className="panel chart-panel">
          <div className="panel-header">
            <div>
              <h2>报修 / 完工趋势</h2>
              <p>跟踪近七个月服务需求与履约表现</p>
            </div>
            <div className="legend-inline">
              <span>
                <i className="legend-dot legend-dot-blue" />
                报修量
              </span>
              <span>
                <i className="legend-dot legend-dot-green" />
                完工量
              </span>
            </div>
          </div>

          <div className="chart-shell">
            <div className="chart-axis-labels">
              {[100, 75, 50, 25, 0].map((tick) => (
                <span key={tick}>{tick}</span>
              ))}
            </div>

            <div className="chart-stage">
              <svg className="trend-chart" viewBox={`0 0 ${chartWidth} ${chartHeight + 28}`}>
                <defs>
                  <linearGradient id="repairArea" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(59,130,246,0.28)" />
                    <stop offset="100%" stopColor="rgba(59,130,246,0)" />
                  </linearGradient>
                </defs>

                {[0, 25, 50, 75, 100].map((tick) => {
                  const y = chartHeight - (tick / chartMax) * chartHeight
                  return <line key={tick} x1="0" y1={y} x2={chartWidth} y2={y} className="grid-line" />
                })}

                <path d={repairAreaPath} fill="url(#repairArea)" />
                <path d={repairPath} className="repair-line" />
                <path d={finishPath} className="finish-line" />

                {REPAIR_VALUES.map((value, index) => {
                  const x = (index / (REPAIR_VALUES.length - 1)) * chartWidth
                  const y = chartHeight - (value / chartMax) * chartHeight
                  const finishY = chartHeight - (FINISH_VALUES[index] / chartMax) * chartHeight
                  return (
                    <g key={TREND_MONTHS[index]}>
                      <circle cx={x} cy={y} r="4.5" className="repair-point" />
                      <circle cx={x} cy={finishY} r="4.5" className="finish-point" />
                      <text x={x} y={chartHeight + 22} textAnchor="middle" className="month-label">
                        {TREND_MONTHS[index]}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>
        </article>

        <article className="panel donut-panel">
          <div className="panel-header">
            <div>
              <h2>故障类型分布</h2>
              <p>本月报修来源集中在前两类问题</p>
            </div>
          </div>

          <div className="donut-wrap">
            <div
              className="donut-chart"
              style={{
                background: `conic-gradient(${donutSegments
                  .map((item) => `${item.color} ${item.start}deg ${item.end}deg`)
                  .join(', ')})`,
              }}
            >
              <div className="donut-inner">
                <strong>89</strong>
                <span>总报修量</span>
              </div>
            </div>

            <div className="donut-legend">
              {FAULT_TYPES.map((item) => (
                <div className="legend-row" key={item.label}>
                  <span className="legend-label">
                    <i className="legend-dot" style={{ backgroundColor: item.color }} />
                    {item.label}
                  </span>
                  <strong>{item.value}%</strong>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="panel-grid panel-grid-bottom">
        <article className="panel ranking-panel">
          <div className="panel-header">
            <div>
              <h2>工程师完工排行</h2>
              <p>按本月完工量统计</p>
            </div>
          </div>

          <div className="ranking-list">
            {ENGINEER_RANKINGS.map((item) => (
              <div className="ranking-row" key={item.name}>
                <span className="ranking-name">{item.name}</span>
                <div className="ranking-bar-track">
                  <div className="ranking-bar-fill" style={{ width: `${(item.value / 60) * 100}%` }} />
                </div>
                <strong className="ranking-value">{item.value}</strong>
              </div>
            ))}
          </div>

          <div className="ranking-scale">
            {[0, 15, 30, 45, 60].map((tick) => (
              <span key={tick}>{tick}</span>
            ))}
          </div>
        </article>

        <article className="panel tickets-panel">
          <div className="panel-header">
            <div>
              <h2>最新工单动态</h2>
              <p>根据当前搜索词与筛选范围实时更新</p>
            </div>
            <button className="text-button" type="button" onClick={onToggleTickets}>
              {showAllTickets ? '收起列表' : '查看全部'}
            </button>
          </div>

          <div className="table-wrap">
            <table className="ticket-table">
              <thead>
                <tr>
                  <th>工单号</th>
                  <th>客户</th>
                  <th>设备型号</th>
                  <th>故障类型</th>
                  <th>负责工程师</th>
                  <th>状态</th>
                  <th>时间</th>
                </tr>
              </thead>
              <tbody>
                {visibleTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>{ticket.id}</td>
                    <td>{ticket.customer}</td>
                    <td>{ticket.product}</td>
                    <td>{ticket.fault}</td>
                    <td>{ticket.engineer}</td>
                    <td>
                      <span className={getStatusClassName(ticket.status)}>{ticket.status}</span>
                    </td>
                    <td>{ticket.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {visibleTickets.length === 0 ? (
              <div className="empty-state">没有匹配的工单记录，试试调整搜索条件。</div>
            ) : null}
          </div>
        </article>
      </section>
    </div>
  )
}

function PlaceholderPage({ activeMenu }: { activeMenu: MenuKey }) {
  return (
    <section className="placeholder-page">
      <div className="placeholder-card">
        <p className="eyebrow">模块预览</p>
        <h1>{PAGE_META[activeMenu].title}</h1>
        <p className="page-subtitle">{PAGE_META[activeMenu].subtitle}</p>
        <div className="placeholder-grid">
          <article className="placeholder-tile">
            <h3>页面结构已接入</h3>
            <p>该模块已经切入统一后台框架，可继续按 UI 稿扩展详情页、列表和表单交互。</p>
          </article>
          <article className="placeholder-tile">
            <h3>推荐下一步</h3>
            <p>补充筛选栏、状态卡、分页表格和详情抽屉，保持与数据看板一致的视觉体系。</p>
          </article>
        </div>
      </div>
    </section>
  )
}

function App() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeMenu, setActiveMenu] = useState<MenuKey>('dashboard')
  const [searchValue, setSearchValue] = useState('')
  const [searchScope, setSearchScope] = useState<(typeof SEARCH_FILTERS)[number]>('全部')
  const [showAllTickets, setShowAllTickets] = useState(false)
  const [showAlerts, setShowAlerts] = useState(true)

  return (
    <div className={`admin-shell${collapsed ? ' admin-shell-collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">ZT</div>
          {!collapsed ? (
            <div className="brand-copy">
              <strong>智庭科技</strong>
              <span>售后管理系统</span>
            </div>
          ) : null}
          <button
            className="collapse-button"
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? '展开侧边栏' : '收起侧边栏'}
          >
            <Icon name="menu" />
          </button>
        </div>

        <nav className="sidebar-nav">
          {MENU_ITEMS.map((item) => (
            <button
              className={`nav-item${activeMenu === item.key ? ' nav-item-active' : ''}`}
              key={item.key}
              type="button"
              onClick={() => setActiveMenu(item.key)}
            >
              <span className="nav-icon">
                <Icon name={item.icon} />
              </span>
              {!collapsed ? <span className="nav-label">{item.label}</span> : null}
              {!collapsed && item.badge ? <span className="nav-badge">{item.badge}</span> : null}
            </button>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">管</div>
          {!collapsed ? (
            <div className="user-copy">
              <strong>管理员</strong>
              <span>admin@zhiting.com</span>
            </div>
          ) : null}
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-title">
            <div>
              <span className="system-name">智庭科技售后系统</span>
              <div className="breadcrumb">
                <span>后台管理</span>
                <Icon name="chevron" className="breadcrumb-icon" />
                <strong>{MENU_ITEMS.find((item) => item.key === activeMenu)?.label}</strong>
              </div>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="search-panel">
              <label className="search-input">
                <Icon name="search" className="search-icon" />
                <input
                  type="text"
                  placeholder="全局搜索..."
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                />
              </label>
              <div className="filter-tabs">
                {SEARCH_FILTERS.map((item) => (
                  <button
                    className={`filter-tab${searchScope === item ? ' filter-tab-active' : ''}`}
                    key={item}
                    type="button"
                    onClick={() => setSearchScope(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <button
              className={`icon-button${showAlerts ? ' icon-button-active' : ''}`}
              type="button"
              aria-label="通知"
              onClick={() => setShowAlerts((value) => !value)}
            >
              <Icon name="bell" />
            </button>

            <button className="profile-trigger" type="button">
              <span className="user-avatar topbar-avatar">管</span>
            </button>
          </div>
        </header>

        <main className="content-area">
          {showAlerts ? (
            <div className="alert-banner">
              <div>
                <strong>今日重点</strong>
                <span> 当前仍有 14 个待处理工单，其中 3 个已超 2 小时未响应。</span>
              </div>
              <button type="button" className="banner-close" onClick={() => setShowAlerts(false)}>
                <Icon name="close" />
              </button>
            </div>
          ) : null}

          {activeMenu === 'dashboard' ? (
            <DashboardPage
              searchValue={searchValue}
              searchScope={searchScope}
              showAllTickets={showAllTickets}
              onToggleTickets={() => setShowAllTickets((value) => !value)}
            />
          ) : (
            <PlaceholderPage activeMenu={activeMenu} />
          )}
        </main>
      </div>
    </div>
  )
}

export default App
