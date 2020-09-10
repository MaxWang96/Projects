import turtle, platform, math


# TODO: Fill out the Purpose, Input Parameter(s), and Return Value
# for each of the two functions below in comments, and then write
# additional functions for parts B and C, and fill out the same information
# for those functions as well.

# Remember, you must place a # before any comment, or it will be
# interpreted as Python code, and will probably cause errors.

# cents
# ==========================================
# Purpose:
#   Computes quarters, dimes, nickels, and pennies into cents
# Input Parameter(s):
#   quarters - The number of quarters to compute
#   dimes - The number of dimes to compute
#   nickels - The number of nickels to compute
#   pennies - The number of pennies to compute
# Return Value:
#   Total cents computed from quarters, dimes, nickels, and pennies
# ==========================================

def cents(quarters, dimes, nickels, pennies):
    total = 0
    total += quarters * 25
    total += dimes * 10
    total += nickels * 5
    total += pennies
    return total


# draw_M
# ==========================================
# Purpose:
#   Draws the logo of University of Minnesota using turtle graphics
# Input Parameter(s):
#   None
# Return Value:
#   None
# ==========================================

def draw_M():
    turtle.delay(0)
    turtle.bgcolor("gold")
    turtle.hideturtle()
    turtle.color("maroon")
    turtle.penup()
    turtle.setpos(-200, -100)
    turtle.pendown()
    turtle.begin_fill()
    turtle.forward(120)
    turtle.left(90)
    turtle.forward(64)
    turtle.left(90)
    turtle.forward(20)
    turtle.right(120)
    turtle.forward(80)
    turtle.right(120)
    turtle.forward(28)
    turtle.right(120)
    turtle.forward(14)
    turtle.left(90)
    turtle.forward(64)
    turtle.left(90)
    turtle.forward(128)
    turtle.left(90)
    turtle.forward(64)
    turtle.left(90)
    turtle.forward(14)
    turtle.right(120)
    turtle.forward(28)
    turtle.right(120)
    turtle.forward(80)
    turtle.right(120)
    turtle.forward(20)
    turtle.left(90)
    turtle.forward(64)
    turtle.left(90)
    turtle.forward(120)
    turtle.left(90)
    turtle.forward(64)
    turtle.left(90)
    turtle.forward(28)
    turtle.right(60)
    turtle.forward(140)
    turtle.right(120)
    turtle.forward(20)
    turtle.left(90)
    turtle.forward(64)
    turtle.left(90)
    turtle.forward(120)
    turtle.left(90)
    turtle.forward(64)
    turtle.left(90)
    turtle.forward(20)
    turtle.right(120)
    turtle.forward(52)
    turtle.right(120)
    turtle.forward(52)
    turtle.right(120)
    turtle.forward(20)
    turtle.left(90)
    turtle.forward(64)
    turtle.left(90)
    turtle.forward(120)
    turtle.left(90)
    turtle.forward(64)
    turtle.left(90)
    turtle.forward(20)
    turtle.right(120)
    turtle.forward(140)
    turtle.right(60)
    turtle.forward(28)
    turtle.left(90)
    turtle.forward(64)
    turtle.end_fill()


# Part B: star8
# ==========================================
# Purpose:
#   Draws an 8-pointed star using turtle graphics
# Input Parameter(s):
#   None
# Return Value:
#   None
# ==========================================

def star8():
    turtle.speed(0)
    turtle.forward(200)
    turtle.left(135)
    turtle.forward(200)
    turtle.left(135)
    turtle.forward(200)
    turtle.left(135)
    turtle.forward(200)
    turtle.left(135)
    turtle.forward(200)
    turtle.left(135)
    turtle.forward(200)
    turtle.left(135)
    turtle.forward(200)
    turtle.left(135)
    turtle.forward(200)
    turtle.left(135)


# Part C: trajectory
# ==========================================
# Purpose:
#   Computes and prints initial horizontal speed, initial vertical speed, and flight time of the ball using physics
#   Computes the distance the ball travels using physics
# Input Parameter(s):
#   height - The initial height at which the ball is thrown, in meters
#   speed - The initial speed at which the ball is thrown, in meters/second
#   angles - The angle at which the ball is thrown relative to the horizontal ground plane, in degrees
# Return Value:
#   The distance travelled, in meters
# ==========================================

def trajectory(height, speed, angle):
    radius = angle * math.pi / 180
    horizontal_speed = speed * math.cos(radius)
    vertical_speed = speed * math.sin(radius)
    time = (vertical_speed + math.sqrt(vertical_speed ** 2 + 19.6 * height)) / 9.8
    travel_distance = horizontal_speed * time
    horizontal_speed = round(horizontal_speed, 3)
    vertical_speed = round(vertical_speed, 3)
    time = round(time, 3)
    print('Horizontal speed: {} m/s'.format(horizontal_speed))
    print('Vertical speed: {} m/s'.format(vertical_speed))
    print('Flight time: {} s'.format(time))
    return round(travel_distance, 3)
