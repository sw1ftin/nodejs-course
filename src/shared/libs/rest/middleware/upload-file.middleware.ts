import { NextFunction, Request, Response } from 'express';
import multer, { diskStorage } from 'multer';
import { extension } from 'mime-types';
import { nanoid } from 'nanoid';
import { Middleware } from './middleware.interface.js';

export class UploadFileMiddleware implements Middleware {
  private readonly uploadMiddleware: ReturnType<typeof multer>;
  private readonly fieldName: string;

  constructor(
    uploadDirectory: string,
    fieldName: string,
  ) {
    this.fieldName = fieldName;

    const storage = diskStorage({
      destination: uploadDirectory,
      filename: (_req, file, callback) => {
        const fileExtension = extension(file.mimetype);
        const filename = nanoid();
        callback(null, `${filename}.${fileExtension}`);
      }
    });

    this.uploadMiddleware = multer({ storage });
  }

  public execute(req: Request, res: Response, next: NextFunction): void {
    this.uploadMiddleware.single(this.fieldName)(req, res, next);
  }
}

