import './index.less';
import { Image } from 'ant-design-vue';
import { configImages } from '../../../../assets/notice/index';
import i18n from '@jetlinks-web-core/locales/index'
const $t = i18n.global.t
const AliyunVoice = () => {
    const accessKey = configImages.AccesskeyIDSecret;

    return (
        <div class={'doc'}>
            <div class={'url'}>
                {$t('doc.AliyunVoice.7077010-0')}
                <a
                    href="https://home.console.aliyun.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://home.console.aliyun.com
                </a>
            </div>
            <h1>{$t('doc.AliyunVoice.7077010-1')}</h1>
            <div>
                {$t('doc.AliyunVoice.7077010-2')}
            </div>
            <h1>{$t('doc.AliyunVoice.7077010-3')}</h1>
            <div>
                <h2>1、RegionID</h2>
                <div>
                    {$t('doc.AliyunVoice.7077010-4')}
                </div>
            </div>
            <h2>2、AccesskeyID/Secret</h2>
            <div>
                <div>
                    {$t('doc.AliyunVoice.7077010-5')}
                </div>
            </div>
            <div class={'image'}>
                <Image width="100%" src={accessKey} />
            </div>
        </div>
    );
};
export default AliyunVoice;
