import AbstractRouter from "../../../abstract/abstract.router";
import { AdminPromotionalController } from "../controllers/adminPromotional.controller";

export class AdminPromotionalRouter extends AbstractRouter {
  private controller = new AdminPromotionalController();
  constructor() {
    super();
    this.callRouter();
  }

  // call router
  private callRouter() {
    // insert promo & get
    this.router
      .route("/promo-code")
      .post(this.controller.insertPromoCode)
      .get(this.controller.getAllPromoCode);

    // update promo code
    this.router.route("/promo-code/:id").patch(this.controller.updatePromoCode);

    // create offer
    this.router
      .route("/offer")
      .post(
        this.uploader.cloudUploadRaw(this.fileFolders.ARTICLE_FILES),
        this.controller.inserOffer
      )
      .get(this.controller.getAllOffer);

    // update offer
    this.router
      .route("/offer/:id")
      .get(this.controller.getSingleOffer)
      .patch(
        this.uploader.cloudUploadRaw(this.fileFolders.ARTICLE_FILES),
        this.controller.updateOffer
      );
  }
}
