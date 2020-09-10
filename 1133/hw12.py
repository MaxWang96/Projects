# ==========================================
# Purpose: represents a base character template for all of the specialization classes to build off of
# Instance variables:
#   self.name: represents the name of the Adventurer
#   self.level: represents the level of the Adventurer
#   self.strength: represents the strength of the Adventurer
#   self.speed: represents the speed of the Adventurer
#   self.power: represents the power of the Adventurer
#   self.HP: represents the HP of the Adventurer, initialized to the Adventurer’s level multiplied by 6
#   self.hidden: represents whether the Adventurer is currently hiding, initialized to False
# Methods:
#   __init__: a constructor with five parameters (not counting self), that initializes the self.name, self.level,
#       self.strength, self.speed, self.power, self.HP, self.hidden instance variables
#   __repr__: override the __repr__ method to return a string of the format '{} - HP: {}', where the two {} represent
#       the instance variables self.name, self.HP, in that order
#   attack: takes another Adventurer object target as a parameter. If the target is hidden, print a sentence indicating
#       that; otherwise, deduct the HP of the target by the amount of damage and print the corresponding sentence
#   __lt__: overload the < operator so it takes in another Adventurer object (other), and returns True if the left
#       operand (self) has a lower HP than the right operand (other), or False otherwise
# ==========================================


class Adventurer:
    def __init__(self, name, level, strength, speed, power):
        self.name = name
        self.level = level
        self.strength = strength
        self.speed = speed
        self.power = power
        self.HP = self.level * 6
        self.hidden = False

    def __repr__(self):
        return '{} - HP: {}'.format(self.name, self.HP)

    def attack(self, target):
        if target.hidden:
            print("{} can't see {}".format(self.name, target.name))
        else:
            damage = self.strength + 4
            target.HP -= damage
            print('{} attacks {} for {} damage'.format(self.name, target.name, damage))

    def __lt__(self, other):
        if self.HP < other.HP:
            return True
        else:
            return False


# ==========================================
# Purpose: represents the Thief specialization for an Adventurer
# Instance variables:
#   self.name: represents the name of the Adventurer
#   self.level: represents the level of the Adventurer
#   self.strength: represents the strength of the Adventurer
#   self.speed: represents the speed of the Adventurer
#   self.power: represents the power of the Adventurer
#   self.HP: represents the HP of the Adventurer, initialized to the Adventurer’s level multiplied by 8
#   self.hidden: represents whether the Adventurer is currently hiding, initialized to True
# Methods:
#   __init__: a constructor with five parameters (not counting self), that initializes the self.name, self.level,
#       self.strength, self.speed, self.power, self.HP, self.hidden instance variables
#   __repr__: override the __repr__ method to return a string of the format '{} - HP: {}', where the two {} represent
#       the instance variables self.name, self.HP, in that order
#   attack: takes another Adventurer object target as a parameter. If the Adventurer (self) is hidden, performs the
#       thief attack; otherwise, performs the normal attack
#   __lt__: overload the < operator so it takes in another Adventurer object (other), and returns True if the left
#       operand (self) has a lower HP than the right operand (other), or False otherwise
# ==========================================


class Thief(Adventurer):
    def __init__(self, name, level, strength, speed, power):
        Adventurer.__init__(self, name, level, strength, speed, power)
        self.HP = self.level * 8
        self.hidden = True

    def attack(self, target):
        if self.hidden:
            damage = (self.speed + self.level) * 5
            target.HP -= damage
            self.hidden, target.hidden = False, False
            print('{} sneak attacks {} for {} damage'.format(self.name, target.name, damage))
        else:
            Adventurer.attack(self, target)


# ==========================================
# Purpose: represents the Ninja specialization for an Adventurer, which is a more powerful version of a Thief
# Instance variables:
#   self.name: represents the name of the Adventurer
#   self.level: represents the level of the Adventurer
#   self.strength: represents the strength of the Adventurer
#   self.speed: represents the speed of the Adventurer
#   self.power: represents the power of the Adventurer
#   self.HP: represents the HP of the Adventurer, initialized to the Adventurer’s level multiplied by 8
#   self.hidden: represents whether the Adventurer is currently hiding, initialized to True
# Methods:
#   __init__: a constructor with five parameters (not counting self), that initializes the self.name, self.level,
#       self.strength, self.speed, self.power, self.HP, self.hidden instance variables
#   __repr__: override the __repr__ method to return a string of the format '{} - HP: {}', where the two {} represent
#       the instance variables self.name, self.HP, in that order
#   attack: takes another Adventurer object target as a parameter. Performs the same attack as a Thief does, except
#       that after every attack, the attacker becomes hidden again, and gains an amount of HP equal to their level
#   __lt__: overload the < operator so it takes in another Adventurer object (other), and returns True if the left
#       operand (self) has a lower HP than the right operand (other), or False otherwise
# ==========================================

class Ninja(Thief):
    def attack(self, target):
        Thief.attack(self, target)
        self.hidden = True
        self.HP += self.level


# ==========================================
# Purpose: represents the Mage specialization for an Adventurer
# Instance variables:
#   self.name: represents the name of the Adventurer
#   self.level: represents the level of the Adventurer
#   self.strength: represents the strength of the Adventurer
#   self.speed: represents the speed of the Adventurer
#   self.power: represents the power of the Adventurer
#   self.HP: represents the HP of the Adventurer, initialized to the Adventurer’s level multiplied by 6
#   self.hidden: represents whether the Adventurer is currently hiding, initialized to False
#   self.fireballs_left: represents how many fireballs the Adventurer has left, initialized to equal to the power of the
#       Adventurer
# Methods:
#   __init__: a constructor with five parameters (not counting self), that initializes the self.name, self.level,
#       self.strength, self.speed, self.power, self.HP, self.hidden, self.fireballs_left instance variables
#   __repr__: override the __repr__ method to return a string of the format '{} - HP: {}', where the two {} represent
#       the instance variables self.name, self.HP, in that order
#   attack: takes another Adventurer object target as a parameter. If the Adventurer (self) has no fireballs left,
#       performs a normal attack; otherwise, performs a fireball attack
#   __lt__: overload the < operator so it takes in another Adventurer object (other), and returns True if the left
#       operand (self) has a lower HP than the right operand (other), or False otherwise
# ==========================================


class Mage(Adventurer):
    def __init__(self, name, level, strength, speed, power):
        Adventurer.__init__(self, name, level, strength, speed, power)
        self.fireballs_left = self.power

    def attack(self, target):
        if self.fireballs_left == 0:
            Adventurer.attack(self, target)
        else:
            damage = self.level * 3
            target.HP -= damage
            target.hidden = False
            self.fireballs_left -= 1
            print('{} casts fireball on {} for {} damage'.format(self.name, target.name, damage))


# ==========================================
# Purpose: represents the Wizard specialization for an Adventurer, which is a more powerful version of a Mage
# Instance variables:
#   self.name: represents the name of the Adventurer
#   self.level: represents the level of the Adventurer
#   self.strength: represents the strength of the Adventurer
#   self.speed: represents the speed of the Adventurer
#   self.power: represents the power of the Adventurer
#   self.HP: represents the HP of the Adventurer, initialized to the Adventurer’s level multiplied by 4
#   self.hidden: represents whether the Adventurer is currently hiding, initialized to False
#   self.fireballs_left: represents how many fireballs the Adventurer has left, initialized to two times the power of
#       the Adventurer
# Methods:
#   __init__: a constructor with five parameters (not counting self), that initializes the self.name, self.level,
#       self.strength, self.speed, self.power, self.HP, self.hidden, self.fireballs_left instance variables
#   __repr__: override the __repr__ method to return a string of the format '{} - HP: {}', where the two {} represent
#       the instance variables self.name, self.HP, in that order
#   attack: takes another Adventurer object target as a parameter. If the Adventurer (self) has no fireballs left,
#       performs a normal attack; otherwise, performs a fireball attack
#   __lt__: overload the < operator so it takes in another Adventurer object (other), and returns True if the left
#       operand (self) has a lower HP than the right operand (other), or False otherwise
# ==========================================

class Wizard(Mage):
    def __init__(self, name, level, strength, speed, power):
        Mage.__init__(self, name, level, strength, speed, power)
        self.HP = self.level * 4
        self.fireballs_left = self.power * 2


# ==========================================
# Purpose:
#   a system that allows two teams of Adventures battle each other team. One team is controlled by the user, the other
#   is controlled by the computer
# Input Parameter(s):
#   player_list: a list of Adventurer objects (or objects from classes derived from Adventurer), controlled by the
#   player
#   enemy_list: a list of Adventurer objects (or objects from classes derived from Adventurer), controlled by the
#   computer
# Return Value(s): If the player wins, returns the player’s list of remaining Adventurer objects; if the computer wins,
#   returns the computer’s list of remaining Adventurer objects
# ==========================================

def battle(player_list, enemy_list):
    while player_list != [] and enemy_list != []:
        print('\nPlayer Turn!\n')
        print('Your team:')
        [print(adventurer) for adventurer in player_list]
        for adventurer in player_list:
            print()
            [print('Enemy {}: {}'.format(i + 1, enemy)) for i, enemy in enumerate(enemy_list)]
            target_num = int(input('Choose a target for {}: '.format(adventurer.name)))
            target = enemy_list[target_num - 1]
            adventurer.attack(target)
            if target.HP <= 0:
                enemy_list.remove(target)
                print('{} was defeated!'.format(target.name))
                if not enemy_list:
                    print('You win!')
                    return player_list
        print('\nEnemy Turn!\n')
        for enemy in enemy_list:
            target = min(player_list)
            enemy.attack(target)
            if target.HP <= 0:
                player_list.remove(target)
                print('{} was defeated!'.format(target.name))
                if not player_list:
                    print('You lose!')
                    return enemy_list
