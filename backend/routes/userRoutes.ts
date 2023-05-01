import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel";
const userRouter = express.Router();
import bcryptjs from "bcryptjs";
import { generateToken } from "../utils";

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

export default userRouter;
