import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "categories.json");

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, "utf8");
    const categories = JSON.parse(fileContents);
    return NextResponse.json(categories);
  } catch (error) {
    // If file doesn't exist or is empty, return empty array
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { label, color, createdBy } = body;

    if (!label || !color) {
      return NextResponse.json({ error: "Label and color are required" }, { status: 400 });
    }

    // Slugify the label to create an ID
    const id = label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newCategory = { id, label, color, createdBy: createdBy || "anonymous" };

    let categories = [];
    try {
      const fileContents = await fs.readFile(dataFilePath, "utf8");
      categories = JSON.parse(fileContents);
    } catch (e) {
      // ignore
    }

    // Check for duplicates
    if (categories.some((c: any) => c.id === id)) {
      return NextResponse.json({ error: "Category already exists" }, { status: 409 });
    }

    categories.push(newCategory);
    await fs.writeFile(dataFilePath, JSON.stringify(categories, null, 2), "utf8");

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
