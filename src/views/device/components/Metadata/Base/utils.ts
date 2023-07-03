export const levelMap = ref({
    ordinary: '普通',
    warn: '警告',
    urgent: '紧急',
})
export const sourceMap = ref({
    device: '设备',
    manual: '手动',
    rule: '规则',
});
export const expandsType = ref({
    read: '读',
    write: '写',
    report: '上报',
});

export const limitsMap = new Map<string, any>();
limitsMap.set('events-add', 'eventNotInsertable');
limitsMap.set('events-updata', 'eventNotModifiable');
limitsMap.set('properties-add', 'propertyNotInsertable');
limitsMap.set('properties-updata', 'propertyNotModifiable');