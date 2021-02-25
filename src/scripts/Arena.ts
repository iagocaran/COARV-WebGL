import {
    Color3,
    DirectionalLight,
    HemisphericLight,
    Mesh,
    PointLight, SpotLight,
    StandardMaterial,
    Texture,
    Vector3
} from "@babylonjs/core";
import { Game } from "./Game";
import Brick from '@/images/brick.jpg';
import Wood from '@/images/wood.jpg';

export class Arena {
    game: Game;

    constructor(game : Game) {
        this.game = game;
        let scene = game.scene;

        let light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
        light.diffuse = new Color3(1, 1, 1);
        light.specular = new Color3(1, 1, 1);
        /*
        let light1 = new DirectionalLight("dir1", new Vector3(0, -1, 0), scene);
        light1.diffuse = new Color3(1, 1, 1);
        light1.specular = new Color3(1, 1, 1);
         */
        /*
        let light2 = new PointLight("omni1", new Vector3(1, 10, 1), scene);
        light2.diffuse = new Color3(1, 1, 1);
        light2.specular = new Color3(1, 1, 1);
         */
        /*
        let light3 = new SpotLight("spot1", new Vector3(1, 10, 1), new Vector3(0, -1, 0), 0.8, 2, scene);
        light3.diffuse = new Color3(1, 1, 1);
        light3.specular = new Color3(1, 1, 1);
         */

        let materialGround = new StandardMaterial("groundTexture", scene);
        let brickTexture = new Texture(Brick, scene);
        brickTexture.uScale = 4.0;
        brickTexture.vScale = 4.0;
        materialGround.diffuseTexture = brickTexture;

        let materialWall = new StandardMaterial("wallTexture", scene);
        materialWall.diffuseTexture = new Texture(Wood, scene);

        let ground = Mesh.CreateGround("ground1", 20, 20, 2, scene);
        ground.scaling = new Vector3(2, 10, 3);
        ground.scaling.z = 2;
        ground.material = materialGround;

        let mainBox = Mesh.CreateBox("box1", 3, scene);
        mainBox.scaling.y = 1;
        mainBox.position = new Vector3(5, ((3 / 2) * mainBox.scaling.y), 5);
        mainBox.rotation.y = (Math.PI * 45) / 180;
        mainBox.material = materialWall;

        let mainBox2 = mainBox.clone("box2");
        mainBox2.scaling.y = 2;
        mainBox2.position = new Vector3(5, ((3 / 2) * mainBox.scaling.y), -5);
        mainBox2.material = materialWall;

        let mainBox3 = mainBox.clone("box3");
        mainBox3.scaling.y = 3;
        mainBox3.position = new Vector3(-5, ((3 / 2) * mainBox.scaling.y), -5);
        mainBox3.material = materialWall;

        let mainBox4 = mainBox.clone("box4");
        mainBox4.scaling.y = 4;
        mainBox4.position = new Vector3(-5, ((3 / 2) * mainBox.scaling.y), 5);
        mainBox4.material = materialWall;

        let cylinder = Mesh.CreateCylinder("cyl1", 20, 5, 5, 20, 4, scene);
        cylinder.position.y = 20 / 2;
        cylinder.material = materialWall;
    }
}