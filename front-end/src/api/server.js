export default {
  BASE_URL: 'http://localhost:8000/api/',
  // BASE_URL: 'https://memorytraining.cf/api/',

  ROUTES: {
    // Account
    login: 'rest-auth/login/',
    signup: 'rest-auth/signup/',
    logout: 'rest-auth/logout/',

    // Set
    create: 'books/create/',
    search: 'books/search/',
    myset: 'books/myset/',
  },
};
