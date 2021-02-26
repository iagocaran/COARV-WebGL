import {Color4, Engine, Scene, Vector3} from "@babylonjs/core";
import { Player } from "./Player";
import { Arena } from "./Arena";

export class Game {
    canvas : HTMLCanvasElement;
    engine : Engine;
    scene : Scene;
    player : Player;
    fps : number = 1;

    constructor(canvasId : string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.engine = new Engine(this.canvas, true);
        this.scene = Game._initScene(this.engine);

        this.player = new Player(this, this.canvas);
        let arena = new Arena(this);

        this.engine.runRenderLoop(() => {
            this.fps = Math.round(1000 / this.engine.getDeltaTime());
            this.player.checkMove(this.fps / 60);
            this.scene.render();

            if (this.player.weapons.launchBullets)
                this.player.weapons.launchFire();
        });

        window.addEventListener("resize", () => {
           if (this.engine) this.engine.resize();
        });
    }

    private static _initScene (engine : Engine) : Scene {
        let scene = new Scene(engine);
        scene.clearColor = new Color4(0, 0, 0, 255);
        scene.gravity = new Vector3(0, -9.81, 0);
        scene.collisionsEnabled = true;
        return scene;
    }
}
