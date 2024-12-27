<template>
    <div
        style="
            margin-top: 10px;
            max-height: 500px;
            min-height: 400px;
            overflow-y: auto;
        "
    >
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
                            {{
                                'v' + (i?.version || i?.releaseDetail?.version)
                            }}
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
                        <div v-if="i.resourcesId ? resourceVersionMap.has(i.resourcesId) : resourceVersionMap.has(i.releaseDetail?.resourcesId)">
                            (当前版本:V{{
                               i.resourcesId ? resourceVersionMap.get(i.resourcesId) : resourceVersionMap.get(i.releaseDetail?.resourcesId)
                            }})
                        </div>
                    </div>
                    <div class="description">
                        {{ i?.describe || i?.releaseDetail?.describe }}
                    </div>
                </div>
            </div>
        </div>
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
const fileList = ref([]);
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
    });
    if (res.success) {
        emits('refresh');
    }
};

watch(
    () => props.value,
    () => {
        fileList.value = cloneDeep(props.value);
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
