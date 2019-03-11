import css from './css'
import dom from './dom'
class Clipic {
  default: object = {
    width:      500,                    // 裁剪宽度
    height:     500,                    // 裁剪高度
    src:        '',                     // 需要裁剪的图片
    type:       'jpeg',                 // 裁剪后图片的类型，仅支持jpeg/png两种
    quality:    0.9,                    // 压缩质量
    buttonText: ['取消', '重置', '完成'] // 底部三个按钮文案
  }
  options: {
    [x: string]: any
  }

  clipic:     HTMLElement
  img1:       HTMLElement
  img2:       HTMLElement
  frame1:     HTMLElement
  frame2:     HTMLElement
  cancelBtn:  HTMLElement
  resetBtn:   HTMLElement
  confirmBtn: HTMLElement

  scale:       number // 缩放
  rotate:      number // 旋转
  translateX:  number // 水平偏移
  translateY:  number // 垂直偏移
  originW:     number // 图片的原始宽度
  originH:     number // 图片的原始高度
  originRatio: number // 原始比例

  // 辅助计算
  distance: number
  angle:    number
  moveX:    number
  moveY:    number

  constructor() {
    this.init()                                    // 初始化，渲染dom跟css
    this.clipic      = this.getId('clipic')
    this.img1        = this.getId('clipicImg1')    // 背景图
    this.img2        = this.getId('clipicImg2')    // 前景图
    this.frame1      = this.getId('clipicFrame1')  // 背景操作框
    this.frame2      = this.getId('clipicFrame2')  // 前景操作框
    this.cancelBtn   = this.getId('clipicCancel')  // 取消按钮
    this.resetBtn    = this.getId('clipicReset')   // 重置按钮
    this.confirmBtn  = this.getId('clipicConfirm') // 完成按钮
  }

  private init(): void {
    if (!this.getId('clipic')) {
      this.createStyle()
      this.createHtml()
    }
  }

  private getId(id: string): any {
    return document.getElementById(id)
  }

  private createStyle(): void {
    const style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = css
    document
      .getElementsByTagName('HEAD')
      .item(0)
      .appendChild(style)
  }

  private createHtml(): void {
    const div = document.createElement('div')
    div.className = 'clipic-body'
    div.setAttribute('id', 'clipic')
    div.innerHTML = dom
    document.body.appendChild(div)
  }

  public getImage(options: object): void {
    // 初始化参数
    this.scale = 1
    this.rotate = 0
    this.translateX = 0
    this.translateY = 0
    this.options = Object.assign(this.default, options)
    this.cancelBtn.innerHTML = this.options.buttonText[0]
    this.resetBtn.innerHTML = this.options.buttonText[1]
    this.confirmBtn.innerHTML = this.options.buttonText[2]
    this.options.ratio = this.options.ratio || this.options.width / this.options.height
    this.img2.setAttribute('crossOrigin', 'Anonymous')
    this.img1.setAttribute('src', this.options.src)
    this.img2.setAttribute('src', this.options.src)
    this.img2.onload = () => {
      this.originW = this.img2['width']
      this.originH = this.img2['height']
      this.originRatio = this.originW / this.originH
      this.initSize()
      this.clipic.style.transform = 'translate(0, 0)'

      this.cancelBtn.addEventListener('click', () => {
        this.cancel()
      })

      this.resetBtn.addEventListener('click', () => {
        this.reset()
      })

      this.confirmBtn.addEventListener('click', () => {
        this.done()
      })

      this.frame2.addEventListener('touchmove', e => {
        e.preventDefault()
        if (e.touches.length > 1) {
          this.setScale(e.touches[0], e.touches[1])
          this.setRotate(e.touches[0], e.touches[1])
          return
        }
        this.setTranslate(e.touches[0])
      })

      this.frame2.addEventListener('touchend', e => {
        this.distance = null
        this.angle = null
        this.moveX = null
        this.moveY = null
      })
    }
  }

  private initSize(): void {
    const cw = document.body.clientWidth - 60
    const ch = document.body.clientHeight - 80
    this.frame1.style.width = cw + 'px'
    this.frame1.style.height = cw / this.options.ratio + 'px'
    this.frame2.style.width = cw + 'px'
    this.frame2.style.height = cw / this.options.ratio + 'px'
    if (cw / this.options.ratio > ch) {
      this.frame1.style.height = ch + 'px'
      this.frame1.style.width = ch * this.options.ratio + 'px'
      this.frame2.style.height = ch + 'px'
      this.frame2.style.width = ch * this.options.ratio + 'px'
    }
    if (this.options.ratio > this.originRatio) {
      this.img1.style.width = this.frame2.clientWidth + 'px'
      this.img2.style.width = this.frame2.clientWidth + 'px'
    } else {
      this.img1.style.height = this.frame2.clientHeight + 'px'
      this.img2.style.height = this.frame2.clientHeight + 'px'
    }
  }

  private setScale(touches1: Touch, touches2: Touch): void {
    const x = Math.abs(touches1.clientX - touches2.clientX)
    const y = Math.abs(touches1.clientY - touches2.clientY)
    const s = Math.sqrt(x * x + y * y)
    if (this.distance) {
      this.scale += (s - this.distance) / this.img2.clientWidth
      this.setTransform()
    }
    this.distance = s
  }

  private setRotate(touches1: Touch, touches2: Touch) {
    const x = touches1.clientX - touches2.clientX
    const y = touches1.clientY - touches2.clientY
    const s = Math.sqrt(x * x + y * y)
    const angle = (Math.atan2(y, x) * 180) / Math.PI
    if (this.angle) {
      this.rotate += angle - this.angle
      this.setTransform()
    }
    this.angle = angle
  }

  private setTranslate(touches: Touch): void {
    const x = touches.clientX
    const y = touches.clientY
    if (this.moveX) {
      this.translateX += x - this.moveX
    }
    if (this.moveY) {
      this.translateY += y - this.moveY
    }
    this.moveX = x
    this.moveY = y
    this.setTransform()
  }

  private setTransform() {
    const transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale}) rotate(${
      this.rotate
    }deg)`
    this.img1.style.transform = transform
    this.img2.style.transform = transform
  }

  cancel(): void {
    this.clipic.style.transform = 'translate(0, 100%)'
    setTimeout(() => {
      this.img1.setAttribute('style', '')
      this.img1.setAttribute('src', '')
      this.img2.setAttribute('style', '')
      this.img2.setAttribute('src', '')
    }, 400)
  }

  reset(): void {
    this.scale = 1
    this.rotate = 0
    this.translateX = 0
    this.translateY = 0
    this.img1.style.transition = '0.3s'
    this.img2.style.transition = '0.3s'
    this.setTransform()
    setTimeout(() => {
      this.img1.style.transition = ''
      this.img2.style.transition = ''
    }, 300)
  }

  done(): void {
    const zommRatio = this.options.width / this.frame2.clientWidth
    const canvas = document.createElement('canvas')
    canvas.width = this.options.width
    canvas.height = this.options.height
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    let w: number
    let h: number
    if (this.options.ratio > this.originRatio) {
      w = this.options.width
      h = this.originH / (this.originW / this.options.width)
    } else {
      h = this.options.height
      w = this.originW / (this.originH / this.options.height)
    }
    const point = { x: w / 2, y: h / 2 }
    ctx.translate(this.translateX * zommRatio, this.translateY * zommRatio)
    if (this.rotate !== 0) {
      ctx.translate(point.x, point.y)
      ctx.rotate((this.rotate * Math.PI) / 180)
      ctx.translate(-point.x, -point.y)
    }
    if (this.scale !== 1) {
      ctx.translate(point.x * (1 - this.scale), point.y * (1 - this.scale))
      ctx.scale(this.scale, this.scale)
    }
    ctx.drawImage(this.img2, 0, 0, w, h)
    if (this.options.onDone) {
      this.options.onDone(canvas.toDataURL(`image/${this.options.type}`, this.options.quality))
    }
    if (this.options.onCancel) {
      this.options.onCancel()
    }
    this.cancel()
  }
}
export default Clipic
