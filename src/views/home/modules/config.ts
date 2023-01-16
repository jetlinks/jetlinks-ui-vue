// import {getImage} from '@/utils/comm'
import { usePermissionStore } from "@/store/permission";
import { recommendList, bootConfig } from "../index";


// 权限控制
const hasPermission = usePermissionStore().hasPermission;
const productPermission = (action: string) =>
    hasPermission(`device/Product:${action}`);
const devicePermission = (action: string) =>
    hasPermission(`device/Instance:${action}`);
const rulePermission = (action: string) =>
    hasPermission(`rule-engine/Instance:${action}`);


// 物联网引导-数据
export const deviceBootConfig: bootConfig[] = [
    {
        english: 'STEP1',
        label: '创建产品',
        link: '/a',
        auth: productPermission('add'),
        params: {
            save: true,
        },
    },
    {
        english: 'STEP2',
        label: '创建设备',
        link: '/b',
        auth: devicePermission('add'),
        params: {
            save: true,
        },
    },
    {
        english: 'STEP3',
        label: '规则引擎',
        link: '/c',
        auth: rulePermission('add'),
        params: {
            save: true,
        },
    },
];
// 设备接入推荐步骤-数据
export const deviceStepDetails: recommendList[] = [
    {
        title: '创建产品',
        details:
            '产品是设备的集合，通常指一组具有相同功能的设备。物联设备必须通过产品进行接入方式配置。',
        iconUrl: '/images/home/bottom-4.png',
        linkUrl: '/a',
        auth: productPermission('add'),
        params: {
            save: true,
        },
    },
    {
        title: '配置产品接入方式',
        details:
            '通过产品对同一类型的设备进行统一的接入方式配置。请参照设备铭牌说明选择匹配的接入方式。',
        iconUrl: '/images/home/bottom-1.png',
        linkUrl: '/a',
        auth: productPermission('update'),
        dialogTag: 'accessMethod',
    },
    {
        title: '添加测试设备',
        details: '添加单个设备，用于验证产品模型是否配置正确。',
        iconUrl: '/images/home/bottom-5.png',
        linkUrl: '/a',
        auth: devicePermission('add'),
        params: {
            save: true,
        },
    },
    {
        title: '功能调试',
        details:
            '对添加的测试设备进行功能调试，验证能否连接到平台，设备功能是否配置正确。',
        iconUrl: '/images/home/bottom-2.png',
        linkUrl: '/a',
        auth: devicePermission('update'),
        dialogTag: 'funcTest',
    },
    {
        title: '批量添加设备',
        details: '批量添加同一产品下的设备',
        iconUrl: '/images/home/bottom-3.png',
        linkUrl: '/a',
        auth: devicePermission('import'),
        params: {
            import: true,
        },
    },
];


// 运维管理引导-数据
export const opsBootConfig: bootConfig[] = [
    {
        english: 'STEP1',
        label: '设备接入配置',
        link: '/a',
        auth: true,
    },
    {
        english: 'STEP2',
        label: '日志排查',
        link: '/b',
        auth: true,
        params: {
            key: 'system',
        },
    },
    {
        english: 'STEP3',
        label: '实时监控',
        link: '/c',
        auth: false,
        params: {
            save: true,
        },
    },
];
// 运维管理推荐步骤-数据
export const opsStepDetails: recommendList[] = [
    {
        title: '协议管理',
        details:
            '根据业务需求自定义开发对应的产品（设备模型）接入协议，并上传到平台。',
        iconUrl: '/images/home/bottom-1.png',
        linkUrl: '/a',
        auth: true,
        params: {
            a: 1,
            save: true,
        },
    },
    {
        title: '证书管理',
        details: '统一维护平台内的证书，用于数据通信加密。',
        iconUrl: '/images/home/bottom-6.png',
        linkUrl: '/a',
        auth: true,
        params: {
            a: 1,
            save: false,
        },
    },
    {
        title: '网络组件',
        details: '根据不同的传输类型配置平台底层网络组件相关参数。',
        iconUrl: '/images/home/bottom-3.png',
        linkUrl: '/a',
        auth: true,
    },
    {
        title: '设备接入网关',
        details: '根据不同的传输类型，关联消息协议，配置设备接入网关相关参数。',
        iconUrl: '/images/home/bottom-4.png',
        linkUrl: '/a',
        auth: true,
    },
    {
        title: '日志管理',
        details: '监控系统日志，及时处理系统异常。',
        iconUrl: '/images/home/bottom-5.png',
        linkUrl: '/a',
        auth: false,
        params: {
            key: 'system',
        }
    },
];