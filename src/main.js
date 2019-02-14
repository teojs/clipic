class Breath {
  init () {
    const el = document.body.querySelectorAll('*')
    el.forEach((el, i) => {
      if (el.dataset.breath) {
        this.doAnimation(el)
      }
    })
  }

  doAnimation (el) {
    const data = el.dataset.breath.split(';')
    let transform = ''
    let duration = 1500
    let timing = 'linear'
    let origin = '50% 50% 0'
    data.forEach(o => {
      switch (true) {
        case /scale/.test(o):
          transform += o + ''
          break
        case /rotate/.test(o):
          transform += o + ''
          break
        case /translate/.test(o):
          transform += o + ''
          break
        case /skew/.test(o):
          transform += o + ''
          break
        case /duration/.test(o):
          duration = /[^()]+(?=\))/.exec(o)[0]
          break
        case /timing/.test(o):
          timing = /[^()]+(?=\))/.exec(o)[0]
          break
        case /origin/.test(o):
          origin = /[^()]+(?=\))/.exec(o)[0]
          break
      }
    })
    const transition = `transform ${timing} ${duration / 1000}s`
    el.style['transition'] = transition
    el.style['-ms-transition'] = transition
    el.style['-webkit-transition'] = transition
    el.style['-o-transition'] = transition
    el.style['-moz-transition'] = transition

    el.style['transform-origin'] = origin
    el.style['-ms-transform-origin'] = origin
    el.style['-webkit-transform-origin'] = origin
    el.style['-o-transform-origin'] = origin
    el.style['-moz-transform-origin'] = origin
    setInterval(() => {
      if (el.style.transform) {
        el.style['transform'] = ''
        el.style['-ms-transform'] = ''
        el.style['-webkit-transform'] = ''
        el.style['-o-transform'] = ''
        el.style['-moz-transform'] = ''
      } else {
        el.style['transform'] = transform
        el.style['-ms-transform'] = transform
        el.style['-webkit-transform'] = transform
        el.style['-o-transform'] = transform
        el.style['-moz-transform'] = transform
      }
    }, duration)
  }
}
export default Breath
