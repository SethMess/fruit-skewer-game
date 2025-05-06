import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#87CEEB',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: true
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

let skewer;
let wall;

function preload() {
  this.load.image('skewer', 'skewer.png'); // Add your skewer image
  this.load.image('fruit', 'fruit.png');   // Add your fruit image
}

function create() {
  wall = this.add.rectangle(780, 300, 20, 600, 0x8B0000);
  this.physics.add.existing(wall, true); // static body

  this.input.on('pointerdown', (pointer) => {
    skewer = this.physics.add.image(100, pointer.y, 'skewer');
    skewer.setVelocityX(600);
    skewer.setVelocityY(-100);
    this.physics.add.collider(skewer, wall, () => {
      skewer.setVelocity(0);
      skewer.body.immovable = true;
      skewer.body.moves = false;
    });
  });
}

function update() { }

new Phaser.Game(config);
