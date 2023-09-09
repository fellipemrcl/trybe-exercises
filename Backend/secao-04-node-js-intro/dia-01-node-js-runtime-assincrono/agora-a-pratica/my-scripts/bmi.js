const readline = require('readline-sync');

function calculateBMI() {
    const weight = readline.questionInt('What is your weight? ');
    const height = readline.questionFloat('What is your height? ');
    const bmi = weight / (height * height);
    displayBMIResult(bmi);
}

function displayBMIResult(bmi) {
    let category;
    if (bmi < 18.5) {
        category = 'Underweight';
    } else if (bmi < 24.9) {
        category = 'Normal weight';
    } else if (bmi < 29.9) {
        category = 'Overweight';
    } else if (bmi < 34.9) {
        category = 'Obesity Class I';
    } else if (bmi < 39.9) {
        category = 'Obesity Class II';
    } else {
        category = 'Obesity Class III and IV';
    }
    console.log(`BMI: ${bmi} = ${category}`);
}

calculateBMI();