import { NextFunction, Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

export enum UPLOAD_TYPES {
  IMAGE,
}

export const ALLOWED_IMAGE_TYPE = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/jfif",
];

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
});

const validFileTypes = (type: UPLOAD_TYPES) => {
  if (type === UPLOAD_TYPES.IMAGE) {
    return ALLOWED_IMAGE_TYPE;
  }
  return [];
};

export const UploadSingleFile =
  (type: UPLOAD_TYPES, name: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const upload = configuredMulter(type).single("image");

    upload(req, res, async (error) => {
      if (error) {
        return res.send({
          status: false,
          message:
            error?.message || "Something went wrong while uploading asset",
        });
      }
      // const productId = res
      // console.log(res);

      let file: any = req.file;

      // const productId = file.url

      try {
        // Upload the file to Cloudinary
        let result = await cloudinary.v2.uploader.upload(file?.path, {
          folder: "chatApp",
          resource_type: "image",
          upload_preset: "genuaf0u",
        });
        req.url = result.url;

        next();
      } catch (error) {
        console.log(error);
        return res.send({
          status: false,
          error,
        });
      }
    });
  };

/**
 * a configured multer instance
 * @param type
 * @returns
 */

const configuredMulter = (type: UPLOAD_TYPES) => {
  return multer({
    dest: "public",
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
  });
};
