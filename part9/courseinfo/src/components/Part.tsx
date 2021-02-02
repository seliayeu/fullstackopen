import React from "react";
import { CoursePart } from "../index";

type CoursePartProps = {
  course: CoursePart;
}

const Part: React.FC<CoursePartProps> = ({ course }) => {
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };
  switch (course.name) {
    case "Fundamentals":
      return (
        <div>
          <h3>{course.name}</h3>
          <p>exercises: {course.exerciseCount}</p>
          <p>description: {course.description}</p>
        </div>
      )
    case "Using props to pass data":
      return (
        <div>
          <h3>{course.name}</h3>
          <p>exercises: {course.exerciseCount}</p>
          <p>group exercises: {course.groupProjectCount}</p>
        </div>
      )    
    case "Deeper type usage":
      return (
        <div>
          <h3>{course.name}</h3>
          <p>exercises: {course.exerciseCount}</p>
          <p>description: {course.description}</p>
          <p>submission link: {course.exerciseSubmissionLink}</p>
        </div>
      )    
    default:
      return assertNever(course);
  }  
}

export default Part;