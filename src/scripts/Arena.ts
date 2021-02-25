import {HemisphericLight, Mesh, StandardMaterial, Vector3} from "@babylonjs/core";
import { Game } from "./Game";

export class Arena {
    game: Game;

    constructor(game : Game) {
        this.game = game;
        let scene = game.scene;

        let light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

        let ground = Mesh.CreateGround("ground1", 20, 20, 2, scene);
        ground.scaling = new Vector3(2, 10, 3);
        ground.scaling.z = 2;

        let mainBox = Mesh.CreateBox("box1", 3, scene);
        mainBox.scaling.y = 1;
        mainBox.position = new Vector3(5, ((3 / 2) * mainBox.scaling.y), 5);
        mainBox.rotation.y = (Math.PI * 45) / 180;

        let mainBox2 = mainBox.clone("box2");
        mainBox2.scaling.y = 2;
        mainBox2.position = new Vector3(5, ((3 / 2) * mainBox.scaling.y), -5)

        let mainBox3 = mainBox.clone("box3");
        mainBox3.scaling.y = 3;
        mainBox3.position = new Vector3(-5, ((3 / 2) * mainBox.scaling.y), -5)

        let mainBox4 = mainBox.clone("box4");
        mainBox4.scaling.y = 4;
        mainBox4.position = new Vector3(-5, ((3 / 2) * mainBox.scaling.y), 5)

        let cylinder = Mesh.CreateCylinder("cyl1", 20, 5, 5, 20, 4, scene);
        cylinder.position.y = 20 / 2;
    }
}