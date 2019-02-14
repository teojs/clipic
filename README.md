# breathjs

一个类似呼吸节奏的动画库，支持 css3 transform 多种属性

## js 使用

```bash
#bash

npm install breathjs -save
```

```js
// xxx.js

import Breath from 'breath'
const breath = new Breath()
breath.init()
```

或者

```html
<!-- xxx.html -->

<script src="/dist/breath.min.js"></script>
```

## html 使用

```html
<!-- html -->

<div data-breath="scale(1.2, 1.2)">缩放</div>
<div data-breath="rotate(30deg)">旋转</div>
<div data-breath="translate(10px, 10px)">位移</div>
<div data-breath="skew(30deg)">倾斜</div>
<div data-breath="scale(1.2, 1.2);rotate(30deg)">多动画用‘;’隔开</div>
<div data-breath="rotate(30deg);origin(left top)">改变旋转轴</div>
<div data-breath="rotate(30deg);duration(2000)">更默认为1500毫秒的动画时间</div>
<div data-breath="rotate(30deg);timing(ease)">更默认为linear的动画曲线</div>
```
