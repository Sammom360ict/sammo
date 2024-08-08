import config from '../../config/config';
import fs from 'fs';
import CommonAbstractStorage from '../../features/common/commonAbstract/common.abstract.storage';
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { rootFileFolder } from '../../middleware/uploader/uploaderConstants';

class ManageFile extends CommonAbstractStorage {
  constructor() {
    super();
  }
  // delete from cloud
  public deleteFromCloud = async (files: string[]) => {
    try {
      if (files.length) {
        for await (const file of files) {
          const deleteParams = {
            Bucket: config.AWS_S3_BUCKET,
            Key: `${rootFileFolder}/${file}`,
          };

          await this.s3Client.send(new DeleteObjectCommand(deleteParams));
          console.log('file deleted -> ', files);
        }
      }
    } catch (err) {
      console.log({ err });
    }
  };

  // delete from local
  public deleteFromLocal = async (files: string[]) => {
    try {
      if (files.length) {
        for (let i = 0; i < files.length; i++) {
          const path = `${__dirname}/../../../${rootFileFolder}/${files[i]}`;
          await fs.promises.unlink(path);
        }
      } else {
        return;
      }
    } catch (err) {
      console.log({ err });
    }
  };

  // copy file to local
  public copyFileLocal = async (
    source: string,
    target: string,
    file: string
  ) => {
    try {
      const fileSource = `${__dirname}/../../../uploads/${source}/${file}`;
      const fileTarget = `${__dirname}/../../../uploads/${target}/${file}`;

      fs.copyFile(fileSource, fileTarget, (err) => {
        console.log(err);
      });
    } catch (err) {
      console.log(err);
    }
  };

  // copy file to cloud
  public copyFileCloud = async (source: string, target: string) => {
    try {
      const params = {
        Bucket: config.AWS_S3_BUCKET,
        CopySource: `${config.AWS_S3_BUCKET}/${rootFileFolder}/${source}`,
        Key: `${rootFileFolder}/${target}`,
      };

      const copyCommand = new CopyObjectCommand(params);
      const res = await this.s3Client.send(copyCommand);
      return res;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  // get file from cloud
  public getFileCloud = async (file: string) => {
    const params = {
      Bucket: config.AWS_S3_BUCKET,
      Key: `${rootFileFolder}/${file}`,
    };
    const getCommand = new GetObjectCommand(params);

    const res = await this.s3Client.send(getCommand);
    return res;
  };

  // compress file
  // public compressFile = async (imageBuffer: any) => {
  //   try {
  //     const compressedImage = await sharp(imageBuffer)
  //       .jpeg({ quality: 80 })
  //       .resize(200, 200, {
  //         fit: 'inside',
  //         withoutEnlargement: true,
  //         background: { r: 255, g: 255, b: 255, alpha: 1 },
  //       })
  //       .toBuffer();
  //     return compressedImage;
  //   } catch (err) {
  //     console.log(err);
  //     return null;
  //   }
  // };

  // upload file to cloud
  public uploadFileCloud = async (file: any, pathName: string) => {
    try {
      const params = {
        Bucket: config.AWS_S3_BUCKET,
        Key: `${rootFileFolder}/${pathName}`,
        Body: file,
        ACL: 'public-read',
      };
      const putObjectCommand = new PutObjectCommand(params as any);
      const newFile = await this.s3Client.send(putObjectCommand);
      return newFile;
    } catch (err) {
      console.log(err);
      return false;
    }
  };
}

export default ManageFile;
