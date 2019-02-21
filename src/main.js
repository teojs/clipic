class Clipic {
  constructor(options) {
    this.options = options
    this.init()
  }

  init() {
    this.createStyle()
    this.createHtml()
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
        transition: transform 0.4s;
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
      }
      .clipic-frame img {
        width: 100%;
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
        <div class="clipic-cancel" role="button">取消</div>
        <div class="clipic-confirm" role="button">完成</div>
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
    var clipicFrame = document.getElementById('clipicFrame')
    var clipicFrameW = newOptions.width || clipicFrame.clientWidth
    var clipicFrameH = newOptions.height || clipicFrame.clientHeight
    clipicFrame.style.height = clipicFrame.clientWidth / (clipicFrameW / clipicFrameH) + 'px'
    var img = document.createElement('img')
    img.src = newOptions.src
    clipicFrame.appendChild(img)
    var clipic = document.getElementById('clipic')
    clipic.style['transform'] = 'translate(0, 0)'
  }
}
export default Clipic
