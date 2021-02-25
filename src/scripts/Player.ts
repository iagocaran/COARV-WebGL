import { Camera, FreeCamera, Scene, Vector3} from "@babylonjs/core";
import { Game } from "./Game";
import { CameraKeyboardControl } from "./CameraKeyboardControl";


export class Player {
    scene : Scene;
    camera : Camera;
    isAlive : boolean;

    constructor(game : Game, canvas : HTMLCanvasElement) {
        this.scene = game.scene;
        this.isAlive = true;
        this.camera = this._initCamera(this.scene, canvas);
    }

    private _initCamera(scene : Scene, canvas : HTMLCanvasElement) : Camera {
        let camera = new FreeCamera("camera", new Vector3(-20, 5, 0), this.scene);
        camera.setTarget(Vector3.Zero());
        camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
        camera.inputs.removeByType("FreeCameraMouseInput");
        camera.inputs.add(new CameraKeyboardControl(camera));
        camera.attachControl(false);
        return camera;
    }
}