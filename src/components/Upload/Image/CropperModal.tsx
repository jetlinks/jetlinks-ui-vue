import { defineComponent } from "vue";
import type { CSSProperties, PropType } from "vue";
import { Modal } from 'ant-design-vue'
import { VueCropper } from 'vue-cropper';
import { useRequest } from '@jetlinks-web/hooks'
import { fileUpload } from '@/api/comm'
import 'vue-cropper/dist/index.css'

const CropperModalProps = {
  title: {
    type: String
  },
  img: {
    type: String
  },
  width: {
    type: Number,
    default: 400
  },
  bodyStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({})
  },
  fixedBox: {
    type: Boolean,
    default: true
  },
  autoCrop: {
    type: Boolean,
    default: true
  },
  autoCropWidth: {
    type: Number,
    default: 200
  },
  autoCropHeight: {
    type: Number,
    default: 200
  },
  outputSize: {
    type: Number,
    default: 1
  },
  outputType: {
    type: String,
    default: 'jpeg'
  },
  openServer: {
    type: Boolean,
    default: true
  }
}

const CropperModal = defineComponent({
  name: 'CropperModal',
  props: CropperModalProps,
  emits: ['cancel', 'ok', 'change'],
  setup( props, { emit }) {

    const { title, width, openServer, bodyStyle, ...cropper } = props

    const { loading, run } = useRequest(fileUpload, {
      immediate: false,
      onSuccess(resp) {
        if (resp.success) {
          emit('ok', resp.result.accessUrl)
        }
      }
    })

    const cropperRef = ref()
    const imgUrl = ref()

    const onCancel = () => {
      emit('cancel')
    }

    const onOk = () => {
      cropperRef.value.getCropBlob( async (data: Blob) => {
        if (openServer) {
          const formData = new FormData()
          formData.append('file', data, new Date().getTime() + '.jpg')
          imgUrl.value = data
          loading.value = true
          // 上传文件
          run(formData)
        } else {
          emit('change', data)
          emit('ok', data)
        }
      })
    }

    return () => {
      console.log('cropper', cropper, loading.value)
      return (
        <Modal
          visible
          title={title}
          width={width}
          confirmLoading={loading.value}
          onCancel={onCancel}
          onOk={onOk}
        >
          <div
            style={{
              height: '300px',
              width: '100%',
              ...(bodyStyle || {})
            }}
          >
            <VueCropper ref={cropperRef} {...cropper}/>
          </div>
        </Modal>
      )
    }
  }
})

export default CropperModal
