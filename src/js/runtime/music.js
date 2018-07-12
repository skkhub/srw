let instance

/**
 * 统一的音效管理器
 */
export default class Music {
  constructor() {
    if ( instance )
      return instance

    instance = this

    this.bgmAudio = new Audio()
    this.bgmAudio.loop = true
    this.bgmAudio.src  = require('src/audio/bgm.mp3')

    this.shootAudio     = new Audio()
    this.shootAudio.src = require('src/audio/bullet.mp3')

    this.boomAudio     = new Audio()
    this.boomAudio.src = require('src/audio/boom.mp3')

    this.playBgm()
  }

  playBgm() {
    this.bgmAudio.play()
  }

  playShoot() {
    this.shootAudio.currentTime = 0
    this.shootAudio.play()
  }

  playExplosion() {
    this.boomAudio.currentTime = 0
    this.boomAudio.play()
  }

  stopAllMusic() {
    this.bgmAudio.pause();
    this.bgmAudio.currentTime = 0;

    this.shootAudio.pause();
    this.shootAudio.currentTime = 0;
    
    this.boomAudio.pause();
    this.boomAudio.currentTime = 0;
  }
}
