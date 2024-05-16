import { schemaObjType } from "./typing";


/**
 * 将对应实体转换为表格数据返回
 * @param schemas 实体类map
 * @param schemaName 实体类名称
 */
export function findData(schemas: object, schemaName: string) {
    const basicType = ['string', 'integer', 'boolean'];

    if (!schemaName || !schemas[schemaName]) {
        return [];
    }
    const result: schemaObjType[] = [];
    const schema = schemas[schemaName];
    Object.entries(schema.properties).forEach((item: [string, any]) => {
        const paramsType =
            item[1].type ||
            (item[1].$ref && item[1].$ref.split('/').pop()) ||
            (item[1].items && item[1].items.$ref.split('/').pop()) ||
            '';
        const schemaObj: schemaObjType = {
            paramsName: item[0],
            paramsType,
            desc: item[1].description || '',
        };
        if (!basicType.includes(paramsType))
            schemaObj.children = findData(schemas, paramsType);
        result.push(schemaObj);
    });

    return result;

}
/**
 * 将字段信息数组转换为JSON代码
 * @param schemas 对应的所有实体类
 * @param arr 字段信息数组
 * @param level 转换深度
 */
export function getCodeText(
    schemas: object,
    arr: schemaObjType[],
    level: number,
): object {
    const result = {};
    arr.forEach((item) => {
        switch (item.paramsType) {
            case 'string':
                result[item.paramsName] = '';
                break;
            case 'integer':
                result[item.paramsName] = 0;
                break;
            case 'boolean':
                result[item.paramsName] = true;
                break;
            case 'array':
                result[item.paramsName] = [];
                break;
            case 'object':
                result[item.paramsName] = '';
                break;
            default: {
                const properties = schemas[item.paramsType]?.properties as object || {};
                const newArr = Object.entries(properties).map(
                    (item: [string, any]) => ({
                        paramsName: item[0],
                        paramsType: level
                            ? (item[1].$ref && item[1].$ref.split('/').pop()) ||
                            (item[1].items &&
                                item[1].items.$ref.split('/').pop()) ||
                            item[1].type ||
                            ''
                            : item[1].type,
                    }),
                );
                result[item.paramsName] = getCodeText(
                    schemas,
                    newArr,
                    level - 1,
                );
            }
        }
    });

    return result;
}