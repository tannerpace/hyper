import { GraphQLHTTP, makeExecutableSchema, R } from "../../deps.js";

import { hyper63ServicesContextLens } from "../utils/hyper63-context.lens.js";
import { multipartMiddleware } from "../middleware.js";

import { resolvers, typeDefs } from "./schema.js";

const { reduce, set } = R;

function addServicesContexter(services) {
  return (_, prevContext) =>
    set(
      hyper63ServicesContextLens,
      services,
      prevContext,
    );
}

function addOpineContext({ req, res }, prevContext) {
  return {
    ...prevContext,
    req,
    res,
  };
}

const mountGql = ({
  app,
  contexters = [],
}, options = { playground: true, mountMultipartMiddleware: true }) =>
  (services) => {
    const schema = makeExecutableSchema({ typeDefs, resolvers });

    // TODO: Shim until Upload type for gql is available on Deno.
    // TODO: Will just pull file from opine request for now.
    if (options.mountMultipartMiddleware) {
      app.use(multipartMiddleware());
    }

    app.use("/graphql", async (req, res) => {
      // Build graphql context
      const context = await reduce(
        async (prevContext, contexter) =>
          contexter({ req, res }, await prevContext),
        {},
        [...contexters, addOpineContext, addServicesContexter(services)],
      );

      // Mount graphql server and playground
      await GraphQLHTTP({
        schema,
        context: () => context,
        graphiql: options.playground,
      })(req, res);
    });

    return app;
  };

export { mountGql };
