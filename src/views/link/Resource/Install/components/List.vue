<template>
  <div>
    <div v-for="(i, index) in fileList" class="fileList">
      <img
          :src="i.img"
          alt=""
          style="width: 80px; height: 80px; margin-right: 16px"
      />
      <div style="width: calc(100% - 80px)">
        <div class="fileInfoHeader">
          <div>
            <div>
              {{ i?.resourcesName }}
              <span class="fileType">
                            {{ i?.resourcesType?.text }}
                        </span>
            </div>
            <div>
              {{ 'v' + i?.version }}
            </div>
          </div>
          <div class="control">
            <template v-if="!status.get(i.resourcesId)">
              <a-button @click="() => removeFile(index)">移除</a-button>
            </template>
            <div v-else>
              <template v-if="true">
                <AIcon type="CheckCircleFilled" style="color:#20b759" class="listIcon"/>
                <a-button>查看详情</a-button>
              </template>
              <template v-if="false">
                <AIcon type="ToolOutlined" class="listIcon"/>
                <a-button>暂停</a-button>
              </template>
              <template v-if="false">
                <AIcon type="PauseCircleOutlined" class="listIcon"/>
                <a-button>开始</a-button>
              </template>
              <template v-if="false">
                <AIcon type="LoadingOutlined" class="listIcon"/>
                <a-button>移除</a-button>
              </template>
              <template v-if="false">
                <AIcon type="InfoCircleOutlined" class="listIcon"/>
                <a-button>重装</a-button>
              </template>
            </div>
          </div>
        </div>
        <a-divider/>
        <div class="fileInfoFooter">
          <div class="install_container">
            <a-badge status="default"/>
            <div class="installStatue">{{ computedVersion(i) }}</div>
            <div v-if="resourceVersionMap.has(i.resourcesId)">
              (当前版本:V{{ resourceVersionMap.get(i.resourcesId) }})
            </div>
          </div>
          <div class="description">
            {{ i?.describe }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {_queryTemplateNoPaging, installResource, queryTaskListNoPaging} from '@/api/link/resource';
import {cloneDeep} from 'lodash-es';
import {defineExpose} from 'vue';
import {getWebSocket} from "@/utils/websocket";

const props = defineProps({
  data: {
    type: Array,
    default: [],
  },
  installType: {
    type: String,
    default: '',
  },
});
const fileList = ref([]);
const resourceVersionMap = ref(new Map());
let wsRef = null
const status = new Map()
const taskList = ref([])
const computedVersion = (data) => {
  if (resourceVersionMap.value.has(data.resourcesId)) {
    return resourceVersionMap.value.get(data.resourcesId) === data.version
        ? '同版本覆盖'
        : '版本更新';
  } else {
    return '首次安装';
  }
};

const removeFile = (index) => {
  fileList.value.splice(index, 1);
};

const installTask = () => {
  wsRef = getWebSocket(
      `resources-install-state-subscriber`,
      `/resources/install/*`,
      {},
  ).subscribe((resp) => {
    if (resp.payload?.taskId) {
      status.set(resp.payload.taskId, resp.payload)
    }
    console.log(status)
  });
}

const onInstall = async () => {
  return new Promise(async (resolve) => {
    const res = await installResource({
      type: props.installType,
      resourceDetails: fileList.value.map(i => {
        return {
          releaseDetail: i
        }
      }),
    }).catch(() => {
      resolve(false)
    })
    if (res.success) {
      const resp = await queryTaskListNoPaging({
        "terms": [
          {
            "column": "state",
            "termType": "not",
            "value": "success"
          }
        ]
      })
      if (resp.success) {
        taskList.value = resp.result
        status.clear()
        installTask()
        resolve(true)
      }
    } else {
      resolve(false)
    }
  })
};

const getVersion = async (ids) => {
  const params = {
    paging: false,
    terms: [
      {
        terms: [
          {
            type: 'or',
            value: ids,
            termType: 'in',
            column: 'id',
          },
        ],
      },
    ],
  };
  const res = await _queryTemplateNoPaging(params);
  if (res.success) {
    res.result.forEach((i) => {
      resourceVersionMap.value.set(i.id, i.version);
    });
  }
};

watch(
    () => props.data,
    () => {
      fileList.value = cloneDeep(props.data);
      resourceVersionMap.value.clear();
      const resourceIds = props.data?.map((i) => {
        return i.resourcesId;
      });
      getVersion(resourceIds);
    },
    {
      deep: true,
      immediate: true,
    },
);

defineExpose({onInstall})
</script>
<style lang="less" scoped>
.fileList {
  display: flex;
  margin-bottom: 16px;
  text-align: start;
  background-color: rgb(242, 242, 242);
  padding: 8px;
  border-radius: 8px;

  .fileInfoHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .fileType {
      background-color: rgb(206, 234, 214);
      margin-left: 6px;
      padding: 0 6px;
      border-radius: 6px;
      color: rgb(23, 129, 60);
    }
  }

  .fileInfoFooter {
    color: #878787;
    font-size: 12px;

    .install_container {
      display: flex;
      vertical-align: middle;

      .installStatue {
        color: black;
        margin-right: 6px;
      }
    }
  }
}
</style>
