<template>
    <div class="api-metrics-container">
        <!-- 统计概览卡片 -->
        <a-row :gutter="16" style="margin-bottom: 16px">
            <a-col :span="6">
                <a-card style="margin-bottom: 16px">
                    <a-statistic
                        title="总请求数"
                        :value="12850"
                        :value-style="{ color: '#1890ff', fontSize: '20px' }"
                    />
                </a-card>
            </a-col>
            <a-col :span="6">
                <a-card style="margin-bottom: 16px">
                    <a-statistic
                        title="成功请求"
                        :value="12580"
                        :value-style="{ color: '#52c41a', fontSize: '20px' }"
                    />
                </a-card>
            </a-col>
            <a-col :span="6">
                <a-card style="margin-bottom: 16px">
                    <a-statistic
                        title="失败请求"
                        :value="270"
                        :value-style="{ color: '#ff4d4f', fontSize: '20px' }"
                    />
                </a-card>
            </a-col>
            <a-col :span="6">
                <a-card style="margin-bottom: 16px">
                    <a-statistic
                        title="平均响应时间"
                        :value="156"
                        suffix="ms"
                        :value-style="{ color: '#faad14', fontSize: '20px' }"
                    />
                </a-card>
            </a-col>
            <a-col :span="6">
                <a-card style="margin-bottom: 16px">
                    <a-statistic
                        title="成功率"
                        :value="97.9"
                        suffix="%"
                        :value-style="{ color: '#52c41a', fontSize: '20px' }"
                    />
                </a-card>
            </a-col>
            <a-col :span="6">
                <a-card style="margin-bottom: 16px">
                    <a-statistic
                        title="峰值QPS"
                        :value="285"
                        suffix="/s"
                        :value-style="{ color: '#722ed1', fontSize: '20px' }"
                    />
                </a-card>
            </a-col>
            <a-col :span="6">
                <a-card style="margin-bottom: 16px">
                    <a-statistic
                        title="累计费用"
                        :value="1285.60"
                        prefix="¥"
                        :value-style="{ color: '#ff4d4f', fontSize: '20px' }"
                    />
                </a-card>
            </a-col>
            <a-col :span="6">
                <a-card style="margin-bottom: 16px">
                    <a-statistic
                        title="平均单价"
                        :value="0.10"
                        prefix="¥"
                        suffix="/万次"
                        :value-style="{ color: '#13c2c2', fontSize: '20px' }"
                    />
                </a-card>
            </a-col>
        </a-row>

        <!-- 时间筛选 -->
        <a-card style="margin-bottom: 16px">
            <a-space>
                <span>时间范围：</span>
                <a-radio-group v-model:value="timeRange" @change="handleTimeRangeChange">
                    <a-radio-button value="1h">最近1小时</a-radio-button>
                    <a-radio-button value="24h">最近24小时</a-radio-button>
                    <a-radio-button value="7d">近7天</a-radio-button>
                    <a-radio-button value="30d">近30天</a-radio-button>
                </a-radio-group>
            </a-space>
        </a-card>

        <a-row :gutter="16">
            <!-- 请求次数趋势图 -->
            <a-col :span="24">
                <a-card title="请求次数趋势" style="margin-bottom: 16px">
                    <div ref="requestTrendRef" style="height: 300px; width: 100%"></div>
                </a-card>
            </a-col>

            <!-- 状态码分布和接口调用TOP10 -->
            <a-col :span="12">
                <a-card title="状态码分布" style="margin-bottom: 16px">
                    <div ref="statusCodeRef" style="height: 300px; width: 100%"></div>
                </a-card>
            </a-col>

            <a-col :span="12">
                <a-card title="接口调用TOP10" style="margin-bottom: 16px">
                    <div ref="top10Ref" style="height: 300px; width: 100%"></div>
                </a-card>
            </a-col>

            <!-- 响应时间趋势和错误率趋势 -->
            <a-col :span="12">
                <a-card title="响应时间趋势" style="margin-bottom: 16px">
                    <div ref="responseTimeRef" style="height: 300px; width: 100%"></div>
                </a-card>
            </a-col>

            <a-col :span="12">
                <a-card title="错误率趋势" style="margin-bottom: 16px">
                    <div ref="errorRateRef" style="height: 300px; width: 100%"></div>
                </a-card>
            </a-col>

            <!-- 错误类型分布和响应时间分布 -->
            <a-col :span="12">
                <a-card title="错误类型分布" style="margin-bottom: 16px">
                    <div ref="errorTypeRef" style="height: 300px; width: 100%"></div>
                </a-card>
            </a-col>

            <a-col :span="12">
                <a-card title="响应时间分布" style="margin-bottom: 16px">
                    <div ref="responseTimeDistRef" style="height: 300px; width: 100%"></div>
                </a-card>
            </a-col>

            <!-- 并发量趋势和客户端分布 -->
            <a-col :span="12">
                <a-card title="并发量趋势" style="margin-bottom: 16px">
                    <div ref="concurrencyRef" style="height: 300px; width: 100%"></div>
                </a-card>
            </a-col>

            <a-col :span="12">
                <a-card title="客户端分布" style="margin-bottom: 16px">
                    <div ref="clientDistRef" style="height: 300px; width: 100%"></div>
                </a-card>
            </a-col>

            <!-- 调用量按小时分布和地域分布 -->
            <a-col :span="12">
                <a-card title="调用量按小时分布" style="margin-bottom: 16px">
                    <div ref="hourlyDistRef" style="height: 300px; width: 100%"></div>
                </a-card>
            </a-col>

            <a-col :span="12">
                <a-card title="地域分布" style="margin-bottom: 16px">
                    <div ref="regionDistRef" style="height: 300px; width: 100%"></div>
                </a-card>
            </a-col>

            <!-- 费用趋势和费用按API分布 -->
            <a-col :span="12">
                <a-card title="费用趋势" style="margin-bottom: 16px">
                    <div ref="costTrendRef" style="height: 300px; width: 100%"></div>
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

// 时间范围
const timeRange = ref<string>('7d')

// 根据时间范围生成时间数据
const generateTimeData = () => {
    const data = []
    const now = new Date()
    let count = 7
    let format = 'MM-DD'
    
    if (timeRange.value === '1h') {
        count = 12
        format = 'HH:mm'
        for (let i = count - 1; i >= 0; i--) {
            const date = new Date(now)
            date.setMinutes(date.getMinutes() - i * 5)
            data.push(date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }))
        }
    } else if (timeRange.value === '24h') {
        count = 24
        format = 'HH:00'
        for (let i = count - 1; i >= 0; i--) {
            const date = new Date(now)
            date.setHours(date.getHours() - i)
            data.push(date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }))
        }
    } else if (timeRange.value === '7d') {
        count = 7
        for (let i = count - 1; i >= 0; i--) {
            const date = new Date(now)
            date.setDate(date.getDate() - i)
            data.push(date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }))
        }
    } else if (timeRange.value === '30d') {
        count = 30
        for (let i = count - 1; i >= 0; i--) {
            const date = new Date(now)
            date.setDate(date.getDate() - i)
            data.push(date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }))
        }
    }
    
    return data
}

// 时间范围变化处理
const handleTimeRangeChange = () => {
    // 重新生成图表数据
    // 这里可以触发数据重新加载
}

const generateRandomData = (count: number, min: number, max: number) => {
    return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min)
}

const timeLabels = computed(() => generateTimeData())

// 请求次数趋势图
const requestTrendOptions = computed(() => ({
    tooltip: {
        trigger: 'axis',
    },
    legend: {
        data: ['总请求数', '成功请求', '失败请求'],
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
        data: timeLabels.value,
    },
    yAxis: {
        type: 'value',
    },
    series: [
        {
            name: '总请求数',
            type: 'line',
            data: generateRandomData(timeLabels.value.length, 1000, 5000),
            smooth: true,
            itemStyle: { color: '#1890ff' },
        },
        {
            name: '成功请求',
            type: 'line',
            data: generateRandomData(timeLabels.value.length, 800, 4500),
            smooth: true,
            itemStyle: { color: '#52c41a' },
        },
        {
            name: '失败请求',
            type: 'line',
            data: generateRandomData(timeLabels.value.length, 50, 500),
            smooth: true,
            itemStyle: { color: '#ff4d4f' },
        },
    ],
}))

// 状态码分布饼图
const statusCodeOptions = computed(() => ({
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
        orient: 'vertical',
        left: 'left',
    },
    series: [
        {
            name: '状态码',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2,
            },
            label: {
                show: false,
                position: 'center',
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '20',
                    fontWeight: 'bold',
                },
            },
            labelLine: {
                show: false,
            },
            data: [
                { value: 12580, name: '200 OK', itemStyle: { color: '#52c41a' } },
                { value: 320, name: '400 Bad Request', itemStyle: { color: '#faad14' } },
                { value: 150, name: '401 Unauthorized', itemStyle: { color: '#ff4d4f' } },
                { value: 80, name: '403 Forbidden', itemStyle: { color: '#ff7875' } },
                { value: 50, name: '500 Server Error', itemStyle: { color: '#cf1322' } },
            ],
        },
    ],
}))

// 接口调用TOP10柱状图
const top10Options = computed(() => ({
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
            name: '调用次数',
            type: 'bar',
            data: [4520, 3800, 3200, 2800, 2500, 2200, 1800, 1500, 1200, 980],
            itemStyle: {
                color: '#1890ff',
            },
        },
    ],
}))

// 响应时间趋势图
const responseTimeOptions = computed(() => ({
    tooltip: {
        trigger: 'axis',
    },
    legend: {
        data: ['平均响应时间', 'P95响应时间', 'P99响应时间'],
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
        data: timeLabels.value,
    },
    yAxis: {
        type: 'value',
        name: '时间(ms)',
    },
    series: [
        {
            name: '平均响应时间',
            type: 'line',
            data: generateRandomData(timeLabels.value.length, 50, 200),
            smooth: true,
            itemStyle: { color: '#1890ff' },
        },
        {
            name: 'P95响应时间',
            type: 'line',
            data: generateRandomData(timeLabels.value.length, 100, 400),
            smooth: true,
            itemStyle: { color: '#faad14' },
        },
        {
            name: 'P99响应时间',
            type: 'line',
            data: generateRandomData(timeLabels.value.length, 200, 800),
            smooth: true,
            itemStyle: { color: '#ff4d4f' },
        },
    ],
}))

// 错误率趋势图
const errorRateOptions = computed(() => ({
    tooltip: {
        trigger: 'axis',
        formatter: '{b}<br/>{a}: {c}%',
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
        data: timeLabels.value,
    },
    yAxis: {
        type: 'value',
        name: '错误率(%)',
        max: 10,
    },
    series: [
        {
            name: '错误率',
            type: 'line',
            data: generateRandomData(timeLabels.value.length, 1, 8).map(v => (v / 10).toFixed(2)),
            smooth: true,
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
            itemStyle: { color: '#ff4d4f' },
        },
    ],
}))

// 错误类型分布饼图
const errorTypeOptions = computed(() => ({
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
    },
    series: [
        {
            name: '错误类型',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2,
            },
            label: {
                show: false,
                position: 'center',
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '16',
                    fontWeight: 'bold',
                },
            },
            labelLine: {
                show: false,
            },
            data: [
                { value: 120, name: '超时错误', itemStyle: { color: '#ff4d4f' } },
                { value: 80, name: '参数错误', itemStyle: { color: '#faad14' } },
                { value: 50, name: '认证失败', itemStyle: { color: '#ff7875' } },
                { value: 20, name: '服务器错误', itemStyle: { color: '#cf1322' } },
            ],
        },
    ],
}))

// 响应时间分布直方图
const responseTimeDistOptions = computed(() => ({
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
        data: ['0-50ms', '50-100ms', '100-200ms', '200-500ms', '500-1000ms', '>1000ms'],
    },
    yAxis: {
        type: 'value',
        name: '请求数',
    },
    series: [
        {
            name: '请求数',
            type: 'bar',
            data: [3200, 5800, 2800, 800, 200, 50],
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        { offset: 0, color: '#1890ff' },
                        { offset: 1, color: '#40a9ff' },
                    ],
                },
            },
        },
    ],
}))

// 并发量趋势图
const concurrencyOptions = computed(() => ({
    tooltip: {
        trigger: 'axis',
    },
    legend: {
        data: ['当前并发', '最大并发'],
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
        data: timeLabels.value,
    },
    yAxis: {
        type: 'value',
        name: '并发数',
    },
    series: [
        {
            name: '当前并发',
            type: 'line',
            data: generateRandomData(timeLabels.value.length, 50, 300),
            smooth: true,
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
            itemStyle: { color: '#1890ff' },
        },
        {
            name: '最大并发',
            type: 'line',
            data: generateRandomData(timeLabels.value.length, 200, 500),
            smooth: true,
            itemStyle: { color: '#ff4d4f' },
            lineStyle: {
                type: 'dashed',
            },
        },
    ],
}))

// 客户端分布饼图
const clientDistOptions = computed(() => ({
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
    },
    series: [
        {
            name: '客户端',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2,
            },
            label: {
                show: false,
                position: 'center',
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '16',
                    fontWeight: 'bold',
                },
            },
            labelLine: {
                show: false,
            },
            data: [
                { value: 5200, name: 'Web客户端', itemStyle: { color: '#1890ff' } },
                { value: 3800, name: '移动端', itemStyle: { color: '#52c41a' } },
                { value: 2500, name: '服务端SDK', itemStyle: { color: '#faad14' } },
                { value: 1350, name: '第三方集成', itemStyle: { color: '#722ed1' } },
            ],
        },
    ],
}))

// 调用量按小时分布柱状图
const hourlyDistOptions = computed(() => ({
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
        name: '调用量',
    },
    series: [
        {
            name: '调用量',
            type: 'bar',
            data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 2000) + 500),
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        { offset: 0, color: '#52c41a' },
                        { offset: 1, color: '#73d13d' },
                    ],
                },
            },
        },
    ],
}))

// 地域分布柱状图
const regionDistOptions = computed(() => ({
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
    },
    yAxis: {
        type: 'category',
        data: ['华东', '华北', '华南', '西南', '华中', '西北', '东北'],
    },
    series: [
        {
            name: '调用量',
            type: 'bar',
            data: [4520, 3800, 3200, 2800, 2500, 1800, 1200],
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [
                        { offset: 0, color: '#722ed1' },
                        { offset: 1, color: '#9254de' },
                    ],
                },
            },
        },
    ],
}))

// 费用趋势图
const costTrendOptions = computed(() => ({
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
        data: timeLabels.value,
    },
    yAxis: {
        type: 'value',
        name: '费用(¥)',
    },
    series: [
        {
            name: '累计费用',
            type: 'line',
            data: generateRandomData(timeLabels.value.length, 800, 1500).map(v => v / 10),
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
            data: generateRandomData(timeLabels.value.length, 100, 300).map(v => v / 10),
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
            data: [285.60, 240.80, 198.50, 165.20, 142.30, 128.90, 115.60, 98.40, 85.20, 72.10],
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

// 图表实例引用
const requestTrendRef = ref<HTMLElement>()
const statusCodeRef = ref<HTMLElement>()
const top10Ref = ref<HTMLElement>()
const responseTimeRef = ref<HTMLElement>()
const errorRateRef = ref<HTMLElement>()
const errorTypeRef = ref<HTMLElement>()
const responseTimeDistRef = ref<HTMLElement>()
const concurrencyRef = ref<HTMLElement>()
const clientDistRef = ref<HTMLElement>()
const hourlyDistRef = ref<HTMLElement>()
const regionDistRef = ref<HTMLElement>()
const costTrendRef = ref<HTMLElement>()
const costByApiRef = ref<HTMLElement>()

// 图表实例
let requestTrendChart: echarts.ECharts | null = null
let statusCodeChart: echarts.ECharts | null = null
let top10Chart: echarts.ECharts | null = null
let responseTimeChart: echarts.ECharts | null = null
let errorRateChart: echarts.ECharts | null = null
let errorTypeChart: echarts.ECharts | null = null
let responseTimeDistChart: echarts.ECharts | null = null
let concurrencyChart: echarts.ECharts | null = null
let clientDistChart: echarts.ECharts | null = null
let hourlyDistChart: echarts.ECharts | null = null
let regionDistChart: echarts.ECharts | null = null
let costTrendChart: echarts.ECharts | null = null
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
watch(() => requestTrendOptions.value, (options) => {
    if (requestTrendRef.value) {
        requestTrendChart = initChart(requestTrendRef.value, requestTrendChart, options)
    }
}, { immediate: true, deep: true })

watch(() => statusCodeOptions.value, (options) => {
    if (statusCodeRef.value) {
        statusCodeChart = initChart(statusCodeRef.value, statusCodeChart, options)
    }
}, { immediate: true, deep: true })

watch(() => top10Options.value, (options) => {
    if (top10Ref.value) {
        top10Chart = initChart(top10Ref.value, top10Chart, options)
    }
}, { immediate: true, deep: true })

watch(() => responseTimeOptions.value, (options) => {
    if (responseTimeRef.value) {
        responseTimeChart = initChart(responseTimeRef.value, responseTimeChart, options)
    }
}, { immediate: true, deep: true })

watch(() => errorRateOptions.value, (options) => {
    if (errorRateRef.value) {
        errorRateChart = initChart(errorRateRef.value, errorRateChart, options)
    }
}, { immediate: true, deep: true })

watch(() => errorTypeOptions.value, (options) => {
    if (errorTypeRef.value) {
        errorTypeChart = initChart(errorTypeRef.value, errorTypeChart, options)
    }
}, { immediate: true, deep: true })

watch(() => responseTimeDistOptions.value, (options) => {
    if (responseTimeDistRef.value) {
        responseTimeDistChart = initChart(responseTimeDistRef.value, responseTimeDistChart, options)
    }
}, { immediate: true, deep: true })

watch(() => concurrencyOptions.value, (options) => {
    if (concurrencyRef.value) {
        concurrencyChart = initChart(concurrencyRef.value, concurrencyChart, options)
    }
}, { immediate: true, deep: true })

watch(() => clientDistOptions.value, (options) => {
    if (clientDistRef.value) {
        clientDistChart = initChart(clientDistRef.value, clientDistChart, options)
    }
}, { immediate: true, deep: true })

watch(() => hourlyDistOptions.value, (options) => {
    if (hourlyDistRef.value) {
        hourlyDistChart = initChart(hourlyDistRef.value, hourlyDistChart, options)
    }
}, { immediate: true, deep: true })

watch(() => regionDistOptions.value, (options) => {
    if (regionDistRef.value) {
        regionDistChart = initChart(regionDistRef.value, regionDistChart, options)
    }
}, { immediate: true, deep: true })

watch(() => costTrendOptions.value, (options) => {
    if (costTrendRef.value) {
        costTrendChart = initChart(costTrendRef.value, costTrendChart, options)
    }
}, { immediate: true, deep: true })

watch(() => costByApiOptions.value, (options) => {
    if (costByApiRef.value) {
        costByApiChart = initChart(costByApiRef.value, costByApiChart, options)
    }
}, { immediate: true, deep: true })

// 窗口resize处理
const handleResize = () => {
    requestTrendChart?.resize()
    statusCodeChart?.resize()
    top10Chart?.resize()
    responseTimeChart?.resize()
    errorRateChart?.resize()
    errorTypeChart?.resize()
    responseTimeDistChart?.resize()
    concurrencyChart?.resize()
    clientDistChart?.resize()
    hourlyDistChart?.resize()
    regionDistChart?.resize()
    costTrendChart?.resize()
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
        if (requestTrendRef.value) {
            requestTrendChart = initChart(requestTrendRef.value, requestTrendChart, requestTrendOptions.value)
            if (requestTrendChart) setupResizeObserver(requestTrendRef.value, requestTrendChart)
        }
        if (statusCodeRef.value) {
            statusCodeChart = initChart(statusCodeRef.value, statusCodeChart, statusCodeOptions.value)
            if (statusCodeChart) setupResizeObserver(statusCodeRef.value, statusCodeChart)
        }
        if (top10Ref.value) {
            top10Chart = initChart(top10Ref.value, top10Chart, top10Options.value)
            if (top10Chart) setupResizeObserver(top10Ref.value, top10Chart)
        }
        if (responseTimeRef.value) {
            responseTimeChart = initChart(responseTimeRef.value, responseTimeChart, responseTimeOptions.value)
            if (responseTimeChart) setupResizeObserver(responseTimeRef.value, responseTimeChart)
        }
        if (errorRateRef.value) {
            errorRateChart = initChart(errorRateRef.value, errorRateChart, errorRateOptions.value)
            if (errorRateChart) setupResizeObserver(errorRateRef.value, errorRateChart)
        }
        if (errorTypeRef.value) {
            errorTypeChart = initChart(errorTypeRef.value, errorTypeChart, errorTypeOptions.value)
            if (errorTypeChart) setupResizeObserver(errorTypeRef.value, errorTypeChart)
        }
        if (responseTimeDistRef.value) {
            responseTimeDistChart = initChart(responseTimeDistRef.value, responseTimeDistChart, responseTimeDistOptions.value)
            if (responseTimeDistChart) setupResizeObserver(responseTimeDistRef.value, responseTimeDistChart)
        }
        if (concurrencyRef.value) {
            concurrencyChart = initChart(concurrencyRef.value, concurrencyChart, concurrencyOptions.value)
            if (concurrencyChart) setupResizeObserver(concurrencyRef.value, concurrencyChart)
        }
        if (clientDistRef.value) {
            clientDistChart = initChart(clientDistRef.value, clientDistChart, clientDistOptions.value)
            if (clientDistChart) setupResizeObserver(clientDistRef.value, clientDistChart)
        }
        if (hourlyDistRef.value) {
            hourlyDistChart = initChart(hourlyDistRef.value, hourlyDistChart, hourlyDistOptions.value)
            if (hourlyDistChart) setupResizeObserver(hourlyDistRef.value, hourlyDistChart)
        }
        if (regionDistRef.value) {
            regionDistChart = initChart(regionDistRef.value, regionDistChart, regionDistOptions.value)
            if (regionDistChart) setupResizeObserver(regionDistRef.value, regionDistChart)
        }
        if (costTrendRef.value) {
            costTrendChart = initChart(costTrendRef.value, costTrendChart, costTrendOptions.value)
            if (costTrendChart) setupResizeObserver(costTrendRef.value, costTrendChart)
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
    requestTrendChart?.dispose()
    statusCodeChart?.dispose()
    top10Chart?.dispose()
    responseTimeChart?.dispose()
    errorRateChart?.dispose()
    errorTypeChart?.dispose()
    responseTimeDistChart?.dispose()
    concurrencyChart?.dispose()
    clientDistChart?.dispose()
    hourlyDistChart?.dispose()
    regionDistChart?.dispose()
    costTrendChart?.dispose()
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
.api-metrics-container {
    padding: 16px;
}
</style>
