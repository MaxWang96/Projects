import random


# ==========================================
# Purpose: Calculate the exponent (x to the power y) using only nested while loops and addition operator
# Input Parameter(s):
#   x: the number used in exponent
#   y: how many times to use x in the multiplication
# Return Value(s): the result of multiplying x for y times
# ==========================================

def expo(x, y):
    prod = 1
    i = 0
    while i < y:
        total = 0
        j = 0
        while j < x:
            total += prod
            j += 1
        prod = total
        i += 1
    return prod


# ==========================================
# Purpose: A single round of rock, paper, scissors played against the computer
# Input Parameter(s): None
# Return Value(s): 1 if the player won the round, 0 if it was a tie, -1 if the computer won
# ==========================================

def rps_round():
    user_move = input('Enter R, P, or S: ')
    while user_move not in ('R', 'P', 'S'):
        print('Invalid Input')
        user_move = input('Enter R, P, or S: ')
    comp_move = random.choice('RPS')
    print('Computer selects', comp_move)
    if (user_move == 'R' and comp_move == 'S') or \
            (user_move == 'S' and comp_move == 'P') or \
            (user_move == 'P' and comp_move == 'R'):
        print('Player wins!')
        return 1
    elif (user_move == 'S' and comp_move == 'R') or \
            (user_move == 'P' and comp_move == 'S') or \
            (user_move == 'R' and comp_move == 'P'):
        print('Computer wins!')
        return -1
    else:
        print('Tie!')
        return 0


# ==========================================
# Purpose:
#   Multiple rounds of rock, paper, scissors that end when either the player or the computer win
#   a certain number of rounds
# Input Parameter(s): num_wins: the number of wins required for either the player or the computer to win the game
# Return Value(s): 1 if the player won the game, -1 if the computer won
# ==========================================

def rps_game(num_wins):
    user_win = 0
    comp_win = 0
    while user_win < num_wins and comp_win < num_wins:
        result = rps_round()
        if result == 1:
            user_win += 1
        elif result == -1:
            comp_win += 1
        print('\nPlayer wins: {}\nComputer wins: {}\n'.format(user_win, comp_win))
    if user_win > comp_win:
        return 1
    else:
        return -1
