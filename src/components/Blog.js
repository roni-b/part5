import { useState } from 'react'

const Blog = ({ blog, handleUpdateLikes, handleBlogRemove, user }) => {
  const [showFullView, setShowFullView] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleShowFullView = () => {
    setShowFullView(!showFullView)
  }

  const handleUpdate = () => {
    handleUpdateLikes(blog)
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      handleBlogRemove(blog)
    }
  }

  const removeButton = () => {
    if (blog.user.username === user.username) {
      return (
        <button id="remove" onClick={handleRemove}>remove</button>
      )
    }
  }
  return (
    <div className="blog" style={blogStyle}>
      {blog.title} {blog.author}
      <button id="view" onClick={handleShowFullView}>
        {showFullView ? 'hide' : 'view'}
      </button>
      {showFullView && (
        <div>
          <div>{blog.url}</div>
          <div>
            {blog.likes}
            <button id="like" onClick={handleUpdate}>like</button>
          </div>
          <div>{blog.author}</div>
          {removeButton()}
        </div>
      )}
    </div>
  )
}

export default Blog