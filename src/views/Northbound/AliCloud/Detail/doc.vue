<template>
    <div class="doc">
        <div className="url">
            阿里云物联网平台：
            <a
                :style="{ wordBreak: 'break-all' }"
                href="https://help.aliyun.com/document_detail/87368.html"
                target="_blank"
                rel="noreferrer"
            >
                https://help.aliyun.com/document_detail/87368.html
            </a>
        </div>
        <h1>1. 概述</h1>
        <div>
            在特定场景下，设备无法直接接入阿里云物联网平台时，您可先将设备接入物联网平台，再使用阿里云“云云对接SDK”，快速构建桥接服务，搭建物联网平台与阿里云物联网平台的双向数据通道。
        </div>
        <div class="image">
            <j-image width="100%" :src="getImage('/northbound/aliyun2.png')" />
        </div>
        <h1>2.配置说明</h1>
        <div>
            <h2>1、服务地址</h2>
            <div>
                阿里云内部给每台机器设置的唯一编号。请根据购买的阿里云服务器地址进行选择。
            </div>
            <div>获取路径：“阿里云物联网平台”--“服务地址”</div>
            <div class="image">
                <j-image
                    width="100%"
                    :src="getImage('/northbound/aliyun3.png')"
                />
            </div>
            <h2>2、AccesskeyID/Secret</h2>
            <div>
                用于程序通知方式调用云服务费API的用户标识和秘钥获取路径：“阿里云管理控制台”--“用户头像”--“”--“AccessKey管理”--“查看”
            </div>
            <div class="image">
                <j-image
                    width="100%"
                    :src="getImage('/northbound/aliyun1.jpg')"
                />
            </div>
            <h2>3. 网桥产品</h2>
            <div>
                物联网平台对于阿里云物联网平台，是一个网关设备，需要映射到阿里云物联网平台的具体产品
            </div>
            <h2>4. 产品映射</h2>
            <div>
                将阿里云物联网平台中的产品实例与物联网平台的产品实例进行关联。关联后需要进入该产品下的每一个设备的实例信息页，填入对应的阿里云物联网平台设备的DeviceName、DeviceSecret进行一对一绑定。
            </div>
            <div class="image">
                <j-image
                    width="100%"
                    :src="getImage('/northbound/aliyun4.png')"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getImage } from '@/utils/comm';
</script>

<style lang="less" scoped>
.doc {
    height: 100%;
    padding: 24px;
    overflow-y: auto;
    color: rgba(#000, 0.8);
    font-size: 14px;
    background-color: #fafafa;
    &::-webkit-scrollbar {
        width: 5px; /* 滚动条宽度 */
        background-color: #edf5ff; /* 滚动条背景色 */
    }
    &::-webkit-scrollbar-thumb {
        background-color: #d0d0d0; /* 滚动条拖动部分颜色 */
        border-radius: 4px; /* 滚动条拖动部分圆角 */
    }

    .url {
        padding: 8px 16px;
        color: #2f54eb;
        background-color: rgba(#a7bdf7, 0.2);
    }

    h1 {
        margin: 16px 0;
        color: rgba(#000, 0.85);
        font-weight: bold;
        font-size: 14px;

        &:first-child {
            margin-top: 0;
        }
    }

    h2 {
        margin: 6px 0;
        color: rgba(0, 0, 0, 0.8);
        font-size: 14px;
    }

    .image {
        margin: 16px 0;
    }
}
</style>
