import i18n from "@jetlinks-web-core/locales";
const type = [
    {
        value: 'int',
        label: `int(${i18n.global.t('Base.columns.448718-33')})`,
    },
    {
        value: 'long',
        label: `long(${i18n.global.t('Base.columns.448718-34')})`,
    },
    {
        value: 'float',
        label: `float(${i18n.global.t('Base.columns.448718-35')})`,
    },
    {
        value: 'double',
        label: `double(${i18n.global.t('Base.columns.448718-36')})`,
    },
    {
        value: 'string',
        label: `text(${i18n.global.t('Base.columns.448718-37')})`,
    },
    {
        value: 'boolean',
        label: `boolean(${i18n.global.t('Base.columns.448718-38')})`,
    },
    {
        value: 'date',
        label: `date(${i18n.global.t('Base.columns.448718-39')})`,
    },
    {
        value: 'enum',
        label: `enum(${i18n.global.t('Base.columns.448718-40')})`,
    },
    {
        value: 'array',
        label: `array(${i18n.global.t('Base.columns.448718-41')})`,
    },
    {
        value: 'object',
        label: `object(${i18n.global.t('Base.columns.448718-42')})`,
    },
    {
        value: 'file',
        label: `file(${i18n.global.t('Base.columns.448718-43')})`,
    },
    {
        value: 'password',
        label: `password(${i18n.global.t('Base.columns.448718-44')})`,
    },
    {
        value: 'geoPoint',
        label: `geoPoint(${i18n.global.t('Base.columns.448718-45')})`,
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
