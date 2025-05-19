export const USER_CENTER_MENU_CODE = 'account-center'
export const USER_CENTER_MENU_BUTTON_CODE = 'user-center-passwd-update'
export const messageSubscribe  = 'message-subscribe'

export const OWNER_KEY = 'iot'

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
