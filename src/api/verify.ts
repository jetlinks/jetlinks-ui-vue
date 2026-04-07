import { request } from '@jetlinks-web/core'

/** 403 校验响应中的 result 结构 */
export interface VerifyRequiredResult {
  type: 'captcha' | 'identity'
  key: string
  disposable: boolean
}

/** 验证码确认请求 */
export interface VerifyCaptchaRequest {
  key: string
  provider: string
  params: Record<string, unknown>
}

/** 验证码/校验确认结果 */
export interface VerifyResultResponse {
  token: string
}

/** 身份校验确认请求 */
export interface IdentityVerifyRequest {
  key: string
  provider: string
  requestId?: string
  token?: string
  context?: Record<string, unknown>
  params?: Record<string, string>
}

/** 获取验证码配置（与登录一致，走 CaptchaController） */
export const getVerifyCaptchaConfig = () =>
  request.get<{ result: { enabled: boolean; type: string; types?: string[]; [key: string]: unknown } }>(
    '/authorize/captcha/config'
  )

/** 获取验证码图片（与登录一致） */
export const getVerifyCaptchaImage = (params?: { width?: number; height?: number }) =>
  request.get<{ result: { base64: string; key: string } }>(
    `/authorize/captcha/image?width=${params?.width ?? 130}&height=${params?.height ?? 40}`
  )

/** 验证码确认（VerifyController） */
export const confirmCaptcha = (data: VerifyCaptchaRequest) =>
  request.post<{ result: VerifyResultResponse }>('/verify/captcha/_confirm', data)

/** 身份校验：请求验证（发送短信/邮件等） */
export const requestIdentityVerify = (identityId: string, data: { provider: string; identity: string; params?: Record<string, unknown> }) =>
  request.post<{ result: { requestId: string; token: string; context?: Record<string, unknown>; intervalSeconds?: number } }>(
    `/verify/identity/${identityId}/_request`,
    data
  )

/** 身份校验：确认 */
export const confirmIdentityVerify = (data: IdentityVerifyRequest) =>
  request.post<{ result: VerifyResultResponse }>('/verify/identity/_confirm', data)

/** 获取当前用户已绑定的身份列表（用于身份校验选择） */
export const getSelfIdentitiesForVerify = () =>
  request.get<{ result: Array<{ id: string; userId: string; provider: string; identity: string }> }>(
    '/user/identity/_me'
  )
