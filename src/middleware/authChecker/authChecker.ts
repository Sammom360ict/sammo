import { NextFunction, Request, Response } from "express";
import StatusCode from "../../utils/miscellaneous/statusCode";
import ResMsg from "../../utils/miscellaneous/responseMessage";
import Lib from "../../utils/lib/lib";
import config from "../../config/config";
import {
  IAdmin,
  IB2BAgencyUser,
  IUser,
} from "../../features/common/commonUtils/types/commonTypes";

class AuthChecker {
  // admin auth checker
  public adminAuthChecker = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return res
        .status(StatusCode.HTTP_UNAUTHORIZED)
        .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    }

    const authSplit = authorization.split(" ");

    if (authSplit.length !== 2) {
      return res.status(StatusCode.HTTP_UNAUTHORIZED).json({
        success: false,
        message: ResMsg.HTTP_UNAUTHORIZED,
      });
    }

    const verify = Lib.verifyToken(
      authSplit[1],
      config.JWT_SECRET_ADMIN
    ) as IAdmin;

    if (!verify) {
      return res
        .status(StatusCode.HTTP_UNAUTHORIZED)
        .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    } else {
      // if (verify.type !== 'admin' || verify.status === 0) {
      //   return res.status(StatusCode.HTTP_UNAUTHORIZED).json({
      //     success: false,
      //     message: ResMsg.HTTP_UNAUTHORIZED,
      //   });
      // } else {
      //   req.admin = verify as IAdmin;
      //   next();
      // }
      if (verify.status === false) {
        return res.status(StatusCode.HTTP_UNAUTHORIZED).json({
          success: false,
          message: ResMsg.HTTP_UNAUTHORIZED,
        });
      } else {
        req.admin = verify as IAdmin;
        next();
      }
    }
  };

  // user auth checker
  public userAuthChecker = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return res
        .status(StatusCode.HTTP_UNAUTHORIZED)
        .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    }

    const authSplit = authorization.split(" ");

    if (authSplit.length !== 2) {
      return res.status(StatusCode.HTTP_UNAUTHORIZED).json({
        success: false,
        message: ResMsg.HTTP_UNAUTHORIZED,
      });
    }

    const verify = Lib.verifyToken(
      authSplit[1],
      config.JWT_SECRET_USER
    ) as IUser;

    if (!verify) {
      return res
        .status(StatusCode.HTTP_UNAUTHORIZED)
        .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    } else {
      if (verify.status === false) {
        return res.status(StatusCode.HTTP_UNAUTHORIZED).json({
          success: false,
          message: ResMsg.HTTP_UNAUTHORIZED,
        });
      } else {
        req.user = verify as IUser;
        console.log({ user: req.user });
        next();
      }
    }
  };

  // user public auth checker
  public userPublicAuthChecker = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { authorization } = req.headers;
    console.log(req.headers);
    if (!authorization) {
      next();
    } else {
      const authSplit = authorization.split(" ");

      if (authSplit.length !== 2) {
        return res.status(StatusCode.HTTP_UNAUTHORIZED).json({
          success: false,
          message: ResMsg.HTTP_UNAUTHORIZED,
        });
      }

      const verify = Lib.verifyToken(
        authSplit[1],
        config.JWT_SECRET_USER
      ) as IUser;

      if (!verify) {
        return res
          .status(StatusCode.HTTP_UNAUTHORIZED)
          .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
      } else {
        if (verify.status === false) {
          return res.status(StatusCode.HTTP_UNAUTHORIZED).json({
            success: false,
            message: ResMsg.HTTP_UNAUTHORIZED,
          });
        } else {
          req.user = verify as IUser;
          console.log({ user: req.user });
          next();
        }
      }
    }
  };

  // b2b auth checker
  public b2bAuthChecker = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return res
        .status(StatusCode.HTTP_UNAUTHORIZED)
        .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    }

    const authSplit = authorization.split(" ");

    if (authSplit.length !== 2) {
      return res.status(StatusCode.HTTP_UNAUTHORIZED).json({
        success: false,
        message: ResMsg.HTTP_UNAUTHORIZED,
      });
    }

    const verify = Lib.verifyToken(
      authSplit[1],
      config.JWT_SECRET_ADMIN
    ) as IB2BAgencyUser;

    if (!verify) {
      return res
        .status(StatusCode.HTTP_UNAUTHORIZED)
        .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    } else {
      if (verify.user_status == false || verify.agency_status == false) {
        return res.status(StatusCode.HTTP_UNAUTHORIZED).json({
          success: false,
          message: ResMsg.HTTP_FORBIDDEN,
        });
      } else {
        req.agency = verify as IB2BAgencyUser;
        next();
      }
    }
  };
}

export default AuthChecker;
