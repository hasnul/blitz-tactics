import Backbone from 'backbone'

import d from '../../../dispatcher'

export default class SpeedrunComplete extends Backbone.View {

  el() {
    return ".completion"
  }

  initialize() {
    this.listenTo(d, "speedrun:complete", data => {
      this.$el.text(data)
    })
  }
}
