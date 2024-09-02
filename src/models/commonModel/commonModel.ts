import { TDB } from "../../features/common/commonUtils/types/commonTypes";
import {
  ICreateAirlinesPayload,
  ICreateAirportPayload,
  IGetOTPPayload,
  IInsertOTPPayload,
  IUpdateAirlinesPayload,
  IUpdateAirportPayload,
} from "../../utils/interfaces/common/commonInterface";
import CustomError from "../../utils/lib/customError";
import Schema from "../../utils/miscellaneous/schema";

class CommonModel extends Schema {
  private db: TDB;

  constructor(db: TDB) {
    super();
    this.db = db;
  }

  // get otp
  public async getOTP(payload: IGetOTPPayload) {
    const check = await this.db("email_otp")
      .withSchema(this.DBO_SCHEMA)
      .select("id", "hashed_otp as otp", "tried")
      .andWhere("email", payload.email)
      .andWhere("type", payload.type)
      .andWhere("matched", 0)
      .andWhere("tried", "<", 3)
      .andWhereRaw(`"create_date" + interval '3 minutes' > NOW()`);

    return check;
  }

  // insert OTP
  public async insertOTP(payload: IInsertOTPPayload) {
    return await this.db("email_otp")
      .withSchema(this.DBO_SCHEMA)
      .insert(payload);
  }

  // update otp
  public async updateOTP(
    payload: { tried: number; matched?: number },
    where: { id: number }
  ) {
    return await this.db("email_otp")
      .withSchema(this.DBO_SCHEMA)
      .update(payload)
      .where("id", where.id);
  }

  // Get Env Variable
  public async getEnv(key: string) {
    const data = await this.db("variable_env")
      .withSchema(this.DBO_SCHEMA)
      .select("*")
      .where({ key });
    if (data.length) {
      return data[0].value;
    } else {
      throw new Error(`Env variable ${key} not found!`);
    }
  }

  // update env variable
  public async updateEnv(key: string, value: string) {
    return await this.db("variable_env")
      .withSchema(this.DBO_SCHEMA)
      .update({ value })
      .where({ key });
  }

  // Get airlines
  public async getAirlines(airlineCode: string) {
    const [airline] = await this.db("airlines")
      .withSchema(this.DBO_SCHEMA)
      .select("name", "logo")
      .where((qb) => {
        if (airlineCode) {
          qb.andWhere("code", airlineCode);
        }
      });
    if (airline) {
      return airline;
    } else {
      return {
        name: "Not available",
        logo: "Not available",
      };
    }
  }

  // Aircraft details by code
  public getAircraft = async (code: string) => {
    const aircraft = await this.db
      .select("*")
      .from("aircraft")
      .withSchema(this.DBO_SCHEMA)
      .where("code", code);

    if (aircraft.length) {
      return aircraft[0];
    } else {
      return { code: code, name: "Not available" };
    }
  };

  // get airport
  public async getAirport(airportCode: string) {
    const [airport] = await this.db
      .select("*")
      .from("airport")
      .withSchema(this.DBO_SCHEMA)
      .where("iata_code", airportCode);

    if (airport) {
      return airport.name;
    } else {
      return "Not available";
    }
  }

  // get city
  public async getCity(cityCode: string) {
    const [city] = await this.db
      .select("name")
      .from("city_view")
      .withSchema(this.DBO_SCHEMA)
      .where("code", cityCode);

    return city?.name as string;
  }

  //get all country
  public async getAllCountry() {
    return await this.db("country")
      .withSchema(this.DBO_SCHEMA)
      .select("id", "name", "iso")
      .orderBy("id", "asc");
  }

  //get all city
  public async getAllCity(
    country_id?: number,
    limit: number = 100,
    skip: number = 0,
    filter?: string,
    name?: string
  ) {
    return await this.db("city")
      .withSchema(this.DBO_SCHEMA)
      .select("id", "name")
      .where((qb) => {
        if (country_id) {
          qb.where({ country_id });
        }
        if (filter) {
          qb.andWhere("name", "ilike", `%${filter}%`);
        }
        if (name) {
          qb.andWhere("name", name);
        }
      })
      .orderBy("id", "asc")
      .limit(limit)
      .offset(skip);
  }

  //insert city
  public async insertCity(payload: {
    country_id: number;
    name: string;
    code?: string;
  }) {
    return await this.db("city")
      .withSchema(this.DBO_SCHEMA)
      .insert(payload, "id");
  }

  //insert airport
  public async insertAirport(payload: ICreateAirportPayload) {
    return await this.db("airport")
      .withSchema(this.DBO_SCHEMA)
      .insert(payload, "id");
  }

  //get all airport
  public async getAllAirport(
    params: {
      country_id?: number;
      name?: string;
      limit?: number;
      skip?: number;
      code?: string;
    },
    total: boolean
  ) {
    const data = await this.db("airport as air")
      .withSchema(this.DBO_SCHEMA)
      .select(
        "air.id",
        "air.country_id",
        "cou.name as country",
        "air.name",
        "air.iata_code",
        "ct.id as city_id",
        "ct.name as city_name"
      )
      .join("country as cou", "cou.id", "air.country_id")
      .leftJoin("city as ct", "ct.id", "air.city")
      .where((qb) => {
        if (params.country_id) {
          qb.where("air.country_id", params.country_id);
        }
        if (params.name) {
          qb.orWhere("air.iata_code", params.name.toUpperCase());
          qb.orWhereILike("air.name", `${params.name}%`);
          qb.orWhereILike("cou.name", `${params.name}%`);
          qb.orWhereILike("ct.name", `${params.name}%`);
        }
        if (params.code) {
          qb.where("air.iata_code", params.code);
        }
      })
      .limit(params.limit ? params.limit : 100)
      .offset(params.skip ? params.skip : 0)
      .orderBy("air.id", "asc");

    let count: any[] = [];
    if (total) {
      count = await this.db("airport as air")
        .withSchema(this.DBO_SCHEMA)
        .count("air.id as total")
        .join("country as cou", "cou.id", "air.country_id")
        .where((qb) => {
          if (params.country_id) {
            qb.where("air.country_id", params.country_id);
          }
          if (params.name) {
            qb.orWhere("air.iata_code", params.name.toUpperCase());
            qb.orWhereILike("air.name", `${params.name}%`);
            qb.orWhereILike("cou.name", `${params.name}%`);
          }
        });
    }
    return { data, total: count[0]?.total };
  }

  //update airport
  public async updateAirport(payload: IUpdateAirportPayload, id: number) {
    return await this.db("airport")
      .withSchema(this.DBO_SCHEMA)
      .update(payload)
      .where({ id });
  }

  //delete airport
  public async deleteAirport(id: number) {
    return await this.db("airport")
      .withSchema(this.DBO_SCHEMA)
      .delete()
      .where({ id });
  }

  //insert airline
  public async insertAirline(payload: ICreateAirlinesPayload) {
    return await this.db("airlines")
      .withSchema(this.DBO_SCHEMA)
      .insert(payload, "id");
  }

  //get all airlines
  public async getAllAirline(
    params: { code?: string; name?: string; limit?: number; skip?: number },
    total: boolean
  ) {
    const data = await this.db("airlines as air")
      .withSchema(this.DBO_SCHEMA)
      .select("air.id", "air.code", "air.name", "air.logo")
      .where((qb) => {
        if (params.code) {
          qb.where("air.code", params.code);
        }
        if (params.name) {
          qb.andWhere("air.name", "ilike", `%${params.name}%`);
          qb.orWhere("air.code", params.name);
        }
      })
      .limit(params.limit ? params.limit : 100)
      .offset(params.skip ? params.skip : 0)
      .orderBy("air.id", "asc");

    let count: any[] = [];
    if (total) {
      count = await this.db("airlines as air")
        .withSchema(this.DBO_SCHEMA)
        .count("air.id as total")
        .where((qb) => {
          if (params.code) {
            qb.where("air.code", params.code);
          }
          if (params.name) {
            qb.andWhere("air.name", "ilike", `%${params.name}%`);
            qb.orWhere("air.code", params.name);
          }
        });
    }
    return { data, total: count[0]?.total };
  }

  //update airlines
  public async updateAirlines(payload: IUpdateAirlinesPayload, id: number) {
    return await this.db("airlines")
      .withSchema(this.DBO_SCHEMA)
      .update(payload)
      .where({ id });
  }

  //delete airlines
  public async deleteAirlines(id: number) {
    return await this.db("airlines")
      .withSchema(this.DBO_SCHEMA)
      .delete()
      .where({ id });
  }
}
export default CommonModel;
