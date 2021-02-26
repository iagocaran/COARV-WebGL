import { Player } from "./Player";
import { Color3, Engine, Mesh, Ray, StandardMaterial, Vector3 } from "@babylonjs/core";

export class Weapons {
    bottomPosition : Vector3 = new Vector3(0.5, -2.5, 1);
    topPositionY : number = -0.5;
    fireRate : number = 800;
    deltaFireRate : number = this.fireRate;
    canFire : boolean = true;
    launchBullets : boolean = false;
    engine : Engine;
    rocketLauncher : Mesh;
    player : Player;

    constructor(player : Player) {
        this.rocketLauncher = this.newWeapon(player);
        this.engine = player.scene.getEngine();
        this.player = player;

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
            this.createRocket(this.player.playerBox);
            this.canFire = false;
        }
    }

    createRocket(playerPosition : Mesh) {
        let positionValue = this.rocketLauncher.absolutePosition.clone();
        let rotationValue = playerPosition.rotation;
        let newRocket = Mesh.CreateBox("rocket", 1, this.player.scene);
        let rocketDirection = new Vector3(
            Math.sin(rotationValue.y) * Math.cos(rotationValue.x),
            Math.sin(-rotationValue.x),
            Math.cos(rotationValue.y) * Math.cos(rotationValue.x)
        );
        newRocket.position = new Vector3(
            positionValue.x + rocketDirection.x,
            positionValue.y + rocketDirection.y,
            positionValue.z + rocketDirection.z,
        );
        newRocket.rotation = new Vector3(rotationValue.x, rotationValue.y, rotationValue.z);
        newRocket.scaling = new Vector3(0.5, 0.5, 1);
        newRocket.isPickable = false;

        let rocketMaterial = new StandardMaterial("textureWeapon", this.player.scene);
        rocketMaterial.diffuseColor = new Color3(1, 0, 0);
        newRocket.material = rocketMaterial;

        newRocket.registerAfterRender(() => {
            newRocket.translate(new Vector3(0, 0, 1), 1, 0);
            let rayRocket = new Ray(newRocket.position, rocketDirection);
            let meshFound = newRocket.getScene().pickWithRay(rayRocket);

            if (!meshFound || meshFound.distance < 10) {
                if (meshFound?.pickedMesh) {
                    let explosionRadius = Mesh.CreateSphere("sphere", 5.0, 20, this.player.scene);
                    explosionRadius.position = <Vector3>meshFound.pickedPoint;
                    explosionRadius.isPickable = false;

                    explosionRadius.material = new StandardMaterial("textureExplosion", this.player.scene);
                    (<StandardMaterial>explosionRadius.material).diffuseColor = new Color3(1, 0.6, 0);
                    (<StandardMaterial>explosionRadius.material).specularColor = new Color3(0, 0, 0);
                    (<StandardMaterial>explosionRadius.material).alpha = 0.8;

                    explosionRadius.registerAfterRender(() => {
                        (<StandardMaterial>explosionRadius.material).alpha -= 0.02;
                        if ((<StandardMaterial>explosionRadius.material).alpha <= 0)
                            explosionRadius.dispose();
                    });
                }
                newRocket.dispose();
            }
        });
    }
}