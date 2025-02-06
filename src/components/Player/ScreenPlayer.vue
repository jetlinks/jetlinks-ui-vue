<!-- 分屏组件 -->
<template>
    <div class="live-player-warp">
        <div class="live-player-content">
            <!-- 工具栏 -->
            <div class="player-screen-tool" v-if="showScreen">
                <a-radio-group
                    :value="screen"
                    button-style="solid"
                    @change="handleScreenChange"
                >
                    <a-radio-button :value="1">{{ $t('Player.ScreenPlayer.521467-0') }}</a-radio-button>
                    <a-radio-button :value="4">{{ $t('Player.ScreenPlayer.521467-1') }}</a-radio-button>
                    <a-radio-button :value="9">{{ $t('Player.ScreenPlayer.521467-2') }}</a-radio-button>
                    <a-radio-button :value="0">{{ $t('Player.ScreenPlayer.521467-3') }}</a-radio-button>
                </a-radio-group>
                <div class="screen-tool-save">
                    <a-space>
                        <a-tooltip :title="$t('Player.ScreenPlayer.521467-4')">
                            <AIcon type="QuestionCircleOutlined" />
                        </a-tooltip>
                        <a-popover
                            v-model:visible="visible"
                            trigger="click"
                            :title="$t('Player.ScreenPlayer.521467-5')"
                        >
                            <template #content>
                                <a-form
                                    ref="formRef"
                                    :model="formData"
                                    layout="vertical"
                                >
                                    <a-form-item
                                        name="name"
                                        :rules="[
                                            {
                                                required: true,
                                                message: $t('Player.ScreenPlayer.521467-6'),
                                            },
                                            {
                                                max: 64,
                                                message: $t('Player.ScreenPlayer.521467-7'),
                                            },
                                        ]"
                                    >
                                        <a-textarea
                                            v-model:value="formData.name"
                                        />
                                    </a-form-item>
                                    <a-button
                                        type="primary"
                                        @click="saveHistory"
                                        :loading="loading"
                                        style="width: 100%; margin-top: 16px"
                                    >
                                        {{ $t('Player.ScreenPlayer.521467-8') }}
                                    </a-button>
                                </a-form>
                            </template>
                            <a-dropdown-button
                                type="primary"
                                @click="visible = true"
                            >
                                {{ $t('Player.ScreenPlayer.521467-8') }}
                                <template #overlay>
                                    <a-menu>
                                        <a-empty
                                            v-if="!historyList.length"
                                            :description="$t('Player.ScreenPlayer.521467-9')"
                                        />
                                        <a-menu-item
                                            v-for="(item, index) in historyList"
                                            :key="`his${index}`"
                                            @click="handleHistory(item)"
                                        >
                                            <a-space>
                                                <span>{{ item.name }}</span>
                                                <j-permission-button
                                                    type="text"
                                                    :popConfirm="{
                                                    title: $t('Player.ScreenPlayer.521467-10'),
                                                    onConfirm: (e: any) => {
                                                        e?.stopPropagation();
                                                        deleteHistory(item.key);
                                                    }
                                                }"
                                                >
                                                    <AIcon
                                                        type="DeleteOutlined"
                                                    />
                                                </j-permission-button>
                                            </a-space>
                                        </a-menu-item>
                                    </a-menu>
                                </template>
                            </a-dropdown-button>
                        </a-popover>
                    </a-space>
                </div>
            </div>
            <!-- 播放器 -->
            <div class="player-body">
                <div
                    ref="fullscreenRef"
                    class="player-screen"
                    :class="`screen-${screen}`"
                >
                    <template v-for="(item, index) in players" :key="item.key">
                        <div
                            class="player-screen-item"
                            :class="{
                                active:
                                    showScreen &&
                                    playerActive === index &&
                                    !isFullscreen,
                                'full-screen': isFullscreen,
                            }"
                            :style="{ display: item.show ? 'block' : 'none' }"
                            @click="playerActive = index"
                        >
                            <div
                                class="media-btn-refresh refreshBtn"
                                :style="{
                                    display: item.url ? 'block' : 'none',
                                }"
                                @click="handleRefresh($event, item, index)"
                            >
                                {{ $t('Player.ScreenPlayer.521467-11') }}
                            </div>
                            <LivePlayer :live="true" :url="item.url" autoplay />
                        </div>
                    </template>
                </div>
            </div>
            <!-- 控制器 -->
        </div>
        <MediaTool @onMouseDown="handleMouseDown" @onMouseUp="handleMouseUp" />
    </div>
</template>

<script setup lang="ts">
import { useFullscreen } from '@vueuse/core';
import {
    deleteSearchHistory,
    getSearchHistory,
    saveSearchHistory,
} from '@/api/comm';
import LivePlayer from './index.vue';
import MediaTool from './mediaTool.vue';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
type Player = {
    id?: string;
    url?: string;
    channelId?: string;
    key: string;
    show: boolean;
};

interface ScreenProps {
    url?: string;
    id?: string;
    channelId: string;
    className?: string;
    historyHandle?: (deviceId: string, channelId: string) => string;
    /**
     *
     * @param id 当前选中播发视频ID
     * @param type 当前操作动作
     */
    onMouseDown?: (deviceId: string, channelId: string, type: string) => void;
    /**
     *
     * @param id 当前选中播发视频ID
     * @param type 当前操作动作
     */
    onMouseUp?: (deviceId: string, channelId: string, type: string) => void;
    showScreen?: boolean;
}

const props = defineProps<ScreenProps>();

const DEFAULT_SAVE_CODE = 'screen-save';

// 分屏数量 1/4/9/0
const screen = ref(1);
// 视频窗口
const players = ref<Player[]>([]);
// 当前选中的窗口
const playerActive = ref(0);
// 历史记录
const historyList = ref<any[]>([]);
// 展示保存浮窗
const visible = ref(false);
const loading = ref(false);
// 保存表单
const formRef = ref();
const formData = ref({
    name: '',
});

// 全屏元素
const fullscreenRef = ref(null);
const { isFullscreen, enter, exit, toggle } = useFullscreen(fullscreenRef);

/**
 * 刷新视频
 * @param id
 * @param channelId
 * @param url
 * @param index
 */
const reloadPlayer = (
    id: string,
    channelId: string,
    url: string,
    index: number,
) => {
    const olPlayers = [...players.value];
    olPlayers[index] = {
        id: '',
        channelId: '',
        url: '',
        key: olPlayers[index].key,
        show: true,
    };
    const newPlayer = {
        id,
        url,
        channelId,
        key: olPlayers[index].key,
        show: true,
    };
    players.value = [...olPlayers];
    setTimeout(() => {
        olPlayers[index] = newPlayer;
        players.value = [...olPlayers];
    }, 1000);
};

/**
 * 视频链接变化, 更新播放内容
 * @param id
 * @param channelId
 * @param url
 */
const replaceVideo = (id: string, channelId: string, url: string) => {
    const olPlayers = [...players.value];
    const newPlayer = {
        id,
        url,
        channelId,
        key: olPlayers[playerActive.value].key,
        show: true,
    };

    if (olPlayers[playerActive.value].url === url) {
        // 刷新视频
        reloadPlayer(id, channelId, url, playerActive.value);
    } else {
        olPlayers[playerActive.value] = newPlayer;
        players.value = olPlayers;
    }
    if (playerActive.value === screen.value - 1) {
        // 当前位置为分屏最后一位
        playerActive.value = 0;
    } else {
        playerActive.value += 1;
    }
};

/**
 * 点击分屏历史记录
 * @param item
 */
const handleHistory = (item: any) => {
    if (props.historyHandle) {
        const log = JSON.parse(item.content || '{}');
        screen.value = log.screen;
        const oldPlayers = [...players.value];

        players.value = oldPlayers.map((oldPlayer, index) => {
            oldPlayer.show = false;
            if (index < log.screen) {
                const { deviceId, channelId } = log.players[index];
                return {
                    ...oldPlayer,
                    id: deviceId,
                    channelId: deviceId,
                    url: deviceId
                        ? props.historyHandle!(deviceId, channelId)
                        : '',
                    show: true,
                };
            }
            return oldPlayer;
        });
    }
};

/**
 * 获取历史分屏
 */
const getHistory = async () => {
    const res = await getSearchHistory(DEFAULT_SAVE_CODE);
    if (res.success) {
        historyList.value = res.result;
    }
};

/**
 * 删除历史分屏
 * @param id
 */
const deleteHistory =  (id: string) => {
    const response =  deleteSearchHistory(DEFAULT_SAVE_CODE, id);
    response.then((res)=>{
        if(res.success){
            getHistory();
            visible.value = false;
        }
    })
    return response
};

/**
 * 保存分屏
 */
const saveHistory = async () => {
    formRef.value
        .validate()
        .then(async () => {
            const param = {
                name: formData.value.name,
                content: JSON.stringify({
                    screen: screen.value,
                    players: players.value.map((item: any) => ({
                        deviceId: item.id,
                        channelId: item.channelId,
                    })),
                }),
            };
            loading.value = true;
            const res = await saveSearchHistory(param, DEFAULT_SAVE_CODE);
            loading.value = false;
            if (res.success) {
                visible.value = false;
                getHistory();
                onlyMessage($t('Player.ScreenPlayer.521467-12'));
                formRef.value.resetFields();
            } else {
                onlyMessage($t('Player.ScreenPlayer.521467-13'), 'error');
            }
        })
        .catch((err: any) => {
            console.log(err);
        });
};

/**
 * 初始化
 */
const mediaInit = () => {
    const newArr = [];
    for (let i = 0; i < 9; i++) {
        newArr.push({
            id: '',
            channelId: '',
            url: '',
            key: 'time_' + new Date().getTime() + i,
            show: i === 0,
        });
    }
    players.value = newArr;
};

/**
 * 改变分屏数量
 * @param e
 */
const handleScreenChange = (e: any) => {
    if (e.target.value) {
        screenChange(e.target.value);
    } else {
        // 全屏操作
        toggle();
    }
};
const screenChange = (index: number) => {
    players.value = players.value.map((m: any, i: number) => ({
        id: '',
        channelId: '',
        url: '',
        updateTime: 0,
        key: m.key,
        show: i < index,
    }));
    playerActive.value = 0;
    screen.value = index;

    // if (screen.value === 4) {
    //     screenWidth.value = '350px';
    //     screenHeight.value = '2000px';
    // }
};

/**
 * 刷新
 * @param e
 * @param item
 * @param index
 */
const handleRefresh = (e: any, item: any, index: number) => {
    e.stopPropagation();
    if (item.url) {
        reloadPlayer(item.id!, item.channelId!, item.url!, index);
    }
};

/**
 * 点击控制按钮
 * @param type 控制类型
 */
const handleMouseDown = (type: string) => {
    const { id, channelId } = players.value[playerActive.value];
    if (id && channelId && props.onMouseDown) {
        props.onMouseDown(id, channelId, type);
    }
};
const handleMouseUp = (type: string) => {
    const { id, channelId } = players.value[playerActive.value];
    if (id && channelId && props.onMouseUp) {
        props.onMouseUp(id, channelId, type);
    }
};

watch(
    () => props.url,
    (val) => {
        if (val && props.id) {
            replaceVideo(props.id, props.channelId, val);
        }
    },
);

watchEffect(() => {
    if (props.showScreen !== false) {
        getHistory();
    }
    mediaInit();
});

defineExpose({
    replaceVideo,
});
</script>

<style lang="less" scoped>
@import './index.less';
:deep(.live-player-stretch-btn) {
    display: none;
}
:deep(.vjs-icon-spinner) {
    display: none;
}
.refreshBtn {
    opacity: 0;
}
.refreshBtn:hover {
    opacity: 1;
}
</style>
