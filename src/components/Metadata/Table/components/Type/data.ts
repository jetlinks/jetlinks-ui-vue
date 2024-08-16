import i18n from '@/i18n'
const $t = i18n.global.t
const type = [
    {
        value: 'int',
        label: $t('Type.data.930240-0'),
    },
    {
        value: 'long',
        label: $t('Type.data.930240-1'),
    },
    {
        value: 'float',
        label: $t('Type.data.930240-2'),
    },
    {
        value: 'double',
        label: $t('Type.data.930240-3'),
    },
    {
        value: 'string',
        label: $t('Type.data.930240-4'),
    },
    {
        value: 'boolean',
        label: $t('Type.data.930240-5'),
    },
    {
        value: 'date',
        label: $t('Type.data.930240-6'),
    },
    {
        value: 'enum',
        label: $t('Type.data.930240-7'),
    },
    {
        value: 'array',
        label: $t('Type.data.930240-8'),
    },
    {
        value: 'object',
        label: $t('Type.data.930240-9'),
    },
    {
        value: 'file',
        label: $t('Type.data.930240-10'),
    },
    {
        value: 'password',
        label: $t('Type.data.930240-11'),
    },
    {
        value: 'geoPoint',
        label: $t('Type.data.930240-12'),
    },
];

export const findTypeItem = (value: string) => {
    return type.find(item => item.value === value)
}

export const getTypeMap = () => {
    return type.reduce((prev, next) => {
        prev[next.value] = next.label
        return prev
    }, {})
}

export default type
