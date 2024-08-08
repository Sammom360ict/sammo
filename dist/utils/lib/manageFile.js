"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config/config"));
const fs_1 = __importDefault(require("fs"));
const common_abstract_storage_1 = __importDefault(require("../../features/common/commonAbstract/common.abstract.storage"));
const client_s3_1 = require("@aws-sdk/client-s3");
const uploaderConstants_1 = require("../../middleware/uploader/uploaderConstants");
class ManageFile extends common_abstract_storage_1.default {
    constructor() {
        super();
        // delete from cloud
        this.deleteFromCloud = (files) => __awaiter(this, void 0, void 0, function* () {
            var _a, files_1, files_1_1;
            var _b, e_1, _c, _d;
            try {
                if (files.length) {
                    try {
                        for (_a = true, files_1 = __asyncValues(files); files_1_1 = yield files_1.next(), _b = files_1_1.done, !_b; _a = true) {
                            _d = files_1_1.value;
                            _a = false;
                            const file = _d;
                            const deleteParams = {
                                Bucket: config_1.default.AWS_S3_BUCKET,
                                Key: `${uploaderConstants_1.rootFileFolder}/${file}`,
                            };
                            yield this.s3Client.send(new client_s3_1.DeleteObjectCommand(deleteParams));
                            console.log('file deleted -> ', files);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (!_a && !_b && (_c = files_1.return)) yield _c.call(files_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
            }
            catch (err) {
                console.log({ err });
            }
        });
        // delete from local
        this.deleteFromLocal = (files) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (files.length) {
                    for (let i = 0; i < files.length; i++) {
                        const path = `${__dirname}/../../../${uploaderConstants_1.rootFileFolder}/${files[i]}`;
                        yield fs_1.default.promises.unlink(path);
                    }
                }
                else {
                    return;
                }
            }
            catch (err) {
                console.log({ err });
            }
        });
        // copy file to local
        this.copyFileLocal = (source, target, file) => __awaiter(this, void 0, void 0, function* () {
            try {
                const fileSource = `${__dirname}/../../../uploads/${source}/${file}`;
                const fileTarget = `${__dirname}/../../../uploads/${target}/${file}`;
                fs_1.default.copyFile(fileSource, fileTarget, (err) => {
                    console.log(err);
                });
            }
            catch (err) {
                console.log(err);
            }
        });
        // copy file to cloud
        this.copyFileCloud = (source, target) => __awaiter(this, void 0, void 0, function* () {
            try {
                const params = {
                    Bucket: config_1.default.AWS_S3_BUCKET,
                    CopySource: `${config_1.default.AWS_S3_BUCKET}/${uploaderConstants_1.rootFileFolder}/${source}`,
                    Key: `${uploaderConstants_1.rootFileFolder}/${target}`,
                };
                const copyCommand = new client_s3_1.CopyObjectCommand(params);
                const res = yield this.s3Client.send(copyCommand);
                return res;
            }
            catch (err) {
                console.log(err);
                return false;
            }
        });
        // get file from cloud
        this.getFileCloud = (file) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                Bucket: config_1.default.AWS_S3_BUCKET,
                Key: `${uploaderConstants_1.rootFileFolder}/${file}`,
            };
            const getCommand = new client_s3_1.GetObjectCommand(params);
            const res = yield this.s3Client.send(getCommand);
            return res;
        });
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
        this.uploadFileCloud = (file, pathName) => __awaiter(this, void 0, void 0, function* () {
            try {
                const params = {
                    Bucket: config_1.default.AWS_S3_BUCKET,
                    Key: `${uploaderConstants_1.rootFileFolder}/${pathName}`,
                    Body: file,
                    ACL: 'public-read',
                };
                const putObjectCommand = new client_s3_1.PutObjectCommand(params);
                const newFile = yield this.s3Client.send(putObjectCommand);
                return newFile;
            }
            catch (err) {
                console.log(err);
                return false;
            }
        });
    }
}
exports.default = ManageFile;
