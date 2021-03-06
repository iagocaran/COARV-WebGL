import { Angle, FreeCamera, Mesh, Scene, TargetCamera, Vector3 } from "@babylonjs/core";
import { Game } from "./Game";
import { CameraControl } from "./CameraControl";
import  {Weapons } from "./Weapons";


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
    playerBox : Mesh;

    constructor(game : Game, canvas : HTMLCanvasElement) {
        this.scene = game.scene;
        this.isAlive = true;

        this.playerBox = Mesh.CreateBox("headMainPlayer", 3, this.scene);
        this.camera = this._initCamera(this.scene, canvas);
        this.weapons = new Weapons(this);

        this.playerBox.position = new Vector3(-20, 5, 0);
        this.playerBox.ellipsoid = new Vector3(2, 2, 2);
        this.camera.parent = this.playerBox;
        this.playerBox.checkCollisions = true;
        // this.playerBox.applyGravity = true;
        // this.camera.isMain = true;
        (<FreeCamera>this.camera).applyGravity = true;

        let hitBoxPlayer = Mesh.CreateBox("hitBoxPlayer", 3, this.scene);
        hitBoxPlayer.parent = this.playerBox;
        hitBoxPlayer.scaling.y = 2;
        hitBoxPlayer.isPickable = true;
        //hitBoxPlayer.isMain = true;

        this._initPointerLock();
        this._initMouseHandle();
    }

    private _initCamera(scene : Scene, canvas : HTMLCanvasElement) : TargetCamera {
        let camera = new FreeCamera("camera", new Vector3(-20, 5, 0), this.scene);
        camera.setTarget(Vector3.Zero());
        camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
        camera.inputs.removeByType("FreeCameraMouseInput");
        this.control = new CameraControl(camera, this.playerBox);
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
                    let forward = new Vector3(
                        this.playerBox.position.x + (Math.sin(this.playerBox.rotation.y) * relativeSpeed),
                        this.playerBox.position.y,
                        this.playerBox.position.z + (Math.cos(this.playerBox.rotation.y) * relativeSpeed)
                    );
                    this.playerBox.moveWithCollisions(forward);
                }
                if (control.keysDown.indexOf(key) !== -1) {
                    let backward = new Vector3(
                        this.playerBox.position.x + (Math.sin(this.playerBox.rotation.y) * -relativeSpeed),
                        this.playerBox.position.y,
                        this.playerBox.position.z + (Math.cos(this.playerBox.rotation.y) * -relativeSpeed)
                    );
                    this.playerBox.moveWithCollisions(backward);
                }
                if (control.keysLeft.indexOf(key) !== -1) {
                    let left = new Vector3(
                        this.playerBox.position.x + Math.sin(this.playerBox.rotation.y + Angle.FromDegrees(-90).radians()) * relativeSpeed,
                        this.playerBox.position.y,
                        this.playerBox.position.z + Math.cos(this.playerBox.rotation.y + Angle.FromDegrees(-90).radians()) * relativeSpeed
                    );
                    this.playerBox.moveWithCollisions(left);
                }
                if (control.keysRight.indexOf(key) !== -1) {
                    let right = new Vector3(
                        this.playerBox.position.x + Math.sin(this.playerBox.rotation.y + Angle.FromDegrees(-90).radians()) * -relativeSpeed,
                        this.playerBox.position.y,
                        this.playerBox.position.z + Math.cos(this.playerBox.rotation.y + Angle.FromDegrees(-90).radians()) * -relativeSpeed
                    );
                    this.playerBox.moveWithCollisions(right);
                }
                this.playerBox.moveWithCollisions(new Vector3(0, (-1.5) * relativeSpeed, 0));
            }
        }
    }
}