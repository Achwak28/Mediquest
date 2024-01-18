import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@email.com',
    password: bcrypt.hashSync('12345678', 10),
    image: '/images/user_image.png',
    isAdmin: true,
  },
  {
    name: 'Achouak Cherif',
    email: 'achouak@email.com',
    password: bcrypt.hashSync('12345678', 10),
    image: '/images/user_image.png',

  },
];

export default users;
