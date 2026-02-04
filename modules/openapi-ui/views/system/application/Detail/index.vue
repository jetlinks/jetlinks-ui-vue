<template>
    <j-page-container>
        <template #title>
            <div>
                <div style="display: flex; align-items: center">
                    <a-button @click="handleBack" style="margin-right: 12px">
                        <template #icon>
                            <AIcon type="ArrowLeftOutlined" />
                        </template>
                        返回
                    </a-button>
                    <a-tooltip>
                        <template #title>{{ appData.name }}</template>
                        <div class="applicationDetailHead">
                            {{ appData.name || '应用详情' }}
                        </div>
                    </a-tooltip>
                    <div style="margin: -5px 0 0 20px">
                        <j-permission-button
                            style="padding: 0"
                            type="text"
                            hasPermission="system/Apply:action"
                            :popConfirm="{
                                title: appData.state?.value === 'enabled' ? '确认停用？' : '确认启用？',
                                onConfirm: handleToggleState,
                            }"
                        >
                            <a-switch
                                :checked="appData.state?.value === 'enabled'"
                                checked-children="正常"
                                un-checked-children="停用"
                            />
                        </j-permission-button>
                    </div>
                </div>

                <!-- 访问凭证区域 -->
                <div style="margin-top: 16px; padding: 12px; border-radius: 4px">
                    <a-space direction="vertical" style="width: 100%" :size="8">
                        <a-space>
                            <span style="color: rgba(0, 0, 0, 0.45); min-width: 80px">AppID:</span>
                            <a-typography-text :copyable="{ text: appData.id }">
                                {{ appData.id }}
                            </a-typography-text>
                        </a-space>
                        <a-space>
                            <span style="color: rgba(0, 0, 0, 0.45); min-width: 80px">AppSecret:</span>
                            <a-typography-text v-if="showSecret" :copyable="{ text: appSecret }">
                                {{ appSecret }}
                            </a-typography-text>
                            <a-typography-text v-else>
                                ••••••••••••••••
                            </a-typography-text>
                            <a-button size="small" @click="toggleSecret">
                                {{ showSecret ? '隐藏' : '显示' }}
                            </a-button>
                            <a-button size="small" @click="handleCopySecret">
                                复制
                            </a-button>
                            <a-button size="small" danger @click="handleResetSecret">
                                重置
                            </a-button>
                        </a-space>
                    </a-space>
                </div>
            </div>
        </template>

        <!-- Tabs 区域 -->
        <a-card style="margin-top: 16px">
            <a-tabs v-model:activeKey="activeTab" type="line">
                <!-- Tab 1: 概览 -->
                <a-tab-pane key="overview" tab="概览">
                    <a-descriptions :column="2" bordered>
                        <a-descriptions-item label="应用ID">
                            {{ appData.id }}
                        </a-descriptions-item>
                        <a-descriptions-item label="应用类型">
                            {{ providerLabel }}
                        </a-descriptions-item>
                        <a-descriptions-item label="应用状态">
                            <j-badge-status
                                v-if="appData.state"
                                :status="appData.state.value"
                                :text="appData.state.text"
                                :statusNames="{
                                    enabled: 'processing',
                                    disabled: 'error',
                                }"
                            />
                            <span v-else>-</span>
                        </a-descriptions-item>
                        <a-descriptions-item label="创建时间">
                            {{ formatTime(appData.createTime) }}
                        </a-descriptions-item>
                        <a-descriptions-item label="更新时间">
                            {{ formatTime(appData.modifyTime) }}
                        </a-descriptions-item>
                        <a-descriptions-item label="最近配置更新时间">
                            {{ formatTime(appData.modifyTime) }}
                        </a-descriptions-item>
                        <a-descriptions-item label="对外暴露接口数量" :span="1">
                            {{ apiCount }}
                        </a-descriptions-item>
                        <a-descriptions-item label="高风险接口数量" :span="1">
                            {{ highRiskApiCount }}
                        </a-descriptions-item>
                        <a-descriptions-item label="应用描述" :span="2">
                            {{ appData.description || '-' }}
                        </a-descriptions-item>
                    </a-descriptions>
                </a-tab-pane>

                <!-- Tab 2: API 列表 -->
                <a-tab-pane key="apis" tab="API 列表">
                    <GrantedApiListView
                        ref="grantedApiListViewRef"
                        :app-id="appData.id"
                        @view="showApiDetail"
                    />
                </a-tab-pane>

                <!-- Tab 3: 文档与示例 -->
                <a-tab-pane key="docs" tab="文档与示例">
                    <div class="docs-container">
                        <div class="docs-sidebar">
                            <a-anchor 
                                v-if="activeTab === 'docs'"
                                :get-container="getAnchorContainer"
                                :items="anchorItems"
                                :affix="false"
                                :bounds="5"
                                :offset-top="20"
                            />
                        </div>
                        <div class="docs-content" ref="docsContentRef" id="docs-content">
                            <a-card>
                                <a-typography>
                                    <div id="quick-start">
                                        <a-typography-title :level="3">
                                            快速开始
                                        </a-typography-title>
                                        <a-typography-paragraph>
                                            本文档介绍如何使用该应用的 API 接口。通过 API 接口，您可以集成应用功能到您的系统中。
                                        </a-typography-paragraph>
                                        <a-typography-paragraph>
                                            <strong>前置条件：</strong>
                                        </a-typography-paragraph>
                                        <a-typography-paragraph>
                                            <ul>
                                                <li>已创建应用并获取 AppID 和 AppSecret</li>
                                                <li>已为应用授权相应的 API 分组和接口</li>
                                                <li>确保网络可以访问 API 服务地址</li>
                                            </ul>
                                        </a-typography-paragraph>
                                        <a-typography-paragraph>
                                            <strong>基本流程：</strong>
                                        </a-typography-paragraph>
                                        <a-typography-paragraph>
                                            <ol>
                                                <li>获取访问凭证（AppID 和 AppSecret）</li>
                                                <li>在请求头中添加认证信息</li>
                                                <li>调用已授权的 API 接口</li>
                                                <li>处理返回结果和错误情况</li>
                                            </ol>
                                        </a-typography-paragraph>
                                    </div>

                                    <div id="authentication" style="margin-top: 32px;">
                                        <a-typography-title :level="3">
                                            认证方式
                                        </a-typography-title>
                                        <a-typography-paragraph>
                                            使用 AppID 和 AppSecret 进行认证。所有 API 请求都必须在请求头中包含认证信息。
                                        </a-typography-paragraph>
                                        
                                        <a-typography-title :level="4" style="margin-top: 24px;">
                                            请求头格式
                                        </a-typography-title>
                                        <a-typography-paragraph>
                                            <pre style="background: #f5f5f5; padding: 12px; border-radius: 4px; margin: 0; overflow-x: auto;"><code>X-App-Id: {{ appData.id }}
X-App-Secret: {{ showSecret ? appSecret : '••••••••••••••••' }}</code></pre>
                                        </a-typography-paragraph>

                                        <a-typography-title :level="4" style="margin-top: 24px;">
                                            cURL 示例
                                        </a-typography-title>
                                        <a-typography-paragraph>
                                            <pre style="background: #f5f5f5; padding: 12px; border-radius: 4px; margin: 0; overflow-x: auto;"><code>curl -X GET "https://api.example.com/api/device/query" \
  -H "X-App-Id: {{ appData.id }}" \
  -H "X-App-Secret: {{ showSecret ? appSecret : 'YOUR_SECRET' }}"</code></pre>
                                        </a-typography-paragraph>

                                        <a-typography-title :level="4" style="margin-top: 24px;">
                                            JavaScript 示例
                                        </a-typography-title>
                                        <a-typography-paragraph>
                                            <pre style="background: #f5f5f5; padding: 12px; border-radius: 4px; margin: 0; overflow-x: auto;"><code>fetch('https://api.example.com/api/device/query', {
  method: 'GET',
  headers: {
    'X-App-Id': '{{ appData.id }}',
    'X-App-Secret': '{{ showSecret ? appSecret : 'YOUR_SECRET' }}',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));</code></pre>
                                        </a-typography-paragraph>

                                        <a-typography-title :level="4" style="margin-top: 24px;">
                                            Python 示例
                                        </a-typography-title>
                                        <a-typography-paragraph>
                                            <pre style="background: #f5f5f5; padding: 12px; border-radius: 4px; margin: 0; overflow-x: auto;"><code>import requests

headers = {
    'X-App-Id': '{{ appData.id }}',
    'X-App-Secret': '{{ showSecret ? appSecret : 'YOUR_SECRET' }}',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://api.example.com/api/device/query',
    headers=headers
)
print(response.json())</code></pre>
                                        </a-typography-paragraph>
                                    </div>

                                    <div id="api-usage" style="margin-top: 32px;">
                                        <a-typography-title :level="3">
                                            API 使用
                                        </a-typography-title>
                                        <a-typography-paragraph>
                                            请参考 API 列表标签页查看具体接口信息。所有接口都需要在请求头中包含认证信息。
                                        </a-typography-paragraph>

                                        <a-typography-title :level="4" style="margin-top: 24px;">
                                            请求示例
                                        </a-typography-title>
                                        <a-typography-paragraph>
                                            <strong>GET 请求示例：</strong>
                                        </a-typography-paragraph>
                                        <a-typography-paragraph>
                                            <pre style="background: #f5f5f5; padding: 12px; border-radius: 4px; margin: 0; overflow-x: auto;"><code>GET /api/device/query?pageIndex=0&pageSize=10 HTTP/1.1
Host: api.example.com
X-App-Id: {{ appData.id }}
X-App-Secret: {{ showSecret ? appSecret : 'YOUR_SECRET' }}
Content-Type: application/json</code></pre>
                                        </a-typography-paragraph>

                                        <a-typography-paragraph>
                                            <strong>POST 请求示例：</strong>
                                        </a-typography-paragraph>
                                        <a-typography-paragraph>
                                            <pre style="background: #f5f5f5; padding: 12px; border-radius: 4px; margin: 0; overflow-x: auto;"><code>POST /api/device/save HTTP/1.1
Host: api.example.com
X-App-Id: {{ appData.id }}
X-App-Secret: {{ showSecret ? appSecret : 'YOUR_SECRET' }}
Content-Type: application/json

{
  "name": "设备名称",
  "type": "device",
  "description": "设备描述"
}</code></pre>
                                        </a-typography-paragraph>

                                        <a-typography-title :level="4" style="margin-top: 24px;">
                                            响应格式
                                        </a-typography-title>
                                        <a-typography-paragraph>
                                            所有 API 响应都遵循统一的 JSON 格式：
                                        </a-typography-paragraph>
                                        <a-typography-paragraph>
                                            <pre style="background: #f5f5f5; padding: 12px; border-radius: 4px; margin: 0; overflow-x: auto;"><code>{
  "status": 200,
  "message": "操作成功",
  "result": {
    // 具体数据
  },
  "timestamp": 1640995200000
}</code></pre>
                                        </a-typography-paragraph>
                                    </div>

                                    <div id="error-codes" style="margin-top: 32px;">
                                        <a-typography-title :level="3">
                                            错误码说明
                                        </a-typography-title>
                                        <a-typography-paragraph>
                                            当 API 调用失败时，会返回相应的错误码和错误信息。常见错误码及其含义如下：
                                        </a-typography-paragraph>
                                        <a-table 
                                            :columns="errorCodeColumns" 
                                            :data-source="errorCodeData" 
                                            :pagination="false"
                                            size="small"
                                            style="margin-top: 16px;"
                                        />
                                    </div>
                                </a-typography>
                            </a-card>
                        </div>
                    </div>
                </a-tab-pane>

                <!-- Tab 4: 调用统计 -->
                <a-tab-pane v-if="false" key="metrics" tab="调用统计">
                    <ApiMetrics ref="apiMetricsRef" />
                </a-tab-pane>

                <!-- Tab 5: 限流与配额 -->
                <a-tab-pane v-if="false" key="ratelimit" tab="限流与配额">
                    <RateLimitQuota ref="rateLimitQuotaRef" />
                </a-tab-pane>
            </a-tabs>
        </a-card>

        <!-- API 详情抽屉 -->
        <a-drawer
            v-model:open="apiDetailVisible"
            title="API文档"
            width="900"
            :footer="null"
        >   
            <!-- API 文档 - 使用预览组件 -->
            <a-card>
                <MarkdownPreview :content="currentApi.apiDoc" />
            </a-card>
        </a-drawer>
    </j-page-container>
</template>

<script setup lang="ts" name="ApplicationDetail">
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAppInfo_api, updateApp_api, queryType } from '@authentication-manager-ui/api/system/apply'
import { onlyMessage } from '@jetlinks-web/utils'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import GrantedApiListView from './components/GrantedApiListView.vue'
import ApiMetrics from './components/ApiMetrics.vue'
import RateLimitQuota from './components/RateLimitQuota.vue'
import MarkdownPreview from '../../../../components/MarkdownPreview/index.vue'

const route = useRoute()
const router = useRouter()

// 应用数据
const appData = reactive<any>({
    id: '',
    name: '',
    provider: '',
    description: '',
    state: 1,
    createTime: null,
    modifyTime: null,
})

// AppSecret 相关
const appSecret = ref<string>('')
const showSecret = ref<boolean>(false)

// Tabs 相关
const activeTab = ref<string>('overview')

// 图表组件引用
const apiMetricsRef = ref<any>(null)
const rateLimitQuotaRef = ref<any>(null)

// 文档内容容器引用
const docsContentRef = ref<HTMLElement | null>(null)

// Anchor容器获取函数
const getAnchorContainer = () => {
    if (typeof document === 'undefined') {
        return window
    }
    // 优先使用ref
    if (docsContentRef.value) {
        return docsContentRef.value
    }
    // 如果ref不存在，使用getElementById
    const element = document.getElementById('docs-content')
    if (element) {
        return element
    }
    // 最后fallback到window
    return window
}

// Anchor items配置
const anchorItems = [
    {
        key: 'quick-start',
        href: '#quick-start',
        title: '快速开始',
    },
    {
        key: 'authentication',
        href: '#authentication',
        title: '认证方式',
    },
    {
        key: 'api-usage',
        href: '#api-usage',
        title: 'API 使用',
    },
    {
        key: 'error-codes',
        href: '#error-codes',
        title: '错误码说明',
    },
]

// 错误码表格列
const errorCodeColumns = [
    {
        title: 'HTTP状态码',
        dataIndex: 'httpCode',
        key: 'httpCode',
        width: 120,
    },
    {
        title: '错误码',
        dataIndex: 'code',
        key: 'code',
        width: 120,
    },
    {
        title: '错误信息',
        dataIndex: 'message',
        key: 'message',
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
    },
]

// 错误码数据
const errorCodeData = [
    {
        key: '1',
        httpCode: 400,
        code: 'BAD_REQUEST',
        message: '请求参数错误',
        description: '请求参数格式不正确或缺少必需参数',
    },
    {
        key: '2',
        httpCode: 401,
        code: 'UNAUTHORIZED',
        message: '认证失败',
        description: 'AppID 或 AppSecret 不正确，或认证信息缺失',
    },
    {
        key: '3',
        httpCode: 403,
        code: 'FORBIDDEN',
        message: '权限不足',
        description: '该接口未授权给当前应用，请检查应用授权配置',
    },
    {
        key: '4',
        httpCode: 404,
        code: 'NOT_FOUND',
        message: '接口不存在',
        description: '请求的 API 路径不存在或已被删除',
    },
    {
        key: '5',
        httpCode: 429,
        code: 'TOO_MANY_REQUESTS',
        message: '请求过于频繁',
        description: '超过了限流阈值，请稍后重试',
    },
    {
        key: '6',
        httpCode: 500,
        code: 'INTERNAL_ERROR',
        message: '服务器内部错误',
        description: '服务器处理请求时发生错误，请稍后重试或联系技术支持',
    },
    {
        key: '7',
        httpCode: 503,
        code: 'SERVICE_UNAVAILABLE',
        message: '服务不可用',
        description: '服务暂时不可用，请稍后重试',
    },
]

// 已赋权API数据（通过GrantedApiListView组件获取）
const grantedApiListViewRef = ref<any>(null)

// 应用类型选项
const typeOptions = ref<any[]>([])

// 应用类型中文标签
const providerLabel = computed(() => {
    if (!appData.provider) return '-'
    const option = typeOptions.value.find((item) => item.value === appData.provider)
    return option?.label || appData.provider
})

// 接口数量统计（基于已赋权接口）
const apiCount = computed(() => {
    return grantedApiListViewRef.value?.getGrantedApiCount() || 0
})

// 高风险接口数量（基于已赋权接口）
const highRiskApiCount = computed(() => {
    const apiData = grantedApiListViewRef.value?.getAllApiData() || []
    return apiData.filter(api => 
        (api.riskLevel?.value || api.riskLevel) === 'high'
    ).length
})

// API 详情抽屉
const apiDetailVisible = ref<boolean>(false)
const currentApi = ref<any>(null)

// 返回
const handleBack = () => {
    router.back()
}

// 监听 anchor 链接点击，手动处理滚动以确保在固定容器内正确滚动
const setupAnchorClickHandler = () => {
    const handleAnchorLinkClick = (e: Event) => {
        const target = e.target as HTMLElement
        const anchorLink = target.closest('a[href^="#"]')
        if (anchorLink) {
            e.preventDefault()
            e.stopPropagation()
            const href = anchorLink.getAttribute('href')
            if (href && href.startsWith('#')) {
                const hash = href.substring(1)
                nextTick(() => {
                    const element = document.getElementById(hash)
                    if (element && docsContentRef.value) {
                        const container = docsContentRef.value
                        // 计算元素相对于滚动容器的位置
                        const containerRect = container.getBoundingClientRect()
                        const elementRect = element.getBoundingClientRect()
                        // 计算需要滚动的距离：元素顶部相对于容器顶部的距离 + 当前已滚动的距离 - offset
                        const scrollTop = container.scrollTop + (elementRect.top - containerRect.top) - 20
                        container.scrollTo({
                            top: Math.max(0, scrollTop),
                            behavior: 'smooth'
                        })
                    }
                })
            }
        }
    }
    
    // 延迟绑定事件，确保 anchor 组件已渲染
    setTimeout(() => {
        const sidebar = document.querySelector('.docs-sidebar')
        if (sidebar) {
            sidebar.addEventListener('click', handleAnchorLinkClick, true) // 使用捕获阶段
        }
    }, 300)
}

// 切换 Secret 显示/隐藏
const toggleSecret = () => {
    showSecret.value = !showSecret.value
}

// 复制 Secret
const handleCopySecret = () => {
    if (appSecret.value) {
        navigator.clipboard.writeText(appSecret.value)
        message.success('复制成功')
    }
}

// 重置 Secret
const handleResetSecret = () => {
    message.warning('重置功能待实现')
}

// 切换应用状态
const handleToggleState = async () => {
    try {
        const currentState = appData.state?.value || 'disabled'
        const newStateValue = currentState === 'enabled' ? 'disabled' : 'enabled'
        const resp = await updateApp_api(appData.id, {
            ...appData,
            state: newStateValue,
        })
        if (resp.success) {
            // 更新状态对象
            appData.state = {
                value: newStateValue,
                text: newStateValue === 'enabled' ? '正常' : '停用'
            }
            message.success(newStateValue === 'enabled' ? '启用成功' : '停用成功')
        }
    } catch (error) {
        console.error('切换状态失败:', error)
        message.error('操作失败')
    }
}

// 格式化时间
const formatTime = (time: any) => {
    if (!time) return '-'
    return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

// 获取 HTTP 方法颜色
const getMethodColor = (method: string) => {
    const colorMap: Record<string, string> = {
        GET: 'green',
        POST: 'blue',
        PUT: 'orange',
        DELETE: 'red',
        PATCH: 'purple',
    }
    return colorMap[method] || 'default'
}

// 获取可见性颜色
const getVisibilityColor = (visibility: string) => {
    const colorMap: Record<string, string> = {
        open: '#52c41a',
        private: '#faad14',
        internal: '#1890ff',
    }
    return colorMap[visibility] || '#000000'
}

// 获取稳定性状态颜色
const getStabilityColor = (stability: string) => {
    const colorMap: Record<string, string> = {
        stable: 'success',
        preview: 'warning',
        deprecated: 'error',
    }
    return colorMap[stability] || 'default'
}

// 获取风险等级颜色
const getRiskColor = (riskLevel: string) => {
    const colorMap: Record<string, string> = {
        low: 'success',
        medium: 'warning',
        high: 'error',
    }
    return colorMap[riskLevel] || 'default'
}

// 获取风险等级标签
const getRiskLabel = (riskLevel: string) => {
    const labelMap: Record<string, string> = {
        low: '低风险',
        medium: '中风险',
        high: '高风险',
    }
    return labelMap[riskLevel] || '未知'
}

// 获取操作类型颜色
const getOperationTypeColor = (operationType: string) => {
    const colorMap: Record<string, string> = {
        read: 'blue',
        write: 'orange',
        control: 'red',
    }
    return colorMap[operationType] || 'default'
}

// 获取操作类型标签
const getOperationTypeLabel = (operationType: string) => {
    const labelMap: Record<string, string> = {
        read: '只读',
        write: '写入',
        control: '控制',
    }
    return labelMap[operationType] || '未知'
}

// 显示 API 详情
const showApiDetail = (api: any) => {
    currentApi.value = api
    apiDetailVisible.value = true
}

// 加载应用详情
const loadAppDetail = async (id: string) => {
    try {
        const resp = await getAppInfo_api(id)
        if (resp.success && resp.result) {
            const data = resp.result
            // 处理状态数据：如果后端返回的是对象则直接使用，如果是数字则转换为对象格式
            let stateData = data.state
            if (typeof stateData === 'number') {
                // 兼容数字格式：1=启用，0=停用
                stateData = {
                    value: stateData === 1 ? 'enabled' : 'disabled',
                    text: stateData === 1 ? '正常' : '停用'
                }
            } else if (!stateData || typeof stateData !== 'object') {
                // 如果状态不存在或格式不正确，设置默认值
                stateData = {
                    value: 'disabled',
                    text: '停用'
                }
            }
            
            Object.assign(appData, {
                id: data.id,
                name: data.name,
                provider: data.provider,
                description: data.description,
                state: stateData,
                createTime: data.createTime,
                modifyTime: data.modifyTime,
            })

            // 获取 AppSecret
            if (data.apiServer && data.apiServer.secureKey) {
                appSecret.value = data.apiServer.secureKey
            }
        }
    } catch (error) {
        console.error('加载应用详情失败:', error)
        onlyMessage('加载应用详情失败', 'error')
    }
}

// 加载应用类型选项
const loadTypeOptions = async () => {
    try {
        const resp = await queryType()
        if (resp.status === 200) {
            typeOptions.value = resp.result.map((item: any) => ({
                label: item.name,
                value: item.provider,
            }))
        }
    } catch (error) {
        console.error('加载应用类型失败:', error)
    }
}

// 监听GrantedApiListView组件的数据变化，更新统计信息
watch(
    () => grantedApiListViewRef.value?.getAllApiData(),
    () => {
        // 数据变化时会自动触发computed更新
    },
    { deep: true }
)

// 监听tab切换，当切换到图表tab时触发resize
watch(
    () => activeTab.value,
    (newTab) => {
        if (newTab === 'metrics' || newTab === 'ratelimit') {
            // 延迟执行，确保tab内容已完全显示
            nextTick(() => {
                setTimeout(() => {
                    if (newTab === 'metrics' && apiMetricsRef.value) {
                        apiMetricsRef.value.resizeAllCharts()
                    }
                    if (newTab === 'ratelimit' && rateLimitQuotaRef.value) {
                        rateLimitQuotaRef.value.resizeAllCharts()
                    }
                }, 100)
            })
        }
        // 当切换到文档tab时，确保anchor容器已准备好并设置点击处理
        if (newTab === 'docs') {
            nextTick(() => {
                // 触发anchor重新计算容器
                if (docsContentRef.value) {
                    // 容器已准备好，设置点击处理
                    setupAnchorClickHandler()
                }
            })
        }
    }
)

onMounted(() => {
    const id = route.params.id as string
    if (id && id !== ':id') {
        loadAppDetail(id)
        loadTypeOptions()
    }
})
</script>

<style lang="less" scoped>
.applicationDetailHead {
    font-size: 16px;
    font-weight: 600;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.docs-container {
    display: flex;
    gap: 16px;
    height: calc(100vh - 300px); // 固定容器高度，减去页面其他元素的高度
    min-height: 600px;

    .docs-sidebar {
        width: 200px;
        flex-shrink: 0;
        position: sticky;
        top: 20px;
        align-self: flex-start;
        max-height: calc(100vh - 200px);
        overflow-y: auto;
    }

    .docs-content {
        flex: 1;
        min-width: 0;
        height: 100%; // 固定高度
        overflow-y: auto; // 容器内部滚动
        overflow-x: hidden;
    }
}

.api-manage-container {
    display: flex;
    flex-direction: column;
    height: 600px;
    background: #f5f5f5;

    .content-wrapper {
        flex: 1;
        display: flex;
        overflow: hidden;
        min-height: 0;

        .left-panel {
            width: 240px;
            border-right: 1px solid #e8e8e8;
            overflow-y: auto;
            flex-shrink: 0;
            background: #fff;
        }

        .middle-panel {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            padding: 16px;
            background: #fff;

            .empty-state {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                padding: 20px;
            }

            .api-collapse-wrapper {
                display: flex;
                flex-direction: column;
                gap: 8px;

                :deep(.ant-collapse) {
                    background: #fff;
                    border: 1px solid #e8e8e8;
                    border-radius: 4px;
                    margin-bottom: 0 !important;

                    &:last-child {
                        margin-bottom: 0 !important;
                    }

                    .ant-collapse-header {
                        padding: 14px 16px !important;
                        font-weight: 500 !important;
                        font-size: 14px !important;
                        background: #fafafa !important;
                    }

                    .ant-collapse-content {
                        background: #fff;
                        border-top: 1px solid #e8e8e8 !important;
                    }

                    .ant-collapse-content-box {
                        padding: 0 !important;
                    }
                }

                .list-header {
                    display: grid;
                    grid-template-columns: 1fr 90px 70px 70px 80px;
                    padding: 12px 16px;
                    border-bottom: 1px solid #e8e8e8;
                    background: #fafafa;
                    font-weight: 600;
                    font-size: 12px;
                    color: rgba(0, 0, 0, 0.65);
                    gap: 0;
                    align-items: center;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;

                    .header-cell {
                        display: flex;
                        align-items: center;
                        overflow: hidden;

                        &.path-cell {
                            min-width: 0;
                        }

                        &.visibility-cell,
                        &.risk-cell,
                        &.type-cell {
                            justify-content: center;
                        }
                    }
                }

                .list-row {
                    display: grid;
                    grid-template-columns: 1fr 90px 70px 70px 80px;
                    padding: 14px 16px;
                    border-bottom: 1px solid #f0f0f0;
                    gap: 0;
                    align-items: flex-start;
                    transition: background-color 0.2s;

                    &:hover {
                        background: #fafafa;
                    }

                    &:last-child {
                        border-bottom: none;
                    }

                    .cell {
                        display: flex;
                        align-items: center;
                        overflow: hidden;
                        min-width: 0;

                        &.path-cell {
                            flex-direction: column;
                            align-items: flex-start;
                            gap: 6px;

                            .path-info {
                                display: flex;
                                align-items: center;
                                gap: 8px;
                                width: 100%;
                                min-width: 0;

                                :deep(.ant-tag) {
                                    margin: 0 !important;
                                    flex-shrink: 0;
                                }

                                .path-text {
                                    font-size: 13px;
                                    color: #262626;
                                    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    min-width: 0;
                                }
                            }

                            .desc-text {
                                font-size: 12px;
                                color: #8c8c8c;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                width: 100%;
                            }
                        }

                        &.visibility-cell,
                        &.risk-cell,
                        &.type-cell {
                            justify-content: center;

                            :deep(.ant-tag) {
                                margin: 0 !important;
                            }
                        }

                        &.action-cell {
                            justify-content: center;
                        }
                    }
                }
            }
        }
    }
}
</style>
