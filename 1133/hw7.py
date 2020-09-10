# ==========================================
# Purpose: Encrypt the input message using the Baconian Cipher encoding provided by the input string encoding
# Input Parameter(s):
#   message: the message to be encrypted
#   encoding: the Baconian Cipher code used to encrypt the message
# Return Value(s): the encrypted message
# ==========================================


def encrypt(message, encoding):
    new_message = [x.lower() for x in message if x.isalpha()]
    code_lst = [encoding[5 * i:5 * i + 5] for i in range(26)]
    encrypted_message = ''
    for ch in new_message:
        index = ord(ch) - 97
        encrypted_message += code_lst[index]
    return encrypted_message


# ==========================================
# Purpose: Decrypt the input message using the Baconian Cipher encoding provided by the input string encoding
# Input Parameter(s):
#   message: the message to be decrypted
#   encoding: the Baconian Cipher code used to decrypt the message
# Return Value(s): the decrypted message
# ==========================================


def decrypt(message, encoding):
    code_lst = [encoding[5 * i:5 * i + 5] for i in range(26)]
    split_message = [message[5 * i:5 * i + 5] for i in range(len(message) // 5)]
    decrypted_message = ''
    for code in split_message:
        letter = chr(code_lst.index(code) + ord('a'))
        decrypted_message += letter
    return decrypted_message


# ==========================================
# Purpose: Find the longest common substring of the two input strings (find the longest common DNA sequence)
# Input Parameter(s):
#   first: the first string (DNA sequences)
#   second: the second string (DNA sequences)
# Return Value(s):
#   If there is a common substring, return the longest common substring (DNA sequence); if there's no common substring,
#   return a empty string
# ==========================================


def longest_common(first, second):
    for i in range(len(first), 1, -1):
        for j in range(0, len(first) + 1 - i):
            if first[j:i + j] in second:
                return first[j:i + j]
    else:
        return ''


# ==========================================
# Purpose: Find the index of the first vowel in a single lowercase word with no punctuation
# Input Parameter(s): word: a single lowercase word with no punctuation
# Return Value(s):
#   If there are vowels in the word, return the index of the first vowel; if there's no vowel in the word, return -1
# ==========================================

def find_vowel(word):
    for ch in word:
        if ch in 'aeiou':
            return word.find(ch)
    else:
        return -1


# ==========================================
# Purpose: Translate a single lowercase word with no punctuation
# Input Parameter(s): word: a single lowercase word with no punctuation
# Return Value(s): the translated word
# ==========================================


def translate(word):
    vowel = find_vowel(word)
    if vowel >= 1:
        word = word[vowel:] + word[:vowel] + 'ay'
    elif vowel == 0:
        word += 'way'
    else:
        word += 'ay'
    return word


# ==========================================
# Purpose: Translate the word preserving its punctuation and capitalization
# Input Parameter(s): a single word
# Return Value(s): the translated word preserving its original punctuation and capitalization
# ==========================================


def transform(word):
    punctuation = ''
    cap = 0
    if word[-1] in ',.?!':
        punctuation = word[-1]
        word = word[:-1]
    if not word.islower():
        word = word.lower()
        cap = 1
    word = translate(word)
    if cap == 1:
        word = word.capitalize()
    word += punctuation
    return word


# ==========================================
# Purpose: Translate an entire phrase in English to Pig Latin
# Input Parameter(s): phrase: a string representing a phrase in English
# Return Value(s): the phrase translated into Pig Latin
# ==========================================


def igpay(phrase):
    return ' '.join([transform(word) for word in phrase.split()])
