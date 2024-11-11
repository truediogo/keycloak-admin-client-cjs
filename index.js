var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var keycloak_admin_client_cjs_exports = {};
__export(keycloak_admin_client_cjs_exports, {
  Keycloak: () => lib_default
});
module.exports = __toCommonJS(keycloak_admin_client_cjs_exports);

// node_modules/url-join/lib/url-join.js
function normalize(strArray) {
  var resultArray = [];
  if (strArray.length === 0) {
    return "";
  }
  if (typeof strArray[0] !== "string") {
    throw new TypeError("Url must be a string. Received " + strArray[0]);
  }
  if (strArray[0].match(/^[^/:]+:\/*$/) && strArray.length > 1) {
    var first = strArray.shift();
    strArray[0] = first + strArray[0];
  }
  if (strArray[0].match(/^file:\/\/\//)) {
    strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, "$1:///");
  } else {
    strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, "$1://");
  }
  for (var i = 0; i < strArray.length; i++) {
    var component = strArray[i];
    if (typeof component !== "string") {
      throw new TypeError("Url must be a string. Received " + component);
    }
    if (component === "") {
      continue;
    }
    if (i > 0) {
      component = component.replace(/^[\/]+/, "");
    }
    if (i < strArray.length - 1) {
      component = component.replace(/[\/]+$/, "");
    } else {
      component = component.replace(/[\/]+$/, "/");
    }
    resultArray.push(component);
  }
  var str = resultArray.join("/");
  str = str.replace(/\/(\?|&|#[^!])/g, "$1");
  var parts = str.split("?");
  str = parts.shift() + (parts.length > 0 ? "?" : "") + parts.join("&");
  return str;
}
function urlJoin() {
  var input;
  if (typeof arguments[0] === "object") {
    input = arguments[0];
  } else {
    input = [].slice.call(arguments);
  }
  return normalize(input);
}

// node_modules/url-template/lib/url-template.js
function encodeReserved(str) {
  return str.split(/(%[0-9A-Fa-f]{2})/g).map(function(part) {
    if (!/%[0-9A-Fa-f]/.test(part)) {
      part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
    }
    return part;
  }).join("");
}
function encodeUnreserved(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}
function encodeValue(operator, value, key) {
  value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);
  if (key) {
    return encodeUnreserved(key) + "=" + value;
  } else {
    return value;
  }
}
function isDefined(value) {
  return value !== void 0 && value !== null;
}
function isKeyOperator(operator) {
  return operator === ";" || operator === "&" || operator === "?";
}
function getValues(context, operator, key, modifier) {
  var value = context[key], result = [];
  if (isDefined(value) && value !== "") {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      value = value.toString();
      if (modifier && modifier !== "*") {
        value = value.substring(0, parseInt(modifier, 10));
      }
      result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
    } else {
      if (modifier === "*") {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function(value2) {
            result.push(encodeValue(operator, value2, isKeyOperator(operator) ? key : null));
          });
        } else {
          Object.keys(value).forEach(function(k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        var tmp = [];
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function(value2) {
            tmp.push(encodeValue(operator, value2));
          });
        } else {
          Object.keys(value).forEach(function(k) {
            if (isDefined(value[k])) {
              tmp.push(encodeUnreserved(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }
        if (isKeyOperator(operator)) {
          result.push(encodeUnreserved(key) + "=" + tmp.join(","));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(","));
        }
      }
    }
  } else {
    if (operator === ";") {
      if (isDefined(value)) {
        result.push(encodeUnreserved(key));
      }
    } else if (value === "" && (operator === "&" || operator === "?")) {
      result.push(encodeUnreserved(key) + "=");
    } else if (value === "") {
      result.push("");
    }
  }
  return result;
}
function parseTemplate(template) {
  var operators = ["+", "#", ".", "/", ";", "?", "&"];
  return {
    expand: function(context) {
      return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function(_, expression, literal) {
        if (expression) {
          var operator = null, values = [];
          if (operators.indexOf(expression.charAt(0)) !== -1) {
            operator = expression.charAt(0);
            expression = expression.substr(1);
          }
          expression.split(/,/g).forEach(function(variable) {
            var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
            values.push.apply(values, getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
          });
          if (operator && operator !== "+") {
            var separator = ",";
            if (operator === "?") {
              separator = "&";
            } else if (operator !== "#") {
              separator = operator;
            }
            return (values.length !== 0 ? operator : "") + values.join(separator);
          } else {
            return values.join(",");
          }
        } else {
          return encodeReserved(literal);
        }
      });
    }
  };
}

// node_modules/@keycloak/keycloak-admin-client/lib/utils/fetchWithError.js
var ERROR_FIELDS = ["error", "errorMessage"];
var NetworkError = class extends Error {
  response;
  responseData;
  constructor(message, options) {
    super(message);
    this.response = options.response;
    this.responseData = options.responseData;
  }
};
async function fetchWithError(input, init) {
  const response = await fetch(input, init);
  if (!response.ok) {
    const responseData = await parseResponse(response);
    const message = getErrorMessage(responseData);
    throw new NetworkError(message, {
      response,
      responseData
    });
  }
  return response;
}
async function parseResponse(response) {
  if (!response.body) {
    return "";
  }
  const data = await response.text();
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}
function getErrorMessage(data) {
  if (typeof data !== "object" || data === null) {
    return "Unable to determine error message.";
  }
  for (const key of ERROR_FIELDS) {
    const value = data[key];
    if (typeof value === "string") {
      return value;
    }
  }
  return "Network response was not OK.";
}

// node_modules/@keycloak/keycloak-admin-client/lib/utils/stringifyQueryParams.js
function stringifyQueryParams(params) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === void 0 || value === null) {
      continue;
    }
    if (typeof value === "string" && value.length === 0) {
      continue;
    }
    if (Array.isArray(value) && value.length === 0) {
      continue;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, item.toString()));
    } else {
      searchParams.append(key, value.toString());
    }
  }
  return searchParams.toString();
}

// node_modules/@keycloak/keycloak-admin-client/lib/resources/agent.js
var SLASH = "/";
var pick = (value, keys) => Object.fromEntries(Object.entries(value).filter(([key]) => keys.includes(key)));
var omit = (value, keys) => Object.fromEntries(Object.entries(value).filter(([key]) => !keys.includes(key)));
var Agent = class {
  #client;
  #basePath;
  #getBaseParams;
  #getBaseUrl;
  constructor({ client, path = "/", getUrlParams = () => ({}), getBaseUrl = () => client.baseUrl }) {
    this.#client = client;
    this.#getBaseParams = getUrlParams;
    this.#getBaseUrl = getBaseUrl;
    this.#basePath = path;
  }
  request({ method, path = "", urlParamKeys = [], queryParamKeys = [], catchNotFound = false, keyTransform, payloadKey, returnResourceIdInLocationHeader, ignoredKeys, headers }) {
    return async (payload = {}, options) => {
      const baseParams = this.#getBaseParams?.() ?? {};
      const queryParams = queryParamKeys.length > 0 ? pick(payload, queryParamKeys) : void 0;
      const allUrlParamKeys = [...Object.keys(baseParams), ...urlParamKeys];
      const urlParams = { ...baseParams, ...pick(payload, allUrlParamKeys) };
      if (!(payload instanceof FormData)) {
        const omittedKeys = ignoredKeys ? [...allUrlParamKeys, ...queryParamKeys].filter((key) => !ignoredKeys.includes(key)) : [...allUrlParamKeys, ...queryParamKeys];
        payload = omit(payload, omittedKeys);
      }
      if (keyTransform) {
        this.#transformKey(payload, keyTransform);
        this.#transformKey(queryParams, keyTransform);
      }
      return this.#requestWithParams({
        method,
        path,
        payload,
        urlParams,
        queryParams,
        // catchNotFound precedence: global > local > default
        catchNotFound,
        ...this.#client.getGlobalRequestArgOptions() ?? options ?? {},
        payloadKey,
        returnResourceIdInLocationHeader,
        headers
      });
    };
  }
  updateRequest({ method, path = "", urlParamKeys = [], queryParamKeys = [], catchNotFound = false, keyTransform, payloadKey, returnResourceIdInLocationHeader, headers }) {
    return async (query = {}, payload = {}) => {
      const baseParams = this.#getBaseParams?.() ?? {};
      const queryParams = queryParamKeys ? pick(query, queryParamKeys) : void 0;
      const allUrlParamKeys = [...Object.keys(baseParams), ...urlParamKeys];
      const urlParams = {
        ...baseParams,
        ...pick(query, allUrlParamKeys)
      };
      if (keyTransform) {
        this.#transformKey(queryParams, keyTransform);
      }
      return this.#requestWithParams({
        method,
        path,
        payload,
        urlParams,
        queryParams,
        catchNotFound,
        payloadKey,
        returnResourceIdInLocationHeader,
        headers
      });
    };
  }
  async #requestWithParams({ method, path, payload, urlParams, queryParams, catchNotFound, payloadKey, returnResourceIdInLocationHeader, headers }) {
    const newPath = urlJoin(this.#basePath, path);
    const pathTemplate = parseTemplate(newPath);
    const parsedPath = pathTemplate.expand(urlParams);
    const url = new URL(`${this.#getBaseUrl?.() ?? ""}${parsedPath}`);
    const requestOptions = { ...this.#client.getRequestOptions() };
    const requestHeaders = new Headers([
      ...new Headers(requestOptions.headers).entries(),
      ["authorization", `Bearer ${await this.#client.getAccessToken()}`],
      ["accept", "application/json, text/plain, */*"],
      ...new Headers(headers).entries()
    ]);
    const searchParams = {};
    if (method === "GET") {
      Object.assign(searchParams, payload);
    } else if (requestHeaders.get("content-type") === "text/plain") {
      requestOptions.body = payload;
    } else if (payload instanceof FormData) {
      requestOptions.body = payload;
    } else {
      requestOptions.body = payloadKey && typeof payload[payloadKey] === "string" ? payload[payloadKey] : JSON.stringify(payloadKey ? payload[payloadKey] : payload);
    }
    if (!requestHeaders.has("content-type") && !(payload instanceof FormData)) {
      requestHeaders.set("content-type", "application/json");
    }
    if (queryParams) {
      Object.assign(searchParams, queryParams);
    }
    url.search = stringifyQueryParams(searchParams);
    try {
      const res = await fetchWithError(url, {
        ...requestOptions,
        headers: requestHeaders,
        method
      });
      if (returnResourceIdInLocationHeader) {
        const locationHeader = res.headers.get("location");
        if (typeof locationHeader !== "string") {
          throw new Error(`location header is not found in request: ${res.url}`);
        }
        const resourceId = locationHeader.split(SLASH).pop();
        if (!resourceId) {
          throw new Error(`resourceId is not found in Location header from request: ${res.url}`);
        }
        const { field } = returnResourceIdInLocationHeader;
        return { [field]: resourceId };
      }
      if (Object.entries(headers || []).find(([key, value]) => key.toLowerCase() === "accept" && value === "application/octet-stream")) {
        return await res.arrayBuffer();
      }
      return await parseResponse(res);
    } catch (err) {
      if (err instanceof NetworkError && err.response.status === 404 && catchNotFound) {
        return null;
      }
      throw err;
    }
  }
  #transformKey(payload, keyMapping) {
    if (!payload) {
      return;
    }
    Object.keys(keyMapping).some((key) => {
      if (typeof payload[key] === "undefined") {
        return false;
      }
      const newKey = keyMapping[key];
      payload[newKey] = payload[key];
      delete payload[key];
    });
  }
};

// node_modules/@keycloak/keycloak-admin-client/lib/resources/resource.js
var Resource = class {
  #agent;
  constructor(client, settings = {}) {
    this.#agent = new Agent({
      client,
      ...settings
    });
  }
  makeRequest = (args) => {
    return this.#agent.request(args);
  };
  // update request will take three types: query, payload and response
  makeUpdateRequest = (args) => {
    return this.#agent.updateRequest(args);
  };
};

// node_modules/@keycloak/keycloak-admin-client/lib/resources/attackDetection.js
var AttackDetection = class extends Resource {
  findOne = this.makeRequest({
    method: "GET",
    path: "/users/{id}",
    urlParamKeys: ["id"],
    catchNotFound: true
  });
  del = this.makeRequest({
    method: "DELETE",
    path: "/users/{id}",
    urlParamKeys: ["id"]
  });
  delAll = this.makeRequest({
    method: "DELETE",
    path: "/users"
  });
  constructor(client) {
    super(client, {
      path: "/admin/realms/{realm}/attack-detection/brute-force",
      getUrlParams: () => ({
        realm: client.realmName
      }),
      getBaseUrl: () => client.baseUrl
    });
  }
};

// node_modules/@keycloak/keycloak-admin-client/lib/resources/authenticationManagement.js
var AuthenticationManagement = class extends Resource {
  /**
   * Authentication Management
   * https://www.keycloak.org/docs-api/8.0/rest-api/index.html#_authentication_management_resource
   */
  //   Register a new required action
  registerRequiredAction = this.makeRequest({
    method: "POST",
    path: "/register-required-action"
  });
  // Get required actions. Returns a list of required actions.
  getRequiredActions = this.makeRequest({
    method: "GET",
    path: "/required-actions"
  });
  // Get required action for alias
  getRequiredActionForAlias = this.makeRequest({
    method: "GET",
    path: "/required-actions/{alias}",
    urlParamKeys: ["alias"],
    catchNotFound: true
  });
  getClientAuthenticatorProviders = this.makeRequest({
    method: "GET",
    path: "/client-authenticator-providers"
  });
  getAuthenticatorProviders = this.makeRequest({
    method: "GET",
    path: "/authenticator-providers"
  });
  getFormActionProviders = this.makeRequest({
    method: "GET",
    path: "/form-action-providers"
  });
  // Update required action
  updateRequiredAction = this.makeUpdateRequest({
    method: "PUT",
    path: "/required-actions/{alias}",
    urlParamKeys: ["alias"]
  });
  // Delete required action
  deleteRequiredAction = this.makeRequest({
    method: "DELETE",
    path: "/required-actions/{alias}",
    urlParamKeys: ["alias"]
  });
  // Lower required action’s priority
  lowerRequiredActionPriority = this.makeRequest({
    method: "POST",
    path: "/required-actions/{alias}/lower-priority",
    urlParamKeys: ["alias"]
  });
  // Raise required action’s priority
  raiseRequiredActionPriority = this.makeRequest({
    method: "POST",
    path: "/required-actions/{alias}/raise-priority",
    urlParamKeys: ["alias"]
  });
  // Get unregistered required actions Returns a list of unregistered required actions.
  getUnregisteredRequiredActions = this.makeRequest({
    method: "GET",
    path: "/unregistered-required-actions"
  });
  getFlows = this.makeRequest({
    method: "GET",
    path: "/flows"
  });
  getFlow = this.makeRequest({
    method: "GET",
    path: "/flows/{flowId}",
    urlParamKeys: ["flowId"]
  });
  getFormProviders = this.makeRequest({
    method: "GET",
    path: "/form-providers"
  });
  createFlow = this.makeRequest({
    method: "POST",
    path: "/flows",
    returnResourceIdInLocationHeader: { field: "id" }
  });
  copyFlow = this.makeRequest({
    method: "POST",
    path: "/flows/{flow}/copy",
    urlParamKeys: ["flow"]
  });
  deleteFlow = this.makeRequest({
    method: "DELETE",
    path: "/flows/{flowId}",
    urlParamKeys: ["flowId"]
  });
  updateFlow = this.makeUpdateRequest({
    method: "PUT",
    path: "/flows/{flowId}",
    urlParamKeys: ["flowId"]
  });
  getExecutions = this.makeRequest({
    method: "GET",
    path: "/flows/{flow}/executions",
    urlParamKeys: ["flow"]
  });
  addExecution = this.makeUpdateRequest({
    method: "POST",
    path: "/flows/{flow}/executions",
    urlParamKeys: ["flow"]
  });
  addExecutionToFlow = this.makeRequest({
    method: "POST",
    path: "/flows/{flow}/executions/execution",
    urlParamKeys: ["flow"],
    returnResourceIdInLocationHeader: { field: "id" }
  });
  addFlowToFlow = this.makeRequest({
    method: "POST",
    path: "/flows/{flow}/executions/flow",
    urlParamKeys: ["flow"],
    returnResourceIdInLocationHeader: { field: "id" }
  });
  updateExecution = this.makeUpdateRequest({
    method: "PUT",
    path: "/flows/{flow}/executions",
    urlParamKeys: ["flow"]
  });
  delExecution = this.makeRequest({
    method: "DELETE",
    path: "/executions/{id}",
    urlParamKeys: ["id"]
  });
  lowerPriorityExecution = this.makeRequest({
    method: "POST",
    path: "/executions/{id}/lower-priority",
    urlParamKeys: ["id"]
  });
  raisePriorityExecution = this.makeRequest({
    method: "POST",
    path: "/executions/{id}/raise-priority",
    urlParamKeys: ["id"]
  });
  // Get required actions provider's configuration description
  getRequiredActionConfigDescription = this.makeRequest({
    method: "GET",
    path: "/required-actions/{alias}/config-description",
    urlParamKeys: ["alias"]
  });
  // Get the configuration of the RequiredAction provider in the current Realm.
  getRequiredActionConfig = this.makeRequest({
    method: "GET",
    path: "/required-actions/{alias}/config",
    urlParamKeys: ["alias"]
  });
  // Remove the configuration from the RequiredAction provider in the current Realm.
  removeRequiredActionConfig = this.makeRequest({
    method: "DELETE",
    path: "/required-actions/{alias}/config",
    urlParamKeys: ["alias"]
  });
  // Update the configuration from the RequiredAction provider in the current Realm.
  updateRequiredActionConfig = this.makeUpdateRequest({
    method: "PUT",
    path: "/required-actions/{alias}/config",
    urlParamKeys: ["alias"]
  });
  getConfigDescription = this.makeRequest({
    method: "GET",
    path: "config-description/{providerId}",
    urlParamKeys: ["providerId"]
  });
  createConfig = this.makeRequest({
    method: "POST",
    path: "/executions/{id}/config",
    urlParamKeys: ["id"],
    returnResourceIdInLocationHeader: { field: "id" }
  });
  updateConfig = this.makeRequest({
    method: "PUT",
    path: "/config/{id}",
    urlParamKeys: ["id"]
  });
  getConfig = this.makeRequest({
    method: "GET",
    path: "/config/{id}",
    urlParamKeys: ["id"]
  });
  delConfig = this.makeRequest({
    method: "DELETE",
    path: "/config/{id}",
    urlParamKeys: ["id"]
  });
  constructor(client) {
    super(client, {
      path: "/admin/realms/{realm}/authentication",
      getUrlParams: () => ({
        realm: client.realmName
      }),
      getBaseUrl: () => client.baseUrl
    });
  }
};

// node_modules/@keycloak/keycloak-admin-client/lib/resources/cache.js
var Cache = class extends Resource {
  clearUserCache = this.makeRequest({
    method: "POST",
    path: "/clear-user-cache"
  });
  constructor(client) {
    super(client, {
      path: "/admin/realms/{realm}",
      getUrlParams: () => ({
        realm: client.realmName
      }),
      getBaseUrl: () => client.baseUrl
    });
  }
};

// node_modules/@keycloak/keycloak-admin-client/lib/resources/clientPolicies.js
var ClientPolicies = class extends Resource {
  constructor(client) {
    super(client, {
      path: "/admin/realms/{realm}/client-policies",
      getUrlParams: () => ({
        realm: client.realmName
      }),
      getBaseUrl: () => client.baseUrl
    });
  }
  /* Client Profiles */
  listProfiles = this.makeRequest({
    method: "GET",
    path: "/profiles",
    queryParamKeys: ["include-global-profiles"],
    keyTransform: {
      includeGlobalProfiles: "include-global-profiles"
    }
  });
  createProfiles = this.makeRequest({
    method: "PUT",
    path: "/profiles"
  });
  /* Client Policies */
  listPolicies = this.makeRequest({
    method: "GET",
    path: "/policies",
    queryParamKeys: ["include-global-policies"],
    keyTransform: {
      includeGlobalPolicies: "include-global-policies"
    }
  });
  updatePolicy = this.makeRequest({
    method: "PUT",
    path: "/policies"
  });
};

// node_modules/@keycloak/keycloak-admin-client/lib/resources/clients.js
var Clients = class extends Resource {
  find = this.makeRequest({
    method: "GET"
  });
  create = this.makeRequest({
    method: "POST",
    returnResourceIdInLocationHeader: { field: "id" }
  });
  /**
   * Single client
   */
  findOne = this.makeRequest({
    method: "GET",
    path: "/{id}",
    urlParamKeys: ["id"],
    catchNotFound: true
  });
  update = this.makeUpdateRequest({
    method: "PUT",
    path: "/{id}",
    urlParamKeys: ["id"]
  });
  del = this.makeRequest({
    method: "DELETE",
    path: "/{id}",
    urlParamKeys: ["id"]
  });
  /**
   * Client roles
   */
  createRole = this.makeRequest({
    method: "POST",
    path: "/{id}/roles",
    urlParamKeys: ["id"],
    returnResourceIdInLocationHeader: { field: "roleName" }
  });
  listRoles = this.makeRequest({
    method: "GET",
    path: "/{id}/roles",
    urlParamKeys: ["id"]
  });
  findRole = this.makeRequest({
    method: "GET",
    path: "/{id}/roles/{roleName}",
    urlParamKeys: ["id", "roleName"],
    catchNotFound: true
  });
  updateRole = this.makeUpdateRequest({
    method: "PUT",
    path: "/{id}/roles/{roleName}",
    urlParamKeys: ["id", "roleName"]
  });
  delRole = this.makeRequest({
    method: "DELETE",
    path: "/{id}/roles/{roleName}",
    urlParamKeys: ["id", "roleName"]
  });
  findUsersWithRole = this.makeRequest({
    method: "GET",
    path: "/{id}/roles/{roleName}/users",
    urlParamKeys: ["id", "roleName"]
  });
  /**
   * Service account user
   */
  getServiceAccountUser = this.makeRequest({
    method: "GET",
    path: "/{id}/service-account-user",
    urlParamKeys: ["id"]
  });
  /**
   * Client secret
   */
  generateNewClientSecret = this.makeRequest({
    method: "POST",
    path: "/{id}/client-secret",
    urlParamKeys: ["id"]
  });
  invalidateSecret = this.makeRequest({
    method: "DELETE",
    path: "/{id}/client-secret/rotated",
    urlParamKeys: ["id"]
  });
  generateRegistrationAccessToken = this.makeRequest({
    method: "POST",
    path: "/{id}/registration-access-token",
    urlParamKeys: ["id"]
  });
  getClientSecret = this.makeRequest({
    method: "GET",
    path: "/{id}/client-secret",
    urlParamKeys: ["id"]
  });
  /**
   * Client Scopes
   */
  listDefaultClientScopes = this.makeRequest({
    method: "GET",
    path: "/{id}/default-client-scopes",
    urlParamKeys: ["id"]
  });
  addDefaultClientScope = this.makeRequest({
    method: "PUT",
    path: "/{id}/default-client-scopes/{clientScopeId}",
    urlParamKeys: ["id", "clientScopeId"]
  });
  delDefaultClientScope = this.makeRequest({
    method: "DELETE",
    path: "/{id}/default-client-scopes/{clientScopeId}",
    urlParamKeys: ["id", "clientScopeId"]
  });
  listOptionalClientScopes = this.makeRequest({
    method: "GET",
    path: "/{id}/optional-client-scopes",
    urlParamKeys: ["id"]
  });
  addOptionalClientScope = this.makeRequest({
    method: "PUT",
    path: "/{id}/optional-client-scopes/{clientScopeId}",
    urlParamKeys: ["id", "clientScopeId"]
  });
  delOptionalClientScope = this.makeRequest({
    method: "DELETE",
    path: "/{id}/optional-client-scopes/{clientScopeId}",
    urlParamKeys: ["id", "clientScopeId"]
  });
  /**
   * Protocol Mappers
   */
  addMultipleProtocolMappers = this.makeUpdateRequest({
    method: "POST",
    path: "/{id}/protocol-mappers/add-models",
    urlParamKeys: ["id"]
  });
  addProtocolMapper = this.makeUpdateRequest({
    method: "POST",
    path: "/{id}/protocol-mappers/models",
    urlParamKeys: ["id"]
  });
  listProtocolMappers = this.makeRequest({
    method: "GET",
    path: "/{id}/protocol-mappers/models",
    urlParamKeys: ["id"]
  });
  findProtocolMapperById = this.makeRequest({
    method: "GET",
    path: "/{id}/protocol-mappers/models/{mapperId}",
    urlParamKeys: ["id", "mapperId"],
    catchNotFound: true
  });
  findProtocolMappersByProtocol = this.makeRequest({
    method: "GET",
    path: "/{id}/protocol-mappers/protocol/{protocol}",
    urlParamKeys: ["id", "protocol"],
    catchNotFound: true
  });
  updateProtocolMapper = this.makeUpdateRequest({
    method: "PUT",
    path: "/{id}/protocol-mappers/models/{mapperId}",
    urlParamKeys: ["id", "mapperId"]
  });
  delProtocolMapper = this.makeRequest({
    method: "DELETE",
    path: "/{id}/protocol-mappers/models/{mapperId}",
    urlParamKeys: ["id", "mapperId"]
  });
  /**
   * Scope Mappings
   */
  listScopeMappings = this.makeRequest({
    method: "GET",
    path: "/{id}/scope-mappings",
    urlParamKeys: ["id"]
  });
  addClientScopeMappings = this.makeUpdateRequest({
    method: "POST",
    path: "/{id}/scope-mappings/clients/{client}",
    urlParamKeys: ["id", "client"]
  });
  listClientScopeMappings = this.makeRequest({
    method: "GET",
    path: "/{id}/scope-mappings/clients/{client}",
    urlParamKeys: ["id", "client"]
  });
  listAvailableClientScopeMappings = this.makeRequest({
    method: "GET",
    path: "/{id}/scope-mappings/clients/{client}/available",
    urlParamKeys: ["id", "client"]
  });
  listCompositeClientScopeMappings = this.makeRequest({
    method: "GET",
    path: "/{id}/scope-mappings/clients/{client}/composite",
    urlParamKeys: ["id", "client"]
  });
  delClientScopeMappings = this.makeUpdateRequest({
    method: "DELETE",
    path: "/{id}/scope-mappings/clients/{client}",
    urlParamKeys: ["id", "client"]
  });
  evaluatePermission = this.makeRequest({
    method: "GET",
    path: "/{id}/evaluate-scopes/scope-mappings/{roleContainer}/{type}",
    urlParamKeys: ["id", "roleContainer", "type"],
    queryParamKeys: ["scope"]
  });
  evaluateListProtocolMapper = this.makeRequest({
    method: "GET",
    path: "/{id}/evaluate-scopes/protocol-mappers",
    urlParamKeys: ["id"],
    queryParamKeys: ["scope"]
  });
  evaluateGenerateAccessToken = this.makeRequest({
    method: "GET",
    path: "/{id}/evaluate-scopes/generate-example-access-token",
    urlParamKeys: ["id"],
    queryParamKeys: ["scope", "userId"]
  });
  evaluateGenerateUserInfo = this.makeRequest({
    method: "GET",
    path: "/{id}/evaluate-scopes/generate-example-userinfo",
    urlParamKeys: ["id"],
    queryParamKeys: ["scope", "userId"]
  });
  evaluateGenerateIdToken = this.makeRequest({
    method: "GET",
    path: "/{id}/evaluate-scopes/generate-example-id-token",
    urlParamKeys: ["id"],
    queryParamKeys: ["scope", "userId"]
  });
  addRealmScopeMappings = this.makeUpdateRequest({
    method: "POST",
    path: "/{id}/scope-mappings/realm",
    urlParamKeys: ["id", "client"]
  });
  listRealmScopeMappings = this.makeRequest({
    method: "GET",
    path: "/{id}/scope-mappings/realm",
    urlParamKeys: ["id"]
  });
  listAvailableRealmScopeMappings = this.makeRequest({
    method: "GET",
    path: "/{id}/scope-mappings/realm/available",
    urlParamKeys: ["id"]
  });
  listCompositeRealmScopeMappings = this.makeRequest({
    method: "GET",
    path: "/{id}/scope-mappings/realm/composite",
    urlParamKeys: ["id"]
  });
  delRealmScopeMappings = this.makeUpdateRequest({
    method: "DELETE",
    path: "/{id}/scope-mappings/realm",
    urlParamKeys: ["id"]
  });
  /**
   * Sessions
   */
  listSessions = this.makeRequest({
    method: "GET",
    path: "/{id}/user-sessions",
    urlParamKeys: ["id"]
  });
  listOfflineSessions = this.makeRequest({
    method: "GET",
    path: "/{id}/offline-sessions",
    urlParamKeys: ["id"]
  });
  getSessionCount = this.makeRequest({
    method: "GET",
    path: "/{id}/session-count",
    urlParamKeys: ["id"]
  });
  /**
   * Resource
   */
  getResourceServer = this.makeRequest({
    method: "GET",
    path: "{id}/authz/resource-server",
    urlParamKeys: ["id"]
  });
  updateResourceServer = this.makeUpdateRequest({
    method: "PUT",
    path: "{id}/authz/resource-server",
    urlParamKeys: ["id"]
  });
  listResources = this.makeRequest({
    method: "GET",
    path: "{id}/authz/resource-server/resource",
    urlParamKeys: ["id"]
  });
  createResource = this.makeUpdateRequest({
    method: "POST",
    path: "{id}/authz/resource-server/resource",
    urlParamKeys: ["id"]
  });
  getResource = this.makeRequest({
    method: "GET",
    path: "{id}/authz/resource-server/resource/{resourceId}",
    urlParamKeys: ["id", "resourceId"]
  });
  updateResource = this.makeUpdateRequest({
    method: "PUT",
    path: "/{id}/authz/resource-server/resource/{resourceId}",
    urlParamKeys: ["id", "resourceId"]
  });
  delResource = this.makeRequest({
    method: "DELETE",
    path: "/{id}/authz/resource-server/resource/{resourceId}",
    urlParamKeys: ["id", "resourceId"]
  });
  importResource = this.makeUpdateRequest({
    method: "POST",
    path: "/{id}/authz/resource-server/import",
    urlParamKeys: ["id"]
  });
  exportResource = this.makeRequest({
    method: "GET",
    path: "/{id}/authz/resource-server/settings",
    urlParamKeys: ["id"]
  });
  evaluateResource = this.makeUpdateRequest({
    method: "POST",
    path: "{id}/authz/resource-server/policy/evaluate",
    urlParamKeys: ["id"]
  });
  /**
   * Policy
   */
  listPolicies = this.makeRequest({
    method: "GET",
    path: "{id}/authz/resource-server/policy",
    urlParamKeys: ["id"]
  });
  findPolicyByName = this.makeRequest({
    method: "GET",
    path: "{id}/authz/resource-server/policy/search",
    urlParamKeys: ["id"]
  });
  updatePolicy = this.makeUpdateRequest({
    method: "PUT",
    path: "/{id}/authz/resource-server/policy/{type}/{policyId}",
    urlParamKeys: ["id", "type", "policyId"]
  });
  createPolicy = this.makeUpdateRequest({
    method: "POST",
    path: "/{id}/authz/resource-server/policy/{type}",
    urlParamKeys: ["id", "type"]
  });
  findOnePolicy = this.makeRequest({
    method: "GET",
    path: "/{id}/authz/resource-server/policy/{type}/{policyId}",
    urlParamKeys: ["id", "type", "policyId"],
    catchNotFound: true
  });
  listDependentPolicies = this.makeRequest({
    method: "GET",
    path: "/{id}/authz/resource-server/policy/{policyId}/dependentPolicies",
    urlParamKeys: ["id", "policyId"]
  });
  delPolicy = this.makeRequest({
    method: "DELETE",
    path: "{id}/authz/resource-server/policy/{policyId}",
    urlParamKeys: ["id", "policyId"]
  });
  listPolicyProviders = this.makeRequest({
    method: "GET",
    path: "/{id}/authz/resource-server/policy/providers",
    urlParamKeys: ["id"]
  });
  async createOrUpdatePolicy(payload) {
    const policyFound = await this.findPolicyByName({
      id: payload.id,
      name: payload.policyName
    });
    if (policyFound) {
      await this.updatePolicy({
        id: payload.id,
        policyId: policyFound.id,
        type: payload.policy.type
      }, payload.policy);
      return this.findPolicyByName({
        id: payload.id,
        name: payload.policyName
      });
    } else {
      return this.createPolicy({ id: payload.id, type: payload.policy.type }, payload.policy);
    }
  }
  /**
   * Scopes
   */
  listAllScopes = this.makeRequest({
    method: "GET",
    path: "/{id}/authz/resource-server/scope",
    urlParamKeys: ["id"]
  });
  listAllResourcesByScope = this.makeRequest({
    method: "GET",
    path: "/{id}/authz/resource-server/scope/{scopeId}/resources",
    urlParamKeys: ["id", "scopeId"]
  });
  listAllPermissionsByScope = this.makeRequest({
    method: "GET",
    path: "/{id}/authz/resource-server/scope/{scopeId}/permissions",
    urlParamKeys: ["id", "scopeId"]
  });
  listPermissionsByResource = this.makeRequest({
    method: "GET",
    path: "/{id}/authz/resource-server/resource/{resourceId}/permissions",
    urlParamKeys: ["id", "resourceId"]
  });
  listScopesByResource = this.makeRequest({
    method: "GET",
    path: "/{id}/authz/resource-server/resource/{resourceName}/scopes",
    urlParamKeys: ["id", "resourceName"]
  });
  createAuthorizationScope = this.makeUpdateRequest({
    method: "POST",
    path: "{id}/authz/resource-server/scope",
    urlParamKeys: ["id"]
  });
  updateAuthorizationScope = this.makeUpdateRequest({
    method: "PUT",
    path: "/{id}/authz/resource-server/scope/{scopeId}",
    urlParamKeys: ["id", "scopeId"]
  });
  getAuthorizationScope = this.makeRequest({
    method: "GET",
    path: "/{id}/authz/resource-server/scope/{scopeId}",
    urlParamKeys: ["id", "scopeId"]
  });
  delAuthorizationScope = this.makeRequest({
    method: "DELETE",
    path: "/{id}/authz/resource-server/scope/{scopeId}",
    urlParamKeys: ["id", "scopeId"]
  });
  /**
   * Permissions
   */
  findPermissions = this.makeRequest({
    method: "GET",
    path: "{id}/authz/resource-server/permission",
    urlParamKeys: ["id"]
  });
  createPermission = this.makeUpdateRequest({
    method: "POST",
    path: "/{id}/authz/resource-server/permission/{type}",
    urlParamKeys: ["id", "type"]
  });
  updatePermission = this.makeUpdateRequest({
    method: "PUT",
    path: "/{id}/authz/resource-server/permission/{type}/{permissionId}",
    urlParamKeys: ["id", "type", "permissionId"]
  });
  delPermission = this.makeRequest({
    method: "DELETE",
    path: "/{id}/authz/resource-server/permission/{type}/{permissionId}",
    urlParamKeys: ["id", "type", "permissionId"]
  });
  findOnePermission = this.makeRequest({
    method: "GET",
    path: "/{id}/authz/resource-server/permission/{type}/{permissionId}",
    urlParamKeys: ["id", "type", "permissionId"]
  });
  getAssociatedScopes = this.makeRequest({
    method: "GET",
    path: "/{id}/authz/resource-server/policy/{permissionId}/scopes",
    urlParamKeys: ["id", "permissionId"]
  });
  getAssociatedResources = this.makeRequest({
    method: "GET",
    path: "/{id}/authz/resource-server/policy/{permissionId}/resources",
    urlParamKeys: ["id", "permissionId"]
  });
  getAssociatedPolicies = this.makeRequest({
    method: "GET",
    path: "/{id}/authz/resource-server/policy/{permissionId}/associatedPolicies",
    urlParamKeys: ["id", "permissionId"]
  });
  getOfflineSessionCount = this.makeRequest({
    method: "GET",
    path: "/{id}/offline-session-count",
    urlParamKeys: ["id"]
  });
  getInstallationProviders = this.makeRequest({
    method: "GET",
    path: "/{id}/installation/providers/{providerId}",
    urlParamKeys: ["id", "providerId"]
  });
  pushRevocation = this.makeRequest({
    method: "POST",
    path: "/{id}/push-revocation",
    urlParamKeys: ["id"]
  });
  addClusterNode = this.makeRequest({
    method: "POST",
    path: "/{id}/nodes",
    urlParamKeys: ["id"]
  });
  deleteClusterNode = this.makeRequest({
    method: "DELETE",
    path: "/{id}/nodes/{node}",
    urlParamKeys: ["id", "node"]
  });
  testNodesAvailable = this.makeRequest({
    method: "GET",
    path: "/{id}/test-nodes-available",
    urlParamKeys: ["id"]
  });
  getKeyInfo = this.makeRequest({
    method: "GET",
    path: "/{id}/certificates/{attr}",
    urlParamKeys: ["id", "attr"]
  });
  generateKey = this.makeRequest({
    method: "POST",
    path: "/{id}/certificates/{attr}/generate",
    urlParamKeys: ["id", "attr"]
  });
  downloadKey = this.makeUpdateRequest({
    method: "POST",
    path: "/{id}/certificates/{attr}/download",
    urlParamKeys: ["id", "attr"],
    headers: {
      accept: "application/octet-stream"
    }
  });
  generateAndDownloadKey = this.makeUpdateRequest({
    method: "POST",
    path: "/{id}/certificates/{attr}/generate-and-download",
    urlParamKeys: ["id", "attr"],
    headers: {
      accept: "application/octet-stream"
    }
  });
  uploadKey = this.makeUpdateRequest({
    method: "POST",
    path: "/{id}/certificates/{attr}/upload",
    urlParamKeys: ["id", "attr"]
  });
  uploadCertificate = this.makeUpdateRequest({
    method: "POST",
    path: "/{id}/certificates/{attr}/upload-certificate",
    urlParamKeys: ["id", "attr"]
  });
  updateFineGrainPermission = this.makeUpdateRequest({
    method: "PUT",
    path: "/{id}/management/permissions",
    urlParamKeys: ["id"]
  });
  listFineGrainPermissions = this.makeRequest({
    method: "GET",
    path: "/{id}/management/permissions",
    urlParamKeys: ["id"]
  });
  constructor(client) {
    super(client, {
      path: "/admin/realms/{realm}/clients",
      getUrlParams: () => ({
        realm: client.realmName
      }),
      getBaseUrl: () => client.baseUrl
    });
  }
  /**
   * Find single protocol mapper by name.
   */
  async findProtocolMapperByName(payload) {
    const allProtocolMappers = await this.listProtocolMappers({
      id: payload.id,
      ...payload.realm ? { realm: payload.realm } : {}
    });
    return allProtocolMappers.find((mapper) => mapper.name === payload.name);
  }
};

// node_modules/@keycloak/keycloak-admin-client/lib/resources/clientScopes.js
var ClientScopes = class extends Resource {
  find = this.makeRequest({
    method: "GET",
    path: "/client-scopes"
  });
  create = this.makeRequest({
    method: "POST",
    path: "/client-scopes",
    returnResourceIdInLocationHeader: { field: "id" }
  });
  /**
   * Client-Scopes by id
   */
  findOne = this.makeRequest({
    method: "GET",
    path: "/client-scopes/{id}",
    urlParamKeys: ["id"],
    catchNotFound: true
  });
  update = this.makeUpdateRequest({
    method: "PUT",
    path: "/client-scopes/{id}",
    urlParamKeys: ["id"]
  });
  del = this.makeRequest({
    method: "DELETE",
    path: "/client-scopes/{id}",
    urlParamKeys: ["id"]
  });
  /**
   * Default Client-Scopes
   */
  listDefaultClientScopes = this.makeRequest({
    method: "GET",
    path: "/default-default-client-scopes"
  });
  addDefaultClientScope = this.makeRequest({
    method: "PUT",
    path: "/default-default-client-scopes/{id}",
    urlParamKeys: ["id"]
  });
  delDefaultClientScope = this.makeRequest({
    method: "DELETE",
    path: "/default-default-client-scopes/{id}",
    urlParamKeys: ["id"]
  });
  /**
   * Default Optional Client-Scopes
   */
  listDefaultOptionalClientScopes = this.makeRequest({
    method: "GET",
    path: "/default-optional-client-scopes"
  });
  addDefaultOptionalClientScope = this.makeRequest({
    method: "PUT",
    path: "/default-optional-client-scopes/{id}",
    urlParamKeys: ["id"]
  });
  delDefaultOptionalClientScope = this.makeRequest({
    method: "DELETE",
    path: "/default-optional-client-scopes/{id}",
    urlParamKeys: ["id"]
  });
  /**
   * Protocol Mappers
   */
  addMultipleProtocolMappers = this.makeUpdateRequest({
    method: "POST",
    path: "/client-scopes/{id}/protocol-mappers/add-models",
    urlParamKeys: ["id"]
  });
  addProtocolMapper = this.makeUpdateRequest({
    method: "POST",
    path: "/client-scopes/{id}/protocol-mappers/models",
    urlParamKeys: ["id"]
  });
  listProtocolMappers = this.makeRequest({
    method: "GET",
    path: "/client-scopes/{id}/protocol-mappers/models",
    urlParamKeys: ["id"]
  });
  findProtocolMapper = this.makeRequest({
    method: "GET",
    path: "/client-scopes/{id}/protocol-mappers/models/{mapperId}",
    urlParamKeys: ["id", "mapperId"],
    catchNotFound: true
  });
  findProtocolMappersByProtocol = this.makeRequest({
    method: "GET",
    path: "/client-scopes/{id}/protocol-mappers/protocol/{protocol}",
    urlParamKeys: ["id", "protocol"],
    catchNotFound: true
  });
  updateProtocolMapper = this.makeUpdateRequest({
    method: "PUT",
    path: "/client-scopes/{id}/protocol-mappers/models/{mapperId}",
    urlParamKeys: ["id", "mapperId"]
  });
  delProtocolMapper = this.makeRequest({
    method: "DELETE",
    path: "/client-scopes/{id}/protocol-mappers/models/{mapperId}",
    urlParamKeys: ["id", "mapperId"]
  });
  /**
   * Scope Mappings
   */
  listScopeMappings = this.makeRequest({
    method: "GET",
    path: "/client-scopes/{id}/scope-mappings",
    urlParamKeys: ["id"]
  });
  addClientScopeMappings = this.makeUpdateRequest({
    method: "POST",
    path: "/client-scopes/{id}/scope-mappings/clients/{client}",
    urlParamKeys: ["id", "client"]
  });
  listClientScopeMappings = this.makeRequest({
    method: "GET",
    path: "/client-scopes/{id}/scope-mappings/clients/{client}",
    urlParamKeys: ["id", "client"]
  });
  listAvailableClientScopeMappings = this.makeRequest({
    method: "GET",
    path: "/client-scopes/{id}/scope-mappings/clients/{client}/available",
    urlParamKeys: ["id", "client"]
  });
  listCompositeClientScopeMappings = this.makeRequest({
    method: "GET",
    path: "/client-scopes/{id}/scope-mappings/clients/{client}/composite",
    urlParamKeys: ["id", "client"]
  });
  delClientScopeMappings = this.makeUpdateRequest({
    method: "DELETE",
    path: "/client-scopes/{id}/scope-mappings/clients/{client}",
    urlParamKeys: ["id", "client"]
  });
  addRealmScopeMappings = this.makeUpdateRequest({
    method: "POST",
    path: "/client-scopes/{id}/scope-mappings/realm",
    urlParamKeys: ["id"]
  });
  listRealmScopeMappings = this.makeRequest({
    method: "GET",
    path: "/client-scopes/{id}/scope-mappings/realm",
    urlParamKeys: ["id"]
  });
  listAvailableRealmScopeMappings = this.makeRequest({
    method: "GET",
    path: "/client-scopes/{id}/scope-mappings/realm/available",
    urlParamKeys: ["id"]
  });
  listCompositeRealmScopeMappings = this.makeRequest({
    method: "GET",
    path: "/client-scopes/{id}/scope-mappings/realm/composite",
    urlParamKeys: ["id"]
  });
  delRealmScopeMappings = this.makeUpdateRequest({
    method: "DELETE",
    path: "/client-scopes/{id}/scope-mappings/realm",
    urlParamKeys: ["id"]
  });
  constructor(client) {
    super(client, {
      path: "/admin/realms/{realm}",
      getUrlParams: () => ({
        realm: client.realmName
      }),
      getBaseUrl: () => client.baseUrl
    });
  }
  /**
   * Find client scope by name.
   */
  async findOneByName(payload) {
    const allScopes = await this.find({
      ...payload.realm ? { realm: payload.realm } : {}
    });
    return allScopes.find((item) => item.name === payload.name);
  }
  /**
   * Delete client scope by name.
   */
  async delByName(payload) {
    const scope = await this.findOneByName(payload);
    if (!scope) {
      throw new Error("Scope not found.");
    }
    await this.del({
      ...payload.realm ? { realm: payload.realm } : {},
      id: scope.id
    });
  }
  /**
   * Find single protocol mapper by name.
   */
  async findProtocolMapperByName(payload) {
    const allProtocolMappers = await this.listProtocolMappers({
      id: payload.id,
      ...payload.realm ? { realm: payload.realm } : {}
    });
    return allProtocolMappers.find((mapper) => mapper.name === payload.name);
  }
};

// node_modules/@keycloak/keycloak-admin-client/lib/resources/components.js
var Components = class extends Resource {
  /**
   * components
   * https://www.keycloak.org/docs-api/11.0/rest-api/#_component_resource
   */
  find = this.makeRequest({
    method: "GET"
  });
  create = this.makeRequest({
    method: "POST",
    returnResourceIdInLocationHeader: { field: "id" }
  });
  findOne = this.makeRequest({
    method: "GET",
    path: "/{id}",
    urlParamKeys: ["id"],
    catchNotFound: true
  });
  update = this.makeUpdateRequest({
    method: "PUT",
    path: "/{id}",
    urlParamKeys: ["id"]
  });
  del = this.makeRequest({
    method: "DELETE",
    path: "/{id}",
    urlParamKeys: ["id"]
  });
  listSubComponents = this.makeRequest({
    method: "GET",
    path: "/{id}/sub-component-types",
    urlParamKeys: ["id"],
    queryParamKeys: ["type"]
  });
  constructor(client) {
    super(client, {
      path: "/admin/realms/{realm}/components",
      getUrlParams: () => ({
        realm: client.realmName
      }),
      getBaseUrl: () => client.baseUrl
    });
  }
};

// node_modules/@keycloak/keycloak-admin-client/lib/resources/groups.js
var Groups = class extends Resource {
  find = this.makeRequest({
    method: "GET",
    queryParamKeys: [
      "search",
      "q",
      "exact",
      "briefRepresentation",
      "populateHierarchy",
      "first",
      "max"
    ]
  });
  create = this.makeRequest({
    method: "POST",
    returnResourceIdInLocationHeader: { field: "id" }
  });
  updateRoot = this.makeRequest({
    method: "POST"
  });
  /**
   * Single user
   */
  findOne = this.makeRequest({
    method: "GET",
    path: "/{id}",
    urlParamKeys: ["id"],
    catchNotFound: true
  });
  update = this.makeUpdateRequest({
    method: "PUT",
    path: "/{id}",
    urlParamKeys: ["id"]
  });
  del = this.makeRequest({
    method: "DELETE",
    path: "/{id}",
    urlParamKeys: ["id"]
  });
  count = this.makeRequest({
    method: "GET",
    path: "/count"
  });
  /**
   * Creates a child group on the specified parent group. If the group already exists, then an error is returned.
   */
  createChildGroup = this.makeUpdateRequest({
    method: "POST",
    path: "/{id}/children",
    urlParamKeys: ["id"],
    returnResourceIdInLocationHeader: { field: "id" }
  });
  /**
   * Updates a child group on the specified parent group. If the group doesn’t exist, then an error is returned.
   * Can be used to move a group from one parent to another.
   */
  updateChildGroup = this.makeUpdateRequest({
    method: "POST",
    path: "/{id}/children",
    urlParamKeys: ["id"]
  });
  /**
   * Finds all subgroups on the specified parent group matching the provided parameters.
   */
  listSubGroups = this.makeRequest({
    method: "GET",
    path: "/{parentId}/children",
    urlParamKeys: ["parentId"],
    queryParamKeys: ["search", "first", "max", "briefRepresentation"],
    catchNotFound: true
  });
  /**
   * Members
   */
  listMembers = this.makeRequest({
    method: "GET",
    path: "/{id}/members",
    urlParamKeys: ["id"],
    catchNotFound: true
  });
  /**
   * Role mappings
   * https://www.keycloak.org/docs-api/11.0/rest-api/#_role_mapper_resource
   */
  listRoleMappings = this.makeRequest({
    method: "GET",
    path: "/{id}/role-mappings",
    urlParamKeys: ["id"]
  });
  addRealmRoleMappings = this.makeRequest({
    method: "POST",
    path: "/{id}/role-mappings/realm",
    urlParamKeys: ["id"],
    payloadKey: "roles"
  });
  listRealmRoleMappings = this.makeRequest({
    method: "GET",
    path: "/{id}/role-mappings/realm",
    urlParamKeys: ["id"]
  });
  delRealmRoleMappings = this.makeRequest({
    method: "DELETE",
    path: "/{id}/role-mappings/realm",
    urlParamKeys: ["id"],
    payloadKey: "roles"
  });
  listAvailableRealmRoleMappings = this.makeRequest({
    method: "GET",
    path: "/{id}/role-mappings/realm/available",
    urlParamKeys: ["id"]
  });
  // Get effective realm-level role mappings This will recurse all composite roles to get the result.
  listCompositeRealmRoleMappings = this.makeRequest({
    method: "GET",
    path: "/{id}/role-mappings/realm/composite",
    urlParamKeys: ["id"]
  });
  /**
   * Client role mappings
   * https://www.keycloak.org/docs-api/11.0/rest-api/#_client_role_mappings_resource
   */
  listClientRoleMappings = this.makeRequest({
    method: "GET",
    path: "/{id}/role-mappings/clients/{clientUniqueId}",
    urlParamKeys: ["id", "clientUniqueId"]
  });
  addClientRoleMappings = this.makeRequest({
    method: "POST",
    path: "/{id}/role-mappings/clients/{clientUniqueId}",
    urlParamKeys: ["id", "clientUniqueId"],
    payloadKey: "roles"
  });
  delClientRoleMappings = this.makeRequest({
    method: "DELETE",
    path: "/{id}/role-mappings/clients/{clientUniqueId}",
    urlParamKeys: ["id", "clientUniqueId"],
    payloadKey: "roles"
  });
  listAvailableClientRoleMappings = this.makeRequest({
    method: "GET",
    path: "/{id}/role-mappings/clients/{clientUniqueId}/available",
    urlParamKeys: ["id", "clientUniqueId"]
  });
  listCompositeClientRoleMappings = this.makeRequest({
    method: "GET",
    path: "/{id}/role-mappings/clients/{clientUniqueId}/composite",
    urlParamKeys: ["id", "clientUniqueId"]
  });
  /**
   * Authorization permissions
   */
  updatePermission = this.makeUpdateRequest({
    method: "PUT",
    path: "/{id}/management/permissions",
    urlParamKeys: ["id"]
  });
  listPermissions = this.makeRequest({
    method: "GET",
    path: "/{id}/management/permissions",
    urlParamKeys: ["id"]
  });
  constructor(client) {
    super(client, {
      path: "/admin/realms/{realm}/groups",
      getUrlParams: () => ({
        realm: client.realmName
      }),
      getBaseUrl: () => client.baseUrl
    });
  }
};

// node_modules/@keycloak/keycloak-admin-client/lib/resources/identityProviders.js
var IdentityProviders = class extends Resource {
  /**
   * Identity provider
   * https://www.keycloak.org/docs-api/11.0/rest-api/#_identity_providers_resource
   */
  find = this.makeRequest({
    method: "GET",
    path: "/instances"
  });
  create = this.makeRequest({
    method: "POST",
    path: "/instances",
    returnResourceIdInLocationHeader: { field: "id" }
  });
  findOne = this.makeRequest({
    method: "GET",
    path: "/instances/{alias}",
    urlParamKeys: ["alias"],
    catchNotFound: true
  });
  update = this.makeUpdateRequest({
    method: "PUT",
    path: "/instances/{alias}",
    urlParamKeys: ["alias"]
  });
  del = this.makeRequest({
    method: "DELETE",
    path: "/instances/{alias}",
    urlParamKeys: ["alias"]
  });
  findFactory = this.makeRequest({
    method: "GET",
    path: "/providers/{providerId}",
    urlParamKeys: ["providerId"]
  });
  findMappers = this.makeRequest({
    method: "GET",
    path: "/instances/{alias}/mappers",
    urlParamKeys: ["alias"]
  });
  findOneMapper = this.makeRequest({
    method: "GET",
    path: "/instances/{alias}/mappers/{id}",
    urlParamKeys: ["alias", "id"],
    catchNotFound: true
  });
  createMapper = this.makeRequest({
    method: "POST",
    path: "/instances/{alias}/mappers",
    urlParamKeys: ["alias"],
    payloadKey: "identityProviderMapper",
    returnResourceIdInLocationHeader: { field: "id" }
  });
  updateMapper = this.makeUpdateRequest({
    method: "PUT",
    path: "/instances/{alias}/mappers/{id}",
    urlParamKeys: ["alias", "id"]
  });
  delMapper = this.makeRequest({
    method: "DELETE",
    path: "/instances/{alias}/mappers/{id}",
    urlParamKeys: ["alias", "id"]
  });
  findMapperTypes = this.makeRequest({
    method: "GET",
    path: "/instances/{alias}/mapper-types",
    urlParamKeys: ["alias"]
  });
  importFromUrl = this.makeRequest({
    method: "POST",
    path: "/import-config"
  });
  updatePermission = this.makeUpdateRequest({
    method: "PUT",
    path: "/instances/{alias}/management/permissions",
    urlParamKeys: ["alias"]
  });
  listPermissions = this.makeRequest({
    method: "GET",
    path: "/instances/{alias}/management/permissions",
    urlParamKeys: ["alias"]
  });
  reloadKeys = this.makeRequest({
    method: "GET",
    path: "/instances/{alias}/reload-keys",
    urlParamKeys: ["alias"]
  });
  constructor(client) {
    super(client, {
      path: "/admin/realms/{realm}/identity-provider",
      getUrlParams: () => ({
        realm: client.realmName
      }),
      getBaseUrl: () => client.baseUrl
    });
  }
};

// node_modules/@keycloak/keycloak-admin-client/lib/resources/realms.js
var Realms = class extends Resource {
  /**
   * Realm
   * https://www.keycloak.org/docs-api/11.0/rest-api/#_realms_admin_resource
   */
  find = this.makeRequest({
    method: "GET"
  });
  create = this.makeRequest({
    method: "POST",
    returnResourceIdInLocationHeader: { field: "realmName" }
  });
  findOne = this.makeRequest({
    method: "GET",
    path: "/{realm}",
    urlParamKeys: ["realm"],
    catchNotFound: true
  });
  update = this.makeUpdateRequest({
    method: "PUT",
    path: "/{realm}",
    urlParamKeys: ["realm"]
  });
  del = this.makeRequest({
    method: "DELETE",
    path: "/{realm}",
    urlParamKeys: ["realm"]
  });
  partialImport = this.makeRequest({
    method: "POST",
    path: "/{realm}/partialImport",
    urlParamKeys: ["realm"],
    payloadKey: "rep"
  });
  export = this.makeRequest({
    method: "POST",
    path: "/{realm}/partial-export",
    urlParamKeys: ["realm"],
    queryParamKeys: ["exportClients", "exportGroupsAndRoles"]
  });
  getDefaultGroups = this.makeRequest({
    method: "GET",
    path: "/{realm}/default-groups",
    urlParamKeys: ["realm"]
  });
  addDefaultGroup = this.makeRequest({
    method: "PUT",
    path: "/{realm}/default-groups/{id}",
    urlParamKeys: ["realm", "id"]
  });
  removeDefaultGroup = this.makeRequest({
    method: "DELETE",
    path: "/{realm}/default-groups/{id}",
    urlParamKeys: ["realm", "id"]
  });
  getGroupByPath = this.makeRequest({
    method: "GET",
    path: "/{realm}/group-by-path/{path}",
    urlParamKeys: ["realm", "path"]
  });
  /**
   * Get events Returns all events, or filters them based on URL query parameters listed here
   */
  findEvents = this.makeRequest({
    method: "GET",
    path: "/{realm}/events",
    urlParamKeys: ["realm"],
    queryParamKeys: [
      "client",
      "dateFrom",
      "dateTo",
      "first",
      "ipAddress",
      "max",
      "type",
      "user"
    ]
  });
  getConfigEvents = this.makeRequest({
    method: "GET",
    path: "/{realm}/events/config",
    urlParamKeys: ["realm"]
  });
  updateConfigEvents = this.makeUpdateRequest({
    method: "PUT",
    path: "/{realm}/events/config",
    urlParamKeys: ["realm"]
  });
  clearEvents = this.makeRequest({
    method: "DELETE",
    path: "/{realm}/events",
    urlParamKeys: ["realm"]
  });
  clearAdminEvents = this.makeRequest({
    method: "DELETE",
    path: "/{realm}/admin-events",
    urlParamKeys: ["realm"]
  });
  getClientRegistrationPolicyProviders = this.makeRequest({
    method: "GET",
    path: "/{realm}/client-registration-policy/providers",
    urlParamKeys: ["realm"]
  });
  getClientsInitialAccess = this.makeRequest({
    method: "GET",
    path: "/{realm}/clients-initial-access",
    urlParamKeys: ["realm"]
  });
  createClientsInitialAccess = this.makeUpdateRequest({
    method: "POST",
    path: "/{realm}/clients-initial-access",
    urlParamKeys: ["realm"]
  });
  delClientsInitialAccess = this.makeRequest({
    method: "DELETE",
    path: "/{realm}/clients-initial-access/{id}",
    urlParamKeys: ["realm", "id"]
  });
  /**
   * Remove a specific user session.
   */
  removeSession = this.makeRequest({
    method: "DELETE",
    path: "/{realm}/sessions/{sessionId}",
    urlParamKeys: ["realm", "sessionId"],
    catchNotFound: true
  });
  /**
   * Get admin events Returns all admin events, or filters events based on URL query parameters listed here
   */
  findAdminEvents = this.makeRequest({
    method: "GET",
    path: "/{realm}/admin-events",
    urlParamKeys: ["realm"],
    queryParamKeys: [
      "authClient",
      "authIpAddress",
      "authRealm",
      "authUser",
      "dateFrom",
      "dateTo",
      "max",
      "first",
      "operationTypes",
      "resourcePath",
      "resourceTypes"
    ]
  });
  /**
   * Users management permissions
   */
  getUsersManagementPermissions = this.makeRequest({
    method: "GET",
    path: "/{realm}/users-management-permissions",
    urlParamKeys: ["realm"]
  });
  updateUsersManagementPermissions = this.makeRequest({
    method: "PUT",
    path: "/{realm}/users-management-permissions",
    urlParamKeys: ["realm"]
  });
  /**
   * Sessions
   */
  getClientSessionStats = this.makeRequest({
    method: "GET",
    path: "/{realm}/client-session-stats",
    urlParamKeys: ["realm"]
  });
  logoutAll = this.makeRequest({
    method: "POST",
    path: "/{realm}/logout-all",
    urlParamKeys: ["realm"]
  });
  deleteSession = this.makeRequest({
    method: "DELETE",
    path: "/{realm}/sessions/{session}",
    urlParamKeys: ["realm", "session"],
    queryParamKeys: ["isOffline"]
  });
  pushRevocation = this.makeRequest({
    method: "POST",
    path: "/{realm}/push-revocation",
    urlParamKeys: ["realm"],
    ignoredKeys: ["realm"]
  });
  getKeys = this.makeRequest({
    method: "GET",
    path: "/{realm}/keys",
    urlParamKeys: ["realm"]
  });
  testLDAPConnection = this.makeUpdateRequest({
    method: "POST",
    path: "/{realm}/testLDAPConnection",
    urlParamKeys: ["realm"]
  });
  testSMTPConnection = this.makeUpdateRequest({
    method: "POST",
    path: "/{realm}/testSMTPConnection",
    urlParamKeys: ["realm"]
  });
  ldapServerCapabilities = this.makeUpdateRequest({
    method: "POST",
    path: "/{realm}/ldap-server-capabilities",
    urlParamKeys: ["realm"]
  });
  getRealmSpecificLocales = this.makeRequest({
    method: "GET",
    path: "/{realm}/localization",
    urlParamKeys: ["realm"]
  });
  getRealmLocalizationTexts = this.makeRequest({
    method: "GET",
    path: "/{realm}/localization/{selectedLocale}",
    urlParamKeys: ["realm", "selectedLocale"]
  });
  addLocalization = this.makeUpdateRequest({
    method: "PUT",
    path: "/{realm}/localization/{selectedLocale}/{key}",
    urlParamKeys: ["realm", "selectedLocale", "key"],
    headers: { "content-type": "text/plain" }
  });
  deleteRealmLocalizationTexts = this.makeRequest({
    method: "DELETE",
    path: "/{realm}/localization/{selectedLocale}/{key}",
    urlParamKeys: ["realm", "selectedLocale", "key"]
  });
  constructor(client) {
    super(client, {
      path: "/admin/realms",
      getBaseUrl: () => client.baseUrl
    });
  }
};

// node_modules/@keycloak/keycloak-admin-client/lib/resources/organizations.js
var Organizations = class extends Resource {
  /**
   * Organizations
   */
  constructor(client) {
    super(client, {
      path: "/admin/realms/{realm}/organizations",
      getUrlParams: () => ({
        realm: client.realmName
      }),
      getBaseUrl: () => client.baseUrl
    });
  }
  find = this.makeRequest({
    method: "GET",
    path: "/"
  });
  findOne = this.makeRequest({
    method: "GET",
    path: "/{id}",
    urlParamKeys: ["id"]
  });
  create = this.makeRequest({
    method: "POST",
    returnResourceIdInLocationHeader: { field: "id" }
  });
  delById = this.makeRequest({
    method: "DELETE",
    path: "/{id}",
    urlParamKeys: ["id"]
  });
  updateById = this.makeUpdateRequest({
    method: "PUT",
    path: "/{id}",
    urlParamKeys: ["id"]
  });
  listMembers = this.makeRequest({
    method: "GET",
    path: "/{orgId}/members",
    urlParamKeys: ["orgId"]
  });
  addMember = this.makeRequest({
    method: "POST",
    path: "/{orgId}/members",
    urlParamKeys: ["orgId"],
    payloadKey: "userId"
  });
  delMember = this.makeRequest({
    method: "DELETE",
    path: "/{orgId}/members/{userId}",
    urlParamKeys: ["orgId", "userId"]
  });
  memberOrganizations = this.makeRequest({
    method: "GET",
    path: "/members/{userId}/organizations",
    urlParamKeys: ["userId"]
  });
  invite = this.makeUpdateRequest({
    method: "POST",
    path: "/{orgId}/members/invite-user",
    urlParamKeys: ["orgId"]
  });
  inviteExistingUser = this.makeUpdateRequest({
    method: "POST",
    path: "/{orgId}/members/invite-existing-user",
    urlParamKeys: ["orgId"]
  });
  listIdentityProviders = this.makeRequest({
    method: "GET",
    path: "/{orgId}/identity-providers",
    urlParamKeys: ["orgId"]
  });
  linkIdp = this.makeRequest({
    method: "POST",
    path: "/{orgId}/identity-providers",
    urlParamKeys: ["orgId"],
    payloadKey: "alias"
  });
  unLinkIdp = this.makeRequest({
    method: "DELETE",
    path: "/{orgId}/identity-providers/{alias}",
    urlParamKeys: ["orgId", "alias"]
  });
};

// node_modules/@keycloak/keycloak-admin-client/lib/resources/roles.js
var Roles = class extends Resource {
  /**
   * Realm roles
   */
  find = this.makeRequest({
    method: "GET",
    path: "/roles"
  });
  create = this.makeRequest({
    method: "POST",
    path: "/roles",
    returnResourceIdInLocationHeader: { field: "roleName" }
  });
  /**
   * Roles by name
   */
  findOneByName = this.makeRequest({
    method: "GET",
    path: "/roles/{name}",
    urlParamKeys: ["name"],
    catchNotFound: true
  });
  updateByName = this.makeUpdateRequest({
    method: "PUT",
    path: "/roles/{name}",
    urlParamKeys: ["name"]
  });
  delByName = this.makeRequest({
    method: "DELETE",
    path: "/roles/{name}",
    urlParamKeys: ["name"]
  });
  findUsersWithRole = this.makeRequest({
    method: "GET",
    path: "/roles/{name}/users",
    urlParamKeys: ["name"],
    catchNotFound: true
  });
  /**
   * Roles by id
   */
  findOneById = this.makeRequest({
    method: "GET",
    path: "/roles-by-id/{id}",
    urlParamKeys: ["id"],
    catchNotFound: true
  });
  createComposite = this.makeUpdateRequest({
    method: "POST",
    path: "/roles-by-id/{roleId}/composites",
    urlParamKeys: ["roleId"]
  });
  getCompositeRoles = this.makeRequest({
    method: "GET",
    path: "/roles-by-id/{id}/composites",
    urlParamKeys: ["id"]
  });
  getCompositeRolesForRealm = this.makeRequest({
    method: "GET",
    path: "/roles-by-id/{id}/composites/realm",
    urlParamKeys: ["id"]
  });
  getCompositeRolesForClient = this.makeRequest({
    method: "GET",
    path: "/roles-by-id/{id}/composites/clients/{clientId}",
    urlParamKeys: ["id", "clientId"]
  });
  delCompositeRoles = this.makeUpdateRequest({
    method: "DELETE",
    path: "/roles-by-id/{id}/composites",
    urlParamKeys: ["id"]
  });
  updateById = this.makeUpdateRequest({
    method: "PUT",
    path: "/roles-by-id/{id}",
    urlParamKeys: ["id"]
  });
  delById = this.makeRequest({
    method: "DELETE",
    path: "/roles-by-id/{id}",
    urlParamKeys: ["id"]
  });
  /**
   * Authorization permissions
   */
  updatePermission = this.makeUpdateRequest({
    method: "PUT",
    path: "/roles-by-id/{id}/management/permissions",
    urlParamKeys: ["id"]
  });
  listPermissions = this.makeRequest({
    method: "GET",
    path: "/roles-by-id/{id}/management/permissions",
    urlParamKeys: ["id"]
  });
  constructor(client) {
    super(client, {
      path: "/admin/realms/{realm}",
      getUrlParams: () => ({
        realm: client.realmName
      }),
      getBaseUrl: () => client.baseUrl
    });
  }
};

// node_modules/@keycloak/keycloak-admin-client/lib/resources/serverInfo.js
var ServerInfo = class extends Resource {
  constructor(client) {
    super(client, {
      path: "/",
      getBaseUrl: () => client.baseUrl
    });
  }
  find = this.makeRequest({
    method: "GET",
    path: "/admin/serverinfo"
  });
  findEffectiveMessageBundles = this.makeRequest({
    method: "GET",
    path: "/resources/{realm}/{themeType}/{locale}",
    urlParamKeys: ["realm", "themeType", "locale"],
    queryParamKeys: ["theme", "source"]
  });
};

// node_modules/@keycloak/keycloak-admin-client/lib/resources/users.js
var Users = class extends Resource {
  find = this.makeRequest({
    method: "GET"
  });
  create = this.makeRequest({
    method: "POST",
    returnResourceIdInLocationHeader: { field: "id" }
  });
  /**
   * Single user
   */
  findOne = this.makeRequest({
    method: "GET",
    path: "/{id}",
    urlParamKeys: ["id"],
    catchNotFound: true
  });
  update = this.makeUpdateRequest({
    method: "PUT",
    path: "/{id}",
    urlParamKeys: ["id"]
  });
  del = this.makeRequest({
    method: "DELETE",
    path: "/{id}",
    urlParamKeys: ["id"]
  });
  count = this.makeRequest({
    method: "GET",
    path: "/count"
  });
  getProfile = this.makeRequest({
    method: "GET",
    path: "/profile"
  });
  updateProfile = this.makeRequest({
    method: "PUT",
    path: "/profile"
  });
  getProfileMetadata = this.makeRequest({
    method: "GET",
    path: "/profile/metadata"
  });
  /**
   * role mappings
   */
  listRoleMappings = this.makeRequest({
    method: "GET",
    path: "/{id}/role-mappings",
    urlParamKeys: ["id"]
  });
  addRealmRoleMappings = this.makeRequest({
    method: "POST",
    path: "/{id}/role-mappings/realm",
    urlParamKeys: ["id"],
    payloadKey: "roles"
  });
  listRealmRoleMappings = this.makeRequest({
    method: "GET",
    path: "/{id}/role-mappings/realm",
    urlParamKeys: ["id"]
  });
  delRealmRoleMappings = this.makeRequest({
    method: "DELETE",
    path: "/{id}/role-mappings/realm",
    urlParamKeys: ["id"],
    payloadKey: "roles"
  });
  listAvailableRealmRoleMappings = this.makeRequest({
    method: "GET",
    path: "/{id}/role-mappings/realm/available",
    urlParamKeys: ["id"]
  });
  // Get effective realm-level role mappings This will recurse all composite roles to get the result.
  listCompositeRealmRoleMappings = this.makeRequest({
    method: "GET",
    path: "/{id}/role-mappings/realm/composite",
    urlParamKeys: ["id"]
  });
  /**
   * Client role mappings
   * https://www.keycloak.org/docs-api/11.0/rest-api/#_client_role_mappings_resource
   */
  listClientRoleMappings = this.makeRequest({
    method: "GET",
    path: "/{id}/role-mappings/clients/{clientUniqueId}",
    urlParamKeys: ["id", "clientUniqueId"]
  });
  addClientRoleMappings = this.makeRequest({
    method: "POST",
    path: "/{id}/role-mappings/clients/{clientUniqueId}",
    urlParamKeys: ["id", "clientUniqueId"],
    payloadKey: "roles"
  });
  delClientRoleMappings = this.makeRequest({
    method: "DELETE",
    path: "/{id}/role-mappings/clients/{clientUniqueId}",
    urlParamKeys: ["id", "clientUniqueId"],
    payloadKey: "roles"
  });
  listAvailableClientRoleMappings = this.makeRequest({
    method: "GET",
    path: "/{id}/role-mappings/clients/{clientUniqueId}/available",
    urlParamKeys: ["id", "clientUniqueId"]
  });
  listCompositeClientRoleMappings = this.makeRequest({
    method: "GET",
    path: "/{id}/role-mappings/clients/{clientUniqueId}/composite",
    urlParamKeys: ["id", "clientUniqueId"]
  });
  /**
   * Send a update account email to the user
   * an email contains a link the user can click to perform a set of required actions.
   */
  executeActionsEmail = this.makeRequest({
    method: "PUT",
    path: "/{id}/execute-actions-email",
    urlParamKeys: ["id"],
    payloadKey: "actions",
    queryParamKeys: ["lifespan", "redirectUri", "clientId"],
    keyTransform: {
      clientId: "client_id",
      redirectUri: "redirect_uri"
    }
  });
  /**
   * Group
   */
  listGroups = this.makeRequest({
    method: "GET",
    path: "/{id}/groups",
    urlParamKeys: ["id"]
  });
  addToGroup = this.makeRequest({
    method: "PUT",
    path: "/{id}/groups/{groupId}",
    urlParamKeys: ["id", "groupId"]
  });
  delFromGroup = this.makeRequest({
    method: "DELETE",
    path: "/{id}/groups/{groupId}",
    urlParamKeys: ["id", "groupId"]
  });
  countGroups = this.makeRequest({
    method: "GET",
    path: "/{id}/groups/count",
    urlParamKeys: ["id"]
  });
  /**
   * Federated Identity
   */
  listFederatedIdentities = this.makeRequest({
    method: "GET",
    path: "/{id}/federated-identity",
    urlParamKeys: ["id"]
  });
  addToFederatedIdentity = this.makeRequest({
    method: "POST",
    path: "/{id}/federated-identity/{federatedIdentityId}",
    urlParamKeys: ["id", "federatedIdentityId"],
    payloadKey: "federatedIdentity"
  });
  delFromFederatedIdentity = this.makeRequest({
    method: "DELETE",
    path: "/{id}/federated-identity/{federatedIdentityId}",
    urlParamKeys: ["id", "federatedIdentityId"]
  });
  /**
   * remove totp
   */
  removeTotp = this.makeRequest({
    method: "PUT",
    path: "/{id}/remove-totp",
    urlParamKeys: ["id"]
  });
  /**
   * reset password
   */
  resetPassword = this.makeRequest({
    method: "PUT",
    path: "/{id}/reset-password",
    urlParamKeys: ["id"],
    payloadKey: "credential"
  });
  getUserStorageCredentialTypes = this.makeRequest({
    method: "GET",
    path: "/{id}/configured-user-storage-credential-types",
    urlParamKeys: ["id"]
  });
  /**
   * get user credentials
   */
  getCredentials = this.makeRequest({
    method: "GET",
    path: "/{id}/credentials",
    urlParamKeys: ["id"]
  });
  /**
   * delete user credentials
   */
  deleteCredential = this.makeRequest({
    method: "DELETE",
    path: "/{id}/credentials/{credentialId}",
    urlParamKeys: ["id", "credentialId"]
  });
  /**
   * update a credential label for a user
   */
  updateCredentialLabel = this.makeUpdateRequest({
    method: "PUT",
    path: "/{id}/credentials/{credentialId}/userLabel",
    urlParamKeys: ["id", "credentialId"],
    headers: { "content-type": "text/plain" }
  });
  // Move a credential to a position behind another credential
  moveCredentialPositionDown = this.makeRequest({
    method: "POST",
    path: "/{id}/credentials/{credentialId}/moveAfter/{newPreviousCredentialId}",
    urlParamKeys: ["id", "credentialId", "newPreviousCredentialId"]
  });
  // Move a credential to a first position in the credentials list of the user
  moveCredentialPositionUp = this.makeRequest({
    method: "POST",
    path: "/{id}/credentials/{credentialId}/moveToFirst",
    urlParamKeys: ["id", "credentialId"]
  });
  /**
   * send verify email
   */
  sendVerifyEmail = this.makeRequest({
    method: "PUT",
    path: "/{id}/send-verify-email",
    urlParamKeys: ["id"],
    queryParamKeys: ["clientId", "redirectUri"],
    keyTransform: {
      clientId: "client_id",
      redirectUri: "redirect_uri"
    }
  });
  /**
   * list user sessions
   */
  listSessions = this.makeRequest({
    method: "GET",
    path: "/{id}/sessions",
    urlParamKeys: ["id"]
  });
  /**
   * list offline sessions associated with the user and client
   */
  listOfflineSessions = this.makeRequest({
    method: "GET",
    path: "/{id}/offline-sessions/{clientId}",
    urlParamKeys: ["id", "clientId"]
  });
  /**
   * logout user from all sessions
   */
  logout = this.makeRequest({
    method: "POST",
    path: "/{id}/logout",
    urlParamKeys: ["id"]
  });
  /**
   * list consents granted by the user
   */
  listConsents = this.makeRequest({
    method: "GET",
    path: "/{id}/consents",
    urlParamKeys: ["id"]
  });
  impersonation = this.makeUpdateRequest({
    method: "POST",
    path: "/{id}/impersonation",
    urlParamKeys: ["id"]
  });
  /**
   * revoke consent and offline tokens for particular client from user
   */
  revokeConsent = this.makeRequest({
    method: "DELETE",
    path: "/{id}/consents/{clientId}",
    urlParamKeys: ["id", "clientId"]
  });
  getUnmanagedAttributes = this.makeRequest({
    method: "GET",
    path: "/{id}/unmanagedAttributes",
    urlParamKeys: ["id"]
  });
  constructor(client) {
    super(client, {
      path: "/admin/realms/{realm}/users",
      getUrlParams: () => ({
        realm: client.realmName
      }),
      getBaseUrl: () => client.baseUrl
    });
  }
};

// node_modules/@keycloak/keycloak-admin-client/lib/resources/userStorageProvider.js
var UserStorageProvider = class extends Resource {
  name = this.makeRequest({
    method: "GET",
    path: "/{id}/name",
    urlParamKeys: ["id"]
  });
  removeImportedUsers = this.makeRequest({
    method: "POST",
    path: "/{id}/remove-imported-users",
    urlParamKeys: ["id"]
  });
  sync = this.makeRequest({
    method: "POST",
    path: "/{id}/sync",
    urlParamKeys: ["id"],
    queryParamKeys: ["action"]
  });
  unlinkUsers = this.makeRequest({
    method: "POST",
    path: "/{id}/unlink-users",
    urlParamKeys: ["id"]
  });
  mappersSync = this.makeRequest({
    method: "POST",
    path: "/{parentId}/mappers/{id}/sync",
    urlParamKeys: ["id", "parentId"],
    queryParamKeys: ["direction"]
  });
  constructor(client) {
    super(client, {
      path: "/admin/realms/{realm}/user-storage",
      getUrlParams: () => ({
        realm: client.realmName
      }),
      getBaseUrl: () => client.baseUrl
    });
  }
};

// node_modules/@keycloak/keycloak-admin-client/lib/resources/whoAmI.js
var WhoAmI = class extends Resource {
  constructor(client) {
    super(client, {
      path: "/admin/{realm}/console",
      getUrlParams: () => ({
        realm: client.realmName
      }),
      getBaseUrl: () => client.baseUrl
    });
  }
  find = this.makeRequest({
    method: "GET",
    path: "/whoami",
    queryParamKeys: ["currentRealm"]
  });
};

// node_modules/camelize-ts/dist/index.js
function camelCase(str) {
  return str.replace(/[_.-](\w|$)/g, function(_, x) {
    return x.toUpperCase();
  });
}
function walk(obj, shallow = false) {
  if (!obj || typeof obj !== "object")
    return obj;
  if (obj instanceof Date || obj instanceof RegExp)
    return obj;
  if (Array.isArray(obj))
    return obj.map((v) => {
      if (!shallow) {
        return walk(v);
      }
      if (typeof v === "object")
        return walk(v, shallow);
      return v;
    });
  return Object.keys(obj).reduce((res, key) => {
    const camel = camelCase(key);
    const uncapitalized = camel.charAt(0).toLowerCase() + camel.slice(1);
    res[uncapitalized] = shallow ? obj[key] : walk(obj[key]);
    return res;
  }, {});
}
function camelize(obj, shallow) {
  return typeof obj === "string" ? camelCase(obj) : walk(obj, shallow);
}

// node_modules/@keycloak/keycloak-admin-client/lib/utils/constants.js
var defaultBaseUrl = "http://127.0.0.1:8180";
var defaultRealm = "master";

// node_modules/@keycloak/keycloak-admin-client/lib/utils/auth.js
var bytesToBase64 = (bytes) => btoa(Array.from(bytes, (byte) => String.fromCodePoint(byte)).join(""));
var toBase64 = (input) => bytesToBase64(new TextEncoder().encode(input));
var encodeRFC3986URIComponent = (input) => encodeURIComponent(input).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
var encodeFormURIComponent = (data) => encodeRFC3986URIComponent(data).replaceAll("%20", "+");
var getToken = async (settings) => {
  const baseUrl = settings.baseUrl || defaultBaseUrl;
  const realmName = settings.realmName || defaultRealm;
  const url = `${baseUrl}/realms/${realmName}/protocol/openid-connect/token`;
  const credentials = settings.credentials || {};
  const payload = stringifyQueryParams({
    username: credentials.username,
    password: credentials.password,
    grant_type: credentials.grantType,
    client_id: credentials.clientId,
    totp: credentials.totp,
    ...credentials.offlineToken ? { scope: "offline_access" } : {},
    ...credentials.scopes ? { scope: credentials.scopes.join(" ") } : {},
    ...credentials.refreshToken ? {
      refresh_token: credentials.refreshToken,
      client_secret: credentials.clientSecret
    } : {}
  });
  const options = settings.requestOptions ?? {};
  const headers = new Headers(options.headers);
  if (credentials.clientSecret) {
    const username = encodeFormURIComponent(credentials.clientId);
    const password = encodeFormURIComponent(credentials.clientSecret);
    headers.set("authorization", `Basic ${toBase64(`${username}:${password}`)}`);
  }
  headers.set("content-type", "application/x-www-form-urlencoded");
  const response = await fetchWithError(url, {
    ...options,
    method: "POST",
    headers,
    body: payload
  });
  const data = await response.json();
  return camelize(data);
};

// node_modules/@keycloak/keycloak-admin-client/lib/client.js
var KeycloakAdminClient = class {
  // Resources
  users;
  userStorageProvider;
  groups;
  roles;
  organizations;
  clients;
  realms;
  clientScopes;
  clientPolicies;
  identityProviders;
  components;
  serverInfo;
  whoAmI;
  attackDetection;
  authenticationManagement;
  cache;
  // Members
  baseUrl;
  realmName;
  scope;
  accessToken;
  refreshToken;
  #requestOptions;
  #globalRequestArgOptions;
  #tokenProvider;
  constructor(connectionConfig) {
    this.baseUrl = connectionConfig?.baseUrl || defaultBaseUrl;
    this.realmName = connectionConfig?.realmName || defaultRealm;
    this.#requestOptions = connectionConfig?.requestOptions;
    this.#globalRequestArgOptions = connectionConfig?.requestArgOptions;
    this.users = new Users(this);
    this.userStorageProvider = new UserStorageProvider(this);
    this.groups = new Groups(this);
    this.roles = new Roles(this);
    this.organizations = new Organizations(this);
    this.clients = new Clients(this);
    this.realms = new Realms(this);
    this.clientScopes = new ClientScopes(this);
    this.clientPolicies = new ClientPolicies(this);
    this.identityProviders = new IdentityProviders(this);
    this.components = new Components(this);
    this.authenticationManagement = new AuthenticationManagement(this);
    this.serverInfo = new ServerInfo(this);
    this.whoAmI = new WhoAmI(this);
    this.attackDetection = new AttackDetection(this);
    this.cache = new Cache(this);
  }
  async auth(credentials) {
    const { accessToken, refreshToken } = await getToken({
      baseUrl: this.baseUrl,
      realmName: this.realmName,
      scope: this.scope,
      credentials,
      requestOptions: this.#requestOptions
    });
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
  registerTokenProvider(provider) {
    if (this.#tokenProvider) {
      throw new Error("An existing token provider was already registered.");
    }
    this.#tokenProvider = provider;
  }
  setAccessToken(token) {
    this.accessToken = token;
  }
  async getAccessToken() {
    if (this.#tokenProvider) {
      return this.#tokenProvider.getAccessToken();
    }
    return this.accessToken;
  }
  getRequestOptions() {
    return this.#requestOptions;
  }
  getGlobalRequestArgOptions() {
    return this.#globalRequestArgOptions;
  }
  setConfig(connectionConfig) {
    if (typeof connectionConfig.baseUrl === "string" && connectionConfig.baseUrl) {
      this.baseUrl = connectionConfig.baseUrl;
    }
    if (typeof connectionConfig.realmName === "string" && connectionConfig.realmName) {
      this.realmName = connectionConfig.realmName;
    }
    this.#requestOptions = connectionConfig.requestOptions;
  }
};

// node_modules/@keycloak/keycloak-admin-client/lib/defs/requiredActionProviderRepresentation.js
var RequiredActionAlias;
(function(RequiredActionAlias2) {
  RequiredActionAlias2["VERIFY_EMAIL"] = "VERIFY_EMAIL";
  RequiredActionAlias2["UPDATE_PROFILE"] = "UPDATE_PROFILE";
  RequiredActionAlias2["CONFIGURE_TOTP"] = "CONFIGURE_TOTP";
  RequiredActionAlias2["UPDATE_PASSWORD"] = "UPDATE_PASSWORD";
  RequiredActionAlias2["TERMS_AND_CONDITIONS"] = "TERMS_AND_CONDITIONS";
})(RequiredActionAlias || (RequiredActionAlias = {}));

// node_modules/@keycloak/keycloak-admin-client/lib/index.js
var lib_default = KeycloakAdminClient;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Keycloak
});
