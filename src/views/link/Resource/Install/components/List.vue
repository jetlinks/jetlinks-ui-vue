<template>
    <div style="margin-top: 10px; max-height: 500px; min-height: 400px; overflow-y: auto">
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
                            <a-button @click="() => removeFile(index)"
                                >移除</a-button
                            >
                        </template>
                    </div>
                </div>
                <a-divider />
                <div class="fileInfoFooter">
                    <div class="install_container">
                        <a-badge status="default" />
                        <div class="installStatue">
                            {{ computedVersion(i) }}
                        </div>
                        <div v-if="resourceVersionMap.has(i.resourcesId)">
                            (当前版本:V{{
                                resourceVersionMap.get(i.resourcesId)
                            }})
                        </div>
                    </div>
                    <div class="description">
                        {{ i?.describe }}
                    </div>
                </div>
            </div>
        </div>
    </div>
  <a-divider />
  <div style="display: flex; justify-content: center; margin-top: 8px;">
    <a-space>
      <a-button @click="emits('cancel')">取消</a-button>
      <a-button @click="onInstall" type="primary">全部安装</a-button>
    </a-space>
  </div>
</template>

<script setup>
import {
    _queryTemplateNoPaging,
    installResource,
} from '@/api/link/resource';
import { cloneDeep } from 'lodash-es';

const props = defineProps({
    value: {
        type: Array,
        default: [],
    },
    source:{
        type:String,
        default: ''
    }
});
const emits = defineEmits(['update:value', 'cancel', 'refresh']);
const resourceVersionMap = ref(new Map());
const fileList = ref([]);
const status = new Map();
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
    emits('update:value', fileList.value);
};

const onInstall = async () => {
  const res = await installResource({
    type: props.source,
    resourceDetails: fileList.value.map((i) => {
      return {
        releaseDetail: i,
      };
    }),
  })
  if (res.success) {
    emits('refresh');
  }
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
    () => props.value,
    () => {
        fileList.value = cloneDeep(props.value);
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
