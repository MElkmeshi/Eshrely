import jwt from "jsonwebtoken";
import { Document } from "mongoose";
import { Request, Response, NextFunction } from "express";

export interface UserInterface {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

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

export const isAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      } else {
        req.body.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "No Token" });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.user && req.body.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Admin Token" });
  }
};
