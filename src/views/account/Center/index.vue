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
                            :src="userInfo.avatar"
                            style="width: 140px; border-radius: 70px"
                            alt=""
                        />
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
                            >
                                <a-button>
                                    <AIcon type="UploadOutlined" />
                                    更换头像
                                </a-button>
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
                            <p>{{ userInfo.createTime }}</p>
                        </div>
                        <div class="info-card">
                            <p>电话</p>
                            <p>{{ userInfo.telephone }}</p>
                        </div>
                        <div class="info-card">
                            <p>姓名</p>
                            <p>{{ userInfo.name }}</p>
                        </div>
                        <div class="info-card">
                            <p>角色</p>
                            <p>{{ userInfo.roleList.join(',') || '-' }}</p>
                        </div>
                        <div class="info-card">
                            <p>组织</p>
                            <p>{{ userInfo.orgList.join(',') || '-' }}</p>
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
                    <AIcon type="EditOutlined" class="edit" />
                </div>
            </div>
            <div class="card">
                <h3>绑定三方账号</h3>
                <div class="content">
                    <div class="account-card" v-for="item in bindList">
                        <img
                            :src="getImage(bindIcon[item.provider])"
                            style="height: 50px"
                            alt=""
                        />
                        <div class="text">
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
                        </div>

                        <a-button v-if="item.bound">解除绑定</a-button>
                        <a-button v-else type="primary">立即绑定</a-button>
                    </div>
                </div>
            </div>
            <div class="card">
                <h3>首页视图</h3>
            </div>
        </div>
    </page-container>
</template>

<script setup lang="ts">
import { LockOutlined } from '@ant-design/icons-vue';
import { BASE_API_PATH, TOKEN_KEY } from '@/utils/variable';
import { LocalStore, getImage } from '@/utils/comm';
import { useUserInfo } from '@/store/userInfo';
import { message, UploadChangeParam, UploadFile } from 'ant-design-vue';
import { getSsoBinds_api } from '@/api/account/center';
import moment from 'moment';

const userInfo = useUserInfo().$state.userInfos as any as userInfoType;
const bindList = ref<any[]>([]);
const bindIcon = {
    'dingtalk-ent-app': '/notice/dingtalk.png',
    'wechat-webapp': '/notice/wechat.png',
    'internal-standalone': '/apply/provider1.png',
    'third-party': '/apply/provider5.png',
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
            userInfo.avatar = info.file.response?.result;
        } else if (info.file.status === 'error') {
            console.log(info.file);
            upload.uploadLoading = false;
            message.error('logo上传失败，请稍后再试');
        }
    },
});

init();
function init() {
    getSsoBinds_api().then((resp: any) => {
        if (resp.status === 200) bindList.value = resp.result;
    });
}

type userInfoType = {
    avatar: string;
    createTime: number;
    email: string;
    id: string;
    name: string;
    orgList: string[];
    roleList: string[];
    status: number;
    telephone: string;
    tenantDisabled: boolean;
    type: { name: string; id: string };
    username: string;
};
</script>

<style lang="less" scoped>
.center-container {
    background-color: #f0f2f5;
    min-height: 100vh;
    .card {
        margin: 24px;
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
            .content-item {
                margin-right: 24px;
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

                .text {
                    display: -webkit-box;
                    font-size: 22px;
                    width: 150px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-break: break-all;
                }
            }
        }
    }
}
</style>
