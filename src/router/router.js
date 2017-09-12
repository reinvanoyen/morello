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

      // Destroy executed routes
      let routesToNotExecuteAgain = [];

      for (let i = 0; i < Router.executedRoutes.length; i++) {

        let route = Router.executedRoutes[i];

        // If this route is also to be executed, we don't destroy it
        if (routesToExecute.indexOf(route.path) > -1) {

          // @TODO check if we should execute this route (base on the current model and the model set in the route)
          console.log( route );

          //if (!route.modelId || route.modelId === model.id) {
            routesToNotExecuteAgain.push(route.path);
          //}

        } else {
          // Destroy the route
          console.log('-- destroying:', route.path);
          route.destroy();
        }
      }

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