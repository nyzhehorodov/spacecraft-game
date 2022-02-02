import {Bullet, Thunder} from './Bullet'
import mouse from './Mouse'
import {
  lerp,
  rand,
  createDomNode,
  styleObjectToCssText,
  addDomNode,
} from './utils'

export default class SpaceCraft {
  constructor() {
    this.bullets = []
    this.thunder = null

    this.DOM = {}
    this.DOM.el = this.createElement()

    this.createFires()

    this.maxRight = innerWidth - this.DOM.el.offsetWidth * 3
    this.maxLeft = this.DOM.el.offsetWidth * 3

    this.x = {
      curr: innerWidth / 2,
      prev: innerWidth / 2,
    }

    this.y = {
      curr: innerHeight - 200,
      prev: innerHeight - 200,
    }

    root.appendChild(this.DOM.el)

    this.width = this.DOM.el.offsetWidth
    this.height = 80
  }

  init({player}) {
    this.player = player
    this.draw()
  }

  createElement() {
    const el = createDomNode('player')
    const template = document.createDocumentFragment()
    addDomNode(template, {className: 'body'})
    addDomNode(template, {className: 'head'})
    addDomNode(template, {className: 'glass'})
    addDomNode(template, {className: 'fire'})
    addDomNode(template, {className: 'guns'})
    addDomNode(template, {className: 'fins'})
    addDomNode(template, {className: 'fins2'})
    addDomNode(template, {className: 'overlay'})

    el.appendChild(template)

    return el
  }

  draw() {
    this.bullets.forEach(b => b.update())
    this.bullets.forEach(b => b.draw())

    if (this.thunder) {
      this.thunder.draw()
    }

    if (mouse.x !== undefined) {
      this.x.curr = innerWidth * (mouse.percentage.x + 0.05) * 0.9
    }

    if (mouse.y !== undefined) {
      this.y.curr = innerHeight * (mouse.percentage.y + 0.1) * 0.8
    }

    this.x.prev = lerp(this.x.prev, this.x.curr, 0.1)
    this.y.prev = lerp(this.y.prev, this.y.curr, 0.1)

    this.DOM.el.style.cssText = styleObjectToCssText({
      top: this.y.prev + 'px',
      left: this.x.prev - this.width / 2 + 'px',
    })

    requestAnimationFrame(this.draw.bind(this))
  }

  createFires() {
    const el = this.DOM.el.querySelector('.fire')
    const count = 4

    let fragment = document.createDocumentFragment()

    for (let i = 0; i < count; i++) {
      const span = document.createElement('span')
      const size = rand() * 10
      let left = rand(0.45, 0.55) * 100

      const opacity = Math.floor(rand(0.3, 1) * 100)
      const hue = rand(0, 20)

      const style = {
        width: `${Math.round(size)}px`,
        height: `${Math.round(size)}px`,
        left: `${left}%`,
        'animation-duration': `${Math.floor(rand(200, 1000))}ms`,
        'animation-delay': `${Math.floor(rand() * (i % 5)) * 1000}ms`,
        'background-color': `hsla(${Math.floor(hue)}, 100%, 55%, ${opacity}%)`,
      }

      span.style.cssText = styleObjectToCssText(style)

      fragment.appendChild(span)
    }

    el.appendChild(fragment)
  }

  shootThunder() {
    this.thunder = new Thunder(this.player, this, () => {
      this.thunder = null
    })
  }

  shootBullet() {
    const bulletY = this.y.prev + 27
    const distanceFromCenter = 29
    const options = {}

    const args = {
      player: this.player,
      y: bulletY,
      onDestroy: bullet => {
        this.bullets = this.bullets.filter(b => b !== bullet)
      },
    }

    const b1 = new Bullet({
      ...args,
      x: this.x.prev + distanceFromCenter,
      dx: -1,
    })

    const b2 = new Bullet({
      ...args,
      x: this.x.prev - distanceFromCenter,
      dx: 1,
    })

    this.bullets.push(b1)
    this.bullets.push(b2)
  }
}
