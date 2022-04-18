const User = require('../models/user')
const Blog = require('../models/blog')
const bcrypt = require('bcryptjs')


const hashPassword = async (password) => {
  const salt = 10
  return bcrypt.hash(password, salt)
}
/*
const initialBlogs = []
*/

const initialUsers = [
  {
    username: 'Raikki',
    name: 'Riku',
    password: 'sekret',
    blogs: []
  },
  {
    username: 'Pihla',
    name: 'Kristian',
    password: 'sekret2',
    blogs: []
  },
  {
    username: 'Boltox',
    name: 'Arlet',
    password: 'sekret3',
    blogs: []
  }
]


const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const createTestUser = async () => {
  const data = {
    username: 'testpal',
    name: 'test tester',
    password: 'testpass',
    blogs: []
  }
  let user = new User(data)
  await user.save()
}


const getTestUser = async () => {
  createTestUser()
  const users = await User.find({})
  return users[0]
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  usersInDb, blogsInDb, initialUsers, hashPassword, getTestUser, createTestUser
}
