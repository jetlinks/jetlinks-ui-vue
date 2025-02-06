<template>
  <a-form-item
      label="功能码"
      :name="['configuration', 'function']">
    <a-select
        v-model:value="formData.configuration.function"
        :options="functionCode"
        show-search
        placeholder="请选择功能码"
        @change="chooseFunctionCode"
    />
  </a-form-item>
  <template
      v-if="formData.configuration?.function && formData.configuration?.function?.indexOf('ReadWriteMeterData') !== -1">
    <a-form-item
        label="功能标识"
        :name="['configuration', 'parameter', 'identity']"
        :rules="[{
          required: true,
          trigger: 'change',
          validator: identityValidate,
        }]"
    >
      <a-cascader
          v-model:value="identity"
          :options="DLT645Function"
          @change="onChange"
      >
        <a-input
            v-model:value="formData.configuration.parameter.identity"
            placeholder="请输入功能标识"
            @change="inputIdentityChange"
            :maxlength="version === '2007' ? 8 : 4"
        />
      </a-cascader>
      <template #extra>
        提示信息：固定长度{{
          version === '2007' ? 8 : 4
        }}位十六进制
      </template>
    </a-form-item>
    <a-form-item
        label="字节数"
        :name="['configuration', 'parameter', 'byteCount']"
        :rules="{
          required: true,
          trigger: 'blur',
        }"
    >
      <a-input-number
          v-model:value="formData.configuration.parameter.byteCount"
          :min="1"
          :max="8"
          style="width: 100%"
          :precision="0"
          placeholder="请输入字节数"
          :disabled="disabled"
      />
    </a-form-item>
    <a-form-item
        label="缩放因子"
        :name="['configuration', 'parameter', 'decimalCount']"
        :rules="{
          required: true,
          trigger: 'blur',
          message: '请输入正确的缩放因子',
          pattern: pattern,
        }"
    >
      <a-select
          v-model:value="formData.configuration.parameter.decimalCount"
          :options="decimalCountOptions"
          :disabled="disabled"
          placeholder="请规定返回格式"
          :getPopupContainer="(triggerNode) => triggerNode.parentNode"
      >
      </a-select>
    </a-form-item>
  </template>
  <a-form-item
      label="访问类型"
      :name="['accessModes']"
      :rules="rules.accessModes"
  >
    <j-check-button
        v-model:value="formData.accessModes"
        :multiple="true"
        :disabled="true"
        :options="[
          { label: '读', value: 'read' },
          { label: '写', value: 'write' },
        ]"
    />
  </a-form-item>
</template>
<script setup>
import {inject, ref, computed, watch} from 'vue'
import {request} from '@jetlinks-web/core'
import {randomString} from "@jetlinks-web/utils";

const formData = inject('plugin-form')
const collector = inject('plugin-form-collector')

const disabled = ref(false);
const pattern = /^(0\.0*1)$|^1$/;
const identity = ref({});
//是否是手动输入
const isManualInput = ref(false);
const lastViidateValue = ref();
const channel = ref()
/**
 * DLT645功能标识2007
 */

const DLT645Function07 = [
  {
    label: '电能量',
    value: 1,
    children: [
      {
        label: '当前',
        value: '1-1',
        children: [
          {
            label: '组合有功',
            value: '1-1-1',
            children: [
              {
                label: '总电量(00000000)',
                value: '00000000',
              },
              {
                label: '尖电量(00000100)',
                value: '00000100',
              },
              {
                label: '锋电量(00000200)',
                value: '00000200',
              },
              {
                label: '平电量(00000300)',
                value: '00000300',
              },
              {
                label: '谷电量(00000400)',
                value: '00000400',
              },
            ],
          },
          {
            label: '组合无功1',
            value: '1-1-2',
            children: [
              {
                label: '总电量(00030000)',
                value: '00030000',
              },
              {
                label: '尖电量(00030100)',
                value: '00030100',
              },
              {
                label: '锋电量(00030200)',
                value: '00030200',
              },
              {
                label: '平电量(00030300)',
                value: '00030300',
              },
              {
                label: '谷电量(00030400)',
                value: '00030400',
              },
            ],
          },
          {
            label: '组合无功2',
            value: '1-1-3',
            children: [
              {
                label: '总电量(00040000)',
                value: '00040000',
              },
              {
                label: '尖电量(00040100)',
                value: '00040100',
              },
              {
                label: '锋电量(00040200)',
                value: '00040200',
              },
              {
                label: '平电量(00040300)',
                value: '00040300',
              },
              {
                label: '谷电量(00040400)',
                value: '00040400',
              },
            ],
          },
          {
            label: '正向有功',
            value: '1-1-4',
            children: [
              {
                label: '总电量(00010000)',
                value: '00010000',
              },
              {
                label: '尖电量(00010100)',
                value: '00010100',
              },
              {
                label: '锋电量(00010200)',
                value: '00010200',
              },
              {
                label: '平电量(00010300)',
                value: '00010300',
              },
              {
                label: '谷电量(00010400)',
                value: '00010400',
              },
            ],
          },
          {
            label: '反向有功',
            value: '1-1-5',
            children: [
              {
                label: '总电量(00020000)',
                value: '00020000',
              },
              {
                label: '尖电量(00020100)',
                value: '00020100',
              },
              {
                label: '锋电量(00020200)',
                value: '00020200',
              },
              {
                label: '平电量(00020300)',
                value: '00020300',
              },
              {
                label: '谷电量(00020400)',
                value: '00020400',
              },
            ],
          },
          {
            label: 'A相',
            value: '1-1-6',
            children: [
              {
                label: '正向有功电能(00150000)',
                value: '00150000',
              },
              {
                label: '反向有功电能(00160000)',
                value: '00160000',
              },
              {
                label: '组合无功1电能(00170000)',
                value: '00170000',
              },
              {
                label: '组合无功2电能(00180000)',
                value: '00180000',
              },
            ],
          },
          {
            label: 'B相',
            value: '1-1-7',
            children: [
              {
                label: '正向有功电能(00290000)',
                value: '00290000',
              },
              {
                label: '反向有功电能(002A0000)',
                value: '002A0000',
              },
              {
                label: '组合无功1电能(002B0000)',
                value: '002B0000',
              },
              {
                label: '组合无功2电能(002C0000)',
                value: '002C0000',
              },
            ],
          },
          {
            label: 'C相',
            value: '1-1-8',
            children: [
              {
                label: '正向有功电能(003D0000)',
                value: '003D0000',
              },
              {
                label: '反向有功电能(003E0000)',
                value: '003E0000',
              },
              {
                label: '组合无功1电能(003F0000)',
                value: '003F0000',
              },
              {
                label: '组合无功2电能(00400000)',
                value: '00400000',
              },
            ],
          },
        ],
      },
      {
        label: '上一结算日',
        value: '1-2',
        children: [
          {
            label: '组合有功',
            value: '1-2-1',
            children: [
              {
                label: '总电量(00000001)',
                value: '00000001',
              },
              {
                label: '尖电量(00000101)',
                value: '00000101',
              },
              {
                label: '锋电量(00000201)',
                value: '00000201',
              },
              {
                label: '平电量(00000301)',
                value: '00000301',
              },
              {
                label: '谷电量(00000401)',
                value: '00000401',
              },
            ],
          },
          {
            label: '组合无功1',
            value: '1-2-2',
            children: [
              {
                label: '总电量(00030001)',
                value: '00030001',
              },
              {
                label: '尖电量(00030101)',
                value: '00030101',
              },
              {
                label: '锋电量(00030201)',
                value: '00030201',
              },
              {
                label: '平电量(00030301)',
                value: '00030301',
              },
              {
                label: '谷电量(00030401)',
                value: '00030401',
              },
            ],
          },
          {
            label: '组合无功2',
            value: '1-2-3',
            children: [
              {
                label: '总电量(00040001)',
                value: '00040001',
              },
              {
                label: '尖电量(00040101)',
                value: '00040101',
              },
              {
                label: '锋电量(00040201)',
                value: '00040201',
              },
              {
                label: '平电量(00040301)',
                value: '00040301',
              },
              {
                label: '谷电量(00040401)',
                value: '00040401',
              },
            ],
          },
          {
            label: '正向有功',
            value: '1-2-4',
            children: [
              {
                label: '总电量(00010001)',
                value: '00010001',
              },
              {
                label: '尖电量(00010101)',
                value: '00010101',
              },
              {
                label: '锋电量(00010201)',
                value: '00010201',
              },
              {
                label: '平电量(00010301)',
                value: '00010301',
              },
              {
                label: '谷电量(00010401)',
                value: '00010401',
              },
            ],
          },
          {
            label: '反向有功',
            value: '1-2-5',
            children: [
              {
                label: '总电量(00020001)',
                value: '00020001',
              },
              {
                label: '尖电量(00020101)',
                value: '00020101',
              },
              {
                label: '锋电量(00020201)',
                value: '00020201',
              },
              {
                label: '平电量(00020301)',
                value: '00020301',
              },
              {
                label: '谷电量(00020401)',
                value: '00020401',
              },
            ],
          },
          {
            label: 'A相',
            value: '1-2-6',
            children: [
              {
                label: '正向有功电能(00150001)',
                value: '00150001',
              },
              {
                label: '反向有功电能(00160001)',
                value: '00160001',
              },
              {
                label: '组合无功1电能(00170001)',
                value: '00170001',
              },
              {
                label: '组合无功2电能(00180001)',
                value: '00180001',
              },
            ],
          },
          {
            label: 'B相',
            value: '1-2-7',
            children: [
              {
                label: '正向有功电能(00150001)',
                value: '00150001',
              },
              {
                label: '反向有功电能(00160001)',
                value: '00160001',
              },
              {
                label: '组合无功1电能(00170001)',
                value: '00170001',
              },
              {
                label: '组合无功2电能(00180001)',
                value: '00180001',
              },
            ],
          },
          {
            label: 'C相',
            value: '1-2-8',
            children: [
              {
                label: '正向有功电能(00150000)',
                value: '00150000',
              },
              {
                label: '反向有功电能(00160000)',
                value: '00160000',
              },
              {
                label: '组合无功1电能(00170000)',
                value: '00170000',
              },
              {
                label: '组合无功2电能(00180000)',
                value: '00180000',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: '变量',
    value: 2,
    children: [
      {
        label: '电压',
        value: '2-1',
        children: [
          {
            label: 'A相电压(02010100)',
            value: '02010100',
          },
          {
            label: 'B相电压(02010200)',
            value: '02010200',
          },
          {
            label: 'C相电压(02010300)',
            value: '02010300',
          },
        ],
      },
      {
        label: '电流',
        value: '2-2',
        children: [
          {
            label: 'A相电流(02020100)',
            value: '02020100',
          },
          {
            label: 'B相电流(02020200)',
            value: '02020200',
          },
          {
            label: 'C相电流(02020300)',
            value: '02020300',
          },
        ],
      },
      {
        label: '瞬时有功功率',
        value: '2-3',
        children: [
          {
            label: '瞬时总有功功率(02030000)',
            value: '02030000',
          },
          {
            label: '瞬时A相有功功率(02030100)',
            value: '02030100',
          },
          {
            label: '瞬时B相有功功率(02030200)',
            value: '02030200',
          },
          {
            label: '瞬时C相有功功率(02030300)',
            value: '02030300',
          },
        ],
      },
      {
        label: '瞬时无功功率',
        value: '2-4',
        children: [
          {
            label: '瞬时总无功功率(02040000)',
            value: '02040000',
          },
          {
            label: '瞬时A相无功功率(02040100)',
            value: '02040100',
          },
          {
            label: '瞬时B相无功功率(02040200)',
            value: '02040200',
          },
          {
            label: '瞬时C相无功功率(02040300)',
            value: '02040300',
          },
        ],
      },
      {
        label: '瞬时视在功率',
        value: '2-5',
        children: [
          {
            label: '瞬时总视在功率(02050000)',
            value: '02050000',
          },
          {
            label: '瞬时A相视在功率(02050100)',
            value: '02050100',
          },
          {
            label: '瞬时B相视在功率(02050200)',
            value: '02050200',
          },
          {
            label: '瞬时C相视在功率(02050300)',
            value: '02050300',
          },
        ],
      },
      {
        label: '功率因数',
        value: '2-6',
        children: [
          {
            label: '总功率因数(02060000)',
            value: '02060000',
          },
          {
            label: 'A相功率因数(02060100)',
            value: '02060100',
          },
          {
            label: 'B相功率因数(02060200)',
            value: '02060200',
          },
          {
            label: 'C相功率因数(02060300)',
            value: '02060300',
          },
        ],
      },
      {
        label: '零线电流(02800001)',
        value: '02800001',
      },
      {
        label: '电网频率(02800002)',
        value: '02800002',
      },
      {
        label: '当前有功需量(02800004)',
        value: '02800004',
      },
      {
        label: '当前无功需量(02800005)',
        value: '02800005',
      },
      {
        label: '当前视在需量(02800006)',
        value: '02800006',
      },
      {
        label: '表内温度(02800007)',
        value: '02800007',
      },
      {
        label: '时钟电池电压(02800008)',
        value: '02800008',
      },
      {
        label: '内部电池工作时间(0280000A)',
        value: '0280000A',
      },
    ],
  },
  {
    label: '参变量',
    value: 3,
    children: [
      {
        label: '通信地址(04000401)',
        value: '04000401',
      },
      {
        label: '厂家软件版本号(ASCII 码)(04800001)',
        value: '04800001',
      },
      {
        label: '自动循环显示屏数(04000301)',
        value: '04000301',
      },
      {
        label: '每屏显示时间(04000302)',
        value: '04000302',
      },
      {
        label: '显示电能小数位数(04000303)',
        value: '04000303',
      },
      {
        label: '显示功率(最大需量)小数位数(04000304)',
        value: '04000304',
      },
      {
        label: '电表运行状态字1(04000501)',
        value: '04000501',
      },
      {
        label: '电表运行状态字2(04000502)',
        value: '04000502',
      },
      {
        label: '电表运行状态字3(04000503)',
        value: '04000503',
      },
      {
        label: '电表运行状态字4(04000504)',
        value: '04000504',
      },
      {
        label: '电表运行状态字5(04000505)',
        value: '04000505',
      },
      {
        label: '电表运行状态字6(04000506)',
        value: '04000506',
      },
      {
        label: '电表运行状态字7(04000507)',
        value: '04000507',
      },
      {
        label: '欠压事件电压触发上限(04090301)',
        value: '04090301',
      },
      {
        label: '欠压事件判定延时时间(04090302)',
        value: '04090302',
      },
      {
        label: '过载事件有功功率触发下限(04090B01)',
        value: '04090B01',
      },
      {
        label: '过流事件电流触发下限(04090801)',
        value: '04090801',
      },
      {
        label: '有功需量超限事件需量触发下限(04090D01)',
        value: '04090D01',
      },
      {
        label: '无功需量超限事件需量触发下限(04090D02)',
        value: '04090D02',
      },
      {
        label: 'A相恶性功率因数超上限阀值(04090E01)',
        value: '04090E01',
      },
    ],
  },
];

/**
 * DLT645功能标识1997
 */

const DLT645Function97 = [
  {
    label: '电能量',
    value: '1',
    children: [
      {
        label: '当前',
        value: '1-1',
        children: [
          {
            label: '正向有功总电能(9010)',
            value: '9010',
          },
          {
            label: '反向有功总电能(9020)',
            value: '9020',
          },
          {
            label: '正向无功总电能(9110)',
            value: '9110',
          },
          {
            label: '正向无功总电能(9120)',
            value: '9120',
          },
        ],
      },
      {
        label: '上月',
        value: '1-2',
        children: [
          {
            label: '正向有功总电能(9410)',
            value: '9410',
          },
          {
            label: '反向有功总电能(9420)',
            value: '9420',
          },
          {
            label: '正向无功总电能(9510)',
            value: '9510',
          },
          {
            label: '正向无功总电能(9520)',
            value: '9520',
          },
        ],
      },
      {
        label: '上上月',
        value: '1-3',
        children: [
          {
            label: '正向有功总电能(9810)',
            value: '9810',
          },
          {
            label: '反向有功总电能(9820)',
            value: '9820',
          },
          {
            label: '正向无功总电能(9910)',
            value: '9910',
          },
          {
            label: '正向无功总电能(9920)',
            value: '9920',
          },
        ],
      },
    ],
  },
  {
    label: '变量',
    value: '2',
    children: [
      {
        label: '电压',
        value: '2-1',
        children: [
          {
            label: 'A相电压(B611)',
            value: 'B611',
          },
          {
            label: 'B相电压(B612)',
            value: 'B612',
          },
          {
            label: 'C相电压(B613)',
            value: 'B613',
          },
        ],
      },
      {
        label: '电流',
        value: '2-2',
        children: [
          {
            label: 'A相电流(B621)',
            value: 'B621',
          },
          {
            label: 'B相电流(B622)',
            value: 'B622',
          },
          {
            label: 'C相电流(B623)',
            value: 'B623',
          },
        ],
      },
      {
        label: '瞬时有功率',
        value: '1-3',
        children: [
          {
            label: '总瞬时有功率(B630)',
            value: 'B630',
          },
          {
            label: 'A相瞬时有功率(B631)',
            value: 'B631',
          },
          {
            label: 'B相瞬时有功率(B632)',
            value: 'B632',
          },
          {
            label: 'C相瞬时有功率(B633)',
            value: 'B633',
          },
          {
            label: '正向有功功率上限值(B634)',
            value: 'B634',
          },
          {
            label: '反向有功功率上限值(B635)',
            value: 'B635',
          },
        ],
      },
      {
        label: '瞬时无功功率',
        value: '1-4',
        children: [
          {
            label: '总瞬时无功功率(B640)',
            value: 'B640',
          },
          {
            label: 'A相瞬时无功功率(B641)',
            value: 'B641',
          },
          {
            label: 'B相瞬时无功功率(B642)',
            value: 'B642',
          },
          {
            label: 'C相瞬时无功功率(B643)',
            value: 'B643',
          },
        ],
      },
      {
        label: '瞬时视在功率',
        value: '1-5',
        children: [
          {
            label: '总瞬时视在功率(B650)',
            value: 'B650',
          },
          {
            label: '瞬时A相视在功率(B651)',
            value: 'B651',
          },
          {
            label: '瞬时B相视在功率(B652)',
            value: 'B652',
          },
          {
            label: '瞬时C相视在功率(B653)',
            value: 'B653',
          },
        ]
      },
    ],
  },
  {
    label: '参变量',
    value: '1-6',
    children: [
      {
        label: '电表运行状态字1(C020)',
        value: 'C020',
      },
      {
        label: '电表运行状态字2(C021)',
        value: 'C021',
      },
      {
        label: '电表运行状态字3(C023)',
        value: 'C023',
      },
    ]
  }
];


const functionCode = computed(() => {
  if (version.value === '2007') {
    return [
      {label: '读写电表数据', value: 'ReadWriteMeterData'},
      {label: '读写通讯地址', value: 'ReadWriteMeterNumber'},
      {label: '更改通讯速率', value: 'ModifyTheCommunicationRate'},
      {label: '跳闸控制', value: 'TripControl'},
    ];
  } else {
    return [
      {label: '读写电表数据', value: 'ReadWriteMeterData97'},
      {label: '写通讯地址', value: 'ReadWriteMeterNumber97'},
      {label: '更改通讯速率', value: 'ModifyTheCommunicationRate97'},
    ];
  }
});

const DLT645Function = computed(() => {
  if (version.value === '2007') {
    return DLT645Function07;
  } else {
    return DLT645Function97;
  }
});

const decimalCountOptions = [
  {label: '1', value: '1'},
  {label: '0.1', value: '0.1'},
  {label: '0.01', value: '0.01'},
  {label: '0.001', value: '0.001'},
  {label: '0.0001', value: '0.0001'},
  {label: '0.00001', value: '0.00001'},
  {label: '0.000001', value: '0.000001'},
  {label: '0.0000001', value: '0.0000001'},
  {label: '0.00000001', value: '0.00000001'},
];

const rules = {
  function: [
    {
      required: true,
      message: '请选择数据类型',
    },
  ],
  accessModes: [
    {
      required: true,
      validator: (_, value) => {
        if (!value?.length) {
          return Promise.reject('请选择访问类型')
        }
        return Promise.resolve()
      }
    }
  ]
}

if (!('configuration' in formData)) {
  formData.configuration = {
    function: undefined,
    parameter: {}
  }
}

if (!('parameter' in formData.configuration)) {
  formData.configuration.parameter = {
    identity: undefined,
    byteCount: undefined,
    decimalCount: undefined
  }
}

if (!('pointKey' in formData)) {
  formData.pointKey = randomString(9)
}

const version = computed(() => {
  return channel.value?.configuration?.version || '1997'
})

// 检查是否支持功能码
const checkFunctionCode = async (code) => {
  const res = await request.post('/data-collect/DL645/command/CheckFunctionCode', {
    version: version.value,
    functionCode: code
  })
  formData.configuration.parameter.byteCount = res.result?.byteCount || undefined;
  formData.configuration.parameter.decimalCount = parseFloat(res.result?.decimalCount) || undefined;
  disabled.value = res.result.success;
  lastViidateValue.value = code;
}

const chooseFunctionCode = async (value) => {
  const res = await request.post('/data-collect/DL645/command/JudgeReadWrite', {
    controlCode: value
  })
  if (res.success) {
    let data = res.result || {}
    const dt = []
    if (data.read) {
      dt.push('read')
    }
    if (data.write) {
      dt.push('write')
    }
    formData.accessModes = dt
  }
};

const identityValidate = async (_rule, value) => {
  if (lastViidateValue.value === value) {
    return Promise.resolve();
  }
  disabled.value = false;
  if (!value) {
    return Promise.reject('请输入或选择功能标识');
  } else {
    if (version.value === '2007' && value.length < 8) {
      return Promise.reject('请输入8位的功能标识');
    }
    if (version.value === '1997' && value.length < 4) {
      return Promise.reject('请输入4位的功能标识');
    }
    return Promise.resolve();
  }
};

const onChange = (_value, selectedOptions) => {
  formData.configuration.parameter.identity = selectedOptions[selectedOptions.length - 1]?.value;
  isManualInput.value = false;
};

const inputIdentityChange = () => {
  identity.value = formData.configuration.parameter.identity
  isManualInput.value = true;
};

const getData = async (id) => {
  const resp = await request.get(`/data-collect/channel/${id}`)
  if (resp.success) {
    channel.value = resp.result
  }
}

watch(() => formData.configuration?.parameter?.identity, () => {
  if(formData.configuration?.parameter?.identity){
    checkFunctionCode(formData.configuration.parameter.identity)
  }
}, {
  immediate: true
})

watch(() => collector?.channelId, () => {
  if (collector?.channelId) {
    getData(collector?.channelId)
  }
}, {
  immediate: true
})
</script>
<style></style>
