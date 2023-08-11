from components.controllers.game_controller import GameController

def main():
    app = GameController(size=(3,3))
    app.run()

if __name__=='__main__':
    main()