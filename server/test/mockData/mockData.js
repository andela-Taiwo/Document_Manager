
const mockData = {
  invalidEmail: { param: 'email',
    msg: 'valid email address is required',
    value: 'johnDoe@yahoo' },


  noToken: 'A token is requeired for authentication',

  badToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZnJhbWt5Q',

  superAdmin: { userId: 1, roleId: 1 },
  admin: { userId: 2, roleId: 2 },
  regularUser: { userId: 1, email: 'johnDoe@yahoo.com', roleId: 2 },
  user: { userId: 3, roleId: 3 },
  anotherUser: { userId: 8, roleId: 3 },
  regularUserData: { password: '12345', email: 'johnDoe@yahoo.com', roleId: 2, userName: 'adeola' },

  invalidTitle: { param: 'title',
    msg: '10 to 30 characters required'
  },

  invalidContent: { param: 'content',
    msg: 'Document content cannot be empty'
  },
  noAccess: {
    param: 'access',
    msg: 'Document access type is required'
  },

};

export default mockData;
