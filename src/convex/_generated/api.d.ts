/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as auth from "../auth.js";
import type * as clinicalTrials from "../clinicalTrials.js";
import type * as favorites from "../favorites.js";
import type * as forums from "../forums.js";
import type * as http from "../http.js";
import type * as patients from "../patients.js";
import type * as publications from "../publications.js";
import type * as researchers from "../researchers.js";
import type * as users_updateRole from "../users/updateRole.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "auth/emailOtp": typeof auth_emailOtp;
  auth: typeof auth;
  clinicalTrials: typeof clinicalTrials;
  favorites: typeof favorites;
  forums: typeof forums;
  http: typeof http;
  patients: typeof patients;
  publications: typeof publications;
  researchers: typeof researchers;
  "users/updateRole": typeof users_updateRole;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
