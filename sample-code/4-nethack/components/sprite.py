from dataclasses import dataclass

@dataclass
class Sprite():

    pos: tuple[int, int]
    token_repr: str
    
    def __str__(self):
        print(self.token_repr)

    def get_pos(self):
        return self.pos

