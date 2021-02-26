import {
    Color3,
    HemisphericLight,
    Mesh,
    PointLight,
    ShadowGenerator,
    StandardMaterial,
    Texture,
    Vector3
} from "@babylonjs/core";
import { Game } from "./Game";
import Tile from '@/images/tile.jpg';

export class Arena {
    game: Game;

    constructor(game : Game) {
        this.game = game;
        let scene = game.scene;

        let light = new HemisphericLight("light1", new Vector3(0, 10, 0), scene);
        light.intensity = 0.2;

        let light2 = new HemisphericLight("light2", new Vector3(0, -1, 0), scene);
        light2.specular = new Color3(0, 0, 0);
        light2.intensity = 0.8;

        let light3 = new PointLight("spot0", new Vector3(-40, 10, -100), scene);
        light3.intensity = 0.3;
        light3.specular = new Color3(0, 0, 0);

        let shadowGenerator = new ShadowGenerator(2048, light3);
        shadowGenerator.usePoissonSampling = true;
        shadowGenerator.bias = 0.0005;

        let materialGround = new StandardMaterial("groundTexture", scene);
        let tileTexture = new Texture(Tile, scene);
        tileTexture.uScale = 8.0;
        tileTexture.vScale = 8.0;
        materialGround.diffuseTexture = tileTexture;

        let materialWall = new StandardMaterial("wallTexture", scene);
        materialWall.diffuseTexture = new Texture(Tile, scene);

        let boxArena = Mesh.CreateBox("box1", 100, scene, false, Mesh.BACKSIDE);
        boxArena.material = materialGround;
        boxArena.position.y = 50 * 0.3;
        boxArena.scaling = new Vector3(3.5, 0.3, 0.8);
        boxArena.checkCollisions = true;
        boxArena.receiveShadows = true;

        let columns: Array<Array<Mesh>> = [];
        let nColumns = 6;
        let sizeArena = 100 * boxArena.scaling.x - 50;
        let ratio = ((100 / nColumns) / 100) * sizeArena;
        for (let i = 0; i <= 1; i++) {
            if (nColumns > 0) {
                columns[i] = [];
                let mainCylinder = Mesh.CreateCylinder(`cy10-${i}`, 30, 5, 5, 20, 4, scene);
                mainCylinder.position = new Vector3(- sizeArena / 2, 30 / 2, - 20 + (40 * i));
                mainCylinder.material = materialWall;
                mainCylinder.checkCollisions = true;

                //mainCylinder.maxSimultaneousLights = 10;
                shadowGenerator.getShadowMap()?.renderList?.push(mainCylinder);
                mainCylinder.receiveShadows = true;

                columns[i].push(mainCylinder);

                if (nColumns > 1) {
                    for (let j = 1; j <= nColumns - 1; j++) {
                        let newCyl = columns[i][0].clone(`cy1${j}-${i}`);
                        newCyl.position = new Vector3(- (sizeArena / 2) + (ratio * j), 30 / 2, columns[i][0].position.z);
                        newCyl.checkCollisions = true;

                        shadowGenerator.getShadowMap()?.renderList?.push(newCyl);
                        newCyl.receiveShadows = true;

                        columns[i].push(newCyl);
                    }
                }
            }
        }
    }
}