// 已完成：success
// 安装中：installing
// 已暂停：canceled
// 安装失败：failed
// 下载中：downloading
// 等待安装：waiting_install
// 等待下载：waiting_download

export const statusIcon = new Map()
statusIcon.set('success', 'CheckCircleFilled')
statusIcon.set('installing', 'PauseCircleOutlined')
statusIcon.set('canceled', 'ToolOutlined')
statusIcon.set('failed', 'InfoCircleOutlined')
statusIcon.set('downloading', 'CheckCircleFilled')
statusIcon.set('waiting_install', 'CheckCircleFilled')
statusIcon.set('waiting_download', 'LoadingOutlined')
