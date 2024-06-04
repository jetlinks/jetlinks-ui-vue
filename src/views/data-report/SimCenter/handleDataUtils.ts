/**
 * @function handleCardType 处理卡类型
 * @param value
 */
export const handleCardType = (value: string) => {
    switch (value) {
        case 'year':
            return '年卡';
        case 'season':
            return '季卡';
        case 'month':
            return '月卡';
        case 'other':
            return '其他';
    }
};

/**
 * @function handleTagType 处理tag类型
 * @param value
 */
export const handleTagType = (value: string) => {
    switch (value) {
        case 'toBeActivated':
            return 'warning';
        case 'error':
        case 'notReady':
            return 'error';
        case 'using':
            return 'success';
        case 'activated':
        case 'deactivate':
            return 'default';
        case 'other':
            return 'processing';
    }
};

/**
 * @function handleOperatorName 处理运营商
 * @param value
 */
export const handleOperatorName = (value: string) => {
    value = value.toLocaleLowerCase();
    switch (value) {
        case 'onelink':
            return '移动';
        case 'ctwing':
            return '电信';
        case 'unicom':
            return '联通';
    }
};

/**
 * @function formatFlow 格式化流量
 * @param flow
 */
export const formatFlow = (flow: number | undefined) => {
    if (flow === undefined || flow === 0) {
        return '0M';
    } else if (flow >= 1024 || flow <= -1024) {
        return `${(flow / 1024).toFixed(2)}G`;
    } else if ((flow > 0 && flow < 1) || (flow < 0 && flow > -1)) {
        return `${flow.toFixed(2)}M`;
    } else {
        return `${flow.toFixed(2)}M`;
    }
};
