/* empty css                                 */
import { c as createComponent$1, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_xAPoSdt1.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BMP_lIm2.mjs';
import { ssr, ssrHydrationKey, escape, createComponent, mergeProps } from 'solid-js/web';
import { c as createForm, u as userState, F as FormError, T as TextInput, r as required, A as ActionButton, a as userActions } from '../chunks/FormError_CBCN5rfC.mjs';
import { createSignal, createEffect, on } from 'solid-js';
export { renderers } from '../renderers.mjs';

var _tmpl$ = ["<div", ' class="mt-4 flex justify-between"><!--$-->', "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$2 = ["<div", ' class="flex w-9/12 max-w-xl flex-col justify-center"><div class="container prose mb-8"><h1>Welcome to Todo Manager</h1><p>Please login to use the application.</p><p>In case you do not have an account, you can register through <a href="/register">here</a> or through the button below on the left.</p></div><!--$-->', "<!--/--><!--$-->", "<!--/--></div>"];
function LoginForm() {
  const [loginForm, {
    Form,
    Field
  }] = createForm();
  const [user, setUser] = userState;
  const [loginError, setLoginError] = createSignal();
  const handleSubmit = (values, event) => {
    event.preventDefault();
    console.log("submitting login form with values:", values);
    userActions.login(values).then((userAuthData) => {
      setUser(userAuthData);
      location.assign("/todos");
    }).catch((error) => {
      console.log("error:", error);
      setLoginError(error.message);
    });
  };
  createEffect(on(() => user, (user2) => user2 && user2.username && location.assign("/todos")));
  return !user.username && ssr(_tmpl$2, ssrHydrationKey(), escape(createComponent(FormError, {
    get error() {
      return loginError();
    },
    formName: "login"
  })), escape(createComponent(Form, {
    onSubmit: handleSubmit,
    "data-testid": "login-form",
    get children() {
      return [createComponent(Field, {
        name: "username",
        get validate() {
          return [required("Please enter your username.")];
        },
        children: (field, props) => createComponent(TextInput, mergeProps(props, {
          label: "Username",
          type: "text",
          get value() {
            return field.value;
          },
          get error() {
            return field.error;
          },
          required: true
        }))
      }), createComponent(Field, {
        name: "password",
        get validate() {
          return [required("Please enter your password.")];
        },
        children: (field, props) => createComponent(TextInput, mergeProps(props, {
          label: "Password",
          type: "password",
          get value() {
            return field.value;
          },
          get error() {
            return field.error;
          },
          required: true
        }))
      }), ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(ActionButton, {
        type: "button",
        get loading() {
          return loginForm.submitting;
        },
        label: "To Registration",
        variant: "secondary",
        onClick: () => location.assign("/register")
      })), escape(createComponent(ActionButton, {
        get loading() {
          return loginForm.submitting;
        },
        label: "Login",
        variant: "primary",
        type: "submit"
      })))];
    }
  })));
}

const $$Index = createComponent$1(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "LoginForm", LoginForm, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/components/forms/LoginForm", "client:component-export": "default" })} ` })}`;
}, "/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/pages/login/index.astro", void 0);

const $$file = "/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/pages/login/index.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
