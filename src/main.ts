import './css.css'
import dom from './dom'
class Clipic {
  defaults: object = {
    width: 500,                         // 裁剪宽度
    height: 500,                        // 裁剪高度
    radio: '',                          // 裁剪比例
    src: '',                            // 需要裁剪的图片
    encode: 'base64',                   // 导出格式，支持 base64|blob|file
    type: 'jpeg',                       // 裁剪后图片的类型，仅支持jpeg/png两种
    name: 'clipic',                     // 如果导出格式位file, 则可以填写图片名
    quality: 0.9,                       // 压缩质量
    buttonText: ['取消', '重置', '完成'] // 底部三个按钮文案
  }
  options: {
    [propName: string]: any
  }

  clipic:     HTMLElement
  img:        HTMLImageElement
  frame:      HTMLElement
  cancelBtn:  HTMLElement
  resetBtn:   HTMLElement
  confirmBtn: HTMLElement

  // 主要参数
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
    this.createHtml()
    this.clipic     = this.getId('clipic')
    this.img        = this.getId('clipicImg')      // 裁剪预览图
    this.frame      = this.getId('clipicFrame')    // 背景操作框
    this.cancelBtn  = this.getId('clipicCancel')   // 取消按钮
    this.resetBtn   = this.getId('clipicReset')    // 重置按钮
    this.confirmBtn = this.getId('clipicConfirm')  // 完成按钮
  }

  private getId(id: string): any {
    return document.getElementById(id)
  }

  private createHtml(): void {
    if (!this.getId('clipic')) {
      const div: HTMLDivElement = document.createElement('div')
      div.className = 'clipic-body'
      div.setAttribute('id', 'clipic')
      div.innerHTML = dom
      document.body.appendChild(div)
    }
  }

  public getImage(options: object): void {
    // 初始化参数
    this.scale = 1 // 缩放
    this.rotate = 0 // 旋转
    this.translateX = 0 // 水平偏移
    this.translateY = 0 // 垂直偏移
    const defaults = JSON.parse(JSON.stringify(this.defaults))
    this.options = Object.assign(defaults, options)
    this.cancelBtn.innerHTML = this.options.buttonText[0]
    this.resetBtn.innerHTML = this.options.buttonText[1]
    this.confirmBtn.innerHTML = this.options.buttonText[2]
    this.img.src = this.options.src
    let tempImage = new Image()
    tempImage.onload = () => {
      this.originW = this.img.width
      this.originH = this.img.height

      this.originRatio = this.originW / this.originH
      if (this.options.ratio) {
        if (this.originRatio < this.options.ratio) {
          this.options.width = this.img.width
          this.options.height = this.img.width / this.options.ratio
        } else {
          this.options.height = this.img.height
          this.options.width = this.img.height * this.options.ratio
        }
      } else {
        this.options.ratio = this.options.width / this.options.height
      }
      this.initSize()
      this.clipic.style.transform = 'translate(0, 0)'
      setTimeout(() => {
        if (this.options.ratio > this.originRatio) {
          this.img.style.width = this.frame.clientWidth + 'px'
        } else {
          this.img.style.height = this.frame.clientHeight + 'px'
        }
      }, 300)
      this.setTransform()
      this.cancelBtn.addEventListener('click', this.cancel.bind(this))
      this.resetBtn.addEventListener('click', this.reset.bind(this))
      this.confirmBtn.addEventListener('click', this.done.bind(this))
      this.clipic.addEventListener('touchmove', e => {
        e.preventDefault()
        if (e.touches.length > 1) {
          this.setScale(e.touches[0], e.touches[1])
          this.setRotate(e.touches[0], e.touches[1])
          return
        }
        this.setTranslate(e.touches[0])
      })
      this.clipic.addEventListener('touchend', e => {
        this.distance = null
        this.angle = null
        this.moveX = null
        this.moveY = null
      })
    }
    tempImage.src = this.options.src
  }

  private initSize(): void {
    const cw = document.body.clientWidth - 60
    const ch = document.body.clientHeight - 80
    this.frame.style.width = cw + 'px'
    this.frame.style.height = cw / this.options.ratio + 'px'
    if (cw / this.options.ratio > ch) {
      this.frame.style.height = ch + 'px'
      this.frame.style.width = ch * this.options.ratio + 'px'
    }
    if (this.options.ratio > this.originRatio) {
      this.img.style.width = this.frame.clientWidth + 'px'
    } else {
      this.img.style.height = this.frame.clientHeight + 'px'
    }
  }

  private setScale(touches1: Touch, touches2: Touch): void {
    const x = Math.abs(touches1.clientX - touches2.clientX)
    const y = Math.abs(touches1.clientY - touches2.clientY)
    const s = Math.sqrt(x * x + y * y)
    if (this.distance) {
      this.scale += (s - this.distance) / this.img.clientWidth
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
    this.img.style.transform = transform
  }

  cancel(eventType?: any): void {
    this.clipic.style.transform = 'translate(0, 100%)'
    setTimeout(() => {
      this.img.removeAttribute('style')
      this.img.removeAttribute('src')
    }, 400)
    if (this.options.onCancel && eventType !== 'done') {
      this.options.onCancel()
    }
    this.cancelBtn.removeEventListener('click', this.cancel.bind(this))
    this.resetBtn.removeEventListener('click', this.reset.bind(this))
    this.confirmBtn.removeEventListener('click', this.done.bind(this), true)
  }

  reset(): void {
    this.scale = 1
    this.rotate = 0
    this.translateX = 0
    this.translateY = 0
    this.img.style.transition = '0.3s'
    this.setTransform()
    setTimeout(() => {
      this.img.style.transition = ''
    }, 300)
  }

  done(): void {
    const zommRatio = this.options.width / this.frame.clientWidth
    const canvas = document.createElement('canvas')
    canvas.width = this.options.width
    canvas.height = this.options.height
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    let drawImageW : number
    let drawImageH : number
    if (this.options.ratio > this.originRatio) {
      drawImageW = this.options.width
      drawImageH = this.originH / (this.originW / this.options.width)
    } else {
      drawImageH = this.options.height
      drawImageW = this.originW / (this.originH / this.options.height)
    }
    const point = { x: drawImageW / 2, y: drawImageH / 2 }
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
    ctx.drawImage(this.img, 0, 0, drawImageW, drawImageH)
    if (this.options.onDone) {
      switch (this.options.encode) {
        case 'base64':
          this.options.onDone(canvas.toDataURL(`image/${this.options.type}`, this.options.quality))
          break
        case 'blob':
          canvas.toBlob(blob => {
            this.options.onDone(blob)
          }, `image/${this.options.type}`)
          break
        case 'file':
          canvas.toBlob(blob => {
            let file = new window.File([blob], this.options.name, { type: `image/${this.options.type}` })
            this.options.onDone(file)
          }, `image/${this.options.type}`)
          break
        default:
          this.options.onDone(canvas.toDataURL(`image/${this.options.type}`, this.options.quality))
          break
      }
    }
    this.cancel('done')
  }
}
export default Clipic
