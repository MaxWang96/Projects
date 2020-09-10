### Early Feedback for Homework 9 (THIS IS NOT YOUR GRADE, the assignment isn't due yet)

These tests are run on Monday and Tuesday nights around 10:00 PM, so if you didn't submit before then you can ignore this document

Passing these tests is not a guarantee of a perfect homework score: the tests do not check everything that the TAs will.

Any questions/errors with the Automated Feedback should be reported to Nathan Taylor: taylo740@umn.edu

Run on March 31, 23:06:58 PM.

+ Pass: Check that file "hw9.py" exists.

+ Pass: Import Test

+ Pass: Check that a Python file "hw9.py" has no syntax errors.

    Python file "hw9.py" has no syntax errors.



+ Pass: Writing hairspray.txt into local directory  
File Contents:
```
You can't stop an avalanche as it races down the hill .
You can try to stop the seasons girl but you know you never will .
And you can try to stop my dancin' feet but I just cannot stand still .
Cause the world keeps spinning round and round .
And my heart's keeping time to the speed of sound .
I was lost til I heard the drums then I found my way .
Cause you can't stop the beat .

```




+ Pass: 
Check that the result of evaluating
   ```
   combine({'a':2,'b':4}, {'c':6,'b':3})
   ```
   matches the pattern `{'a':2,'b':7,'c':6}`.

   




+ Pass: 
Check that the result of evaluating
   ```
   x = {'a':2,'b':4}; y = {'c':6,'b':3}; z = combine(x,y); x
   ```
   matches the pattern `{'a':2,'b':4}`.

   




+ Pass: 
Check that the result of evaluating
   ```
   x = {'a':2,'b':4}; y = {'c':6,'b':3}; z = combine(x,y); y
   ```
   matches the pattern `{'c':6,'b':3}`.

   




+ Pass: 
Check that the result of evaluating
   ```
   first_words('hairspray.txt')
   ```
   matches the pattern `{'You': 2, 'Cause': 2, 'I': 1, 'And': 2}`.

   




+ Pass: 
Check that the result of evaluating
   ```
   next_words('hairspray.txt')
   ```
   matches the pattern `{'was': {'lost': 1}, 'feet': {'but': 1}, 'races': {'down': 1}, 'then': {'I': 1}, 'lost': {'til': 1}, 'it': {'races': 1}, "heart's": {'keeping': 1}, 'drums': {'then': 1}, 'you': {'can': 1, "can't": 1, 'know': 1, 'never': 1}, 'sound': {'.': 1}, 'round': {'and': 1, '.': 1}, 'keeping': {'time': 1}, 'speed': {'of': 1}, 'And': {'you': 1, 'my': 1}, 'and': {'round': 1}, "can't": {'stop': 2}, 'know': {'you': 1}, 'Cause': {'the': 1, 'you': 1}, 'You': {'can': 1, "can't": 1}, "dancin'": {'feet': 1}, 'spinning': {'round': 1}, 'still': {'.': 1}, 'cannot': {'stand': 1}, 'found': {'my': 1}, 'time': {'to': 1}, 'beat': {'.': 1}, 'down': {'the': 1}, 'world': {'keeps': 1}, 'keeps': {'spinning': 1}, 'girl': {'but': 1}, 'stop': {'the': 2, 'an': 1, 'my': 1}, 'my': {"dancin'": 1, 'way': 1, "heart's": 1}, 'hill': {'.': 1}, 'but': {'you': 1, 'I': 1}, 'way': {'.': 1}, 'never': {'will': 1}, 'will': {'.': 1}, 'to': {'the': 1, 'stop': 2}, 'try': {'to': 2}, 'of': {'sound': 1}, 'stand': {'still': 1}, 'til': {'I': 1}, 'can': {'try': 2}, 'avalanche': {'as': 1}, 'just': {'cannot': 1}, 'the': {'hill': 1, 'world': 1, 'seasons': 1, 'drums': 1, 'speed': 1, 'beat': 1}, 'I': {'just': 1, 'was': 1, 'found': 1, 'heard': 1}, 'as': {'it': 1}, 'seasons': {'girl': 1}, 'an': {'avalanche': 1}, 'heard': {'the': 1}}`.

   




+ Pass: 
Check that the result of evaluating
   ```
   fanfic('hairspray.txt')
   ```
   could be produced from the source file.

   


   Your solution produced: 
```
 
I was lost til I was lost til I heard the hill .
Cause the world keeps spinning round and round and round and round and round and round and round and round .
I heard the speed of sound .
And you can't stop the seasons girl but you can try to stop the drums then I just cannot stand still .
I was lost til I found my way .
You can try to stop an avalanche as it races down the speed of sound .
You can try to the drums then I heard the hill .
You can't stop the seasons girl but you never will .
I was lost til I heard the world keeps spinning round .
And my dancin' feet but I just cannot stand still .
```




