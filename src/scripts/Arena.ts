import { Game } from "./Game";
import { HemisphericLight } from "babylonjs/Lights/hemisphericLight";
import { Vector3 } from "babylonjs/Maths/math.vector";
import { Mesh } from "babylonjs/Meshes/mesh";


export class Arena {
    game: Game;

    constructor(game : Game) {
        this.game = game;
        let scene = game.scene;

        let light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
        let sphere = Mesh.CreateSphere("sphere1", 16, 2, scene);
        sphere.position.y = 1;
        let ground = Mesh.CreateGround("ground1", 6, 6, 2, scene);
    }
}