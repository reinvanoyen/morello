const Router = {
  routes: {},
  add: (name, cb) => {
    Router.routes[name] = cb;
  },
  route: (model) => {
    let path = document.location.pathname.substring(1),
        segments = path.split('/')
    ;

    segments.forEach(s => {
      if (Router.routes[s]) {
        Router.routes[s](model);
      }
    });
  }
};

export default Router;