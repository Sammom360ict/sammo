"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIENT_URL = exports.SERVER_URL = exports.BD_AIRPORT = exports.FLIGHT_COMMISSION = exports.DATA_LIMIT = exports.OTP_FOR = exports.OTP_EMAIL_SUBJECT = exports.SABRE_TOKEN_ENV = exports.OTP_TYPE_FORGET_AGENT = exports.OTP_TYPE_FORGET_ADMIN = exports.OTP_TYPE_VERIFY_USER = exports.OTP_TYPE_FORGET_USER = exports.origin = void 0;
exports.origin = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:5173',
    'http://192.168.0.242:3000',
    'http://192.168.0.242:3001',
    'http://192.168.0.164:3000',
    'http://192.168.0.54:3000',
    'http://192.168.0.155:3003',
    'http://192.168.0.241:3000',
    'http://192.168.0.190:3000',
    'https://smartrip.app',
    'https://www.smartrip.app',
    'http://192.168.0.190:5173'
];
// OTP types constants
exports.OTP_TYPE_FORGET_USER = 'reset_user';
exports.OTP_TYPE_VERIFY_USER = 'verify_user';
exports.OTP_TYPE_FORGET_ADMIN = 'reset_admin';
exports.OTP_TYPE_FORGET_AGENT = 'reset_agent';
// Sabre token env ID
exports.SABRE_TOKEN_ENV = 'sabre_token';
// Email subject
exports.OTP_EMAIL_SUBJECT = 'Your One Time Password For Verification';
// OTP for
exports.OTP_FOR = 'Verification';
// Default data get limit
exports.DATA_LIMIT = 100;
// Flight commission
exports.FLIGHT_COMMISSION = 'flight_commission';
// airline logos
// https://fe-pub.s3.ap-southeast-1.amazonaws.com/airlineimages/128/3L.png
// BD Airport
exports.BD_AIRPORT = [
    'DAC',
    'CGP',
    'ZYL',
    'CXB',
    'JSR',
    'BZL',
    'RJH',
    'SPD',
    'IRD',
];
//SERVER URL LOCAL
exports.SERVER_URL = "http://192.168.0.244:1800/api/v1";
exports.CLIENT_URL = "192.168.0.164:3000";
