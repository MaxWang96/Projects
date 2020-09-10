### Early Feedback for Homework 11 (THIS IS NOT YOUR GRADE, the assignment isn't due yet)

These tests are run on Monday and Tuesday nights around 10:00 PM, so if you didn't submit before then you can ignore this document

Passing these tests is not a guarantee of a perfect homework score: the tests do not check everything that the TAs will.

Any questions/errors with the Automated Feedback should be reported to Nathan Taylor: taylo740@umn.edu

Run on April 15, 02:43:30 AM.

+ Pass: Check that file "hw11.py" exists.

+ Pass: Import Test

+ Pass: Check that a Python file "hw11.py" has no syntax errors.

    Python file "hw11.py" has no syntax errors.



+ Pass: Writing high_noon.csv into local directory  
File Contents:
```
Item Name,Item Price,Item Category
Cowboy Hat,9.99,Head
Blue Petticoat,11.72,Legs
Spiked Leather Boots,45.23,Feet
Beige Vest,59.89,Torso
Purple Bonnet,5.27,Head

```




+ Pass: Writing mawwiage.csv into local directory  
File Contents:
```
Item Name,Item Price,Item Category
White Tuxedo,613.25,Torso
Hoop Skirt,11.71,Legs
Top Hat,46.49,Head
Green Suspenders,24.19,Torso
Periwinkle Veil,68.46,Head

```




+ Pass: Writing platinum_disco.csv into local directory  
File Contents:
```
Item Name,Item Price,Item Category
Tie-Dye Headband,17.88,Head
Go Go Boots,31.59,Feet
Bell-Bottom Jeans,59.66,Legs

```




+ Pass: 
Check that the result of evaluating
   ```
   Complex(4,3).get_real()
   ```
   matches the pattern `4`.

   




+ Pass: 
Check that the result of evaluating
   ```
   Complex(-4,12).get_imag()
   ```
   matches the pattern `12`.

   




+ Pass: 
Check that the result of evaluating
   ```
   a = Complex(2,7); a.set_real(5); a.real
   ```
   matches the pattern `5`.

   




+ Pass: 
Check that the result of evaluating
   ```
   a = Complex(3,0); a.set_imag(-8); a.imag
   ```
   matches the pattern `-8`.

   




+ Pass: 
Check that the result of evaluating
   ```
   str(Complex(6,77))
   ```
   matches the pattern `'6 + 77i'`.

   




+ Pass: 
Check that the result of evaluating
   ```
   (Complex(-1,6) + Complex(5,-9)).real
   ```
   matches the pattern `4`.

   




+ Pass: 
Check that the result of evaluating
   ```
   (Complex(-1,6) + Complex(5,-9)).imag
   ```
   matches the pattern `-3`.

   




+ Pass: 
Check that the result of evaluating
   ```
   (Complex(-1,6) * Complex(5,-9)).real
   ```
   matches the pattern `49`.

   




+ Pass: 
Check that the result of evaluating
   ```
   (Complex(-1,6) * Complex(5,-9)).imag
   ```
   matches the pattern `39`.

   




+ Pass: 
Check that the result of evaluating
   ```
   (Complex(-1,6) == Complex(-1,6))
   ```
   matches the pattern `True`.

   




+ Pass: 
Check that the result of evaluating
   ```
   Item('Cowboy Hat', 9.99, 'Head', 'High Noon').name
   ```
   matches the pattern `'Cowboy Hat'`.

   




+ Pass: 
Check that the result of evaluating
   ```
   Item('Cowboy Hat', 9.99, 'Head', 'High Noon').category
   ```
   matches the pattern `'Head'`.

   




+ Pass: 
Check that the result of evaluating
   ```
   9.98 < Item('Cowboy Hat', 9.99, 'Head', 'High Noon').price < 10.0
   ```
   matches the pattern `True`.

   




+ Pass: 
Check that the result of evaluating
   ```
   Item('Cowboy Hat', 9.99, 'Head', 'High Noon').store
   ```
   matches the pattern `'High Noon'`.

   




+ Pass: 
Check that the result of evaluating
   ```
   str(Item('Cowboy Hat', 9.99, 'Head', 'High Noon'))
   ```
   matches the pattern `'Cowboy Hat, Head, High Noon: $9.99'`.

   




+ Pass: 
Check that the result of evaluating
   ```
   Item('Cowboy Hat', 9.99, 'Head', 'High Noon') < Item('Crinoline', 80.12, 'Legs', 'Mawwiage')
   ```
   matches the pattern `True`.

   




+ Pass: 
Check that the result of evaluating
   ```
   Store('High Noon','high_noon.csv').name
   ```
   matches the pattern `'High Noon'`.

   




+ Pass: 
Check that the result of evaluating
   ```
   len(Store('High Noon','high_noon.csv').items)
   ```
   matches the pattern `5`.

   




+ Pass: 
Check that the result of evaluating
   ```
   type(Store('High Noon','high_noon.csv').items[0].price)
   ```
   matches the pattern `float`.

   




+ Pass: 
Check that the result of evaluating
   ```
   [item.name for item in Store('Platinum Disco', 'platinum_disco.csv').items]
   ```
   matches the pattern `['Tie-Dye Headband', 'Go Go Boots', 'Bell-Bottom Jeans']`.

   




+ Pass: 
Check that the result of evaluating
   ```
   str(Store('Platinum Disco', 'platinum_disco.csv')).strip()
   ```
   matches the pattern `'Platinum Disco\nTie-Dye Headband, Head, Platinum Disco: $17.88\nGo Go Boots, Feet, Platinum Disco: $31.59\nBell-Bottom Jeans, Legs, Platinum Disco: $59.66'`.

   




+ Pass: 
Check that the result of evaluating
   ```
   cheap_outfit([Store('Platinum Disco', 'platinum_disco.csv'), Store('High Noon', 'high_noon.csv'), Store('Mawwiage', 'mawwiage.csv')])['Head'].name
   ```
   matches the pattern `'Purple Bonnet'`.

   




+ Pass: 
Check that the result of evaluating
   ```
   cheap_outfit([Store('Platinum Disco', 'platinum_disco.csv'), Store('High Noon', 'high_noon.csv'), Store('Mawwiage', 'mawwiage.csv')])['Torso'].name
   ```
   matches the pattern `'Green Suspenders'`.

   




+ Pass: 
Check that the result of evaluating
   ```
   cheap_outfit([Store('Platinum Disco', 'platinum_disco.csv'), Store('High Noon', 'high_noon.csv'), Store('Mawwiage', 'mawwiage.csv')])['Legs'].name
   ```
   matches the pattern `'Hoop Skirt'`.

   




+ Pass: 
Check that the result of evaluating
   ```
   cheap_outfit([Store('Platinum Disco', 'platinum_disco.csv'), Store('High Noon', 'high_noon.csv'), Store('Mawwiage', 'mawwiage.csv')])['Feet'].name
   ```
   matches the pattern `'Go Go Boots'`.

   




