/* empty css                                 */
import { c as createComponent$1, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_xAPoSdt1.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BMP_lIm2.mjs';
import { ssr, ssrHydrationKey, escape, createComponent, mergeProps } from 'solid-js/web';
import { c as createForm, u as userState, F as FormError, T as TextInput, r as required, A as ActionButton, a as userActions } from '../chunks/FormError_CBCN5rfC.mjs';
import { createSignal, createEffect, on } from 'solid-js';
export { renderers } from '../renderers.mjs';

/**
 * Creates a validation functions that validates the length of a string or array.
 *
 * @param requirement The minimum string or array length.
 * @param error The error message.
 *
 * @returns A validation function.
 */
function minLength(requirement, error) {
    return (value) => value?.length && value.length < requirement ? error : '';
}

var _tmpl$ = ["<div", ' class="mt-4 flex justify-between"><!--$-->', "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$2 = ["<div", ' class="flex max-w-xl flex-col justify-center"><div class="container prose mb-8"><h1>Register an account</h1><p>An account is needed to use the Todo Manager.</p><p>In case you already have an account, please login through <a href="/login">here</a> or through the button below on the left.</p></div><!--$-->', "<!--/--><!--$-->", "<!--/--></div>"];
function RegisterForm() {
  const [registerForm, {
    Form,
    Field
  }] = createForm();
  const [user, setUser] = userState;
  const [registerError, setRegisterError] = createSignal();
  const handleSubmit = (values, event) => {
    event.preventDefault();
    console.log("submitting register form with values:", values);
    userActions.createUser(values).then((userAuthData) => {
      setUser(userAuthData);
      location.assign("/todos");
    }).catch((error) => {
      console.log("error:", error);
      setRegisterError(error.message);
    });
  };
  createEffect(on(() => user, (user2) => user2 && user2.username && location.assign("/todos")));
  return ssr(_tmpl$2, ssrHydrationKey(), escape(createComponent(FormError, {
    get error() {
      return registerError();
    },
    formName: "login"
  })), escape(createComponent(Form, {
    onSubmit: handleSubmit,
    "data-testid": "register-form",
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
          return [required("Please enter your password."), minLength(8, "You password must have 8 characters or more.")];
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
          return registerForm.submitting;
        },
        label: "To Login",
        variant: "secondary",
        onClick: () => location.assign("/login")
      })), escape(createComponent(ActionButton, {
        get loading() {
          return registerForm.submitting;
        },
        label: "Register",
        variant: "primary",
        type: "submit"
      })))];
    }
  })));
}

const $$Index = createComponent$1(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "RegisterForm", RegisterForm, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/components/forms/RegisterForm", "client:component-export": "default" })} ` })}`;
}, "/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/pages/register/index.astro", void 0);

const $$file = "/Users/MrJay/Documents/playground/swt-todo-list-app-main/frontend/src/pages/register/index.astro";
const $$url = "/register";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
