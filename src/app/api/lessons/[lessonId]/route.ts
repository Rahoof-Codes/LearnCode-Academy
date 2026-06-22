import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: Request,
  // Next.js 15: context params are received as a promise
  context: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await context.params;
    
    // Safety check against directory traversal
    const safeLessonId = lessonId.replace(/[^a-zA-Z0-9_-]/g, "");
    
    const filePath = path.join(
      process.cwd(), 
      "src", 
      "data", 
      "lessons", 
      `${safeLessonId}.md`
    );

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { content: `# Lesson Not Found\n\nCould not find lesson file for ID: ${safeLessonId}` },
        { status: 404 }
      );
    }

    const content = await fs.promises.readFile(filePath, "utf-8");
    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error reading lesson file:", error);
    return NextResponse.json(
      { error: "Failed to load lesson content" },
      { status: 500 }
    );
  }
}
