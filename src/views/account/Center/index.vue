<template>
    <div class="person">
        <div class="person-header">
            <div class="person-header-item">
                <div class="person-header-item-info">
                    <div class="person-header-item-info-left">
                        <j-avatar :size="64">
                            <template #icon
                                ><AIcon type="UserOutlined"
                            /></template>
                        </j-avatar>
                    </div>
                    <div class="person-header-item-info-right">
                        <div class="person-header-item-info-right-top">
                            <span>xx部门 · xx角色</span>
                        </div>
                        <div class="person-header-item-info-right-info">
                            <div>用户名 {{user.userInfos?.username}}</div>
                            <div>账号ID {{user.userInfos?.id}}</div>
                        </div>
                    </div>
                </div>
                <div class="person-header-item-action">
                    <div class="person-header-item-action-left">
                        <j-space>
                            <j-button
                                @click="onActivated(item.key)"
                                v-for="item in list"
                                :type="
                                    activeKey === item.key
                                        ? 'primary'
                                        : 'default'
                                "
                                :key="item.key"
                                >{{ item.title }}</j-button
                            >
                        </j-space>
                    </div>
                    <div class="person-header-item-action-right">
                        <j-space :size="24">
                            <j-tooltip title="查看详情"
                                ><j-button @click="visible = true" shape="circle"
                                    ><AIcon
                                        style="font-size: 24px"
                                        type="FileSearchOutlined" /></j-button
                            ></j-tooltip>
                            <j-tooltip title="编辑资料"
                                ><j-button shape="circle"
                                @click="editInfoVisible = true"
                                    ><AIcon
                                        style="font-size: 24px"
                                        type="FormOutlined" /></j-button
                            ></j-tooltip>
                            <j-tooltip title="修改密码"
                                ><j-button shape="circle"
                                @click="editPasswordVisible = true"
                                    ><AIcon
                                        style="font-size: 24px"
                                        type="LockOutlined" /></j-button
                            ></j-tooltip>
                        </j-space>
                    </div>
                </div>
            </div>
        </div>
        <div class="person-content">
            <div class="person-content-item">
                <FullPage>
                    <div class="person-content-item-content">
                        <component :is="tabs[activeKey]" />
                    </div>
                </FullPage>
            </div>
        </div>
        <Detail v-if="visible" @close="visible = false"/>
        <EditInfo v-if="editInfoVisible" :data="user.userInfos" @close="editInfoVisible = false" @save="onSave" />
        <EditPassword v-if="editPasswordVisible" @close="editPasswordVisible = false" @save="onPasswordSave" />
    </div>
</template>

<script setup lang="ts" name="Center">
import HomeView from './components/HomeView/index.vue';
import BindThirdAccount from './components/BindThirdAccount/index.vue';
import Subscribe from './components/Subscribe/index.vue';
import StationMessage from './components/StationMessage/index.vue';
import Detail from './components/Detail/index.vue';
import EditInfo from './components/EditInfo/index.vue';
import EditPassword from './components/EditPassword/index.vue';
import { useUserInfo } from '@/store/userInfo';

const user = useUserInfo();

type KeyType = 'HomeView' | 'BindThirdAccount' | 'Subscribe' | 'StationMessage';
const list: { key: KeyType; title: string }[] = [
    {
        key: 'HomeView',
        title: '首页视图',
    },
    {
        key: 'BindThirdAccount',
        title: '绑定第三方账号',
    },
    {
        key: 'Subscribe',
        title: '我的订阅',
    },
    {
        key: 'StationMessage',
        title: '站内信',
    },
];

const tabs = {
    HomeView,
    BindThirdAccount,
    Subscribe,
    StationMessage,
};

const activeKey = ref<KeyType>('HomeView');
const visible = ref<boolean>(false);
const editInfoVisible = ref<boolean>(false);
const editPasswordVisible = ref<boolean>(false);

const onActivated = (_key: KeyType) => {
    activeKey.value = _key;
};

const onSave = () => {
    user.getUserInfo()
    editInfoVisible.value = false
}

const onPasswordSave = () => {
    editPasswordVisible.value = false
}
</script>

<style lang="less" scoped>
.person {
    .person-header {
        width: 100%;
        height: 150px;
        padding: 0 150px;
        background-color: rgba(2, 125, 180, 0.368);

        .person-header-item {
            position: relative;
            height: 100%;
            .person-header-item-info {
                padding-top: 30px;
                display: flex;
                .person-header-item-info-left {
                    margin-right: 30px;
                }

                .person-header-item-info-right {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .person-header-item-info-right-top {
                        span {
                            background-color: rgba(
                                255,
                                255,
                                128,
                                0.43137254901960786
                            );
                            border-radius: 5px;
                            padding: 0 10px;
                        }
                    }
                    .person-header-item-info-right-info {
                        color: #fff;
                        display: flex;
                        font-size: 16px;
                        > :not(:last-child) {
                            margin-right: 20px;
                        }
                    }
                }
            }

            .person-header-item-action {
                position: absolute;
                width: 100%;
                height: 50px;
                z-index: 2;
                left: 0;
                bottom: -25px;
                padding: 0 50px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .person-header-item-action-left {
                    button {
                        height: 35px;
                        padding: 0 40px;
                    }
                }

                .person-header-item-action-right {
                    button {
                        height: 50px;
                        width: 50px;
                    }
                }
            }
        }
    }

    .person-content {
        width: 100%;
        padding: 0 150px;
        .person-content-item-content {
            padding: 20px;
        }
    }
}
</style>
