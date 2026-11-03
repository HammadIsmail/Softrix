import { NextResponse } from "next/server";
import { type BookCallRequest, sendBookCallEmail } from "@/lib/nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, projectType, budget, details } =
      body as Partial<BookCallRequest>;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 },
      );
    }

    if (
      !projectType ||
      typeof projectType !== "string" ||
      !projectType.trim()
    ) {
      return NextResponse.json(
        { error: "Project type is required." },
        { status: 400 },
      );
    }

    if (!details || typeof details !== "string" || !details.trim()) {
      return NextResponse.json(
        { error: "Project details are required." },
        { status: 400 },
      );
    }

    await sendBookCallEmail({
      name: name.trim(),
      email: email.trim(),
      projectType: projectType.trim(),
      budget: budget ? budget.trim() : undefined,
      details: details.trim(),
    });

    return NextResponse.json(
      { success: true, message: "Call request received successfully." },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error processing book-call request:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      {
        error: "Failed to send email. Please try again later.",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
