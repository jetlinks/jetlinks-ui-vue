import DingTalk from './DingTalk';
import DingTalkRebot from './DingTalkRebot';
import AliyunSms from './AliyunSms';
import AliyunVoice from './AliyunVoice';
import Email from './Email';
import Webhook from './Webhook';
import WeixinApp from './WeixinApp';
import WeixinCorp from './WeixinCorp';

export default defineComponent({
    name: 'Doc',
    props: {
        docData: {
            type: Object,
            default: () => ({}),
        },
    },
    setup(props) {
        const docMap = {
            weixin: {
                corpMessage: <WeixinCorp />,
                officialMessage: <WeixinApp />,
            },
            dingTalk: {
                dingTalkMessage: <DingTalk />,
                dingTalkRobotWebHook: <DingTalkRebot />,
            },
            voice: {
                aliyun: <AliyunVoice />,
            },
            sms: {
                aliyunSms: <AliyunSms />,
            },
            email: {
                embedded: <Email />,
            },
            webhook: {
                http: <Webhook />,
            },
        };

        return () => (
            docMap?.[props.docData.type]?.[props.docData.provider]
        )
    },
});
