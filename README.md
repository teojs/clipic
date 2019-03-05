# Clipic.js

![avatar](https://img.shields.io/github/package-json/v/teojs/clipic.svg)
![avatar](https://img.shields.io/github/size/teojs/clipic/dist/clipic.min.js.svg)

> 移动端图片裁剪工具，适用于上传头像并裁剪成指定尺寸

用手机访问此页面体验：[https://teojs.github.io/clipic](https://teojs.github.io/clipic "Clipic.js")

或者用手机扫此二维码进入

![avatar](./src/assets/qrcode.png)

## npm方式

```bath
$ npm install clipic
```

## cdn引入

```html
<script src="https://unpkg.com/clipic/dist/clipic.min.js"></script>
```

## 使用

```js
import Clipic from 'clipic'
const clipic = new Clipic()
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
```

## 参数说明

- `width:number` (默认：500) -- 裁剪宽度
- `height:number` (默认：500) -- 裁剪高度
- `ratio:number` (可选) -- 裁剪的比例，当传入`ratio`时`width/height`将无效
- `src:string` (必传) -- 需要裁剪的图片，可以是图片链接，或者 base64
- `type:string` (默认：jpeg) -- 裁剪后图片的类型，仅支持 jpeg/png 两种
- `quality:number` (默认：0.9) -- 压缩质量
