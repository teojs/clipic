const dom = `
    <div class="clipic-layer clipic-layer__top"></div>
    <div class="clipic-layer__center">
      <div class="clipic-layer clipic-layer__left"></div>
      <div class="clipic-frame" id="clipicFrame">
        <img id="clipicImg" crossOrigin="Anonymous">
      </div>
      <div class="clipic-layer clipic-layer__right"></div>
    </div>
    <div class="clipic-layer clipic-layer__bottom"></div>
    <div class="clipic-operation-bar">
      <div class="clipic-cancel" id="clipicCancel" role="button">取消</div>
      <div class="clipic-reset" id="clipicReset" role="button">重置</div>
      <div class="clipic-confirm" id="clipicConfirm" role="button">完成</div>
    </div>
  `
export default dom