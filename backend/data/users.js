import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123456', 10),
    image: '/images/user_image.png',
    isAdmin: true,
  },
  {
    name: 'Achouak Cherif',
    email: 'achouak@email.com',
    password: bcrypt.hashSync('123456', 10),
    image: '/images/user_image.png',

  },
  {
    name: 'Cherif Achwak',
    email: 'achwak@email.com',
    password: bcrypt.hashSync('123456', 10),
    image: '/images/user_image.png',

  },
];

export default users;
