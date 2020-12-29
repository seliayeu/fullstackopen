import React from 'react';

const Header = ({ name }) => {
    return (
      <h2>{name}</h2>
    )
  }
  
const Part = ({ name, exercises }) => {
    return (
      <p>
        {name} {exercises}
      </p>    
    )
}
  
const Content = ({ parts }) => {
    return (
      <div>
        {parts.map(part =>
          <Part key={part.id} name={part.name} exercises={part.exercises} />  
        )}
      </div>
    )   
  }
  
const Course = ({ course }) => {
    return (
      <>
        
        <Header name={course.name} />
        <Content parts={course.parts} />
        <p><b>
          total of
          {course.parts.reduce((total, part) => (
            total + part.exercises
          ), 0)}
          exercises
        </b></p>
      </>
    )
}


export default Course