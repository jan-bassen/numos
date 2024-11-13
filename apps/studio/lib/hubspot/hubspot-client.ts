/* const hubspot = require("@hubspot/api-client"); */
import { Client } from "@hubspot/api-client";

export const hubspot = new Client({
  accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
});
