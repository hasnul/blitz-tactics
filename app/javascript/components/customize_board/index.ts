import Backbone from 'backbone'
import SimpleColorPicker from 'simple-color-picker'

import Chessboard from '../chessboard/chessboard'
import BoardStyles from './board_styles'
import { dispatch } from '../../store'

const defaultColors = {
  light: '#F3E4CF',
  dark: '#CEB3A2',
  from: '#FFFCDD',
  to: '#FFF79B',
  selected: '#EEFFFF',
}

const boardStyles = new BoardStyles()

export default class CustomizeBoard extends Backbone.View<Backbone.Model> {
  private colorPicker: any

  get el(): HTMLElement {
    return document.querySelector('.customize-board')
  }

  private get styleEl(): HTMLElement {
    return this.el.querySelector(`style`)
  }

  events(): Backbone.EventsHash {
    return {
      'click .square-color .square':  '_toggleColorPicker',
      'keypress .hex':                '_preventFormSubmit',
      'keyup .hex':                   '_textInputColor',
      'click .reset-colors':          '_resetColors',
    }
  }

  initialize() {
    new Chessboard()
    dispatch(`fen:set`, `1Q6/8/8/8/8/2K5/k7/8 b - - 13 62`)
    dispatch(`move:highlight`, { from: `a3`, to: `a2` })
    setTimeout(() => {
      document.getElementById(`b8`).setAttribute('data-selected', '1')
    }, 500)
    const squares = ['light', 'dark', 'selected', 'from', 'to']
    const initialColors = {}
    squares.forEach(squareType => {
      const colorInputEl = this.squareColorInputEl(squareType)
      const color = colorInputEl.value || defaultColors[squareType]
      initialColors[squareType] = color
    })
    this.listenTo(boardStyles, `change`, () => {
      Object.entries(boardStyles.changedAttributes()).forEach(([sqType, color]) => {
        this.squareColorInputEl(sqType).value = <string>color
        this.squareEl(sqType).style.background = <string>color
      })
      this.styleEl.textContent = boardStyles.css()
    })
    boardStyles.set(initialColors)
    document.addEventListener(`click`, e => {
      let node = <HTMLElement>e.target
      while (node) {
        if (node.classList.contains(`square-color`)) {
          return
        }
        node = node.parentElement
      }
      this.removeColorPicker()
    })
  }

  private squareColorInputEl(sq: string): HTMLInputElement {
    return this.el.querySelector(`.squares .square-color.${sq} input`)
  }

  private squareEl(sq: string): HTMLElement {
    return this.el.querySelector(`.squares .square-color.${sq} .square`)
  }

  private removeColorPicker() {
    if (this.colorPicker) {
      this.colorPicker.$el.parentNode.classList.add(`invisible`)
      this.colorPicker.remove()
      this.colorPicker = null
    }
  }

  private _toggleColorPicker(e) {
    this.removeColorPicker()
    const squareEl = e.target
    const colorPickerContainerEl = squareEl.previousSibling
    this.colorPicker = new SimpleColorPicker({
      color: squareEl.style.background,
      el: colorPickerContainerEl,
    })
    colorPickerContainerEl.classList.remove(`invisible`)
    this.colorPicker.on('update', () => {
      const color = this.colorPicker.getHexString()
      boardStyles.setColor(squareEl.dataset.sq, color)
    })
  }

  private _textInputColor(e) {
    const colorInputEl = e.target
    const colorText = colorInputEl.value
    const squareEl = colorInputEl.previousSibling
    if (e.which === 13 || colorText.length >= 6) {
      boardStyles.setColor(squareEl.dataset.sq, colorText)
    }
  }

  private _preventFormSubmit(e) {
    if (e.which === 13) {
      e.preventDefault()
      e.stopImmediatePropagation()
      return false
    }
  }

  private _resetColors(e) {
    e.preventDefault()
    boardStyles.set(defaultColors)
  }
}
