export interface GameObject {
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    update: () => void;
    render: () => void;
}

export interface Player extends GameObject {
    health: number;
    score: number;
    move: (direction: string) => void;
}

export interface Enemy extends GameObject {
    damage: number;
    attack: (player: Player) => void;
}

export interface GameState {
    players: Player[];
    enemies: Enemy[];
    score: number;
    isGameOver: boolean;
}