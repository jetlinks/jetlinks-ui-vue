<template>
    <div
        style="
            margin-top: 10px;
            max-height: 500px;
            min-height: 400px;
            overflow-y: auto;
            position: relative;
        "
    >
        <template v-if="fileList.length">
            <div v-for="(i, index) in fileList" class="fileList">
                <img
                    :src="
                        i.photoUrl?.url ||
                        imageMap.get(
                            i.resourcesType?.value ||
                                i.releaseDetail?.resourcesType?.value,
                        )
                    "
                    alt=""
                    style="width: 80px; height: 80px; margin-right: 16px"
                />
                <div style="width: calc(100% - 80px)">
                    <div class="fileInfoHeader">
                        <div>
                            <div>
                                {{
                                    i?.resourcesName ||
                                    i?.releaseDetail?.resourcesName
                                }}
                                <span class="fileType">
                                    {{
                                        i?.resourcesType?.text ||
                                        i?.releaseDetail?.resourcesType?.text
                                    }}
                                </span>
                            </div>
                            <div>
                                {{ i?.version || i?.releaseDetail?.version }}
                            </div>
                        </div>
                        <div class="control">
                            <a-button @click.stop="() => removeFile(index)"
                                >移除</a-button
                            >
                        </div>
                    </div>
                    <a-divider />
                    <div class="fileInfoFooter">
                        <div class="install_container">
                            <a-badge status="default" />
                            <div class="installStatue">
                                {{ computedVersion(resourceVersionMap, i) }}
                            </div>
                            <div
                                v-if="
                                    i.resourcesId
                                        ? resourceVersionMap.has(i.resourcesId)
                                        : resourceVersionMap.has(
                                              i.releaseDetail?.resourcesId,
                                          )
                                "
                            >
                                (当前版本:{{
                                    i.resourcesId
                                        ? resourceVersionMap.get(i.resourcesId)
                                        : resourceVersionMap.get(
                                              i.releaseDetail?.resourcesId,
                                          )
                                }})
                            </div>
                        </div>
                        <div class="description">
                            {{ i?.describe || i?.releaseDetail?.describe }}
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <j-empty v-else class="empty"></j-empty>
    </div>
    <a-divider />
    <div style="display: flex; justify-content: center; margin-top: 8px">
        <a-space>
            <a-button @click.stop="emits('cancel')">取消</a-button>
            <a-button @click.stop="onInstall" type="primary">全部安装</a-button>
        </a-space>
    </div>
</template>

<script setup>
import { _queryTemplateNoPaging, installResource } from '@/api/link/resource';
import { cloneDeep } from 'lodash-es';
import { computedVersion } from '../data';
import { resource } from '@/assets';
import { omit } from 'lodash-es';
import { defineExpose } from 'vue'
const props = defineProps({
    value: {
        type: Array,
        default: [],
    },
    source: {
        type: String,
        default: '',
    },
    resourceVersionMap: {
        type: Object,
        default: () => {},
    },
});
const emits = defineEmits(['update:value', 'cancel', 'refresh']);
const imageMap = new Map([
    ['device', resource.deviceDefaultImage],
    ['collector', resource.collectorDefaultImage],
    ['protocol', resource.protocolDefaultImage],
]);
const fileList = ref([]);
const removeFile = (index) => {
    fileList.value.splice(index, 1);
};

const onInstall = async () => {
    const res = await installResource({
        type: props.source,
        resourceDetails: fileList.value.map((i) => {
            return props.source === 'cloud'
                ? {
                      releaseDetail: {
                          ...omit(i, ['photoUrl']),
                      },
                      photoUrl: {
                          ...(i.photoUrl || {}),
                      },
                  }
                : {
                      ...i,
                  };
        }),
    });
    if (res.success) {
        emits('refresh');
    }
};

const compareVersion = async () => {
    fileList.value = props.value.filter((i) => {
        const resourcesId = i?.resourcesId || i?.releaseDetail?.resourcesId;
        if (props.resourceVersionMap.has(resourcesId)) {
            return props.resourceVersionMap.get(resourcesId) !== i.version;
        } else {
            return true;
        }
    });
};

defineExpose({compareVersion})

watch(
    () => props.value,
    () => {
        if (props.source === 'local') {
            fileList.value = cloneDeep(props.value);
        }
    },
    {
        immediate: true,
        deep: true,
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
.empty {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
