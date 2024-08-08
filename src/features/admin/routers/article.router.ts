import AbstractRouter from '../../../abstract/abstract.router';
import AdminArticleController from '../controllers/article.controller';

class AdminArticleRouter extends AbstractRouter {
  private AdminArticleController = new AdminArticleController();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {

    //create article, view list of articles
    this.router
    .route('/')
    .post(
        this.uploader.cloudUploadRaw(this.fileFolders.ADMIN_FILES),
        this.AdminArticleController.createArticle
    )
    .get(this.AdminArticleController.getArticleList)

    //get single article, update, delete
    this.router
    .route('/:id')
    .get(this.AdminArticleController.getSingleArticle)
    .patch(this.uploader.cloudUploadRaw(this.fileFolders.ADMIN_FILES),
    this.AdminArticleController.updateArticle)
    .delete(this.AdminArticleController.deleteArticle)
  }
}

export default AdminArticleRouter;
