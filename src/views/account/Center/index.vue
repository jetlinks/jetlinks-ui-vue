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
                            <span>{{ _org }}部门 · {{ _role }}角色</span>
                        </div>
                        <div class="person-header-item-info-right-info">
                            <div>用户名 {{ user.userInfos?.username }}</div>
                            <div>账号ID {{ user.userInfos?.id }}</div>
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
                                    user.tabKey === item.key
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
                                ><j-button
                                    @click="visible = true"
                                    shape="circle"
                                    ><AIcon
                                        style="font-size: 24px"
                                        type="FileSearchOutlined" /></j-button
                            ></j-tooltip>
                            <j-tooltip title="编辑资料"
                                ><j-button
                                    shape="circle"
                                    @click="editInfoVisible = true"
                                    ><AIcon
                                        style="font-size: 24px"
                                        type="FormOutlined" /></j-button
                            ></j-tooltip>
                            <PermissionButton
                                shape="circle"
                                :hasPermission="`${USER_CENTER_MENU_CODE}:${USER_CENTER_MENU_BUTTON_CODE}`"
                                :tooltip="{
                                    title: '修改密码'
                                }"
                                @click="editPasswordVisible = true"
                            >
                                <AIcon
                                    style="font-size: 24px"
                                    type="LockOutlined"
                                />
                            </PermissionButton>
                        </j-space>
                    </div>
                </div>
            </div>
        </div>
        <div class="person-content">
            <div class="person-content-item">
                <FullPage>
                    <div class="person-content-item-content">
                        <component :is="tabs[user.tabKey]" />
                    </div>
                </FullPage>
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
  USER_CENTER_MENU_CODE
} from '@/utils/consts'

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

const onActivated = (_key: KeyType) => {
    user.tabKey = _key;
};

const _org = computed(() => {
    return user.userInfos?.orgList
        ?.map((item: any) => {
            return item?.name;
        })
        .join(',');
});

const _role = computed(() => {
    return user.userInfos?.roleList
        ?.map((item: any) => {
            return item?.name;
        })
        .join(',');
});

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
                    :deep(button) {
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
