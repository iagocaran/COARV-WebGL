import {Angle, FreeCamera, ICameraInput, Vector3} from "@babylonjs/core";

export class CameraControl implements ICameraInput<FreeCamera> {
    camera : FreeCamera;
    keysLeft : Array<string> = ['ArrowLeft', 'a'];
    keysRight : Array<string> = ['ArrowRight', 'd'];
    keysUp : Array<string> = ['ArrowUp', 'w'];
    keysDown : Array<string> = ['ArrowDown', 's'];
    keys : Array<string> = [];
    noPreventDefault : boolean = false;
    sensibility : number = -0.0015;
    angularSensibility : number = -50;
    speed : number = 0.5;
    onKeyDown : any;
    onKeyUp : any;
    onMouseMove : any;
    front : Vector3 = new Vector3(0, 1, 0);
    up : Vector3 = new Vector3(0, 0, 1);

    constructor(camera : FreeCamera) {
        this.camera = camera;
    }

    getClassName() {
        return "CameraKeyboardControl";
    }

    getSimpleName() {
        return "keyboardControl";
    }

    attachControl() {
        let engine = this.camera.getEngine();
        let element = engine.getInputElement();

        this.onKeyDown = (event : KeyboardEvent) => {
            if (this.keysLeft.indexOf(event.key) !== -1 ||
                this.keysRight.indexOf(event.key) !== -1 ||
                this.keysUp.indexOf(event.key) !== -1 ||
                this.keysDown.indexOf(event.key) !== -1) {
                let index = this.keys.indexOf(event.key);
                if (index === -1) this.keys.push(event.key);
                if (!this.noPreventDefault) event.preventDefault();
            }
        };
        this.onKeyUp = (event : KeyboardEvent) => {
            if (this.keysLeft.indexOf(event.key) !== -1 ||
                this.keysRight.indexOf(event.key) !== -1 ||
                this.keysUp.indexOf(event.key) !== -1 ||
                this.keysDown.indexOf(event.key) !== -1) {
                let index = this.keys.indexOf(event.key);
                if (index >= 0) this.keys.splice(index, 1);
                if (!this.noPreventDefault) event.preventDefault();
            }
        };
        this.onMouseMove = (event : MouseEvent) => {
            // TODO Use Vector3.Lerp and move code to the checkInputs
            // TODO Tune sensitivity
            this.camera.cameraRotation.y += event.movementX * 0.001 * (this.angularSensibility / 250);
            let nextRotationX = this.camera.cameraRotation.x + (event.movementY * 0.001 * (this.angularSensibility / 250));
            if (nextRotationX < Angle.FromDegrees(90).radians()) {
                this.camera.cameraRotation.x += event.movementY * 0.001 * (this.angularSensibility / 250);
            }
        };

        element?.addEventListener("keydown", this.onKeyDown, false);
        element?.addEventListener("keyup", this.onKeyUp, false);
        element?.addEventListener("mousemove", this.onMouseMove, false);
        console.log(this.keysLeft);
    }

    detachControl() {
        let engine = this.camera.getEngine();
        let element = engine.getInputElement();
        element?.removeEventListener("keydown", this.onKeyDown);
        element?.removeEventListener("keyup", this.onKeyUp);
        element?.removeEventListener("mousemove", this.onMouseMove);
        this.keys = [];
    }

    checkInputs() {
        for (let i = 0; i < this.keys.length; i++) {
            let key = this.keys[i];
            if (this.keysLeft.indexOf(key) !== -1) {
                this.camera.cameraRotation.y += this.sensibility;
            } else if (this.keysRight.indexOf(key) !== -1) {
                this.camera.cameraRotation.y -= this.sensibility;
            }
            // TODO Use front position parallel to the world plane
            if (this.keysUp.indexOf(key) !== -1) {
                this.camera.position = Vector3.Lerp(this.camera.position, this.camera.position.subtract(this.camera.getFrontPosition(1).normalize().scale(this.speed)), 0.1);
            } else if (this.keysDown.indexOf(key) !== -1) {
                this.camera.position = Vector3.Lerp(this.camera.position, this.camera.position.add(this.camera.getFrontPosition(1).normalize().scale(this.speed)), 0.1);
            }
            this.camera._updatePosition();
        }
    }
}