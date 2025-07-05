/* empty css                                 */
import { c as createComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_xAPoSdt1.mjs';
import 'kleur/colors';
import 'html-escaper';
import 'clsx';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(['<!-- <BaseLayout title="Home" description="Home page"> -->', `<div class="flex h-screen flex-col items-center justify-center"> <h1 class="text-4xl font-bold">Redirecting...</h1> </div> <!-- </BaseLayout> --> <script>
  const username = JSON.parse(localStorage.getItem('userData') ?? '{}')?.username
  if (username) {
    location.assign('/todos')
  } else {
    location.assign('/login')
  }
<\/script>`])), maybeRenderHead());
}, "/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/pages/index.astro", void 0);

const $$file = "/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
