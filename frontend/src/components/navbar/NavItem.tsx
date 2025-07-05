import type { JSX } from 'solid-js/jsx-runtime'

type NavItemProps = {
  label: string | JSX.Element
  href?: string
  onClick?: () => void
  'data-testid'?: string
}

const NavItem = (props: NavItemProps) => {
  if (props.onClick) {
    return (
      <button class="px-4 font-semibold hover:underline" onClick={props.onClick} data-testid={props['data-testid']}>
        {props.label}
      </button>
    )
  }

  if (props.href) {
    return (
      <a class="px-4 font-semibold hover:underline" href={props.href} data-testid={props['data-testid']}>
        {props.label}
      </a>
    )
  }

  return <span class="px-4 font-semibold" data-testid={props['data-testid']}>{props.label}</span>
}

export default NavItem
