import tkinter as tk
import random


# extra credits completed
# 1. No direction reversal (2 points)
# 2. Restart mid-game (1 point)
# 4. Pausing the game (1 point)
# 5. Smarter enemy snake movement (4 points)
# 7. Enemy snakes can lose (3 points)
# 8. My own idea: no food generated in the body of snakes. It's avoided by the food_outside_snake function in the
#    SnakeGUI class


# ==========================================
# Purpose: a variant of the video game Snake in which the player play along with a computer-controlled snake
# Instance variables:
#   self.win: the tkinter window
#   self.canvas: a Canvas object that is used for drawing and manipulating shapes
#   self.board: a rectangle that represents the board
#   self.game_over: a boolean value that represents whether the game is over
#   self.pause_game: a boolean value that represents whether the game is paused
#   self.player: a Player object that represents the player
#   self.enemy: a Enemy object that represents the computer-controlled snake
#   self.snake_list: a list that contains all the Player and Enemy objects on the board
#   self.food: a Food object that represents the food
#   self.pause_text: if the game is paused, it represents the text to be displayed; otherwise, it's an empty string
#   self.enemy_text: the text to be displayed when the enemy loses
# Methods:
#   __init__: a constructor with no parameters (not counting self), that initializes the win, canvas instance variables
#   restart: resets the game to the initial status when 'r' key is pressed. Can be used mid-game
#   gameloop: call itself after 100 ms to make the animation. Check the end status of every turn to determine whether
#       the game is over, enemy loses, game is paused, and food is eaten. If the game is not over or paused, move the
#       player snake and enemy snake.
#   pause: change the value of self.pause_game when 'space' key is pressed.
#   check_eat: check if either of the snakes eats the food. If one of the snake eats the food, the snake grows longer
#       and a new food is placed on the board
#   food_outside_snake: check whether the newly generated food is placed inside one of the snakes. If it is, generates
#       a new one
#   player_into_self: check whether the player snake runs into itself
#   player_into_wall: check whether the player snake runs into the wall
#   one_into_other: check whether the two snakes runs into each other
#   enemy_into_self: check whether the enemy snake runs into itself
#   enemy_into_wall: check whether the enemy snake runs into the wall
#   wipe: delete the text that is displayed when enemy loses
# ==========================================


class SnakeGUI:
    def __init__(self):
        self.win = tk.Tk()
        self.win.title('Snake')
        self.canvas = tk.Canvas(self.win, width=660, height=660, bg='white')
        self.canvas.pack()
        self.restart(1)
        self.gameloop()

    def restart(self, event):
        self.canvas.delete(tk.ALL)
        self.board = self.canvas.create_rectangle(30, 30, 630, 630, fill='old lace')
        self.game_over = False
        self.pause_game = False
        self.player = Player(345, 315, 'deep sky blue', self.canvas)
        self.enemy = Enemy(525, 525, 'orchid', self.canvas)
        self.snake_list = [self.player, self.enemy]
        self.food = Food(self.canvas)
        self.pause_text = ''
        self.food_outside_snake()
        self.win.bind('<Up>', self.player.up)
        self.win.bind('<Down>', self.player.down)
        self.win.bind('<Left>', self.player.left)
        self.win.bind('<Right>', self.player.right)
        self.win.bind('r', self.restart)
        self.win.bind('<space>', self.pause)

    def gameloop(self):
        self.player_into_wall()
        self.player_into_self()
        if not self.enemy.out:
            self.one_into_other()
            self.enemy_into_wall()
            self.enemy_into_self()
        if not self.game_over and not self.pause_game:
            self.player.move()
            if not self.enemy.out:
                self.enemy.move(self.food)
            self.check_eat()
        elif self.pause_game:
            if not self.pause_text:
                self.pause_text = self.canvas.create_text(345, 315,
                                                          text="Game paused", justify='center', font=('Caliber', 20))
        if self.game_over:
            self.win.unbind('<space>')
        self.canvas.after(100, self.gameloop)

    def pause(self, event):
        if self.pause_game:
            self.canvas.delete(self.pause_text)
            self.pause_text = ''
            self.pause_game = False
        else:
            self.pause_game = True

    def check_eat(self):
        for snake in self.snake_list:
            if self.food.x == snake.x and self.food.y == snake.y:
                self.canvas.delete(self.food.id)
                self.food = Food(self.canvas)
                self.food_outside_snake()
            else:
                delete_id = snake.segments.pop()
                self.canvas.delete(delete_id)
                snake.coor_segments.pop()

    def food_outside_snake(self):
        for snake in self.snake_list:
            i = 0
            while i <= 1:
                for segment in snake.coor_segments:
                    xpos_center = (segment[0] + segment[2]) / 2
                    ypos_center = (segment[1] + segment[3]) / 2
                    if xpos_center == self.food.x and ypos_center == self.food.y:
                        self.canvas.delete(self.food.id)
                        self.food = Food(self.canvas)
                        i = 0
                i += 1

    def player_into_self(self):
        for coor_segment in self.player.coor_segments:
            if self.player.coor_segments.count(coor_segment) >= 2:
                self.game_over = True
                self.canvas.create_text(345, 315,
                                        text="You run into yourself.\nGame over.\n"
                                             "Final score: {}\nPress 'r' to restart".format(len(self.player.segments)),
                                        justify='center', font=('Caliber', 20))

    def player_into_wall(self):
        if self.player.x <= 30 or self.player.x >= 630 or self.player.y <= 30 or self.player.y >= 630:
            self.game_over = True
            self.canvas.create_text(345, 315,
                                    text="You hit the wall.\nGame over.\n"
                                         "Final score: {}\nPress 'r' to restart".format(len(self.player.segments)),
                                    justify='center', font=('Caliber', 20))

    def one_into_other(self):
        if self.player.coor_segments[0] in self.enemy.coor_segments:
            self.game_over = True
            self.canvas.create_text(345, 315,
                                    text="You run into another snake.\nGame over.\n"
                                         "Final score: {}\nPress 'r' to restart".format(len(self.player.segments)),
                                    justify='center', font=('Caliber', 20))
        elif self.enemy.coor_segments[0] in self.player.coor_segments:
            self.game_over = True
            self.canvas.create_text(345, 315,
                                    text="Your enemy runs into you. What a jerk.\nGame over.\n"
                                         "Final score: {}\nPress 'r' to restart".format(len(self.player.segments)),
                                    justify='center', font=('Caliber', 20))

    def enemy_into_self(self):
        for coor_segment in self.enemy.coor_segments:
            if self.enemy.coor_segments.count(coor_segment) >= 2:
                for segment in self.enemy.segments:
                    self.canvas.delete(segment)
                self.snake_list.remove(self.enemy)
                self.enemy = Enemy(-600, -600, 'orchid', self.canvas)
                self.enemy.out = True
                self.enemy_text = self.canvas.create_text(345, 315,
                                                          text="Your enemy runs into himself.\n"
                                                               "He's kicked out of the game.",
                                                          justify='center', font=('Caliber', 20))
                self.canvas.after(2000, self.wipe)

    def enemy_into_wall(self):
        if self.enemy.x <= 30 or self.enemy.x >= 630 or self.enemy.y <= 30 or self.enemy.y >= 630:
            for segment in self.enemy.segments:
                self.canvas.delete(segment)
            self.snake_list.remove(self.enemy)
            self.enemy = Enemy(-600, -600, 'orchid', self.canvas)
            self.enemy.out = True
            self.enemy_text = self.canvas.create_text(345, 315,
                                                      text="Your enemy runs into a wall.\nHe's kicked out of the game.",
                                                      justify='center', font=('Caliber', 20))
            self.canvas.after(2000, self.wipe)

    def wipe(self):
        self.canvas.delete(self.enemy_text)


# ==========================================
# Purpose: represents the snake in the game
# Instance variables:
#   self.x: the x coordination of the center of the snake's head
#   self.y: the y coordination of the center of the snake's head
#   self.color: the color of the snake
#   self.canvas: represents the canvas on which the snake would be drawn
#   self.segments: records the id of the snake's segments
#   self.coor_segments: records the coordination information of every one of the snake's segments
#   self.new_id: represents the id of the snake's head at every turn
# Methods:
#   __init__: a constructor with four parameters (not counting self), that initializes the x, y, color, canvas,
#       segments, coor_segments, and new_id instance variables
#   update: at every turn, draw the current location of the snake's head on the canvas, add the id of the head to the
#       instance variable segments, and add the coordination information of the head to the instance variable
#       coor_segments
# ==========================================


class Snake:
    def __init__(self, xpos, ypos, color, canvas):
        self.x, self.y = xpos, ypos
        self.color = color
        self.canvas = canvas
        snake_id = canvas.create_rectangle(self.x - 15, self.y - 15, self.x + 15, self.y + 15,
                                           fill=self.color, outline=self.color)
        self.segments = []
        self.coor_segments = []
        self.segments.insert(0, snake_id)
        self.coor_segments.insert(0, self.canvas.coords(snake_id))
        self.new_id = -1

    def update(self):
        self.new_id = self.canvas.create_rectangle(self.x - 15, self.y - 15, self.x + 15, self.y + 15, fill=self.color,
                                                   outline=self.color)
        self.segments.insert(0, self.new_id)
        self.coor_segments.insert(0, self.canvas.coords(self.new_id))


# ==========================================
# Purpose: represents the player-controlled snake in the game
# Instance variables:
#   self.x: the x coordination of the center of the snake's head
#   self.y: the y coordination of the center of the snake's head
#   self.color: the color of the snake
#   self.canvas: represents the canvas on which the snake would be drawn
#   self.segments: records the id of the snake's segments
#   self.coor_segments: records the coordination information of every one of the snake's segments
#   self.new_id: represents the id of the snake's head at every turn
#   self.vx: represents how many pixel the snake would move in the x direction for one turn
#   self.vy: represents how many pixel the snake would move in the y direction for one turn
#   self.heading: represents the current heading of the snake
# Methods:
#   __init__: a constructor with four parameters (not counting self), that initializes the x, y, color, canvas,
#       segments, coor_segments, new_id, vx, vy, and heading instance variables
#   update: at every turn, draw the current location of the snake's head on the canvas, add the id of the head to the
#       instance variable segments, and add the coordination information of the head to the instance variable
#       coor_segments
#   move: move the snake's head according to the vx, vy, and call the update method to update the info
#   up: when 'up' key is pressed, if the snake is not heading down, change the heading to up
#   down: when 'down' key is pressed, if the snake is not heading up, change the heading to down
#   left: when 'left' key is pressed, if the snake is not heading right, change the heading to left
#   right: when 'right' key is pressed, if the snake is not heading left, change the heading to right
# ==========================================


class Player(Snake):
    def __init__(self, xpos, ypos, color, canvas):
        Snake.__init__(self, xpos, ypos, color, canvas)
        self.vx, self.vy = 30, 0
        self.heading = 'right'

    def move(self):
        self.x += self.vx
        self.y += self.vy
        self.update()

    def up(self, event):
        if not self.heading == 'down':
            self.vx = 0
            self.vy = -30
            self.heading = 'up'

    def down(self, event):
        if not self.heading == 'up':
            self.vx = 0
            self.vy = 30
            self.heading = 'down'

    def left(self, event):
        if not self.heading == 'right':
            self.vx = -30
            self.vy = 0
            self.heading = 'left'

    def right(self, event):
        if not self.heading == 'left':
            self.vx = 30
            self.vy = 0
            self.heading = 'right'


# ==========================================
# Purpose: represents the computer-controlled snake in the game
# Instance variables:
#   self.x: the x coordination of the center of the snake's head
#   self.y: the y coordination of the center of the snake's head
#   self.color: the color of the snake
#   self.canvas: represents the canvas on which the snake would be drawn
#   self.segments: records the id of the snake's segments
#   self.coor_segments: records the coordination information of every one of the snake's segments
#   self.new_id: represents the id of the snake's head at every turn
#   self.out: represents whether the enemy snake is out of the game (loses)
#   self.step: a dictionary, represents the distance the enemy snake would move for one turn, in a given direction
#   self.direction: a list, represents the direction the enemy snake could move and not lose the game
# Methods:
#   __init__: a constructor with four parameters (not counting self), that initializes the x, y, color, canvas,
#       segments, coor_segments, new_id, out, and step instance variables
#   update: at every turn, draw the current location of the snake's head on the canvas, add the id of the head to the
#       instance variable segments, and add the coordination information of the head to the instance variable
#       coor_segments
#   move: move the enemy snake towards the food, without running into itself or the wall
#   move_direction: determine in which directions the enemy snake could move, without running into itself or the wall
#   move_choice: determine which direction the enemy snake would choose to move
# ==========================================


class Enemy(Snake):
    def __init__(self, xpos, ypos, color, canvas):
        Snake.__init__(self, xpos, ypos, color, canvas)
        self.out = False
        self.step = {'up': [0, -30], 'left': [-30, 0], 'right': [30, 0], 'down': [0, 30]}

    def move(self, food):
        self.move_direction()
        if len(self.direction) == 0:
            self.y -= 30
        else:
            if self.x - food.x >= 0 and self.y - food.y > 0:
                self.move_choice(['up', 'left', 'right', 'down'])
            elif self.x - food.x < 0 and self.y - food.y >= 0:
                self.move_choice(['right', 'up', 'down', 'left'])
            elif self.x - food.x > 0 and self.y - food.y <= 0:
                self.move_choice(['left', 'down', 'up', 'right'])
            else:
                self.move_choice(['down', 'right', 'left', 'up'])
        self.update()

    def move_direction(self):
        no_move = []
        self.direction = []
        for segment in self.coor_segments:
            if (self.x - 45 == segment[0] and self.y - 15 == segment[1]) or self.x == 45:
                no_move.append('left')
            if (self.x - 15 == segment[0] and self.y - 45 == segment[1]) or self.y == 45:
                no_move.append('up')
            if (self.x - 15 == segment[0] and self.y + 15 == segment[1]) or self.y == 615:
                no_move.append('down')
            if (self.x + 15 == segment[0] and self.y - 15 == segment[1]) or self.x == 615:
                no_move.append('right')
        for direc in ['up', 'left', 'right', 'down']:
            if direc not in no_move:
                self.direction.append(direc)

    def move_choice(self, sequence):
        for direc in sequence:
            if direc in self.direction:
                self.x += self.step[direc][0]
                self.y += self.step[direc][1]
                return


# ==========================================
# Purpose: represents the food in the game
# Instance variables:
#   self.x: the x coordination of the center of the food
#   self.y: the y coordination of the center of the food
#   self.color: the color of the food
#   self.canvas: represents the canvas on which the food would be drawn
#   self.id: represents the id of the food
# Methods:
#   __init__: a constructor with one parameters (not counting self), that initializes the x, y, color, canvas, and id
#       instance variables
# ==========================================


class Food:
    def __init__(self, canvas):
        self.x = random.randint(1, 20) * 30 + 15
        self.y = random.randint(1, 20) * 30 + 15
        self.color = 'tomato'
        self.canvas = canvas
        radius = 12
        self.id = canvas.create_oval(self.x - radius, self.y - radius, self.x + radius, self.y + radius,
                                     fill=self.color,
                                     outline=self.color)


SnakeGUI()
tk.mainloop()
