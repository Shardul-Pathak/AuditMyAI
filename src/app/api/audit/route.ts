import { NextRequest, NextResponse } from 'next/server'
import { reportService } from '@/services/report.service'
import { checkRateLimit, extractClientIp } from '@/utils/rate-limit'

type ApiResponse<T = unknown> = 
  | { success: true; data: T }
  | { error: string; fieldErrors?: Record<string, string[]> }

interface AuditSubmissionResponse {
  publicId: string
  redirectUrl: string
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Rate limiting
    const ip = extractClientIp(req.headers)
    const limit = await checkRateLimit(ip, '/api/audit')
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' } as ApiResponse,
        { status: 429 }
      )
    }

    // Parse request body
    let body: unknown
    try {
      body = await req.json()
    } catch (err) {
      console.error('[POST /api/audit] Failed to parse JSON:', err)
      return NextResponse.json(
        { error: 'Invalid JSON body' } as ApiResponse,
        { status: 400 }
      )
    }

    // Create and validate report
    const result = await reportService.createReport(body)

    if (!result.success) {
      const status = result.fieldErrors ? 422 : 500
      console.warn('[POST /api/audit] Report creation failed:', result.error)
      return NextResponse.json(
        { error: result.error, fieldErrors: result.fieldErrors } as ApiResponse,
        { status }
      )
    }

    // Return response
    const response: ApiResponse<AuditSubmissionResponse> = {
      success: true,
      data: {
        publicId: result.publicId,
        redirectUrl: `/report/${result.publicId}`,
      },
    }

    return NextResponse.json(response, {
      status: 201,
      headers: {
        'X-RateLimit-Remaining': String('remaining' in limit ? limit.remaining : 0),
      },
    })
  } catch (error) {
    console.error('[API/AUDIT] Error:', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { error: message } as ApiResponse,
      { status: 500 }
    )
  }
}
