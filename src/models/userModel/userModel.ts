import { TDB } from "../../features/common/commonUtils/types/commonTypes";
import {
  IGetUserListFilter,
  IRegisterUser,
  IUpdateUserProfile,
} from "../../utils/interfaces/user/userInterface";
import Schema from "../../utils/miscellaneous/schema";

class UserModel extends Schema {
  private db: TDB;

  constructor(db: TDB) {
    super();
    this.db = db;
  }

  //register
  public async registerUser(payload: IRegisterUser) {
    return await this.db("users")
      .withSchema(this.BTOC_SCHEMA)
      .insert(payload, "id");
  }

  //profile
  public async getProfileDetails(params: {
    id?: number;
    email?: string;
    phone_number?: string;
    username?: string;
  }) {
    return await this.db("users")
      .withSchema(this.BTOC_SCHEMA)
      .select("*")
      .where((qb) => {
        if (params.id) {
          qb.where("id", params.id);
        }
        if (params.email) {
          qb.orWhere("email", params.email);
        }
        if (params.phone_number) {
          qb.orWhere("phone_number", params.phone_number);
        }
        if (params.username) {
          qb.orWhere("username", params.username);
        }
      });
  }

  //update
  public async updateProfile(
    payload: IUpdateUserProfile,
    where: { id?: number }
  ) {
    return await this.db("users")
      .withSchema(this.BTOC_SCHEMA)
      .update(payload)
      .where((qb) => {
        if (where.id) {
          qb.where("id", where.id);
        }
      });
  }

  //list
  public async list(query: IGetUserListFilter, is_total: boolean = false) {
    const data = await this.db("users")
      .withSchema(this.BTOC_SCHEMA)
      .select(
        "id",
        "username",
        "first_name",
        "last_name",
        "email",
        "photo",
        "status",
        "phone_number"
      )
      .where((qb) => {
        if (query.status !== undefined) {
          qb.where("status", query.status);
        }
        if (query.filter) {
          qb.andWhere((qbc) => {
            qbc.whereILike("username", `%${query.filter}%`);
            qbc.orWhereILike("email", `%${query.filter}%`);
            qbc.orWhereILike("phone_number", `%${query.filter}%`);
            qbc.orWhereRaw(
              "LOWER(first_name || ' ' || last_name) LIKE LOWER(?)",
              [
                `%${
                  query.filter ? query.filter.toLocaleLowerCase() : undefined
                }%`,
              ]
            );
          });
        }
      })
      .orderBy("id", "desc")
      .limit(query.limit || 100)
      .offset(query.skip || 0);

    let total: any[] = [];
    if (is_total) {
      total = await this.db("users")
        .withSchema(this.BTOC_SCHEMA)
        .count("id as total")
        .where((qb) => {
          if (query.status !== undefined) {
            qb.where("status", query.status);
          }
          if (query.filter) {
            qb.andWhere((qbc) => {
              qbc.whereILike("username", `%${query.filter}%`);
              qbc.orWhereILike("email", `%${query.filter}%`);
              qbc.orWhereILike("phone_number", `%${query.filter}%`);
              qbc.orWhereRaw(
                "LOWER(first_name || ' ' || last_name) LIKE LOWER(?)",
                [
                  `%${
                    query.filter ? query.filter.toLocaleLowerCase() : undefined
                  }%`,
                ]
              );
            });
          }
        });
    }
    return {
      data: data,
      total: total[0]?.total,
    };
  }
}
export default UserModel;
