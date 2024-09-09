import { schemaObjType } from "./typing";


/**
 * 将对应实体转换为表格数据返回
 * @param schemas 实体类map
 * @param schemaName 实体类名称
 */
export function findData(schemas: object, schemaName: string , paths:string[]=[]) {
    const basicType = ['string', 'integer', 'boolean','number'];
   
    if (!schemaName || !schemas[schemaName]) {
        return [];
    }
    const result: schemaObjType[] = [];
    const schema = schemas[schemaName];
    Object.entries(schema.properties).forEach((item: [string, any]) => {
        const paramsType =
            (item[1].$ref && item[1].$ref.split('/').pop()) ||
            (item[1].items?.$ref && item[1].items.$ref.split('/').pop()) ||
            item[1].item?.type ||
            item[1].type ||
            '';
        const schemaObj: schemaObjType = {
            paramsName: item[0],
            paramsType,
            desc: item[1].description || '',
        };
      
        if (!basicType.includes(paramsType) && paths.filter(path=>path === schemaName).length >=2 ){
            paths.push(schemaName)
            schemaObj.children =  findData(schemas, paramsType);
        }
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
            case 'number':
                result[item.paramsName] = 0;
                break;
            default: {
                const properties = schemas[item.paramsType]?.properties as object || {};
                const newArr = Object.entries(properties).map(
                    (item: [string, any]) => {
                        return{
                        paramsName: item[0],
                        paramsType: level
                            ?   (item[1].$ref && item[1].$ref.split('/').pop()) ||
                            (item[1].items?.$ref &&
                                item[1].items.$ref.split('/').pop()) ||
                                item[1].item?.type ||
                                item[1].type ||
                            ''
                            : item[1].type,
                    }},
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

/**
 * 处理数据中没有$ref的情况
 */
export function dealNoRef(type:string,schema?:any):any{
    let result = undefined;
    switch (type) {
        case 'string':
            result = '';
            break;
        case 'integer':
            result = 0;
            break;
        case 'boolean':
            result = true;
            break;
        case 'array':
            const itemType = schema?.items?.type
            const item = dealNoRef(itemType)
            result = [item];
            break;
        case 'number':
            result = 0;
            break;
        default:
            return;
    }
    return result
}