<template>
    <div class="init-home-role">
        <a-checkbox-group @change="getCheckValue">
            <div class="init-home-role-content">
                <div
                    class="role-item role-item-1"
                    :style="
                        keys.includes('device')
                            ? 'background-color: #f5f5f5;'
                            : ''
                    "
                >
                    <div class="role-item-title">
                        <a-checkbox :value="ROLEKEYS.device"></a-checkbox>
                        <div class="role-title">设备接入岗</div>
                    </div>
                    <div class="role-item-content"></div>
                    <div class="role-item-footer">
                        该角色负责设备接入模块的维护管理
                    </div>
                </div>
                <div
                    class="role-item role-item-2"
                    :style="
                        keys.includes('link')
                            ? 'background-color: #f5f5f5;'
                            : ''
                    "
                >
                    <div class="role-item-title">
                        <a-checkbox :value="ROLEKEYS.link"></a-checkbox>
                        <div class="role-title">运维管理岗</div>
                    </div>
                    <div class="role-item-content"></div>
                    <div class="role-item-footer">
                        该角色负责系统运维模块的维护管理
                    </div>
                </div>
                <div
                    class="role-item role-item-3"
                    :style="
                        keys.includes('complex')
                            ? 'background-color: #f5f5f5;'
                            : ''
                    "
                >
                    <div class="role-item-title">
                        <a-checkbox :value="ROLEKEYS.complex"></a-checkbox>
                        <div class="role-title">综合管理岗</div>
                    </div>
                    <div class="role-item-content"></div>
                    <div class="role-item-footer">
                        该角色负责系统运维和设备接入模块的维护管理
                    </div>
                </div>
            </div>
        </a-checkbox-group>
    </div>
</template>

<script lang="ts" setup>
import RoleMenuData, { ROLEKEYS, RoleData } from '../data/RoleData';
import { updateRoleMenu, addRole, getRoleMenu } from '@/api/initHome';
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
/**
 * 保存角色
 */
const addRoleData = async () => {
    return new Promise((resolve) => {
        if (!keys.value.length) {
            return resolve(true);
        }
        let Count = 0;
        keys.value.forEach(async (item, index) => {
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
                    if (roleRes.status === 200) {
                        Count += 1;
                    }
                    if (index === keys.value.length - 1) {
                        resolve(Count === keys.value.length);
                    }
                } else if (index === keys.value.length - 1) {
                    resolve(Count === keys.value.length);
                }
            } else if (index === keys.value.length - 1) {
                resolve(Count === keys.value.length);
                roleData.isSucessRole = 2;
            }
        });
    });
};
defineExpose({
    submitRole: addRoleData,
});
</script>
<style lang="less" scoped>
.init-home-role {
    .init-home-role-content {
        display: flex;
        grid-gap: 24px;
        gap: 24px;
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
}
</style>