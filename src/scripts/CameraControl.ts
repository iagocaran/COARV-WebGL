import { Angle, FreeCamera, ICameraInput, Mesh } from "@babylonjs/core";

export class CameraControl implements ICameraInput<FreeCamera> {
    camera : FreeCamera;
    playerBox : Mesh;
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

    constructor(camera : FreeCamera, playerBox : Mesh) {
        this.camera = camera;
        this.playerBox = playerBox;
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
            // if (this.rotEngaged)
            this.playerBox.rotation.y += event.movementX * 0.001 * (this.angularSensibility / 250);
            let nextRotationX = this.playerBox.rotation.x + (event.movementY * 0.001 * (this.angularSensibility / 250));
            if (nextRotationX < Angle.FromDegrees(90).radians()) {
                this.playerBox.rotation.x += event.movementY * 0.001 * (this.angularSensibility / 250);
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