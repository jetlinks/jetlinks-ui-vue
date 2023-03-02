<template>
    <a-form
        v-if="variableDefinitions.length"
        :layout="'vertical'"
        ref="formRef"
        :model="modelRef"
    >
        <template v-for="item in variableDefinitions" :key="item.id">
            <a-form-item
                :name="item.id"
                :label="item.name"
                :rules="[{ required: true, message: `请输入${item.name}` }]"
            >
                <User
                    v-if="getType(item) === 'user'"
                    v-model="modelRef[`${item.id}`]"
                />
                <Org
                    v-else-if="getType(item) === 'org'"
                    v-model="modelRef[`${item.id}`]"
                />
                <Tag
                    v-else-if="getType(item) === 'tag'"
                    v-model="modelRef[`${item.id}`]"
                />
                <InputFile
                    v-else-if="getType(item) === 'file'"
                    v-model="modelRef[`${item.id}`]"
                />
                <a-input
                    v-else-if="getType(item) === 'link'"
                    v-model="modelRef[`${item.id}`]"
                />
                <BuildIn
                    v-else
                    v-model="modelRef[`${item.id}`]"
                />
            </a-form-item>
        </template>
    </a-form>
</template>

<script lang="ts" setup>
import BuildIn from './variableItem/BuildIn.vue';
import Org from './variableItem/Org.vue';
import Tag from './variableItem/Tag.vue';
import InputFile from './variableItem/InputFile.vue';
import User from './variableItem/User.vue';

const props = defineProps({
    variableDefinitions: {
        type: Array,
        default: () => [],
    },
    value: {
        type: Object,
        default: () => {},
    },
});

const formRef = ref();

const modelRef = reactive({});

Object.assign(formRef, props.value);

const getType = (item: any) => {
    return item.expands?.businessType || item.type;
};
</script>