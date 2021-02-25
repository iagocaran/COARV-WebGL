import { HemisphericLight, Mesh, Vector3 } from "@babylonjs/core";
import { Game } from "./Game";

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