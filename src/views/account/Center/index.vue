<template>
    <page-container>
        <div class="center-container">
            <div class="card">
                <div class="content" style="margin-top: 0">
                    <div
                        class="content-item flex-item"
                        style="width: 350px; justify-content: center"
                    >
                        <img
                            v-if="userInfo.avatar"
                            :src="userInfo.avatar"
                            style="width: 140px; border-radius: 70px"
                            alt=""
                        />
                        <div class="default-avatar" v-else>
                            <AIcon type="UserOutlined" />
                        </div>

                        <div
                            style="
                                width: 100%;
                                text-align: center;
                                margin-top: 20px;
                            "
                        >
                            <a-upload
                                v-model:file-list="upload.fileList"
                                accept=".jpg,.png,.jfif,.pjp,.pjpeg,.jpeg"
                                :maxCount="1"
                                :show-upload-list="false"
                                :headers="{
                                    [TOKEN_KEY]: LocalStore.get(TOKEN_KEY),
                                }"
                                :action="`${BASE_API_PATH}/file/static`"
                                @change="upload.changeBackUpload"
                                :beforeUpload="upload.beforeUpload"
                            >
                                <j-button>
                                    <AIcon type="UploadOutlined" />
                                    更换头像
                                </j-button>
                            </a-upload>
                        </div>
                    </div>
                    <div
                        class="content-item flex-item"
                        style="flex: 1; padding: 15px 0"
                    >
                        <div class="info-card">
                            <p>用户名</p>
                            <p>{{ userInfo.username }}</p>
                        </div>
                        <div class="info-card">
                            <p>账号ID</p>
                            <p>{{ userInfo.id }}</p>
                        </div>
                        <div class="info-card">
                            <p>注册时间</p>
                            <p>
                                {{
                                    moment(userInfo.createTime).format(
                                        'YYYY-MM-DD HH:mm:ss',
                                    )
                                }}
                            </p>
                        </div>
                        <div class="info-card">
                            <p>电话</p>
                            <p>{{ userInfo.telephone || '-' }}</p>
                        </div>
                        <div class="info-card">
                            <p>姓名</p>
                            <p>{{ userInfo.name }}</p>
                        </div>
                        <div class="info-card">
                            <p>角色</p>
                            <p>
                                {{
                                    (userInfo.roleList &&
                                        userInfo.roleList
                                            .map((item) => item.name)
                                            .join(',')) ||
                                    '-'
                                }}
                            </p>
                        </div>
                        <div class="info-card">
                            <p>组织</p>
                            <p>
                                {{
                                    (userInfo.orgList &&
                                        userInfo.orgList
                                            .map((item) => item.name)
                                            .join(',')) ||
                                    '-'
                                }}
                            </p>
                        </div>
                        <div class="info-card">
                            <p>邮箱</p>
                            <p>{{ userInfo.email || '-' }}</p>
                        </div>
                    </div>
                    <AIcon
                        type="EditOutlined"
                        class="edit"
                        style="right: 40px"
                        @click="editInfoVisible = true"
                    />
                </div>
            </div>
            <div class="card">
                <h3>修改密码</h3>
                <div class="content">
                    <div class="content" style="align-items: flex-end">
                        <lock-outlined
                            style="color: #1d39c4; font-size: 70px"
                        />
                        <!-- <AIcon type="LockOutlined" /> -->
                        <span
                            style="margin-left: 5px; color: rgba(0, 0, 0, 0.55)"
                            >安全性高的密码可以使帐号更安全。建议您定期更换密码,设置一个包含字母,符号或数字中至少两项且长度超过8位的密码</span
                        >
                    </div>
                    <span class="edit">
                        <PermissionButton
                            :uhasPermission="`${permission}:update`"
                            type="link"
                            @click="editPasswordVisible = true"
                        >
                            <AIcon type="EditOutlined" style="color: #1d39c4" />
                        </PermissionButton>
                    </span>
                </div>
            </div>
            <!-- 社区版不显示 -->
            <div class="card" v-if="isNoCommunity">
                <h3>绑定三方账号</h3>
                <div class="content">
                    <div class="account-card" v-for="item in bindList">
                        <img
                            :src="getImage(bindIcon[item.provider])"
                            style="height: 50px"
                            alt=""
                        />
                        <Ellipsis style="width: 150px; font-size: 22px">
                            <div v-if="item.bound">
                                <div>绑定名：{{ item.others.name }}</div>
                                <div>
                                    绑定时间：{{
                                        moment(item.bindTime).format(
                                            'YYYY-MM-DD HH:mm:ss',
                                        )
                                    }}
                                </div>
                            </div>
                            <div v-else>{{ item.name }}未绑定</div>
                        </Ellipsis>
                        <j-popconfirm
                            v-if="item.bound"
                            title="确认解除绑定嘛?"
                            @confirm="() => unBind(item.id)"
                        >
                            <j-button>解除绑定</j-button>
                        </j-popconfirm>
                        <j-button
                            v-else
                            type="primary"
                            @click="clickBind(item.id)"
                            >立即绑定</j-button
                        >
                    </div>
                </div>
            </div>
            <!-- 第三方用户不显示 -->
            <div class="card" v-if="!isApiUser">
                <h3>首页视图</h3>
                <div class="choose-view">
                    <j-row class="view-content" :gutter="24">
                        <j-col
                            :span="6"
                            class="select-item"
                            :class="{ selected: currentView === 'device' }"
                            @click="currentView = 'device'"
                        >
                            <img :src="getImage('/home/device.png')" alt="" />
                        </j-col>
                        <j-col
                            :span="6"
                            class="select-item"
                            :class="{ selected: currentView === 'ops' }"
                            @click="currentView = 'ops'"
                        >
                            <img :src="getImage('/home/ops.png')" alt="" />
                        </j-col>
                        <j-col
                            :span="6"
                            class="select-item"
                            :class="{
                                selected: currentView === 'comprehensive',
                            }"
                            @click="currentView = 'comprehensive'"
                        >
                            <img
                                :src="getImage('/home/comprehensive.png')"
                                alt=""
                            />
                        </j-col>
                    </j-row>
                    <j-button type="primary" class="btn" @click="confirm"
                        >确定</j-button
                    >
                </div>
            </div>

            <EditInfoDialog
                v-if="editInfoVisible"
                v-model:visible="editInfoVisible"
                :data="{ ...userInfo }"
                @ok="getUserInfo"
            />
            <EditPasswordDialog
                v-if="editPasswordVisible"
                v-model:visible="editPasswordVisible"
            />
        </div>
    </page-container>
</template>

<script setup lang="ts" name="Center">
import PermissionButton from '@/components/PermissionButton/index.vue';
import EditInfoDialog from './components/EditInfoDialog.vue';
import EditPasswordDialog from './components/EditPasswordDialog.vue';
import { LockOutlined } from '@ant-design/icons-vue';
import { BASE_API_PATH, TOKEN_KEY } from '@/utils/variable';
import { LocalStore, getImage } from '@/utils/comm';
import { message, UploadChangeParam, UploadFile } from 'ant-design-vue';
import {
    getMeInfo_api,
    getSsoBinds_api,
    unBind_api,
} from '@/api/account/center';
import moment from 'moment';
import { getMe_api, getView_api, setView_api } from '@/api/home';
import { isNoCommunity } from '@/utils/utils';
import { userInfoType } from './typing';

const permission = 'system/User';
const userInfo = ref<userInfoType>({});
// 第三方账号
const bindList = ref<any[]>([]);
const bindIcon = {
    'dingtalk-ent-app': '/notice/dingtalk.png',
    'wechat-webapp': '/notice/wechat.png',
    'internal-standalone': '/apply/provider1.png',
    'third-party': '/apply/provider5.png',
};
const unBind = (id: string) => {
    unBind_api(id).then((resp) => {
        if (resp.status === 200) {
            message.success('解绑成功');
            getSsoBinds();
        }
    });
};
const clickBind = (id: string) => {
    window.open(`/${origin}/application/sso/${id}/login?autoCreateUser=false`);
    localStorage.setItem('onBind', 'false');
    localStorage.setItem('onLogin', 'yes');
    window.onstorage = (e) => {
        if (e.newValue) {
            getSsoBinds();
        }
    };
};
const upload = reactive({
    fileList: [] as any[],
    uploadLoading: false,
    changeBackUpload: (info: UploadChangeParam<UploadFile<any>>) => {
        if (info.file.status === 'uploading') {
            upload.uploadLoading = true;
        } else if (info.file.status === 'done') {
            info.file.url = info.file.response?.result;
            upload.uploadLoading = false;
            userInfo.value.avatar = info.file.response?.result;
        } else if (info.file.status === 'error') {
            upload.uploadLoading = false;
            message.error('logo上传失败，请稍后再试');
        }
    },
    beforeUpload: ({ size, type }: File) => {
        const imageTypes = ['jpg', 'png', 'jfif', 'pjp', 'pjpeg', 'jpeg'];
        const typeBool =
            imageTypes.filter((typeStr) => type.includes(typeStr)).length > 0;
        const sizeBool = size < 4 * 1024 * 1024;

        (typeBool && sizeBool) || message.error('请上传正确格式的图片');
        return typeBool && sizeBool;
    },
});
// 首页视图
const isApiUser = ref<boolean>();
const currentView = ref<string>('');
const confirm = () => {
    setView_api({
        name: 'view',
        content: currentView.value,
    }).then(() => message.success('保存成功'));
};

const editInfoVisible = ref<boolean>(false);
const editPasswordVisible = ref<boolean>(false);
init();

function init() {
    getUserInfo();
    isNoCommunity && getSsoBinds();
    getViews();
}

/**
 * 获取用户信息
 */
function getUserInfo() {
    getMeInfo_api().then((resp) => {
        userInfo.value = resp.result as userInfoType;
    });
}
/**
 * 获取绑定第三方账号
 */
function getSsoBinds() {
    getSsoBinds_api().then((resp: any) => {
        if (resp.status === 200) bindList.value = resp.result;
    });
}
/**
 * 获取首页视图
 */
function getViews() {
    // 判断是否是api用户 不是则获取选中的视图
    getMe_api()
        .then((resp: any) => {
            if (resp && resp.status === 200) {
                isApiUser.value = resp.result.dimensions.find(
                    (item: any) =>
                        item.type === 'api-client' ||
                        item.type.id === 'api-client',
                );
                if (!isApiUser.value) return getView_api();
            }
        })
        .then((resp: any) => {
            if (resp?.status === 200) {
                if (resp.result) currentView.value = resp.result?.content;
                else if (resp.result.username === 'admin') {
                    currentView.value = 'comprehensive';
                } else currentView.value = 'init';
            }
        });
}
</script>

<style lang="less" scoped>
.center-container {
    background-color: #f0f2f5;
    min-height: 100vh;
    .card {
        margin: 16px 0;
        padding: 24px;
        background-color: #fff;
        position: relative;

        h3 {
            font-size: 22px;

            &::before {
                display: inline-block;
                width: 3px;
                height: 0.7em;
                content: '';
                background-color: #2f54eb;
                margin: 0 8px;
            }
        }

        .content {
            display: flex;
            margin-top: 24px;
            flex-wrap: wrap;
            .content-item {
                margin-right: 24px;

                .default-avatar {
                    background-color: #ccc;
                    color: #fff;
                    border-radius: 50%;
                    font-size: 70px;
                    width: 140px;
                    height: 140px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .info-card {
                    width: 25%;

                    :first-child {
                        font-weight: bold;
                    }
                    :last-child {
                        color: #666363d9;
                    }
                }
                &.flex-item {
                    display: flex;
                    flex-wrap: wrap;
                }
            }

            .edit {
                position: absolute;
                cursor: pointer;
                top: 30px;
                right: 24px;
                color: #1d39c4;
            }

            .account-card {
                margin-right: 24px;
                width: 415px;
                background-image: url(/images/notice/dingtalk-background.png);
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 24px;
            }
        }

        .choose-view {
            width: 100%;
            margin-top: 48px;
            .view-content {
                display: flex;
                flex-flow: row wrap;
                .select-item {
                    border: 2px solid transparent;
                    img {
                        width: 100%;
                    }

                    &.selected {
                        border-color: #10239e;
                    }
                }
            }

            .btn {
                display: block;
                margin: 48px auto;
                margin-bottom: 0;
            }
        }
    }
}
</style>
