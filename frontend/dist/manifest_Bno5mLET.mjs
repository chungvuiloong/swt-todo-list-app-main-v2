import '@astrojs/internal-helpers/path';
import 'cookie';
import 'kleur/colors';
import 'es-module-lexer';
import 'html-escaper';
import 'clsx';
import { N as NOOP_MIDDLEWARE_HEADER, g as decodeKey } from './chunks/astro/server_xAPoSdt1.mjs';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from tRPC error code table
  // https://trpc.io/docs/server/error-handling#error-codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 405,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/","adapterName":"","routes":[{"file":"file:///Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/dist/login/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/login","isIndex":true,"type":"page","pattern":"^\\/login\\/?$","segments":[[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/login/index.astro","pathname":"/login","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/dist/register/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/register","isIndex":true,"type":"page","pattern":"^\\/register\\/?$","segments":[[{"content":"register","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/register/index.astro","pathname":"/register","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/dist/todo-lists/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/todo-lists","isIndex":true,"type":"page","pattern":"^\\/todo-lists\\/?$","segments":[[{"content":"todo-lists","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/todo-lists/index.astro","pathname":"/todo-lists","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/dist/todos/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/todos","isIndex":true,"type":"page","pattern":"^\\/todos\\/?$","segments":[[{"content":"todos","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/todos/index.astro","pathname":"/todos","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"file:///Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/dist/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/pages/login/index.astro",{"propagation":"none","containsHead":true}],["/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/pages/register/index.astro",{"propagation":"none","containsHead":true}],["/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/pages/todo-lists/index.astro",{"propagation":"none","containsHead":true}],["/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/pages/todos/index.astro",{"propagation":"none","containsHead":true}],["/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/pages/users/[user]/[todoList].astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astro-page:src/pages/login/index@_@astro":"pages/login.astro.mjs","\u0000@astro-page:src/pages/register/index@_@astro":"pages/register.astro.mjs","\u0000@astro-page:src/pages/todo-lists/index@_@astro":"pages/todo-lists.astro.mjs","\u0000@astro-page:src/pages/todos/index@_@astro":"pages/todos.astro.mjs","\u0000@astro-page:src/pages/users/[user]/[todoList]@_@astro":"pages/users/_user_/_todolist_.astro.mjs","\u0000@astro-page:src/pages/users/[user]@_@astro":"pages/users/_user_.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-manifest":"manifest_Bno5mLET.mjs","/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/components/forms/RegisterForm":"_astro/RegisterForm.tZsK1DpP.js","/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/components/forms/LoginForm":"_astro/LoginForm.dY0Yfh4d.js","/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/components/todoList/TodoListView":"_astro/TodoListView.x_-IopXU.js","/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/components/todoList/TodoListsView":"_astro/TodoListsView.DAUvSpkn.js","/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/components/navbar/TodoListItems":"_astro/TodoListItems.D9Ns1f9S.js","/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/components/navbar/ProfileItems":"_astro/ProfileItems.CNwIPemj.js","@astrojs/solid-js/client.js":"_astro/client.Do1PbleQ.js","/astro/hoisted.js?q=0":"_astro/hoisted.BScVxmeO.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/file:///Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/dist/login/index.html","/file:///Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/dist/register/index.html","/file:///Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/dist/todo-lists/index.html","/file:///Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/dist/todos/index.html","/file:///Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/dist/index.html"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"ZgHaNJhEjJrw6lLpXmWjo7O08XkbKDcoGteQOw9rtNY=","experimentalEnvGetSecretEnabled":false});

export { manifest };
