import AbstractServices from "../../../abstract/abstract.service";
import { Request } from "express";
import Lib from "../../../utils/lib/lib";

class AdministrationService extends AbstractServices {
  //create role
  public async createRole(req: Request) {
    const { id } = req.admin;
    const model = this.Model.administrationModel();
    const { role_name } = req.body;
    const check_name = await model.getSingleRole(undefined, role_name);
    if (check_name.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_CONFLICT,
        message: this.ResMsg.ROLE_NAME_EXIST,
      };
    }
    const create_role = await model.createRole({
      name: role_name,
      created_by: id,
    });
    if (create_role.length) {
      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: this.ResMsg.HTTP_SUCCESSFUL,
      };
    } else {
      return {
        success: false,
        code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
        message: this.ResMsg.HTTP_INTERNAL_SERVER_ERROR,
      };
    }
  }

  //role list
  public async roleList(req: Request) {
    const { limit, skip } = req.query;
    const model = this.Model.administrationModel();
    const role_list = await model.roleList(Number(limit), Number(skip), true);
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total: role_list.total,
      data: role_list.data,
    };
  }

  //create permission
  public async createPermission(req: Request) {
    const { id } = req.admin;
    const model = this.Model.administrationModel();
    const check_name = await model.permissionsList({
      name: req.body.permission_name,
    });
    if (check_name.data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_CONFLICT,
        message: this.ResMsg.PERMISSION_NAME_EXIST,
      };
    }
    const create_permission = await model.createPermission({
      name: req.body.permission_name,
      created_by: id,
    });
    if (create_permission.length) {
      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: this.ResMsg.HTTP_SUCCESSFUL,
      };
    } else {
      return {
        success: false,
        code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
        message: this.ResMsg.HTTP_INTERNAL_SERVER_ERROR,
      };
    }
  }

  //permission list
  public async permissionList(req: Request) {
    const { limit, skip } = req.query;
    const model = this.Model.administrationModel();
    const permission_list = await model.permissionsList(
      { limit: Number(limit), skip: Number(skip) },
      true
    );
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total: permission_list.total,
      data: permission_list.data,
    };
  }

  //get single role permission
  public async getSingleRolePermission(req: Request) {
    const role_id = req.params.id;
    const model = this.Model.administrationModel();
    const role_permission = await model.getSingleRole(Number(role_id));
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      data: role_permission,
    };
  }

  //update role permission
  public async updateRolePermissions(req: Request) {
    return await this.db.transaction(async (trx) => {
      const role_id = req.params.id;
      const model = this.Model.administrationModel(trx);
      const { add_permissions, remove_permissions } = req.body;
      if (add_permissions && add_permissions.length) {
        for (const add_permission of add_permissions) {
          const check_role_permission = await model.getRolePermissions(
            Number(role_id),
            Number(add_permission)
          );
          console.log(check_role_permission);
          if (check_role_permission.length) {
            await trx.rollback({
              success: false,
              code: this.StatusCode.HTTP_CONFLICT,
              message: this.ResMsg.PERMISSION_EXISTS_FOR_ROLE,
            });
          }
          await model.createRolePermission({
            role_id: Number(role_id),
            permission_id: add_permission,
          });
        }
      }
      if (remove_permissions && remove_permissions.length) {
        for (const remove_permission of remove_permissions) {
          const check_role_permission = await model.getRolePermissions(
            Number(role_id),
            Number(remove_permission)
          );
          if (!check_role_permission.length) {
            await trx.rollback({
              success: false,
              code: this.StatusCode.HTTP_NOT_FOUND,
              message: this.ResMsg.PERMISSION_NOT_FOUND_FOR_ROLE,
            });
          }
          await model.deleteRolePermission({
            role_id: Number(role_id),
            permission_id: remove_permission,
          });
        }
      }
      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: this.ResMsg.HTTP_OK,
      };
    });
  }

  public async createAdmin(req: Request) {
    const { id } = req.admin;
    const files = (req.files as Express.Multer.File[]) || [];
    if (files?.length) {
      req.body[files[0].fieldname] = files[0].filename;
    }
    const { password, email, phone_number, username, ...rest } = req.body;
    const model = this.Model.adminModel();

    //check admins email and phone number
    const check_admin = await model.getSingleAdmin({
      email,
    });

    if (check_admin.length) {
      if (check_admin[0].email === email) {
        return {
          success: false,
          code: this.StatusCode.HTTP_BAD_REQUEST,
          message: this.ResMsg.EMAIL_EXISTS,
        };
      }
    }

    const getLastAdminID = await model.getLastAdminID();
    rest.email = email;
    rest.phone_number = phone_number;
    rest.created_by = id;
    rest.username = username.split(" ").join("") + getLastAdminID;
    //password hashing
    const hashedPass = await Lib.hashPass(password);
    //create admin
    const create_admin = await model.createAdmin({
      password_hash: hashedPass,
      ...rest,
    });

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: this.ResMsg.HTTP_SUCCESSFUL,
    };
  }

  //get all admin
  public async getAllAdmin(req: Request) {
    const model = this.Model.adminModel();
    const data = await model.getAllAdmin(req.query, true);
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      total: data.total,
      data: data.data,
    };
  }

  //get single admin
  public async getSingleAdmin(req: Request) {
    const id = req.params.id;
    const model = this.Model.adminModel();
    const data = await model.getSingleAdmin({ id: Number(id) });
    if (data.length) {
      delete data[0].password_hash;
    }
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: data[0],
    };
  }

  //update admin
  public async updateAdmin(req: Request) {
    const id = req.params.id;
    const model = this.Model.adminModel();
    const files = (req.files as Express.Multer.File[]) || [];
    if (files?.length) {
      req.body[files[0].fieldname] = files[0].filename;
    }
    if (req.body.username) {
      const check_username = await model.getSingleAdmin({
        username: req.body.username,
      });
      if (check_username.length) {
        if (Number(check_username[0].id) !== Number(id)) {
          return {
            success: false,
            code: this.StatusCode.HTTP_CONFLICT,
            message: this.ResMsg.USERNAME_EXISTS,
          };
        }
      }
    }
    if (req.body.phone_number) {
      const check_phone = await model.getSingleAdmin({
        phone_number: req.body.phone_number,
      });
      if (check_phone.length) {
        if (Number(check_phone[0].id) !== Number(id)) {
          return {
            success: false,
            code: this.StatusCode.HTTP_CONFLICT,
            message: this.ResMsg.PHONE_EXISTS,
          };
        }
      }
    }
    const res = await model.updateUserAdmin(req.body, { id: Number(id) });
    if (res) {
      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        data: req.body,
      };
    } else {
      return {
        success: false,
        code: this.StatusCode.HTTP_BAD_REQUEST,
        message: this.ResMsg.HTTP_BAD_REQUEST,
      };
    }
  }

  //get users
  public async getUsers(req: Request) {
    const model = this.Model.userModel();
    const data = await model.list(req.query, true);
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: data.data,
      total: data.total,
    };
  }

  //get user details
  public async getSingleUser(req: Request) {
    const id = Number(req.params.id);
    const model = this.Model.userModel();
    const data = await model.getProfileDetails({ id });
    if (!data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }
    const { password_hash, ...rest } = data[0];
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: rest,
    };
  }

  //edit user profile
  public async editUserProfile(req: Request) {
    const { id } = req.params;
    const files = (req.files as Express.Multer.File[]) || [];
    if (files?.length) {
      req.body[files[0].fieldname] = files[0].filename;
    }
    const { username, first_name, last_name, gender, photo, status } = req.body;
    const model = this.Model.userModel();
    if (req.body.username) {
      const check_username = await model.getProfileDetails({
        username: req.body.username,
      });
      if (check_username.length) {
        if (Number(check_username[0].id) !== Number(id)) {
          return {
            success: false,
            code: this.StatusCode.HTTP_CONFLICT,
            message: this.ResMsg.USERNAME_EXISTS,
          };
        }
      }
    }
    const update_profile = await model.updateProfile(
      { username, first_name, last_name, gender, photo, status },
      { id: Number(id) }
    );
    if (update_profile) {
      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: this.ResMsg.HTTP_OK,
        data: req.body,
      };
    } else {
      return {
        success: false,
        code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
        message: this.ResMsg.HTTP_INTERNAL_SERVER_ERROR,
      };
    }
  }

  //create city
  public async createCity(req: Request) {
    const model = await this.Model.commonModel();
    const data = await model.getAllCity(
      req.body.country_id,
      1,
      0,
      undefined,
      req.body.name
    );
    if (data.length) {
      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        data: data[0].id,
      };
    }
    const res = await model.insertCity(req.body);
    if (res.length) {
      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        data: res[0].id,
      };
    } else {
      return {
        success: false,
        code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
        message: this.ResMsg.HTTP_INTERNAL_SERVER_ERROR,
      };
    }
  }
}

export default AdministrationService;
