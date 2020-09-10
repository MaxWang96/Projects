# ==========================================
# Purpose: represents complex numbers
# Instance variables:
#   real: a numeric value representing the real component of the complex number
#   imag: a numeric value representing the imaginary component of the complex number
# Methods:
#   __init__: a constructor with two numeric parameters (not counting self), that initializes the real and imag instance
#       variables, respectively
#   get_real: return the value of instance variable real
#   get_imag: return the value of instance variable imag
#   set_real: change the value of instance variable real to the new value
#   set_imag: change the value of instance variable imag to the new value
#   __str__: overload the __str__ method to return a string of the format '{real} + {imag}i', where {real} and {imag}
#       represent the real and imaginary components of the complex number, respectively.
#   __add__: overload the + operator so it takes in a Complex object other, and returns a new Complex object
#       representing the sum of the complex numbers represented by self and other
#   __mul__: overload the * operator so it takes in a Complex object other, and returns a new Complex object
#       representing the product of the complex numbers represented by self and other
#   __eq__: overload the == operator so it takes in a Complex object other, and returns True if the two objects are
#       equal (their real components are equal, and their imaginary components are equal), or False otherwise
# ==========================================


class Complex:
    def __init__(self, real, imag):
        self.real = real
        self.imag = imag

    def get_real(self):
        return self.real

    def get_imag(self):
        return self.imag

    def set_real(self, new_real):
        self.real = new_real

    def set_imag(self, new_imag):
        self.imag = new_imag

    def __str__(self):
        return '{} + {}i'.format(self.real, self.imag)

    def __add__(self, other):
        return Complex(self.real + other.get_real(), self.imag + other.get_imag())

    def __mul__(self, other):
        return Complex(self.real * other.get_real() - self.imag * other.get_imag(),
                       self.real * other.get_imag() + self.imag * other.get_real())

    def __eq__(self, other):
        if self.real == other.get_real() and self.imag == other.get_imag():
            return True
        else:
            return False


# ==========================================
# Purpose: represents the information (name, category, store, price) of an item
# Instance variables:
#   name: represents the name of the item
#   price: represents the price of the item
#   category: represents what category the item belongs to (head, torso, legs, feet)
#   store: represents the name of the store that sells the item
# Methods:
#   __init__: a constructor with four parameters (not counting self), that initializes the name, price, category, store
#       instance variables
#   get_price: return the value of instance variable price
#   __str__: overload the __str__ method to return a string of the format '{}, {}, {}: ${}', where the four {} represent
#   the instance variables name, category, store, price, in that order
#   __lt__: overload the < operator so it takes in another Item object (other), and returns True if the left
#       operand (self) has a lower price than the right operand (other), or False otherwise
# ==========================================


class Item:
    def __init__(self, name, price, category, store):
        self.name = name
        self.price = price
        self.category = category
        self.store = store

    def get_price(self):
        return self.price

    def __str__(self):
        return '{}, {}, {}: ${}'.format(self.name, self.category, self.store, self.price)

    def __lt__(self, other):
        if self.price < other.get_price():
            return True
        else:
            return False


# ==========================================
# Purpose: represents the name of a store and the information about the items the store sells
# Instance variables:
#   name: represents the name of the store
#   items: a list of Item objects, represents every item in the store’s inventory
# Methods:
#   __init__: a constructor with two parameters (not counting self): name, representing the name of the store, filename,
#       representing the name of the CSV file to be read. It reads in the file, and initializes the name, items instance
#       variables
#   __str__: overload the __str__ method to return a string containing the name of the store, followed by the string
#       representation of each item in the self.items list, separated by newlines
# ==========================================


class Store:
    def __init__(self, name, filename):
        self.name = name
        self.items = []
        with open(filename) as fp:
            fp.readline()
            for line in fp:
                line = line.replace('\n', '')
                lst = line.split(',')
                item = Item(lst[0], float(lst[1]), lst[2], self.name)
                self.items.append(item)

    def __str__(self):
        output = self.name
        for item in self.items:
            output += '\n' + str(item)
        return output


# ==========================================
# Purpose: Find the cheapest item for each category across all stores
# Input Parameter(s):
#   store_list: a list of Store objects
# Return Value(s): a dictionary which has four key representing each category; the value of each key is an Item object
#   represents the cheapest item of the given category across stores
# ==========================================


def cheap_outfit(store_list):
    items_list = []
    sorted_dic = {}
    cheap_dic = {}
    for store in store_list:
        items_list += store.items
    for key in ['Head', 'Torso', 'Legs', 'Feet']:
        sorted_dic[key] = []
        for item in items_list:
            if item.category == key:
                sorted_dic[key].append(item)
        cheap_dic[key] = min(sorted_dic[key])
    return cheap_dic

