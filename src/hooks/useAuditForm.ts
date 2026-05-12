'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { FormData, ToolEntry } from '@/utils/auditForm/types'
import { INITIAL_DATA } from '@/utils/auditForm/constants'
import { loadAuditForm, saveAuditForm, type PersistedAuditState } from '@/utils/storage'

function mapToolToEnum(tool: string): string {
  const normalized = tool.trim().toLowerCase()
  const toolMap: Record<string, string> = {
    'cursor': 'CURSOR',
    'github copilot': 'GITHUB_COPILOT',
    'claude': 'CLAUDE',
    'chatgpt': 'CHATGPT',
    'anthropic api': 'ANTHROPIC_API',
    'openai api': 'OPENAI_API',
    'gemini': 'GEMINI',
    'windsurf': 'WINDSURF',
    'v0': 'V0',
  }
  return toolMap[normalized] ?? tool.trim().toUpperCase().replace(/\s+/g, '_')
}

function mapPlanToEnum(plan: string): string {
  const normalized = plan.trim().toLowerCase()
  const planMap: Record<string, string> = {
    'free': 'FREE',
    'hobby': 'PRO',
    'pro': 'PRO',
    'plus': 'PRO',
    'team': 'TEAM',
    'business': 'BUSINESS',
    'enterprise': 'ENTERPRISE',
    'api': 'PAY_AS_YOU_GO',
    'custom': 'CUSTOM',
    'pay as you go': 'PAY_AS_YOU_GO',
  }
  return planMap[normalized] ?? plan.trim().toUpperCase().replace(/\s+/g, '_')
}

function mapUseCaseToEnum(useCase: string): string {
  const normalized = useCase.trim().toLowerCase()
  const useCaseMap: Record<string, string> = {
    'coding': 'CODE_GENERATION',
    'writing': 'CONTENT_WRITING',
    'data analysis': 'DATA_ANALYSIS',
    'customer support': 'CUSTOMER_SUPPORT',
    'research': 'RESEARCH',
    'mixed': 'MIXED',
    'general productivity': 'GENERAL_PRODUCTIVITY',
  }
  return useCaseMap[normalized] ?? 'MIXED'
}

function parseMonthlySpend(raw: string): number {
  const n = Number.parseFloat(raw.replace(/[^0-9.]/g, ''))
  if (Number.isNaN(n) || n < 0) return 0
  return n
}

export function useAuditForm() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [data, setData] = useState<FormData>(INITIAL_DATA)
  const [saveStatus, setSaveStatus] = useState<'Saved' | 'Saving...' | null>(null)
  const [lastSaved, setLastSaved] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const saveTimerRef = useRef<number | null>(null)
  const lastProgressSaveRef = useRef<number>(0)

  // Hydrate from storage on client
  useEffect(() => {
    const loaded = loadAuditForm()
    if (loaded) {
      // Never restore an in-flight submit spinner after refresh (fetch cannot resume).
      setLoading(false)
      setProgress(0)
      setData(loaded.data ?? INITIAL_DATA)
      setLastSaved(loaded.lastSaved ?? loaded.timestamp ?? null)
    }
    setMounted(true)
  }, [])

  // Autosave (debounced)
  useEffect(() => {
    if (!mounted) return
    setSaveStatus('Saving...')
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current)

    const now = Date.now()
    const shouldThrottle = loading && now - lastProgressSaveRef.current < 500

    saveTimerRef.current = window.setTimeout(() => {
      try {
        const state: PersistedAuditState = {
          data,
          loading,
          submitted: false,
          progress,
          lastSaved: Date.now(),
          timestamp: Date.now(),
        }
        if (shouldThrottle) lastProgressSaveRef.current = Date.now()
        saveAuditForm(state)
        setSaveStatus('Saved')
        setLastSaved(state.lastSaved ?? null)
      } catch (err) {
        console.error('autosave error', err)
        setSaveStatus(null)
      }
    }, 300)

    return () => { if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current) }
  }, [data, loading, progress])

  const update = (partial: Partial<FormData>) =>
    setData((prev) => ({ ...prev, ...partial }))

  const updateTool = (index: number, field: keyof ToolEntry, value: string) => {
    const updated = [...data.tools]
    updated[index][field] = value
    update({ tools: updated })
  }

  const addTool = () =>
    update({ tools: [...data.tools, { tool: '', plan: '', seats: '', monthlySpend: '' }] })

  const removeTool = (index: number) =>
    update({ tools: data.tools.filter((_, i) => i !== index) })

  const handleSubmit = async () => {
    setError(null)
    setLoading(true)
    setProgress(0)

    try {
      // Validate required fields
      const errors: string[] = []
      if (!data.tools || data.tools.length === 0) {
        errors.push('At least one tool is required')
      }
      for (let i = 0; i < data.tools.length; i++) {
        const tool = data.tools[i]
        if (!tool.tool?.trim()) {
          errors.push(`Tool ${i + 1}: Tool name is required`)
        }
        if (!tool.plan?.trim()) {
          errors.push(`Tool ${i + 1}: Plan is required`)
        }
        if (!tool.seats?.trim()) {
          errors.push(`Tool ${i + 1}: Seats is required`)
        }
        if (!tool.monthlySpend?.trim()) {
          errors.push(`Tool ${i + 1}: Monthly spend is required`)
        }
      }

      if (!data.teamSize?.trim()) {
        errors.push('Team size is required')
      }

      const teamSizeNum = parseInt(data.teamSize?.trim() || '0', 10) || 0
      const maxSeats = Math.max(
        0,
        ...data.tools.map((t) => parseInt(t.seats?.trim() || '0', 10) || 0)
      )
      if (teamSizeNum > 0 && maxSeats > 0 && teamSizeNum < maxSeats) {
        errors.push(
          `Team size (${teamSizeNum}) cannot be smaller than the highest seat count on a tool (${maxSeats}).`
        )
      }

      if (errors.length > 0) {
        setLoading(false)
        setProgress(0)
        setError(errors.join('\n'))
        return
      }

      // Transform form data to audit input format
      const auditInput = {
        tools: data.tools.map((tool) => ({
          tool: mapToolToEnum(tool.tool!),
          plan: mapPlanToEnum(tool.plan!),
          seats: parseInt(tool.seats!, 10) || 1,
          monthlySpend: parseMonthlySpend(tool.monthlySpend!),
        })),
        teamSize: parseInt(data.teamSize!, 10) || 1,
        primaryUseCase: mapUseCaseToEnum(data.primaryUseCase || ''),
      }

      // Progress while the request is in flight (cap at 95% until the API responds)
      const progressInterval = window.setInterval(() => {
        setProgress((prev) => (prev >= 95 ? 95 : Math.min(95, prev + Math.random() * 12 + 3)))
      }, 280)

      // Call the audit API
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(auditInput),
      })

      window.clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          error?: string
          fieldErrors?: Record<string, string[]>
        }
        const fieldMsg =
          errorData.fieldErrors &&
          Object.entries(errorData.fieldErrors)
            .map(([k, v]) => `${k}: ${v.join('; ')}`)
            .join('\n')
        throw new Error(
          [errorData.error || `Failed to create audit (${response.status})`, fieldMsg].filter(Boolean).join('\n')
        )
      }

      const result = await response.json()
      console.log('Audit API response:', result)

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to create audit')
      }

      setProgress(100)
      setLoading(false)

      const { clearAuditForm } = await import('@/utils/storage')
      clearAuditForm()

      router.push(result.data.redirectUrl)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred during audit'
      setError(message)
      setLoading(false)
      setProgress(0)
      console.error('Audit submission error:', err)
    }
  }

  return {
    mounted,
    loading,
    progress,
    data,
    saveStatus,
    lastSaved,
    error,
    update,
    updateTool,
    addTool,
    removeTool,
    handleSubmit,
  }
}
