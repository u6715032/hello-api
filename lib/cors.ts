import { NextResponse } from "next/server";

export function cors(response = NextResponse.next()) {
  response.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}
