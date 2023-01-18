import './index.less';
import { Image } from 'ant-design-vue';
import { getImage } from '@/utils/comm';

const WeixinApp = () => {
    const appId = getImage('/notice/doc/config/weixin-official/01-AppID.jpg');
    const appSecret = getImage(
        '/notice/doc/config/weixin-official/02-AppSecret.jpg',
    );

    return (
        <div class={'doc'}>
            <div class={'url'}>
                微信公众平台：
                <a
                    href="https://mp.weixin.qq.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://mp.weixin.qq.com/
                </a>
            </div>
            <h1>1. 概述</h1>
            <div>
                通知配置可以结合通知配置为告警消息通知提供支撑。也可以用于系统中其他自定义模块的调用。
            </div>
            <h1>2.通知配置说明</h1>
            <div>
                <h2>1、AppID</h2>
                <div>微信服务号的唯一专属编号。</div>
                <div>
                    获取路径：“微信公众平台”管理后台--“设置与开发”--“基本配置”
                </div>
                <div class={'image'}>
                    <Image width="100%" src={appId} />
                </div>
            </div>
            <h2>2、AppSecret</h2>
            <div>
                <div>公众号开发者身份的密码</div>
                <div>
                    获取路径：“微信公众平台”管理后台--“设置与开发”--“基本配置”
                </div>
                <div class={'image'}>
                    <Image width="100%" src={appSecret} />
                </div>
            </div>
        </div>
    );
};
export default WeixinApp;
