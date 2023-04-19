<template>
    <div>
        <j-row :gutter="24">
            <j-col :span="14">
                <div class="alarmFlow-left">
                    <j-card
                        :head-style="{ borderBottom: 'none', height: '30px' }"
                        :bordered="false"
                    >
                        <template #title>
                            <div class="alarmTitle">
                                <span>告警数据输出</span>
                                <j-tooltip
                                    title="将告警数据输出到其他第三方系统"
                                >
                                    <AIcon
                                        type="QuestionCircleOutlined"
                                        style="
                                            margin-left: 6px;
                                            line-height: 35px;
                                        "
                                    />
                                </j-tooltip>

                                <PermissionButton
                                    type="link"
                                    @click="showOutput"
                                    hasPermission="device/Instance:update"
                                >
                                    <template #icon
                                        ><AIcon type="EditOutlined"
                                    /></template>
                                </PermissionButton>
                            </div>
                        </template>
                        <j-descriptions
                            bordered
                            :labelStyle="{ width: 112 + 'px' }"
                            :contentStyle="{ minWidth: 100 + 'px' }"
                            :column="2"
                        >
                            <j-descriptions-item
                                label="kafka地址"
                                :content-style="{ minWidth: '200px' }"
                                ><j-badge
                                    :status="
                                        output?.running ? 'success' : 'error'
                                    "
                                    :text="
                                        output?.data?.config?.config?.address ||
                                        ''
                                    "
                                ></j-badge
                            ></j-descriptions-item>
                            <j-descriptions-item label="topic">{{
                                output?.data?.config?.config?.topic || ''
                            }}</j-descriptions-item>
                            <j-descriptions-item label="状态" :span="2"
                                ><j-badge
                                    :status="
                                        output?.data?.state?.value === 'enabled'
                                            ? 'success'
                                            : 'error'
                                    "
                                    :text="output?.data?.state?.text || ''"
                                ></j-badge
                            ></j-descriptions-item>
                        </j-descriptions>
                    </j-card>
                    <j-card
                        :head-style="{ borderBottom: 'none', height: '30px' }"
                        :bordered="false"
                    >
                        <template #title>
                            <div class="alarmTitle">
                                <span>告警处理结果输入</span>
                                <j-tooltip title="接收第三方系统处理的告警结果">
                                    <AIcon
                                        type="QuestionCircleOutlined"
                                        style="
                                            margin-left: 6px;
                                            line-height: 35px;
                                        "
                                    />
                                </j-tooltip>
                                <PermissionButton
                                    type="link"
                                    @click="showInput"
                                    hasPermission="device/Instance:update"
                                >
                                    <template #icon
                                        ><AIcon type="EditOutlined" /></template
                                ></PermissionButton>
                            </div>
                        </template>
                        <j-descriptions
                            bordered
                            :labelStyle="{ width: 112 + 'px' }"
                            :contentStyle="{ minWidth: 150 + 'px' }"
                            :column="2"
                        >
                            <j-descriptions-item label="kafka地址"
                                ><j-badge
                                    :status="
                                        input?.running ? 'success' : 'error'
                                    "
                                    :text="
                                        input?.data?.config?.config?.address ||
                                        ''
                                    "
                                ></j-badge
                            ></j-descriptions-item>
                            <j-descriptions-item label="topic">{{
                                input?.data?.config?.config?.topic || ''
                            }}</j-descriptions-item>
                            <j-descriptions-item label="状态" :span="2"
                                ><j-badge
                                    :status="
                                        input?.data?.state?.value === 'enabled'
                                            ? 'success'
                                            : 'error'
                                    "
                                    :text="input?.data?.state?.text || ''"
                                ></j-badge
                            ></j-descriptions-item>
                        </j-descriptions>
                    </j-card>
                </div>
            </j-col>
            <j-col :span="10">
                <div class="alarmFlow-right">
                    <div class="doc">
                        <h1>功能图示</h1>
                        <div class="image">
                            <j-image
                                width="100%"
                                :src="getImage('/alarm/io.png')"
                            ></j-image>
                        </div>
                        <h1>功能说明</h1>
                        <div>
                            1、平台支持将告警数据输出到kafka，第三方系统可订阅kafka中的告警数据，进行业务处理。
                        </div>
                        <h2>输出参数</h2>
                        <div>
                            <j-table
                                :dataSource="outputData"
                                :pagination="false"
                                :columns="outputColumns"
                            ></j-table>
                        </div>
                        <h2>示例</h2>
                        <div v-html="markdownOutputText" class="code"></div>
                        <div>
                            2、平台支持订阅kafka中告警处理数据，并更新告警记录状态。
                        </div>
                        <h2>订阅参数</h2>
                        <div>
                            <j-table
                                :dataSource="subData"
                                :pagination="false"
                                :columns="subColumns"
                            ></j-table>
                        </div>
                        <h2>示例</h2>
                        <div class="code" v-html="markdownSubText"></div>
                    </div>
                </div>
            </j-col>
        </j-row>
        <InputSave
            :data="input"
            v-if="inputVisible"
            @closeModel="closeInput"
            @saveSuc="saveInput"
        />
        <OutputSave
            :data="output"
            v-if="outputVisible"
            @closeModel="closeOutput"
            @saveSuc="saveOutput"
        />
    </div>
</template>

<script lang="ts" setup>
import InputSave from './Save/input.vue';
import OutputSave from './Save/output.vue';
import { getDataExchange } from '@/api/rule-engine/config';
import { getImage } from '@/utils/comm';
import { marked } from 'marked';
let input = ref<any>();
let output = ref<any>();
const outputData = [
    {
        key: 'alarmConfigName',
        name: '告警配置名称',
        type: 'string',
        desc: '推送的告警配置名称',
        example: '烟感告警',
    },
    {
        key: 'alarmConfigId',
        name: '告警配置ID',
        type: 'string',
        desc: '推送的告警配置ID',
        example: '1605111722418597888',
    },
    {
        key: 'Id',
        name: '告警数据ID',
        type: 'string',
        desc: '告警唯一性标识',
        example: '1515992841393119232',
    },
    {
        key: 'alarmRecordId',
        name: '告警记录ID',
        type: 'string',
        desc: '告警记录的唯一标识，可根据此ID处理告警',
        example: 'ba33a59ca5ebe3dccfcd75fd0575be4e',
    },
    {
        key: 'targetType',
        name: '告警目标类型',
        type: 'string',
        desc: '告警所属的业务类型，具体有产品、设备、部门、其他',
        example: '产品',
    },
    {
        key: 'targetId',
        name: '告警目标ID',
        type: 'string',
        desc: '告警目标唯一性标识',
        example: '1583300346713661440',
    },
    {
        key: 'targetName',
        name: '告警目标名称',
        type: 'string',
        desc: '告警目标实例名称',
        example: '海康烟感',
    },
    {
        key: 'alarmTime',
        name: '告警时间',
        type: 'long',
        desc: '告警触发时间',
        example: '1651233650840',
    },
    {
        key: 'sourceType',
        name: '告警源类型',
        type: 'string',
        desc: '触发告警的源类型。当前只有device',
        example: 'device',
    },
    {
        key: 'sourceId',
        name: '告警源ID',
        type: 'string',
        desc: '触发告警的源Id。如设备Id',
        example: '1605138218826821632',
    },
    {
        key: 'sourceName',
        name: '告警源名称',
        type: 'string',
        desc: '触发告警的源名称。如设备名称',
        example: '1楼烟感S01',
    },
    {
        key: 'level',
        name: '告警级别',
        type: 'int',
        desc: '告警严重程度指标',
        example: 1,
    },
    {
        key: 'description',
        name: '告警说明',
        type: 'string',
        desc: '告警规则说明',
        example: '1楼烟感统一告警规则设置',
    },
];
const subData = [
    {
        key: 'alarmRecordId',
        name: '告警记录ID',
        type: 'string',
        require: '是',
        desc: '告警记录的唯一标识，可根据此ID处理告警',
        example: 'ba33a59ca5ebe3dccfcd75fd0575be4e',
    },
    {
        key: 'alarmConfigId',
        name: '告警配置ID',
        type: 'string',
        require: '是',
        desc: '推送的告警配置ID',
        example: '1605111722418597888',
    },
    {
        key: 'alarmTime',
        name: '告警时间',
        type: 'long',
        require: '是',
        desc: '告警触发时间',
        example: '1651233650840',
    },
    {
        key: 'handleTime',
        name: '处理时间',
        type: 'long',
        require: '是',
        desc: '告警处理时间，不填是默认为消息处理时间',
        example: '1651233650840',
    },
    {
        key: 'describe',
        name: '处理说明',
        type: 'string',
        require: '是',
        desc: '告警处理内容详细描述说明',
        example: '已联系第三方人员进行告警处理，现告警已恢复',
    },
    {
        key: 'type',
        name: '处理类型',
        type: 'enum',
        require: '是',
        desc: '支持system、user',
        example: 'user',
    },
    {
        key: 'state',
        name: '处理后的状态',
        type: 'enum',
        require: '是',
        desc: 'warning、normal',
        example: 'normal',
    },
];
const outputColumns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
    },
    {
        title: '标识',
        dataIndex: 'key',
        key: 'key',
        ellipsis: true,
    },
    {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        ellipsis: true,
    },
    {
        title: '说明',
        dataIndex: 'desc',
        key: 'desc',
        width: 100,
        ellipsis: true,
    },
    {
        title: '示例值',
        dataIndex: 'example',
        key: 'example',
        width: 100,
        ellipsis: true,
    },
];
const subColumns = [...outputColumns];
subColumns.splice(3, 0, {
    title: '必填',
    dataIndex: 'require',
    key: 'require',
    ellipsis: true,
});
const subText = `
  ~~~json
  {
    "alarmRecordId": "ba33a59ca5ebe3dccfcd75fd0575be4e",
    "alarmConfigId": "1605111722418597888",
    "alarmTime": "1651233650840",
    "handleTime": "1651233650841",
    "describe": "已联系第三方人员进行告警处理，现告警已恢复",
    "type": "user",
    "state": "normal"
  }
  ~~~
  `;
const outputText = `
  ~~~json
  {
    "alarmConfigId": "1605111722418597888",
    "id": "1515992841393119232",
    "alarmConfigId": "1586989804257853441",
    "alarmConfigName": "烟感告警",
    "alarmRecordId": "ba33a59ca5ebe3dccfcd75fd0575be4e",
    "level": "3",
    "description": "设备温度过高",
    "alarmTime": "1667202964007",
    "sourceType": "device",
    "sourceId": "1605138218826821632",
    "sourceName": "1楼烟感S01",
    "targetType": "device",
    "targetName": "温度探测设备",
    "targetId": "1583300346713661440"
  }
  ~~~
  `;
const render = new marked.Renderer();
const markdownSubText = shallowRef(marked(subText));
const markdownOutputText = shallowRef(marked(outputText));
let inputVisible = ref(false);
let outputVisible = ref(false);
marked.setOptions({
    renderer: render,
    gfm: true,
    pedantic: false,
});
const handleOutputSearch = () => {
    getDataExchange('producer').then((res) => {
        if (res.status === 200) {
            output.value = res.result;
        }
    });
};
const handleInputSearch = () => {
    getDataExchange('consume').then((res) => {
        if (res.status === 200) {
            input.value = res.result;
        }
    });
};
handleInputSearch();
handleOutputSearch();
const showInput = () => {
    inputVisible.value = true;
};
const closeInput = () => {
    inputVisible.value = false;
};
const saveInput = () => {
    inputVisible.value = false;
    handleInputSearch();
};
const showOutput = () => {
    outputVisible.value = true;
};
const closeOutput = () => {
    outputVisible.value = false;
};
const saveOutput = () => {
    outputVisible.value = false;
    handleOutputSearch();
};
</script>
<style lang="less" scoped>
.alarmTitle {
    display: flex;
    position: relative;
    padding-left: 10px;
    color: rgba(0, 0, 0, 0.8);
    font-weight: 600;
    line-height: 1;
    margin-bottom: 16px;
    line-height: 30px;
}
.alarmTitle::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: #1d39c4;
    border-radius: 0 3px 3px 0;
    content: ' ';
}
.alarmFlow-left,
.alarmFlow-right {
    height: 780px;
    background-color: white;
}
.alarmFlow-right {
    margin-left: 20px;
    padding-bottom: 24px;
}
.doc {
    height: 100%;
    padding: 24px;
    overflow-y: auto;
    color: rgba(#000, 0.8);
    font-size: 14px;
    background-color: #fff;

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
        margin: 6px 10px;
        color: rgba(0, 0, 0, 0.8);
        font-weight: 400;
        font-size: 14px;
    }

    .image {
        margin: 16px 0;
    }

    .code {
        padding: 16px;
        background-color: #fafafa;
    }
}
</style>