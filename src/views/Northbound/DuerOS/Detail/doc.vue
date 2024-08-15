<template>
    <div class="doc">
        <div class="url">
            {{ $t('Detail.doc.613233-0') }}
            <a
                href="https://dueros.baidu.com/dbp/bot/index#/iotopenplatform"
                target="_blank"
                rel="noopener noreferrer"
            >
                https://dueros.baidu.com/dbp/bot/index#/iotopenplatform
            </a>
        </div>
        <h1>{{ $t('Detail.doc.613233-1') }}</h1>
        <div>
            {{ $t('Detail.doc.613233-2') }}
        </div>
        <h1>{{ $t('Detail.doc.613233-3') }}</h1>
        <div>
            <div>{{ $t('Detail.doc.613233-4') }}</div>
            <div>
                {{ $t('Detail.doc.613233-5') }}
            </div>
            <div class="image">
                <j-image
                    width="100%"
                    :src="getImage('/cloud/dueros-doc.jpg')"
                />
                <div class="desc">{{ $t('Detail.doc.613233-6') }}</div>
            </div>
            <j-descriptions
                bordered
                size="small"
                :column="1"
                :labelStyle="{ width: '100px' }"
            >
                <j-descriptions-item :label="$t('Detail.doc.613233-7')">{{ $t('Detail.doc.613233-8') }}</j-descriptions-item>
                <j-descriptions-item :label="$t('Detail.doc.613233-9')"
                    >{{ $t('Detail.doc.613233-10') }}</j-descriptions-item
                >
                <j-descriptions-item label="Client_Id">
                    {{ $t('Detail.doc.613233-11') }}
                </j-descriptions-item>
                <j-descriptions-item label="Scope">
                    {{ $t('Detail.doc.613233-12') }}
                </j-descriptions-item>
                <j-descriptions-item :label="$t('Detail.doc.613233-13')">
                    {{ $t('Detail.doc.613233-14') }}
                </j-descriptions-item>
                <j-descriptions-item label="ClientSecret">
                    {{ $t('Detail.doc.613233-15') }}
                </j-descriptions-item>
                <j-descriptions-item label="WebService">
                    {{ $t('Detail.doc.613233-16') }}
                </j-descriptions-item>
            </j-descriptions>
            <div class="image">
                <j-image
                    width="100%"
                    :src="getImage('/cloud/dueros-doc1.png')"
                />
                <div class="desc">{{ $t('Detail.doc.613233-17') }}</div>
            </div>
            <j-descriptions
                bordered
                size="small"
                :column="1"
                :labelStyle="{ width: '100px' }"
            >
                <j-descriptions-item :label="$t('Detail.doc.613233-7')">{{ $t('Detail.doc.613233-8') }}</j-descriptions-item>
                <j-descriptions-item label="appId">
                    {{ $t('Detail.doc.613233-18') }}
                </j-descriptions-item>
                <j-descriptions-item label="secureKey">
                    {{ $t('Detail.doc.613233-19') }}
                </j-descriptions-item>
                <j-descriptions-item :label="$t('Detail.doc.613233-20')">
                    {{ $t('Detail.doc.613233-21') }}
                </j-descriptions-item>
                <j-descriptions-item :label="$t('Detail.doc.613233-22')">
                    {{ $t('Detail.doc.613233-23') }}
                </j-descriptions-item>
                <j-descriptions-item label="redirectUrl">
                    {{ $t('Detail.doc.613233-24') }}
                </j-descriptions-item>
                <j-descriptions-item :label="$t('Detail.doc.613233-25')">
                    {{ $t('Detail.doc.613233-26') }}
                </j-descriptions-item>
            </j-descriptions>
            <div>{{ $t('Detail.doc.613233-27') }}</div>
            <div>
                {{ $t('Detail.doc.613233-28') }}
            </div>
        </div>
        <h1>{{ $t('Detail.doc.613233-29') }}</h1>
        <div>
            {{ $t('Detail.doc.613233-30') }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getImage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
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
        word-wrap: break-word;
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

        .desc {
            width: 100%;
            text-align: center;
            color: rgb(138, 143, 141);
            margin-top: 10px;
        }
    }
}
</style>
