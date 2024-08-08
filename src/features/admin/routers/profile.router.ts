import AbstractRouter from '../../../abstract/abstract.router';
import AdminProfileController from '../controllers/profile.controller';

class AdminProfileRouter extends AbstractRouter {
  private ProfileController = new AdminProfileController();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    //view profile, edit profile
    this.router
      .route('/')
      .get(this.ProfileController.getProfile)
      .patch(
        this.uploader.cloudUploadRaw(this.fileFolders.ADMIN_FILES),
        this.ProfileController.editProfile
      );

    //change password
    this.router
      .route('/change-password')
      .post(
        this.ProfileController.changePassword
      );
  }
}

export default AdminProfileRouter;
