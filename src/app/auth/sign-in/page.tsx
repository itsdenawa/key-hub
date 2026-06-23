import Link from "next/link";

import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";

export default function SignInPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Input type="email" name="email" placeholder="you@example.com" />
            <Input type="password" name="password" placeholder="Password" />
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            New to KeyHub?{" "}
            <Link href="/auth/sign-up" className="font-medium text-foreground">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
