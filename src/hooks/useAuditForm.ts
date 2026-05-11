'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormData, ToolEntry } from '@/utils/auditForm/types'
import { INITIAL_DATA } from '@/utils/auditForm/constants'
import {
  loadAuditForm,
  saveAuditForm,
  type PersistedAuditState,
} from '@/utils/storage'

export function useAuditForm() {
  const persisted = typeof window !== 'undefined' ? loadAuditForm() : null
  const [mounted, setMounted] = useState(false)
  const [submitted, setSubmitted] = useState(persisted?.submitted ?? false)
  const [loading, setLoading] = useState(persisted?.loading ?? false)
  const [progress, setProgress] = useState(typeof persisted?.progress === 'number' ? persisted.progress : 0)
  const [data, setData] = useState<FormData>(persisted?.data ?? INITIAL_DATA)
  const [saveStatus, setSaveStatus] = useState<'Saved' | 'Saving...' | null>(null)
  const [lastSaved, setLastSaved] = useState<number | null>(persisted?.lastSaved ?? persisted?.timestamp ?? null)

  const saveTimerRef = useRef<number | null>(null)
  const lastProgressSaveRef = useRef<number>(0)
  const mountedRef = useRef(false)

  // Hydrate from storage
  useEffect(() => {
    mountedRef.current = true
    setMounted(true)
  }, [])

  // Autosave (debounced)
  useEffect(() => {
    if (!mountedRef.current) return
    setSaveStatus('Saving...')
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current)

    const now = Date.now()
    const shouldThrottle = loading && now - lastProgressSaveRef.current < 500

    saveTimerRef.current = window.setTimeout(() => {
      try {
        const state: PersistedAuditState = {
          data, loading, submitted, progress,
          lastSaved: Date.now(), timestamp: Date.now(),
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
  }, [data, loading, submitted, progress])

  // Progress animation
  useEffect(() => {
    if (!loading) return
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setLoading(false)
          setSubmitted(true)
          return 100
        }
        return prev + 4
      })
    }, 120)
    return () => clearInterval(interval)
  }, [loading])

  const estimatedSavings = useMemo(() => {
    const total = data.tools.reduce((sum, t) => {
      const spend = Number(t.monthlySpend.replace(/[^0-9]/g, ''))
      return sum + (isNaN(spend) ? 0 : Math.floor(spend * 0.28))
    }, 0)
    return total || 642
  }, [data.tools])

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

  const handleSubmit = () => { setLoading(true); setProgress(0) }

  return {
    mounted, submitted, loading, progress, data,
    saveStatus, lastSaved, estimatedSavings,
    update, updateTool, addTool, removeTool,
    handleSubmit, setSubmitted,
  }
}
