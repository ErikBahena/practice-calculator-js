"use strict";

// getting the common parent of all the elements so we can use event delegation and get their text contect to preform computations
const buttonContainer = document.querySelector(".main__container");
//the form element
const form = document.querySelector(".form-field");
//the clear button
const clearBtn = document.querySelector(".clear-input");
//the equals button
const equalsBtn = document.querySelector(".calculate");
//the percent button
const percentBtn = document.querySelector(".over-100");

const plusMinusBtn = document.querySelector(".plus__minus");

class App {
  //this array will take in all the text content of the buttons that we push, we will later use the built in eval function to evaluate this array.
  currentComputation = [];
  //these variables are letting us know whether or not a certian button has been used already in the current operation.
  //an example of why this is usefull (7%+9%)
  //for the first time we click the percent button we want to get the percent of any number in the current computation
  //but after we have already used the percent sign in the operation, we don't want to just divide (7%+9), we want to turn the 9 into a percentage, that way we can chain percent operations (7%+9%) or (0.07+0.09). Its the same thing with the plus minus button, we want to be able to chain these operations
  percentToggle = false;
  plusMinus = false;

  constructor() {
    //   at the moment, when working with event listeners, the this keyword points to the object that the event listener was called on. we want to change the this keyword from the element to the App object, we do this by using bind(this), the bind will set the this keyword to wherever the function that we are binding lives, which is in the App object. This will allow us to access local properties and methods.

    //the reason the event handler is placed in the constructor is because contructors load first on any instance, we want out app to have these event handlers from the moment our javascript is loaded.
    buttonContainer.addEventListener("click", this._getTextContent.bind(this));

    clearBtn.addEventListener("click", this._clearFormField.bind(this));

    equalsBtn.addEventListener("click", this._equals.bind(this));

    percentBtn.addEventListener("click", this._percent.bind(this));

    plusMinusBtn.addEventListener("click", this._plusMinus.bind(this));
  }

  _clearFormField() {
    //This function will be called when we use the c button. It will clear the forms textContent, and will empty the currentComputation array.
    //It will also change the use state of the plusMinus and percent buttons back to false;
    form.textContent = "";
    this.currentComputation.length = 0;
    this.percentToggle = false;
    this.plusMinus = false;
  }

  _getTextContent(e) {
    //guard clause which only allows us to run the rest of this function when we click on the right type of button
    if (!e.target.classList.contains("text-content")) return;
    //pushing the text content of the button to an array to be evaluated later
    this.currentComputation.push(e.target.textContent);
    //set the forms content to the text content of whatever button we click
    this._setFormTo();
  }

  _setFormTo() {
    //this function will be called when pressing any numbers, decimals, or operators besides the equals operator and the percent, plusMinus buttons.
    //this function allows the user to see what they are inputing to the calculator
    form.textContent = this.currentComputation.join("");
  }

  _equals() {
    //finalValue will be equal to the reutn of the evaluate function. That function is decribed in the _evaluateInputs function.
    const finalValue = this._evaluateInputs();
    this._setFormAfterOperation(finalValue);
  }

  _evaluateInputs() {
    //when preforming a computation, this function will be called. This function takes the array of all the inputs example ["1", "+", "2", "34"] then converts the array to a string, replacing the text holder strings like "x" and "÷" to something that the eval function can understand.
    //This function returns that value as a number which will be used to set the forms value.
    let stringToCompute = this.currentComputation
      .join("")
      .replaceAll("x", "*")
      .replaceAll("÷", "/");
    return eval(stringToCompute);
  }

  _percent() {
    //if the percent symobol has not been used, then we can evaluate all inputs and then divide by 100 which is what we do.
    if (!this.percentToggle) {
      const finalValue = this._evaluateInputs() / 100;
      this._setFormAfterOperation(finalValue);
      this.percentToggle = true;
    } else {
      //if the percent symbol has been used, then we need to find all the numbers after the last operator, then take those numbers and divide them by 100, then string that back together with all other characters before the last operator.
      //We do this by getting the last index of any operator. Of course there could be more than one operator in a operationstring, to account for that, we need to find the greatest lastIndexOf an operatoror. With that index we can slice the operationstring one value after the index to get the number we need to convert to a percent. We convert it to a percent, then string it back together with all the characters before the lastIndexOf the operator.
      //This function does the prior, it also takes in the operation that we want to preform with the values after the last operator
      const operation = `/100`;
      this._getValuesAfterOperator(operation);
    }
  }

  _setFormAfterOperation(finalValue) {
    //similar to the setForm function, this function sets the forms textContent to a specified value and clears the currentComputation array. Then it pushes that final value to the currentComputations array for another operation
    //an example use of this function is the following
    //user inputs (7+9+10)
    form.textContent = finalValue;
    this.currentComputation.length = 0;
    this.currentComputation.push(finalValue);
  }

  _plusMinus() {
    if (!this.plusMinus) {
      const finalValue = this._evaluateInputs() * -1;
      console.log(finalValue);
      this._setFormAfterOperation(finalValue);
      this.plusMinus = true;
    } else {
      const operation = `* -1`;
      this._getValuesAfterOperator(operation);
    }
  }

  _getValuesAfterOperator(operation) {
    const index = this.currentComputation.lastIndexOf("x");
    const index1 = this.currentComputation.lastIndexOf("÷");
    const index2 = this.currentComputation.lastIndexOf("+");
    const index3 = this.currentComputation.lastIndexOf("-");
    const arrayOfIndexes = [index, index1, index2, index3];
    arrayOfIndexes.sort((a, b) => a - b);
    const finalNonNumerValueIndex = arrayOfIndexes[arrayOfIndexes.length - 1];

    const charactersToEvaluate = this.currentComputation
      .slice(finalNonNumerValueIndex + 1)
      .join("");

    const charsAfterNonNumber = eval(charactersToEvaluate + operation);
    //string back together
    const value = (
      this.currentComputation.slice(0, finalNonNumerValueIndex + 1) +
      charsAfterNonNumber
    ).replaceAll(",", "");

    this._setFormAfterOperation(value);
  }
}

const app = new App();
