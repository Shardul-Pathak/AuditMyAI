export class StandardError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly details?: unknown
  public readonly cause?: unknown

  constructor(options: {
    message: string
    code?: string
    statusCode?: number
    details?: unknown
    cause?: unknown
  }) {
    super(options.message)

    this.name = this.constructor.name
    this.code = options.code ?? 'INTERNAL_ERROR'
    this.statusCode = options.statusCode ?? 500
    this.details = options.details
    this.cause = options.cause

    Error.captureStackTrace?.(this, this.constructor)
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
    }
  }
}

export class ClaudeApiError extends StandardError {
  constructor(
    message = 'Claude API request failed',
    details?: unknown,
    cause?: unknown
  ) {
    super({
      message,
      code: 'CLAUDE_API_ERROR',
      statusCode: 502,
      details,
      cause,
    })
  }
}

export class ClaudeParseError extends StandardError {
  constructor(
    message = 'Failed to parse Claude response',
    details?: unknown,
    cause?: unknown
  ) {
    super({
      message,
      code: 'CLAUDE_PARSE_ERROR',
      statusCode: 500,
      details,
      cause,
    })
  }
}

export class ClaudeValidationError extends StandardError {
  constructor(
    message = 'Claude response validation failed',
    details?: unknown,
    cause?: unknown
  ) {
    super({
      message,
      code: 'CLAUDE_VALIDATION_ERROR',
      statusCode: 422,
      details,
      cause,
    })
  }
}