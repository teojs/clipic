# Clipic.js

![avatar](https://img.shields.io/github/package-json/v/teojs/clipic.svg)
![avatar](https://img.shields.io/github/size/teojs/clipic/dist/clipic.min.js.svg)

> 移动端图片裁剪工具，适用于上传头像并裁剪成指定尺寸

用手机访问此页面体验：[https://teojs.github.io/clipic](https://teojs.github.io/clipic 'Clipic.js')

或者用手机扫此二维码进入

![avatar](./src/assets/qrcode.png)

## npm 方式

```bath
$ npm install clipic
```

在 vue 项目里使用

```html
// xxx.vue
<template>
  <img :src="base64" />
  <input type="file" name="file" accept="image/*" @change="uploadImg" />
</template>
<script>
  import Clipic from 'clipic'
  const clipic = new Clipic()
  export default {
    data () {
      return {
        base64: ''
      }
    }
    methods: {
      uploadImg(event) {
        const files = event.files
        const reader = new FileReader()
        reader.readAsDataURL(files[0])
        reader.onload = img => {
          clipic.getImage({
            width: 500,
            height: 400,
            src: img.target.result,
            onDone: base64 => {
              this.base64 = base64
            }
          })
        }
        event.value = ''
      }
    }
  }
</script>
```

## cdn 方式

```html
<!-- xxx.html -->
<script src="https://unpkg.com/clipic/dist/clipic.min.js"></script>
<script>
  var clipic = new Clipic()
  clipic.getImage({
    width: 500,
    height: 400,
    // ratio: 4 / 3,
    src: 'xxx',
    type: 'jpeg',
    quality: 0.8,
    onDone: function(base64) {
      // ...
    },
    onCancel: function() {
      // ...
    }
  })
</script>
```

## 参数说明

- `width:Number` (默认：500) -- 裁剪宽度
- `height:Number` (默认：500) -- 裁剪高度
- `ratio:Number` (可选) -- 裁剪的比例，当传入`ratio`时`width/height`将无效
- `src:String` (必传) -- 需要裁剪的图片，可以是图片链接，或者 base64
- `type:String` (默认：jpeg) -- 裁剪后图片的类型，仅支持 jpeg/png 两种
- `quality:Number` (默认：0.9) -- 压缩质量
- `buttonText:Array` (默认：['取消', '重置', '完成']) -- 底部三个按钮文本
