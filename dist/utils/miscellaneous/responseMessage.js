"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResMsg {
}
ResMsg.HTTP_OK = "The request is OK";
ResMsg.HTTP_SUCCESSFUL = "The request has been fulfilled";
ResMsg.HTTP_ACCEPTED = "The request has been accepted";
ResMsg.HTTP_FULFILLED = "The request has been successfully processed";
ResMsg.HTTP_BAD_REQUEST = "The request cannot be fulfilled due to bad syntax";
ResMsg.HTTP_UNAUTHORIZED = "The request was a legal request, but the server is refusing to respond to it. For use when authentication is possible but has failed or not yet been provided";
ResMsg.HTTP_FORBIDDEN = "The request was a legal request, but the server is refusing to respond to it";
ResMsg.HTTP_NOT_FOUND = "The requested data could not be found but may be available again in the future";
ResMsg.HTTP_CONFLICT = "The resource you are trying to create already exists.";
ResMsg.HTTP_UNPROCESSABLE_ENTITY = "The request payload is unprocessable, please provide valid payload";
ResMsg.HTTP_INTERNAL_SERVER_ERROR = "Internal server error";
//Login
ResMsg.LOGIN_SUCCESSFUL = "You are now logged in";
ResMsg.WRONG_CREDENTIALS = "Email or password is wrong";
ResMsg.NOT_FOUND_USER_WITH_EMAIL = "No user has been found with this email address!";
//password change
ResMsg.PASSWORD_CHANGED = "Password changed successfully";
ResMsg.PASSWORD_DOES_NOT_MATCH = "Previous password does not match!";
//OTP
ResMsg.THREE_TIMES_EXPIRED = "Cannot send another OTP before 3 minutes";
ResMsg.OTP_SENT = "OTP sent successfully";
ResMsg.OTP_EXPIRED = "OTP has been expired";
ResMsg.TOO_MUCH_ATTEMPT = "OTP has been tried more than 3 times! Please try again later";
ResMsg.OTP_MATCHED = "OTP matched successfully";
ResMsg.OTP_INVALID = "Invalid OTP";
//admin
ResMsg.ROLE_NAME_EXIST = "Role already exists";
ResMsg.PERMISSION_NAME_EXIST = "Permission already exists";
ResMsg.PERMISSION_EXISTS_FOR_ROLE = "Selected permission already exists for this role";
ResMsg.PERMISSION_NOT_FOUND_FOR_ROLE = "Selected permission not found for this role";
ResMsg.STATUS_CANNOT_CHANGE = "Status cannot be changed";
//user
ResMsg.EMAIL_EXISTS = "Email already exists";
ResMsg.PHONE_EXISTS = "Phone Number already exists";
ResMsg.USERNAME_EXISTS = "User already exists with this username";
ResMsg.REQUEST_CANCEL = "The booking request cannot be cancelled";
//article
ResMsg.SLUG_EXISTS = "Slug with this title already exists";
exports.default = ResMsg;
