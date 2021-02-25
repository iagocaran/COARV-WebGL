import { Engine, Scene, Color4 } from 'babylonjs';

export class Game {
    canvas: HTMLCanvasElement;
    engine: Engine;
    scene: Scene;

    constructor(canvasId : string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.engine = new Engine(this.canvas, true);
        this.scene = this._initScene(this.engine);

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener("resize", () => {
           if (this.engine) this.engine.resize();
        });
    }

    private _initScene (engine : Engine) : Scene {
        let scene = new Scene(engine);
        scene.clearColor = new Color4(0, 0, 0, 255);
        return scene;
    }
}
