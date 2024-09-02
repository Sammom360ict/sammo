import { OAuth2Client } from "google-auth-library";
import config from "../../config/config";
import CustomError from "../lib/customError";

class GoogleAuth {
  private client = new OAuth2Client(config.GOOGLE_CLIENT_ID);

  constructor() {}

  public async verifyAccessToken(accessToken: string): Promise<any> {
    try {
      // Verify the token and get user info
      const ticket = await this.client.getTokenInfo(accessToken);
      return ticket;
    } catch (error) {
      console.error("Access token verification failed:", error);

      throw new CustomError("Invalid access token", 401);
    }
  }
}

export default GoogleAuth;
