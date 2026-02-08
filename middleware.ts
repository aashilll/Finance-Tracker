import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  // Routes that don't require authentication
  publicRoutes: ["/", "/sign-in(.*)", "/sign-up(.*)"],
  debug: false,
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
