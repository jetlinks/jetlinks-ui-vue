// 上传相关信息接口
export interface UploadInfoType {
    // 上传提示
    logoTip: object,
    icoTip: object,
    backgroundTip: object,
    // 上传的地址
    action: string,
    headers: object,
    // 是否展示uplaodList
    showUploadList: boolean,
    // 是否支持拖拽
    drag: true,
    // 上传接受的类型
    imageType: string,
    icoType: string,
  
    //验证图片是否在范围内
    isImageLessSize(file: File, size: number): boolean,
  
    // 验证是否是图片类型
    isImageType(file: File): boolean,
  
    // 验证是否时icon类型
    isIcoType(file: File): boolean,
  
    // 上传change事件
    changUpload(info: any, msg: string): void,
  
    // logo上传change事件
    changeLogoUpload(info): void,
  
    // 浏览器页签上传change事件
    changeIcoUpload(info): void,
  
    // 背景图片上传change事件
    changeBackgroundUpload(info): void,
  
    // logo 上传验证
    isLogoImage(file: File): boolean,
  
    // icon 上传验证
    isIcoImage(file: File): boolean,
  
    // 背景图片上传验证
    isBackground(file: File): boolean
  }

// 接收参数类型
export interface UploadPropsType {
    type: 'logo' | 'ico' | 'background'
    imgSrc: string
    height: string
    width: string
  }