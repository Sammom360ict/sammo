class ResMsg {
  static readonly HTTP_OK = "The request is OK";
  static readonly HTTP_SUCCESSFUL = "The request has been fulfilled";
  static readonly HTTP_ACCEPTED = "The request has been accepted";
  static readonly HTTP_FULFILLED =
    "The request has been successfully processed";
  static readonly HTTP_BAD_REQUEST =
    "The request cannot be fulfilled due to bad syntax";
  static readonly HTTP_UNAUTHORIZED =
    "The request was a legal request, but the server is refusing to respond to it. For use when authentication is possible but has failed or not yet been provided";
  static readonly HTTP_FORBIDDEN =
    "The request was a legal request, but the server is refusing to respond to it";
  static readonly HTTP_NOT_FOUND =
    "The requested data could not be found but may be available again in the future";
  static readonly HTTP_CONFLICT =
    "The resource you are trying to create already exists.";
  static readonly HTTP_UNPROCESSABLE_ENTITY =
    "The request payload is unprocessable, please provide valid payload";
  static readonly HTTP_INTERNAL_SERVER_ERROR = "Internal server error";

  //Login
  static readonly LOGIN_SUCCESSFUL = "You are now logged in";
  static readonly WRONG_CREDENTIALS = "Email or password is wrong";
  static readonly NOT_FOUND_USER_WITH_EMAIL =
    "No user has been found with this email address!";

  //password change
  static readonly PASSWORD_CHANGED = "Password changed successfully";
  static readonly PASSWORD_DOES_NOT_MATCH = "Previous password does not match!";

  //OTP
  static readonly THREE_TIMES_EXPIRED =
    "Cannot send another OTP before 3 minutes";
  static readonly OTP_SENT = "OTP sent successfully";
  static readonly OTP_EXPIRED = "OTP has been expired";
  static readonly TOO_MUCH_ATTEMPT =
    "OTP has been tried more than 3 times! Please try again later";
  static readonly OTP_MATCHED = "OTP matched successfully";
  static readonly OTP_INVALID = "Invalid OTP";

  //admin
  static readonly ROLE_NAME_EXIST = "Role already exists";
  static readonly PERMISSION_NAME_EXIST = "Permission already exists";
  static readonly PERMISSION_EXISTS_FOR_ROLE =
    "Selected permission already exists for this role";
  static readonly PERMISSION_NOT_FOUND_FOR_ROLE =
    "Selected permission not found for this role";
  static readonly STATUS_CANNOT_CHANGE = "Status cannot be changed";

  //user
  static readonly EMAIL_EXISTS = "Email already exists";
  static readonly PHONE_EXISTS = "Phone Number already exists";
  static readonly USERNAME_EXISTS = "User already exists with this username";
  static readonly REQUEST_CANCEL = "The booking request cannot be cancelled";

  //article
  static readonly SLUG_EXISTS = "Slug with this title already exists";
}

export default ResMsg;
