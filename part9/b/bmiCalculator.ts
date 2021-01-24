const parseBmi = (args: Array<string>): {height: number, weight: number} => {
  if (args.length < 3) {
    throw new Error("incorrect number of arguments. need two non-negative numbers: height (cm) and weight (kg)");
  }
  const height = Number(args[2]);
  if (isNaN(height) || height < 0) {
    throw new Error("height must be a non-negative number");
  }
  const weight = Number(args[3]);
  if (isNaN(weight) || weight < 0) {
    throw new Error("weight must be a non-negative number");
  }  
  return { weight, height };
};

export const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight/((height / 100) * (height / 100));
  if(bmi < 15) {
    return "Very severely underweight";
  } else if (bmi < 16) {
    return "Severely underweight";
  } else if (bmi < 18.5) {
    return "Underweight";
  } else if (bmi < 25) {
    return "Normal (healthy weight)";
  } else if (bmi < 30) {
    return "Overweight";
  } else if (bmi < 35) {
    return "Obese Class I (Moderately obese)";
  } else if (bmi < 40) {
    return "Obese Class II (Severly obese)";
  } else {
    return "Obese Class III (Very severely obese)";
  } 
};

try {
  const { height, weight } = parseBmi(process.argv);
  console.log(calculateBmi(height, weight));
} catch (exception) {
  console.log("error:", exception.message); // eslint-disable-line @typescript-eslint/no-unsafe-member-access
}
