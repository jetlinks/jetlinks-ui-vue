<template>
    <a-modal
        title="安装资源"
        visible
        @cancel="emits('close')"
        :maskClosable="false"
        :width="1000"
        :footer="null"
    >
        <InstallIng
            v-if="taskList.length"
            :taskList="taskList"
            :resourceVersionMap="resourceVersionMap"
            @refresh="getTaskList"
        />
        <List
            :source="source"
            ref="listRef"
            v-else-if="source === 'cloud'"
            v-model:value="fileList"
            :resourceVersionMap="resourceVersionMap"
            @cancel="emits('close')"
            @refresh="getTaskList"
        />
        <template v-else>
            <Init v-model:source="source" v-model:value="fileList" :resourceVersionMap="resourceVersionMap" @close="emits('close')" @refresh="getTaskList"/>
        </template>
    </a-modal>
</template>

<script setup>
import Init from './components/Init.vue';
import List from './components/List.vue';
import InstallIng from './components/InstallIng.vue';
import {
    queryTaskListNoPaging,
    _queryTemplateNoPaging,
} from '@/api/link/resource';

const emits = defineEmits(['close']);
const source = ref('');
const listRef = ref()
const fileList = ref([]);
const taskList = ref([]);

const getTaskList = async () => {
    const resp = await queryTaskListNoPaging({
        terms: [
            {
                column: 'state',
                termType: 'not',
                value: 'success',
            },
        ],
    });
    if (resp.success) {
        taskList.value = resp.result;
    }
};

const resourceVersionMap = ref(new Map());

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
        listRef.value?.compareVersion()
    }
};

watch(
    () => [fileList.value, taskList.value],
    () => {
        let list;
        if (taskList.value.length) {
            list = taskList.value;
        } else {
            list = fileList.value;
        }
        resourceVersionMap.value.clear();
        const resourceIds = list?.map((i) => {
            return i.resourcesId;
        });
        getVersion(resourceIds);
    },
);

onMounted(() => {
    getTaskList();
});
</script>
<style lang="less" scoped></style>
