import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scale: {
    // mode: Phaser.Scale.RESIZE, // auto-resize with window
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: '#87CEEB',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

const FRUIT_RAD = 20;
let skewer;
let wall;
let skewers = [];
let fruits = [];
let fruitCount = 0;
const FRUIT_KEYS = ['strawberry', 'apple', 'banana']; // Define an array of fruit keys


function preload() {
  this.load.image('skewer', 'skewer.png')// Add your skewer image
  this.load.image(FRUIT_KEYS[0], 'strawberry.png')   // Add your fruit image
  this.load.image(FRUIT_KEYS[1], 'apple.png')  // Add your fruit image
  this.load.image(FRUIT_KEYS[2], 'banana.png')   // Add your fruit image

}

function create() {
  wall = this.add.rectangle(780, 300, 20, 600, 0x8B0000);
  this.physics.add.existing(wall, true); // static body

  this.input.on('pointerdown', (pointer) => {
    const skewer = this.physics.add.image(100, pointer.y, 'skewer').setScale(0.2);
    const hitboxWidth = skewer.displayWidth * 4; // 80% of the displayed width
    const hitboxHeight = skewer.displayHeight * 0.9; // 20% of the displayed height
    skewer.body.setSize(hitboxWidth, hitboxHeight);
    skewer.skeweredFruits = [];
    // skewer.body.setCircle(skewer.width / 2); // sets a circular hitbox
    skewer.setVelocityX(600);
    skewer.setVelocityY(-100);
    skewers.push(skewer);

    this.physics.add.collider(skewer, wall, () => {
      skewer.setVelocity(0);
      skewer.body.immovable = true;
      skewer.body.moves = false;
      skewer.skeweredFruits?.forEach(f => {
        f.body.enable = false;
      });
    });

    this.physics.add.overlap(skewer, fruits, (sk, fruit) => {
      if (!sk.skeweredFruits.includes(fruit)) {
        fruit.body.enable = false; // disable individual physics
        fruit.setVelocity(0);
        sk.skeweredFruits.push(fruit);
      }
    });
  });


  // Fruit spawning
  fruits = this.physics.add.group();

  // Spawn 5 fruits at random positions
  for (let i = 0; i < 50; i++) {
    const randomFruitKey = Phaser.Math.RND.pick(FRUIT_KEYS); // Pick a random key
    const fruit = fruits.create(
      Phaser.Math.Between(150, 400),
      Phaser.Math.Between(100, 500),
      randomFruitKey // Use the random key
    ).setScale(0.1);
    fruit.body.setCircle(fruit.width / 2);
    fruit.setBounce(1);
    fruit.setCollideWorldBounds(true);
    fruit.setVelocity(0, -200);
  }

  // Collider between skewers and fruits
  this.physics.add.collider(fruits, wall); // bounce off wall


}

function update() {
  skewers.forEach(sk => {
    sk.skeweredFruits?.forEach((fruit, index) => {
      fruit.x = sk.x + 40 - index * 25; // more offset the later it's hit
      fruit.y = sk.y;
      fruit.y = sk.y + Math.sin(index) * 5;
      fruit.setAngle(-10 + index * 5);

    });
  });
}

new Phaser.Game(config);
