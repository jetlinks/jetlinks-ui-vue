import { edgeCollector, edgePoint } from "@/api/device/instance";

const channelMap = new Map()
const queryDataList = (_val: string, edgeId: string, type: string) => new Promise(async (resolve) => {
    if (!_val || !edgeId || !type) {
        resolve([])
    } else {
        if (channelMap.get(_val)) {
            resolve(channelMap.get(_val))
        } else {
            let resp = undefined
            if (type === 'POINT') {
                resp = await edgePoint(edgeId, {
                    terms: [
                        {
                            terms: [
                                {
                                    column: 'collectorId',
                                    value: _val,
                                },
                            ],
                        },
                    ],
                });
            } else {
                resp = await edgeCollector(edgeId, {
                    terms: [
                        {
                            terms: [
                                {
                                    column: 'channelId',
                                    value: _val,
                                },
                            ],
                        },
                    ],
                });
            }
            if (resp && resp.status === 200) {
                const _data = (resp.result as any[])?.[0] || []
                channelMap.set(_val, _data)
                resolve(_data)
            }
        }
    }
})

export default queryDataList