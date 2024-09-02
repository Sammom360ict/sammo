import CustomError from "../lib/customError";
import axios from "axios";

export const verifyFacebookToken = async (accessToken: string) => {
  const url = `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email`;

  try {
    const response = await axios.get(url);
    return response.data; // Response contains user's information
  } catch (error: any) {
    console.error("Error verifying Facebook token:", error.response.data);
    throw new CustomError("Invalid Facebook token", 401);
  }
};
