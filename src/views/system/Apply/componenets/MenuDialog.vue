<template>
    <j-modal
        visible
        title="集成菜单"
        width="600px"
        @ok="handleOk"
        @cancel="cancel"
        class="edit-dialog-container"
        :confirmLoading="loading"
    >
        <j-select
            v-model:value="form.checkedSystem"
            @change="(value) => value && getTree(value)"
            style="width: 200px"
            placeholder="请选择集成系统"
        >
            <j-select-option
                v-for="item in form.systemList"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</j-select-option
            >
        </j-select>

        <p style="margin: 20px 0 0 0" v-show="form.menuTree.length > 0">
            当前集成菜单
        </p>
        <j-tree
            v-model:checkedKeys="form.checkedMenu"
            v-model:expandedKeys="form.expandedKeys"
            checkable
            :tree-data="form.menuTree"
            :fieldNames="{ key: 'code', title: 'name' }"
            @check="treeCheck"
            :height="300"
        >
            <template #title="{ name }">
                <span>{{ name }}</span>
            </template>
        </j-tree>
    </j-modal>
</template>

<script setup lang="ts">
import { optionItemType } from '@/views/system/DataSource/typing';
import {
    getOwner_api,
    getOwnerStandalone_api,
    getOwnerTree_api,
    getOwnerTreeStandalone_api,
    saveOwnerMenu_api,
    updateApp_api,
} from '@/api/system/apply';
import { CheckInfo } from 'ant-design-vue/lib/vc-tree/props';
import { useMenuStore } from '@/store/menu';
import { message } from 'jetlinks-ui-components';
import { getMenuTree_api } from '@/api/system/menu';

const menuStory = useMenuStore();
const emits = defineEmits(['update:visible', 'refresh']);
const props = defineProps<{
    mode: 'add' | 'edit';
    visible: boolean;
    data: any;
}>();
// 弹窗相关
const loading = ref(false);
const handleOk = async () => {
    const items = filterTree(form.menuTree, [
        ...form.checkedMenu,
        ...form.half,
    ]);
    if (form.checkedSystem) {
        if (items && items.length !== 0) {
            loading.value = true;
            const resp = await saveOwnerMenu_api('iot', form.id, items).finally(() => (loading.value = false));
            await updateApp_api(form.id as string, {
                ...props.data,
                integrationModes: props.data?.integrationModes?.map((item: any) => item?.value || item),
                page: {
                    ...props.data?.page,
                    configuration: {
                        checkedSystem: form.checkedSystem
                    }
                }
            })
            if (resp.status === 200) {
                // 保存集成菜单
                message.success('操作成功');
                emits('update:visible', false);
                emits('refresh')
            }
        } else {
            message.warning('请勾选配置菜单');
        }
    } else {
        message.warning('请选择所属系统');
    }
};
const cancel = () => {
    if (props.mode === 'add')
        menuStory.jumpPage('system/Apply/Save', {}, { id: form.id });
    emits('update:visible', false);
};

const form = reactive({
    id: props.data?.id,
    checkedSystem: undefined as undefined | string,
    checkedMenu: [] as string[],
    expandedKeys: [] as string[],
    half: [] as string[],

    provider: props.data?.provider,
    systemList: [] as optionItemType[],
    menuTree: [] as any[],
});
/**
 * 与集成系统关联的菜单
 * @param params
 */
function getTree(params: string) {
    const api =
        form.provider === 'internal-standalone'
            ? getOwnerTreeStandalone_api(form.id, params)
            : getOwnerTree_api(params);
    api.then((resp: any) => {
        form.menuTree = resp.result;
        form.expandedKeys = resp.result.map((item: any) => item?.code);
    });
}
/**
 * 获取当前用户可访问菜单
 */
function getMenus(id: string) {
    const params = {
        terms: [
            {
                column: 'appId',
                value: id,
            },
        ],
    };
    getMenuTree_api(params).then((resp: any) => {
        if (resp.status === 200) {
            // form.menuTree = resp.result;
            const keys = resp.result.map((item: any) => item?.code) as string[];
            // form.expandedKeys = keys;
            form.checkedMenu = keys;
        }
    });
}
/**
 * 获取集成系统选项
 */
function getSystemList(id: string) {
    const api =
        form.provider === 'internal-standalone'
            ? getOwnerStandalone_api(id, ['iot'])
            : getOwner_api(['iot']);

    api.then((resp: any) => {
        if (resp.status === 200) {
            form.systemList = resp.result.map((item: string) => ({
                label: item,
                value: item,
            }));
        }
    });
}

watch(() => props.data, (newVal: any) => {
    form.checkedSystem = newVal?.page.configuration?.checkedSystem
    if(form.checkedSystem){
        getTree(form.checkedSystem)
    }
    if(newVal?.id) {
        getSystemList(newVal?.id);
        getMenus(newVal?.id);
    }
}, {
    deep: true,
    immediate: true
})
// 树选中事件
function treeCheck(checkedKeys: any, e: CheckInfo) {
    form.checkedMenu = checkedKeys
    form.half = e.halfCheckedKeys as string[];
}
//过滤节点-默认带上父节点
function filterTree(nodes: any[], list: any[]) {
    if (!nodes?.length) {
        return nodes;
    }
    return nodes.filter((it) => {
        // 不符合条件的直接砍掉
        if (list.indexOf(it.code) <= -1) {
            return false;
        }
        // 符合条件的保留，并且需要递归处理其子节点
        it.children = filterTree(it.children, list);
        return true;
    });
}
</script>

<style scoped></style>
