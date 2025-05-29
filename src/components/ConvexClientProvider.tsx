"use client";

import {
  ConvexReactClient,
  Authenticated,
  Unauthenticated,
  AuthLoading,
} from "convex/react";
import { ReactNode, useEffect, useState } from "react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth, SignIn } from "@clerk/clerk-react";
import { FullscreenLoader } from "./fullscreen-loader";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      setError(event.error?.message || "Unknown error");
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      setError(event.reason?.message || "Unhandled promise rejection");
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-red-100 text-red-700 font-semibold whitespace-pre-wrap text-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <Authenticated> {children}</Authenticated>
        <Unauthenticated>
          {/* <p> Please log in</p> */}
          <div className="flex flex-col items-center justify-center min-h-screen">
            {/* if we use imports "@clerk/nextjs" instead of "@clerk/clerk-react"; */}
            <SignIn />
          </div>
        </Unauthenticated>
        <AuthLoading>
          <p>Loading auth...</p>
          <FullscreenLoader label="Auth loading..." />
        </AuthLoading>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
