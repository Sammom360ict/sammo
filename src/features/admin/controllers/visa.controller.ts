import { Request, Response } from 'express';
import AbstractController from '../../../abstract/abstract.controller';
import { AdminVisaValidator } from '../utils/validators/visa.validator';
import { AdminVisaService } from '../services/visa.service';

export class AdminVisaController extends AbstractController {
    private validator = new AdminVisaValidator();
    private service = new AdminVisaService();

    //create visa
    public createVisa = this.asyncWrapper.wrap(
        { bodySchema: this.validator.CreateVisaSchema },
        async (req: Request, res: Response) => {
            const { code, ...data } = await this.service.createVisa(req);
            res.status(code).json(data);
        }
    );

    //get visa
    public getVisa = this.asyncWrapper.wrap(
        { querySchema: this.validator.GetVisaSchema },
        async (req: Request, res: Response) => {
            const { code, ...data } = await this.service.getVisa(req);
            res.status(code).json(data);
        }
    );

    //get single visa
    public getSingleVisa = this.asyncWrapper.wrap(
        { paramSchema: this.commonValidator.singleParamValidator },
        async (req: Request, res: Response) => {
            const { code, ...data } = await this.service.getSingleVisa(req);
            res.status(code).json(data);
        }
    );

    //update visa
    public updateVisa = this.asyncWrapper.wrap(
        {
            paramSchema: this.commonValidator.singleParamValidator,
            bodySchema: this.validator.UpdateVisaSchema
        },
        async (req: Request, res: Response) => {
            const { code, ...data } = await this.service.updateVisa(req);
            res.status(code).json(data);
        }
    );

    //get B2C applications
    public getB2CApplications = this.asyncWrapper.wrap(
        { querySchema: this.validator.VisaApplicationFilterSchema },
        async (req: Request, res: Response) => {
            const { code, ...data } = await this.service.getB2CApplications(req);
            res.status(code).json(data);
        }
    );

    //get B2C applications
    public getB2CSingleApplication = this.asyncWrapper.wrap(
        { paramSchema: this.commonValidator.singleParamValidator },
        async (req: Request, res: Response) => {
            const { code, ...data } = await this.service.getB2CSingleApplication(req);
            res.status(code).json(data);
        }
    );

    //create B2C tracking of application
    public createB2CTrackingOfApplication = this.asyncWrapper.wrap(
        {
            paramSchema: this.commonValidator.singleParamValidator,
            bodySchema: this.validator.VisaTrackingPayloadSchema
        },
        async (req: Request, res: Response) => {
            const { code, ...data } = await this.service.createB2CTrackingOfApplication(req);
            res.status(code).json(data);
        }
    );


    //get B2B applications
    public getB2BApplications = this.asyncWrapper.wrap(
        { querySchema: this.validator.VisaApplicationFilterSchema },
        async (req: Request, res: Response) => {
            const { code, ...data } = await this.service.getB2BApplications(req);
            res.status(code).json(data);
        }
    );

    //get B2B applications
    public getB2BSingleApplication = this.asyncWrapper.wrap(
        { paramSchema: this.commonValidator.singleParamValidator },
        async (req: Request, res: Response) => {
            const { code, ...data } = await this.service.getB2BSingleApplication(req);
            res.status(code).json(data);
        }
    );

    //create B2B tracking of application
    public createB2BTrackingOfApplication = this.asyncWrapper.wrap(
        {
            paramSchema: this.commonValidator.singleParamValidator,
            bodySchema: this.validator.VisaTrackingPayloadSchema
        },
        async (req: Request, res: Response) => {
            const { code, ...data } = await this.service.createB2BTrackingOfApplication(req);
            res.status(code).json(data);
        }
    );

}