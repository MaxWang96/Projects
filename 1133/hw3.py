# ==========================================
# Purpose: Prints out 'Who needs loops?' 121 times in a row, once per line
# Input Parameter(s): None
# Return Value(s): None
# ==========================================
def print_121():
    print_60()
    print_60()
    print('Who needs loops?')


# ==========================================
# Purpose: Prints out 'Who needs loops?' 60 times in a row, once per line
# Input Parameter(s): None
# Return Value(s): None
# ==========================================
def print_60():
    print_12()
    print_12()
    print_12()
    print_12()
    print_12()


# ==========================================
# Purpose: Prints out 'Who needs loops?' 12 times in a row, once per line
# Input Parameter(s): None
# Return Value(s): None
# ==========================================
def print_12():
    print_3()
    print_3()
    print_3()
    print_3()


# ==========================================
# Purpose: Prints out 'Who needs loops?' 3 times in a row, once per line
# Input Parameter(s): None
# Return Value(s): None
# ==========================================
def print_3():
    print('Who needs loops?')
    print('Who needs loops?')
    print('Who needs loops?')


# ==========================================
# Purpose: Describes the background and lets the user make choices
# Input Parameter(s):
#   text - the prompt for a choice
#   optionA - possible option A
#   optionB - possible option B
#   optionC - possible option C
# Return Value(s):
#   The string that represents the user's choice (A, B, or C)
#   If the user doesn't choose one of the options, it would return 'A'
# ==========================================
def choice(text, optionA, optionB, optionC):
    print(text, '\n')
    print('A. {}'.format(optionA))
    print('B. {}'.format(optionB))
    print('C. {}'.format(optionC))
    x = input('Choose A, B, or C: ')
    if x == 'A' or x == 'B' or x == 'C':
        return x
    else:
        print('Invalid option, defaulting to A')
        return 'A'


# ==========================================
# Purpose: Gives the user a sequence of choices which simulates a Apex Legends game
# Input Parameter(s): None
# Return Value(s): True if the user reached a Good ending, False if the user reached a Bad ending
# ==========================================
def adventure():
    decision_tracker = 1
    decision1 = choice('You are the jump master this time, pick your landing place',
                       'Campsite',
                       'Let your teammate become jump master',
                       'The Tree')
    if decision1 == 'A':
        decision_tracker = 2
    elif decision1 == 'B':
        print('\nYour teammate lands your team into the City alongside 5 other teams. '
              'Your team is eliminated in massive gunfight.')
        return False
    else:
        decision_tracker = 3
    if decision_tracker == 2:
        decision2 = choice("\nYou are at the Campsite! And there's another team! What do you do?",
                           "Don't loot and sucker punch the enemy",
                           'Get a gun and fight',
                           'Stick with your teammates')
        if decision2 == 'A':
            print('\nYou punch the enemy twice but are knocked down by her teammate. '
                  'Your teammates are also eliminated. '
                  'But you had good fun!')
            return True
        elif decision2 == 'B':
            decision_tracker = 4
        else:
            decision_tracker = 3
    if decision_tracker == 3:
        decision3 = choice('\nYou got some good loot and eliminated some other teams, '
                           'But you forgot the circle is closing. '
                           'Now you need to run.',
                           'Run on foot',
                           'Use the zip line',
                           'Use the jump tower')
        if decision3 == 'A':
            print("\nOops, it's harder than you thought. You died in the circle.")
            return False
        elif decision3 == 'B':
            decision_tracker = 4
        else:
            print('\nYou run into the two last teams fighting each other. '
                  'You eliminated both of them without a sweat. '
                  '\nYou are the Apex Champion!')
            return True
    if decision_tracker == 4:
        decision4 = choice('\nYou have been through a lot and now there is only one other team. '
                           'You find them pushing towards your team.',
                           'Use your long-range weapons to shoot them',
                           'Tell your teammate to attack them from different locations',
                           'Wait for them to get close and then fight')
        if decision4 == 'A' or decision4 == 'B':
            print('\nYou catch them off guard! They are eliminated within 10 seconds.'
                  '\nYou are the Apex Champion!')
            return True
        else:
            print('\nWow. They are fully equipped with close-range weapons. They wiped your team out brutally.')
            return False
