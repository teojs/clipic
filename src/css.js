const css = `
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
    z-index: 99;
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
`
export default css