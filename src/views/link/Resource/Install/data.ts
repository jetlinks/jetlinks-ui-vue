// 已完成：success
// 安装中：installing
// 已暂停：canceled
// 安装失败：failed
// 下载中：downloading
// 等待安装：waiting_install
// 等待下载：waiting_download

export const statusIcon = new Map()
statusIcon.set('success', 'CheckCircleFilled')
statusIcon.set('installing', 'ToolOutlined')
statusIcon.set('canceled', 'PauseCircleOutlined')
statusIcon.set('failed', 'ExclamationCircleOutlined')
statusIcon.set('downloading', 'ClockCircleOutlined')
statusIcon.set('waiting_install', 'IssuesCloseOutlined')
statusIcon.set('waiting_download', 'ReloadOutlined')

export const statusColor = new Map()
statusColor.set('success', 'green')
statusColor.set('installing', '')
statusColor.set('canceled', '')
statusColor.set('failed', 'red')
statusColor.set('downloading', '')
statusColor.set('waiting_install', '')
statusColor.set('waiting_download', '')

export const computedVersion = (resourceVersionMap:any,data:any) => {
    const resourcesId = data?.resourcesId || data?.releaseDetail?.resourcesId
    if (resourceVersionMap.has(resourcesId)) {
        return resourceVersionMap.get(resourcesId) === data.version
            ? '同版本覆盖'
            : '版本更新';
    } else {
        return '首次安装';
    }
};
