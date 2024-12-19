<template>
    <div class="container">
        <a-row align="middle" :gutter="[16, 16]">
            <a-col :span="2">
                <div class="title">
                    快捷创建
                </div>
            </a-col>
            <a-col :span="22">
                <div class="tip">
                    海量产品方案支撑，轻松创建标准产品
                </div>
            </a-col>
        </a-row>
        <div class="createSteps">
            <a-steps direction="vertical" :current="1">
                <a-step>
                    <template #title>
                        <div>
                            <span>已选择产品</span>
                            <a-button type="link" @click="emits('reselection')">重新选择</a-button>
                        </div>
                    </template>
                    <template #description>
                        <div class="resource">
                            <img src="" alt="">
                            <div>
                                123
                            </div>
                            <a-button type="link" @click="showMetadata">
                                <template #icon>
                                    <AIcon type="InboxOutlined"></AIcon>
                                </template>
                                物模型
                            </a-button>
                        </div>
                    </template>
                </a-step>
                <a-step>
                    <template #title>
                        <div>
                            <span>接入配置</span>
                            <a-button v-if="!visibleAdvanceMode" type="link" @click="showAdvancedMode">高级模式</a-button>
                        </div>
                    </template>
                    <template #description>
                        <div v-if="!visibleAdvanceMode" :class="{ 'accessConfig': true, 'unmet': unmet }">
                            <template v-if="!unmet">
                                <img :src="BackMap.get(accessConfig.provider)" alt="">
                                <div style="margin-left: 24px;">
                                    <div class="accessName">
                                        {{ accessConfig.name }}
                                    </div>
                                    <a-row :gutter="[12, 12]">
                                        <a-col>
                                            <div>网络: {{ accessConfig?.channelInfo.addresses[0]?.address }}</div>
                                        </a-col>
                                        <a-col>
                                            <div>协议: {{ accessConfig?.protocolDetail
                                                ?.name }}</div>
                                        </a-col>
                                    </a-row>
                                </div>
                            </template>
                            <div v-else>
                                未满足条件,请点击高级模式
                            </div>
                        </div>
                        <AdvanceMode v-else @quit="visibleAdvanceMode = false"/>
                    </template>
                </a-step>
                <a-step title="完善产品信息" />
            </a-steps>
        </div>
        <Metadata v-if="metadataVisible" :metadata="metadata" :data="metadataData" @close="metadataVisible = false"
            @complete="generateMetadata" />
    </div>
</template>

<script setup>
import { cloneDeep } from 'lodash-es';
import Metadata from './components/Metadata.vue';
import { BackMap } from '@/views/link/AccessConfig/data';
import AdvanceMode from './components/AdvanceMode.vue';
const emits = defineEmits(['reselection'])
//接口获取到的物模型
const metadata = {
    "properties": [
        {
            "id": "temp",
            "name": "温度",
            "expands": {
                "source": "device",
                "groupId": "group_1",
                "groupName": "分组_1",
                "type": [
                    "read",
                    "write",
                    "report"
                ]
            },
            "valueType": {
                "type": "float"
            }
        },
        {
            "id": "temp2",
            "name": "温度2",
            "expands": {
                "source": "device",
                "groupId": "group_1",
                "groupName": "分组_1",
                "type": [
                    "read",
                    "write"
                ],
                "storageType": "ignore",
                "metrics": [],
                "otherEdit": true
            },
            "valueType": {
                "type": "string",
                "expands": {
                    "maxLength": 2
                }
            }
        },
        {
            "id": "temp3",
            "name": "温度3",
            "expands": {
                "source": "rule",
                "groupId": "group_1",
                "groupName": "分组_1",
                "type": [
                    "report"
                ]
            },
            "valueType": {
                "type": "boolean",
                "trueText": "是",
                "trueValue": "true",
                "falseText": "否",
                "falseValue": "false"
            }
        }
    ],
    "tags": [
        {
            "id": "A1",
            "name": "A11",
            "expands": {},
            "valueType": {
                "type": "int",
                "unit": "count"
            }
        }
    ],
    "events": [
        {
            "id": "A1",
            "name": "A11",
            "expands": {
                "level": "ordinary"
            },
            "async": false,
            "valueType": {
                "type": "object",
                "properties": [
                    {
                        "id": "A",
                        "name": "name",
                        "expands": {
                            "required": false
                        },
                        "valueType": {
                            "type": "int"
                        }
                    }
                ]
            }
        },
        {
            "id": "A2",
            "name": "A22",
            "expands": {
                "level": "warn"
            },
            "async": false,
            "valueType": {
                "type": "object",
                "properties": [
                    {
                        "id": "A",
                        "name": "A",
                        "expands": {
                            "required": false
                        },
                        "valueType": {
                            "type": "date",
                            "format": "yyyy-MM-dd HH:mm:ss"
                        }
                    }
                ]
            }
        }
    ],
    "functions": [
        {
            "id": "A1",
            "name": "A1",
            "expands": {},
            "async": true,
            "inputs": [
                {
                    "id": "a",
                    "name": "a",
                    "expands": {
                        "required": false
                    },
                    "valueType": {
                        "type": "long"
                    }
                },
                {
                    "id": "b",
                    "name": "b",
                    "expands": {
                        "required": true
                    },
                    "valueType": {
                        "type": "string",
                        "expands": {
                            "maxLength": 1
                        }
                    }
                }
            ],
            "output": {}
        },
        {
            "id": "A2",
            "name": "A2",
            "expands": {},
            "async": false,
            "inputs": [],
            "output": {
                "type": "long",
                "unit": "turnPerSeconds"
            },
            "description": "A2"
        },
        {
            "id": "copy_A2",
            "name": "A2",
            "expands": {},
            "async": false,
            "inputs": [],
            "output": {
                "type": "long",
                "unit": "turnPerSeconds"
            },
            "description": "A2"
        },
        {
            "id": "copy_A21",
            "name": "A2",
            "expands": {},
            "async": false,
            "inputs": [],
            "output": {
                "type": "long",
                "unit": "turnPerSeconds"
            },
            "description": "A2"
        },
        {
            "id": "copy_A22",
            "name": "A2",
            "expands": {},
            "async": false,
            "inputs": [],
            "output": {
                "type": "long",
                "unit": "turnPerSeconds"
            },
            "description": "A2"
        },
        {
            "id": "copy_A23",
            "name": "A2",
            "expands": {},
            "async": false,
            "inputs": [],
            "output": {
                "type": "long",
                "unit": "turnPerSeconds"
            },
            "description": "A2"
        },
        {
            "id": "copy_A24",
            "name": "A2",
            "expands": {},
            "async": false,
            "inputs": [],
            "output": {
                "type": "long",
                "unit": "turnPerSeconds"
            },
            "description": "A2"
        },
        {
            "id": "copy_A25",
            "name": "A2",
            "expands": {},
            "async": false,
            "inputs": [],
            "output": {
                "type": "long",
                "unit": "turnPerSeconds"
            },
            "description": "A2"
        },
        {
            "id": "copy_A26",
            "name": "A2",
            "expands": {},
            "async": false,
            "inputs": [],
            "output": {
                "type": "long",
                "unit": "turnPerSeconds"
            },
            "description": "A2"
        },
        {
            "id": "copy_A27",
            "name": "A2",
            "expands": {},
            "async": false,
            "inputs": [],
            "output": {
                "type": "long",
                "unit": "turnPerSeconds"
            },
            "description": "A2"
        },
        {
            "id": "copy_A28",
            "name": "A2",
            "expands": {},
            "async": false,
            "inputs": [],
            "output": {
                "type": "long",
                "unit": "turnPerSeconds"
            },
            "description": "A2"
        },
        {
            "id": "copy_A29",
            "name": "A2",
            "expands": {},
            "async": false,
            "inputs": [],
            "output": {
                "type": "long",
                "unit": "turnPerSeconds"
            },
            "description": "A2"
        }
    ]
}
const accessConfig = ref(
    {
        "id": "1867041968568389632",
        "name": "sy_Agnet设备接入网关",
        "description": "2024年12月12日11:01:04",
        "provider": "agent-device-gateway",
        "protocol": "agent-device-gateway",
        "transport": "MQTT",
        "channel": "network",
        "channelId": "1843979012136669184",
        "state": {
            "text": "正常",
            "value": "enabled"
        },
        "channelInfo": {
            "id": "1843979012136669184",
            "name": "MQTT服务",
            "description": "",
            "addresses": [
                {
                    "address": "mqtt://192.168.33.46:8201",
                    "health": 1,
                    "bad": false,
                    "disabled": false,
                    "ok": true
                }
            ]
        },
        "protocolDetail": {
            "id": "agent-device-gateway",
            "name": "Agent设备接入网关"
        },
        "transportDetail": {
            "id": "MQTT",
            "name": "MQTT",
            "features": [
                {
                    "id": "supportFirmware",
                    "name": "支持固件升级"
                }
            ],
            "routes": [],
            "metadata": "{\"functions\":[{\"async\":true,\"inputs\":[],\"name\":\"重启设备\",\"id\":\"AgentRestart\",\"expands\":{}}],\"properties\":[{\"valueType\":{\"unit\":\"GB\",\"round\":\"HALF_UP\",\"scale\":1,\"type\":\"double\"},\"name\":\"系统内存\",\"id\":\"memorySystemTotal\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"unit\":\"GB\",\"round\":\"HALF_UP\",\"scale\":1,\"type\":\"double\"},\"name\":\"已使用系统内存\",\"id\":\"memorySystemUsed\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"read\",\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"unit\":\"percent\",\"round\":\"HALF_UP\",\"scale\":2,\"type\":\"double\"},\"name\":\"系统负载\",\"id\":\"memoryLoad\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"unit\":\"GB\",\"round\":\"HALF_UP\",\"scale\":1,\"type\":\"double\"},\"name\":\"JVM内存\",\"id\":\"memoryJvmHeapTotal\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"unit\":\"GB\",\"round\":\"HALF_UP\",\"scale\":1,\"type\":\"double\"},\"name\":\"已使用JVM内存\",\"id\":\"memoryJvmHeapUsage\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"unit\":\"GB\",\"round\":\"HALF_UP\",\"scale\":1,\"type\":\"double\"},\"name\":\"磁盘总大小\",\"id\":\"diskTotal\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"unit\":\"MB/s\",\"round\":\"HALF_UP\",\"scale\":1,\"type\":\"double\"},\"name\":\"磁盘的写入速率\",\"id\":\"diskWriteSpeed\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"unit\":\"MB/s\",\"round\":\"HALF_UP\",\"scale\":1,\"type\":\"double\"},\"name\":\"磁盘的读取速率\",\"id\":\"diskReadSpeed\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"unit\":\"GB\",\"round\":\"HALF_UP\",\"scale\":1,\"type\":\"double\"},\"name\":\"已使用磁盘大小\",\"id\":\"diskUsage\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"unit\":\"percent\",\"round\":\"HALF_UP\",\"scale\":2,\"type\":\"double\"},\"name\":\"CPU实时使用率\",\"id\":\"cpuSystemUsage\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"unit\":\"percent\",\"round\":\"HALF_UP\",\"scale\":2,\"type\":\"double\"},\"name\":\"JVM占用CPU率\",\"id\":\"cpuJvmUsage\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"round\":\"HALF_UP\",\"type\":\"int\"},\"name\":\"边缘网关子设备总数\",\"id\":\"deviceTotal\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"round\":\"HALF_UP\",\"type\":\"int\"},\"name\":\"边缘网关子设备在线数\",\"id\":\"deviceOnline\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"round\":\"HALF_UP\",\"type\":\"int\"},\"name\":\"边缘网关子设备离线数\",\"id\":\"deviceOffline\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"round\":\"HALF_UP\",\"type\":\"int\"},\"name\":\"边缘网关子设备禁用数\",\"id\":\"deviceNotActive\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"round\":\"HALF_UP\",\"type\":\"int\"},\"name\":\"数据采集并发\",\"id\":\"runningPoint\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"round\":\"HALF_UP\",\"type\":\"int\"},\"name\":\"通道数量\",\"id\":\"channel\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"round\":\"HALF_UP\",\"type\":\"int\"},\"name\":\"采集器数量\",\"id\":\"collector\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"round\":\"HALF_UP\",\"type\":\"int\"},\"name\":\"设备点位数量\",\"id\":\"devicePoint\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"round\":\"HALF_UP\",\"type\":\"int\"},\"name\":\"虚拟点位数量\",\"id\":\"virtualPoint\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"unit\":\"条/分\",\"round\":\"HALF_UP\",\"type\":\"int\"},\"name\":\"消息数据量\",\"id\":\"deviceMessageQuantity\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"round\":\"HALF_UP\",\"type\":\"int\"},\"name\":\"AI模型数\",\"id\":\"aiModel\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"round\":\"HALF_UP\",\"type\":\"int\"},\"name\":\"执行AI任务数\",\"id\":\"aiTask\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"round\":\"HALF_UP\",\"type\":\"int\"},\"name\":\"告警配置总数\",\"id\":\"alarmConfig\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"round\":\"HALF_UP\",\"type\":\"int\"},\"name\":\"告警记录数\",\"id\":\"alarmRecord\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"round\":\"HALF_UP\",\"type\":\"int\"},\"name\":\"紧急级别告警记录数\",\"id\":\"alarmRecord5\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"round\":\"HALF_UP\",\"type\":\"int\"},\"name\":\"严重级别告警记录数\",\"id\":\"alarmRecord4\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"round\":\"HALF_UP\",\"type\":\"int\"},\"name\":\"一般级别告警记录数\",\"id\":\"alarmRecord3\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"round\":\"HALF_UP\",\"type\":\"int\"},\"name\":\"轻微级别告警记录数\",\"id\":\"alarmRecord2\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}},{\"valueType\":{\"round\":\"HALF_UP\",\"type\":\"int\"},\"name\":\"忽略级别告警记录数\",\"id\":\"alarmRecord1\",\"expands\":{\"groupName\":\"分组_1\",\"source\":\"device\",\"type\":[\"report\"],\"groupId\":\"group_1\"}}],\"events\":[{\"valueType\":{\"type\":\"object\",\"properties\":[{\"valueType\":{\"type\":\"string\"},\"name\":\"信息\",\"id\":\"message\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"string\"},\"name\":\"数据ID\",\"id\":\"dataId\",\"expands\":{\"required\":false}},{\"valueType\":{\"tz\":\"Asia/Shanghai\",\"format\":\"yyyy-MM-dd HH:mm:ss\",\"type\":\"date\"},\"name\":\"时间\",\"id\":\"notifyTime\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"string\"},\"name\":\"事件编码\",\"id\":\"code\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"object\",\"properties\":[]},\"name\":\"详细信息\",\"id\":\"detail\",\"expands\":{\"required\":false}}]},\"name\":\"数据丢弃\",\"id\":\"bufferEviction\",\"expands\":{\"level\":\"ordinary\"}},{\"valueType\":{\"type\":\"object\",\"properties\":[{\"valueType\":{\"type\":\"string\"},\"name\":\"设备ID\",\"id\":\"deviceId\",\"expands\":{\"required\":false}}]},\"name\":\"网关子设备离线\",\"id\":\"childDeviceOffline\",\"expands\":{\"level\":\"ordinary\"}},{\"valueType\":{\"type\":\"object\",\"properties\":[{\"valueType\":{\"type\":\"string\"},\"name\":\"信息\",\"id\":\"message\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"string\"},\"name\":\"数据ID\",\"id\":\"dataId\",\"expands\":{\"required\":false}},{\"valueType\":{\"tz\":\"Asia/Shanghai\",\"format\":\"yyyy-MM-dd HH:mm:ss\",\"type\":\"date\"},\"name\":\"时间\",\"id\":\"notifyTime\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"object\",\"properties\":[]},\"name\":\"详细信息\",\"id\":\"detail\",\"expands\":{\"required\":false}}]},\"name\":\"紧急级别告警\",\"id\":\"alarm1\",\"expands\":{\"level\":\"ordinary\"}},{\"valueType\":{\"type\":\"object\",\"properties\":[{\"valueType\":{\"type\":\"string\"},\"name\":\"信息\",\"id\":\"message\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"string\"},\"name\":\"数据ID\",\"id\":\"dataId\",\"expands\":{\"required\":false}},{\"valueType\":{\"tz\":\"Asia/Shanghai\",\"format\":\"yyyy-MM-dd HH:mm:ss\",\"type\":\"date\"},\"name\":\"时间\",\"id\":\"notifyTime\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"object\",\"properties\":[]},\"name\":\"详细信息\",\"id\":\"detail\",\"expands\":{\"required\":false}}]},\"name\":\"严重级别告警\",\"id\":\"alarm2\",\"expands\":{\"level\":\"ordinary\"}},{\"valueType\":{\"type\":\"object\",\"properties\":[{\"valueType\":{\"type\":\"string\"},\"name\":\"信息\",\"id\":\"message\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"string\"},\"name\":\"数据ID\",\"id\":\"dataId\",\"expands\":{\"required\":false}},{\"valueType\":{\"tz\":\"Asia/Shanghai\",\"format\":\"yyyy-MM-dd HH:mm:ss\",\"type\":\"date\"},\"name\":\"时间\",\"id\":\"notifyTime\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"object\",\"properties\":[]},\"name\":\"详细信息\",\"id\":\"detail\",\"expands\":{\"required\":false}}]},\"name\":\"一般级别告警\",\"id\":\"alarm3\",\"expands\":{\"level\":\"ordinary\"}},{\"valueType\":{\"type\":\"object\",\"properties\":[{\"valueType\":{\"type\":\"string\"},\"name\":\"目标检测源id\",\"id\":\"sourceId\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"string\"},\"name\":\"原始图片url\",\"id\":\"original\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"string\"},\"name\":\"模型id\",\"id\":\"modelId\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"object\",\"properties\":[]},\"name\":\"检测到的对象\",\"id\":\"objects\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"string\"},\"name\":\"边框标记图片url\",\"id\":\"labeled\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"string\"},\"name\":\"id\",\"id\":\"id\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"string\"},\"name\":\"设备id\",\"id\":\"deviceId\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"string\"},\"name\":\"任务id\",\"id\":\"taskId\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"string\"},\"name\":\"ai命令\",\"id\":\"target\",\"expands\":{\"required\":false}}]},\"name\":\"机器视觉原始数据\",\"id\":\"AiVisionData\",\"expands\":{\"level\":\"ordinary\"}},{\"valueType\":{\"type\":\"object\",\"properties\":[{\"valueType\":{\"type\":\"string\"},\"name\":\"目标检测源id\",\"id\":\"sourceId\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"string\"},\"name\":\"原始图片url\",\"id\":\"original\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"string\"},\"name\":\"模型id\",\"id\":\"modelId\",\"expands\":{\"required\":false}},{\"valueType\":{\"tz\":\"Asia/Shanghai\",\"format\":\"yyyy-MM-dd HH:mm:ss\",\"type\":\"date\"},\"name\":\"告警时间\",\"id\":\"alarmTime\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"string\"},\"name\":\"边框标记图片url\",\"id\":\"labeled\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"string\"},\"name\":\"标签\",\"id\":\"label\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"string\"},\"name\":\"触发条件\",\"id\":\"triggerDesc\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"string\"},\"name\":\"设备id\",\"id\":\"deviceId\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"string\"},\"name\":\"ai命令\",\"id\":\"target\",\"expands\":{\"required\":false}},{\"valueType\":{\"round\":\"HALF_UP\",\"type\":\"double\"},\"name\":\"置信度\",\"id\":\"score\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"string\"},\"name\":\"触发数据描述\",\"id\":\"actualDesc\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"string\"},\"name\":\"id\",\"id\":\"id\",\"expands\":{\"required\":false}},{\"valueType\":{\"type\":\"string\"},\"name\":\"任务id\",\"id\":\"taskId\",\"expands\":{\"required\":false}}]},\"name\":\"机器视觉告警数据\",\"id\":\"AiVisionAlarm\",\"expands\":{\"level\":\"ordinary\"}}],\"tags\":[{\"valueType\":{\"type\":\"string\"},\"name\":\"安装位置\",\"id\":\"locationDesc\",\"expands\":{}},{\"valueType\":{\"lonProperty\":\"lon\",\"type\":\"geoPoint\",\"latProperty\":\"lat\"},\"name\":\"地理位置\",\"id\":\"locationGeo\",\"expands\":{}}]}"
        }
    }
)

const unmet = ref(true)
const metadataVisible = ref(false);
const visibleAdvanceMode = ref(false)
const showMetadata = () => {
    metadataVisible.value = true
}
const metadataData = ref()
//选中物模型
const generateMetadata = (data) => {
    metadataData.value = data
    metadataVisible.value = false
}
const showAdvancedMode = ()=>{
    visibleAdvanceMode.value = true
}

onMounted(() => {
    metadataData.value = cloneDeep(metadata)
})
</script>
<style lang='less' scoped>
.container {
    padding: 10px 20px;
}

.title {
    font-size: 16px;
}

.createSteps {
    margin-top: 40px;
    padding: 0 20px;

    .accessConfig {
        display: flex;
        align-items: center;
        border: 1px solid #c1c1c1;
        padding: 10px 20px;
        border-radius: 8px;

        .accessName {
            font-size: 16px;
            margin-bottom: 8px;
        }
    }

    .unmet {
        background-color: #848587;
    }
}

.resource {
    border: 1px solid #bebfbf;
    display: flex;
    padding: 10px;
    align-items: center;
    border-radius: 4px;
}
</style>