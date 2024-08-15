<template>
    <div class="doc">
        <div className="url">
            {{ $t('Detail.doc.613239-0') }}
            <a
                :style="{ wordBreak: 'break-all' }"
                href="https://help.aliyun.com/document_detail/87368.html"
                target="_blank"
                rel="noreferrer"
            >
                https://help.aliyun.com/document_detail/87368.html
            </a>
        </div>
        <h1>{{ $t('Detail.doc.613239-1') }}</h1>
        <div>
            {{ $t('Detail.doc.613239-2') }}
        </div>
        <div class="image">
            <j-image width="100%" :src="getImage('/northbound/aliyun2.png')" />
        </div>
        <h1>{{ $t('Detail.doc.613239-3') }}</h1>
        <div>
            <h2>{{ $t('Detail.doc.613239-4') }}</h2>
            <div>
                {{ $t('Detail.doc.613239-5') }}
            </div>
            <div>{{ $t('Detail.doc.613239-6') }}</div>
            <div class="image">
                <j-image
                    width="100%"
                    :src="getImage('/northbound/aliyun3.png')"
                />
            </div>
            <h2>2、AccesskeyID/Secret</h2>
            <div>
                {{ $t('Detail.doc.613239-7') }}
            </div>
            <div class="image">
                <j-image
                    width="100%"
                    :src="getImage('/northbound/aliyun1.jpg')"
                />
            </div>
            <h2>{{ $t('Detail.doc.613239-8') }}</h2>
            <div>
                {{ $t('Detail.doc.613239-9') }}
            </div>
            <h2>{{ $t('Detail.doc.613239-10') }}</h2>
            <div>
                {{ $t('Detail.doc.613239-11') }}
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
