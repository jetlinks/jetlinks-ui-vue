## Cropper
[地址](https://github.com/xyxiao001/vue-cropper)

## 二、文档

### 1. props

> 目前还不知道什么原因项目里面开启 `mock` 会导致 file 报错，建议使用时关掉 `mock`


名称 | 功能 | 默认值 | 可选值
--- | --- | --- | ---
img | 裁剪图片的地址 | 空 | `url 地址`, `base64`, `blob`
outputSize | 裁剪生成图片的质量 | `1` | 0.1 ~ 1
outputType | 裁剪生成图片的格式 | jpg (jpg 需要传入jpeg) | `jpeg`, `png`, `webp`
info | 裁剪框的大小信息 | `true` | `true`, `false`
canScale | 图片是否允许滚轮缩放 | `true` | `true`, `false`
autoCrop | 是否默认生成截图框 | `false` | `true`, `false`
autoCropWidth | 默认生成截图框宽度 | 容器的 80% | 0 ~ max
autoCropHeight | 默认生成截图框高度 | 容器的 80% | 0 ~ max
fixed | 是否开启截图框宽高固定比例 | `false` | `true`, `false`
fixedNumber | 截图框的宽高比例 | `[1, 1]` | `[ 宽度 ,  高度 ]`
full | 是否输出原图比例的截图 | `false` | `true`, `false`
fixedBox | 固定截图框大小 | 不允许改变 | `false` | `true`, `false`
canMove | 上传图片是否可以移动 | `true` | `true`, `false`
canMoveBox | 截图框能否拖动 | `true` | `true`, `false`
original | 上传图片按照原始比例渲染 | `false` | `true`, `false`
centerBox | 截图框是否被限制在图片里面 | `false` | `true`, `false`
high | 是否按照设备的dpr 输出等比例图片 | `true` | `true`, `false`
infoTrue | true 为展示真实输出图片宽高 `false` 展示看到的截图框宽高 | false | `true`, `false`
maxImgSize | 限制图片最大宽度和高度 | `2000` | 0 ~ max
enlarge | 图片根据截图框输出比例倍数 | `1` | 0 ~ max(建议不要太大不然会卡死的呢)
mode | 图片默认渲染方式 | `contain` | `contain` , `cover`, `100px`, `100%` auto
limitMinSize | 裁剪框限制最小区域 | 10 | Number, Array, String
fillColor | 导出时背景颜色填充 | 空 | `#ffffff`, `white`

### CropperModal props

名称 | 功能        | 默认值               | 可选值                        
--- |-----------|-------------------|----------------------------
img | 裁剪图片的地址   | 空                 | `url 地址`, `base64`, `blob` 
outputSize | 裁剪生成图片的质量 | `1`               | 0.1 ~ 1                    
outputType | 裁剪生成图片的格式 | jpg (jpg 需要传入jpeg) | `jpeg`, `png`, `webp`      
autoCrop | 是否默认生成截图框 | `true`            | `true`, `false`            
autoCropWidth | 默认生成截图框宽度 | 200               | 0 ~ max                    
autoCropHeight | 默认生成截图框高度 | 200               | 0 ~ max                    
fixedBox | 固定截图框大小        | `true`                     | `true`, `false`
openServer | 是否开启文件上传  |    `true`                     | `true`, `false`
