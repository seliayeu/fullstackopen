import express = require('express');
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_request, response) => {
  response.send("Hello Full Stack!");
});
app.get('/bmi', (request, response) => {
  const height = Number(request.query.height);
  const weight = Number(request.query.weight);

  if (isNaN(weight) || weight < 0 || isNaN(height) || height < 0) {
    response.status(400).send({ error: 'malformatted parameters'});
  }  

  const bmi = calculateBmi(height, weight);
  response.status(200).send({ weight, height, bmi });
});

type RequestBody = {
  daily_exercises: Array<number>;
  target: number;
};

app.post('/exercise', (request, response) => {
  const body = request.body as RequestBody; 
  const daily_exercises = body.daily_exercises; 
  const target = body.target;

  if(body.daily_exercises === undefined || body.target === undefined) {
    return response.status(400).send({error: "parameters missing" });
  } 
  if (daily_exercises.some((exercise: number) => isNaN(exercise) || exercise < 0) || isNaN(target) || target < 0) { 
    return response.status(400).send({ error: 'malformatted parameters'});
  }  
  calculateExercises(daily_exercises, target);

  return response.status(200).send(calculateExercises(daily_exercises, target));
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`express server running on ${PORT}`);
});

