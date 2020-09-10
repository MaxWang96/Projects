### Early Feedback for Homework 10 (THIS IS NOT YOUR GRADE, the assignment isn't due yet)

These tests are run on Monday and Tuesday nights around 10:00 PM, so if you didn't submit before then you can ignore this document

Passing these tests is not a guarantee of a perfect homework score: the tests do not check everything that the TAs will.

Any questions/errors with the Automated Feedback should be reported to Nathan Taylor: taylo740@umn.edu

Run on April 07, 23:24:01 PM.

+ Pass: Check that file "hw10.py" exists.

+ Pass: Import Test

+ Pass: Check that a Python file "hw10.py" has no syntax errors.

    Python file "hw10.py" has no syntax errors.



+ Pass: 
Check that the result of evaluating
   ```
   scrabble_score('a')
   ```
   matches the pattern `1`.

   




+ Pass: 
Check that the result of evaluating
   ```
   scrabble_score('quixotic')
   ```
   matches the pattern `26`.

   




+ Pass: 
Check that the result of evaluating
   ```
   scrabble_score('supercalifragilisticexpialidocious')
   ```
   matches the pattern `56`.

   




+ Pass: 
Check that the result of evaluating
   ```
   callable(gcd)
   ```
   matches the pattern `True`.

   




+ Pass: 
Check that the result of evaluating
   ```
   relatively_prime(547, 333)
   ```
   matches the pattern `True`.

   




+ Pass: 
Check that the result of evaluating
   ```
   relatively_prime(208, 608)
   ```
   matches the pattern `False`.

   




+ Pass: 
Check that the result of evaluating
   ```
   relatively_prime(1, 1)
   ```
   matches the pattern `True`.

   




+ Pass: 
Check that the result of evaluating
   ```
   find_filepath(['root', ['labs', 'lab1.txt', 'lab2.txt', 'lab3.txt'], ['hws'], ['plans', 'vacation.txt', ['evil', 'world_domination.txt']], 'resume.txt', 'cat.jpg'], 'cat.jpg')
   ```
   matches the pattern `'root/cat.jpg'`.

   




+ Pass: 
Check that the result of evaluating
   ```
   type(find_filepath(['root', ['labs', 'lab1.txt', 'lab2.txt', 'lab3.txt'], ['hws'], ['plans', 'vacation.txt', ['evil', 'world_domination.txt']], 'resume.txt', 'cat.jpg'], 'ion.txt'))
   ```
   matches the pattern `bool`.

   




+ Pass: 
Check that the result of evaluating
   ```
   find_filepath(['root', ['labs', 'lab1.txt', 'lab2.txt', 'lab3.txt'], ['hws'], ['plans', 'vacation.txt', ['evil', 'world_domination.txt']], 'resume.txt', 'cat.jpg'], 'ion.txt')
   ```
   matches the pattern `False`.

   




+ Pass: 
Check that the result of evaluating
   ```
   find_filepath(['Yusuf', ['Arthur', ['Eames', ['Limbo', 'inception.txt']]]], 'inception.txt')
   ```
   matches the pattern `'Yusuf/Arthur/Eames/Limbo/inception.txt'`.

   




