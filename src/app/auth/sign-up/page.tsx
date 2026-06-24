import Link from "next/link";

import { signUpAction } from "@/features/auth/actions";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";

type SignUpPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const message = normalizeParam(params.message);
  const next = normalizeParam(params.next);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
        </CardHeader>
        <CardContent>
          {message ? (
            <p className="mb-4 rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
              {message}
            </p>
          ) : null}
          <form action={signUpAction} className="space-y-4">
            <input type="hidden" name="next" value={next ?? ""} />
            <Input
              type="text"
              name="fullName"
              placeholder="Full name"
              autoComplete="name"
              required
            />
            <Input
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="new-password"
              required
            />
            <Button type="submit" className="w-full">
              Create account
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="font-medium text-foreground">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

function normalizeParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
