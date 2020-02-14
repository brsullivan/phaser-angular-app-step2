import { Component, OnInit } from '@angular/core';

import Phaser from 'phaser';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;
  constructor() {
    this.config = {
      type: Phaser.AUTO,
      height: 600,
      width: 800,
      scene: [MainScene, SettingsMenu],
      parent: 'gameContainer',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 100 }
        }
      }
    };
  }

  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);
  }
}

class MainScene extends Phaser.Scene {
  gameSettings: any;
  defaultSettings: any = [
    { setting: 'music', value: true },
    { setting: 'sfx', value: true }
  ];

  constructor() {
    super({ key: 'main' });
  }

  preload() {
    this.load.image('gradient', '../../assets/gradient.png');
    this.load.image('button', '../../assets/green_button02.png');
    this.load.image('button_pressed', '../../assets/green_button03.png');
    this.load.audio('buttonSound', '../../assets/switch33.wav');
    this.load.audio('backgroundMusic', '../../assets/Alexander Ehlers - Twists.mp3');
  }

  create() {
    this.gameSettings = JSON.parse(localStorage.getItem('myGameSettings'));
    if (this.gameSettings === null || this.gameSettings.length <= 0) {
      localStorage.setItem('myGameSettings', JSON.stringify(this.defaultSettings));
      this.gameSettings = this.defaultSettings;
    }

    this.add.image(0, 0, 'gradient');
    const settingsButton = this.add.image(200, 400,
      'button').setInteractive();
    const settingsButtonText = this.add.text(0, 0, 'Settings', {
      color:
        '#000', fontSize: '28px'
    });
    Phaser.Display.Align.In.Center(settingsButtonText,
      settingsButton);
    settingsButton.on('pointerdown', () => {
      settingsButton.setTexture('button_pressed');
      if (this.gameSettings[1].value) {
        this.sound.play('buttonSound');
      }
    }).on('pointerup', () => {
      settingsButton.setTexture('button');
      this.scene.launch('settings');
      this.scene.stop();
    });
    const music = this.sound.add('backgroundMusic', {
      mute: false,
      volume: 1,
      rate: 1,
      loop: true,
      delay: 200
    });

    if (this.gameSettings[0].value) {
      music.play();
    }
  }
}

class SettingsMenu extends Phaser.Scene {
  gameSettings: any;

  constructor() {
    super({ key: 'settings' });
  }
  create() {
    this.gameSettings = JSON.parse(localStorage.getItem('myGameSettings'));

    this.add.text(250, 40, 'Settings', {
      fontSize: '56px', color: '#ffffff'
    });
    this.add.text(200, 220, 'Sound Effects',
      { fontSize: '28px', color: '#ffffff' });
    const soundFxButton = this.add.image(550, 235,
      'button').setInteractive();
    const soundFxText = this.add.text(0, 0, this.gameSettings[1]
      .value === true ? 'On' : 'Off', {
        fontSize: '28px', color:
          '#000000'
    });
    soundFxButton.on('pointerdown', () => {
      soundFxButton.setTexture('button_pressed');
      if (this.gameSettings[1].value) {
        this.sound.play('buttonSound');
      }
    }).on('pointerup', () => {
      soundFxButton.setTexture('button');
      if (this.gameSettings[1].value) {
        this.gameSettings[1].value = false;
        soundFxText.text = 'Off';
      } else {
        this.gameSettings[1].value = true;
        soundFxText.text = 'On';
      }
      localStorage.setItem('myGameSettings',
        JSON.stringify(this.gameSettings));
    });
    Phaser.Display.Align.In.Center(soundFxText, soundFxButton);

    this.add.text(200, 350, 'Music',
      { fontSize: '28px', color: '#ffffff' });
    const musicButton = this.add.image(550, 365, 'button')
      .setInteractive();
    const musicText = this.add.text(0, 0, this.gameSettings[0]
      .value === true ? 'On' : 'Off', {
        fontSize: '28px', color:
          '#000000'
    });
    musicButton.on('pointerdown', () => {
      musicButton.setTexture('button_pressed');
      if (this.gameSettings[1].value) {
        this.sound.play('buttonSound');
      }
    }).on('pointerup', () => {
      musicButton.setTexture('button');
      if (this.gameSettings[0].value) {
        this.gameSettings[0].value = false;
        musicText.text = 'Off';
      } else {
        this.gameSettings[0].value = true;
        musicText.text = 'On';
      }
      localStorage.setItem('myGameSettings',
        JSON.stringify(this.gameSettings));
    });
    Phaser.Display.Align.In.Center(musicText, musicButton);
  }
}
