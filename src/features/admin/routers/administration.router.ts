import AbstractRouter from "../../../abstract/abstract.router";
import AdministrationController from "../controllers/administration.controller";

class AdministrationRouter extends AbstractRouter {
  private AdministrationController = new AdministrationController();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    //create role, view role
    this.router
      .route("/role")
      .post(this.AdministrationController.createRole)
      .get(this.AdministrationController.roleList);

    //create permission, view permission
    this.router
      .route("/permission")
      .post(this.AdministrationController.createPermission)
      .get(this.AdministrationController.permissionList);

    //get role permissions, update role permissions
    this.router
      .route("/role/:id")
      .get(this.AdministrationController.getSingleRolePermission)
      .patch(this.AdministrationController.updateRolePermissions);

    //create admin, view admin
    this.router
      .route("/admin")
      .post(
        this.uploader.cloudUploadRaw(this.fileFolders.ADMIN_FILES),
        this.AdministrationController.createAdmin
      )
      .get(this.AdministrationController.getAllAdmin);

    //get single admin, update admin
    this.router
      .route("/admin/:id")
      .get(this.AdministrationController.getSingleAdmin)
      .patch(
        this.uploader.cloudUploadRaw(this.fileFolders.ADMIN_FILES),
        this.AdministrationController.updateAdmin
      );

    //create city
    this.router.route("/city").post(this.AdministrationController.createCity);

    // insert visa type
    this.router
      .route("/visa-type")
      .post(this.AdministrationController.insertVisaType)
      .get(this.AdministrationController.getAllVisaType);

    // delete visa type
    this.router
      .route("/visa-type/:id")
      .delete(this.AdministrationController.deleteVisaType);

    // insert visa mode
    this.router
      .route("/visa-mode")
      .post(this.AdministrationController.insertVisaMode)
      .get(this.AdministrationController.getAllVisaMode);

    // delete visa type
    this.router
      .route("/visa-mode/:id")
      .delete(this.AdministrationController.deleteVisaMode);
  }
}

export default AdministrationRouter;
