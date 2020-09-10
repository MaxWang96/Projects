<<<<<<< HEAD
def addMatrix(matrix1, matrix2):
    matrix3 = []
    for y in range(len(matrix1)):
        lst = []
        for x in range(len(matrix1[0])):
            add_num = matrix1[y][x] + matrix2[y][x]
            lst.append(add_num)
        matrix3.append(lst)
    return matrix3


def countEs(str):
    count = 0
    for chr in str:
        if chr == 'e':
            count += 1
    return count


def minEs(lst):
    idx = 0
    min_e = countEs(lst[0])
    for index, str in enumerate(lst[1:]):
        num_e = countEs(str)
        print(num_e, min_e)
        print(index)
        if num_e < min_e:
            idx = index + 1
            min_e = num_e
            print(idx)
    return lst[idx]


def removeQuestionLines(filename):
    try:
        fp = open(filename)
        fp2 = open('no_questions_' + filename, 'w')
        count = 0
        for line in fp:
            if line.find('?') == -1:
                fp2.write(line)
            else:
                count += 1
        fp.close()
        fp2.close()
        return count
    except FileNotFoundError:
        return -1


def triples(filename):
    fp = open(filename)
    triple = []
    for line in fp:
        lst = line.split(',')
        lst[-1] = lst[-1][:-1]
    for str_num in lst:
        occurence = lst.count(str_num)
        if occurence >= 3 and triple.count(int(str_num)) == 0:
            triple.append(int(str_num))
    fp.close()
    return triple
=======
def addMatrix(matrix1, matrix2):
    matrix3 = []
    for y in range(len(matrix1)):
        lst = []
        for x in range(len(matrix1[0])):
            add_num = matrix1[y][x] + matrix2[y][x]
            lst.append(add_num)
        matrix3.append(lst)
    return matrix3


def countEs(str):
    count = 0
    for chr in str:
        if chr == 'e':
            count += 1
    return count


def minEs(lst):
    idx = 0
    min_e = countEs(lst[0])
    for index, str in enumerate(lst[1:]):
        num_e = countEs(str)
        print(num_e, min_e)
        print(index)
        if num_e < min_e:
            idx = index + 1
            min_e = num_e
            print(idx)
    return lst[idx]


def removeQuestionLines(filename):
    try:
        fp = open(filename)
        fp2 = open('no_questions_' + filename, 'w')
        count = 0
        for line in fp:
            if line.find('?') == -1:
                fp2.write(line)
            else:
                count += 1
        fp.close()
        fp2.close()
        return count
    except FileNotFoundError:
        return -1


def triples(filename):
    fp = open(filename)
    triple = []
    for line in fp:
        lst = line.split(',')
        lst[-1] = lst[-1][:-1]
    for str_num in lst:
        occurence = lst.count(str_num)
        if occurence >= 3 and triple.count(int(str_num)) == 0:
            triple.append(int(str_num))
    fp.close()
    return triple
>>>>>>> 1cbdcd02ce46f684640ab9eb915d2abde01ff1c2
