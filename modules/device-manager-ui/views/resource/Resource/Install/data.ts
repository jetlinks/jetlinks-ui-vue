// 已完成：success
// 安装中：installing
// 已暂停：canceled
// 安装失败：failed
// 下载中：downloading
// 等待安装：waiting_install
// 等待下载：waiting_download
import i18n from '@jetlinks-web-core/locales'

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

function compareVersions(v1: string, v2: string) {
    // 正则表达式匹配版本号
    const versionRegex = /^v(\d+)\.(\d+)\.(\d+)$/;

    // 提取版本号
    const match1 = v1.match(versionRegex);
    const match2 = v2.match(versionRegex);

    if (!match1 || !match2) {
        return 1
    }

    // 将版本号转换为数字数组
    const version1 = match1.slice(1).map(Number);
    const version2 = match2.slice(1).map(Number);

    // 逐段比较版本号
    for (let i = 0; i < version1.length; i++) {
        if (version1[i] > version2[i]) {
            return 1; // v1 > v2
        } else if (version1[i] < version2[i]) {
            return -1; // v1 < v2
        }
    }

    return 0; // v1 === v2
}

export const computedVersion = (resourceVersionMap:any,data:any) => {
    const resourcesId = data?.resourcesId || data?.resourceDetails?.id || data?.resourceDetails?.releaseDetail?.resourcesId || data?.releaseDetail?.resourcesId
    if (resourceVersionMap.has(resourcesId)) {
        const nowVersion = data?.version || data?.resourceDetails?.version || data?.resourceDetails?.releaseDetail?.version
        const oldVersion = resourceVersionMap.get(resourcesId)
        const flag = compareVersions(nowVersion, oldVersion)
        if(flag === 0){
            return i18n.global.t('Install.data.733160-0')
        } else if(flag === -1){
            return i18n.global.t('Install.data.733160-3')
        }else {
            return i18n.global.t('Install.data.733160-1')
        }
    } else {
        return i18n.global.t('Install.data.733160-2');
    }
};
