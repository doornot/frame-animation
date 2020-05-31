const raf =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  function (f) {
    window.setTimeout(f, 1e3 / 60)
  }

const craf =
  window.cancelAnimationFrame ||
  window.webkitCancelRequestAnimationFrame ||
  window.mozCancelRequestAnimationFrame ||
  window.oCancelRequestAnimationFrame ||
  window.msCancelRequestAnimationFrame ||
  clearTimeout

const defaultConfig = {
  width: 200, // 动画帧的宽度
  height: 200, // 动画帧的高度
  image: null, // 序列帧图片资源地址
  frames: null, // 动画总帧数
  loop: false, // 是否循环播放
}

class CanvasSprite {
  constructor(config) {
    this.config = {...defaultConfig, ...config}
    this.parent = document.querySelector(config.container)
    this.timmer = null
    this.canvas = null
    this.currentFrame = 0
  }
  
  run() {
    const self = this

    this.canvas = document.createElement('canvas')
    this.canvas.setAttribute('width', this.config.width)
    this.canvas.setAttribute('height', this.config.height)
    this.parent.appendChild(this.canvas)

    let animateHandler = null

    const draw = (image) => {
      ctx.clearRect(0, 0, self.config.width, self.config.height)
      ctx.drawImage(
        image,
        0,
        self.currentFrame * self.config.height,
        self.config.width,
        self.config.height,
        0,
        0,
        self.config.width,
        self.config.height
      )

      self.currentFrame++

      if (self.currentFrame === self.config.frames) {
        self.currentFrame = 0
        if (!self.config.loop) {
          animateHandler.cancel()
          self.destroy()
        }
      }
    }

    const ctx = this.canvas.getContext('2d')
    const image = new Image()
    image.src = this.config.image
    image.onload = () => {
      animateHandler = self.animate(() => {
        draw(image)
      })
    }
  }

  animate(draw) {
    let rafId = null

    const loop = () => {
      rafId = raf(loop)
      draw()
    }

    loop()

    return {
      cancel: () => {
        craf(rafId)
      },
    }
  }

  destroy() {
    clearTimeout(this.timmer)
    this.canvas.remove()
  }
}

