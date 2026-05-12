'use client'

import { useAuditForm } from '@/hooks/useAuditForm'
import { BUDGETS, USE_CASES } from '@/utils/auditForm/constants'
import { LoadingState, ErrorState } from './AuditFormStates'
import { FieldLabel, Input, Select, Textarea } from './AuditFormFields'
import ToolRow from './ToolRow'

export default function AuditForm() {
  const {
    loading, progress, data, error,
    saveStatus, lastSaved,
    update, updateTool, addTool, removeTool,
    handleSubmit,
  } = useAuditForm()

  if (loading) return <LoadingState progress={progress} />
  if (error) return <ErrorState message={error} />

  return (
    <div className="w-full max-w-3xl mx-auto rounded-4xl border border-white/60 bg-white/90 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">

      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand mb-2">AI Spend Audit</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-950">Analyze your AI stack</h2>
        {saveStatus && (
          <p className="text-xs text-slate-400 mt-2">
            {saveStatus}{lastSaved ? ` • ${new Date(lastSaved).toLocaleString()}` : ''}
          </p>
        )}
      </div>

      <div className="space-y-6">

        {data.tools.map((tool, index) => (
          <ToolRow
            key={index}
            tool={tool}
            showRemove={data.tools.length > 1}
            onUpdate={(field, value) => updateTool(index, field, value)}
            onRemove={() => removeTool(index)}
          />
        ))}

        <button
          type="button"
          onClick={addTool}
          className="rounded-2xl border border-dashed border-brand/40 px-5 py-4 text-sm font-medium text-brand hover:bg-brand/5 transition-colors"
        >
          + Add another AI tool
        </button>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <FieldLabel>Primary use case</FieldLabel>
            <Select value={data.primaryUseCase} onChange={(v) => update({ primaryUseCase: v })} options={USE_CASES} />
          </div>
          <div>
            <FieldLabel>Estimated monthly AI budget</FieldLabel>
            <Select value={data.monthlyBudget} onChange={(v) => update({ monthlyBudget: v })} options={BUDGETS} />
          </div>
        </div>

        <div>
          <FieldLabel>Team size using AI</FieldLabel>
          <Input value={data.teamSize} onChange={(v) => update({ teamSize: v })} placeholder="15" type="number" />
        </div>

        <div>
          <FieldLabel>Biggest frustration with your AI stack</FieldLabel>
          <Textarea
            value={data.currentPain}
            onChange={(v) => update({ currentPain: v })}
            placeholder="Unused seats, overlapping tools, unpredictable API costs..."
          />
        </div>

      </div>

      <div className="mt-10 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          className="group rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(16,185,129,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(16,185,129,0.32)]"
        >
          <span className="flex items-center gap-2">
            Generate AI Audit
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </span>
        </button>
      </div>

    </div>
  )
}
