import { db } from '../app/database';
import Models from '../models/rootModel';
import ManageFile from '../utils/lib/manageFile';
import ResMsg from '../utils/miscellaneous/responseMessage';
import Schema from '../utils/miscellaneous/schema';
import StatusCode from '../utils/miscellaneous/statusCode';

abstract class AbstractServices {
  protected db = db;
  protected manageFile = new ManageFile();
  protected ResMsg = ResMsg;
  protected StatusCode = StatusCode;
  protected Model = new Models();
  protected schema = new Schema();
}

export default AbstractServices;
