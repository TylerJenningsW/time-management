import { createNextApiHandler } from "@trpc/server/adapters/next";

import { env } from "~/env.mjs";
import { createTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";
import { TRPCError } from "@trpc/server";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError(opts) {
    const { error, type, path, input, ctx, req } = opts;
    console.error('Error:', error);

    if (error.code === 'UNAUTHORIZED') {
      console.error(`Unauthorized access attempt on ${path} with input:`, input);
      opts.error = new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You do not have permission to access this resource.'
      });
    }
  }
});