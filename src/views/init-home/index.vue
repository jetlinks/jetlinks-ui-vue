<!-- 系统初始化 -->
<template>
    <div class="page-container">
        <div class="container-text">
            <div class="container-title">{{ $t('init-home.index.633470-0') }}</div>
        </div>
        <div class="container-box">
            <div class="container-main">
                <div class="container-right">
                    <j-spin :spinning="spinning">
                        <j-collapse v-model:activeKey="activeKey" accordion>
                            <j-collapse-panel key="1">
                                <template #header>
                                    <span class="title">{{ $t('init-home.index.633470-1') }}</span>
                                    <span class="sub-title"
                                        >{{ $t('init-home.index.633470-2') }}</span
                                    >
                                </template>
                                <Basic ref="basicRef" />
                            </j-collapse-panel>
                            <j-collapse-panel key="2" forceRender>
                                <template #header>
                                    <span class="title">{{ $t('init-home.index.633470-3') }}</span>
                                    <span class="sub-title"
                                        >{{ $t('init-home.index.633470-4') }}</span
                                    >
                                </template>
                                <Menu ref="menuRef"></Menu>
                            </j-collapse-panel>
                            <j-collapse-panel key="3" forceRender>
                                <template #header>
                                    <span class="title">{{ $t('init-home.index.633470-5') }}</span>
                                    <span class="sub-title"
                                        >{{ $t('init-home.index.633470-6') }}</span
                                    >
                                </template>
                                <Role ref="roleRef"></Role>
                            </j-collapse-panel>
                            <j-collapse-panel key="4" forceRender>
                                <template #header>
                                    <span class="title">{{ $t('init-home.index.633470-7') }}</span>
                                    <span class="sub-title"
                                        >{{ $t('init-home.index.633470-8') }}</span
                                    >
                                </template>
                                <InitData ref="initDataRef"></InitData>
                            </j-collapse-panel>
                        </j-collapse>
                    </j-spin>
                    <j-button
                        type="primary"
                        class="btn-style"
                        @click="submitData"
                        :loading="loading"
                        >{{ $t('init-home.index.633470-9') }}</j-button
                    >
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import Basic from './Basic/index.vue';
import Role from './Role/index.vue';
import Menu from './Menu/index.vue';
import InitData from './InitData/index.vue';
import { getInit, saveInit } from '@/api/initHome';
import { BASE_API_PATH, TOKEN_KEY } from '@/utils/variable';
import { FILE_UPLOAD } from '@/api/comm';
import { onlyMessage } from '@/utils/comm';
import { useUserInfo } from '@/store/userInfo';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const basicRef = ref();
const roleRef = ref();
const initDataRef = ref();
const menuRef = ref();
const loading = ref(false);
/**
 * 默认打开第一个初始菜单
 */
const activeKey = ref<string>('1');
const spinning = ref<boolean>(false);
const userInfo = useUserInfo();
// const action = ref<string>(`${BASE_API_PATH}/file/static`);
// const headers = ref({ [TOKEN_KEY]: LocalStore.get(TOKEN_KEY) });
/**
 * 提交基础表单
 */
/**
 * 跳转首页
 */
const jump = () => {
    window.location.href = '/';
};
/**
 * 提交所有数据
 */
const submitData = async () => {
    loading.value = true;
    const basicRes = await basicRef.value.submitBasic();
    if (!basicRes) {
        loading.value = false;
        return;
    }
    const menuRes = await menuRef.value.updataMenu();
    if (!menuRes) {
        loading.value = false;
        return;
    }
    const roleRes = await roleRef.value.submitRole();
    console.log(roleRes);
    if (!roleRes) {
        loading.value = false;
        return;
    }
    const roleGroupRes = await roleRef.value.submitRoleGroup();
    if (!roleGroupRes) {
        loading.value = false;
        return;
    }
    const initDataRes = await initDataRef.value.save();
    if (!initDataRes) {
        loading.value = false;
        return;
    }
    loading.value = false;
    // 当前数据是否成功提交
    if (basicRes && menuRes && roleRes && roleGroupRes && initDataRes) {
        onlyMessage($t('init-home.index.633470-10'));
        //     // 记录初始化数据，跳转首页
        const res = await saveInit();
        if (res.status === 200) {
            jump();
        }
    }
};
/**
 * 判断是否已有配置
 */
const judgeInitSet = async () => {
    const resp: any = await getInit();
    if (resp.status === 200 && resp.result.length) {
        // window.location.href = '/';
    }
};
onBeforeMount(() => {
    judgeInitSet();
});
</script>
<style scoped lang="less">
.page-container {
    width: 100%;
    height: 100vh;
    padding: 32px 128px 64px;
    overflow: hidden;
    background-image: url(/images/init-home/background.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .container-text {
        font-weight: 700;
        font-size: 16px;
        .container-title {
            position: relative;
            padding-left: 10px;
            color: rgba(0, 0, 0, 0.8);
            font-weight: 600;
            line-height: 1;
            &:before {
                position: absolute;
                top: 0;
                left: 0;
                width: 4px;
                height: 100%;
                background-color: @primary-color;
                border-radius: 0 3px 3px 0;
                content: '';
            }
        }
    }
    .container-box {
        width: 100%;
        height: 100%;
        padding: 24px;
        background: #fff;
        .container-main {
            display: flex;
            justify-content: space-between;
            width: 100%;
            height: 100%;
            overflow-y: auto;
            .container-right {
                width: calc(100% - 70px);
                .title {
                    font-size: 15px;
                }
                .sub-title {
                    margin-top: 2px;
                    margin-left: 8px;
                    color: #666;
                    font-size: 12px;
                    opacity: 0.85;
                }
                .img-style {
                    width: 16px;
                    height: 16px;
                    margin-left: 5px;
                }

                .upload-image-warp-logo {
                    display: flex;
                    justify-content: flex-start;
                    .upload-image-border-logo {
                        position: relative;
                        overflow: hidden;
                        border: 1px dashed #d9d9d9;
                        transition: all 0.3s;
                        width: 160px;
                        height: 150px;
                        &:hover {
                            border: 1px dashed #1890ff;
                            display: flex;
                        }
                        .upload-image-content-logo {
                            align-items: center;
                            justify-content: center;
                            position: relative;
                            display: flex;
                            flex-direction: column;
                            width: 160px;
                            height: 150px;
                            padding: 8px;
                            background-color: rgba(0, 0, 0, 0.06);
                            cursor: pointer;
                            .loading-logo {
                                position: absolute;
                                top: 50%;
                            }
                            .loading-icon {
                                position: absolute;
                            }
                            .upload-image {
                                width: 100%;
                                height: 100%;
                                background-repeat: no-repeat;
                                background-position: 50%;
                                background-size: cover;
                            }
                            .upload-image-icon {
                                width: 100%;
                                height: 100%;
                                background-repeat: no-repeat;
                                background-position: 50%;
                                background-size: inherit;
                            }
                            .upload-image-mask {
                                align-items: center;
                                justify-content: center;
                                position: absolute;
                                top: 0;
                                left: 0;
                                display: none;
                                width: 100%;
                                height: 100%;
                                color: #fff;
                                font-size: 16px;
                                background-color: rgba(0, 0, 0, 0.35);
                            }
                            &:hover .upload-image-mask {
                                display: flex;
                            }
                        }
                    }
                }

                .upload-image-warp-back {
                    display: flex;
                    justify-content: flex-start;
                    .upload-image-border-back {
                        position: relative;
                        overflow: hidden;
                        border: 1px dashed #d9d9d9;
                        transition: all 0.3s;
                        width: 570px;
                        height: 415px;
                        &:hover {
                            border: 1px dashed #1890ff;
                            display: flex;
                        }
                        .upload-image-content-back {
                            align-items: center;
                            justify-content: center;
                            position: relative;
                            display: flex;
                            flex-direction: column;
                            width: 570px;
                            height: 415px;
                            padding: 8px;
                            background-color: rgba(0, 0, 0, 0.06);
                            cursor: pointer;
                            .loading-back {
                                position: absolute;
                            }
                            .upload-image {
                                width: 100%;
                                height: 100%;
                                background-repeat: no-repeat;
                                background-position: 50%;
                                background-size: cover;
                            }
                            .upload-image-mask {
                                align-items: center;
                                justify-content: center;
                                position: absolute;
                                top: 0;
                                left: 0;
                                display: none;
                                width: 100%;
                                height: 100%;
                                color: #fff;
                                font-size: 16px;
                                background-color: rgba(0, 0, 0, 0.35);
                            }
                            &:hover .upload-image-mask {
                                display: flex;
                            }
                        }
                    }
                }
                .upload-tips {
                    color: rgba(0, 0, 0, 0.45);
                    font-size: 14px;
                    line-height: 1.5715;
                }
                // .uplod-style {
                //     :deep(.ant-upload.ant-upload-select-picture-card) {
                //         width: 180px;
                //         height: 180px;
                //     }
                // }
                .btn-style {
                    margin-top: 20px;
                    color: #fff;
                    border-color: @primary-color;
                    background: @primary-color;
                }
            }
        }
    }
    ::-webkit-scrollbar {
        width: 12px;
    }

    /* 滚动槽 */
    ::-webkit-scrollbar-track {
        background: #f2f2f2;
        border-radius: 8px;
    }

    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
        background: #cecece;
        border-radius: 8px;
    }
}
</style>
