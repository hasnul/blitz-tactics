import PuzzlePlayer from '../../components/puzzle_player'
import Sidebar from './views/sidebar'
import Timer from './views/timer'
import Progress from './views/progress'
import Modal from './views/modal'
import SpeedrunComplete from './views/speedrun_complete'
import { speedrunCompleted } from '../../api/requests'
import { dispatch, subscribe } from '../../store'

const apiPath = `/speedrun/puzzles`

export default class Speedrun {
  constructor() {
    new Sidebar
    new Timer
    new Modal
    new Progress
    new SpeedrunComplete

    let levelName

    subscribe({
      'level:selected': name => {
        dispatch(`source:changed`, `${apiPath}?name=${name}`)
      },

      'config:init': data => {
        levelName = data.level_name
      },

      'timer:stopped': elapsedTimeMs => {
        speedrunCompleted(levelName, elapsedTimeMs).then(data => {
          dispatch(`speedrun:complete`, data)
        })
      }
    })

    new PuzzlePlayer({
      shuffle: false,
      loopPuzzles: false,
      source: apiPath,
    })
  }
}
