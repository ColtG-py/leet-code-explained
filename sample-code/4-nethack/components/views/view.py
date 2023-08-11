from rich.console import Console
from components.models.board import Board
from typing import Tuple, List

class View:
    def __init__(self) -> None:
        self.console = Console()

    def draw_board(self, board: List[List[str]]):
        self.console.clear()
        border = '-' * (len(board[0]) * 2)
        result = border + '\n' 
        for row in board:
            result += ' '.join(row) + '\n'
        result += border
        self.console.print(result)
