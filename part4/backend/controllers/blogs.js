const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
//const User = require('../models/user')

const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const foundBlog = await Blog.findById(request.params.id)
  response.json(foundBlog)
})

// POST ///////////////////////////////////////////////////////////////////////////////////////////////////
blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const token = request.token
  console.log('token: ', token)

  const decodedToken = jwt.verify(token, process.env.SECRET)
  const user = request.user

  //const user = await User.findById(decodedToken.id)
  //console.log('user is (old way):', user)
  //console.log('user is (new way):', request.user)

  if(request.body === undefined){
    response.status(400).json({ error: 'undefined message body!' })
  }
  if(body.title === undefined){
    response.status(400).json({ error: 'required title is missing!' })
  }
  if(body.url === undefined){
    response.status(400).json({ error: 'required url is missing!' })
  }

  if(!decodedToken.id){
    return response.status(401).json({ error: 'token missing or invalid!' })
  }
  /*
  if(body.user === undefined){
    response.status(400).json({ error: 'blog must include userId!' })
  }
  */

  //const user = await User.find({})
  //const firstUserId = user[0]._id
  //console.log('any user: ', user[0]._id)

  // DATA FOR NEW BLOG TO BE POSTED
  const blog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url,
    likes: 0,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    author: body.author,
    title: body.title,
    url: body.url,
    likes: 0
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog)
  response.json(updatedBlog)
})

module.exports = blogsRouter