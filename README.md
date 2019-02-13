# breathejs
一个类似呼吸节奏的动画库，支持css3 transform 多种属性

## 使用

```js
// js
import Breathe from 'breathe'
const breathe = new Breathe()
breathe.init()
```

```html
<!-- html -->
<div data-breathe="scale(1.2, 1.2)">缩放</div>
<div data-breathe="rotate(30deg)">旋转</div>
<div data-breathe="translate(10px, 10px)">位移</div>
<div data-breathe="skew(30deg)">倾斜</div>
<div data-breathe="scale(1.2, 1.2);rotate(30deg)">多动画用‘;’隔开</div>
<div data-breathe="rotate(30deg);origin(left top)">改变旋转轴</div>
<div data-breathe="rotate(30deg);duration(2000)">更默认为1500毫秒的动画时间</div>
<div data-breathe="rotate(30deg);timing(ease)">更默认为linear的动画曲线</div>
```
