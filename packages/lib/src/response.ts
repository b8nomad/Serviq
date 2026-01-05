export class Response<T = any> {
  success: boolean
  message?: string
  data?: T

  constructor(params: { message?: string; data?: T }) {
    this.success = true
    this.message = params.message
    this.data = params.data
  }
}

export function ok<T>(data?: T, message = 'ok') {
  return new Response({ message, data })
}
