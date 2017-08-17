
const mockData = {
  invalidEmail: { param: 'email',
    msg: 'valid email address is required',
    value: 'johnDoe@yahoo' },

  invalidPassword: { param: 'password',
    msg: '',
    value: 'Food' },


  noToken: 'A token is requeired for authentication',

  badToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZnJhbWt5Q',

  admin: { userId: 2, email: 'adeolaoo7@andela.com', roleId: 1 },
  regularUser: { userId: 1, email: 'johnDoe@yahoo.com', roleId: 2 },
  user: { userId: 4, email: 'yuussuf@andela.com', roleId: 3 },
  regularUserData: { password: '12345', email: 'johnDoe@yahoo.com', roleId: 2, userName: 'adeola' },

  invalidTitle: { param: 'title',
    msg: '10 to 30 characters required'
  },

  shortTitle: { param: 'title',
    msg: '10 to 20 characters required',
    value: ''
  },

  invalidContent: { param: 'content',
    msg: 'Document content cannot be empty'
  },
  noAccess: {
    param: 'access',
    msg: 'Document access type is required'
  },

  newDoc: { title: 'history 211',
    content: 'This is the beginning of history class',
    access: 'public'
  },
  createdDoc: { message: 'New Document created successfully',
    title: 'history 211',
    access: 'public',
  },
};

export default mockData;
