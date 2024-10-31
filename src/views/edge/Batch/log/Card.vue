<template>
  <div class="log-card-item-warp" @click="emit('click')">

    <div class="content">
      <div class="item-body">
        <div class="body-header">
          <div class="header-title">
             
              <j-ellipsis> {{ detail.name  }}</j-ellipsis>
          </div>
          <div class="header-status bg-color-200">
            <BadgeStatus
              :text="detail.state.text"
              :status="detail.state.value"
              :statusNames="{
                ...colorMap,
                'running': 'primary'
              }"
            />
          </div>
          <div class="header-action">
            <a-dropdown>
              <a-button type="text">
                <template #icon>
                  <AIcon type="EllipsisOutlined" />
                </template>
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item >
                    <PermissionButton
                      style="width: 100%;text-align: left;"
                      type="text"
                      @click="onCopy"
                    >
                      从相同设备创建任务
                    </PermissionButton>

                  </a-menu-item>
                  <a-menu-item :disabled="detail.state.value === 'running'">
                    <PermissionButton
                      style="width: 100%;text-align: left;"
                      danger
                      :tooltip="{
                        title:
                            detail.state.value === 'running'
                                ? '任务进行不可删除'
                                : '',
                      }"
                      type="text"
                      :popConfirm="{
                        title: '确认删除?',
                        onConfirm: async () => {
                            onDelete();
                        },
                    }"
                      :disabled="detail.state.value === 'running'"
                    >
                      删除任务
                    </PermissionButton>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>
        <div class="body-detail">
          <div class="detail-desc">
            <div class="detail-title text-color-500">说明</div>
            <div class="detail-value text-color-600">
              <j-ellipsis>{{ detail.description || '--'}}</j-ellipsis>
            </div>
          </div>
          <div class="detail-time">
            <div class="detail-title text-color-500">时间</div>
            <div class="detail-value text-color-600">{{ dayjs(detail.createTime).format('YYYY-MM-DD HH:mm:ss')}}</div>
          </div>
        </div>
        <div class="body-count bg-color-200">
          <div>
            <a-space>
              <Icon type="icon-shebei" style="font-size: 16px" />
              <label class="text-color-500">网关数量</label>
              <span class="text-color-900">{{ detail.thingTotal }}</span>
            </a-space>
          </div>
          <div>
            <a-space>
              <Icon type="icon-chajianbao" style="font-size: 16px" />
              <label class="text-color-500">插件数量</label>
              <span class="text-color-900">{{ detail.thingTotal }}</span>
            </a-space>
          </div>
        </div>
        <div class="body-progress">
          <div class="progress--warp bg-color-200">
            <div v-for="item in options" :style="{ width: item.per + '%', background: item.bgc }"></div>
          </div>
        </div>
        <div class="body-status">
          <div v-for="item in options" class="status-item">
            <Icon :type="item.icon" :style="{color: item.color}" />
            <label>
              {{ item.label}}
            </label>
            <span>
              {{ item.value }}
            </span>
          </div>
          <div class="status-item last-item">
            <label>
              任务总数
            </label>
            <span class="text-color-900">
              {{ taskTotal }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="LogCard">
import {getContext} from "../util";
import dayjs from 'dayjs'
import Icon from '../components/Icon.vue'
import {deleteAllTask} from "@/api/edge/batch";

const props = defineProps({
  detail: {
    type: Object,
    default: () => ({})
  },
  type: {
    type: String,
    default: undefined
  },
})

const emit = defineEmits(['reload','click'])

const context = getContext()
const colorMap = {
  'success': 'success',
  'complete': 'success',
  'running': 'warning',
  'incomplete': 'warning',
  'failed': 'error',
  'waiting': 'primary'
}

const iconMap = {
  'success': 'CheckCircleFilled',
  'running': 'ClockCircleFilled',
  'failed': 'InfoCircleFilled',
  'canceled': 'PauseCircleFilled',
  'waiting': 'icon-paiduizhong',
}



const taskTotal = computed(() => {
  return props.detail.stateCount?.reduce((prev, next) => prev + next.total, 0) || 0
})

const options = computed(() => {

  return props.detail.stateCount?.map(item => {
    const per = taskTotal.value ? Math.round(parseFloat(item.total / taskTotal.value) * 100) : 0 ; // 单个进度比例
    const key = colorMap[item.state.value]
    return {
      label: item.state.text,
      type: item.state.value,
      value: item.total,
      icon: iconMap[item.state.value],
      per: key ? per : 0,
      bgc: key ? `var(--ant-${key}-color)` : 'transparent',
      color: key ? `var(--ant-${key}-color)` : '#646C73',
    }
  }) || []
})




const onCopy = () => {
  context.openTask({
    thingList: (props.detail.others?.thingList || []).map(item => ({
      ...item,
      label: item.name || item.thingName,
      value: item.id || item.thingId
    })),
    jobType: props.type
  })
}

const onDelete = async () => {
  const resp = await deleteAllTask(props.detail.id)
  if (resp.success) {
    emit('reload')
  }
}
</script>

<style scoped lang="less">
.log-card-item-warp {
  background-color: @font-gray-50;
  border: 1px solid @font-gray-200;
  border-radius: 6px;
  width: 100%;

  .content {
    padding: 16px;

    .body-header {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
      align-items: center;

      .header-title {
        font-size: 16px;
        color: @font-gray-900;
        font-weight: 500;
        max-width:550px;
      }

      .header-status {
        padding: 2px 8px;
        border-radius: 4px;
      }

      .header-action {
        margin-left: auto;
      }
    }

    .body-detail {
      display: flex;
      gap: 32px;
      margin-bottom: 16px;

      .detail-desc {
        display: flex;
        width: 66.66%;
      }

      .detail-time {
        display: flex;
        width: 33.33%;
      }

      .detail-title {
        width: 40px;

      }

      .detail-value {
        flex: 1 1 0;
        min-width: 0;

      }
    }

    .body-count {
      margin-bottom: 16px;
      display: flex;
      padding: 8px 24px;
      border-radius: 6px;

      >div {
        flex: 1;
        min-width: 0;
      }
    }

    .body-progress {
      margin-bottom: 12px;
    }

    .body-status {
      display: flex;
      .status-item {
        width: 120px;
        display: flex;
        gap: 12px;
        align-items: center;
      }

      .last-item {
        margin-left: auto;
      }
    }

    .progress--warp {
      height: 6px;
      position: relative;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
    }
  }
}
</style>
