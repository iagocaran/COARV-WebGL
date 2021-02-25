import {FreeCamera, ICameraInput, Vector3} from "@babylonjs/core";

export class CameraKeyboardControl implements ICameraInput<FreeCamera> {
    camera : FreeCamera;
    keysLeft : Array<string> = ['ArrowLeft', 'a'];
    keysRight : Array<string> = ['ArrowRight', 'd'];
    keysUp : Array<string> = ['ArrowUp', 'w'];
    keysDown : Array<string> = ['ArrowDown', 's'];
    keys : Array<string> = [];
    noPreventDefault : boolean = false;
    sensibility : number = -0.0015;
    speed : number = 0.5;
    onKeyDown : any;
    onKeyUp : any;
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
        }
        this.onKeyUp = (event : KeyboardEvent) => {
            if (this.keysLeft.indexOf(event.key) !== -1 ||
                this.keysRight.indexOf(event.key) !== -1 ||
                this.keysUp.indexOf(event.key) !== -1 ||
                this.keysDown.indexOf(event.key) !== -1) {
                let index = this.keys.indexOf(event.key);
                if (index >= 0) this.keys.splice(index, 1);
                if (!this.noPreventDefault) event.preventDefault();
            }
        }

        element?.addEventListener("keydown", this.onKeyDown, false);
        element?.addEventListener("keyup", this.onKeyUp, false);
        console.log(this.keysLeft);
    }

    detachControl() {
        let engine = this.camera.getEngine();
        let element = engine.getInputElement();
        element?.removeEventListener("keydown", this.onKeyDown);
        element?.removeEventListener("keyup", this.onKeyUp);
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