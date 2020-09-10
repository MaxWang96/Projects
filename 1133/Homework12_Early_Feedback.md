### Early Feedback for Homework 12 (THIS IS NOT YOUR GRADE, the assignment isn't due yet)

These tests are run on Monday and Tuesday nights around 10:00 PM, so if you didn't submit before then you can ignore this document

Note that due to the nature of Homework 12, the tests for this week are very minimal

Any questions/errors with the Automated Feedback should be reported to Nathan Taylor: taylo740@umn.edu

Run on April 22, 00:07:10 AM.

+ Pass: Check that file "hw12.py" exists.

+ Pass: Import Test

+ Pass: Check that a Python file "hw12.py" has no syntax errors.

    Python file "hw12.py" has no syntax errors.



+ Pass: 
Check that the result of evaluating
   ```
   Adventurer('Dora',5,3,4,2).name
   ```
   matches the pattern `'Dora'`.

   




+ Pass: 
Check that the result of evaluating
   ```
   Adventurer('Dora',5,3,4,2).level
   ```
   matches the pattern `5`.

   




+ Pass: 
Check that the result of evaluating
   ```
   Adventurer('Dora',5,3,4,2).strength
   ```
   matches the pattern `3`.

   




+ Pass: 
Check that the result of evaluating
   ```
   Adventurer('Dora',5,3,4,2).speed
   ```
   matches the pattern `4`.

   




+ Pass: 
Check that the result of evaluating
   ```
   Adventurer('Dora',5,3,4,2).power
   ```
   matches the pattern `2`.

   




+ Pass: 
Check that the result of evaluating
   ```
   Adventurer('Dora',5,3,4,2).HP
   ```
   matches the pattern `30`.

   




+ Pass: 
Check that the result of evaluating
   ```
   Adventurer('Dora',5,3,4,2).hidden
   ```
   matches the pattern `False`.

   




+ Pass: 
Check that the result of evaluating
   ```
   repr(Adventurer('Dora',5,3,4,2))
   ```
   matches the pattern `'Dora - HP: 30'`.

   




+ Pass: 
Check that the result of evaluating
   ```
   kenobi = Adventurer('Obi-Wan',13,3,5,7); skywalker = Adventurer('Anakin',12,6,6,4); skywalker.attack(kenobi); kenobi.HP
   ```
   matches the pattern `68`.

   




+ Pass: 
Check that the result of evaluating
   ```
   kenobi = Adventurer('Obi-Wan',13,3,5,7); skywalker = Adventurer('Anakin',12,6,6,4); skywalker.attack(kenobi); skywalker.attack(kenobi); kenobi.HP
   ```
   matches the pattern `58`.

   




+ Pass: 
Check that the result of evaluating
   ```
   tiger = Adventurer('Tony',5,2,4,1); cena = Adventurer('John',8,6,5,2); cena.hidden = True; tiger.attack(cena); cena.HP
   ```
   matches the pattern `48`.

   




+ Pass: 
Check that the result of evaluating
   ```
   Mage('Vivi',16,20,14,16).level
   ```
   matches the pattern `16`.

   




+ Pass: 
Check that the result of evaluating
   ```
   Mage('Vivi',16,20,14,16).strength
   ```
   matches the pattern `20`.

   




+ Pass: 
Check that the result of evaluating
   ```
   Mage('Vivi',16,20,14,16).speed
   ```
   matches the pattern `14`.

   




+ Pass: 
Check that the result of evaluating
   ```
   Mage('Vivi',16,20,14,16).power
   ```
   matches the pattern `16`.

   




+ Pass: 
Check that the result of evaluating
   ```
   Mage('Vivi',16,20,14,16).HP
   ```
   matches the pattern `96`.

   




+ Pass: 
Check that the result of evaluating
   ```
   Mage('Vivi',16,20,14,16).hidden
   ```
   matches the pattern `False`.

   




+ Pass: 
Check that the result of evaluating
   ```
   Mage('Vivi',16,20,14,16).fireballs_left
   ```
   matches the pattern `16`.

   




+ Pass: 
Check that the result of evaluating
   ```
   isinstance(Mage('Vivi',16,20,14,16), Adventurer)
   ```
   matches the pattern `True`.

   




+ Pass: 
Check that the result of evaluating
   ```
   isinstance(Mage('Vivi',16,20,14,16), Thief)
   ```
   matches the pattern `False`.

   




+ Pass: 
Check that the result of evaluating
   ```
   Thief('Haley',16,12,22,14).HP
   ```
   matches the pattern `128`.

   




+ Pass: 
Check that the result of evaluating
   ```
   Thief('Haley',16,12,22,14).hidden
   ```
   matches the pattern `True`.

   




+ Pass: 
Check that the result of evaluating
   ```
   isinstance(Thief('Haley',16,12,22,14), Adventurer)
   ```
   matches the pattern `True`.

   




+ Pass: 
Check that the result of evaluating
   ```
   isinstance(Thief('Haley',16,12,22,14), Mage)
   ```
   matches the pattern `False`.

   




+ Pass: 
Check that the result of evaluating
   ```
   Ninja('Therkla',14,16,20,12).HP
   ```
   matches the pattern `112`.

   




+ Pass: 
Check that the result of evaluating
   ```
   Ninja('Therkla',14,16,20,12).hidden
   ```
   matches the pattern `True`.

   




+ Pass: 
Check that the result of evaluating
   ```
   isinstance(Ninja('Therkla',14,16,20,12), Thief)
   ```
   matches the pattern `True`.

   




+ Pass: 
Check that the result of evaluating
   ```
   Wizard('Vaarsuvius',16,8,12,20).HP
   ```
   matches the pattern `64`.

   




+ Pass: 
Check that the result of evaluating
   ```
   Wizard('Vaarsuvius',16,8,12,20).hidden
   ```
   matches the pattern `False`.

   




+ Pass: 
Check that the result of evaluating
   ```
   Wizard('Vaarsuvius',16,8,12,20).fireballs_left
   ```
   matches the pattern `40`.

   




+ Pass: 
Check that the result of evaluating
   ```
   isinstance(Wizard('Vaarsuvius',16,8,12,20), Mage)
   ```
   matches the pattern `True`.

   




+ Pass: 
Check that the result of evaluating
   ```
   b2 = Adventurer('2B',10,8,5,2); s9 = Thief('9S',3,2,6,4); b2.attack(s9); s9.HP
   ```
   matches the pattern `24`.

   




+ Pass: 
Check that the result of evaluating
   ```
   b2 = Adventurer('2B',10,8,5,2); s9 = Thief('9S',3,2,6,4); b2.attack(s9); s9.hidden
   ```
   matches the pattern `True`.

   




+ Pass: 
Check that the result of evaluating
   ```
   b2 = Adventurer('2B',10,8,5,2); s9 = Thief('9S',3,2,6,4); s9.attack(b2); b2.HP
   ```
   matches the pattern `15`.

   




+ Pass: 
Check that the result of evaluating
   ```
   b2 = Adventurer('2B',10,8,5,2); s9 = Thief('9S',3,2,6,4); s9.attack(b2); b2.attack(s9); s9.HP
   ```
   matches the pattern `12`.

   




+ Pass: 
Check that the result of evaluating
   ```
   b2 = Adventurer('2B',10,8,5,2); s9 = Ninja('9S',3,2,6,4); s9.attack(b2); b2.attack(s9); s9.HP
   ```
   matches the pattern `27`.

   




+ Pass: 
Check that the result of evaluating
   ```
   a2 = Mage('A2',6,4,3,1); s9 = Thief('9S',3,2,6,4); a2.attack(s9); s9.HP
   ```
   matches the pattern `6`.

   




+ Pass: 
Check that the result of evaluating
   ```
   s9 = Thief('9S',3,2,6,4); s9.attack(s9); s9.HP
   ```
   matches the pattern `-21`.

   




+ Pass: 
Check that the result of evaluating
   ```
   a2 = Mage('A2',6,4,3,1); s9 = Thief('9S',3,2,6,4); a2.attack(s9); a2.attack(s9); s9.HP
   ```
   matches the pattern `-2`.

   




+ Pass: 
Check that the result of evaluating
   ```
   a2 = Mage('A2',6,4,3,1); s9 = Thief('9S',3,2,6,4); a2.attack(s9); a2.attack(s9); a2.fireballs_left
   ```
   matches the pattern `0`.

   




+ Pass: 
Check that the result of evaluating
   ```
   a2 = Wizard('A2',6,4,3,3); s9 = Thief('9S',3,2,6,4); a2.attack(s9); a2.attack(s9); a2.fireballs_left
   ```
   matches the pattern `4`.

   




+ Pass: 
Check that the result of evaluating
   ```
   a2 = Mage('A2',6,4,3,1); s9 = Thief('9S',3,2,6,4); s9.attack(a2); a2.HP
   ```
   matches the pattern `-9`.

   




+ Pass: 
Check that the result of evaluating
   ```
   a2 = Mage('A2',6,4,3,1); s9 = Thief('9S',3,2,6,4); a2.attack(s9); s9.attack(a2); a2.HP
   ```
   matches the pattern `30`.

   




+ Pass: 
Check that the result of evaluating
   ```
   a2 = Mage('A2',6,4,3,1); s9 = Thief('9S',3,2,6,4); a2.attack(s9); s9.attack(a2); s9.HP
   ```
   matches the pattern `6`.

   




+ Pass: 
Check that the result of evaluating
   ```
   a2 = Mage('A2',6,4,3,1); s9 = Thief('9S',3,2,6,4); a2.attack(s9); s9.attack(a2); s9.hidden
   ```
   matches the pattern `False`.

   




+ Pass: 
Check that the result of evaluating
   ```
   a2 = Mage('A2',6,4,3,1); s9 = Ninja('9S',3,2,6,4); a2.attack(s9); s9.attack(a2); s9.HP
   ```
   matches the pattern `9`.

   




+ Pass: 
Check that the result of evaluating
   ```
   a2 = Mage('A2',6,4,3,1); s9 = Ninja('9S',3,2,6,4); a2.attack(s9); s9.attack(a2); s9.hidden
   ```
   matches the pattern `True`.

   




+ Pass: 
Check that the result of evaluating
   ```
   battle([Mage('Eno',7,1,3,2),Thief('Owt',4,6,1,9)],[Wizard('Xis',10,7,2,9), Ninja('Ruof',5,1,10,3)])[0].name
   ```
   with user input sequence
   ```
   1, 1, 1, 1, 'The battle should be over by this point'
   ```
   matches the pattern `'Ruof'`.

   




+ Pass: 
Check that the result of evaluating
   ```
   battle([Mage('Eno',7,1,3,2),Thief('Owt',4,6,1,9)],[Wizard('Xis',10,7,2,9), Ninja('Ruof',5,1,10,3)])[0].name
   ```
   with user input sequence
   ```
   2, 2, 1, 1, 1, 1, 'The battle should be over by this point'
   ```
   matches the pattern `'Eno'`.

   




+ Pass: 
Check that the result of evaluating
   ```
   battle([Mage('Eno',7,1,3,2),Thief('Owt',4,6,1,9)],[Wizard('Xis',10,7,2,9), Ninja('Ruof',5,1,10,3)])[0].name
   ```
   with user input sequence
   ```
   1, 2, 2, 1, 'The battle should be over by this point'
   ```
   matches the pattern `'Xis'`.

   




+ Pass: 
Check that the result of evaluating
   ```
   battle([Adventurer('Anakin',12,6,6,4), Adventurer('Obi-Wan',13,3,5,7), Mage('Vivi',16,20,14,16),Ninja('Therkla',14,16,20,12)], [Adventurer('Tony',5,2,4,1), Adventurer('John',8,6,5,2),  Thief('Haley',16,12,22,14), Wizard('Vaarsuvius',16,8,12,20) ])[0].name
   ```
   with user input sequence
   ```
   4, 4, 4, 2, 2, 2, 2, 1, 1, 'The battle should be over by this point'
   ```
   matches the pattern `'Obi-Wan'`.

   




