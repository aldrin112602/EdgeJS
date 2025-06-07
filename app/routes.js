const routes = {
  login: function () {
    return edge.render("auth.login", function () {
      // Callback to handle any additional logic after rendering the login page
      console.log("Login page rendered!");
    });
  },

  signup: function () {
    return edge.render("auth.signup", function () {
      // Callback to handle any additional logic after rendering the signup page
      console.log("Signup page rendered!");
    });
  },

  index: function () {
    return edge.render("index", function () {
      // Callback to handle any additional logic after rendering the index page
      console.log("Index page rendered!");
    });
  },

  404: function () {
    return edge.render("errors.404", function () {
      // Callback to handle any additional logic after rendering the 404 page
      console.log("404 page rendered!");
    });
  },
};
