import React from 'react'

const Course = ({ courses }) => {

  function getTotal(arr){
    return arr.reduce((a,b) => ({exercises: a.exercises + b.exercises})).exercises
  }

  return (
    <div>

      {courses.map((course) =>
          <div>
            <h1>{course.name}</h1>

            {course.parts.map((part) => 
              <div>
                <p>{part.name} {part.exercises}</p>
              </div>
            )}

            <h3>total of {getTotal(course.parts)} exercises</h3>

          </div>
      )}

    </div>
  )
} 

export default Course