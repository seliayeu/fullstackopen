import React from "react";
import Part from "./Part"
import { CoursePart } from "../index";


type ContentProps = {
  courseParts: Array<CoursePart>;
}

const Content: React.FC<ContentProps> = ({ courseParts }) => {
  return (
    <div>
      {courseParts.map((course: CoursePart) => (
        <Part
          key={course.name}
          course={course}
          />
        ))}
    </div>
  )
}

export default Content;