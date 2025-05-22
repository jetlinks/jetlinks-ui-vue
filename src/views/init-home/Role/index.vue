<template>
    <div class="init-home-role">
        <div class="built_in_group">
            <div>{{ $t('Role.index.263636-0') }}</div>
            <div class="group">
                <div v-for="(item, index) in group" class="group_item" @mouseover="() => showButton(item)"
                    @mouseleave="() => hiddenButton(item)">
                    <div class="group_name" :class="{ group_selected: item.selected }"
                        :type="item.selected ? 'primary' : 'default'">
                        <j-ellipsis style="max-width: 90%;">
                          <span>{{ item.name }}</span>
                        </j-ellipsis>
                      <AIcon type="CloseOutlined" class="closeIcon" v-if="item.closeIcon"
                             @click="group.splice(index, 1)"></AIcon>
                    </div>
                    <div v-if="item.show">
                        <a-button block @click="() => selectGroup(item)">{{ item.selected ? $t('Role.index.263636-1') : $t('Role.index.263636-2') }}</a-button>
                        <a-button block @click="() => showEditGroup(item, index)">{{ $t('Role.index.263636-3') }}</a-button>
                    </div>
                </div>
                <a-button type="text" @click="showAddGroup" :disabled="group.length >= 10">{{ $t('Role.index.263636-4') }}</a-button>
            </div>
        </div>
        <a-checkbox-group @change="getCheckValue">
            <div class="init-home-role-content">
                <div class="role-item role-item-1" :style="keys.includes('device')
                        ? 'background-color: #f5f5f5;'
                        : ''
                    ">
                    <div class="role-item-title">
                        <a-checkbox :value="ROLEKEYS.device"></a-checkbox>
                        <div class="role-title">{{ $t('Role.index.263636-5') }}</div>
                    </div>
                    <div class="role-item-content"></div>
                    <div class="role-item-footer">
                        {{ $t('Role.index.263636-6') }}
                    </div>
                </div>
                <div class="role-item role-item-2" :style="keys.includes('link')
                        ? 'background-color: #f5f5f5;'
                        : ''
                    ">
                    <div class="role-item-title">
                        <a-checkbox :value="ROLEKEYS.link"></a-checkbox>
                        <div class="role-title">{{ $t('Role.index.263636-7') }}</div>
                    </div>
                    <div class="role-item-content"></div>
                    <div class="role-item-footer">
                        {{ $t('Role.index.263636-8') }}
                    </div>
                </div>
                <div class="role-item role-item-3" :style="keys.includes('complex')
                        ? 'background-color: #f5f5f5;'
                        : ''
                    ">
                    <div class="role-item-title">
                        <a-checkbox :value="ROLEKEYS.complex"></a-checkbox>
                        <div class="role-title">{{ $t('Role.index.263636-9') }}</div>
                    </div>
                    <div class="role-item-content"></div>
                    <div class="role-item-footer">
                        {{ $t('Role.index.263636-10') }}
                    </div>
                </div>
            </div>
        </a-checkbox-group>
    </div>
    <a-modal destroy-on-close :visible="showAdd" :title="$t('Role.index.263636-11')" @cancel="showAdd = false" @ok="addGroup">
        <a-form layout="vertical" ref="formRef" :model="formData">
            <a-form-item name="name" :label="$t('Role.index.263636-12')" :rules="[
                {
                    required: true,
                    message: $t('Role.index.263636-13'),
                },
                {
                    max: 64,
                    message: $t('Role.index.263636-14'),
                },
            ]">
                <a-input v-model:value="formData.name" :placeholder="$t('Role.index.263636-13')"></a-input>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script lang="ts" setup>
import RoleMenuData, { ROLEKEYS, RoleData } from '../data/RoleData';
import { updateRoleMenu, addRole, getRoleMenu, addRoleGroup } from '@authentication-manager/api/initHome';
import { randomString } from '@jetlinks-web/utils';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
/**
 * 角色勾选数据
 */
const keys = ref([]);
/**
 * 获取角色选择数据
 */
const getCheckValue = (val: any) => {
    keys.value = val;
};
/**
 * 获取分组数据
 */
const group = ref<any[]>([{
    name: $t('Role.index.263636-15'),
    show: false,
    selected: true,
    id: 'default_group'
}, {
    name: $t('Role.index.263636-16'),
    show: false,
    selected: false,
    id: randomString()
}, {
    name: $t('Role.index.263636-17'),
    show: false,
    selected: false,
    id: randomString()
}])

const showAdd = ref(false)
const groupStatue = ref('add')
const selectedGroup = ref()
const formData = ref({
    name: undefined
})

const formRef = ref()
/**
 * 根据菜单找角色
 */
const findMenuByRole = (menu: any[], code: string): any => {
    let _item = null;
    menu.some((item) => {
        if (item.code === code) {
            _item = item;
            return true;
        }

        if (item.children) {
            const childrenItem = findMenuByRole(item.children, code);
            if (childrenItem) {
                _item = childrenItem;
                return true;
            }
            return false;
        }

        return null;
    });
    return _item;
};

const saveRoleData = (item: any) => {
    return new Promise(async (resolve) => {
        const _itemData = RoleData[item];
        // 添加该角色
        const res = await addRole(_itemData);
        if (res.status === 200) {
            const menuTree = await getRoleMenu(res.result.id);
            if (menuTree.status === 200) {
                const _roleData = (RoleMenuData[item] as []).filter(
                    (roleItem: any) => {
                        const _menu = findMenuByRole(
                            menuTree.result,
                            roleItem.code,
                        );
                        if (_menu) {
                            roleItem.id = _menu.id;
                            roleItem.parentId = _menu.parentId;
                            roleItem.createTime = _menu.createTime;
                            return true;
                        }
                        return false;
                    },
                );
                //更新权限
                const roleRes = await updateRoleMenu(res.result.id, {
                    menus: _roleData,
                });
                resolve(roleRes.status === 200)
            } else {
                resolve(false);
            }
        } else {
            resolve(false);
        }
    });
};

/**
 * 保存角色
 */
const addRoleData = async () => {
    return new Promise((resolve) => {
        if (!keys.value.length) {
            return resolve(true);
        }

        const allPromise = keys.value.map(async (item) => {
            return await saveRoleData(item);
        });

        Promise.all(allPromise).then((item) => {
            resolve(
                item.every((i) => {
                    return i;
                }),
            );
        });
    });
};

const showButton = (item: any) => {
    if (item.name != $t('Role.index.263636-15')) {
        item.show = true
    }
}
const hiddenButton = (item: any) => {
    item.show = false
}

const selectGroup = (item: any) => {
    item.selected = !item.selected
}
/**
 * 新增分组
 */
const showAddGroup = () => {
    formData.value.name = undefined
    showAdd.value = true
    groupStatue.value = 'add'
}
/**
 * 分组编辑
 */
const showEditGroup = (item: any, index: number) => {
    formData.value.name = item.name
    showAdd.value = true
    groupStatue.value = 'edit'
    selectedGroup.value = index
}
const addGroup = () => {
    formRef.value?.validate().then(() => {
        groupStatue.value === 'add' ? group.value.push({
            name: formData.value.name,
            selected: true,
            show: false,
            closeIcon: true,
            id: randomString()
        }) : group.value[selectedGroup.value].name = formData.value.name
        showAdd.value = false
    })
}
/**
 * 保存角色分组
 */
const saveGroup = async () => {
    const roleGroup = group.value.filter((item: any) => {
        return item.selected
    })
    return new Promise((resolve) => {
        const allPromise = roleGroup.map(async (item) => {
            return await addRoleGroup({ id: item.id, name: item.name });
        });
        Promise.all(allPromise).then((item) => {
            resolve(
                item.every((i) => {
                    return i;
                }),
            );
        });
    })
}
defineExpose({
    submitRole: addRoleData,
    submitRoleGroup: saveGroup
});
</script>
<style lang="less" scoped>
.init-home-role {
    .built_in_group {
        margin-bottom: 10px;
        position: relative;

        .group {
            display: flex;
            position: absolute;
            z-index: 999;

            .group_item {
                width: 100px;
                margin-right: 20px;

                .button {
                    display: block;
                }

                .group_name {
                    border: .2px solid rgb(217, 217, 217);
                    text-align: center;
                    height: 32px;
                    line-height: 32px;
                    border-radius: 2px;
                    padding: 0 10px;
                    position: relative;

                    .closeIcon {
                        font-size: 12px;
                        position: absolute;
                        top: 10px;
                        right: 4px;
                    }
                }

                .group_selected {
                    background-color: rgb(190, 232, 251);
                }
            }
        }
    }

    .init-home-role-content {
        display: flex;
        grid-gap: 24px;
        gap: 24px;
        margin-top: 40px;
    }

    .role-item-1 {
        background-image: url(/images/init-home/role1.png);
    }

    .role-item-2 {
        background-image: url(/images/init-home/role2.png);
    }

    .role-item-3 {
        background-image: url(/images/init-home/role3.png);
    }

    .role-item {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-bottom: 30px;
        padding: 24px;
        background-repeat: no-repeat;
        background-position: 50%;
        background-size: 370px;
        border: 1px solid #f5f5f5;

        .role-item-title {
            display: flex;

            .role-title {
                flex: 1 1 auto;
                font-weight: 700;
                font-size: 16px;
                text-align: center;
            }
        }

        .role-item-content {
            width: 250px;
            height: 260px;
            margin-top: 24px;
        }

        .role-item-footer {
            position: absolute;
            bottom: -30px;
            left: 0;
            width: 100%;
            color: #999;
            font-size: 12px;
            text-align: center;
        }
    }
}</style>
