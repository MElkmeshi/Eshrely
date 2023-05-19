import express, { Request, Response } from "express";
import path from "path";
import fileUpload, { UploadedFile } from "express-fileupload";

const uploadRouter = express.Router();
uploadRouter.use(fileUpload());
uploadRouter.post("/", async (req: Request, res: Response) => {
  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }
  let file = req.files.file as UploadedFile;
  let ext = path.extname(file.name);
  let filename = Date.now() + ext;
  let uploadPath = "../frontend/images/" + filename;
  file.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);
    res.send({ file: filename, url: `/images/${filename}` });
  });
});

export default uploadRouter;
