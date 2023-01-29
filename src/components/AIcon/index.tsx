import { createFromIconfontCN } from '@ant-design/icons-vue';
import * as $Icon from '@ant-design/icons-vue';
import { createVNode } from 'vue';

const AliIcon = createFromIconfontCN({
    scriptUrl: '/icons/iconfont.js', // 在 iconfont.cn 上生成
});

const AntdIcon = (props: {type: string}) => {
    const {type} = props;
    let antIcon: {[key: string]: any} = $Icon
    return createVNode(antIcon[type])
}

const iconKeys = [
    'EyeOutlined',
    'EditOutlined',
    'PlusOutlined',
    'DeleteOutlined',
    'CheckCircleOutlined',
    'StopOutlined',
    'CheckOutlined',
    'CloseOutlined',
    'DownOutlined',
    'ImportOutlined',
    'ExportOutlined',
    'SyncOutlined',
    'ExclamationCircleOutlined',
    'UploadOutlined',
    'PlusCircleOutlined',
    'MenuUnfoldOutlined',
    'MenuFoldOutlined',
    'QuestionCircleOutlined',
    'InfoCircleOutlined'
]

const Icon = (props: {type: string}) => {
    if(iconKeys.includes(props.type)) return <AntdIcon {...props} />
    return <AliIcon {...props} />
}

export default Icon