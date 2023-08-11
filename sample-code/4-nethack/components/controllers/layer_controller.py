from ..models.board import Board
from typing import Tuple, List

class LayerController():

    def __init__(self, target_size: Tuple[int, int]):
        self.layers = []
        self.target_size = target_size

    def set_layer(self, layer: Board):
        self.layers.append(layer)
        print(self.layers)
        self.layers.sort(key=lambda board: board.precedence)

    def get_flattened_layers(self) -> List[List[str]]:
        flattened_result = [['0' for _ in range(self.target_size[0])] for _ in range(self.target_size[1])]

        for layer in reversed(self.layers):
            board = layer.get()  # Get the 2D array representation of the board
            for i in range(layer.size[0]):
                for j in range(layer.size[1]):
                    if board[i][j] != '0':
                        flattened_result[i][j] = board[i][j]

        return flattened_result