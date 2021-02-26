import { Camera, FreeCamera, Scene, Vector3} from "@babylonjs/core";
import { Game } from "./Game";
import { CameraControl } from "./CameraControl";


export class Player {
    scene : Scene;
    camera : Camera;
    isAlive : boolean;
    controlEnabled : boolean = false;
    rotEngaged : boolean = false;

    constructor(game : Game, canvas : HTMLCanvasElement) {
        this.scene = game.scene;
        this.isAlive = true;
        this.camera = this._initCamera(this.scene, canvas);
        this._initPointerLock();
    }

    private _initCamera(scene : Scene, canvas : HTMLCanvasElement) : Camera {
        let camera = new FreeCamera("camera", new Vector3(-20, 5, 0), this.scene);
        camera.setTarget(Vector3.Zero());
        camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
        camera.inputs.removeByType("FreeCameraMouseInput");
        camera.inputs.add(new CameraControl(camera));
        camera.attachControl(false);
        return camera;
    }

    private _initPointerLock() {
        let canvas = this.scene.getEngine().getRenderingCanvas();

        canvas?.addEventListener("click", (event) => {
            if (canvas) {
                canvas.requestPointerLock();
            }
        }, false);

        let pointerLockChange = (event : any) => {
            this.controlEnabled = (document.pointerLockElement === canvas);
            this.rotEngaged = this.controlEnabled;
        };

        document.addEventListener("pointerlockchange", pointerLockChange, false);
    }
}