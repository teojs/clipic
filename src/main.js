import css from './css'
import dom from './dom'
class Clipic {
  constructor(options) {
    this.options = options
    this.init()
    this.clipicFrame1 = this.getId('clipicFrame1')
    this.clipicFrame2 = this.getId('clipicFrame2')
    this.clipicImg1 = this.getId('clipicImg1')
    this.clipicImg2 = this.getId('clipicImg2')
    this.clipic = this.getId('clipic')
    this.clipicCancel = this.getId('clipicCancel')
    this.clipicConfirm = this.getId('clipicConfirm')
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
    const div = document.createElement('div')
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
    this.touchStartTime = 0
    this.touchEndTime = 0
    this.touchStartX = 0
    this.touchStartY = 0
    this.touchEndX = 0
    this.touchEndY = 0
    this.scrollX = 0
    this.scrollY = 0
    this.scrollTimes = []
    this.newOptions = Object.assign(this.options || {}, options)
    this.newOptions.ratio = this.newOptions.ratio || this.newOptions.width / this.newOptions.height
    this.clipicFrame2.style.height = this.clipicFrame2.clientWidth / this.newOptions.ratio + 'px'
    this.clipicImg1.src = this.newOptions.src
    this.clipicImg2.src = this.newOptions.src
    this.clipicImg2.onload = () => {
      this.originW = this.clipicImg2.width
      this.originH = this.clipicImg2.height
      this.originRatio = this.originW / this.originH
      this.initSize()
      this.clipic.style['transform'] = 'translate(0, 0)'
      this.clipicCancel.addEventListener('click', () => {
        this.cancel()
      })
      this.clipicConfirm.addEventListener('click', () => {
        this.done()
      })
      this.clipicFrame2.addEventListener('dblclick', () => {
        console.log(this.scale)
      })
      this.clipicFrame2.addEventListener('touchstart', e => {
        this.touchStartX = e.touches[0].clientX
        this.touchStartY = e.touches[0].clientY
        clearTimeout(this.ST)
      })
      this.clipicFrame2.addEventListener('touchmove', e => {
        this.scrollTimes.push(e.timeStamp)
        if (e.touches.length > 1) {
          this.setScale(e.touches[0], e.touches[1])
          this.setRotate(e.touches[0], e.touches[1])
          return
        }
        this.setTranslate(e.touches[0])
        this.scrollX = e.touches[0].clientX - this.touchStartX
        this.scrollY = e.touches[0].clientY - this.touchStartY
        this.touchStartTime = Date.now()
        this.touchStartX = e.touches[0].clientX
        this.touchStartY = e.touches[0].clientY
      })
      this.clipicFrame2.addEventListener('touchend', e => {
        this.distance = null
        this.angle = null
        this.moveX = null
        this.moveY = null
        this.touchEndTime = Date.now()
        this.scrollTimes.push(e.timeStamp)
        // this.scroll(e.changedTouches[0])
      })
    }
  }

  initSize() {
    if (this.newOptions.ratio > this.originRatio) {
      this.clipicImg1.style.width = this.clipicFrame2.clientWidth + 'px'
      this.clipicImg2.style.width = this.clipicFrame2.clientWidth + 'px'
    } else {
      this.clipicImg1.style.height = this.clipicFrame2.clientHeight + 'px'
      this.clipicImg2.style.height = this.clipicFrame2.clientHeight + 'px'
    }
  }

  setScale(touches1, touches2) {
    const x = Math.abs(touches1.clientX - touches2.clientX)
    const y = Math.abs(touches1.clientY - touches2.clientY)
    const s = Math.sqrt(x * x + y * y)
    if (this.distance) {
      this.scale += (s - this.distance) / this.clipicImg2.clientWidth
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

  setTranslate(touches) {
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
    // if (this.translateX > 0) {
    //   this.translateX = 0
    // }
    // if (this.translateY > 0) {
    //   this.translateY = 0
    // }
    this.setTransform()
  }

  setTransform() {
    const transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale}) rotate(${
      this.rotate
    }deg)`
    this.clipicImg1.style.transform = transform
    this.clipicImg2.style.transform = transform
  }

  cancel() {
    this.clipic.style.transform = 'translate(0, 100%)'
    setTimeout(() => {
      this.clipicImg1.style = ''
      this.clipicImg1.src = ''
      this.clipicImg2.style = ''
      this.clipicImg2.src = ''
    }, 400)
  }

  done() {
    const zommRatio = this.newOptions.width / this.clipicFrame2.clientWidth
    const canvas = document.createElement('canvas')
    canvas.width = this.newOptions.width
    canvas.height = this.newOptions.height
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    let w
    let h
    if (this.newOptions.ratio > this.originRatio) {
      w = this.newOptions.width
      h = this.originH / (this.originW / this.newOptions.width)
    } else {
      h = this.newOptions.height
      w = this.originW / (this.originH / this.newOptions.height)
    }
    const point = { x: w / 2, y: h / 2 }
    ctx.translate(this.translateX * zommRatio, this.translateY * zommRatio)
    if (this.rotate !== 0) {
      ctx.translate(point.x, point.y)
      ctx.rotate((this.rotate * Math.PI) / 180)
      ctx.translate(-point.x, -point.y)
    }
    if (this.scale !== 0) {
      ctx.translate(point.x * (1 - this.scale), point.y * (1 - this.scale))
      ctx.scale(this.scale, this.scale)
    }
    ctx.drawImage(this.clipicImg2, 0, 0, w, h)
    this.newOptions.onDone(canvas.toDataURL('image/jpeg', 0.8))
    this.cancel()
  }
}
export default Clipic
