"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FLIGHT_SEARCH_ENDPOINT = exports.FLIGHT_REVALIDATE_ENDPOINT = exports.GET_BOOKING_ENDPOINT = exports.GET_TOKEN_ENDPOINT = exports.CANCEL_BOOKING_ENDPOINT = exports.FLIGHT_BOOKING_ENDPOINT = exports.TICKET_ISSUE_ENDPOINT = void 0;
// sabre endpoints
exports.TICKET_ISSUE_ENDPOINT = '/v1.3.0/air/ticket';
exports.FLIGHT_BOOKING_ENDPOINT = '/v2.5.0/passenger/records?mode=create';
exports.CANCEL_BOOKING_ENDPOINT = '/v1/trip/orders/cancelBooking';
exports.GET_TOKEN_ENDPOINT = '/v3/auth/token';
exports.GET_BOOKING_ENDPOINT = '/v1/trip/orders/getBooking';
exports.FLIGHT_REVALIDATE_ENDPOINT = '/v5/shop/flights/revalidate';
exports.FLIGHT_SEARCH_ENDPOINT = '/v4/offers/shop';
