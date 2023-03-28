import server from '@/utils/request'

// 获取记录列表
export const getList_api = (data: object): any => server.get(`/notifications/_query`, encodeParams(data))
// 获取未读记录列表
export const getListByUnRead_api = (data: object): any => server.post(`/notifications/_query`, data)
// 修改记录状态
export const changeStatus_api = (type: '_read' | '_unread', data: string[]): any => server.post(`/notifications/${type}`, data)
export const read = (id: string): any => server.get(`notifications/${id}/read`)


const encodeParams = (params: Record<string, any>) => {
    let result = {}
    for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
            const value = params[key];
            if (key === 'terms') {
                result['terms[0].column:'] = 0
                result['terms[0].value'] = JSON.stringify(value[0])
            } else result[key] = value
        }
    }

    return result
};