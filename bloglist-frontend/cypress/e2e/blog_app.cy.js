describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Mikki Hiiri',
      username: 'mikkihiiri',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Login')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mikkihiiri')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('mikkihiiri logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('asd')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('Login')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mikkihiiri', password: 'salainen' })
      const blog = {
        title: 'The first one',
        author: 'Someone',
        url: 'address',
      }
      cy.createBlog({ blog })
    })

    it('A blog can be created', function() {
      cy.get('#create-blog').click()
      cy.get('#title').type('A new blog')
      cy.get('#author').type('Random')
      cy.get('#url').type('urladdress')
      cy.get('#create').click()
      cy.contains('A new blog added')
      cy.contains('A new blog Random')
    })

    it('Liking a blog', function() {
      cy.get('#view').click()
      cy.contains(0)
      cy.get('#like').click()
      cy.contains('The first one likes updated')
      cy.contains(1)
    })

    it('Creator can delete blog', function() {
      cy.get('#view').click()
      cy.get('#remove').click()
      cy.contains('The first one deleted')
    })

    it('Only blog creator sees delete button', function() {
      cy.get('#logout').click()
      const user = {
        name: 'Aku Ankka',
        username: 'akuankka',
        password: 'salainen'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user)
      cy.login({ username: user.username, password: user.password })
      cy.get('#view').click()
      cy.contains('#remove').should('not.exist')
    })

    it('Blogs are sorted by their likes count', function() {
      const blog = {
        title: 'Second blog',
        author: 'Someone',
        url: 'address',
        likes: 1
      }
      cy.createBlog({ blog })
      cy.get('.blog').eq(0).should('contain', 'Second blog')
      cy.get('.blog').eq(1).should('contain', 'The first one')
    })
  })
})