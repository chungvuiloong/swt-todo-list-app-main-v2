/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_xAPoSdt1.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BMP_lIm2.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "TodoListView", null, { "client:only": "solid-js", "client:component-hydration": "only", "client:component-path": "/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/components/todoList/TodoListView", "client:component-export": "default" })} ` })}`;
}, "/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/pages/todos/index.astro", void 0);

const $$file = "/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/pages/todos/index.astro";
const $$url = "/todos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
