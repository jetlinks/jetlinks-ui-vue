<template>
    <div class="person">
        <div class="person-header">
            <div class="person-header-item">
                <div class="person-header-item-info">
                    <div class="person-header-item-info-left">
                        <UploadAvatar
                            :accept="
                                imageTypes && imageTypes.length
                                    ? imageTypes.toString()
                                    : ''
                            "
                            :modelValue="user.userInfos?.avatar"
                            @change="onAvatarChange"
                        />
                    </div>
                    <div class="person-header-item-info-right">
                        <div class="person-header-item-info-right-top">
                            <j-ellipsis>
                                Hi, {{ user.userInfos?.name }}
                            </j-ellipsis>
                        </div>
                        <div class="person-header-item-info-right-info">
                            <RoleShow :value="user.userInfos?.roleList || []" />
                        </div>
                    </div>
                </div>
                <div class="person-header-item-action">
                    <j-space :size="24">
                        <j-button class="btn" @click="visible = true"
                            >查看详情</j-button
                        >
                        <j-button @click="editInfoVisible = true"
                            >编辑资料</j-button
                        >
                        <j-button
                            v-if="permission"
                            @click="editPasswordVisible = true"
                        >
                            修改密码
                        </j-button>
                    </j-space>
                </div>
            </div>
        </div>
        <div class="person-content">
            <div class="person-content-item">
                <div class="person-content-item-content">
                    <j-tabs v-model:activeKey="user.tabKey" type="card">
                        <j-tab-pane
                            v-for="item in list"
                            :key="item.key"
                            :tab="item.title"
                        />
                    </j-tabs>
                    <j-scrollbar :height="`calc(100% - 51px)`">
                        <component :is="tabs[user.tabKey]" />
                    </j-scrollbar>
                </div>
            </div>
        </div>
        <Detail v-if="visible" @close="visible = false" />
        <EditInfo
            v-if="editInfoVisible"
            :data="user.userInfos"
            @close="editInfoVisible = false"
            @save="onSave"
        />
        <EditPassword
            v-if="editPasswordVisible"
            @close="editPasswordVisible = false"
            @save="onPasswordSave"
        />
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
import UploadAvatar from './components/UploadAvatar/index.vue';
import { updateMeInfo_api } from '@/api/account/center';
import { onlyMessage } from '@/utils/comm';
import { useRouterParams } from '@/utils/hooks/useParams';
import {
    USER_CENTER_MENU_BUTTON_CODE,
    USER_CENTER_MENU_CODE,
} from '@/utils/consts';
import { usePermissionStore } from '@/store/permission';
import RoleShow from './components/RoleShow/index.vue';

const imageTypes = reactive([
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/jfif',
    'image/pjp',
    'image/pjpeg',
]);

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

const router = useRouterParams();

// const activeKey = ref<KeyType>('HomeView');
const visible = ref<boolean>(false);
const editInfoVisible = ref<boolean>(false);
const editPasswordVisible = ref<boolean>(false);

const permission = usePermissionStore().hasPermission(
    `${USER_CENTER_MENU_CODE}:${USER_CENTER_MENU_BUTTON_CODE}`,
);

const onSave = () => {
    user.getUserInfo();
    editInfoVisible.value = false;
};

const onPasswordSave = () => {
    editPasswordVisible.value = false;
};

const onAvatarChange = (url: string) => {
    updateMeInfo_api({
        ...user.userInfos,
        avatar: url,
    }).then((resp) => {
        if (resp.status === 200) {
            onlyMessage('操作成功', 'success');
            user.getUserInfo();
        }
    });
};

watchEffect(() => {
    if (router.params.value?.tabKey) {
        user.tabKey = router.params.value?.tabKey;
    }
});

onUnmounted(() => {
    user.tabKey = 'HomeView'
    user.other.tabKey = ''
})
</script>

<style lang="less" scoped>
@padding: 14%;
.person {
    .person-header {
        width: 100%;
        height: 156px;
        padding: 0 @padding;
        background-color: #fff;

        .person-header-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100%;
            .person-header-item-info {
                display: flex;
                width: calc(100% - 380px);
                .person-header-item-info-left {
                    margin-right: 30px;
                }

                .person-header-item-info-right {
                    display: flex;
                    flex-direction: column;
                    width: calc(100% - 126px);
                    .person-header-item-info-right-top {
                        display: flex;
                        font-size: 26px;
                        color: #1d2129;
                        font-weight: 500;
                        width: 100%;
                    }
                    .person-header-item-info-right-info {
                        width: 100%;
                    }
                }
            }

            .person-header-item-action {
                button {
                    width: 110px;
                    background-color: #ebeef4;
                    color: #333333;
                    border: none;
                }

                .btn {
                    background-color: @primary-color;
                    color: #fff;
                }
            }
        }
    }

    .person-content-item {
        padding: 10px 20px;
        background-color: #fff;
        overflow: hidden;
    }

    .person-content {
        width: 100%;
        padding: 0 @padding;
        margin-top: 15px;
    }

    .person-content-item-content {
        height: calc(100vh - 251px);
        width: 100%;
        padding: 10px 0;
    }
}
</style>
