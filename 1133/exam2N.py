def findq(str_list):
    count = 0
    for str in str_list:
        if 'q' in str or 'Q' in str:
            count += 1
    return count


def long_lists(nested_list):
    new_list = []
    for lst in nested_list:
        if len(lst) >= 3:
            new_list.append(lst)
    return new_list


def parens_split(phrase):
    phrase = phrase.replace(')', '(')
    phrase = phrase.split('(')
    lst = []
    for idx, string in enumerate(phrase):
        if idx % 2 == 1:
            lst.append(string)
    return lst


def get1_3(filename):
    try:
        fp = open(filename)
        first_row = fp.readline()
        fp.close()
        lst = first_row.split(',')
        return int(lst[2])
    except FileNotFoundError:
        return 0


def remove_t(fname):
    fp = open(fname)
    fp_2 = open('no_t_' + fname, 'w')
    text = fp.read()
    text_no_t = text.replace('t', '')
    fp_2.write(text_no_t)
    fp.close()
    fp_2.close()
    return
