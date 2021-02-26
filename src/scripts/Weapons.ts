import {Player} from "./Player";
import {Color3, Engine, Mesh, StandardMaterial, Vector3} from "@babylonjs/core";

export class Weapons {
    bottomPosition : Vector3 = new Vector3(0.5, -2.5, 1);
    topPositionY : number = -0.5;
    fireRate : number = 800;
    deltaFireRate : number = this.fireRate;
    canFire : boolean = true;
    launchBullets : boolean = false;
    engine : Engine;
    rocketLauncher : Mesh;

    constructor(player : Player) {
        this.rocketLauncher = this.newWeapon(player);
        this.engine = player.scene.getEngine();

        player.scene.registerBeforeRender(() => {
            if (!this.canFire) {
                this.deltaFireRate -= this.engine.getDeltaTime();
                if (this.deltaFireRate <= 0 && player.isAlive) {
                    this.canFire = true;
                    this.deltaFireRate = this.fireRate;
                }
            }
        });
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

    fire() {
        this.launchBullets = true;
    }

    stopFire() {
        this.launchBullets = false;
    }

    launchFire() {
        if (this.canFire) {
            console.log('Pew !');
            this.canFire = false;
        }
    }
}