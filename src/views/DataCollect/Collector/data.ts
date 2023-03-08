export const colorMap = new Map();
colorMap.set('running', 'success');
colorMap.set('partialError', 'warning');
colorMap.set('failed', 'error');
colorMap.set('stopped', 'default');
colorMap.set('processing', '#cccccc');

export const getState = (record: any) => {
    const enabled = record?.state?.value === 'enabled';
    if (record) {
        return {
            value: enabled ? record?.runningState?.value : 'processing',
            text: enabled ? record?.runningState?.text : '禁用',
        };
    } else {
        return {};
    }
};
