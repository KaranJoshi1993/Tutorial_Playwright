import dotenv from "dotenv";
dotenv.config();

export const email = process.env.EMAIL || "";
export const password = process.env.PASSWORD || "";
export const wrongemail = process.env.WRONGEMAIL || "";
export const wrongpassword = process.env.WRONGPASSWORD || "";
