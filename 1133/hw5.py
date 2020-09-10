# ==========================================
# Purpose: Converts the notes with inputted steps
# Input Parameter(s):
#   notes: a list of strings, each of which represents one of the 12 possible musical notes
#   up: an integer, how many steps in the scale the notes should be shifted
# Return Value(s): a new list of strings, represents the converted notes
# ==========================================


def convert(notes, up):
    scale = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
    notes_number = []
    converted_notes = []
    for note in notes:
        notes_number.append((scale.index(note) + up) % 12)
    for note_number in notes_number:
        converted_notes.append(scale[note_number])
    return converted_notes


# ==========================================
# Purpose: Print all sets of three distinct integers in num_lst that sum to target and return the total number
# of distinct combinations
# Input Parameter(s):
#   num_lst: a list of distinct integers
#   target: an integer, the targeted value that the sum of three integers in num_lst should equal to
# Return Value(s): the total number of distinct combinations found that sum to the target
# ==========================================


def triple_sum(num_lst, target):
    length = len(num_lst)
    count = 0
    for i in range(length):
        for j in range(i + 1, length):
            for k in range(j + 1, length):
                if num_lst[i] + num_lst[k] + num_lst[j] == target:
                    print('{} + {} + {} = {}'.format(num_lst[i], num_lst[k], num_lst[j], target))
                    count += 1
    return count


# ==========================================
# Purpose: Arranges names in a order that all names at odd positions do not contain letters 's' or 'z'
# Input Parameter(s): names_list: a list of strings, the names list that will be read at the graduation ceremony
# Return Value(s): If it's possible to rearrange the list to move all names that contain 's' or 'z' to even positions,
# the function would return the new list that is rearranged; if it's impossible to do so, it would return an empty list
# ==========================================


def no_front_teeth(names_list):
    readable = []
    not_readable = []
    new_list = []
    for name in names_list:
        if ('s' not in name) and ('z' not in name) and ('S' not in name) and ('Z' not in name):
            readable.append(name)
        else:
            not_readable.append(name)
    if len(readable) >= len(not_readable):
        count_readable = 0
        count_not_readable = 0
        length_not_readable = len(not_readable)
        for i in range(len(names_list)):
            if count_not_readable < length_not_readable:
                if i % 2 == 0:
                    new_list.append(readable[count_readable])
                    count_readable += 1
                else:
                    new_list.append(not_readable[count_not_readable])
                    count_not_readable += 1
            else:
                new_list.append(readable[count_readable])
                count_readable += 1
        return new_list
    else:
        print('Mission impossible: too many unpronounceable names')
        return []
