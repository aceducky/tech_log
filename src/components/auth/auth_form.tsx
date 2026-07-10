import type { HTMLAttributes } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
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

          <div className="relative hidden overflow-hidden border-l border-border md:flex">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />

            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 top-8 select-none font-mono text-[10rem] font-bold leading-none text-primary/5"
            >
              {"</>"}
            </span>

            <div className="relative flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
              <h2 className="font-mono text-4xl font-bold tracking-tight">
                TechLog
              </h2>

              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                Write it once. Find it later.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
