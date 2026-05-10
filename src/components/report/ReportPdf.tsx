'use client'

import Image from 'next/image'


interface ReportData {
  company: string
  employees: number
  currentSpend: number
  optimizedSpend: number
  monthlySavings: number
  annualSavings: number
  savingsPercentage: number
  score: number
  reportDate: string
  tools: Array<{
    name: string
    category: string
    currentPlan: string
    seats: number
    activeUsers: number
    monthlySpend: number
    status: 'Over-provisioned' | 'Redundant' | 'Underutilized' | 'Optimal'
    savings: number
    priority: 'High' | 'Medium' | 'Low'
  }>
}

const mockData: ReportData = {
  company: 'Nexus Labs Inc.',
  employees: 42,
  currentSpend: 14280,
  optimizedSpend: 8940,
  monthlySavings: 5340,
  annualSavings: 64080,
  savingsPercentage: 37.4,
  score: 73,
  reportDate: 'May 9, 2025',
  tools: [
    {
      name: 'GitHub Copilot',
      category: 'Code Assist',
      currentPlan: 'Business',
      seats: 38,
      activeUsers: 26,
      monthlySpend: 1482,
      status: 'Over-provisioned',
      savings: 480,
      priority: 'High'
    },
    {
      name: 'OpenAI API',
      category: 'LLM API',
      currentPlan: 'Pay-as-you-go',
      seats: 0,
      activeUsers: 0,
      monthlySpend: 3840,
      status: 'Redundant',
      savings: 1200,
      priority: 'High'
    },
    {
      name: 'Claude API',
      category: 'LLM API',
      currentPlan: 'Pay-as-you-go',
      seats: 0,
      activeUsers: 0,
      monthlySpend: 2100,
      status: 'Redundant',
      savings: 900,
      priority: 'High'
    },
    {
      name: 'Grammarly',
      category: 'Writing Assistant',
      currentPlan: 'Enterprise',
      seats: 42,
      activeUsers: 28,
      monthlySpend: 1260,
      status: 'Underutilized',
      savings: 480,
      priority: 'Medium'
    },
    {
      name: 'Notion AI',
      category: 'Productivity',
      currentPlan: 'Team',
      seats: 35,
      activeUsers: 22,
      monthlySpend: 2100,
      status: 'Over-provisioned',
      savings: 600,
      priority: 'Medium'
    }
  ]
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High': return 'bg-red-100 text-red-800'
    case 'Medium': return 'bg-amber-100 text-amber-800'
    case 'Low': return 'bg-green-100 text-green-800'
    default: return 'bg-slate-100 text-slate-800'
  }
}

// PAGE 1: Cover + Executive Summary + Key Metrics
function Page1() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 md:p-12 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-brand/5 border border-brand/30 rounded-lg flex items-center justify-center font-bold text-lg">
            <Image src="/logo.png" alt="Audit My AI Logo" className="w-10 h-10" width={40} height={40} />
          </div>
          <div>
            <div className="font-bold text-lg">Audit My AI</div>
            <div className="text-sm text-slate-400">AI Tooling Report</div>
          </div>
        </div>
        <div className="text-xs bg-teal-500/20 border border-teal-500/40 px-3 py-1 rounded-full">Confidential Report</div>
      </div>

      {/* Main Heading */}
      <div className="mb-12 flex-1">
        <div className="text-xs font-semibold tracking-widest text-teal-400/80 mb-4 uppercase">AI Tooling Spend Audit</div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">Optimization Report</h1>
        <p className="text-lg text-slate-300 max-w-xl">A comprehensive analysis of your AI tooling portfolio — identifying spend inefficiencies, redundancies, and savings opportunities.</p>
      </div>

      {/* Company Info */}
      <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-slate-700">
        <div>
          <div className="text-xs uppercase text-slate-400 font-semibold mb-1">Prepared for</div>
          <div className="text-2xl font-bold">{mockData.company}</div>
          <div className="text-sm text-slate-400 mt-1">Series A · B2B SaaS · {mockData.employees} employees</div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase text-slate-400 font-semibold mb-1">Generated</div>
          <div className="text-2xl font-bold">{mockData.reportDate}</div>
          <div className="text-sm text-slate-400 mt-1">Prices verified as of report date</div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-xs uppercase text-slate-400 font-semibold mb-2">Current Monthly</div>
          <div className="text-3xl font-bold">${(mockData.currentSpend / 1000).toFixed(1)}k</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-xs uppercase text-slate-400 font-semibold mb-2">Optimized</div>
          <div className="text-3xl font-bold text-teal-400">${(mockData.optimizedSpend / 1000).toFixed(1)}k</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-xs uppercase text-slate-400 font-semibold mb-2">Monthly Savings</div>
          <div className="text-3xl font-bold text-teal-400">${(mockData.monthlySavings / 1000).toFixed(1)}k</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-xs uppercase text-slate-400 font-semibold mb-2">Score</div>
          <div className="text-3xl font-bold text-amber-400">{mockData.score}</div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-12 border-t border-slate-700 flex items-center justify-between text-xs text-slate-500">
        <span>audit-my-ai.com</span>
        <span>Page 1 of 5</span>
      </div>
    </div>
  )
}

// PAGE 2: Current Stack & Savings Opportunities
function Page2() {
  return (
    <div className="min-h-screen bg-white p-8 md:p-12 flex flex-col">
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div className="text-sm text-slate-500">Audit My AI · <span className="font-semibold">{mockData.company}</span></div>
          <div className="text-sm text-slate-500">Current Stack Overview</div>
        </div>

        <div className="mb-6">
          <div className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">Stack Overview</div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">{mockData.tools.length} Tools • ${(mockData.currentSpend / 1000).toFixed(1)}k/month</h2>
          <p className="text-slate-600">Complete inventory of your active AI tooling subscriptions.</p>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-300">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Tool</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Plan</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-700">Seats</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-700">Active</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">Monthly</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-700">Priority</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">Savings</th>
              </tr>
            </thead>
            <tbody>
              {mockData.tools.map((tool) => (
                <tr key={tool.name} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-900">{tool.name}</td>
                  <td className="py-3 px-4 text-slate-600">{tool.currentPlan}</td>
                  <td className="py-3 px-4 text-center text-slate-600">{tool.seats || '—'}</td>
                  <td className="py-3 px-4 text-center text-slate-600">{tool.activeUsers || '—'}</td>
                  <td className="py-3 px-4 text-right text-slate-900 font-semibold">${tool.monthlySpend}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getPriorityColor(tool.priority)}`}>
                      {tool.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-teal-600 font-semibold">${tool.savings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-xs font-semibold text-red-800 uppercase mb-1">🔴 High Priority</div>
            <div className="text-xl font-bold text-red-900">31% Unused</div>
            <p className="text-sm text-red-700 mt-2">Seat over-provisioning across tools</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="text-xs font-semibold text-amber-800 uppercase mb-1">🟡 Medium Priority</div>
            <div className="text-xl font-bold text-amber-900">Dual LLM</div>
            <p className="text-sm text-amber-700 mt-2">$3.1k/mo redundant coverage</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-xs font-semibold text-green-800 uppercase mb-1">🟢 Quick Win</div>
            <div className="text-xl font-bold text-green-900">Downgrade</div>
            <p className="text-sm text-green-700 mt-2">Grammarly saves $480/mo</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-8 border-t border-slate-200">
        <span>Audit My AI · Confidential</span>
        <span>Page 2 of 5</span>
      </div>
    </div>
  )
}

// PAGE 3: Detailed Analysis (Top 3-5 opportunities)
function Page3() {
  const topOpportunities = mockData.tools.filter(t => t.priority === 'High').slice(0, 5)

  return (
    <div className="min-h-screen bg-white p-8 md:p-12 flex flex-col">
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div className="text-sm text-slate-500">Audit My AI · <span className="font-semibold">{mockData.company}</span></div>
          <div className="text-sm text-slate-500">Detailed Analysis</div>
        </div>

        <div className="mb-6">
          <div className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">Detailed Opportunities</div>
          <h2 className="text-3xl font-bold text-slate-900">Top Optimization Opportunities</h2>
        </div>

        {/* Opportunity Cards */}
        <div className="space-y-4">
          {topOpportunities.map((tool, idx) => (
            <div key={tool.name} className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 font-bold">{idx + 1}</div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{tool.name}</h3>
                    <p className="text-sm text-slate-600">{tool.category}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-teal-600">
                  ${tool.savings}/mo savings
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Current Setup</div>
                  <p className="text-sm text-slate-700">
                    {tool.seats ? `${tool.seats} seats (${tool.activeUsers} active)` : 'Pay-as-you-go usage'}
                  </p>
                  <p className="text-sm font-semibold text-slate-900 mt-1">${tool.monthlySpend}/month</p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Recommendation</div>
                  <p className="text-sm text-slate-700">
                    {tool.name === 'GitHub Copilot' && 'Reduce to 28 seats'}
                    {tool.name === 'OpenAI API' && 'Consolidate routing strategy'}
                    {tool.name === 'Claude API' && 'Unified provider approach'}
                    {tool.name === 'Grammarly' && 'Switch to Business tier'}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-300">
                <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Financial Impact</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-teal-600">${tool.savings}</span>
                  <span className="text-sm text-slate-600">monthly savings</span>
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  Represents {((tool.savings / mockData.monthlySavings) * 100).toFixed(0)}% of total potential savings
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-8 border-t border-slate-200">
        <span>Audit My AI · Confidential</span>
        <span>Page 3 of 5</span>
      </div>
    </div>
  )
}

// PAGE 4: Benchmark & Projection
function Page4() {
  return (
    <div className="min-h-screen bg-white p-8 md:p-12 flex flex-col">
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div className="text-sm text-slate-500">Audit My AI · <span className="font-semibold">{mockData.company}</span></div>
          <div className="text-sm text-slate-500">Benchmark & Projection</div>
        </div>

        <div className="mb-6">
          <div className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">Financial Projection</div>
          <h2 className="text-3xl font-bold text-slate-900">Before vs After</h2>
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Current State */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-6">
            <div className="text-sm font-semibold text-red-900 mb-2">Current State</div>
            <div className="text-3xl font-bold text-red-600 mb-1">${(mockData.currentSpend / 1000).toFixed(1)}k</div>
            <div className="text-sm text-red-700">Monthly spend</div>
            <div className="text-xs text-red-600 mt-3">${(mockData.currentSpend * 12 / 1000).toFixed(0)}k annually</div>
          </div>

          {/* Optimized State */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
            <div className="text-sm font-semibold text-green-900 mb-2">After Optimization</div>
            <div className="text-3xl font-bold text-green-600 mb-1">${(mockData.optimizedSpend / 1000).toFixed(1)}k</div>
            <div className="text-sm text-green-700">Monthly spend</div>
            <div className="text-xs text-green-600 mt-3">${(mockData.optimizedSpend * 12 / 1000).toFixed(0)}k annually</div>
          </div>
        </div>

        {/* Benchmark Insights */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="text-sm font-semibold text-blue-900 mb-4">Benchmark Insights</div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-blue-700 mb-1">Spend per Employee</div>
              <div className="text-2xl font-bold text-blue-900">${(mockData.currentSpend / mockData.employees).toFixed(0)}</div>
              <div className="text-xs text-blue-600 mt-2">vs $280 avg for similar orgs</div>
            </div>
            <div>
              <div className="text-xs text-blue-700 mb-1">Spend per Developer</div>
              <div className="text-2xl font-bold text-blue-900">${(mockData.currentSpend / 15).toFixed(0)}</div>
              <div className="text-xs text-blue-600 mt-2">vs $750 avg for similar orgs</div>
            </div>
            <div>
              <div className="text-xs text-blue-700 mb-1">Efficiency Score</div>
              <div className="text-2xl font-bold text-blue-900">28th %ile</div>
              <div className="text-xs text-blue-600 mt-2">Needs improvement</div>
            </div>
          </div>
        </div>

        {/* Implementation Roadmap */}
        <div>
          <div className="text-sm font-semibold text-slate-900 mb-4">Implementation Roadmap</div>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="w-8 h-8 bg-teal-100 text-teal-600 font-bold rounded-full flex items-center justify-center flex-shrink-0 text-sm">1</div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900 text-sm">Week 1: Seat Audit</div>
                <p className="text-xs text-slate-600">Identify unused licenses</p>
              </div>
              <div className="text-teal-600 font-semibold text-sm">$480 savings</div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="w-8 h-8 bg-teal-100 text-teal-600 font-bold rounded-full flex items-center justify-center flex-shrink-0 text-sm">2</div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900 text-sm">Week 2-3: API Consolidation</div>
                <p className="text-xs text-slate-600">Implement routing strategy</p>
              </div>
              <div className="text-teal-600 font-semibold text-sm">$2,100 savings</div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="w-8 h-8 bg-teal-100 text-teal-600 font-bold rounded-full flex items-center justify-center flex-shrink-0 text-sm">3</div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900 text-sm">Week 4: Tool Migration</div>
                <p className="text-xs text-slate-600">Grammarly downgrade & testing</p>
              </div>
              <div className="text-teal-600 font-semibold text-sm">$1,760 savings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-8 border-t border-slate-200">
        <span>Audit My AI · Confidential</span>
        <span>Page 4 of 5</span>
      </div>
    </div>
  )
}

// PAGE 5: Action Plan & CTA
function Page5() {
  return (
    <div className="min-h-screen bg-white p-8 md:p-12 flex flex-col">
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div className="text-sm text-slate-500">Audit My AI · <span className="font-semibold">{mockData.company}</span></div>
          <div className="text-sm text-slate-500">Action Plan</div>
        </div>

        <div className="mb-6">
          <div className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">Next Steps</div>
          <h2 className="text-3xl font-bold text-slate-900">Implementation Action Plan</h2>
        </div>

        {/* Action Steps */}
        <div className="space-y-4 mb-8">
          {[
            { title: 'Audit Current Seats', desc: 'Review GitHub Copilot and Notion AI usage. Remove 10-12 unused licenses.' },
            { title: 'Implement API Routing', desc: 'Build routing layer for OpenAI/Claude consolidation. Estimated 1-2 days.' },
            { title: 'Test Alternative Plans', desc: 'Evaluate Grammarly Business tier before migration.' },
            { title: 'Execute Changes', desc: 'Roll out optimizations over 30 days to minimize disruption.' },
            { title: 'Monitor & Review', desc: 'Establish quarterly review cadence to prevent future drift.' }
          ].map((action, idx) => (
            <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="w-8 h-8 bg-teal-600 text-white font-bold rounded-full flex items-center justify-center flex-shrink-0 text-sm">{idx + 1}</div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900">{action.title}</div>
                <p className="text-sm text-slate-600 mt-1">{action.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Credex CTA */}
        <div className="bg-gradient-to-br from-teal-100/50 to-teal-50 border border-teal-300 rounded-lg p-6 mb-8">
          <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-3">💰 Additional Opportunity</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Unlock Infrastructure Credits</h3>
          <p className="text-sm text-slate-700 mb-4">
            Nexus Labs may qualify for <strong>$24,000/year</strong> in cloud and AI API credits through infrastructure credit programs. Our consultation helps identify and negotiate the best rates.
          </p>
          <a href="https://credex.io" className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors">
            Schedule Free Consultation →
          </a>
        </div>

        {/* Summary Box */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <div className="text-xs text-green-700 font-semibold uppercase mb-1">Total Savings</div>
              <div className="text-2xl font-bold text-green-900">${(mockData.monthlySavings / 1000).toFixed(1)}k</div>
              <div className="text-xs text-green-600 mt-1">per month</div>
            </div>
            <div>
              <div className="text-xs text-green-700 font-semibold uppercase mb-1">Annual Impact</div>
              <div className="text-2xl font-bold text-green-900">${(mockData.annualSavings / 1000).toFixed(0)}k</div>
              <div className="text-xs text-green-600 mt-1">yearly</div>
            </div>
            <div>
              <div className="text-xs text-green-700 font-semibold uppercase mb-1">Implementation</div>
              <div className="text-2xl font-bold text-green-900">30 days</div>
              <div className="text-xs text-green-600 mt-1">estimated timeline</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-8 border-t border-slate-200">
        <div className="flex gap-4">
          <span>Audit My AI · Confidential</span>
          <span>•</span>
          <span>Generated {mockData.reportDate}</span>
        </div>
        <span>Page 5 of 5</span>
      </div>
    </div>
  )
}

// Main Component
export default function ReportPdf() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Render all report pages in one continuous scroll */}
      <div className="flex-1 space-y-6 p-4 sm:p-6">
        <Page1 />
        <Page2 />
        <Page3 />
        <Page4 />
        <Page5 />
      </div>
    </div>
  )
}
