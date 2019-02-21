class Clipic {
  constructor(options) {
    this.options = options
    this.scaleX = 1
    this.scaleY = 1
    this.rotate = 0
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
        transition: 1s;
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

  getImage(options = {}, callback) {
    var newOptions = options
    if (this.options) {
      newOptions = Object.assign(this.options, options)
    }
    var clipicFrameW = newOptions.width || this.clipicFrame.clientWidth
    var clipicFrameH = newOptions.height || this.clipicFrame.clientHeight
    this.clipicFrame.style.height = this.clipicFrame.clientWidth / (clipicFrameW / clipicFrameH) + 'px'
    this.clipicImg.src = newOptions.src
    this.clipic.style['transform'] = 'translate(0, 0)'
    setTimeout(() => {
      this.setMiniSize()
    }, 400)
    this.clipicCancel.addEventListener('click', () => {
      this.cancel()
    })
  }

  setMiniSize() {
    var w = this.clipicFrame.clientWidth
    var h = this.clipicFrame.clientHeight
    var imgW = this.clipicImg.clientWidth
    var imgH = this.clipicImg.clientHeight
    if (imgH < h) {
      this.clipicImg.style.width = h * (imgW / imgH) + 'px'
      this.clipicImg.style.height = h + 'px'
    }
    if (imgW < w) {
      this.clipicImg.style.width = w + 'px'
      this.clipicImg.style.height = w * (imgW / imgH) + 'px'
    }
  }

  cancel() {
    this.clipic.style['transform'] = 'translate(0, 100%)'
  }
}
export default Clipic
