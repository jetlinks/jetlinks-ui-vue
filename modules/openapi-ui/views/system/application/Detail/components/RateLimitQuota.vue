<template>
    <div class="rate-limit-quota-container">
        <!-- 配额概览卡片 -->
        <a-row :gutter="16" style="margin-bottom: 16px">
            <a-col :span="6">
                <a-card style="margin-bottom: 16px">
                    <a-statistic
                        title="总配额"
                        :value="100000"
                        suffix="次/天"
                        :value-style="{ color: '#1890ff', fontSize: '20px' }"
                    />
                </a-card>
            </a-col>
            <a-col :span="6">
                <a-card style="margin-bottom: 16px">
                    <a-statistic
                        title="已使用"
                        :value="45280"
                        suffix="次"
                        :value-style="{ color: '#52c41a', fontSize: '20px' }"
                    />
                </a-card>
            </a-col>
            <a-col :span="6">
                <a-card style="margin-bottom: 16px">
                    <a-statistic
                        title="剩余配额"
                        :value="54720"
                        suffix="次"
                        :value-style="{ color: '#faad14', fontSize: '20px' }"
                    />
                </a-card>
            </a-col>
            <a-col :span="6">
                <a-card style="margin-bottom: 16px">
                    <a-statistic
                        title="使用率"
                        :value="45.28"
                        suffix="%"
                        :value-style="{ color: '#722ed1', fontSize: '20px' }"
                    />
                </a-card>
            </a-col>
            <a-col :span="6">
                <a-card style="margin-bottom: 16px">
                    <a-statistic
                        title="限流触发次数"
                        :value="128"
                        suffix="次"
                        :value-style="{ color: '#ff4d4f', fontSize: '20px' }"
                    />
                </a-card>
            </a-col>
            <a-col :span="6">
                <a-card style="margin-bottom: 16px">
                    <a-statistic
                        title="当前QPS"
                        :value="285"
                        suffix="/s"
                        :value-style="{ color: '#13c2c2', fontSize: '20px' }"
                    />
                </a-card>
            </a-col>
            <a-col :span="6">
                <a-card style="margin-bottom: 16px">
                    <a-statistic
                        title="配额费用"
                        :value="452.80"
                        prefix="¥"
                        :value-style="{ color: '#ff4d4f', fontSize: '20px' }"
                    />
                </a-card>
            </a-col>
            <a-col :span="6">
                <a-card style="margin-bottom: 16px">
                    <a-statistic
                        title="预估月费用"
                        :value="13584.00"
                        prefix="¥"
                        :value-style="{ color: '#faad14', fontSize: '20px' }"
                    />
                </a-card>
            </a-col>
        </a-row>

        <a-row :gutter="16">
            <!-- 限流规则详情列表 -->
            <a-col :span="24">
                <a-card title="限流规则详情" style="margin-bottom: 16px">
                    <a-table
                        :columns="rateLimitColumns"
                        :data-source="rateLimitData"
                        :pagination="false"
                        size="small"
                        bordered
                    >
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.key === 'status'">
                                <a-tag :color="record.status === '启用' ? 'success' : 'default'">
                                    {{ record.status }}
                                </a-tag>
                            </template>
                            <template v-else-if="column.key === 'limit'">
                                {{ record.limit }} {{ record.unit }}
                            </template>
                        </template>
                    </a-table>
                </a-card>
            </a-col>

            <!-- 配额使用率仪表盘 -->
            <a-col :span="12">
                <a-card title="配额使用率" style="margin-bottom: 16px">
                    <div ref="quotaUsageRef" style="height: 300px; width: 100%"></div>
                </a-card>
            </a-col>

            <!-- QPS趋势图 -->
            <a-col :span="12">
                <a-card title="QPS趋势" style="margin-bottom: 16px">
                    <div ref="qpsTrendRef" style="height: 300px; width: 100%"></div>
                </a-card>
            </a-col>

            <!-- 配额使用趋势和限流触发趋势 -->
            <a-col :span="12">
                <a-card title="配额使用趋势" style="margin-bottom: 16px">
                    <div ref="quotaTrendRef" style="height: 300px; width: 100%"></div>
                </a-card>
            </a-col>

            <a-col :span="12">
                <a-card title="限流触发趋势" style="margin-bottom: 16px">
                    <div ref="rateLimitTriggerRef" style="height: 300px; width: 100%"></div>
                </a-card>
            </a-col>

            <!-- 配额按API分布和配额按时间分布 -->
            <a-col :span="12">
                <a-card title="配额按API分布TOP10" style="margin-bottom: 16px">
                    <div ref="quotaByApiRef" style="height: 300px; width: 100%"></div>
                </a-card>
            </a-col>

            <a-col :span="12">
                <a-card title="配额按小时分布" style="margin-bottom: 16px">
                    <div ref="quotaHourlyRef" style="height: 300px; width: 100%"></div>
                </a-card>
            </a-col>

            <!-- 配额费用趋势和费用按API分布 -->
            <a-col :span="12">
                <a-card title="配额费用趋势" style="margin-bottom: 16px">
                    <div ref="quotaCostTrendRef" style="height: 300px; width: 100%"></div>
                </a-card>
            </a-col>

            <a-col :span="12">
                <a-card title="费用按API分布TOP10" style="margin-bottom: 16px">
                    <div ref="costByApiRef" style="height: 300px; width: 100%"></div>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'

// 生成模拟时间数据
const generateTimeData = (days: number = 7) => {
    const data = []
    const now = new Date()
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        data.push(date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }))
    }
    return data
}

const generateRandomData = (count: number, min: number, max: number) => {
    return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min)
}

const timeLabels = generateTimeData(7)

// 配额使用率仪表盘
const quotaUsageOptions = computed(() => ({
    series: [
        {
            name: '配额使用率',
            type: 'gauge',
            progress: {
                show: true,
                width: 18,
            },
            axisLine: {
                lineStyle: {
                    width: 18,
                },
            },
            axisTick: {
                show: false,
            },
            splitLine: {
                length: 15,
                lineStyle: {
                    width: 2,
                    color: '#999',
                },
            },
            axisLabel: {
                distance: 25,
                color: '#999',
                fontSize: 12,
            },
            anchor: {
                show: true,
                showAbove: true,
                size: 25,
                itemStyle: {
                    borderWidth: 10,
                },
            },
            title: {
                show: false,
            },
            detail: {
                valueAnimation: true,
                fontSize: 30,
                offsetCenter: [0, '70%'],
                formatter: '{value}%',
            },
            data: [
                {
                    value: 45.28,
                    name: '使用率',
                },
            ],
        },
    ],
}))

// QPS趋势图
const qpsTrendOptions = computed(() => ({
    tooltip: {
        trigger: 'axis',
    },
    legend: {
        data: ['当前QPS', '限流阈值'],
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timeLabels,
    },
    yAxis: {
        type: 'value',
        name: 'QPS',
    },
    series: [
        {
            name: '当前QPS',
            type: 'line',
            data: generateRandomData(7, 50, 200),
            smooth: true,
            itemStyle: { color: '#1890ff' },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                        { offset: 1, color: 'rgba(24, 144, 255, 0.1)' },
                    ],
                },
            },
        },
        {
            name: '限流阈值',
            type: 'line',
            data: Array(7).fill(300),
            smooth: true,
            itemStyle: { color: '#ff4d4f' },
            lineStyle: {
                type: 'dashed',
            },
        },
    ],
}))

// 配额使用趋势图
const quotaTrendOptions = computed(() => ({
    tooltip: {
        trigger: 'axis',
    },
    legend: {
        data: ['已使用配额', '总配额'],
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timeLabels,
    },
    yAxis: {
        type: 'value',
        name: '配额(次)',
    },
    series: [
        {
            name: '已使用配额',
            type: 'line',
            data: generateRandomData(7, 30000, 50000),
            smooth: true,
            itemStyle: { color: '#52c41a' },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
                        { offset: 1, color: 'rgba(82, 196, 26, 0.1)' },
                    ],
                },
            },
        },
        {
            name: '总配额',
            type: 'line',
            data: Array(7).fill(100000),
            smooth: true,
            itemStyle: { color: '#1890ff' },
            lineStyle: {
                type: 'dashed',
            },
        },
    ],
}))

// 限流触发趋势图
const rateLimitTriggerOptions = computed(() => ({
    tooltip: {
        trigger: 'axis',
    },
    legend: {
        data: ['限流触发次数'],
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timeLabels,
    },
    yAxis: {
        type: 'value',
        name: '触发次数',
    },
    series: [
        {
            name: '限流触发次数',
            type: 'bar',
            data: generateRandomData(7, 0, 50),
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        { offset: 0, color: '#ff4d4f' },
                        { offset: 1, color: '#ff7875' },
                    ],
                },
            },
        },
    ],
}))

// 配额按API分布TOP10
const quotaByApiOptions = computed(() => ({
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
        },
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
    },
    xAxis: {
        type: 'value',
        name: '配额使用量',
    },
    yAxis: {
        type: 'category',
        data: [
            '/api/device/query',
            '/api/device/save',
            '/api/user/list',
            '/api/product/query',
            '/api/rule/execute',
            '/api/message/send',
            '/api/data/query',
            '/api/config/update',
            '/api/log/query',
            '/api/file/upload',
        ],
    },
    series: [
        {
            name: '配额使用量',
            type: 'bar',
            data: [8500, 7200, 6800, 5500, 4800, 4200, 3800, 3200, 2800, 2400],
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [
                        { offset: 0, color: '#faad14' },
                        { offset: 1, color: '#ffc53d' },
                    ],
                },
            },
        },
    ],
}))

// 配额按小时分布
const quotaHourlyOptions = computed(() => ({
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
        },
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
    },
    xAxis: {
        type: 'category',
        data: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
    },
    yAxis: {
        type: 'value',
        name: '配额使用量',
    },
    series: [
        {
            name: '配额使用量',
            type: 'bar',
            data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 3000) + 1000),
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        { offset: 0, color: '#13c2c2' },
                        { offset: 1, color: '#36cfc9' },
                    ],
                },
            },
        },
    ],
}))

// 配额费用趋势图
const quotaCostTrendOptions = computed(() => ({
    tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
            let result = params[0].name + '<br/>'
            params.forEach((param: any) => {
                result += `${param.marker}${param.seriesName}: ¥${param.value.toFixed(2)}<br/>`
            })
            return result
        },
    },
    legend: {
        data: ['累计费用', '日均费用'],
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timeLabels,
    },
    yAxis: {
        type: 'value',
        name: '费用(¥)',
    },
    series: [
        {
            name: '累计费用',
            type: 'line',
            data: generateRandomData(7, 300, 500).map(v => v / 10),
            smooth: true,
            itemStyle: { color: '#ff4d4f' },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        { offset: 0, color: 'rgba(255, 77, 79, 0.3)' },
                        { offset: 1, color: 'rgba(255, 77, 79, 0.1)' },
                    ],
                },
            },
        },
        {
            name: '日均费用',
            type: 'line',
            data: generateRandomData(7, 50, 80).map(v => v / 10),
            smooth: true,
            itemStyle: { color: '#faad14' },
        },
    ],
}))

// 费用按API分布TOP10
const costByApiOptions = computed(() => ({
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
        },
        formatter: (params: any) => {
            return `${params[0].name}<br/>${params[0].marker}费用: ¥${params[0].value.toFixed(2)}`
        },
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
    },
    xAxis: {
        type: 'value',
        name: '费用(¥)',
    },
    yAxis: {
        type: 'category',
        data: [
            '/api/device/query',
            '/api/device/save',
            '/api/user/list',
            '/api/product/query',
            '/api/rule/execute',
            '/api/message/send',
            '/api/data/query',
            '/api/config/update',
            '/api/log/query',
            '/api/file/upload',
        ],
    },
    series: [
        {
            name: '费用',
            type: 'bar',
            data: [128.50, 108.20, 89.30, 74.50, 64.20, 58.10, 52.00, 44.30, 38.30, 32.40],
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [
                        { offset: 0, color: '#ff4d4f' },
                        { offset: 1, color: '#ff7875' },
                    ],
                },
            },
        },
    ],
}))

// 限流规则表格列
const rateLimitColumns = [
    {
        title: '规则名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '限流类型',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: '限流值',
        key: 'limit',
    },
    {
        title: '时间窗口',
        dataIndex: 'window',
        key: 'window',
    },
    {
        title: '状态',
        key: 'status',
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
    },
]

// 限流规则数据（静态）
const rateLimitData = ref([
    {
        key: '1',
        name: '全局QPS限制',
        type: 'QPS限流',
        limit: 300,
        unit: '次/秒',
        window: '1秒',
        status: '启用',
        createTime: '2024-01-15 10:00:00',
    },
    {
        key: '2',
        name: '单接口QPS限制',
        type: 'QPS限流',
        limit: 100,
        unit: '次/秒',
        window: '1秒',
        status: '启用',
        createTime: '2024-01-15 10:00:00',
    },
    {
        key: '3',
        name: '日调用量限制',
        type: '配额限制',
        limit: 100000,
        unit: '次/天',
        window: '1天',
        status: '启用',
        createTime: '2024-01-15 10:00:00',
    },
    {
        key: '4',
        name: '小时调用量限制',
        type: '配额限制',
        limit: 10000,
        unit: '次/小时',
        window: '1小时',
        status: '启用',
        createTime: '2024-01-15 10:00:00',
    },
])

// 图表实例引用
const quotaUsageRef = ref<HTMLElement>()
const qpsTrendRef = ref<HTMLElement>()
const quotaTrendRef = ref<HTMLElement>()
const rateLimitTriggerRef = ref<HTMLElement>()
const quotaByApiRef = ref<HTMLElement>()
const quotaHourlyRef = ref<HTMLElement>()
const quotaCostTrendRef = ref<HTMLElement>()
const costByApiRef = ref<HTMLElement>()

// 图表实例
let quotaUsageChart: echarts.ECharts | null = null
let qpsTrendChart: echarts.ECharts | null = null
let quotaTrendChart: echarts.ECharts | null = null
let rateLimitTriggerChart: echarts.ECharts | null = null
let quotaByApiChart: echarts.ECharts | null = null
let quotaHourlyChart: echarts.ECharts | null = null
let quotaCostTrendChart: echarts.ECharts | null = null
let costByApiChart: echarts.ECharts | null = null

// 初始化图表
const initChart = (ref: HTMLElement | undefined, chartInstance: echarts.ECharts | null, options: any): echarts.ECharts | null => {
    if (!ref) return null
    if (!chartInstance) {
        chartInstance = echarts.init(ref)
    }
    chartInstance.setOption(options, true)
    // 延迟resize确保容器已正确渲染
    nextTick(() => {
        chartInstance?.resize()
    })
    return chartInstance
}

// 监听options变化并更新图表
watch(() => quotaUsageOptions.value, (options) => {
    if (quotaUsageRef.value) {
        quotaUsageChart = initChart(quotaUsageRef.value, quotaUsageChart, options)
    }
}, { immediate: true, deep: true })

watch(() => qpsTrendOptions.value, (options) => {
    if (qpsTrendRef.value) {
        qpsTrendChart = initChart(qpsTrendRef.value, qpsTrendChart, options)
    }
}, { immediate: true, deep: true })

watch(() => quotaTrendOptions.value, (options) => {
    if (quotaTrendRef.value) {
        quotaTrendChart = initChart(quotaTrendRef.value, quotaTrendChart, options)
    }
}, { immediate: true, deep: true })

watch(() => rateLimitTriggerOptions.value, (options) => {
    if (rateLimitTriggerRef.value) {
        rateLimitTriggerChart = initChart(rateLimitTriggerRef.value, rateLimitTriggerChart, options)
    }
}, { immediate: true, deep: true })

watch(() => quotaByApiOptions.value, (options) => {
    if (quotaByApiRef.value) {
        quotaByApiChart = initChart(quotaByApiRef.value, quotaByApiChart, options)
    }
}, { immediate: true, deep: true })

watch(() => quotaHourlyOptions.value, (options) => {
    if (quotaHourlyRef.value) {
        quotaHourlyChart = initChart(quotaHourlyRef.value, quotaHourlyChart, options)
    }
}, { immediate: true, deep: true })

watch(() => quotaCostTrendOptions.value, (options) => {
    if (quotaCostTrendRef.value) {
        quotaCostTrendChart = initChart(quotaCostTrendRef.value, quotaCostTrendChart, options)
    }
}, { immediate: true, deep: true })

watch(() => costByApiOptions.value, (options) => {
    if (costByApiRef.value) {
        costByApiChart = initChart(costByApiRef.value, costByApiChart, options)
    }
}, { immediate: true, deep: true })

// 窗口resize处理
const handleResize = () => {
    quotaUsageChart?.resize()
    qpsTrendChart?.resize()
    quotaTrendChart?.resize()
    rateLimitTriggerChart?.resize()
    quotaByApiChart?.resize()
    quotaHourlyChart?.resize()
    quotaCostTrendChart?.resize()
    costByApiChart?.resize()
}

// 使用ResizeObserver监听容器大小变化
const resizeObservers: ResizeObserver[] = []

const setupResizeObserver = (ref: HTMLElement | undefined, chartInstance: echarts.ECharts | null) => {
    if (!ref || !chartInstance) return
    const observer = new ResizeObserver(() => {
        chartInstance.resize()
    })
    observer.observe(ref)
    resizeObservers.push(observer)
}

onMounted(() => {
    // 延迟初始化，确保DOM已完全渲染
    setTimeout(() => {
        if (quotaUsageRef.value) {
            quotaUsageChart = initChart(quotaUsageRef.value, quotaUsageChart, quotaUsageOptions.value)
            if (quotaUsageChart) setupResizeObserver(quotaUsageRef.value, quotaUsageChart)
        }
        if (qpsTrendRef.value) {
            qpsTrendChart = initChart(qpsTrendRef.value, qpsTrendChart, qpsTrendOptions.value)
            if (qpsTrendChart) setupResizeObserver(qpsTrendRef.value, qpsTrendChart)
        }
        if (quotaTrendRef.value) {
            quotaTrendChart = initChart(quotaTrendRef.value, quotaTrendChart, quotaTrendOptions.value)
            if (quotaTrendChart) setupResizeObserver(quotaTrendRef.value, quotaTrendChart)
        }
        if (rateLimitTriggerRef.value) {
            rateLimitTriggerChart = initChart(rateLimitTriggerRef.value, rateLimitTriggerChart, rateLimitTriggerOptions.value)
            if (rateLimitTriggerChart) setupResizeObserver(rateLimitTriggerRef.value, rateLimitTriggerChart)
        }
        if (quotaByApiRef.value) {
            quotaByApiChart = initChart(quotaByApiRef.value, quotaByApiChart, quotaByApiOptions.value)
            if (quotaByApiChart) setupResizeObserver(quotaByApiRef.value, quotaByApiChart)
        }
        if (quotaHourlyRef.value) {
            quotaHourlyChart = initChart(quotaHourlyRef.value, quotaHourlyChart, quotaHourlyOptions.value)
            if (quotaHourlyChart) setupResizeObserver(quotaHourlyRef.value, quotaHourlyChart)
        }
        if (quotaCostTrendRef.value) {
            quotaCostTrendChart = initChart(quotaCostTrendRef.value, quotaCostTrendChart, quotaCostTrendOptions.value)
            if (quotaCostTrendChart) setupResizeObserver(quotaCostTrendRef.value, quotaCostTrendChart)
        }
        if (costByApiRef.value) {
            costByApiChart = initChart(costByApiRef.value, costByApiChart, costByApiOptions.value)
            if (costByApiChart) setupResizeObserver(costByApiRef.value, costByApiChart)
        }
    }, 100)
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    resizeObservers.forEach(observer => observer.disconnect())
    resizeObservers.length = 0
    quotaUsageChart?.dispose()
    qpsTrendChart?.dispose()
    quotaTrendChart?.dispose()
    rateLimitTriggerChart?.dispose()
    quotaByApiChart?.dispose()
    quotaHourlyChart?.dispose()
    quotaCostTrendChart?.dispose()
    costByApiChart?.dispose()
})

// 暴露resize方法供外部调用（当tab切换时）
const resizeAllCharts = () => {
    handleResize()
}

defineExpose({
    resizeAllCharts
})
</script>

<style lang="less" scoped>
.rate-limit-quota-container {
    padding: 16px;
}
</style>
