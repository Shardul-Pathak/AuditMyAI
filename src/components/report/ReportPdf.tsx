'use client'

import Image from 'next/image'
import type { GeneratedReportContent } from '@/utils/report/types'
import type { AuditItemDto } from '@/utils/dto/types'

interface ReportPdfProps {
  generatedContent: GeneratedReportContent
  items: AuditItemDto[]
  teamSize: number
  totalMonthlySpend: number
  totalMonthlySavings: number
  totalAnnualSavings: number
  auditScore: number
  createdAt: string
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
    case 'HIGH':
      return 'bg-red-100 text-red-800'
    case 'Medium':
    case 'MEDIUM':
      return 'bg-amber-100 text-amber-800'
    case 'Low':
    case 'LOW':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-slate-100 text-slate-800'
  }
}

const getPriorityCityColor = (priority: string): 'red' | 'amber' | 'green' => {
  const p = priority.toUpperCase()
  if (p === 'HIGH') return 'red'
  if (p === 'MEDIUM') return 'amber'
  return 'green'
}

function Page1({ content, teamSize, totalMonthlySpend, totalMonthlySavings, totalAnnualSavings, auditScore, createdAt }: ReportPdfProps & { content: GeneratedReportContent }) {
  const optimizedSpend = totalMonthlySpend - totalMonthlySavings
  const savingsPercentage = ((totalMonthlySavings / totalMonthlySpend) * 100).toFixed(1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 md:p-12 flex flex-col">
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

      <div className="mb-12 flex-1">
        <div className="text-xs font-semibold tracking-widest text-teal-400/80 mb-4 uppercase">AI Tooling Spend Audit</div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">Optimization Report</h1>
        <p className="text-lg text-slate-300 max-w-xl">A comprehensive analysis of your AI tooling portfolio — identifying spend inefficiencies, redundancies, and savings opportunities.</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-slate-700">
        <div>
          <div className="text-xs uppercase text-slate-400 font-semibold mb-1">Prepared for</div>
          <div className="text-2xl font-bold">Engineering Organization</div>
          <div className="text-sm text-slate-400 mt-1">Team Size: {teamSize} · Confidential</div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase text-slate-400 font-semibold mb-1">Generated</div>
          <div className="text-2xl font-bold">{new Date(createdAt).toLocaleDateString()}</div>
          <div className="text-sm text-slate-400 mt-1">Prices verified as of report date</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-xs uppercase text-slate-400 font-semibold mb-2">Current Monthly</div>
          <div className="text-3xl font-bold">${(totalMonthlySpend / 1000).toFixed(1)}k</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-xs uppercase text-slate-400 font-semibold mb-2">Optimized</div>
          <div className="text-3xl font-bold text-teal-400">${(optimizedSpend / 1000).toFixed(1)}k</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-xs uppercase text-slate-400 font-semibold mb-2">Monthly Savings</div>
          <div className="text-3xl font-bold text-teal-400">${(totalMonthlySavings / 1000).toFixed(1)}k</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-xs uppercase text-slate-400 font-semibold mb-2">Score</div>
          <div className="text-3xl font-bold text-amber-400">{auditScore}</div>
        </div>
      </div>

      <div className="mt-auto pt-12 border-t border-slate-700 flex items-center justify-between text-xs text-slate-500">
        <span>audit-my-ai.com</span>
        <span>Page 1 of 5</span>
      </div>
    </div>
  )
}

function Page2({ content, items, totalMonthlySpend, totalMonthlySavings }: Pick<ReportPdfProps, 'generatedContent' | 'items' | 'totalMonthlySpend' | 'totalMonthlySavings'> & { content: GeneratedReportContent }) {
  return (
    <div className="min-h-screen bg-white p-8 md:p-12 flex flex-col">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div className="text-sm text-slate-500">Audit My AI · <span className="font-semibold">AI Tooling Audit</span></div>
          <div className="text-sm text-slate-500">Current Stack Overview</div>
        </div>

        <div className="mb-6">
          <div className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">Stack Overview</div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">{items.length} Tools • ${(totalMonthlySpend / 1000).toFixed(1)}k/month</h2>
          <p className="text-slate-600">{content.stackOverviewSummary}</p>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-300">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Tool</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Current Plan</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Recommended</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">Current Cost</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">Savings</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Priority</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={`${item.toolName}-${item.currentPlan}`} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-900">{item.toolName}</td>
                  <td className="py-3 px-4 text-slate-600">{item.currentPlan}</td>
                  <td className="py-3 px-4 text-slate-600">{item.recommendedPlan}</td>
                  <td className="py-3 px-4 text-right text-slate-900 font-semibold">${item.currentMonthlyCost}</td>
                  <td className="py-3 px-4 text-right text-teal-600 font-semibold">${item.monthlySavings}</td>
                  <td className="py-3 px-4 text-left">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getPriorityColor(item.recommendationType)}`}>
                      {item.recommendationType}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          {content.summaryCards.slice(0, 3).map((card, idx) => {
            const colorClass = card.priority === 'HIGH' ? 'bg-red-50 border-red-200' :
                               card.priority === 'MEDIUM' ? 'bg-amber-50 border-amber-200' :
                               'bg-green-50 border-green-200'
            const textClass = card.priority === 'HIGH' ? 'text-red-800' :
                             card.priority === 'MEDIUM' ? 'text-amber-800' :
                             'text-green-800'
            return (
              <div key={idx} className={`${colorClass} border rounded-lg p-4`}>
                <div className={`text-xs font-semibold ${textClass} uppercase mb-1`}>{card.priority} Priority</div>
                <div className={`text-xl font-bold ${textClass.replace('text-', 'text-').replace('800', '900')}`}>{card.value}</div>
                <p className={`text-sm ${textClass.replace('800', '700')} mt-2`}>{card.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-8 border-t border-slate-200">
        <span>Audit My AI · Confidential</span>
        <span>Page 2 of 5</span>
      </div>
    </div>
  )
}

function Page3({ content }: Pick<ReportPdfProps, 'generatedContent'> & { content: GeneratedReportContent }) {
  return (
    <div className="min-h-screen bg-white p-8 md:p-12 flex flex-col">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div className="text-sm text-slate-500">Audit My AI · <span className="font-semibold">AI Tooling Audit</span></div>
          <div className="text-sm text-slate-500">Detailed Analysis</div>
        </div>

        <div className="mb-6">
          <div className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">Detailed Opportunities</div>
          <h2 className="text-3xl font-bold text-slate-900">Top Optimization Opportunities</h2>
        </div>

        <div className="space-y-4">
          {content.topOpportunities.map((opp, idx) => (
            <div key={idx} className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 font-bold">{idx + 1}</div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{opp.title}</h3>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Issue</div>
                <p className="text-sm text-slate-700">{opp.summary}</p>
              </div>

              <div className="mb-4">
                <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Recommendation</div>
                <p className="text-sm text-slate-700">{opp.recommendation}</p>
              </div>

              <div className="pt-4 border-t border-slate-300">
                <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Business Impact</div>
                <p className="text-sm text-slate-700">{opp.businessImpact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-8 border-t border-slate-200">
        <span>Audit My AI · Confidential</span>
        <span>Page 3 of 5</span>
      </div>
    </div>
  )
}

function Page4({ content, totalMonthlySpend, totalMonthlySavings }: Pick<ReportPdfProps, 'generatedContent' | 'totalMonthlySpend' | 'totalMonthlySavings'> & { content: GeneratedReportContent }) {
  const optimizedSpend = totalMonthlySpend - totalMonthlySavings

  return (
    <div className="min-h-screen bg-white p-8 md:p-12 flex flex-col">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div className="text-sm text-slate-500">Audit My AI · <span className="font-semibold">AI Tooling Audit</span></div>
          <div className="text-sm text-slate-500">Benchmark & Implementation</div>
        </div>

        <div className="mb-6">
          <div className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">Strategic Insights</div>
          <h2 className="text-3xl font-bold text-slate-900">Benchmark & Implementation Roadmap</h2>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-6">
            <div className="text-sm font-semibold text-red-900 mb-2">Current State</div>
            <div className="text-3xl font-bold text-red-600 mb-1">${(totalMonthlySpend / 1000).toFixed(1)}k</div>
            <div className="text-sm text-red-700">Monthly spend</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
            <div className="text-sm font-semibold text-green-900 mb-2">After Optimization</div>
            <div className="text-3xl font-bold text-green-600 mb-1">${(optimizedSpend / 1000).toFixed(1)}k</div>
            <div className="text-sm text-green-700">Monthly spend</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="text-sm font-semibold text-blue-900 mb-4">Benchmark Insights</div>
          <div className="space-y-2">
            <p className="text-sm text-blue-900"><span className="font-semibold">Spend Efficiency:</span> {content.benchmarkInsights.spendEfficiency}</p>
            <p className="text-sm text-blue-900"><span className="font-semibold">Tool Overlap:</span> {content.benchmarkInsights.toolOverlap}</p>
            <p className="text-sm text-blue-900"><span className="font-semibold">Operational Risk:</span> {content.benchmarkInsights.operationalRisk}</p>
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-slate-900 mb-4">Implementation Roadmap</div>
          <div className="space-y-3">
            {content.implementationRoadmap.map((phase, idx) => (
              <div key={idx} className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-8 h-8 bg-teal-100 text-teal-600 font-bold rounded-full flex items-center justify-center flex-shrink-0 text-sm">{idx + 1}</div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 text-sm">{phase.phase}</div>
                  <p className="text-xs text-slate-600 mt-1"><span className="font-semibold">Objective:</span> {phase.objective}</p>
                  <p className="text-xs text-slate-600 mt-1"><span className="font-semibold">Outcome:</span> {phase.expectedOutcome}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-8 border-t border-slate-200">
        <span>Audit My AI · Confidential</span>
        <span>Page 4 of 5</span>
      </div>
    </div>
  )
}

function Page5({ content, totalMonthlySavings, totalAnnualSavings, createdAt }: Pick<ReportPdfProps, 'generatedContent' | 'totalMonthlySavings' | 'totalAnnualSavings' | 'createdAt'> & { content: GeneratedReportContent }) {
  return (
    <div className="min-h-screen bg-white p-8 md:p-12 flex flex-col">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div className="text-sm text-slate-500">Audit My AI · <span className="font-semibold">AI Tooling Audit</span></div>
          <div className="text-sm text-slate-500">Action Plan</div>
        </div>

        <div className="mb-6">
          <div className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">Next Steps</div>
          <h2 className="text-3xl font-bold text-slate-900">Implementation Action Plan</h2>
        </div>

        <div className="space-y-4 mb-8">
          {[
            { title: 'Review Current Setup', desc: 'Audit subscriptions and current utilization patterns' },
            { title: 'Stakeholder Communication', desc: 'Brief team on changes and impact' },
            { title: 'Execute Optimizations', desc: 'Implement recommended changes' },
            { title: 'Monitor & Validate', desc: 'Track savings and adjust as needed' },
            { title: 'Quarterly Reviews', desc: 'Establish cadence to prevent future drift' }
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

        <div className="bg-gradient-to-br from-teal-100/50 to-teal-50 border border-teal-300 rounded-lg p-6 mb-8">
          <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-3">💡 Strategic Opportunity</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Infrastructure Credits & Vendor Negotiations</h3>
          <p className="text-sm text-slate-700 mb-4">{content.credexOpportunity}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <div className="text-xs text-green-700 font-semibold uppercase mb-1">Total Savings</div>
              <div className="text-2xl font-bold text-green-900">${(totalMonthlySavings / 1000).toFixed(1)}k</div>
              <div className="text-xs text-green-600 mt-1">per month</div>
            </div>
            <div>
              <div className="text-xs text-green-700 font-semibold uppercase mb-1">Annual Impact</div>
              <div className="text-2xl font-bold text-green-900">${(totalAnnualSavings / 1000).toFixed(0)}k</div>
              <div className="text-xs text-green-600 mt-1">yearly</div>
            </div>
            <div>
              <div className="text-xs text-green-700 font-semibold uppercase mb-1">Key Insight</div>
              <div className="text-xl font-bold text-green-900">{content.finalRecommendation.split('.')[0]}</div>
              <div className="text-xs text-green-600 mt-1">strategic focus</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-8 border-t border-slate-200">
        <div className="flex gap-4">
          <span>Audit My AI · Confidential</span>
          <span>•</span>
          <span>Generated {new Date(createdAt).toLocaleDateString()}</span>
        </div>
        <span>Page 5 of 5</span>
      </div>
    </div>
  )
}

export default function ReportPdf(props: ReportPdfProps) {
  const { generatedContent: content } = props

  if (!content) {
    return (
      <div className="min-h-screen bg-white p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Report Unavailable</h1>
          <p className="text-slate-600">The generated report content is not available. Please try again or contact support.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-white">
      <Page1 {...props} content={content} />
      <Page2 generatedContent={content} items={props.items} totalMonthlySpend={props.totalMonthlySpend} totalMonthlySavings={props.totalMonthlySavings} content={content} />
      <Page3 generatedContent={content} content={content} />
      <Page4 generatedContent={content} totalMonthlySpend={props.totalMonthlySpend} totalMonthlySavings={props.totalMonthlySavings} content={content} />
      <Page5 generatedContent={content} totalMonthlySavings={props.totalMonthlySavings} totalAnnualSavings={props.totalAnnualSavings} createdAt={props.createdAt} content={content} />
    </div>
  )
}
