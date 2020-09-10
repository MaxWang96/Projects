<<<<<<< HEAD
import random


# ==========================================
# Purpose:
#   Takes two dictionaries and combines them. If a key was in both dictionaries, the value would be the sum of the
#   values for that key.
# Input Parameter(s):
#   d1: dictionary 1
#   d2: dictionary 2
# Return Value(s): the combined dictionary
# ==========================================


def combine(d1, d2):
    dSum = {}
    set1, set2 = set(d1), set(d2)
    intersection = set1.intersection(set2)
    difference = set1.symmetric_difference(set2)
    for key in intersection:
        dSum[key] = d1[key] + d2[key]
    for key in difference:
        if key in d1:
            dSum[key] = d1[key]
        else:
            dSum[key] = d2[key]
    return dSum


# ==========================================
# Purpose:
#   Create a dictionary that records the frequency of the appearance of each first words in the sentences
# Input Parameter(s):
#   fname: the name of the file to be read
# Return Value(s): the dictionary that records the frequency
# ==========================================


def first_words(fname):
    with open(fname) as fp:
        dic = {}
        for line in fp:
            lst = line.split(' ')
            if lst[0] not in dic:
                dic[lst[0]] = 1
            else:
                dic[lst[0]] += 1
        return dic


# ==========================================
# Purpose:
#   Create a dictionary that records which words (or '.') and how many times they follow a certain word.
# Input Parameter(s):
#   fname: the name of the file to be read
# Return Value(s): the dictionary that keeps the records
# ==========================================


def next_words(fname):
    with open(fname) as fp:
        dic = {}
        text = fp.read()
        text_lst = text.replace('\n', ' ').split()
        for i, value in enumerate(text_lst):
            if value != '.':
                if text_lst[i] not in dic:
                    dic[text_lst[i]] = {}
                if text_lst[i + 1] not in dic[text_lst[i]]:
                    dic[text_lst[i]][text_lst[i + 1]] = 1
                else:
                    dic[text_lst[i]][text_lst[i + 1]] += 1
        return dic


# ==========================================
# Purpose:
#   Produces nonsense that somewhat resembles coherent English
# Input Parameter(s):
#   fname: the name of the file to be read
# Return Value(s): None
# ==========================================


def fanfic(fname):
    dic_first = first_words(fname)
    dic_next = next_words(fname)
    weight_first = []
    for key in dic_first:
        weight_first.append(dic_first[key])
    for i in range(10):
        first_type_lst = random.choices(list(dic_first), weight_first)
        first = first_type_lst[0]
        weight_next = []
        for key in dic_next[first]:
            weight_next.append(dic_next[first][key])
        next_type_lst = random.choices(list(dic_next[first]), weight_next)
        next = next_type_lst[0]
        sentence = first + ' ' + next
        while next != '.':
            weight_next = []
            for key in dic_next[next]:
                weight_next.append(dic_next[next][key])
            next_type_lst = random.choices(list(dic_next[next]), weight_next)
            next = next_type_lst[0]
            sentence += ' ' + next
        print(sentence)
    return
=======
import random


# ==========================================
# Purpose:
#   Takes two dictionaries and combines them. If a key was in both dictionaries, the value would be the sum of the
#   values for that key.
# Input Parameter(s):
#   d1: dictionary 1
#   d2: dictionary 2
# Return Value(s): the combined dictionary
# ==========================================


def combine(d1, d2):
    dSum = {}
    set1, set2 = set(d1), set(d2)
    intersection = set1.intersection(set2)
    difference = set1.symmetric_difference(set2)
    for key in intersection:
        dSum[key] = d1[key] + d2[key]
    for key in difference:
        if key in d1:
            dSum[key] = d1[key]
        else:
            dSum[key] = d2[key]
    return dSum


# ==========================================
# Purpose:
#   Create a dictionary that records the frequency of the appearance of each first words in the sentences
# Input Parameter(s):
#   fname: the name of the file to be read
# Return Value(s): the dictionary that records the frequency
# ==========================================


def first_words(fname):
    with open(fname) as fp:
        dic = {}
        for line in fp:
            lst = line.split(' ')
            if lst[0] not in dic:
                dic[lst[0]] = 1
            else:
                dic[lst[0]] += 1
        return dic


# ==========================================
# Purpose:
#   Create a dictionary that records which words (or '.') and how many times they follow a certain word.
# Input Parameter(s):
#   fname: the name of the file to be read
# Return Value(s): the dictionary that keeps the records
# ==========================================


def next_words(fname):
    with open(fname) as fp:
        dic = {}
        text = fp.read()
        text_lst = text.replace('\n', ' ').split()
        for i, value in enumerate(text_lst):
            if value != '.':
                if text_lst[i] not in dic:
                    dic[text_lst[i]] = {}
                if text_lst[i + 1] not in dic[text_lst[i]]:
                    dic[text_lst[i]][text_lst[i + 1]] = 1
                else:
                    dic[text_lst[i]][text_lst[i + 1]] += 1
        return dic


# ==========================================
# Purpose:
#   Produces nonsense that somewhat resembles coherent English
# Input Parameter(s):
#   fname: the name of the file to be read
# Return Value(s): None
# ==========================================


def fanfic(fname):
    dic_first = first_words(fname)
    dic_next = next_words(fname)
    weight_first = []
    for key in dic_first:
        weight_first.append(dic_first[key])
    for i in range(10):
        first_type_lst = random.choices(list(dic_first), weight_first)
        first = first_type_lst[0]
        weight_next = []
        for key in dic_next[first]:
            weight_next.append(dic_next[first][key])
        next_type_lst = random.choices(list(dic_next[first]), weight_next)
        next = next_type_lst[0]
        sentence = first + ' ' + next
        while next != '.':
            weight_next = []
            for key in dic_next[next]:
                weight_next.append(dic_next[next][key])
            next_type_lst = random.choices(list(dic_next[next]), weight_next)
            next = next_type_lst[0]
            sentence += ' ' + next
        print(sentence)
    return
>>>>>>> 99df6439bd43b9f1ceb48995e85bb1a1a862ca9a
