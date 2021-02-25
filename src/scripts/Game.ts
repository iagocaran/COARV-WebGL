import { Engine, Scene, Color4 } from 'babylonjs';
import {Player} from "./Player";

export class Game {
    canvas : HTMLCanvasElement;
    engine : Engine;
    scene : Scene;
    player : Player;

    constructor(canvasId : string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.engine = new Engine(this.canvas, true);
        this.scene = Game._initScene(this.engine);
        this.player = new Player(this, this.canvas);

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener("resize", () => {
           if (this.engine) this.engine.resize();
        });
    }

    private static _initScene (engine : Engine) : Scene {
        let scene = new Scene(engine);
        scene.clearColor = new Color4(0, 0, 0, 255);
        return scene;
    }
}
