export const USER_CENTER_MENU_CODE = 'account-center'
export const USER_CENTER_MENU_BUTTON_CODE = 'user-center-passwd-update'
export const messageSubscribe  = 'message-subscribe'

export const ACCESS_AI_AGENT_CODE = 'access-ai-agent-code'

export const OWNER_KEY = import.meta.env.VITE_APP_NAME

export const langKey = 'Accept-Language'

//规则编排国际化LocalStorage的key
export const ruleEditorKey = 'editor-language'

export const isSubApp = (window as any).__MICRO_APP_ENVIRONMENT__

export const OpenMicroApp = import.meta.env.VITE_MICRO_APP === 'true'

export const PersonalKey = import.meta.env.VITE_PERSONAL_TOKEN_KEY
export const PersonalUrlKey = import.meta.env.VITE_PERSONAL_TOKEN_URL_KEY
export const PersonalAIKey = import.meta.env.VITE_PERSONAL_TOKEN_AI_KEY

export const PersonalToken: { value?: string, aiToken?: string} = { value: undefined, aiToken: undefined}

export const PlatformName = 'platform-name'

export const isCloud = import.meta.env.VITE_APP_ENVIRONMENT === 'cloud'

export const isSass = import.meta.env.VITE_APP_ENVIRONMENT === 'saas'


