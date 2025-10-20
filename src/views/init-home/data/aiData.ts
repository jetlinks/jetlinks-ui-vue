export const agentData = [
    {
        "clientType": "pagePoint",
        "clientId": "iotHome",
        "name": "首页AI助手",
        "description": "用于支持首页的ai对话",
        "searchCode": "iotHome|物联网/首页",
        "maxAgentSize": 1,
        "expands": {
            "menuName": "物联网/首页",
            "type": "chatBubbles"
        },
    },
    {
        "clientType": "pagePoint",
        "clientId": "deviceDetailChat",
        "name": "设备详情页AI对话助手",
        "description": "用于设备相关ai对话支持",
        "searchCode": "deviceDetailChat|物联网/设备管理/设备/设备详情",
        "maxAgentSize": 1,
        "expands": {
            "menuName": "物联网/设备管理/设备/设备详情",
            "type": "chatBubbles"
        },
        "metadata": {
            "params": [{
                "valueType": {
                    "type": "string"
                },
                "id": "deviceId",
                "name": "设备id",
                "description": "当前设备id"
            }]
        }
    }
]
