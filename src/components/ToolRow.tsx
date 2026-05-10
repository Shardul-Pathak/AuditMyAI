import type { ToolEntry } from '@/utils/auditForm/types'
import { AI_TOOLS, PLANS } from '@/utils/auditForm/constants'
import { FieldLabel, Input, Select } from './AuditFormFields'

type Props = {
  tool: ToolEntry
  showRemove: boolean
  onUpdate: (field: keyof ToolEntry, value: string) => void
  onRemove: () => void
}

export default function ToolRow({ tool, showRemove, onUpdate, onRemove }: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 p-5 bg-slate-50/70">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <FieldLabel>AI Tool</FieldLabel>
          <Select value={tool.tool} onChange={(v) => onUpdate('tool', v)} options={AI_TOOLS} />
        </div>
        <div>
          <FieldLabel>Plan</FieldLabel>
          <Select value={tool.plan} onChange={(v) => onUpdate('plan', v)} options={PLANS} />
        </div>
        <div>
          <FieldLabel>Monthly spend</FieldLabel>
          <Input value={tool.monthlySpend} onChange={(v) => onUpdate('monthlySpend', v)} placeholder="$240" />
        </div>
        <div>
          <FieldLabel>Seats</FieldLabel>
          <Input value={tool.seats} onChange={(v) => onUpdate('seats', v)} placeholder="12" type="number" />
        </div>
      </div>
      {showRemove && (
        <button type="button" onClick={onRemove} className="mt-4 text-sm text-red-500">
          Remove tool
        </button>
      )}
    </div>
  )
}
