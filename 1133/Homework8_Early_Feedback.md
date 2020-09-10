### Early Feedback for Homework 8 (THIS IS NOT YOUR GRADE, the assignment isn't due yet)

These tests are run on Monday and Tuesday nights around 10:00 PM, so if you didn't submit before then you can ignore this document

Passing these tests is not a guarantee of a perfect homework score: the tests do not check everything that the TAs will.

Any questions/errors with the Automated Feedback should be reported to Nathan Taylor: taylo740@umn.edu

Run on March 24, 22:28:57 PM.

+ Pass: Check that file "hw8.py" exists.

+ Pass: Import Test

+ Pass: Check that a Python file "hw8.py" has no syntax errors.

    Python file "hw8.py" has no syntax errors.



+ Pass: Writing pyramid.obj into local directory  
File Contents:
```
v -2.0 5.0 3.0
v 8.0 6.0 6.0
v -10.0 12.0 9.0
v 7.0 -5.0 9.0

f 1 2 3
f 3 2 1
f 1 2 4
f 1 4 2
f 1 3 4
f 1 4 3
f 2 3 4
f 2 4 3

```




+ Pass: 
Check that the result of evaluating
   ```
   rotate_model('nope.obj','out.obj')
   ```
   matches the pattern `-1`.

   




+ Pass: 
Check that the result of evaluating
   ```
   rotate_model('pyramid.obj','result.obj')
   ```
   matches the pattern `0`.

   




+ Pass: Check that file "result.obj" exists.

+ Pass: Checking that contents of result.obj
```
v 5.0 -1.9999999999999998 3.0
v 6.000000000000001 8.0 6.0
v 12.0 -10.0 9.0
v -5.0 7.0 9.0


f 1 2 3

f 3 2 1

f 1 2 4

f 1 4 2

f 1 3 4

f 1 4 3

f 2 3 4

f 2 4 3


```
match the pattern:
```
v 5.0 -2.0 3.0
v 6.0 8.0 6.0
v 12.0 -10.0 9.0
v -5.0 7.0 9.0

f 1 2 3
f 3 2 1
f 1 2 4
f 1 4 2
f 1 3 4
f 1 4 3
f 2 3 4
f 2 4 3

```




+ Pass: Writing guild8.csv into local directory  
File Contents:
```
Fake DKP column,DKP,Original Guild,Destined for Greatness,Character Name
30,2000,Lions of Casterly Rock 2: Electric Boogaloo,Yes,Lucy
20,0,Fake Guild,Yes,Edmund
10,4,Lions of Casterly Rock,Yes,Peter
20,100,Lions of Casterly Rock,No,Susan

```




+ Pass: 
Check that the result of evaluating
   ```
   get_data_list('guild6.csv')
   ```
   matches the pattern `-1`.

   




+ Pass: 
Check that the result of evaluating
   ```
   get_data_list('guild8.csv')
   ```
   matches the pattern `['Fake DKP column,DKP,Original Guild,Destined for Greatness,Character Name\n','30,2000,Lions of Casterly Rock 2: Electric Boogaloo,Yes,Lucy\n','20,0,Fake Guild,Yes,Edmund\n','10,4,Lions of Casterly Rock,Yes,Peter\n','20,100,Lions of Casterly Rock,No,Susan\n']`.

   




+ Pass: 
Check that the result of evaluating
   ```
   get_col_index('Fake DKP column,DKP,Original Guild,Destined for Greatness,Character Name\n', 'DKP')
   ```
   matches the pattern `1`.

   




+ Pass: 
Check that the result of evaluating
   ```
   get_col_index('Even though,one of the entries,contains it,Original Guild is not,an entry here\n', 'Original Guild')
   ```
   matches the pattern `-1`.

   




+ Pass: 
Check that the result of evaluating
   ```
   convert_dkp('0,1,Fake Name,Yes\n',1)
   ```
   matches the pattern `'0,13.7,Fake Name,Yes\n'`.

   




+ Pass: 
Check that the result of evaluating
   ```
   convert_dkp('overwriting 0.0,with 0.0,should,do,nothing,0.0,\n',5)
   ```
   matches the pattern `'overwriting 0.0,with 0.0,should,do,nothing,0.0,\n'`.

   




+ Pass: 
Check that the result of evaluating
   ```
   merge_guild('guild6.csv')
   ```
   matches the pattern `False`.

   




+ Pass: 
Check that the result of evaluating
   ```
   merge_guild('guild8.csv')
   ```
   matches the pattern `True`.

   




+ Pass: Checking that contents of guild8.csv
```
Fake DKP column,DKP,Original Guild,Destined for Greatness,Character Name
30,2000,Lions of Casterly Rock 2: Electric Boogaloo,Yes,Lucy
20,0,Fake Guild,Yes,Edmund
10,54.8,Lions of Casterly Rock,Yes,Peter
20,1370.0,Lions of Casterly Rock,No,Susan

```
match the pattern:
```
Fake DKP column,DKP,Original Guild,Destined for Greatness,Character Name
30,2000,Lions of Casterly Rock 2: Electric Boogaloo,Yes,Lucy
20,0,Fake Guild,Yes,Edmund
10,54.8,Lions of Casterly Rock,Yes,Peter
20,1370.0,Lions of Casterly Rock,No,Susan

```




