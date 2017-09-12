"use strict";

const Router = {
  path: '',
  routes: {},
  executedRoutes: [],
  add(path, execute, destroy) {
    Router.routes[path] = [ execute, destroy ];
  },
  route(route, model) {

      console.log('routing:', route);

      Router.path = route;

      let segments = Router.path.split('/');
      let routesToExecute = [];

      let current = '';
      segments.forEach((segment, i) => {
        current += (i !== 0 ? '/' : '') + segments[i];
        routesToExecute.push(current);
      });

      // @TODO make 2 arrays, one of routes to destroy and one of routes to execute
      let routesToDestroy = Router.executedRoutes.filter(route => {
        return ( routesToExecute.indexOf(route.path) === -1 );
      });

      let routesToNotExecuteAgain = Router.executedRoutes.map(route => { // @TODO reverse the list -> only routes that need to be executed
        if (routesToExecute.indexOf(route.path) > -1) {
          return route.path;
        }
      });

      // Destroy routes
      routesToDestroy.forEach(route => {
        console.log('-- destroying:', route.path);
        route.destroy();
      });

      Router.executedRoutes = [];

      // Execute routes
      routesToExecute.forEach(path => {

        if (Router.routes[path]) {

          if (routesToNotExecuteAgain.indexOf(path) === -1) {

            console.log('-- executing:', path);
            Router.routes[path][0](model);
          }

          Router.executedRoutes.push({
            path: path,
            modelId: ( model.id ? model.id : false ),
            destroy: Router.routes[path][1]
          });

        } else {

          console.error('-- invalid', path);
        }
      });
  }
};

module.exports = Router;