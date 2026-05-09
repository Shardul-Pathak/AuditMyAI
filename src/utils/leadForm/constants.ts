import type { LeadData } from './types'

export const INITIAL_LEAD_DATA: LeadData = {
  companyName: '',
  companySize: '',
  industry: '',
  firstName: '',
  lastName: '',
  email: '',
  role: '',
}

export const COMPANY_SIZES = ['1–10', '11–50', '51–200', '201–500', '500+']

export const INDUSTRIES = [
  'SaaS / Tech', 'Finance', 'Healthcare',
  'E-commerce', 'Agency', 'Education', 'Other',
]

export const ROLES = [
  'Founder / CEO', 'CTO / Engineering Lead',
  'Finance / Ops', 'Product Manager', 'Developer', 'Other',
]
