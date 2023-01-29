import { TOKEN_KEY } from '@/utils/variable'
import { Terms } from 'components/Search/types'

/**
 * 静态图片资源处理
 * @param path {String} 路径
 */
export const getImage = (path: string) => {
    return new URL('/images' + path, import.meta.url).href
}

export const LocalStore = {
    set(key: string, data: any) {
        localStorage.setItem(key, typeof data === 'string' ? data : JSON.stringify(data))
    },
    get(key: string) {
        const dataStr = localStorage.getItem(key)
        try {
            if (dataStr) {
                const data = JSON.parse(dataStr)
                return data && typeof data === 'object' ? data : dataStr
            } else {
                return dataStr
            }
        } catch (e) {
            return dataStr
        }
    },
    remove(key: string) {
        localStorage.removeItem(key)
    },
    removeAll() {
        localStorage.clear()
    }
}

export const getToken = () => {
    return LocalStore.get(TOKEN_KEY)
}

/**
 * TreeSelect过滤
 * @param value 过滤值
 * @param treeNode
 * @param key
 */
export const filterTreeSelectNode = (value: string, treeNode: any, key: string = 'name'): boolean => {
    return treeNode[key]?.includes(value)
}

/**
 * Select过滤
 * @param value 过滤值
 * @param option
 * @param key
 */
export const filterSelectNode = (value: string, option: any, key: string = 'label'): boolean => {
    return option[key]?.includes(value)
}

/**
 * 时间转换为'2022-01-02 14:03:05'
 * @param date 时间对象
 * @returns 
 */
export const dateFormat = (dateSouce:any):string|Error => {
    let date = null
    try {
        date = new Date(dateSouce)
    } catch (error) {
        return new Error('请传入日期格式数据')
    }
    let year = date.getFullYear();
    let month: number | string = date.getMonth() + 1;
    let day: number | string = date.getDate();
    let hour: number | string = date.getHours();
    let minutes: number | string = date.getMinutes();
    let seconds: number | string = date.getSeconds();
    month = (month < 10) ? '0' + month : month;
    day = (day < 10) ? '0' + day : day;
    hour = (hour < 10) ? '0' + hour : hour;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;
    return year + "-" + month + "-" + day
        + " " + hour + ":" + minutes + ":" + seconds;
}