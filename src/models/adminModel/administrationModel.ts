import { TDB } from '../../features/common/commonUtils/types/commonTypes';
import {
  IPermission,
  IRole,
} from '../../utils/interfaces/admin/administrationInterface';
import Schema from '../../utils/miscellaneous/schema';

class AdministrationModel extends Schema {
  private db: TDB;

  constructor(db: TDB) {
    super();
    this.db = db;
  }

  //---Role---

  public async createRole(payload: IRole) {
    return await this.db('roles')
      .withSchema(this.ADMIN_SCHEMA)
      .insert(payload, 'id');
  }

  public async roleList(limit?: number, skip?: number, total: boolean = false) {
    const data = await this.db('roles as rl')
      .withSchema(this.ADMIN_SCHEMA)
      .select(
        'rl.id as role_id',
        'rl.name as role_name',
        'ua.username as created_by',
        'rl.create_date'
      )
      .join('user_admin as ua', 'ua.id', 'rl.created_by')
      .limit(limit ? limit : 100)
      .offset(skip ? skip : 0)
      .orderBy('rl.id', 'asc');

    let count: any[] = [];
    if (total) {
      count = await this.db('roles as rl')
        .withSchema(this.ADMIN_SCHEMA)
        .count('rl.id as total')
        .join('user_admin as ua', 'ua.id', 'rl.created_by');
    }

    return { data, total: count[0]?.total };
  }

  public async getSingleRole(
    id?: number,
    name?: string,
    permission_id?: number
  ) {
    return await this.db('roles as rol')
      .withSchema(this.ADMIN_SCHEMA)
      .select('per.id','per.name as permissions')
      .leftJoin('role_permissions as rp', 'rp.role_id', 'rol.id')
      .leftJoin('permissions as per', 'rp.permission_id', 'per.id')
      .where((qb) => {
        if (id) {
          qb.where('rol.id', id);
        }
        if (name) {
          qb.where('rol.name', name);
        }
        if (permission_id) {
          qb.andWhere('per.id', permission_id);
        }
      });
  }

  //---Permission---
  public async createPermission(payload: IPermission) {
    return await this.db('permissions')
      .withSchema(this.ADMIN_SCHEMA)
      .insert(payload, 'id');
  }

  public async permissionsList(
    params: { name?: string; limit?: number; skip?: number },
    total: boolean = false
  ) {
    const data = await this.db('permissions as per')
      .withSchema(this.ADMIN_SCHEMA)
      .select(
        'per.id as permission_id',
        'per.name as permission_name',
        'ua.username as created_by',
        'per.create_date'
      )
      .join('user_admin as ua', 'ua.id', 'per.created_by')
      .limit(params.limit ? params.limit : 100)
      .offset(params.skip ? params.skip : 0)
      .orderBy('per.id', 'asc')
      .where((qb) => {
        if (params.name) {
          qb.where('per.name', params.name);
        }
      });

    let count: any[] = [];
    if (total) {
      count = await this.db('permissions')
        .withSchema(this.ADMIN_SCHEMA)
        .count('id as total')
        .where((qb) => {
          if (params.name) {
            qb.where('name', params.name);
          }
        });
    }

    return { data, total: count[0]?.total };
  }

  //---Role Permission---
  public async createRolePermission(payload: {
    role_id: number;
    permission_id: number;
  }) {
    return await this.db('role_permissions')
      .withSchema(this.ADMIN_SCHEMA)
      .insert(payload, 'role_id');
  }

  public async deleteRolePermission(payload: {
    role_id: number;
    permission_id: number;
  }) {
    return await this.db('role_permissions')
      .withSchema(this.ADMIN_SCHEMA)
      .delete()
      .where('role_id', payload.role_id)
      .andWhere('permission_id', payload.permission_id);
  }
  public async getRolePermissions(role_id: number, permission_id: number) {
    return await this.db('role_permissions')
      .withSchema(this.ADMIN_SCHEMA)
      .where({ role_id })
      .andWhere({ permission_id });
  }
}
export default AdministrationModel;
