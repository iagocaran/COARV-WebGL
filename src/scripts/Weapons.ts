import {Player} from "./Player";
import {Color3, Mesh, StandardMaterial, Vector3} from "@babylonjs/core";

export class Weapons {
    bottomPosition : Vector3 = new Vector3(0.5, -2.5, 1);
    topPositionY : number = -0.5;
    rocketLauncher : Mesh;

    constructor(player : Player) {
        this.rocketLauncher = this.newWeapon(player);
    }

    newWeapon(player : Player) : Mesh {
        let weapon = Mesh.CreateBox('rocketLauncher', 0.5, player.scene);
        weapon.scaling = new Vector3(1, 0.7, 2);
        weapon.parent = player.camera;
        weapon.position = this.bottomPosition.clone();
        weapon.position.y = this.topPositionY;

        let weaponMaterial = new StandardMaterial('rocketLauncherMat', player.scene);
        weaponMaterial.diffuseColor = new Color3(1, 0, 0);

        weapon.material = weaponMaterial;

        return weapon;
    }
}