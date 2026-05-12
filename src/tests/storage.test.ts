// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  clearAuditForm,
  loadAuditForm,
  saveAuditForm,
} from '../utils/storage'

const mockState = {
  data: {
    tools: [
      {
        tool: 'ChatGPT',
        plan: 'Plus',
        seats: '2',
        monthlySpend: '40',
      },
    ],
    primaryUseCase: 'coding',
    monthlyBudget: '100',
    teamSize: '2',
    currentPain: 'cost',
  },
  loading: false,
  submitted: false,
  progress: 0,
  timestamp: Date.now(),
}

describe('audit form persistence', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('saves form state to localStorage', () => {
    saveAuditForm(mockState)

    const stored = localStorage.getItem(
      'audit-form-state'
    )

    expect(stored).not.toBeNull()
  })

  it('loads persisted form state', () => {
    saveAuditForm(mockState)

    const loaded = loadAuditForm()

    expect(loaded?.data.tools[0].tool).toBe(
      'ChatGPT'
    )
  })

  it('clears persisted form state', () => {
    saveAuditForm(mockState)

    clearAuditForm()

    const loaded = loadAuditForm()

    expect(loaded).toBeNull()
  })

  it('returns null for expired state', () => {
    const expiredState = {
      ...mockState,
      timestamp:
        Date.now() - 8 * 24 * 60 * 60 * 1000,
    }

    localStorage.setItem(
      'audit-form-state',
      JSON.stringify(expiredState)
    )

    const loaded = loadAuditForm()

    expect(loaded).toBeNull()
  })

  it('handles malformed localStorage safely', () => {
    localStorage.setItem(
      'audit-form-state',
      'invalid-json'
    )

    const loaded = loadAuditForm()

    expect(loaded).toBeNull()
  })
})
