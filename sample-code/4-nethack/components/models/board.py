from typing import Tuple, List
import uuid

class Board:
    def __init__(self, size: Tuple[int, int], prec: int = 0) -> None:
        self.size = size
        self.board = arr = [['0' for i in range(size[0])] for j in range(size[1])]
        self.precedence = prec
        self.id = str(uuid.uuid4())
    
    def get(self) -> List[List[str]]:
        return self.board
    
    def get_id(self) -> str:
        return self.id
    
    def set_at_pos(self, pos: Tuple[int, int], token: str) -> None:
        self.board[pos[0]][pos[1]] = token
    
    def __str__(self) -> str:
        border = '-' * (self.size[0] * 2)
        result = border + '\n' 
        for row in self.board:
            result += ' '.join(row) + '\n'
        result += border
        return result


