### Early Feedback for Homework 4 (THIS IS NOT YOUR GRADE, the assignment isn't due yet)

These tests are run on Monday and Tuesday nights some time after 10:00 PM, so if you didn't submit before then you can ignore this document

Passing these tests is not a guarantee of a perfect homework score: the tests do not check everything that the TAs will.

Any questions/errors with the Automated Feedback should be reported to Nathan Taylor: taylo740@umn.edu

Disclaimer on this week's test in particular: the testing script is not particularly good at handling user input problems.

You might get some very strange feedback on parts B or C if you call input the wrong number of total times or cause errors.

You may also fail tests if you are using random.choice('RPS') more than once per round, or using some other method to generate the computer's move, because of how the tests attempt to control the random seeding to predict results.

Run on February 18, 23:24:34 PM.

+ Pass: Check that file "hw4.py" exists.

+ Pass: Import Test

+ Pass: Check that a Python file "hw4.py" has no syntax errors.

    Python file "hw4.py" has no syntax errors.



+ Pass: 
Check that the result of evaluating
   ```
   expo(6,5) + expo(1,1)
   ```
   matches the pattern `7777`.

   




+ Pass: 
Check that the result of evaluating
   ```
   random.seed(8675309); rps_round()
   ```
   with user input sequence
   ```
   'P'
   ```
   matches the pattern `0`.

   




+ Pass: 
Check that the result of evaluating
   ```
   random.seed(9001); rps_round()
   ```
   with user input sequence
   ```
   'X', 'K', 'CD', 'S'
   ```
   matches the pattern `-1`.

   




+ Pass: 
Check that the result of evaluating
   ```
   random.seed(1585127); rps_round()
   ```
   with user input sequence
   ```
   'RP', 'RS', 'SP', 'SR', 'PS', 'PR', 'P'
   ```
   matches the pattern `1`.

   




+ Pass: 
Check that the result of evaluating
   ```
   random.seed(1585127); rps_game(3)
   ```
   with user input sequence
   ```
   'R', 'R', 'P', 'P', 'S', 'S', 'S'
   ```
   matches the pattern `-1`.

   




