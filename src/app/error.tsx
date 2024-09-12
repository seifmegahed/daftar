"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function ErrorPage({
  statusCode,
  title,
  message,
}: {
  statusCode: number;
  title: string;
  message: string;
}) {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{statusCode + " - " + message}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button className="w-full" type="button">
            Go back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default ErrorPage;
