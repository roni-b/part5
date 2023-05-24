import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [creationVisible, setCreationVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleCreation = async (event) => {
    event.preventDefault()
    const newBlog = {
      title: title,
      author: author,
      url: url
    }
    try {
      const returnedBlog = await blogService.create(newBlog)
      setTitle('')
      setAuthor('')
      setUrl('')
      setBlogs(blogs.concat(returnedBlog))
      setErrorMessage(`${returnedBlog.title} added`)
      setCreationVisible(false)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('adding a new blog failed')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const logoutUser = () => {
    if (window.localStorage.getItem('loggedBlogappUser') && user) {
      window.localStorage.removeItem('loggedBlogappUser')
      setUser(null)
    }
  }

  const handleUpdateLikes = async (blog) => {
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes+1
    }
    try {
      const returnedBlog = await blogService.update(newBlog, blog.id)
      const updatedBlogs = blogs.map(b => b.id === returnedBlog.id ? returnedBlog : b)
      setBlogs(updatedBlogs)
      setErrorMessage(`${returnedBlog.title} likes updated`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('updating a blog failed')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleBlogRemove = async (blog) => {
    try {
      await blogService.remove(blog.id)
      const updatedBlogs = blogs.filter(b => b.id !== blog.id)
      setBlogs(updatedBlogs)
      setErrorMessage(`${blog.title} deleted`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('blog deletion failed')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)}
  }

  if (user === null) {
    return (

      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    )
  }

  const creationForm = () => {
    const hideWhenVisible = { display: creationVisible ? 'none' : '' }
    const showWhenVisible = { display: creationVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button id='create-blog' onClick={() => setCreationVisible(true)}>create a new blog</button>
        </div>
        <div style={showWhenVisible}>
          <CreateBlogForm
            title={title}
            author={author}
            handleTitleChange={({ target }) => setTitle(target.value)}
            handleAuthorChange={({ target }) => setAuthor(target.value)}
            handleUrlChange={({ target }) => setUrl(target.value)}
            handleSubmit={handleCreation}
          />
          <button onClick={() => setCreationVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {errorMessage}
      <h1>blogs</h1>
      {user.username} logged in
      <button id="logout" onClick={logoutUser}>
        logout
      </button>
      {creationForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog}
          handleUpdateLikes={handleUpdateLikes}
          handleBlogRemove={handleBlogRemove}
          user={user}/>
      )}
    </div>
  )
}

export default App