<template>
    <a-drawer
        open
        :title="$t('Task.index.219743-0')"
        placement="right"
        :width="700"
        :closable="false"
        @close="$emit('closeDrawer')"
    >
        <template #extra>
            <j-permission-button
                v-if="!props?.showPosition"
                type="primary"
                hasPermission="device/Firmware:add"
                @click="handleAdd"
            >
                {{ $t('Task.index.219743-1') }}
            </j-permission-button>
        </template>
        <div class="search-box">
            <a-space>
                <a-select
                    v-model:value="searchItem.state"
                    :options="stateOptions"
                    style="width: 100px;text-align: left;"
                />
                <a-input-search v-model:value="searchItem.name" allow-clear :placeholder="$t('Save.index.646914-6')" @search="handleSearch"></a-input-search>
            </a-space>
        </div>
        <div v-for="item in taskList" class="log-card-item-warp" :key="item.id" @click="taskDetail(item)">
          <div class="content">
            <div class="item-body">
              <div class="body-header">
                <a-space>
                  <div class="header-title">
                    <j-ellipsis>
                      {{ item.name || '--' }}
                    </j-ellipsis>
                  </div>
                  <div class="header-status bg-color-200">
                    <j-badge-status
                      :text="item.state?.text"
                      :status="item.state?.value"
                      :statusNames="{
                        ...colorMap,
                      }"
                    ></j-badge-status>
                  </div>
                </a-space>
                <a-space>
                  <div>
                    {{ dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') }}
                  </div>
                  <a-dropdown v-if="['firmware', 'product'].includes(type)">
                    <a-button type="text">
                      <AIcon type="EllipsisOutlined"></AIcon>
                    </a-button>
                    <template #overlay>
                      <a-menu>
                        <a-menu-item>
                          <j-permission-button
                            type="link"
                            :disabled="item.waiting || item.processing"
                            danger block
                            :popConfirm="{
                              title: $t('Instance.index.133466-3'),
                              onConfirm: () => {
                                handleDeleteTask(item.id)
                              }
                            }"
                            hasPermission="device/Firmware:update"
                          >{{ $t('Save.index.646914-24') }}</j-permission-button>
                        </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
                </a-space>
              </div>
              <div class="body-detail">
                <div class="detail-desc">
                  <div class="detail-value text-color-600">
                    <j-ellipsis>
                      {{ item.description || '--' }}
                    </j-ellipsis>
                  </div>
                </div>
              </div>
              <div class="body-count bg-color-200">
                <div>
                  <a-space>
                    <AIcon type="icon-chanpin1" style="font-size: 16px"/>
                    <label class="text-color-500">{{ $t('Save.index.646914-7') }}</label>
                    <span class="text-color-900">{{ item.mode?.text }}</span>
                  </a-space>
                </div>
              </div>
              <div class="body-progress">
                <div class="progress--warp bg-color-200">
                  <div v-for="item in options(item)" :class="`progress-item-${item.bgc}`"  :style="{ width: item.per + '%'}" :key="item.type"></div>
                </div>
              </div>
              <div class="body-status">
                <div v-for="item in options(item)" class="status-item" :key="item.type">
                  <AIcon :class="`status-item-${item.color}`" :type="item.icon"></AIcon>
                  <label>
                    {{ item.label }}
                  </label>
                  <span>
                    {{ item.value }}
                  </span>
                </div>
                <div class="status-item last-item">
                  <label>
                    {{ $t('Record.Card.931797-4') }}
                  </label>
                  <span class="text-color-900">
                    {{ item.total }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <JEmpty v-if="taskList.length === 0"></JEmpty>
    </a-drawer>
    <Save
        v-if="visible"
        :data="current"
        :productId="productId"
        :firmwareId="firmwareId"
        @change="saveChange"
    ></Save>
    <TaskDetail
        v-if="detailVisible"
        :taskState="taskState"
        :types="type"
        @close-detail="closeDetail"
        @refresh="queryTaskList"
        @delete="(id) => handleDeleteTask(id)"
        :deviceId="props.deviceId"
        :data="currentTask"
    />
</template>

<script setup name="TaskDrawer">
import { queryTaskPaginateNot, deleteTask } from '../../../../api/firmware';
import Save from './Save/index.vue';
import TaskDetail from './Detail/index.vue';
import { onlyMessage } from '@jetlinks-web-core/utils/comm';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs'

const { t: $t } = useI18n();

const emit = defineEmits(['closeDrawer']);
const props = defineProps({
    firmwareId: {
        type: String,
        default: '',
    },
    productId: {
        type: String,
        default: '',
    },
    showPosition:{
        type:String
    },
    deviceId:{
        type:String
    },
    type: {
        type: String,
        default: 'product',
    }
});

const searchItem = reactive({
    name: '',
    state: 'all',
});

const stateOptions = [
    {
        label: $t('log.index.741299-3'),
        value: 'all',
    },
    {
        label: $t('log.index.741299-7'),
        value: 'waiting',
    },
    {
        label: $t('log.index.741299-4'),
        value: 'successful',
    },
    {
        label: $t('log.index.741299-5'),
        value: 'processing',
    },
    {
        label: $t('log.index.741299-6'),
        value: 'canceled',
    },
];

const colorMap = {
  'waiting': 'primary',
  'processing': 'warning',
  'failed': 'error',
  'success': 'success',
}

const iconMap = {
  'processing': 'ClockCircleFilled',
  'success': 'CheckCircleFilled',
  'canceled': 'PauseCircleFilled',
  'waiting': 'icon-paiduizhong',
  'failed': 'InfoCircleFilled',
}

const taskState = [
  {
    label: $t('Detail.index.805835-20'),
    value:'canceled',
  },
  {
    label: $t('Detail.index.805835-17'),
    value: 'success',
  },
  {
    label: $t('Detail.index.805835-18'),
    value:'failed',
  },
  {
    label: $t('Detail.index.805835-19'),
    value:'processing',
  },
  {
    label: $t('Detail.index.805835-21'),
    value:'waiting',
  },
]

const options = computed(() => {
  return (val) => {
    return taskState.filter(item => {
      return val[item.value]
    }).map(item => {
      return {
        label: item.label,
        type: item.value,
        value: val[item.value],
        icon: iconMap[item.value],
        per: Math.round(parseFloat(val[item.value] / val.total) * 100),
        bgc:  colorMap[item.value],
        color: colorMap[item.value],
        // bgc: `var(--ant-${colorMap[item.value]}-color)`,
        // color: `${colorMap[item.value] ? `var(--ant-${colorMap[item.value]}-color)` : '#646C73'}`
      }
    })
  }
})
const taskList = ref([]);
const params = ref({});
const visible = ref(false);
const detailVisible = ref(false);
const current = ref();
//任务详情传参
const currentTask = ref();
const queryTaskList = async () => {
    const param = {
        paging: false,
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [
            {
                terms: [
                    {
                        column: 'firmwareId',
                        value: props.firmwareId,
                    },
                ],
            },
        ],
    };
    if(params.value.terms?.length){
        param.terms = param.terms.concat(params.value.terms);
    }
    const res = await queryTaskPaginateNot(param);
    if (res.status === 200) {
        if(props?.deviceId){
            console.log(props.deviceId)
            taskList.value = res.result.filter((i)=>{
                return !i?.deviceId ||  i.deviceId.includes(props.deviceId)
            })
        }else{
            taskList.value = res.result;
        }
        if (currentTask.value?.id) {
            currentTask.value = taskList.value.find(
                (i) => i.id === currentTask.value.id,
            );
        }
    }
};

const handleSearch = () => {
    const terms = [];
    if (searchItem.state !== 'all') {
        terms.push({
            column: 'state',
            value: searchItem.state,
            type: 'and',
        });
    }
    if (searchItem.name) {
        terms.push({
            column:'name',
            value: `%${searchItem.name}%`,
            termType: 'like',
        });
    }
    params.value = {
        terms: terms.length ? [
            {
                terms,
                type: 'and',
            },
        ] : undefined,
    };
    queryTaskList();
}
const handleAdd = () => {
    visible.value = true;
    current.value = {};
};
const saveChange = (value) => {
    visible.value = false;
    current.value = {};
    if (value) {
        onlyMessage($t('Task.index.219743-10'), 'success');
        queryTaskList();
    }
};
const taskDetail = (data) => {
    detailVisible.value = true;
    currentTask.value = data;
};

const handleDeleteTask = async (id) => {
    const res = await deleteTask(id);
    if (res.status === 200) {
        detailVisible.value = false;
        onlyMessage($t('Task.index.219743-10'));
        queryTaskList();
    }
};
const closeDetail = () => {
    detailVisible.value = false;
    queryTaskList();
};
onMounted(() => {
    queryTaskList();
});
</script>
<style lang="less" scoped>
.search-box {
  text-align: right;
  margin-bottom: 16px;
}
.task {
    margin-bottom: 20px;
}
.taskTitle {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    .taskTitleLeft,
    .taskTitleRight {
        display: flex;
        line-height: 32px;
    }
    .progress {
        margin-left: 10px;
    }
    .upgradeMode {
        background: #e6f4ff;
        border-radius: 4px;
        border: 1px solid #91caff;
        height: 22px;
        padding: 0 8px;
        color: #1677ff;
        margin-top: 4px;
        line-height: 22px;
    }
    .title {
        font-size: 16px;
        font-weight: 500;
        margin-left: 12px;
        color: #1a1a1a;
        max-width: 300px;
    }
}
.log-card-item-warp {
  background-color: @font-gray-50;
  border: 1px solid @font-gray-200;
  border-radius: 6px;
  width: 100%;
  margin-bottom: 20px;
  cursor: pointer;
  .content {
    padding: 16px;

    .body-header {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
      align-items: center;
      justify-content: space-between;
      .header-title {
        font-size: 16px;
        color: @font-gray-900;
        font-weight: 500;
        max-width: 300px;
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
        gap: 16px;
        width: 66.66%;
      }

      .detail-time {
        display: flex;
        width: 33.33%;
      }

      .detail-title {
        max-width: 60px;
        white-space: nowrap;
        margin-right: 10px;
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

      > div {
        flex: 1;
        min-width: 0;
      }
    }

    .body-progress {
      margin-bottom: 12px;
    }

    .body-status {
      display: flex;
      gap: 16px;
      .status-item {
        display: flex;
        gap: 12px;
        align-items: center;
        .status-item-success {
          color: var(--ant-success-color);
        }
        .status-item-error {
          color: var(--ant-error-color);
        }
        .status-item-primary {
          color: var(--ant-primary-color);
        }
        .status-item-warning {
          color: var(--ant-warning-color);
        }
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
      // background-color: var(--ant-error-color);
      .progress-item-success {
        background-color: var(--ant-success-color);
      }
      .progress-item-error {
        background-color: var(--ant-error-color);
      }
      .progress-item-primary {
        background-color: var(--ant-primary-color);
      }
      .progress-item-warning {
        background-color: var(--ant-warning-color);
      }

    }
  }
}
</style>
