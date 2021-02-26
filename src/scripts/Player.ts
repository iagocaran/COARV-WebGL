import {Angle, FreeCamera, Scene, TargetCamera, Vector3} from "@babylonjs/core";
import { Game } from "./Game";
import { CameraControl } from "./CameraControl";
import {Weapons} from "./Weapons";


export class Player {
    scene : Scene;
    camera : TargetCamera;
    control? : CameraControl;
    speed : number = 0.5;
    isAlive : boolean;
    controlEnabled : boolean = false;
    rotEngaged : boolean = false;
    weapons : Weapons;
    weaponShoot : boolean = false;

    constructor(game : Game, canvas : HTMLCanvasElement) {
        this.scene = game.scene;
        this.isAlive = true;
        this.camera = this._initCamera(this.scene, canvas);
        this.weapons = new Weapons(this);
        this._initPointerLock();
        this._initMouseHandle();
    }

    private _initCamera(scene : Scene, canvas : HTMLCanvasElement) : TargetCamera {
        let camera = new FreeCamera("camera", new Vector3(-20, 5, 0), this.scene);
        camera.setTarget(Vector3.Zero());
        camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
        camera.inputs.removeByType("FreeCameraMouseInput");
        this.control = new CameraControl(camera);
        camera.inputs.add(this.control);
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

    private _initMouseHandle() {
        let canvas = this.scene.getEngine().getRenderingCanvas();

        canvas?.addEventListener("pointerdown", (event) => {
            if (this.controlEnabled && !this.weaponShoot) {
                this.weaponShoot = true;
                this.handleUserMouseDown();
            }
        }, false);
        canvas?.addEventListener("pointerup", (event) => {
            if (this.controlEnabled && this.weaponShoot) {
                this.weaponShoot = false;
                this.handleUserMouseUp();
            }
        }, false);
    }

    handleUserMouseDown() {
        if (this.isAlive) this.weapons.fire();
    }

    handleUserMouseUp() {
        if (this.isAlive) this.weapons.stopFire();
    }

    checkMove(fpsRatio : number) {
        let control = this.control;
        let relativeSpeed = this.speed / fpsRatio;
        if (control) {
            for (let i = 0; i < control.keys.length; i++) {
                let key = control.keys[i];
                if (control.keysUp.indexOf(key) !== -1) {
                    this.camera.position = new Vector3(
                        this.camera.position.x + (Math.sin(this.camera.rotation.y) * relativeSpeed),
                        this.camera.position.y,
                        this.camera.position.z + (Math.cos(this.camera.rotation.y) * relativeSpeed)
                    );
                }
                if (control.keysDown.indexOf(key) !== -1) {
                    this.camera.position = new Vector3(
                        this.camera.position.x + (Math.sin(this.camera.rotation.y) * -relativeSpeed),
                        this.camera.position.y,
                        this.camera.position.z + (Math.cos(this.camera.rotation.y) * -relativeSpeed)
                    );
                }
                if (control.keysLeft.indexOf(key) !== -1) {
                    this.camera.position = new Vector3(
                        this.camera.position.x + Math.sin(this.camera.rotation.y + Angle.FromDegrees(-90).radians()) * relativeSpeed,
                        this.camera.position.y,
                        this.camera.position.z + Math.cos(this.camera.rotation.y + Angle.FromDegrees(-90).radians()) * relativeSpeed
                    );
                }
                if (control.keysRight.indexOf(key) !== -1) {
                    this.camera.position = new Vector3(
                        this.camera.position.x + Math.sin(this.camera.rotation.y + Angle.FromDegrees(-90).radians()) * -relativeSpeed,
                        this.camera.position.y,
                        this.camera.position.z + Math.cos(this.camera.rotation.y + Angle.FromDegrees(-90).radians()) * -relativeSpeed
                    );
                }
            }
        }
    }
}