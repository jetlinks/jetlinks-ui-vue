<template>
    <div class="init-home-role">
        <div class="built_in_group">
            <div>平台角色内置分组</div>
            <div class="group">
                <div v-for="(item,index) in group" class="group_item"  @mouseover="()=>showButton(item)" @mouseleave="()=>hiddenButton(item)">
                    <j-button  block  :type="item.selected ? 'primary' : 'default'">{{ item.name }}</j-button>
                    <div v-if="item.show">
                        <j-button block @click="()=>selectGroup(item)">{{ item.selected ? '取消选中' : '选中' }}</j-button>
                        <j-button block >编辑</j-button>
                    </div>
                </div>
                <j-button type="text" @click="addGroup">+ 自定义分组</j-button>
            </div>
        </div>
        <j-checkbox-group @change="getCheckValue">
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
                        <j-checkbox :value="ROLEKEYS.device"></j-checkbox>
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
                        <j-checkbox :value="ROLEKEYS.link"></j-checkbox>
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
                        <j-checkbox :value="ROLEKEYS.complex"></j-checkbox>
                        <div class="role-title">综合管理岗</div>
                    </div>
                    <div class="role-item-content"></div>
                    <div class="role-item-footer">
                        该角色负责系统运维和设备接入模块的维护管理
                    </div>
                </div>
            </div>
        </j-checkbox-group>
    </div>
    <j-modal :visible="showAdd" title="自定义分组" @cancel="showAdd = false">
        <j-form layout="vertical" ref="formRef" :model="formData">
            <j-form-item 
                name="name"
                label="名称" 
                :rules="[
                    {
                        required: true,
                        message: '请输入名称',
                    },
                    {
                        max: 64,
                        message: '最多可输入64个字符',
                    },
                        ]">
                <j-input v-model:value="formData.name"></j-input>
            </j-form-item>
        </j-form>
    </j-modal>
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
 * 获取分组数据
 */
const group = ref([{
    name:'默认',
    show:false,
    selected:false
},{
    name:'岗位',
    show:false,
    selected:false
},{
    name:'职位',
    show:false,
    selected:false
}])

const showAdd = ref(false)

const formData = ref({
    name:''
})
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

const showButton = (item:any) =>{
    item.show = true
}
const hiddenButton = (item:any)=>{
    item.show = false
}

const selectGroup = (item:any)=>{
    item.selected = !item.selected
}

const addGroup = ()=>{
    console.log(showAdd.value)
    showAdd.value = true
}
defineExpose({
    submitRole: addRoleData,
});
</script>
<style lang="less" scoped>
.init-home-role {
    .built_in_group{
        margin-bottom: 10px;
        position: relative;
        .group{
            display: flex;
            position: absolute;
            z-index: 999;
            .group_item{
                width: 100px;
                margin-right: 20px;
                .button{
                    display: block;
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
}
</style>