<template>
    <div class="left-contain">
        <j-input
            placeholder="分组名称"
            v-model:value="searchValue"
            @pressEnter="search"
            @change="searchChange"
        >
            <template #suffix>
                <AIcon type="SearchOutlined" @click="search" />
            </template>
        </j-input>
        <div class="controls" v-if="admin">
            <j-button type="primary" @click="addGroup" style="width: 100%">
                新增分组
            </j-button>
        </div>
        <div class="listBox">
            <j-tree
                :tree-data="listData"
                v-if="listData.length"
                :fieldNames="{ title: 'name', key: 'id', children: 'children' }"
                blockNode
                :selectedKeys="selectedKeys"
                :default-expanded-keys="['global_role']"
                :showLine="{ showLeafIcon: false }"
            >
                <template #title="item">
                    <div v-if="selectId === item.data.id">
                        <j-input
                            v-model:value="addName"
                            @blur="() => saveGroup(item.data)"
                            ref="inputRef"
                            :maxlength="64"
                        ></j-input>
                    </div>
                    <div
                        class="treeItem"
                        @click="() => selectGroup(item.data.id)"
                        v-else
                    >
                        <template v-if="!item?.children">
                            <div class="itemText">
                                <Ellipsis style="width: calc(100%-100px)">{{
                                    item.name
                                }}</Ellipsis>
                            </div>
                            <div
                                @click="(e) => e.stopPropagation()"
                                v-if="item.id !== 'default_group'"
                            >
                                <PermissionButton
                                    type="text"
                                    hasPermission="system/Role:groupDelete"
                                    :popConfirm="{
                                        title: `确定要删除？`,
                                        onConfirm: () => deleteGroup(item.id),
                                    }"
                                    :disabled="item.id === 'default_group'"
                                >
                                    删除
                                </PermissionButton>
                                <PermissionButton
                                    type="text"
                                    hasPermission="system/Role:groupUpdate"
                                    @click="editGroup(item.data)"
                                    :disabled="item.id === 'default_group'"
                                >
                                    编辑
                                </PermissionButton>
                            </div>
                        </template>
                        <template v-else>
                            <Ellipsis style="width: calc(100%-100px)">{{
                                item.name
                            }}</Ellipsis>
                        </template>
                    </div>
                </template>
            </j-tree>
            <j-empty v-else style="margin-top: 100px" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onlyMessage } from '@/utils/comm';
import {
    queryRoleGroup,
    saveRoleGroup,
    deleteRoleGroup,
} from '@/api/system/role';
import { randomString } from '@/utils/utils';
import { useUserInfo } from '@/store/userInfo';
import { storeToRefs } from 'pinia';
const emit = defineEmits(['selectData']);
const userInfoStore = useUserInfo();
const { userInfos } = storeToRefs(userInfoStore);
const admin = computed(() => {
    return userInfos.value?.username === 'admin';
});
const listData: any = ref([
    {
        name: '全局角色',
        id: 'global_role',
        children: [],
    },
]);
const selectedKeys = ref<string[]>(['global_role']);
const searchValue = ref();
const inputRef = ref();
const addName = ref();
const selectId = ref();
const queryGroup = async (select?: Boolean, searchName?: string) => {
    const params = searchName
        ? {
              sorts: [{ name: 'createTime', order: 'desc' }],
              terms: [
                  {
                      terms: [
                          {
                              value: '%' + searchName + '%',
                              termType: 'like',
                              column: 'name',
                          },
                      ],
                  },
              ],
          }
        : { sorts: [{ name: 'createTime', order: 'desc' }] };
    const req: any = await queryRoleGroup(params);
    if (req.status === 200) {
        listData.value[0].children = req.result;
        if (req.result[req.result.length - 1].id === 'default_group') {
            req.result.unshift(req.result[req.result.length - 1]);
            req.result.pop();
        }
        // if(req.result.length && select){
        //     selectGroup(req.result[0].id)
        // }
    }
};
const addGroup = () => {
    addName.value = '';
    const newId = randomString();
    listData.value[0].children.splice(1, 0, {
        name: '',
        id: newId,
    });
    selectId.value = newId;
    nextTick(() => {
        inputRef.value.focus();
    });
};
const saveGroup = async (data: any) => {
    if (addName.value === '' ) {
        if(data.name===''){
            listData.value[0].children.splice(1, 1);
        }
    }
    else {
        const saveData = {
            name: addName.value,
            id: data.id,
        };
        const res = await saveRoleGroup(saveData);
        if (res.status === 200) {
            onlyMessage('操作成功!');
            queryGroup();
        } else {
            onlyMessage('操作失败!');
        }
    }
    setTimeout(() => {
        selectId.value = '';
    }, 300);
};

const search = () => {
    queryGroup(true, searchValue.value);
};
const searchChange = () => {
    if (searchValue.value === '') {
        queryGroup();
    }
};
const selectGroup = (id: string) => {
    selectedKeys.value = [id];
    id === 'global_role'
        ? emit('selectData', '')
        : emit('selectData', selectedKeys.value);
};
const deleteGroup = async (id: string) => {
    const res: any = await deleteRoleGroup(id);
    if (res.status === 200) {
        onlyMessage('操作成功!');
        queryGroup(true);
    } else {
        onlyMessage('操作失败!');
    }
};
const editGroup = (data: any) => {
    if (!selectId.value) {
        selectId.value = data.id;
        addName.value = data.name;
        listData.value[0].children.forEach((item: any) => {
            if (item.id === data.id) {
                item.edit = true;
            }
        });
        nextTick(() => {
            inputRef.value.focus();
        });
    }
};

onMounted(() => {
    queryGroup(true);
});
</script>
<style lang="less" scoped>
.controls {
    margin: 10px 0;
}

.treeItem {
    display: flex;
    justify-content: space-between;

    .itemText {
        line-height: 32px;
        max-width: 40%;
    }
}

.listBox {
    margin: 10px 0;
}
</style>
