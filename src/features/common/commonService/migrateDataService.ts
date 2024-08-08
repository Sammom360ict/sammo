import AbstractServices from '../../../abstract/abstract.service';
import { db as db2 } from '../../../app/database';
import AWS from 'aws-sdk';
import config from '../../../config/config';
import axios, { AxiosResponse } from 'axios';
import * as mime from 'mime-types';
class migrateDataService extends AbstractServices {
  constructor() {
    super();
  }

  // migrate airlines
  public async migrateAirlines() {
    return this.db.transaction(async (trx) => {
      const airlines = await db2('ota_airline').select('*');

      for (const airline of airlines) {
        await trx('airlines').withSchema('dbo').insert({
          id: airline.id,
          code: airline.airline_code,
          name: airline.alternative_business_name,
        });
      }

      return {
        code: this.StatusCode.HTTP_OK,
        message: this.ResMsg.HTTP_OK,
      };
    });
  }

  // migrate airport
  public async migrateAirport() {
    return this.db.transaction(async (trx) => {
      const airports = await db2('airports')
        .select('*')
        .where({ is_deleted: 0 });

      for (const airport of airports) {
        await trx('airport').withSchema('dbo').insert({
          id: airport.id,
          country_id: airport.country_id,
          iata_code: airport.iata_code,
          name: airport.name,
        });
      }

      return {
        code: this.StatusCode.HTTP_OK,
        message: this.ResMsg.HTTP_OK,
      };
    });
  }

  // migrate city
  public async migrateCity() {
    return this.db.transaction(async (trx) => {
      const datas = await db2('city')
        .select('*')
        .whereNotNull('city_country_id');

      for (const data of datas) {
        await trx('city').withSchema('dbo').insert({
          id: data.city_id,
          country_id: data.city_country_id,
          code: data.city_code,
          name: data.name,
          lat: data.lat,
          lng: data.lng,
        });
      }

      return {
        code: this.StatusCode.HTTP_OK,
        message: this.ResMsg.HTTP_OK,
      };
    });
  }

  // migrate airline image
  public async migrateAirlineImage() {
    return this.db.transaction(async (trx) => {
      const airlines = await trx('airlines').withSchema('dbo').select('*');

      const s3 = new AWS.S3({
        accessKeyId: config.AWS_S3_ACCESS_KEY, // AWS Access Key
        secretAccessKey: config.AWS_S3_SECRET_KEY, // AWS Secret Access Key
        region: 'ap-south-1', // Your AWS bucket region
      });

      for (const data of airlines) {
        axios({
          method: 'get',
          url: `https://fe-pub.s3.ap-southeast-1.amazonaws.com/airlineimages/128/${data.code}.png`,
          responseType: 'arraybuffer',
        })
          .then((res: AxiosResponse<any, any>) => {
            const buffer = Buffer.from(res.data, 'binary');
            const fileBuffer = {
              Bucket: config.AWS_S3_BUCKET,
              Key: `amar-flight-files/airlines/${data.code}.png`,
              Body: buffer,
              ContentEncoding: 'base64',
              ContentType:
                mime.lookup(`${data.code}.png`) || 'application/octet-stream',
              ACL: 'public-read',
            };
            s3.putObject(fileBuffer, (err, data) => {
              if (err) {
                console.log(err);
              } else {
                console.log('Image uploaded');
              }
            }).promise();
          })
          .catch((err: any) => {
            console.log(err);
          });
      }

      return {
        code: this.StatusCode.HTTP_OK,
        message: this.ResMsg.HTTP_OK,
      };
    });
  }

  public async updateAirlines() {
    return this.db.transaction(async (trx) => {
      const airlines = await trx('airlines').withSchema('dbo').select('*');

      for (const airline of airlines) {
        await trx('airlines')
          .withSchema('dbo')
          .update({
            logo: `airlines/${airline.code}.png`,
          })
          .where({ id: airline.id });
      }

      return {
        code: this.StatusCode.HTTP_OK,
        message: this.ResMsg.HTTP_OK,
      };
    });
  }
}
export default migrateDataService;
