import { Request, Response } from 'express';
import AbstractController from '../../../abstract/abstract.controller';
import AdminProfileService from '../services/profile.service';
import AdministrationService from '../services/administration.service';
import AdministrationValidator from '../utils/validators/administration.validator';

class AdministrationController extends AbstractController {
  private AdministrationService = new AdministrationService();
  private AdministrationValidator = new AdministrationValidator();

  constructor() {
    super();
  }

  //create role
  public createRole = this.asyncWrapper.wrap(
    { bodySchema: this.AdministrationValidator.createRole },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.AdministrationService.createRole(
        req
      );
      res.status(code).json(data);
    }
  );

  //role list
  public roleList = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.AdministrationService.roleList(req);
      res.status(code).json(data);
    }
  );

  //create permission
  public createPermission = this.asyncWrapper.wrap(
    { bodySchema: this.AdministrationValidator.createPermission },
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.AdministrationService.createPermission(req);
      res.status(code).json(data);
    }
  );

  //permission list
  public permissionList = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.AdministrationService.permissionList(
        req
      );
      res.status(code).json(data);
    }
  );

  //get single role permission
  public getSingleRolePermission = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.AdministrationService.getSingleRolePermission(req);
      res.status(code).json(data);
    }
  );

  //update role permission
  public updateRolePermissions = this.asyncWrapper.wrap(
    {
      paramSchema: this.commonValidator.singleParamValidator,
      bodySchema: this.AdministrationValidator.updateRolePermissions,
    },
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.AdministrationService.updateRolePermissions(req);
      res.status(code).json(data);
    }
  );

  //create admin
  public createAdmin = this.asyncWrapper.wrap(
    {
      bodySchema: this.AdministrationValidator.createAdmin,
    },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.AdministrationService.createAdmin(
        req
      );
      res.status(code).json(data);
    }
  );

  //get all admin
  public getAllAdmin = this.asyncWrapper.wrap(
    { querySchema: this.AdministrationValidator.getAllAdminQueryValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.AdministrationService.getAllAdmin(
        req
      );
      res.status(code).json(data);
    }
  );

  //get single admin
  public getSingleAdmin = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.AdministrationService.getSingleAdmin(
        req
      );
      res.status(code).json(data);
    }
  );

  //update admin
  public updateAdmin = this.asyncWrapper.wrap(
    { bodySchema: this.AdministrationValidator.updateAdmin },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.AdministrationService.updateAdmin(req);
      res.status(code).json(data);
    }
  )

  //get users
  public getUsers = this.asyncWrapper.wrap(
    { querySchema: this.AdministrationValidator.getUsersFilterValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.AdministrationService.getUsers(req);
      res.status(code).json(data);
    }
  )

  //get user single
  public getSingleUser = this.asyncWrapper.wrap(
    { paramSchema:this.commonValidator.singleParamValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.AdministrationService.getSingleUser(req);
      res.status(code).json(data);
    }
  )

    //edit user profile
    public editUserProfile = this.asyncWrapper.wrap(
      {paramSchema:this.commonValidator.singleParamValidator, bodySchema: this.AdministrationValidator.editUserProfileValidator },
      async (req: Request, res: Response) => {
        const { code, ...data } = await this.AdministrationService.editUserProfile(req);
        res.status(code).json(data);
      }
    );

    //create city
    public createCity = this.asyncWrapper.wrap(
      {bodySchema: this.AdministrationValidator.createCityValidator },
      async (req: Request, res: Response) => {
        const { code, ...data } = await this.AdministrationService.createCity(req);
        res.status(code).json(data);
      }
    );
}

export default AdministrationController;
