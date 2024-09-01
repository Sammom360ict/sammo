import AbstractRouter from "../../../abstract/abstract.router";
import { AdminBtocController } from "../controllers/admin.btoc.controller";

export class AdminBtocRouter extends AbstractRouter {
  private controller = new AdminBtocController();
  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    //get users
    this.router.route("/users").get(this.controller.getUsers);
    //get user single
    this.router
      .route("/users/:id")
      .get(this.controller.getSingleUser)
      .patch(
        this.uploader.cloudUploadRaw(this.fileFolders.USER_FILES),
        this.controller.editUserProfile
      );
  }
}
