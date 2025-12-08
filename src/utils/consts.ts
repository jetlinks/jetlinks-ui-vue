export const USER_CENTER_MENU_CODE = 'account-center'
export const USER_CENTER_MENU_BUTTON_CODE = 'user-center-passwd-update'
export const messageSubscribe  = 'message-subscribe'

export const ACCESS_AI_AGENT_CODE = 'access-ai-agent-code'

export const OWNER_KEY = import.meta.env.VITE_APP_NAME

export const default_app_id = 'authentication-service'

export const URL_TOKEN_KET = import.meta.env.VITE_TOKEN_KEY.replace(/-/g, '_')

export const protocolList = [
    { label: 'OPC_UA', value: 'OPC_UA', alias: 'opc-ua' },
    { label: 'MODBUS_TCP', value: 'MODBUS_TCP', alias: 'Modbus/TCP' },
    { label: 'COLLECTOR_GATEWAY', value: 'COLLECTOR_GATEWAY', alias: 'GATEWAY' },
    { label: 'S7', value: 'snap7', alias: 'snap7' },
    { label: 'IEC104', value: 'iec104', alias: 'IEC104' },
    { label: 'BACNetIp', value: 'BACNetIp', alias: 'BACNet/IP' }
]

export const langKey = 'Accept-Language'


//规则编排国际化LocalStorage的key
export const ruleEditorKey = 'editor-language'

export const MODULES_KEYS: string[] = import.meta.env.VITE_BUILD_MODULES || [];

export const isSubApp = (window as any).__MICRO_APP_ENVIRONMENT__

export const OpenMicroApp = import.meta.env.VITE_MICRO_APP

export const PersonalKey = import.meta.env.VITE_PERSONAL_TOKEN_KEY
export const PersonalUrlKey = import.meta.env.VITE_PERSONAL_TOKEN_URL_KEY
export const PersonalAIKey = import.meta.env.VITE_PERSONAL_TOKEN_AI_KEY

export const PersonalToken: { value?: string, aiToken?: string} = { value: undefined, aiToken: undefined}
