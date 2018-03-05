import { Furni } from '../lib'

export default class extends Furni {

  dimensions = {
    x: 1,
    y: 1,
    z: 1
  }

  assets = [
    'throne_64_a_2_0',
    'throne_64_b_2_0',
    'throne_64_sd_2_0',
    'throne_64_a_0_0',
    'throne_64_b_0_0'
  ]

  source = {
    NW: [{
      source: 'throne_64_sd_2_0',
      x: 0,//33
      y: 15,
      opacity: 0.25
    }, {
      source: 'throne_64_a_2_0',
      x: 0, // 32
      y: 74 // 74
    }, {
      source: 'throne_64_b_2_0',
      x: 7, // 25
      y: 25 // 25
    }],
    NE: [{
      source: 'throne_64_sd_2_0',
      flip: { y: -1 },
      x: 0,
      y: 15,
      opacity: 0.25
    }, {
      source: 'throne_64_b_0_0',
      x: 0,
      y: 61
    }, {
      source: 'throne_64_a_0_0',
      x: 7,
      y: 33
    }],
    SE: [{
      source: 'throne_64_sd_2_0',
      flip: { x: -1 },
      x: 0,
      y: 15,
      opacity: 0.25
    }, { // SE
      source: 'throne_64_a_2_0',
      flip: { x: -1 },
      x: 0,
      y: 74 // 76
    }, {
      source: 'throne_64_b_2_0',
      flip: { x: -1 },
      x: -7,
      y: 25 // 27
    }],
    //SW: [{}]
  }

}
