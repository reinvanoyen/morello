"use strict";

const Router = {
  path: '',
  routes: {},
  executedRoutes: [],
  add(path, execute, destroy) {
    Router.routes[path] = [ execute, destroy ];
  },
  route(route) {

    if( Router.path !== route ) {

      console.log('routing:', route);

      Router.path = route;

      let segments = Router.path.split('/');
      let routesToExecute = [];

      let current = '';
      segments.forEach((segment, i) => {
        current += (i !== 0 ? '/' : '') + segments[i];
        routesToExecute.push(current);
      });

      // Destroy executed routes
      let routesToNotExecuteAgain = [];

      for (let i = 0; i < Router.executedRoutes.length; i++) {
        let route = Router.executedRoutes[i];
        // If this route is also to be executed, we don't destroy it
        if (routesToExecute.indexOf(route[0]) === -1) {
          // Destroy the route
          console.log('-- destroying:', route[0]);
          route[1]();
        } else {
          routesToNotExecuteAgain.push(route[0]);
        }
      }

      Router.executedRoutes = [];

      // Execute routes
      routesToExecute.forEach(path => {
        if (Router.routes[path]) {
          if (routesToNotExecuteAgain.indexOf(path) === -1) {
            console.log('-- executing:', path);
            Router.routes[path][0]();
          }
          Router.executedRoutes.push([path, Router.routes[path][1]]);
        } else {
          console.error('-- invalid', path);
        }
      });
    }
  }
};

module.exports = Router;