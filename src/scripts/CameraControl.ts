import {Angle, FreeCamera, ICameraInput, Vector3} from "@babylonjs/core";

export class CameraControl implements ICameraInput<FreeCamera> {
    camera : FreeCamera;
    keysLeft : Array<string> = ['ArrowLeft', 'a'];
    keysRight : Array<string> = ['ArrowRight', 'd'];
    keysUp : Array<string> = ['ArrowUp', 'w'];
    keysDown : Array<string> = ['ArrowDown', 's'];
    keys : Array<string> = [];
    noPreventDefault : boolean = false;
    angularSensibility : number = 50;
    onKeyDown : any;
    onKeyUp : any;
    onMouseMove : any;

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
}