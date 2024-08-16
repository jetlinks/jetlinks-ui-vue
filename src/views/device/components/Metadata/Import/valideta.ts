import i18n from '@/i18n'
const $t = i18n.global.t
import { onlyMessage } from "@/utils/comm"
export const testProperties = (data:any) =>{

}

export const testType = (data:any,index:number,isArray?:boolean,isObject?:boolean)=>{
    // if(data.type === 'boolean'){
    //     if(!data?.trueText || !data?.trueValue || !data?.falseText || !data?.falseValue){
    //         onlyMessage(`方法定义inputs第${index+1}个数组ValueType中缺失必填属性`,'error')
    //         return true
    //     }
    // }
    // if(data.type === 'enum' && !isObject){
    //     if(data?.elements?.length > 0){
    //         data.elements.forEach((a:any,b:number)=>{
    //             if(!a.value || !a.text){
    //                 onlyMessage(`方法定义inputs第${index+1}个数组ValueType中elements缺失必填属性`,'error')
    //                 return true
    //             }
    //         })
    //     }else{
    //         onlyMessage(`方法定义inputs第${index+1}个数组ValueType中缺失elements属性`,'error')
    //         return true
    //     }
    // }
    if(data.type === 'array' && !isArray && !isObject){
        if(data?.elementType){
           return testType(data.elementType,index,true)
        }else{
            onlyMessage($t('Import.valideta.6916025-0', [index+1]),'error')
            return true
        }
    }
    if(data.type === 'file' && !isArray && !isObject){
        if(!data?.bodyType){
            onlyMessage($t('Import.valideta.6916025-1', [index+1]),'error')
            return true
        }
    }
    if(data.type === 'object' && !isArray  && !isObject){
        if(data?.properties?.length > 0){
          return  testObject(data.properties,index)
        }else{
            onlyMessage($t('Import.valideta.6916025-2', [index+1]),'error')
            return true
        }
    }
}
export const testObject = (data:any,index:number)=>{
    let check = false
    data.forEach((i:any)=>{
        if(!i?.id){
            onlyMessage($t('Import.valideta.6916025-3', [index+1]),'error')
            check = true
            return
        }
        if(!i?.name){
            onlyMessage($t('Import.valideta.6916025-4', [index+1]),'error')
            check = true
            return
        }
        if(!i?.valueType?.type){
            onlyMessage($t('Import.valideta.6916025-5', [index+1]),'error')
            check = true
            return
        }else{
           check =  testType(i,index,false,true)
           return
        }
    })
    return check
}

export const testAliType = (data:any,index:number,isArray?:boolean,isObject?:boolean)=>{
    if(data.dataType.type === 'boolean'){
        if(!data?.dataType?.trueText || !data?.dataType?.trueValue || !data?.dataType?.falseText || !data?.dataType?.falseValue){
            onlyMessage($t('Import.valideta.6916025-6', [index+1]),'error')
            return true
        }
    }
    if(data.dataType.type === 'enum' && !isObject){
        if(data.dataType?.elements?.length > 0){
            data.dataType.elements.forEach((a:any,b:number)=>{
                if(!a.value || !a.text){
                    onlyMessage($t('Import.valideta.6916025-7', [index+1]),'error')
                    return true
                }
            })
        }else{
            onlyMessage($t('Import.valideta.6916025-8', [index+1]),'error')
            return true
        }
    }
    if(data.dataType.type === 'array' && !isArray && !isObject){
        if(data.dataType?.elementType){
            testType(data.dataType.elementType,index,true)
        }else{
            onlyMessage($t('Import.valideta.6916025-9', [index+1]),'error')
            return true
        }
    }
    if(data.dataType.type === 'file' && !isArray && !isObject){
        if(!data.dataType?.bodyType){
            onlyMessage($t('Import.valideta.6916025-10', [index+1]),'error')
            return true
        }
    }
    if(data.dataType.type === 'object' && !isArray  && !isObject){
        if(data?.dataType?.properties?.length > 0){
          return  testAliObject(data.dataType.properties,index)
        }else{
            onlyMessage($t('Import.valideta.6916025-11', [index+1]),'error')
            return true
        }
    }
}

export const testAliObject = (data:any,index:number)=>{
    let check = false
    data.forEach((i:any)=>{
        if(!i?.identifier){
            onlyMessage($t('Import.valideta.6916025-3', [index+1]),'error')
            check = true
            return
        }
        if(!i?.name){
            onlyMessage($t('Import.valideta.6916025-4', [index+1]),'error')
            check = true
            return
        }
        if(!i?.dataType?.type){
            onlyMessage($t('Import.valideta.6916025-12', [index+1]),'error')
            check = true
            return
        }else{
           check =  testAliType(i,index,false,true)
           return
        }
    })
    return check
}
