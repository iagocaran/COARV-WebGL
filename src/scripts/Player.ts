import {ArcRotateCamera, Camera, FreeCamera, Scene, Vector3} from "@babylonjs/core";
import { Game } from "./Game";


export class Player {
    scene : Scene;
    camera : Camera;

    constructor(game : Game, canvas : HTMLCanvasElement) {
        this.scene = game.scene;
        this.camera = this._initCamera(this.scene, canvas);
    }

    private _initCamera(scene : Scene, canvas : HTMLCanvasElement) : Camera {
        /*
        let camera = new FreeCamera("camera", new Vector3(0, 5, -10), this.scene);
        camera.setTarget(Vector3.Zero());
         */
        let camera = new ArcRotateCamera("ArcRotateCamera", 1, 0.8, 10, new Vector3(0, 0, 0), scene);
        camera.attachControl(canvas, true);
        return camera;
    }
}