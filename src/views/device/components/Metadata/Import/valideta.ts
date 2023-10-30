import { onlyMessage } from "@/utils/comm"
export const testProperties = (data:any) =>{
    
}

export const testType = (data:any,index:number,isArray?:boolean,isObject?:boolean)=>{
    if(data.valueType.type === 'boolean'){
        if(!data?.valueType?.trueText || !data?.valueType?.trueValue || !data?.valueType?.falseText || !data?.valueType?.falseValue){
            onlyMessage(`方法定义inputs第${index+1}个数组ValueType中缺失必填属性`,'error')
            return true
        }
    }
    if(data.valueType.type === 'enum' && !isObject){
        if(data.valueType?.elements?.length > 0){
            data.valueType.elements.forEach((a:any,b:number)=>{
                if(!a.value || !a.text){
                    onlyMessage(`方法定义inputs第${index+1}个数组ValueType中elements缺失必填属性`,'error')
                    return true
                }
            })
        }else{
            onlyMessage(`方法定义inputs第${index+1}个数组ValueType中缺失elements属性`,'error')
            return true
        }
    }
    if(data.valueType.type === 'array' && !isArray && !isObject){
        if(data.valueType?.elementType){
            testType(data.valueType.elementType,index,true)
        }else{
            onlyMessage(`方法定义inputs第${index+1}个数组ValueType中缺失elementType属性`,'error')
            return true
        }
    }
    if(data.valueType.type === 'file' && !isArray && !isObject){
        if(!data.valueType?.fileType){
            onlyMessage(`方法定义inputs第${index+1}个数组ValueType中缺失fileType属性`,'error')
            return true
        }
    }
    if(data.valueType.type === 'object' && !isArray  && !isObject){
        if(data?.valueType?.properties?.length > 0){
          return  testObject(data.valueType.properties,index)
        }else{
            onlyMessage(`方法定义inputs第${index+1}个数组ValueType中缺失properties属性`,'error')
            return true
        }
    }
}
export const testObject = (data:any,index:number)=>{
    let check = false
    data.forEach((i:any)=>{
        if(!i?.id){
            onlyMessage(`方法定义inputs第${index+1}个数组中缺失id属性`,'error')
            check = true
            return 
        }
        if(!i?.name){
            onlyMessage(`方法定义inputs第${index+1}个数组中缺失name属性`,'error')
            check = true
            return 
        }
        if(!i?.valueType?.type){
            onlyMessage(`方法定义inputs第${index+1}个数组中缺失valueType.type属性`,'error')
            check = true
            return 
        }else{
           check =  testType(i,index,false,true)
           return 
        }
    })
    return check
}