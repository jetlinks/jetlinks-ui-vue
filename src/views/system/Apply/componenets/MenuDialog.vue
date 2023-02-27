<template>
    <a-modal
        v-model:visible="dialog.visible"
        title="集成菜单"
        width="600px"
        @ok="dialog.handleOk"
        @cancel="dialog.cancel"
        class="edit-dialog-container"
        :confirmLoading="dialog.loading"
        cancelText="取消"
        okText="确定"
    >
        <a-select
            v-model:value="form.checkedSystem"
            @change="(value) => value && getTree(value as string)"
            style="width: 200px"
            placeholder="请选择集成系统"
        >
            <a-select-option
                v-for="item in form.systemList"
                :value="item.value"
                >{{ item.label }}</a-select-option
            >
        </a-select>

        <p style="margin: 20px 0 0 0" v-show="form.menuTree.length > 0">当前集成菜单</p>
        <a-tree
            v-model:checkedKeys="form.checkedMenu"
            v-model:expandedKeys="form.expandedKeys"
            checkable
            :tree-data="form.menuTree"
            :fieldNames="{ key: 'id', title: 'name' }"
            @check="treeCheck"
        >
            <template #title="{ name }">
                <span>{{ name }}</span>
            </template>
        </a-tree>
    </a-modal>
</template>

<script setup lang="ts">
import { optionItemType } from '@/views/system/DataSource/typing';
import { applyType } from '../Save/typing';
import {
    getOwner_api,
    getOwnerStandalone_api,
    getOwnerTree_api,
    getOwnerTreeStandalone_api,
    saveOwnerMenu_api,
} from '@/api/system/apply';
import { CheckInfo } from 'ant-design-vue/lib/vc-tree/props';
import { useMenuStore } from '@/store/menu';
import { message } from 'ant-design-vue';
import { getMenuTree_api } from '@/api/system/menu';

const menuStory = useMenuStore();

const props = defineProps<{
    mode: 'add' | 'edit';
}>();
// 弹窗相关
const dialog = reactive({
    visible: false,
    loading: false,

    handleOk: () => {
        const items = filterTree(form.menuTree, [
            ...form.checkedMenu,
            ...form.half,
        ]);
        if (form.checkedSystem) {
            if (items && items.length !== 0) {
                saveOwnerMenu_api('iot', form.id, items).then((resp) => {
                    if (resp.status === 200) {
                        message.success('操作成功');
                        dialog.visible = false;
                    }
                });
            } else {
                message.warning('请勾选配置菜单');
            }
        } else {
            message.warning('请选择所属系统');
        }
    },
    cancel: () => {
        if (props.mode === 'add')
            menuStory.jumpPage('system/Apply/Save', {}, { id: form.id });
        dialog.visible = false;
    },
    changeVisible: (id: string, provider: applyType) => {
        form.id = id;
        form.provider = provider;
        form.checkedSystem = undefined;
        form.checkedMenu = [];
        dialog.visible = true;

        if (id) {
            getSystemList();
            getMenus();
        }
    },
});
// 将打开弹窗的操作暴露给父组件
defineExpose({
    openDialog: dialog.changeVisible,
});

const form = reactive({
    id: '',
    checkedSystem: '' as undefined | string,
    checkedMenu: [] as string[],
    expandedKeys: [] as string[],
    half: [] as string[],

    provider: '' as applyType,
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
        form.expandedKeys = resp.result.map((item: any) => item.id);
    });
}
/**
 * 获取当前用户可访问菜单
 */
function getMenus() {
    const params = {
        terms: [
            {
                column: 'appId',
                value: form.id,
            },
        ],
    };
    getMenuTree_api(params).then((resp: any) => {
        if (resp.status === 200) {
            form.menuTree = resp.result;
            const keys = resp.result.map((item: any) => item.id) as string[];
            form.expandedKeys = keys;
            form.checkedMenu = keys;
        }
    });
}
/**
 * 获取集成系统选项
 */
function getSystemList() {
    const api =
        form.provider === 'internal-standalone'
            ? getOwnerStandalone_api(form.id, ['iot'])
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
// 树选中事件
function treeCheck(checkedKeys: any, e: CheckInfo) {
    form.checkedMenu = checkedKeys;
    form.half = e.halfCheckedKeys as string[];
}
//过滤节点-默认带上父节点
function filterTree(nodes: any[], list: any[]) {
    if (!nodes?.length) {
        return nodes;
    }
    return nodes.filter((it) => {
        // 不符合条件的直接砍掉
        if (list.indexOf(it.id) <= -1) {
            return false;
        }
        // 符合条件的保留，并且需要递归处理其子节点
        it.children = filterTree(it.children, list);
        return true;
    });
}
</script>

<style scoped></style>
