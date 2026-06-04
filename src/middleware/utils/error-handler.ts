import { NextResponse } from "next/server";

export const handleError = (error: any) => {

  const status = error.status || 500;
  const message = error.message || "An unexpected error occurred in the commerce middleware";

  return NextResponse.json(
    {
      error: message,
      status,
    },
    { status }
  );
};

export class CommerceError extends Error {
  status: number;

  constructor(message: string, status: number = 400) {
    super(message);
    this.status = status;
    this.name = "CommerceError";
  }
}
