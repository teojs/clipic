const css = `
.clipic-body {
  background: #1c1c1c;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  -webkit-transform: translate(0, 100%);
      -ms-transform: translate(0, 100%);
          transform: translate(0, 100%);
  -webkit-transition: 0.4s;
  -o-transition: 0.4s;
  transition: 0.4s;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  z-index: 99;
}
.clipic-body * {
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
}
.clipic-operation-bar {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  color: #f2f2f2;
  -webkit-box-pack: justify;
      -ms-flex-pack: justify;
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
  width: calc(100% - 60px);
  height: 300px;
  margin: 30px;
  background: #f2f2f2;
  position: absolute;
}
.clipic-frame img {
  -webkit-touch-callout: none;
  pointer-events: none;
  -webkit-filter: blur(2px);
          filter: blur(2px);
}
.clipic-frame-show {
  overflow: hidden;
}
.clipic-frame-show img {
  -webkit-filter: blur(0);
          filter: blur(0);
}
.clipic-cancel {
  color: #3680fd;
}
.clipic-confirm{
  color: #23c667;
}
.clipic-layer {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0,0,0,0.5);
  pointer-events: none;
}
`
export default css