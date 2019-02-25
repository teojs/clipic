import css from './css'
import dom from './dom'
class Clipic {
  constructor(options) {
    this.options = options
    this.init()
    this.clipicFrame = this.getId('clipicFrame')
    this.clipic = this.getId('clipic')
    this.clipicCancel = this.getId('clipicCancel')
    this.clipicImg = document.createElement('img')
    this.clipicFrame.appendChild(this.clipicImg)
  }

  init() {
    this.createStyle()
    this.createHtml()
  }

  getId(id) {
    return document.getElementById(id)
  }

  createStyle() {
    const style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = css
    document
      .getElementsByTagName('HEAD')
      .item(0)
      .appendChild(style)
  }

  createHtml() {
    var div = document.createElement('div')
    div.className = 'clipic-body'
    div.setAttribute('id', 'clipic')
    div.innerHTML = dom
    document.body.appendChild(div)
  }

  getImage(options = {}) {
    this.scale = 1
    this.rotate = 0
    this.translateX = 0
    this.translateY = 0
    this.newOptions = Object.assign(this.options || {}, options)
    this.newOptions.ratio = this.newOptions.ratio || this.newOptions.width / this.newOptions.height
    this.clipicFrame.style.height = this.clipicFrame.clientWidth / this.newOptions.ratio + 'px'
    this.clipicImg.src = this.newOptions.src
    this.clipicImg.onload = () => {
      this.originW = this.clipicImg.width
      this.originH = this.clipicImg.height
      this.originRatio = this.originW / this.originH
      this.initSize()
      this.clipic.style['transform'] = 'translate(0, 0)'
      this.clipicCancel.addEventListener('click', () => {
        this.cancel()
      })
      this.clipicFrame.addEventListener('touchmove', e => {
        if (e.touches.length > 1) {
          this.setScale(e.touches[0], e.touches[1])
          this.setRotate(e.touches[0], e.touches[1])
          return
        }
        this.setTranslate(e.touches[0])
      })
      this.clipicFrame.addEventListener('touchend', e => {
        this.distance = null
        this.angle = null
        this.moveX = null
        this.moveY = null
      })
    }
  }

  initSize() {
    if (this.newOptions.ratio > this.originRatio) {
      this.clipicImg.style.width = this.clipicFrame.clientWidth + 'px'
    } else {
      this.clipicImg.style.height = this.clipicFrame.clientHeight + 'px'
    }
  }

  setScale(touches1, touches2) {
    const x = Math.abs(touches1.clientX - touches2.clientX)
    const y = Math.abs(touches1.clientY - touches2.clientY)
    const s = Math.sqrt(x * x + y * y)
    if (this.distance) {
      this.scale += (s - this.distance) / this.clipicImg.clientWidth
      this.setTransform()
    }
    this.distance = s
  }

  setRotate(touches1, touches2) {
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

  setTranslate(touches1, touches2) {
    const x = touches1.clientX
    const y = touches1.clientY
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

  setTransform() {
    this.clipicImg.style['transform'] = `translate(${this.translateX}px, ${this.translateY}px) scale(${
      this.scale
    }) rotate(${this.rotate}deg)`
  }
  cancel() {
    this.clipic.style['transform'] = 'translate(0, 100%)'
    setTimeout(() => {
      this.clipicImg.style = ''
      this.clipicImg.src = ''
    }, 400)
  }
}
export default Clipic
