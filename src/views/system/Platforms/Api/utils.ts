import { schemaObjType } from "./typing";
import { randomString } from "@jetlinks-web/utils";


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
    const required = schema.required || []

    Object.entries(schema.properties).forEach((item: [string, any]) => {
        const [paramsName, extra] = item

        const paramsType =
            (extra.$ref && extra.$ref.split('/').pop()) ||
            (extra.items?.$ref && extra.items.$ref.split('/').pop()) ||
            extra.item?.type ||
            extra.type ||
            '';
        const schema = extra.format ? `${paramsType}(${extra.format})` : ''

        const schemaObj: schemaObjType = {
            paramsName: paramsName,
            paramsType,
            required: required.includes(paramsName),
            desc: extra.description || '',
            schema: schema,
            type: !basicType.includes(paramsType) ? paramsType : '',
            id: randomString()
        };

        if (!basicType.includes(paramsType) && (paths.filter(path=>path === schemaName).length <=2) ){
            paths.push(schemaName)
            schemaObj.children =  findData(schemas, paramsType, paths);
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
    paths: string[] = []
): any {
    const tips: Array<string | undefined> = []
    let result = {}
    arr.forEach((item) => {
        let value: any = ""
        tips.push(item.desc)
        switch (item.paramsType) {
            case 'string':
                value = ''
                break;
            case 'integer':
            case 'number':
                value = 0
                break;
            case 'boolean':
                value = true
                break;
            case 'array':
                value = []
                break;
            case 'object':
                const _itemType = schema?.items?.type
                const _item = dealNoRef(_itemType)
                result = _item ? {..._item}: {};
                break;
            default: {
                if (item.children) {
                    if (paths.filter(path=> path === item.paramsName).length >=2) {
                        break
                    }
                    paths.push(item.paramsName)
                    const _result = getCodeText(
                        schemas,
                        item.children,
                        level - 1,
                        paths
                    )
                    value = _result.codeText
                    tips.push(..._result.codeTips)
                    tips.push(undefined)
                } else {
                    if (paths.filter(path=> path === item.paramsName).length >=2) {
                        break
                    }
                    paths.push(item.paramsName)
                    const properties = schemas[item.paramsType]?.properties as object || {};
                    const newArr = Object.entries(properties).map(
                        (item: [string, any]) => {
                            const [paramsName, extra] = item

                            const paramsType =
                                (extra.$ref && extra.$ref.split('/').pop()) ||
                                (extra.items?.$ref && extra.items.$ref.split('/').pop()) ||
                                extra.item?.type ||
                                extra.type ||
                                '';

                            return{
                                paramsName: paramsName,
                                desc: extra.description || '',
                                paramsType: paramsType,
                                schema: extra.format ? `${paramsType}(${extra.format})` : ''
                            }},
                    );

                    const _result = getCodeText(
                        schemas,
                        newArr,
                        level - 1,
                        paths
                    )
                    value = _result.codeText
                    tips.push(..._result.codeTips)
                    tips.push(undefined)
                }
            }
        }
        result[item.paramsName] = value
    });
    return {
        codeText: result,
        codeTips: tips

    };
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
            result = item ? [item] : [];
            break;
        case 'number':
            result = 0;
            break;
        default:
            return;
    }
    return result
}
