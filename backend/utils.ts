import jwt from "jsonwebtoken";
import { UserInterface } from "./src/data";
import { Document } from "mongoose";

export interface UserInterfaceWithDocument extends UserInterface, Document {}

export function generateToken(user: UserInterfaceWithDocument) {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
}
