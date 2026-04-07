export const agentData = [
  {
    clientType: 'pagePoint',
    clientId: 'iotHome',
    name: '首页AI助手',
    description: '用于支持首页的ai对话',
    searchCode: 'iotHome|物联网/首页',
    maxAgentSize: 1,
    expands: {
      menuName: '物联网/首页',
      type: 'chatBubbles'
    }
  },
  {
    clientType: 'pagePoint',
    clientId: 'deviceDetailChat',
    name: '设备详情页AI对话助手',
    description: '用于设备相关ai对话支持',
    searchCode: 'deviceDetailChat|物联网/设备管理/设备/设备详情',
    maxAgentSize: 1,
    expands: {
      menuName: '物联网/设备管理/设备/设备详情',
      type: 'chatBubbles'
    },
    metadata: {
      params: [
        {
          valueType: {
            type: 'string'
          },
          id: 'deviceId',
          name: '设备id',
          description: '当前设备id'
        }
      ]
    }
  },
  {
    clientType: 'pagePoint',
    clientId: 'viewBigScreen',
    name: '可视化大屏助手',
    description: '用于支持可视化大屏ai对话',
    searchCode: 'viewBigScreen|可视化/大屏',
    maxAgentSize: 1,
    expands: {
      menuName: '可视化/大屏',
      type: 'chatBubbles'
    }
  },
  {
    clientType: 'pagePoint',
    clientId: 'viewDesigner',
    name: '可视化设计器助手',
    description: '用于支持可视化设计器ai对话',
    searchCode: 'viewDesigner|可视化/设计',
    maxAgentSize: 1,
    expands: {
      menuName: '可视化/设计',
      type: 'chatBubbles'
    }
  },
  {
    clientType: 'pagePoint',
    clientId: 'knowledgeAISearch',
    name: '知识库智能搜索',
    description: '用于支持知识库管理智能搜索对话',
    searchCode: 'knowledgeAISearch|知识库/搜索',
    maxAgentSize: -1,
    expands: {
      menuName: '可视化/知识库智能搜索',
      type: 'button'
    }
  },
]
