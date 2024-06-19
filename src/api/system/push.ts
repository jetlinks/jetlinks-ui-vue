import request from '@/utils/request';

export const queryConfigList = (data: object) =>
    request.post(`/notional/_query`, data);

export const addSingleConfig = (data: object) =>
    request.post(`/notional`, data);

export const updateSingleConfig = (data: object, id: string) =>
    request.put(`/notional/${id}`, data);

export const queryDictWithEncryptType = () => {
    const data = {
        pageSize: 9999,
        pageNum: 0,
        sorts: [
            {
                name: 'ordinal',
                order: 'desc',
            },
        ],
        terms: [
            {
                column: 'dictId',
                value: 'system_push_config__encryptType',
                termType: 'eq',
            },
        ],
    };
    return request.post(`dictionary-item/_query`, data);
};

export const deleteSingleConfig = (id: string | number) =>
    request.request({
        url: `/notional/${id}`,
        method: 'delete',
    });
