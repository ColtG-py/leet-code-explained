from .layer_controller import LayerController
from ..models.board import Board
from ..views.view import View
from typing import Tuple, List

class GameController():
    def __init__(self, size: Tuple[int, int]) -> None:
        self.layer_controller = LayerController(size)
        self.view = View()

    def run(self) -> None:
        #test code
        board1 = Board((3, 3), 2)
        board1.set_at_pos((1, 1), 'X')
        print(board1)
        self.layer_controller.set_layer(board1)

        board2 = Board((3, 3), 1)
        board2.set_at_pos((0, 2), 'Y')
        self.layer_controller.set_layer(board2)
        while (True):
            #get the string representation of each layer
            #layer into board
            #set the contents of the board
            flattened_board = self.layer_controller.get_flattened_layers()
            self.view.draw_board(flattened_board)
            #block for user input
