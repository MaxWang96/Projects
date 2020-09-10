# ==========================================
# Purpose:
#   Calculate the Scrabble score of the word
# Input Parameter(s):
#   word: a string, the word used for calculation
# Return Value(s):
#   if the input is an empty string, return 0; otherwise, return the score of the first letter in the
#   word and the returned value of the calculation for the rest of the word
# ==========================================


def scrabble_score(word):
    scores = {'a': 1, 'b': 3, 'c': 3, 'd': 2, 'e': 1,
              'f': 4, 'g': 2, 'h': 4, 'i': 1, 'j': 8, 'k': 5, 'l': 1,
              'm': 3, 'n': 1, 'o': 1, 'p': 3, 'q': 10, 'r': 1, 's': 1,
              't': 1, 'u': 1, 'v': 4, 'w': 4, 'x': 8, 'y': 4, 'z': 10}
    if word == '':
        return 0
    else:
        return scrabble_score(word[1:]) + scores[word[0]]


# ==========================================
# Purpose:
#   A helper function that uses recursion to find the greatest common divisor of parameter x, y
# Input Parameter(s):
#   x: the first positive integer to check
#   y: the second positive integer to check
#   n: the number used to divides both x and y
# Return Value(s):
#   if n equals to 0, return False;
#   then, if x and y can both be divided by n AND n equals to 1, return True;
#   otherwise, if x and y can both be divided by n but n is not equal to 1, return False;
#   In other situations, return the returned value of gcd(x, y, n-1)
# ==========================================


def gcd(x, y, n):
    if n == 0:
        return False
    elif x % n == 0 and y % n == 0:
        if n == 1:
            return True
        else:
            return False
    else:
        return gcd(x, y, n - 1)


# ==========================================
# Purpose:
#   A function that checks whether two integers are relatively prime
# Input Parameter(s):
#   x: the first positive integer to check
#   y: the second positive integer to check
# Return Value(s):
#   return the returned value of helper function gcd(y, abs(x - y), min(y, abs(x - y)))
# ==========================================


def relatively_prime(x, y):
    return gcd(y, abs(x - y), min(y, abs(x - y)))


# ==========================================
# Purpose:
#   A function that finds the path of a file
# Input Parameter(s):
#   directory: a list, represents a file folder system
#   filename: a string, the name of the file to be found
# Return Value(s):
#   if the file is not found, return False; if the file is found, return the path
# ==========================================


def find_filepath(directory, filename):
    for key in directory:
        if key == filename:
            return directory[0] + '/' + key
        elif type(key) == list:
            result = find_filepath(key, filename)
            if result:
                return directory[0] + '/' + result
    return False
=======
# ==========================================
# Purpose:
#   Calculate the Scrabble score of the word
# Input Parameter(s):
#   word: a string, the word used for calculation
# Return Value(s):
#   if the input is an empty string, return 0; otherwise, return the score of the first letter in the
#   word and the returned value of the calculation for the rest of the word
# ==========================================


def scrabble_score(word):
    scores = {'a': 1, 'b': 3, 'c': 3, 'd': 2, 'e': 1,
              'f': 4, 'g': 2, 'h': 4, 'i': 1, 'j': 8, 'k': 5, 'l': 1,
              'm': 3, 'n': 1, 'o': 1, 'p': 3, 'q': 10, 'r': 1, 's': 1,
              't': 1, 'u': 1, 'v': 4, 'w': 4, 'x': 8, 'y': 4, 'z': 10}
    if word == '':
        return 0
    else:
        return scrabble_score(word[1:]) + scores[word[0]]


# ==========================================
# Purpose:
#   A helper function that uses recursion to find the greatest common divisor of parameter x, y
# Input Parameter(s):
#   x: the first positive integer to check
#   y: the second positive integer to check
#   n: the number used to divides both x and y
# Return Value(s):
#   if n equals to 0, return False;
#   then, if x and y can both be divided by n AND n equals to 1, return True;
#   otherwise, if x and y can both be divided by n but n is not equal to 1, return False;
#   In other situations, return the returned value of gcd(x, y, n-1)
# ==========================================


def gcd(x, y, n):
    if n == 0:
        return False
    elif x % n == 0 and y % n == 0:
        if n == 1:
            return True
        else:
            return False
    else:
        return gcd(x, y, n - 1)


# ==========================================
# Purpose:
#   A function that checks whether two integers are relatively prime
# Input Parameter(s):
#   x: the first positive integer to check
#   y: the second positive integer to check
# Return Value(s):
#   return the returned value of helper function gcd(y, abs(x - y), min(y, abs(x - y)))
# ==========================================


def relatively_prime(x, y):
    if x == 1 and y == 1:
        return True
    else:
        return gcd(y, abs(x - y), min(y, abs(x - y)))


# ==========================================
# Purpose:
#   A function that finds the path of a file
# Input Parameter(s):
#   directory: a list, represents a file folder system
#   filename: a string, the name of the file to be found
# Return Value(s):
#   if the file is not found, return False; if the file is found, return the path
# ==========================================


def find_filepath(directory, filename):
    for key in directory:
        if key == filename:
            return directory[0] + '/' + key
        elif type(key) == list:
            result = find_filepath(key, filename)
            if result:
                return directory[0] + '/' + result
    return False
