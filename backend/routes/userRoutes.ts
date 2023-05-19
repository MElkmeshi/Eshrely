import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel";
const userRouter = express.Router();
import bcryptjs from "bcryptjs";
import { generateToken, isAdmin, isAuth } from "../utils";

userRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: Request, res: Response) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcryptjs.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

userRouter.post(
  "/signup",
  expressAsyncHandler(async (req: Request, res: Response) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcryptjs.hashSync(req.body.password),
    });
    const createdUser = await user.save();
    res.send({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
      token: generateToken(createdUser),
    });
  })
);
userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.body.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcryptjs.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);
userRouter.get(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === "elkmeshi2002@gmail.com") {
        res.status(400).send({ message: "Can Not Delete Founder User" });
        return;
      }
      await user.deleteOne();
      res.send({ message: "User Deleted" });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);
userRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      const updatedUser = await user.save();
      res.send({ message: "User Updated", user: updatedUser });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

export default userRouter;
