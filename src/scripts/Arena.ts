import { HemisphericLight, Mesh, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";
import { Game } from "./Game";
import Brick from '@/images/brick.jpg';
import Wood from '@/images/wood.jpg';

export class Arena {
    game: Game;

    constructor(game : Game) {
        this.game = game;
        let scene = game.scene;

        let light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

        let materialGround = new StandardMaterial("groundTexture", scene);
        let brickTexture = new Texture(Brick, scene);
        brickTexture.uScale = 4.0;
        brickTexture.vScale = 4.0;
        materialGround.diffuseTexture = brickTexture;

        let materialWall = new StandardMaterial("wallTexture", scene);
        let woodTexture = new Texture(Wood, scene);
        materialWall.diffuseTexture = woodTexture;

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