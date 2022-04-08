const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  function getSum(arr){
    console.log(arr)

    return (
      arr.reduce((a,b) => ({exercises: a.exercises + b.exercises})).exercises
    )
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total total={getSum(course.parts)} />
    </div>
  )
}

const Header = ({ course }) => {
  return (
    <div>
      <h1>{course}</h1>
    </div>
  )
}

const Content = ({ parts }) => {

  return (
    <div>
      {parts.map((part, idx) => {
        return(
          <Part part={part.name} exercises={part.exercises} key={'part-' + idx}/>
        )
      })}
    </div>
  )
}

const Total = ({ total }) => {
  return (
    <div>
      <p>
        Number of exercises {total}
      </p>
    </div>
  )
}

const Part = ({ part, exercises }) => {
  return (
    <div>{part} {exercises}</div>
  )
}

export default App