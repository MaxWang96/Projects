# Max Wang
# wang9436
import math


# ==========================================
# Purpose: Transform the vertices to rotate the x, y coordinates by 90 degrees
# Input Parameter(s): line: a string that either represents a list of vertices or faces
# Return Value(s): if the input represents vertices, return the transformed vertices; if the input represents faces,
#   return the faces without any change
# ==========================================


def rotate(line):
    if line[0] == 'v':
        vertices_lst = line.split()
        x, y = float(vertices_lst[1]), float(vertices_lst[2])
        x_rotated = x * math.cos(math.pi / 2) + y * math.sin(math.pi / 2)
        y_rotated = y * math.cos(math.pi / 2) + x * math.sin(math.pi / 2)
        vertices_lst[1], vertices_lst[2] = str(x_rotated), str(y_rotated)
        return ' '.join(vertices_lst)
    else:
        return line


# ==========================================
# Purpose: reads a OBJ file specified by the parameter fname_in, rotate the model in the file by 90 degrees, and save
#   the transformed model to a file specified by the parameter fname_out
# Input Parameter(s):
#   fname_in: the specified OBJ file to read
#   fname_out: the specified file to save
# Return Value(s): if fname_in does not exist, return -1; otherwise, return 0
# ==========================================


def rotate_model(fname_in, fname_out):
    try:
        fp_in = open(fname_in)
        fp_out = open(fname_out, 'w')
        for line in fp_in:
            fp_out.write(rotate(line) + '\n')
        fp_in.close()
        fp_out.close()
        return 0
    except FileNotFoundError:
        return -1


# B. Part 1: get_data_list
# ==========================================
# Purpose:
#   Extract the data from a CSV file as a list of rows
# Input Parameter(s):
#   fname is a string representing the name of a file
# Return Value:
#   Returns a list of every line in that file (a list of strings)
#   OR returns -1 if the file does not exist
# ==========================================
def get_data_list(fname):
    try:
        data_lst = []
        fp = open(fname)
        for line in fp.readlines():
            data_lst.append(line)
        fp.close()
        return data_lst
    except FileNotFoundError:
        return -1


# print(get_data_list('guild1.csv'))


# B. Part 2: get_col_index
# ==========================================
# Purpose:
#   Determine which column stores a specific value
# Input Parameter(s):
#   row1_str is a string containing the first row of data
#   (the column titles) in the CSV file
#	col_title is a string containing the column title
# Return Value:
#   Returns the index of the column specified by col_title
#   OR returns -1 if there is no column found
# ==========================================
def get_col_index(row1_str, col_title):
    try:
        title_list = row1_str.split(',')
        return title_list.index(col_title)
    except ValueError:
        return -1


# B. Part 3: convert_dkp
# ==========================================
# Purpose:
#   Covert the DKP in your row string to the new system
# Input Parameter(s):
#   row_str is a string containing any row of data from the CSV file
#   idx is an index for the column you want to alter
# Return Value:
#   Returns a string identical to row_str, except with the column
#   at the given index changed to the new DKP (as a string)
# ==========================================
def convert_dkp(row_str, idx):
    # Hint: Use .split and .join
    row_lst = row_str.split(',')
    row_lst[idx] = str(float(row_lst[idx]) * 13.7)
    return ','.join(row_lst)


# B. Part 4: merge_guild
# ==========================================
# Purpose:
#   Alters a DKP CSV file to convert DKP after a guild merger
# Input Parameter(s):
#   fname is the file name of the DKP file
# Return Value:
#   Returns False if the file isn't open
#   Returns False if the file doesn't contain 'DKP' and 'Original Guild' columns
#   Otherwise, returns True
# ==========================================
def merge_guild(fname):
    # Hints:
    #   Use get_data_list to read in the rows from the file
    #   Use get_col_index to determine which column you need to change
    #   Use get_col_index to determine which column contains the guild name
    #   Write back each row unchanged if it does not belong
    #   to a former member of the Lions of Casterly Rock
    #   If it does belong to a Lion, use convert_dkp to create an
    #   altered row string to write to the file instead
    #   Be sure to close the file
    rows_lst = get_data_list(fname)
    if rows_lst == -1:
        return False
    fp = open(fname, 'w')
    DKP_idx = get_col_index(rows_lst[0], 'DKP')
    guild_idx = get_col_index(rows_lst[0], 'Original Guild')
    if DKP_idx == -1 or guild_idx == -1:
        return False
    fp.write(rows_lst[0])
    for member_data in rows_lst[1:]:
        data_lst = member_data.split(',')
        if data_lst[guild_idx] == 'Lions of Casterly Rock':
            fp.write(convert_dkp(member_data, DKP_idx))
        else:
            fp.write(member_data)
    fp.close()
    return True