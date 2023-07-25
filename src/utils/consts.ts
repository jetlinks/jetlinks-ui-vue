/**
 * 状态颜色
 */
export const STATE_COLOR = {
    /** 已停止 */
    'disabled': '#EB5757',
    /** 已启用 */
    'enabled': '#00CCA5',
    /** 禁用 */
    'notActive': '#F2994A',
    // 运行中
    'running': '#00CCA5',
    // 部分错误
    'partialError': '#EB5757',
    // 错误
    'failed': '#F2994A',
    // 已停止
    'stopped': '#F2994A'
}

/**
 * 卡片组件状态
 */
export const StatusColorEnum = {
  'success': 'success',
  'error': 'error',
  'processing': 'processing',
  'warning': 'warning',
  'default': 'default',
}

export const SystemConst = {
  API_BASE: 'api',
  SYSTEM_NAME: 'Jetlinks',
  LOGIN: 'LOGIN-STATUS',
  DOC_URL: 'http://doc.jetlinks.cn',
  BASE_CURD_MODAL_VISIBLE: 'BASE_CURD_MODAL_VISIBLE',
  BASE_CURD_CURRENT: 'BASE_CURD_CURRENT',
  BASE_CURD_MODEL: 'BASE_CURD_MODEL',
  BASE_UPDATE_DATA: 'BASE_UPDATE_DATA',
  GLOBAL_WEBSOCKET: 'GLOBAL-WEBSOCKET',
  BIND_USER_STATE: 'false',
  REFRESH_METADATA: 'refresh_metadata',
  REFRESH_METADATA_TABLE: 'refresh_metadata_table',
  GET_METADATA: 'get_metadata',
  REFRESH_DEVICE: 'refresh_device',
  VERSION_CODE: 'version_code',
  AMAP_KEY : 'amap_key',
}

export const USER_CENTER_MENU_CODE = 'account-center'
export const USER_CENTER_MENU_BUTTON_CODE = 'user-center-passwd-update'

/**协议列表 */
export const protocolList = [
    { label: 'OPC-UA', value: 'OPC_UA', alias: 'opc-ua' },
    { label: 'Modbus/TCP', value: 'MODBUS_TCP', alias: 'modbus-tcp' },
    { label: 'GATEWAY', value: 'GATEWAY', alias: 'collector-gateway' },
]
