const Router = {
  add: (name, cb) => {
    if (! Router.routes) {
      Router.routes = {};
    }
    Router.routes[name] = cb;
  },
  route: () => {
    console.log(Router.routes);
  }
};

export default Router;