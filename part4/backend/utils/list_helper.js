
const dummy = (blogs) => {
  console.log(blogs)
  return 1
}

const totalLikes = (blogs) => {
  if(blogs.length === 0){
    return 0
  }

  const sum = blogs.reduce((accumulator, blog) => {
    return accumulator + blog.likes
  }, 0)

  return sum
}

const mostBlogs = (blogs) => {
  const occurences = findHighest(blogs, 'byOccurences')
  return occurences
}

const mostLikes = (blogs) => {
  const highestLikesAuthor = findHighest(blogs, 'byLikes')
  return highestLikesAuthor
}

const findHighest = (arr, returnHandle) => {
  const authors = []

  arr.forEach(blog => {
    let blogAuthor = blog.author

    //already added to authors
    let findIndex = authors.findIndex(author => author.authorName === blogAuthor)
    if(findIndex !== -1){
      authors[findIndex].occurences += 1
      authors[findIndex].likes += blog.likes
    }
    //not yet added to authors
    else{
      authors.push({ authorName: blog.author, likes: blog.likes ,occurences: 1 })
    }
  })

  if(returnHandle === 'byOccurences'){
    const highestOccurencesAuthor = authors.reduce((acc, author) => acc.occurences > author.occurences ? acc : author)
    return highestOccurencesAuthor
  }
  if(returnHandle === 'byLikes'){
    const highestLikesAuthor = authors.reduce((acc, author) => acc.likes > author.likes ? acc : author)
    return highestLikesAuthor
  }
}

module.exports = {
  dummy, totalLikes, mostBlogs, mostLikes
}