<template>
  <a-form-item
      :label="$lang('DL645.point.20250207-1')"
      :name="['configuration', 'function']">
    <a-select
        v-model:value="formData.configuration.function"
        :options="functionCode"
        show-search
        :placeholder="$lang('DL645.point.20250207-2')"
        @change="chooseFunctionCode"
    />
  </a-form-item>
  <template
      v-if="formData.configuration?.function && formData.configuration?.function?.indexOf('ReadWriteMeterData') !== -1">
    <a-form-item
        :label="$lang('DL645.point.20250207-3')"
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
            :placeholder="$lang('DL645.point.20250207-4')"
            @change="inputIdentityChange"
            :maxlength="version === '2007' ? 8 : 4"
        />
      </a-cascader>
      <template #extra>
        {{
          version === '2007' ? $lang('DL645.point.20250207-5') : $lang('DL645.point.20250207-5')
        }}
      </template>
    </a-form-item>
    <a-form-item
        :label="$lang('DL645.point.20250207-7') "
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
          :placeholder="$lang('DL645.point.20250207-8') "
          :disabled="disabled"
      />
    </a-form-item>
    <a-form-item
        :label="$lang('DL645.point.20250207-9') "
        :name="['configuration', 'parameter', 'decimalCount']"
        :rules="{
          required: true,
          trigger: 'blur',
          message: $lang('DL645.point.20250207-10') ,
          pattern: pattern,
        }"
    >
      <a-select
          v-model:value="formData.configuration.parameter.decimalCount"
          :options="decimalCountOptions"
          :disabled="disabled"
          :placeholder="$lang('DL645.point.20250207-11') "
          :getPopupContainer="(triggerNode) => triggerNode.parentNode"
      >
      </a-select>
    </a-form-item>
  </template>
  <a-form-item
      :label="$lang('DL645.point.20250207-12') "
      :name="['accessModes']"
      :rules="[
    {
      required: true,
      validator: valValue
    }
  ]"
  >
    <j-check-button
        v-model:value="formData.accessModes"
        :multiple="true"
        :disabled="true"
        :options="[
          { label: $lang('DL645.point.20250207-13') , value: 'read' },
          { label: $lang('DL645.point.20250207-14') , value: 'write' },
        ]"
    />
  </a-form-item>
</template>
<script setup>
import {inject, ref, computed, watch} from 'vue'
import {request} from '@jetlinks-web/core'
import {randomString} from "@jetlinks-web/utils";
import {useLocales} from '@hooks'

const {$lang} = useLocales('DL645')
const formData = inject('plugin-form')
const collector = inject('plugin-form-collector')

const disabled = ref(false);
const pattern = /^(0\.0*1)$|^1$/;
const identity = ref({});
//是否是手动输入
const isManualInput = ref(false);
const lastValValue = ref();
const channel = ref()
/**
 * DLT645功能标识2007
 */

const DLT645Function07 = [
  {
    label: $lang('DL645.point.20250207-25'),
    value: 1,
    children: [
      {
        label: $lang('DL645.point.20250207-26'),
        value: '1-1',
        children: [
          {
            label: $lang('DL645.point.20250207-27'),
            value: '1-1-1',
            children: [
              {
                label: $lang('DL645.point.20250207-28') + '(00000000)',
                value: '00000000',
              },
              {
                label: $lang('DL645.point.20250207-29') + '(00000100)',
                value: '00000100',
              },
              {
                label: $lang('DL645.point.20250207-30') + '(00000200)',
                value: '00000200',
              },
              {
                label: $lang('DL645.point.20250207-31') + '(00000300)',
                value: '00000300',
              },
              {
                label: $lang('DL645.point.20250207-32') + '(00000400)',
                value: '00000400',
              },
            ],
          },
          {
            label: $lang('DL645.point.20250207-33') + '1',
            value: '1-1-2',
            children: [
              {
                label: $lang('DL645.point.20250207-28') + '(00030000)',
                value: '00030000',
              },
              {
                label: $lang('DL645.point.20250207-29') + '(00030100)',
                value: '00030100',
              },
              {
                label: $lang('DL645.point.20250207-30') + '(00030200)',
                value: '00030200',
              },
              {
                label: $lang('DL645.point.20250207-31') + '(00030300)',
                value: '00030300',
              },
              {
                label: $lang('DL645.point.20250207-32') + '(00030400)',
                value: '00030400',
              },
            ],
          },
          {
            label: $lang('DL645.point.20250207-33') + '2',
            value: '1-1-3',
            children: [
              {
                label: $lang('DL645.point.20250207-28') + '(00040000)',
                value: '00040000',
              },
              {
                label: $lang('DL645.point.20250207-29') + '(00040100)',
                value: '00040100',
              },
              {
                label: $lang('DL645.point.20250207-30') + '(00040200)',
                value: '00040200',
              },
              {
                label: $lang('DL645.point.20250207-31') + '(00040300)',
                value: '00040300',
              },
              {
                label: $lang('DL645.point.20250207-32') + '(00040400)',
                value: '00040400',
              },
            ],
          },
          {
            label: $lang('DL645.point.20250207-34'),
            value: '1-1-4',
            children: [
              {
                label: $lang('DL645.point.20250207-28') + '(00010000)',
                value: '00010000',
              },
              {
                label: $lang('DL645.point.20250207-29') + '(00010100)',
                value: '00010100',
              },
              {
                label: $lang('DL645.point.20250207-30') + '(00010200)',
                value: '00010200',
              },
              {
                label: $lang('DL645.point.20250207-31') + '(00010300)',
                value: '00010300',
              },
              {
                label: $lang('DL645.point.20250207-32') + '(00010400)',
                value: '00010400',
              },
            ],
          },
          {
            label: $lang('DL645.point.20250207-35'),
            value: '1-1-5',
            children: [
              {
                label: $lang('DL645.point.20250207-28') + '(00020000)',
                value: '00020000',
              },
              {
                label: $lang('DL645.point.20250207-29') + '(00020100)',
                value: '00020100',
              },
              {
                label: $lang('DL645.point.20250207-20') + '(00020200)',
                value: '00020200',
              },
              {
                label: $lang('DL645.point.20250207-31') + '(00020300)',
                value: '00020300',
              },
              {
                label: $lang('DL645.point.20250207-32') + '(00020400)',
                value: '00020400',
              },
            ],
          },
          {
            label: $lang('DL645.point.20250207-36'),
            value: '1-1-6',
            children: [
              {
                label: $lang('DL645.point.20250207-37') + '(00150000)',
                value: '00150000',
              },
              {
                label: $lang('DL645.point.20250207-38') + '(00160000)',
                value: '00160000',
              },
              {
                label: $lang('DL645.point.20250207-39') + '(00170000)',
                value: '00170000',
              },
              {
                label: $lang('DL645.point.20250207-40') + '(00180000)',
                value: '00180000',
              },
            ],
          },
          {
            label: $lang('DL645.point.20250207-41'),
            value: '1-1-7',
            children: [
              {
                label: $lang('DL645.point.20250207-37') + '(00290000)',
                value: '00290000',
              },
              {
                label: $lang('DL645.point.20250207-38') + '(002A0000)',
                value: '002A0000',
              },
              {
                label: $lang('DL645.point.20250207-39') + '(002B0000)',
                value: '002B0000',
              },
              {
                label: $lang('DL645.point.20250207-40') + '(002C0000)',
                value: '002C0000',
              },
            ],
          },
          {
            label: $lang('DL645.point.20250207-42'),
            value: '1-1-8',
            children: [
              {
                label: $lang('DL645.point.20250207-37') + '(003D0000)',
                value: '003D0000',
              },
              {
                label: $lang('DL645.point.20250207-38') + '(003E0000)',
                value: '003E0000',
              },
              {
                label: $lang('DL645.point.20250207-39') + '(003F0000)',
                value: '003F0000',
              },
              {
                label: $lang('DL645.point.20250207-40') + '(00400000)',
                value: '00400000',
              },
            ],
          },
        ],
      },
      {
        label: $lang('DL645.point.20250207-42-1'),
        value: '1-2',
        children: [
          {
            label: $lang('DL645.point.20250207-27'),
            value: '1-2-1',
            children: [
              {
                label: $lang('DL645.point.20250207-28') + '(00000001)',
                value: '00000001',
              },
              {
                label: $lang('DL645.point.20250207-29') + '(00000101)',
                value: '00000101',
              },
              {
                label: $lang('DL645.point.20250207-30') + '(00000201)',
                value: '00000201',
              },
              {
                label: $lang('DL645.point.20250207-31') + '(00000301)',
                value: '00000301',
              },
              {
                label: $lang('DL645.point.20250207-32') + '(00000401)',
                value: '00000401',
              },
            ],
          },
          {
            label: $lang('DL645.point.20250207-33') + '1',
            value: '1-2-2',
            children: [
              {
                label: $lang('DL645.point.20250207-28') +'(00030001)',
                value: '00030001',
              },
              {
                label: $lang('DL645.point.20250207-29') +'(00030101)',
                value: '00030101',
              },
              {
                label: $lang('DL645.point.20250207-30') +'(00030201)',
                value: '00030201',
              },
              {
                label: $lang('DL645.point.20250207-31') +'(00030301)',
                value: '00030301',
              },
              {
                label: $lang('DL645.point.20250207-32') +'(00030401)',
                value: '00030401',
              },
            ],
          },
          {
            label: $lang('DL645.point.20250207-33') + '2',
            value: '1-2-3',
            children: [
              {
                label: $lang('DL645.point.20250207-28') +'(00040001)',
                value: '00040001',
              },
              {
                label: $lang('DL645.point.20250207-29') +'(00040101)',
                value: '00040101',
              },
              {
                label: $lang('DL645.point.20250207-30') +'(00040201)',
                value: '00040201',
              },
              {
                label: $lang('DL645.point.20250207-31') +'(00040301)',
                value: '00040301',
              },
              {
                label: $lang('DL645.point.20250207-32') +'(00040401)',
                value: '00040401',
              },
            ],
          },
          {
            label: $lang('DL645.point.20250207-34'),
            value: '1-2-4',
            children: [
              {
                label: $lang('DL645.point.20250207-28') +'(00010001)',
                value: '00010001',
              },
              {
                label: $lang('DL645.point.20250207-29') +'(00010101)',
                value: '00010101',
              },
              {
                label: $lang('DL645.point.20250207-30') +'(00010201)',
                value: '00010201',
              },
              {
                label: $lang('DL645.point.20250207-31') +'(00010301)',
                value: '00010301',
              },
              {
                label: $lang('DL645.point.20250207-32') +'(00010401)',
                value: '00010401',
              },
            ],
          },
          {
            label: $lang('DL645.point.20250207-35'),
            value: '1-2-5',
            children: [
              {
                label: $lang('DL645.point.20250207-28') + '总电量(00020001)',
                value: '00020001',
              },
              {
                label: $lang('DL645.point.20250207-29') + '尖电量(00020101)',
                value: '00020101',
              },
              {
                label: $lang('DL645.point.20250207-30') + '锋电量(00020201)',
                value: '00020201',
              },
              {
                label: $lang('DL645.point.20250207-31') + '平电量(00020301)',
                value: '00020301',
              },
              {
                label: $lang('DL645.point.20250207-32') + '谷电量(00020401)',
                value: '00020401',
              },
            ],
          },
          {
            label: $lang('DL645.point.20250207-36'),
            value: '1-2-6',
            children: [
              {
                label: $lang('DL645.point.20250207-37') + '(00150001)',
                value: '00150001',
              },
              {
                label: $lang('DL645.point.20250207-38') + '(00160001)',
                value: '00160001',
              },
              {
                label: $lang('DL645.point.20250207-39') + '(00170001)',
                value: '00170001',
              },
              {
                label: $lang('DL645.point.20250207-40') + '(00180001)',
                value: '00180001',
              },
            ],
          },
          {
            label: $lang('DL645.point.20250207-41'),
            value: '1-2-7',
            children: [
              {
                label: $lang('DL645.point.20250207-37') +'(00150001)',
                value: '00150001',
              },
              {
                label: $lang('DL645.point.20250207-38') +'(00160001)',
                value: '00160001',
              },
              {
                label: $lang('DL645.point.20250207-39') +'(00170001)',
                value: '00170001',
              },
              {
                label: $lang('DL645.point.20250207-40') + '(00180001)',
                value: '00180001',
              },
            ],
          },
          {
            label: $lang('DL645.point.20250207-42'),
            value: '1-2-8',
            children: [
              {
                label: $lang('DL645.point.20250207-37') +'(00150000)',
                value: '00150000',
              },
              {
                label: $lang('DL645.point.20250207-38') +'(00160000)',
                value: '00160000',
              },
              {
                label: $lang('DL645.point.20250207-39') +'(00170000)',
                value: '00170000',
              },
              {
                label: $lang('DL645.point.20250207-40') + '(00180000)',
                value: '00180000',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: $lang('DL645.point.20250207-43'),
    value: 2,
    children: [
      {
        label: $lang('DL645.point.20250207-44'),
        value: '2-1',
        children: [
          {
            label: $lang('DL645.point.20250207-45') + '(02010100)',
            value: '02010100',
          },
          {
            label: $lang('DL645.point.20250207-46') + '(02010200)',
            value: '02010200',
          },
          {
            label: $lang('DL645.point.20250207-47') + '(02010300)',
            value: '02010300',
          },
        ],
      },
      {
        label: $lang('DL645.point.20250207-48'),
        value: '2-2',
        children: [
          {
            label: $lang('DL645.point.20250207-49') + '(02020100)',
            value: '02020100',
          },
          {
            label: $lang('DL645.point.20250207-50') + '(02020200)',
            value: '02020200',
          },
          {
            label: $lang('DL645.point.20250207-51') + '(02020300)',
            value: '02020300',
          },
        ],
      },
      {
        label: $lang('DL645.point.20250207-52'),
        value: '2-3',
        children: [
          {
            label: $lang('DL645.point.20250207-53') + '(02030000)',
            value: '02030000',
          },
          {
            label: $lang('DL645.point.20250207-54') + '(02030100)',
            value: '02030100',
          },
          {
            label: $lang('DL645.point.20250207-55') + '(02030200)',
            value: '02030200',
          },
          {
            label: $lang('DL645.point.20250207-56') + '(02030300)',
            value: '02030300',
          },
        ],
      },
      {
        label: $lang('DL645.point.20250207-57'),
        value: '2-4',
        children: [
          {
            label: $lang('DL645.point.20250207-57-1') + '(02040000)',
            value: '02040000',
          },
          {
            label: $lang('DL645.point.20250207-57-2') + '(02040100)',
            value: '02040100',
          },
          {
            label: $lang('DL645.point.20250207-57-3') + '(02040200)',
            value: '02040200',
          },
          {
            label: $lang('DL645.point.20250207-57-4') + '(02040300)',
            value: '02040300',
          },
        ],
      },
      {
        label: $lang('DL645.point.20250207-58'),
        value: '2-5',
        children: [
          {
            label: $lang('DL645.point.20250207-59-1') + '(02050000)',
            value: '02050000',
          },
          {
            label: $lang('DL645.point.20250207-59') + '(02050100)',
            value: '02050100',
          },
          {
            label: $lang('DL645.point.20250207-60') + '(02050200)',
            value: '02050200',
          },
          {
            label: $lang('DL645.point.20250207-61') + '(02050300)',
            value: '02050300',
          },
        ],
      },
      {
        label: $lang('DL645.point.20250207-62'),
        value: '2-6',
        children: [
          {
            label: $lang('DL645.point.20250207-63') + '(02060000)',
            value: '02060000',
          },
          {
            label: $lang('DL645.point.20250207-64') + '(02060100)',
            value: '02060100',
          },
          {
            label: $lang('DL645.point.20250207-65') + '(02060200)',
            value: '02060200',
          },
          {
            label: $lang('DL645.point.20250207-66') + '(02060300)',
            value: '02060300',
          },
        ],
      },
      {
        label: $lang('DL645.point.20250207-67') + '(02800001)',
        value: '02800001',
      },
      {
        label: $lang('DL645.point.20250207-68') + '(02800002)',
        value: '02800002',
      },
      {
        label: $lang('DL645.point.20250207-69') + '(02800004)',
        value: '02800004',
      },
      {
        label: $lang('DL645.point.20250207-70') + '(02800005)',
        value: '02800005',
      },
      {
        label: $lang('DL645.point.20250207-71') + '(02800006)',
        value: '02800006',
      },
      {
        label: $lang('DL645.point.20250207-71-1') + '(02800007)',
        value: '02800007',
      },
      {
        label: $lang('DL645.point.20250207-72') + '(02800008)',
        value: '02800008',
      },
      {
        label: $lang('DL645.point.20250207-73') + '(0280000A)',
        value: '0280000A',
      },
    ],
  },
  {
    label: $lang('DL645.point.20250207-74'),
    value: 3,
    children: [
      {
        label: $lang('DL645.point.20250207-75') + '(04000401)',
        value: '04000401',
      },
      {
        label: $lang('DL645.point.20250207-76') + '(04800001)',
        value: '04800001',
      },
      {
        label: $lang('DL645.point.20250207-77') + '(04000301)',
        value: '04000301',
      },
      {
        label: $lang('DL645.point.20250207-78') + '(04000302)',
        value: '04000302',
      },
      {
        label: $lang('DL645.point.20250207-79') + '(04000303)',
        value: '04000303',
      },
      {
        label: $lang('DL645.point.20250207-80') + '(04000304)',
        value: '04000304',
      },
      {
        label: $lang('DL645.point.20250207-81') + '1(04000501)',
        value: '04000501',
      },
      {
        label: $lang('DL645.point.20250207-81') + '2(04000502)',
        value: '04000502',
      },
      {
        label: $lang('DL645.point.20250207-81') + '3(04000503)',
        value: '04000503',
      },
      {
        label: $lang('DL645.point.20250207-81') + '4(04000504)',
        value: '04000504',
      },
      {
        label: $lang('DL645.point.20250207-81') + '5(04000505)',
        value: '04000505',
      },
      {
        label: $lang('DL645.point.20250207-81') + '6(04000506)',
        value: '04000506',
      },
      {
        label: $lang('DL645.point.20250207-81') + '7(04000507)',
        value: '04000507',
      },
      {
        label: $lang('DL645.point.20250207-82') + '(04090301)',
        value: '04090301',
      },
      {
        label: $lang('DL645.point.20250207-83') + '(04090302)',
        value: '04090302',
      },
      {
        label: $lang('DL645.point.20250207-84') + '(04090B01)',
        value: '04090B01',
      },
      {
        label: $lang('DL645.point.20250207-85') + '(04090801)',
        value: '04090801',
      },
      {
        label: $lang('DL645.point.20250207-86') + '(04090D01)',
        value: '04090D01',
      },
      {
        label: $lang('DL645.point.20250207-87') + '(04090D02)',
        value: '04090D02',
      },
      {
        label: $lang('DL645.point.20250207-88') + '(04090E01)',
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
    label: $lang('DL645.point.20250207-25'),
    value: '1',
    children: [
      {
        label: $lang('DL645.point.20250207-26'),
        value: '1-1',
        children: [
          {
            label: $lang('DL645.point.20250207-89') + '(9010)',
            value: '9010',
          },
          {
            label: $lang('DL645.point.20250207-90') + '(9020)',
            value: '9020',
          },
          {
            label: $lang('DL645.point.20250207-91') + '(9110)',
            value: '9110',
          },
          {
            label: $lang('DL645.point.20250207-91') + '(9120)',
            value: '9120',
          },
        ],
      },
      {
        label: $lang('DL645.point.20250207-92-1'),
        value: '1-2',
        children: [
          {
            label: $lang('DL645.point.20250207-89') + '(9410)',
            value: '9410',
          },
          {
            label: $lang('DL645.point.20250207-90') + '(9420)',
            value: '9420',
          },
          {
            label: $lang('DL645.point.20250207-91') + '(9510)',
            value: '9510',
          },
          {
            label: $lang('DL645.point.20250207-91') + '(9520)',
            value: '9520',
          },
        ],
      },
      {
        label: $lang('DL645.point.20250207-92'),
        value: '1-3',
        children: [
          {
            label: $lang('DL645.point.20250207-89') + '(9810)',
            value: '9810',
          },
          {
            label: $lang('DL645.point.20250207-90') + '(9820)',
            value: '9820',
          },
          {
            label: $lang('DL645.point.20250207-91') + '(9910)',
            value: '9910',
          },
          {
            label: $lang('DL645.point.20250207-91') + '(9920)',
            value: '9920',
          },
        ],
      },
    ],
  },
  {
    label: $lang('DL645.point.20250207-43'),
    value: '2',
    children: [
      {
        label: $lang('DL645.point.20250207-44'),
        value: '2-1',
        children: [
          {
            label: $lang('DL645.point.20250207-45') + '(B611)',
            value: 'B611',
          },
          {
            label: $lang('DL645.point.20250207-46') + '(B612)',
            value: 'B612',
          },
          {
            label: $lang('DL645.point.20250207-47') + '(B613)',
            value: 'B613',
          },
        ],
      },
      {
        label: $lang('DL645.point.20250207-48'),
        value: '2-2',
        children: [
          {
            label: $lang('DL645.point.20250207-45') + '(B621)',
            value: 'B621',
          },
          {
            label: $lang('DL645.point.20250207-46') + '(B622)',
            value: 'B622',
          },
          {
            label: $lang('DL645.point.20250207-47') + '(B623)',
            value: 'B623',
          },
        ],
      },
      {
        label: $lang('DL645.point.20250207-93'),
        value: '1-3',
        children: [
          {
            label: $lang('DL645.point.20250207-104') + '(B630)',
            value: 'B630',
          },
          {
            label: $lang('DL645.point.20250207-94') + '(B631)',
            value: 'B631',
          },
          {
            label: $lang('DL645.point.20250207-95') + '(B632)',
            value: 'B632',
          },
          {
            label: $lang('DL645.point.20250207-96') + '(B633)',
            value: 'B633',
          },
          {
            label: $lang('DL645.point.20250207-97') + '(B634)',
            value: 'B634',
          },
          {
            label: $lang('DL645.point.20250207-98') + '(B635)',
            value: 'B635',
          },
        ],
      },
      {
        label: $lang('DL645.point.20250207-57'),
        value: '1-4',
        children: [
          {
            label: $lang('DL645.point.20250207-99') + '(B640)',
            value: 'B640',
          },
          {
            label: $lang('DL645.point.20250207-100') + '(B641)',
            value: 'B641',
          },
          {
            label: $lang('DL645.point.20250207-101') + '(B642)',
            value: 'B642',
          },
          {
            label: $lang('DL645.point.20250207-102') + '(B643)',
            value: 'B643',
          },
        ],
      },
      {
        label: $lang('DL645.point.20250207-58'),
        value: '1-5',
        children: [
          {
            label: $lang('DL645.point.20250207-103') + '(B650)',
            value: 'B650',
          },
          {
            label: $lang('DL645.point.20250207-59') + '(B651)',
            value: 'B651',
          },
          {
            label: $lang('DL645.point.20250207-60') + '(B652)',
            value: 'B652',
          },
          {
            label: $lang('DL645.point.20250207-61') + '(B653)',
            value: 'B653',
          },
        ]
      },
    ],
  },
  {
    label: $lang('DL645.point.20250207-74'),
    value: '1-6',
    children: [
      {
        label: $lang('DL645.point.20250207-81') + '1(C020)',
        value: 'C020',
      },
      {
        label: $lang('DL645.point.20250207-81') + '2(C021)',
        value: 'C021',
      },
      {
        label: $lang('DL645.point.20250207-81') + '3(C023)',
        value: 'C023',
      },
    ]
  }
];


const functionCode = computed(() => {
  if (version.value === '2007') {
    return [
      {label: $lang('DL645.point.20250207-19'), value: 'ReadWriteMeterData'},
      {label: $lang('DL645.point.20250207-20'), value: 'ReadWriteMeterNumber'},
      {label: $lang('DL645.point.20250207-21'), value: 'ModifyTheCommunicationRate'},
      {label: $lang('DL645.point.20250207-22'), value: 'TripControl'},
    ];
  } else {
    return [
      {label: $lang('DL645.point.20250207-23'), value: 'ReadWriteMeterData97'},
      {label: $lang('DL645.point.20250207-24'), value: 'ReadWriteMeterNumber97'},
      {label: $lang('DL645.point.20250207-21'), value: 'ModifyTheCommunicationRate97'},
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

const valValue = (_, value) => {
  if (!value?.length) {
    return Promise.reject($lang('DL645.point.20250207-15'))
  }
  return Promise.resolve()
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
  lastValValue.value = code;
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
  if (lastValValue.value === value) {
    return Promise.resolve();
  }
  disabled.value = false;
  if (!value) {
    return Promise.reject($lang('DL645.point.20250207-16'));
  } else {
    if (version.value === '2007' && value.length < 8) {
      return Promise.reject($lang('DL645.point.20250207-17'));
    }
    if (version.value === '1997' && value.length < 4) {
      return Promise.reject($lang('DL645.point.20250207-18'));
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
