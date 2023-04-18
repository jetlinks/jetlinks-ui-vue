// import './index.less';
import { Image } from 'jetlinks-ui-components';
import { getImage } from '@/utils/comm';

const AliyunVoice = () => {
    const accessKey = getImage(
        '/notice/doc/config/aliyun-sms-voice/AccesskeyIDSecret.jpg',
    );

    return (
        <div class={'doc'}>
            <div class={'url'}>
                阿里云管理控制台：
                <a
                    href="https://home.console.aliyun.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://home.console.aliyun.com
                </a>
            </div>
            <h1>1. 概述</h1>
            <div>
                通知配置可以结合通知配置为告警消息通知提供支撑。也可以用于系统中其他自定义模块的调用。
            </div>
            <h1>2.通知配置说明</h1>
            <div>
                <h2>1、RegionID</h2>
                <div>
                    阿里云服务地域与对应的RegionID。请根据购买的阿里云服务器地域进行选择。
                </div>
            </div>
            <h2>2、AccesskeyID/Secret</h2>
            <div>
                <div>
                    用于程序通知方式调用云服务费API的用户标识和秘钥获取路径：“阿里云管理控制台”--“用户头像”--“”--“AccessKey管理”--“查看”
                </div>
            </div>
            <div class={'image'}>
                <Image width="100%" src={accessKey} />
            </div>
        </div>
    );
};
export default AliyunVoice;
