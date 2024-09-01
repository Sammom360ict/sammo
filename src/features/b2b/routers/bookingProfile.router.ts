import AbstractRouter from "../../../abstract/abstract.router";
import BookingProfileController from "../controllers/bookingProfile.controller";

export default class BookingProfileRouter extends AbstractRouter {
  private ProfileController = new BookingProfileController();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    //view profile, edit profile
    this.router
      .route("/")
      .get(this.ProfileController.getProfile)
      .patch(
        this.uploader.cloudUploadRaw(this.fileFolders.AGENCY_USER),
        this.ProfileController.editProfile
      );

    //change password
    this.router
      .route("/change-password")
      .post(this.ProfileController.changePassword);
  }
}
