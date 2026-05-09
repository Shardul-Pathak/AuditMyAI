export type ToolEntry = {
    tool: string
    plan: string
    seats: string
    monthlySpend: string
}

export type FormData = {
    tools: ToolEntry[]
    primaryUseCase: string
    monthlyBudget: string
    teamSize: string
    currentPain: string
}

export type PersistedAuditState = {
    data: FormData
    loading: boolean
    submitted: boolean
    progress: number
    lastSaved?: number
    timestamp: number
}

const STORAGE_KEY = 'audit-form-state'
const EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

function isExpired(ts: number) {
    return Date.now() - ts > EXPIRATION_MS
}

export function saveAuditForm(state: PersistedAuditState): void {
    try {
        if (typeof window === 'undefined') return

        const payload = JSON.stringify(state)
        localStorage.setItem(STORAGE_KEY, payload)
    } catch (err) {
        // swallow write errors in production
        // eslint-disable-next-line no-console
        console.error('saveAuditForm error', err)
    }
}

export function loadAuditForm(): PersistedAuditState | null {
    try {
        if (typeof window === 'undefined') return null

        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return null

        const parsed = JSON.parse(raw) as PersistedAuditState

        if (!parsed || typeof parsed.timestamp !== 'number') return null

        if (isExpired(parsed.timestamp)) {
            clearAuditForm()
            return null
        }

        return parsed
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('loadAuditForm error', err)
        return null
    }
}

export function clearAuditForm(): void {
    try {
        if (typeof window === 'undefined') return
        localStorage.removeItem(STORAGE_KEY)
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('clearAuditForm error', err)
    }
}
