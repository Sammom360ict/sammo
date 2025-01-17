import { Request } from "express";
import AbstractServices from "../../../abstract/abstract.service";
import { getRedis, setRedis } from "../../../app/redis";
import Lib from "../../../utils/lib/lib";
import RequestFormatter from "../../../utils/lib/requestFomatter";
import {
  FLIGHT_REVALIDATE_ENDPOINT,
  FLIGHT_SEARCH_ENDPOINT,
} from "../../../utils/miscellaneous/sabreApiEndpoints";
import {
  IFlightFilterQuery,
  IFlightSearchReqBody,
} from "../../../utils/interfaces/flight/flightSearchInterface";
import ResponseFormatter from "../../../utils/lib/responseFormatter";
import CustomError from "../../../utils/lib/customError";
import SabreRequests from "../../../utils/lib/sabreRequest";
import { v4 as uuidv4 } from "uuid";

export default class BookingFlightService extends AbstractServices {
  private ReqFormatter = new RequestFormatter();
  private ResFormatter = new ResponseFormatter();
  private request = new SabreRequests();
  static subRevalidateV2: any;

  constructor() {
    super();
  }

  // search flight service
  public async flightSearch(req: Request) {
    const query = req.query;

    const uid_val = uuidv4();

    const search_id = "btoc" + uid_val;
    const body = req.body as IFlightSearchReqBody;

    const retrievedData = await getRedis(search_id);

    const retrievedReqBody = retrievedData?.reqBody;

    const hasSameValues = Lib.compareObj(body, retrievedReqBody);

    if (retrievedReqBody && hasSameValues) {
      const retrieveResponse = retrievedData?.response;
      if (query.carrier_operating) {
        const filter_data = await this.flightFilter(req);
        return filter_data;
      }

      return {
        success: true,
        search_id,
        message: this.ResMsg.HTTP_OK,
        data: retrieveResponse,
        count: retrievedData.count,
        code: this.StatusCode.HTTP_OK,
      };
    }

    return this.db.transaction(async (trx) => {
      const flightRequestBody = await this.ReqFormatter.flightSearch(body);
      if (!flightRequestBody) {
        return {
          success: false,
          message: "Capping is not available for any flight",
          code: this.StatusCode.HTTP_NOT_FOUND,
        };
      }
      console.log({ flightRequestBody });

      const response = await this.request.postRequest(
        FLIGHT_SEARCH_ENDPOINT,
        flightRequestBody
      );

      console.log({ response });

      const [formattedResponse, count] = await this.ResFormatter.flightSearch(
        trx,
        response?.groupedItineraryResponse,
        body
      );

      const dataForStore = {
        reqBody: body,
        response: formattedResponse,
        count,
      };

      await setRedis(search_id, dataForStore);
      if (query.carrier_operating) {
        const filter_data = await this.flightFilter(req);
        return filter_data;
      }
      const size = Number(query.size || 20);

      const data = {
        ...formattedResponse,
        results: formattedResponse.results.slice(0, size),
      };

      return {
        success: true,
        message: this.ResMsg.HTTP_OK,
        count,
        search_id,
        data,
        code: this.StatusCode.HTTP_OK,
      };
    });
  }

  // filter flight service
  public async flightFilter(req: Request) {
    const query = req.query as IFlightFilterQuery;
    const { search_id } = req.query;

    const retrievedData = await getRedis(search_id as string);

    const retrieveResponse = retrievedData?.response;

    if (!retrievedData) {
      return {
        success: false,
        message: "Data lost! Search again.",
        code: this.StatusCode.HTTP_NOT_FOUND,
      };
    }

    const sortedResponse = this.ResFormatter.filterFlightSearch(
      retrieveResponse,
      query as any
    );
    return {
      success: true,
      search_id,
      message: this.ResMsg.HTTP_OK,
      ...sortedResponse,
      code: this.StatusCode.HTTP_OK,
    };
  }

  // revalidate flight service
  public async revalidate(req: Request) {
    const search_id = req.query.search_id as string;
    const flightId = req.params.flight_id;
    // const commonModel = this.Model.commonModel();

    // const flight_commission = await commonModel.getEnv(FLIGHT_COMMISSION);
    const data = await this.subRevalidate(
      search_id,
      flightId
      // Number(flight_commission)
    );

    if (data) {
      return {
        success: true,
        message: "Ticket has been revalidate successfully!",
        data,
        code: this.StatusCode.HTTP_OK,
      };
    }

    return {
      success: true,
      message: this.ResMsg.HTTP_NOT_FOUND,
      code: this.StatusCode.HTTP_NOT_FOUND,
    };
  }

  // revalidate flight sub service
  public async subRevalidate(search_id: string, flightId: string) {
    const retrievedData = await getRedis(search_id);

    console.log({ retrievedData });

    if (!retrievedData) {
      return null;
    }

    const retrieveResponse = retrievedData.response as {
      results: {
        ticket_last_time: string;
        ticket_last_date: string;
        flight_id: string;
      }[];
    };

    const foundItem = retrieveResponse.results.find(
      (item) => item.flight_id === flightId
    );

    if (!foundItem) {
      return null;
    }

    const formattedReqBody = this.ReqFormatter.revalidateReqBodyFormatter(
      retrievedData.reqBody,
      foundItem
    );

    const response = await this.request.postRequest(
      FLIGHT_REVALIDATE_ENDPOINT,
      formattedReqBody
    );

    if (response.groupedItineraryResponse?.statistics.itineraryCount === 0) {
      throw new CustomError(
        "Cannot revalidate flight with this flight id",
        400
      );
    }

    const formattedResponse = await this.ResFormatter.revalidate(
      response.groupedItineraryResponse,
      retrievedData.reqBody
    );
    formattedResponse.ticket_last_date = formattedResponse.ticket_last_date
      ? formattedResponse.ticket_last_date
      : foundItem.ticket_last_date;
    formattedResponse.ticket_last_time = formattedResponse.ticket_last_time
      ? formattedResponse.ticket_last_time
      : foundItem.ticket_last_time;

    return formattedResponse;
  }

  //revalidate flight version 2.0
  public async flightRevalidateV2(req: Request) {
    const body = req.body;

    const formattedReqBody =
      this.ReqFormatter.newRevalidateReqBodyFormatterV2(body);

    const response: any = await this.request.postRequest(
      FLIGHT_REVALIDATE_ENDPOINT,
      formattedReqBody
    );

    console.log({ response });

    if (response.groupedItineraryResponse?.statistics.itineraryCount === 0) {
      throw new CustomError("Error during Processing", 400);
    }

    const data = await this.ResFormatter.revalidate(
      response.groupedItineraryResponse,
      body
    );

    if (data) {
      return {
        success: true,
        message: "Ticket has been revalidate successfully!",
        data,
        code: this.StatusCode.HTTP_OK,
      };
    }

    return {
      success: true,
      message: this.ResMsg.HTTP_NOT_FOUND,
      code: this.StatusCode.HTTP_NOT_FOUND,
    };
  }
}
