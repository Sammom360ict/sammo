import { Request, Response } from 'express';
import AbstractController from '../../../abstract/abstract.controller';
import commonService from '../commonService/commonService';
import CommonValidator from '../commonUtils/validators/commonValidator';
import migrateDataService from '../commonService/migrateDataService';

class CommonController extends AbstractController {
  private commonService = new commonService();
  private migrate = new migrateDataService();
  constructor() {
    super();
  }
  //send email otp
  public sendEmailOtpController = this.asyncWrapper.wrap(
    { bodySchema: this.commonValidator.sendOtpInputValidator },
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.commonService.sendOtpToEmailService(
        req
      );
      res.status(code).json(rest);
    }
  );

  // match email otp
  public matchEmailOtpController = this.asyncWrapper.wrap(
    { bodySchema: this.commonValidator.matchEmailOtpInputValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.matchEmailOtpService(
        req
      );

      res.status(code).json(data);
    }
  );

  //get all country
  public getAllCountry = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.getAllCountry(req);
      res.status(code).json(data);
    }
  );

  //get all city
  public getAllCity = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.getAllCity(req);
      res.status(code).json(data);
    }
  );


  //get all airport
  public getAllAirport = this.asyncWrapper.wrap(
    { bodySchema: this.commonValidator.airportFilterSchema },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.getAllAirport(req);
      res.status(code).json(data);
    }
  );


  //airlines list
  public getAllAirlines = this.asyncWrapper.wrap(
    { querySchema: this.commonValidator.airlineFilterSchema },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.getAllAirlines(req);
      res.status(code).json(data);
    }
  );

  //visa list
  public getAllVisaList = this.asyncWrapper.wrap(
    { querySchema: this.commonValidator.visaListSchema },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.getAllVisaList(req);
      res.status(code).json(data);
    }
  );

  //single visa
  public getSingleVisa = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.getSingleVisa(req);
      res.status(code).json(data);
    }
  );


  //migrate data
  public dataMigrate = this.asyncWrapper.wrap(
    null,
    async (_req: Request, res: Response) => {
      const { code, ...data } = await this.migrate.migrateAirlineImage();
      res.status(code).json(data);
    }
  );
}

export default CommonController;
