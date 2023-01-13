import { TOKEN_KEY } from '@/utils/variable'

/**
 * 静态图片资源处理
 * @param path {String} 路径
 */
export const getImage = (path: string) => {
    return new URL('/images'+path, import.meta.url).href
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