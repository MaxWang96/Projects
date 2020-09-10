def count_big(num_lst):
    if num_lst == []:
        return 0
    elif num_lst[0] > 99:
        return 1 + count_big(num_lst[1:])
    return 0 + count_big(num_lst[1:])


def two_big(lst_lst):
    if lst_lst == []:
        return 0
    return count_big(lst_lst[0]) + two_big(lst_lst[1:])


def to_indexes(string):
    dic = {}
    for i, letter in enumerate(string):
        if letter not in dic:
            dic[letter] = [i]
        else:
            dic[letter].append(i)
    return dic


class Lake:
    def __init__(self, name, area, depth):
        self.name = name
        self.area = area
        self.depth = depth

    def __str__(self):
        return '{} - Area: {}, Depth: {}'.format(self.name, self.area, self.depth)

    def __lt__(self, other):
        if self.area < other.area:
            return True
        return False


class House:
    def __init__(self, beds, baths, haunted):
        self.beds = beds
        self.baths = baths
        self.haunted = haunted

    def remove_ghosts(self):
        self.haunted = False

    def estimate_price(self):
        value = self.beds * 3000 + self.baths * 2000
        if self.haunted:
            return value // 2
        else:
            return value


class Mansion(House):
    def __init__(self, beds, baths):
        House.__init__(self, beds, baths, True)

    def remove_ghosts(self):
        print('Too spooky, call an expert')

    def estimate_price(self):
        return House.estimate_price(self) * 5


class Painting:
    def __init__(self, artist, area):
        self.artist = artist
        self.area = area

    def too_bulky(self):
        return self.area > 1000


class Sculpture:
    def __init__(self, artist, weight):
        self.artist = artist
        self.weight = weight

    def too_bulky(self):
        return self.weight > 500


def display_artist(artist, art_list):
    new_art_list = []
    for art in art_list:
        if art.artist == artist and not art.too_bulky():
            new_art_list.append(art)
    return new_art_list


def mystery(val):
    j = 5
    i = 1
    while i < val:
        j -= 1
        if j < 0:
            return 0
        i *= 10
    return j
