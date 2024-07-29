<template>
    <j-modal
        title="诊断"
        :maskClosable="false"
        :visible="true"
        @cancel="handleModalClose"
        style="width: 65%"
        :footer="null"
    >
        <div class="content" ref="contentDivRef">
            <div class="container" ref="containerRef">
                <div class="hd">
                    <div class="flex-lt">
                        <p>ID：{{ deviceId }}</p>
                    </div>
                    <div class="flex-rt">
                        <template v-for="(item, index) in btnList" :key="index">
                            <a-button
                                :type="item.type ? item.type : 'default'"
                                :ghost="item.ghost ? item.ghost : false"
                                :loading="item.loading"
                                :disabled="item.loading"
                                @click="handleBtnClick(index)"
                                v-if="item.show"
                            >
                                <template #icon>
                                    <a-icon :type="item.icon" />
                                </template>
                                {{ item.text }}
                            </a-button>
                        </template>
                    </div>
                </div>
                <div class="bd">
                    <div class="diagnose-list">
                        <!-- 这个组件复制自device/instance/detail/diagnose/status，并在此基础上修改 -->
                        <Status
                            v-show="true"
                            ref="statusRef"
                            :providerType="deviceType as TypeProps"
                            :device-status="deviceState"
                            @showFix="controlFix"
                            @countChange="countChange"
                            @percentChange="percentChange"
                            @stateChange="stateChange"
                        /><diagnose-item v-if="otherDiagnoseIsShow" />
                    </div>
                </div>
            </div>
        </div>
    </j-modal>
</template>
<script setup lang="ts">
import { onlyMessage } from '@/utils/comm';
import { ButtonType } from 'ant-design-vue/es/button';
import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import dayjs from 'dayjs';
import Status from '@/views/device/OfflineManage/components/diagnose/components/status/index';
import type { TypeProps } from '@/views/device/OfflineManage/typings';
import DiagnoseItem from '@/views/device/OfflineManage/components/diagnose/components/diagnoseItem/index.vue';
// import Status from '@/views/device/Instance/Detail/Diagnose/Status/index';

defineOptions({
    name: 'DiagnoseModal',
});

interface IProps {
    deviceId: string;
    deviceState: string;
    deviceType: string;
}

const props = defineProps<IProps>();
const emits = defineEmits(['confirm', 'update:close']);

// 诊断content的dom
const contentDivRef = ref<HTMLDivElement>();
// 诊断项列表的dom
const containerRef = ref<HTMLDivElement>();

// status组件
const statusRef = ref<InstanceType<typeof Status>>();
const otherDiagnoseIsShow = ref(false);

// 显示修复按钮
const controlFix = () => {
    btnList[0].show = true;
};

// 关闭弹窗
const handleModalClose = () => {
    btnList[0].show = false;
    emits('update:close', false);
};

// 立即修复
const handleFix = () => {
    // ts检测不到tsx上暴露的方法，所以需要忽略检测
    // @ts-ignore
    statusRef?.value?.handleFix().then(() => {
        btnList[0].loading = false;
    });
};

// 重新诊断
const handleDiagnose = () => {
    // @ts-ignore
    statusRef?.value?.handleSearch().then(() => {
        btnList[1].loading = false;
    });
};

// 导出诊断结果
const handleExport2Pdf = () => {
    if (contentDivRef.value && containerRef.value) {
        const w = contentDivRef.value.clientWidth,
            scrollH = contentDivRef.value.scrollHeight;

        html2canvas(containerRef.value, {
            width: w, // canvas宽度
            height: scrollH,
            windowHeight: scrollH,
            allowTaint: true,
            backgroundColor: '#fffff', //画出来的图片有白色的边框,不要可设置背景为透明色（null）
            useCORS: true, //支持图片跨域
            x: 0, //x坐标
            y: 0, //y坐标
            onclone: (document) => {
                // 这里不使用ref去修改，因为操作ref不会立即修改dom
                (
                    document.querySelector('.flex-rt') as HTMLElement
                ).style.opacity = '0';
            },
        })
            .then((canvas) => {
                const img = canvas.toDataURL('image/png', 1.0);
                const pdf = new JsPDF('p', 'mm', 'a4');
                const imgProps = pdf.getImageProperties(img); // 获取图片属性
                const pdfWidth = pdf.internal.pageSize.getWidth(); // 获取PDF页面宽度
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width; // 根据宽度计算高度
                pdf.addImage(img, 'png', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`诊断结果${dayjs().format('YYYYMMDDHHmmss')}.pdf`);
                btnList[2].loading = false;
                onlyMessage('导出完成');
                (
                    document.querySelector('.flex-rt') as HTMLElement
                ).style.opacity = '1';
            })
            .catch((err) => {
                console.warn(err);
            });
    }
};

// 按钮组的按钮的点击事件
const handleBtnClick = (index: number) => {
    btnList[index].loading = true;
    btnList[index].event();
};

// 按钮组配置
const btnList = reactive<
    {
        text: string;
        type?: ButtonType;
        event: () => void;
        ghost?: boolean;
        icon?: string;
        loading: boolean;
        show: boolean;
    }[]
>([
    {
        text: '一键修复',
        type: 'primary',
        event: handleFix,
        icon: 'ToolOutlined',
        loading: false,
        show: false,
    },
    {
        text: '重新诊断',
        event: handleDiagnose,
        type: 'primary',
        ghost: true,
        icon: 'SecurityScanOutlined',
        loading: false,
        show: true,
    },
    {
        text: '导出',
        event: handleExport2Pdf,
        icon: 'ExportOutlined',
        loading: false,
        show: true,
    },
]);

const topState = ref<'loading' | 'success' | 'error'>('loading');
const count = ref<number>(0);
const percent = ref<number>(0);

const percentChange = (num: number) => {
    if (num === 0) {
        percent.value = 0;
    } else if (percent.value < 100 && !num) {
        percent.value += 20;
    } else {
        percent.value = num;
    }
};

const stateChange = (_type: 'loading' | 'success' | 'error') => {
    topState.value = _type;
};

const countChange = (num: number) => {
    count.value = num;
};

onMounted(() => {
    watch(
        () => statusRef?.value?.showOtherDiagnose,
        (val) => {
            console.log('watch status', val);
            if (val === true) {
                otherDiagnoseIsShow.value = true;
            }
        },
    );
});
</script>

<style scoped lang="less">
.content {
    & > img {
        display: block;
        height: fit-content;
    }
    height: 75vh;
    overflow-y: auto;
    p {
        margin-bottom: 0;
    }
    .hd {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .flex-lt {
            font-size: 16px;
            line-height: 24px;
        }
        .flex-rt {
            display: flex;
            gap: 16px;
        }
    }
    .bd {
        margin-top: 16px;
    }
}
</style>
