
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
  getUser: { userId: 1, roleId: 2, email: 'kennysoft@yahoo.com' },
  getDocuments: [
    { id: 6,
      title: 'history 101',
      content: 'This is the beginning of history class',
      access: 'public',
      userId: 2,
      roleId: 2,
      createdAt: '2017-07-31T09:11:40.419Z',
      updatedAt: '2017-07-31T09:11:40.419Z' },
    { id: 2,
      title: 'Introduction to 102',
      content: 'Who b this fush?',
      access: 'private',
      userId: 2,
      roleId: 2,
      createdAt: '2017-07-31T09:11:37.589Z',
      updatedAt: '2017-07-31T09:11:37.589Z' },
    { id: 4,
      title: 'Introduction to 104',
      content: 'Who b this tortoise?',
      access: 'role',
      userId: 4,
      roleId: 2,
      createdAt: '2017-07-31T09:11:37.589Z',
      updatedAt: '2017-07-31T09:11:37.589Z' },
    { id: 5,
      title: 'Introduction to 105',
      content: 'Did i do that? did i really do that?',
      access: 'role',
      userId: 2,
      roleId: 2,
      createdAt: '2017-07-31T09:11:37.589Z',
      updatedAt: '2017-07-31T09:11:37.589Z' },
    { id: 1,
      title: 'Introduction to 101',
      content: 'Who b this goat?',
      access: 'public',
      userId: 1,
      roleId: 1,
      createdAt: '2017-07-31T09:11:37.588Z',
      updatedAt: '2017-07-31T09:11:37.588Z' }
  ],

  getDocument: [{ id: 6,
    title: 'history 211',
    content: 'This is the beginning of history class',
    access: 'public',
    userId: 2,
    roleId: 2,
    createdAt: '2017-07-31T13:34:15.303Z',
    updatedAt: '2017-07-31T13:34:15.303Z' }],

  getAllUsers: [{ id: 4, email: 'framky0071@yahoo.com', roleId: 2 },
     { id: 3, email: 'framky007@yahoo.com', roleId: 3 }],
};


export default mockData;
