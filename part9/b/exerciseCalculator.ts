interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const parseExercise = (args: Array<string>): { data: Array<number>, target: number} => {
  console.log(args);
  if (args.length < 3) {
    throw new Error("incorrect number of arguments. need target: non-negative number, data: non-negative numbers separated by spaces");
  }
  const target = Number(args[2]);
  if (isNaN(target) || target < 0) {
    throw new Error("first argument is invalid. need non-negative number");
  }    
  const data = args.slice(3).map((datum) => Number(datum));
  if (data.some((datum) => isNaN(datum) || datum < 0)) {
    throw new Error("second argument is invalid. need numbers separated by spaces");
  }

  return { data, target };
};

export const calculateExercises = (data: Array<number>, target: number): Result => {
  const periodLength = data.length;
  const trainingDays = data.reduce((trainingDays, timeTrained) => timeTrained > 0 ? trainingDays + 1 : trainingDays, 0);
  const success = trainingDays >= target;
  let rating;
  let ratingDescription;
  const average = (data.reduce((total, datum) => total + datum)) / periodLength;
  if (average < (target / 2)) {
    rating = 1;
    ratingDescription = 'poor';
  } else if (average < target) {
    rating = 2;
    ratingDescription = 'okay';
  } else {
    rating = 3;
    ratingDescription = 'excellent';
  }

  return { periodLength, trainingDays, success, rating, ratingDescription, target, average };
};

try {
  const { data, target } = parseExercise(process.argv);
  console.log(calculateExercises(data, target));
} catch (exception) {
  console.log("error:", exception.message); // eslint-disable-line @typescript-eslint/no-unsafe-member-access
}