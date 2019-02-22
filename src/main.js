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
    var style = document.createElement('style')
    style.type = 'text/css'
    var css = `
      .clipic-body {
        background: #1c1c1c;
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        transform: translate(0, 100%);
        transition: 0.4s;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        box-sizing: border-box;
      }
      .clipic-body * {
        box-sizing: border-box;
      }
      .clipic-operation-bar {
        display: flex;
        color: #f2f2f2;
        justify-content: space-between;
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
      }
      .clipic-operation-bar [role="button"] {
        padding: 15px 20px;
        font-size: 1em;
      }
      .clipic-frame {
        height: 300px;
        margin: 30px;
        background: #f2f2f2;
        overflow: hidden;
      }
      .clipic-frame img {
      }
      .clipic-cancel {
        color: #3680fd;
      }
      .clipic-confirm{
        color: #23c667;
      }
    `.trim()
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
    var html = `
      <div class="clipic-frame" id="clipicFrame"></div>
      <div class="clipic-operation-bar">
        <div class="clipic-cancel" id="clipicCancel" role="button">取消</div>
        <div class="clipic-confirm" id="clipicConfirm" role="button">完成</div>
      </div>
    `.trim()
    div.innerHTML = html
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
      this.clipicImg.addEventListener('touchmove', e => {
        this.setScale(e.touches[0], e.touches[1])
        this.setRotate(e.touches[0], e.touches[1])
      })
      this.clipicImg.addEventListener('touchend', e => {
        this.distance = null
        this.angle = null
      })
    }
  }

  initSize() {
    if (this.newOptions.ratio > this.originRatio) {
      this.clipicImg.style.width = this.clipicFrame.clientWidth + 'px'
      this.translate = `translate(0, -${(this.clipicImg.clientHeight - this.clipicFrame.clientHeight) / 2}px)`
      this.clipicImg.style['transform'] = this.translate
    } else {
      this.clipicImg.style.height = this.clipicFrame.clientHeight + 'px'
      this.translate = `translate(-${(this.clipicImg.clientWidth - this.clipicFrame.clientWidth) / 2}px, 0)`
      this.clipicImg.style['transform'] = this.translate
    }
  }

  setScale(touches1, touches2) {
    if (touches1 && touches2) {
      const w = Math.abs(touches1.clientX - touches2.clientX)
      if (this.distance) {
        this.scale += (w - this.distance) / this.clipicImg.clientWidth
        this.setTransform()
      }
      this.distance = w
    }
  }

  setRotate(touches1, touches2) {
    if (touches1 && touches2) {
      const w = Math.abs(touches1.clientX - touches2.clientX)
      const h = Math.abs(touches1.clientY - touches2.clientY)
      const s = Math.sqrt(w * w + h * h)
      const angle = (Math.atan(w / h) * 180) / Math.PI
      if (this.angle) {
        this.rotate += angle - this.angle
        this.setTransform()
      }
      this.angle = angle
    }
  }
  setTransform() {
    this.clipicImg.style['transform'] = `${this.translate} scale(${this.scale}) rotate(${this.rotate}deg)`
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
