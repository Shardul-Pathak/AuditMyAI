import type { FormData } from './types'

export const INITIAL_DATA: FormData = {
  tools: [{ tool: '', plan: '', seats: '', monthlySpend: '' }],
  primaryUseCase: '',
  monthlyBudget: '',
  teamSize: '',
  currentPain: '',
}

export const AI_TOOLS = [
  'Cursor', 'ChatGPT', 'Claude', 'GitHub Copilot',
  'Gemini', 'Anthropic API', 'OpenAI API', 'Windsurf',
]

export const PLANS = [
  'Free', 'Hobby', 'Pro', 'Plus',
  'Business', 'Team', 'Enterprise', 'API',
]

export const USE_CASES = [
  'Coding', 'Writing', 'Research',
  'Data Analysis', 'Customer Support', 'Mixed',
]

export const BUDGETS = [
  '< $500/mo', '$500-$2k/mo', '$2k-$5k/mo',
  '$5k-$10k/mo', '$10k+/mo',
]
