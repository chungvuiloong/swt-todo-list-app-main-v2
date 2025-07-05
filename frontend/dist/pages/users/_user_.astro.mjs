/* empty css                                    */
import { c as createComponent, a as renderTemplate } from '../../chunks/astro/server_xAPoSdt1.mjs';
import 'kleur/colors';
import 'html-escaper';
import 'clsx';
export { renderers } from '../../renderers.mjs';

const $$user = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate``;
}, "/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/pages/users/[user].astro", void 0);

const $$file = "/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/pages/users/[user].astro";
const $$url = "/users/[user]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$user,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
