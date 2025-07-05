import { c as createComponent, m as maybeRenderHead, r as renderComponent, a as renderTemplate, b as createAstro, d as addAttribute, e as renderHead, f as renderSlot } from './astro/server_xAPoSdt1.mjs';
import 'kleur/colors';
import 'html-escaper';
import { ssr, ssrHydrationKey, ssrAttribute, escape } from 'solid-js/web';
import clsx from 'clsx';
/* empty css                         */

var _tmpl$$1 = ["<svg", ' xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 48 48"><path fill="#3f51b5" d="m17.8 18.1l-7.4 7.3l-4.2-4.1L4 23.5l6.4 6.4l9.6-9.6zm0-13l-7.4 7.3l-4.2-4.1L4 10.5l6.4 6.4L20 7.3zm0 26l-7.4 7.3l-4.2-4.1L4 36.5l6.4 6.4l9.6-9.6z"></path><path fill="#90caf9" d="M24 22h20v4H24zm0-13h20v4H24zm0 26h20v4H24z"></path></svg>'], _tmpl$2 = ["<div", ">", "</div>"];
const icons = {
  "flat-color-icons:todo-list": ssr(_tmpl$$1, ssrHydrationKey())
};
const StaticIcon = (props) => {
  return ssr(_tmpl$2, ssrHydrationKey() + ssrAttribute("class", escape(clsx("iconify", props.class), true), false) + ssrAttribute("data-icon", escape(props.icon, true), false), escape(icons[props.icon]));
};

const $$NavBar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<nav class="sticky border-b border-zinc-300 bg-slate-50/60 px-8 py-5 font-light text-zinc-600" data-astro-cid-lkziebym> <div class="flex flex-col items-center justify-between gap-2 md:flex-row" data-astro-cid-lkziebym> <div class="flex flex-col md:flex-row items-center" data-astro-cid-lkziebym> <div class="flex px-4 py-2 text-2xl" data-astro-cid-lkziebym> ${renderComponent($$result, "StaticIcon", StaticIcon, { "class": "text-2xl self-center", "icon": "flat-color-icons:todo-list", "data-astro-cid-lkziebym": true })} <span class="ml-2 align-text-top text-2xl font-semibold" data-astro-cid-lkziebym>
Todo Manager
</span> </div> <div class="divider divider-horizontal before:bg-gray-500 after:bg-gray-500" data-astro-cid-lkziebym></div> ${renderComponent($$result, "TodoListItems", null, { "client:only": "solid-js", "client:component-hydration": "only", "data-astro-cid-lkziebym": true, "client:component-path": "/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/components/navbar/TodoListItems", "client:component-export": "default" })} </div> ${renderComponent($$result, "ProfileItems", null, { "client:only": "solid-js", "client:component-hydration": "only", "data-astro-cid-lkziebym": true, "client:component-path": "/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/components/navbar/ProfileItems", "client:component-export": "default" })} </div> </nav> `;
}, "/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/layout/NavBar.astro", void 0);

var _tmpl$ = ["<li", "><a", ' target="_blank" rel="noopener noreferrer" class="hover:underline">', "</a></li>"];
const FooterListItem = (props) => {
  return ssr(_tmpl$, ssrHydrationKey(), ssrAttribute("href", escape(props.href, true), false), escape(props.title));
};

const $$Astro$1 = createAstro();
const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Footer;
  const footerLinks = [
    { href: "https://astro.build", title: "Astro" },
    { href: "https://solidjs.com", title: "SolidJS" },
    { href: "https://tailwindcss.com", title: "TailwindCSS" },
    { href: "https://daisyui.com", title: "DaisyUI" },
    { href: "https://iconify.design", title: "Iconify" }
  ];
  return renderTemplate`${maybeRenderHead()}<footer class="z-10 mx-auto mt-12 flex w-screen justify-center border-t border-zinc-300 bg-slate-50/80 px-16 py-8 text-zinc-600"> <div class="flex flex-col"> <span class="text-md font-semibold"> Made with ❤️ , 😓, 🥲 and</span> <ul class="flex flex-col items-center justify-center space-x-2"> ${footerLinks.map((link) => renderTemplate`${renderComponent($$result, "FooterListItem", FooterListItem, { "href": link.href, "title": link.title })}`)} </ul> </div> </footer>`;
}, "/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/layout/Footer.astro", void 0);

const $$Astro = createAstro();
const $$ViewTransitions = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ViewTransitions;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>`;
}, "/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/node_modules/astro/components/ViewTransitions.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en" data-astro-cid-4jmloj5z> <head>${renderTemplate(_a || (_a = __template(["<script>console.log = function () {};</script>"])))}<meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg">${renderComponent($$result, "ViewTransitions", $$ViewTransitions, { "data-astro-cid-4jmloj5z": true })}${renderHead()}</head> <body class="relative flex h-screen flex-col" data-astro-cid-4jmloj5z> ${renderComponent($$result, "NavBar", $$NavBar, { "data-astro-cid-4jmloj5z": true })} <main class="flex grow justify-center p-8" data-astro-cid-4jmloj5z> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-4jmloj5z": true })} </body></html>`;
}, "/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/layout/BaseLayout.astro", void 0);

export { $$BaseLayout as $ };
