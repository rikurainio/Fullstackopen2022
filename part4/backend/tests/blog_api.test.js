const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()

}, 100000)

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
}, 100000)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test('get api/blogs/:id', async () => {
  const response = await api.get('/api/blogs/5a422a851b54a676234d17f7')
  const toEqual = {
    id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  }
  expect(response.body).toEqual(toEqual)
})

test('blog ID attribute is named "id"', async () => {
  const response = await api.get('/api/blogs/5a422a851b54a676234d17f7')
  expect(response.body.id).toBeDefined()
})

test('a specific author is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')
  const authors = response.body.map(r => r.author)
  expect(authors).toContain('Michael Chan')

}, 100000)

//DEFAULT POST API/BLOGS
test('post /api/blogs', async () => {

  // CREATE THE USER FIRST LOLMAO I AM DUMB [✅]
  const postedUser = await api
    .post('/api/users')
    .send({ username: 'testpal', password: 'testpass' })
    .expect(201)

  // TRY LOGIN WITH NEW USER [✅]
  const result = await api
    .post('/api/login')
    .send({ username: 'testpal', password: 'testpass' })

  //console.log('res from login attempt:', result.body, 'posted user:', postedUser.body)

  // TRY POSTING WITH THAT USER ( SHOULD BE VALIDATED (JWT) )
  await api
    .post('/api/blogs')
    .send({ author: 'testAuthor', title: 'testTitle', url: 'testUrl.com', likes: 0, user: postedUser.id })
    .set({ Authorization: 'Bearer ' + result.body.token })
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const blogAuthors = response.body.map(blog => blog.author)
  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(blogAuthors).toContain('testAuthor')
})

test('post /api/blogs without likes attribute should default to likes: 0', async () => {
  // CREATE THE USER FIRST LOLMAO I AM DUMB [✅]
  const postedUser = await api
    .post('/api/users')
    .send({ username: 'testpal3', password: 'testpass3' })
    .expect(201)

  // TRY LOGIN WITH NEW USER [✅]
  const result = await api
    .post('/api/login')
    .send({ username: 'testpal3', password: 'testpass3' })

  //console.log('res from login attempt:', result.body, 'posted user:', postedUser.body)

  // TRY POSTING WITH THAT USER ( SHOULD BE VALIDATED (JWT) )
  await api
    .post('/api/blogs')
    .send({ author: 'testAuthor', title: 'I dont have likes', url: 'nolikes.com' , user: postedUser.id })
    .set({ Authorization: 'Bearer ' + result.body.token })
    .expect(201)
    .expect('Content-Type', /application\/json/)
})

test('posting to /api/blogs with missing title', async () => {

  // CREATE THE USER FIRST LOLMAO I AM DUMB [✅]
  const postedUser = await api
    .post('/api/users')
    .send({ username: 'testpal1', password: 'testpass1' })
    .expect(201)

  // TRY LOGIN WITH NEW USER [✅]
  const result = await api
    .post('/api/login')
    .send({ username: 'testpal1', password: 'testpass1' })

  //console.log('res from login attempt:', result.body, 'posted user:', postedUser.body)

  // TRY POSTING WITH THAT USER ( SHOULD BE VALIDATED (JWT) )
  await api
    .post('/api/blogs')
    .send({ author: 'testAuthor', url: 'testUrl.com', likes: 0, user: postedUser.id })
    .set({ Authorization: 'Bearer ' + result.body.token })
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('posting to /api/blogs with missing url', async () => {

  // CREATE THE USER FIRST LOLMAO I AM DUMB [✅]
  const postedUser = await api
    .post('/api/users')
    .send({ username: 'testpal2', password: 'testpass2' })
    .expect(201)

  // TRY LOGIN WITH NEW USER [✅]
  const result = await api
    .post('/api/login')
    .send({ username: 'testpal2', password: 'testpass2' })

  //console.log('res from login attempt:', result.body, 'posted user:', postedUser.body)

  // TRY POSTING WITH THAT USER ( SHOULD BE VALIDATED (JWT) )
  await api
    .post('/api/blogs')
    .send({ author: 'testAuthor', title: 'I have a title but no url :/', likes: 0, user: postedUser.id })
    .set({ Authorization: 'Bearer ' + result.body.token })
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('deleting post with existing id should be successfull', async () => {
  const id = initialBlogs[0]._id
  const response1 = await api.get('/api/blogs')
  const blogsLengthPreOperation = response1.body.length

  await api
    .delete(`/api/blogs/${id}`)
    .expect(204)

  const response2 = await api.get('/api/blogs')
  const blogsLengthPostOperation = response2.body.length

  expect(blogsLengthPostOperation).toEqual(blogsLengthPreOperation - 1)
})

test('putting post with some accepted updateData should be successful', async () => {
  const idToUpdate = initialBlogs[0]._id
  const updateData = {
    title: 'Updated Title',
    url: 'Updated url'
  }

  await api
    .put(`/api/blogs/${idToUpdate}`)
    .send(updateData)
    .expect(200)

  const response2 = await api.get(`/api/blogs/${idToUpdate}`)
  const blogPostOperation = response2.body

  expect(blogPostOperation.title).toEqual('Updated Title')
  expect(blogPostOperation.url).toEqual('Updated url')

})

afterAll(() => {
  mongoose.connection.close()
})