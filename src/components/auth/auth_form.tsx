import Image from "next/image";
import Link from "next/link";
import type { HTMLAttributes } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { OAuthButton } from "./oauth_button";

export default function AuthForm({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="flex flex-col justify-center p-6 md:p-12 md:min-h-[480px]">
            <FieldGroup>
              <div className="flex flex-col items-center gap-1 text-center mb-2">
                <h1 className="font-sans text-2xl font-bold tracking-tight">
                  Create your account
                </h1>
                <p className="font-sans text-sm text-muted-foreground">
                  Sign in with your GitHub account to get started
                </p>
              </div>
              <Field className="flex flex-col gap-3">
                <OAuthButton />
              </Field>
            </FieldGroup>
          </div>
          <div className="relative hidden bg-muted md:block">
            <Image
              width={800}
              height={1200}
              src="/placeholder.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <Link href="/terms">Terms of Service</Link> and{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  );
}
