# Budget

An budget app that predicts where the expenses are made.

![](budget.gif)

Budget is a JavaScript toy app that implements a [KNN](https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm) to predict where the expense is being made. 

It uses the day of the week, the hour of the day and the value of the expense as features to predict the location of the purchase. 
It's a toy app cause it stores data in the localStorage of the browser. It's not reliable or robust and the code is a bit messy; it was made as an exercise (or proof of concept) after a machine learning class.

The app was written in portuguese, but a quick hack was made to accept other languages. Right now you can choose between english and brazilian portuguese.

## How to Translate

Make a copy of the *en.json* file and replace the sentences, translanting to the desired language. After taht, change the variable *langSetting* in *js/main.js*  passing the name of the json file you made:

```javascript
let langSettgin = 'js/en.json';
```
