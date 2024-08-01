const type = [
    {
        value: 'int',
        label: 'int(整数型)',
    },
    {
        value: 'long',
        label: 'long(长整数型)',
    },
    {
        value: 'float',
        label: 'float(单精度浮点型)',
    },
    {
        value: 'double',
        label: 'double(双精度浮点数)',
    },
    {
        value: 'string',
        label: 'text(字符串)',
    },
    {
        value: 'boolean',
        label: 'boolean(布尔型)',
    },
    {
        value: 'date',
        label: 'date(时间型)',
    },
    {
        value: 'enum',
        label: 'enum(枚举)',
    },
    {
        value: 'array',
        label: 'array(数组)',
    },
    {
        value: 'object',
        label: 'object(结构体)',
    },
    {
        value: 'file',
        label: 'file(文件)',
    },
    {
        value: 'password',
        label: 'password(密码)',
    },
    {
        value: 'geoPoint',
        label: 'geoPoint(地理位置)',
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
