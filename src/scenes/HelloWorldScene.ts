import Phaser from "phaser";

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("hello-world");
  }

  preload() {
    // Step 1 - Load the sky
    this.load.image("sky", "sky.jpg");

    // Step 2 - load the robot image
    this.load.image("robot", "robot.png");

    // Step 7 - smoke
    this.load.image("smoke", "smoke.png");

    // Step 8 - pipe
    this.load.image("pipe", "pipe1.png");

    // this.load.setBaseURL("http://labs.phaser.io");

    // this.load.image("sky", "assets/skies/space3.png");
    // this.load.image("logo", "assets/sprites/phaser3-logo.png");
    // this.load.image("red", "assets/particles/red.png");
  }

  create() {
    // Step 1 - Show the sky
    this.add.image(400, 300, "sky");

    // Step 2 - add a robot
    const robot = this.physics.add.image(400, 100, "robot");

    // Step 3 - make robot not fall off the screen
    robot.setCollideWorldBounds(true);
    robot.setBounce(0.2);

    // Step 4 - movement left and right
    const cursorKeys = this.input.keyboard.createCursorKeys();
    cursorKeys.left?.on("down", (event) => {
      robot.setVelocityX(-200);
    });
    cursorKeys.left?.on("up", (event) => {
      robot.setVelocityX(0);
    });
    cursorKeys.right?.on("down", (event) => {
      robot.setVelocityX(200);
    });
    cursorKeys.right?.on("up", (event) => {
      robot.setVelocityX(0);
    });

    // Step 5 - jetpack
    cursorKeys.up?.on("down", (event) => {
      emitter.start();
      robot.setAccelerationY(-1000);
    });
    cursorKeys.up?.on("up", () => {
      emitter.stop();
      robot.setAccelerationY(0);
    });

    // Step 6 - improve gravity
    robot.setGravityY(500);

    // Step 7 - Smoke
    const particles = this.add.particles("smoke");
    const emitter = particles.createEmitter({
      speed: 100,
      scale: { start: 0.5, end: 0 },
      blendMode: "NORMAL",
      gravityY: -100,
      on: false,
    });
    emitter.startFollow(robot);
    particles.setDepth(1);
    robot.setDepth(2);

    // Step 8 - platforms
    const platforms = this.physics.add.staticGroup();

    platforms.create(600, 400, "pipe");
    platforms.create(150, 250, "pipe");
    platforms.create(750, 220, "pipe");

    // Step 9 - collisions
    this.physics.add.collider(robot, platforms);

    // Step 10 - collectibles
    const stars = [
      this.add.text(500, 335, "🌟", { fontSize: "30px" }),
      this.add.text(200, 180, "🌟", { fontSize: "30px" }),
    ];
    stars.forEach((star) => {
      this.physics.world.enable(star);
      star.body.setAllowGravity(false)
      this.physics.add.overlap(robot, star, () => {
        star.destroy(true);
        this.cameras.main.flash(1000, 0, 255, 0);
      });
    });
  }
}
