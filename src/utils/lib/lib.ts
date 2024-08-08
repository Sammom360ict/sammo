import config from '../../config/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { cabinCode, mealData } from '../miscellaneous/staticData';

class Lib {
  // make hashed password
  public static async hashPass(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  // verify password
  public static async compare(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // create token
  public static createToken(
    creds: object,
    secret: string,
    maxAge: number | string
  ) {
    return jwt.sign(creds, secret, { expiresIn: maxAge });
  }

  // verify token
  public static verifyToken(token: string, secret: string) {
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  // generate random Number
  public static otpGenNumber(length: number) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    let otp = '';

    for (let i = 0; i < length; i++) {
      const randomNumber = Math.floor(Math.random() * 10);

      otp += numbers[randomNumber];
    }

    return otp;
  }

  // send email by nodemailer
  public static async sendEmail(
    email: string,
    emailSub: string,
    emailBody: string
  ) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
          user: config.EMAIL_SEND_EMAIL_ID,
          pass: config.EMAIL_SEND_PASSWORD,
        },
      });

      const info = await transporter.sendMail({
        from: config.EMAIL_SEND_EMAIL_ID,
        to: email,
        subject: emailSub,
        html: emailBody,
      });

      console.log('Message send: %s', info);

      return true;
    } catch (err: any) {
      console.log({ err });
      return false;
    }
  }

  // compare object
  public static compareObj(a: any, b: any) {
    return JSON.stringify(a) == JSON.stringify(b);
  }

  // get meal by code
  public static getMeal(code: string) {
    return mealData.find((item) => item.code === code);
  }

  // get cabin by code
  public static getCabin(code: string) {
    return cabinCode.find((item) => item.code === code);
  }

    // get time value
    public static getTimeValue(timeString: string) {
      // Extract hours, minutes, and seconds
      let [time, timeZone] = timeString.split('+');
      if (!timeZone) {
        [time, timeZone] = timeString.split('-');
      }
      let [hours, minutes, seconds] = time.split(':');
  
      // Convert to milliseconds since midnight
      let timeValue =
        (parseInt(hours, 10) * 60 * 60 +
          parseInt(minutes, 10) * 60 +
          parseInt(seconds, 10)) *
        1000;
  
      // Adjust for time zone
      if (timeZone) {
        let [tzHours, tzMinutes] = timeZone.split(':');
        let timeZoneOffset =
          (parseInt(tzHours, 10) * 60 + parseInt(tzMinutes, 10)) * 60 * 1000;
        timeValue -= timeZoneOffset;
      }
  
      return timeValue;
    }
}
export default Lib;
