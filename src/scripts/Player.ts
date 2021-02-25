import { Scene } from "babylonjs";
import { Game } from "./Game";
import { FreeCamera } from "babylonjs/Cameras/freeCamera";
import { Vector3 } from "babylonjs/Maths/math.vector";


export class Player {
    scene : Scene;
    camera : FreeCamera;

    constructor(game : Game, canvas : HTMLCanvasElement) {
        this.scene = game.scene;
        this.camera = this._initCamera(this.scene, canvas);
    }

    private _initCamera(scene : Scene, canvas : HTMLCanvasElement) : FreeCamera {
        let camera = new FreeCamera("camera", new Vector3(0, 5, -10), this.scene);
        camera.setTarget(Vector3.Zero());
        camera.attachControl(canvas, true);
        return camera;
    }
}