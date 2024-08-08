import AbstractRouter from '../../../abstract/abstract.router';
import { AirlineController } from '../controllers/airline.controller';

export class AirlineRouter extends AbstractRouter {
  private controller = new AirlineController();
  constructor() {
    super();
    this.callRouter();
  }

  // call router
  private callRouter() {
        //insert airlines, get airlines
        this.router
        .route('/')
        .post(
          this.uploader.cloudUploadRaw(this.fileFolders.COMMON_FILES),
          this.controller.insertAirlines
        )
        
  
      //update, delete airlines
      this.router
        .route('/:id')
        .patch(
          this.uploader.cloudUploadRaw(this.fileFolders.COMMON_FILES),
          this.controller.updateAirlines
        )
        .delete(this.controller.deleteAirlines);
  }
}
