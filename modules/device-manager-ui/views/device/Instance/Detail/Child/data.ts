import i18n from "@jetlinks-web-core/locales";
export const stateMap = new Map();
stateMap.set('success', {
    text: i18n.global.t('Child.data.449454-0'),
    status: 'success',
});
stateMap.set('error', {
    text: i18n.global.t('Child.data.449454-1'),
    status: 'error',
});
stateMap.set('warning', {
    text: i18n.global.t('Child.data.449454-2'),
    status: 'warning',
});
stateMap.set('none', {
    text: i18n.global.t('Child.data.449454-3'),
    status: 'default',
});

export const statusMap = new Map()
statusMap.set('notActive','warning')
statusMap.set('offline','error')
statusMap.set('online','success')


export const columns = [
    {
        title: i18n.global.t('Child.data.449454-4'),
        dataIndex: 'id',
        key: 'id',
        scopedSlots: true,
        search: {
            type: 'string',
            // defaultTermType: 'eq',
        },
    },
    {
        title: i18n.global.t('Child.data.449454-5'),
        dataIndex: 'name',
        key: 'name',
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: i18n.global.t('Child.data.449454-6'),
        dataIndex: 'productName',
        key: 'productName',
        scopedSlots: true,
    },
    {
        title: i18n.global.t('Child.data.449454-7'),
        dataIndex: 'registryTime',
        key: 'registryTime',
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },

    {
        title: i18n.global.t('Child.data.449454-8'),
        dataIndex: 'describe',
        key: 'describe',
        scopedSlots: true,
        width: 100,
    },
    {
        title: i18n.global.t('Child.data.449454-9'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        width: 150,
    },
    {
        title: i18n.global.t('Child.data.449454-10'),
        key: 'action',
        fixed: 'right',
        width: 350,
        scopedSlots: true,
    },
];
