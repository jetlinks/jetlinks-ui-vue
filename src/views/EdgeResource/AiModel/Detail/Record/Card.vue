<template>
    <div class="log-card-item-warp">
        <div class="progress--warp" :style="progressStyles">
        </div>
        <div class="content">
            <div class="img">
                <img />
            </div>
            <div class="item-body" style="flex: 1">
                <div class="body-title">
                    {{ detail.name || '测试内容' }}
                </div>
                <div class="body-detail">
                    <StatusInfo
                        :success="addUnit(detail.successRatio)"
                        :failed="addUnit(detail.failedRatio)"
                        :processing="addUnit(detail.processingRatio)"
                        :waiting="addUnit(detail.waitingRatio)"
                    />
                    <div class="detail-item">
                        <label>创建时间</label>
                        <div>{{ dayjs(detail.createTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
                    </div>
                </div>
            </div>
            <div class="item-action">
                <a-tooltip title="详情">
                    <a-button type="text" @click="visible = true" >
                        <template #icon>
                            <AIcon type="EyeOutlined" />
                        </template>
                    </a-button>
                </a-tooltip>
            </div>
        </div>
    </div>
    <Detail
        v-if="visible"
        :id="detail.id"
        :record="detail"
        @cancel="visible = false"
        @showTaskDetail="showTaskDetail"
        @copy="onCopy"
        @reload="onReload"
    />
<!--    <TaskDetail-->
<!--        v-if="taskDetail.visible"-->
<!--        @closeDetail="taskDetailClose"-->
<!--    />-->
</template>

<script setup name="LogCard">
import dayjs from 'dayjs';
import Detail from './Detail.vue';
import StatusInfo from "./StatusInfo.vue";
// import TaskDetail from "./TaskDetail.vue";
// import {getContext} from "../util";

const emit = defineEmits(['reload']);
const props = defineProps({
    detail: {
        type: Object,
        default: () => ({})
    }
})

const visible = ref(false)
// const context = getContext()

const taskDetail = reactive({
    visible: false,
    detail: undefined
})

const addUnit = (val) => {
    return val + '%'
}

const progressStyles = computed(() => {
    const value = {
        'success': props.detail.successRatio,
        'warning': props.detail.processingRatio + props.detail.waitingRatio,
        'error': props.detail.failedRatio,
    }

    const bgi = Object.keys(value).reduce((prev, key, index) => {
        const v = Object.values(value).splice(0, index + 1).reduce((a, b) => a + b, 0)
        prev += `var(--ant-${key}-color) 0, var(--ant-${key}-color) ${v}%,`
        return prev
    }, '')

    return {
        'background-image': 'linear-gradient(90deg,' + bgi + '#EFF0F1 0, #EFF0F1 100%)'
    }
})

const showTaskDetail = (record) => {
    taskDetail.detail = record
    taskDetail.visible = true
}

const taskDetailClose = () => {
    taskDetail.detail = undefined
    taskDetail.visible = false
}

const onCopy = () => {
    // context.openTask({
    //     gateway: []
    // })
}

const onReload = () => {
    emit('reload');
}
</script>

<style scoped lang="less">
.log-card-item-warp {
    width: 100%;
    background-color: @font-gray-50;
    border: 1px solid @font-gray-200;
    border-radius: 6px;

    .progress--warp {
        height: 4px;
        position: relative;
    }

    .content {
        padding: 16px;
        display: flex;
        gap: 16px;

        .img {
            width: 40px;
            height: 40px;
            border-radius: 6px;
            overflow: hidden;
        }

        .body-title {
            font-size: 16px;
        }

        .body-detail {
            display: flex;
            gap: 50px;

            .detail-item {
                display: flex;
                gap: 12px;

                >label {
                    color: @font-gray-500;
                }

                >span {
                    color: @font-gray-600;
                }
            }
        }

        .item-action {
            width: 50px;
            margin-left: auto;
            align-items: center;
            display: flex;
            font-size: 24px;
        }

    }
}
</style>
