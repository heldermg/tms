import SvgIcon from "../icons/SvgIcon"

export const menuItems = [
  {
    id: 1,
    href: '/',
    title: 'Home',
    icon: (
      <SvgIcon
        iconType="home"
        title="Home"
        desc="Home Button"
        className="w-10 h-10"
      />
    ),
  },
  {
    id: 2,
    href: '/roles',
    title: 'Roles',
    icon: (
      <SvgIcon
        iconType="newspaper"
        title="Roles"
        desc="Roles Button"
        className="w-10 h-10"
      />
    ),
  },
  {
    id: 3,
    href: '/teams',
    title: 'Teams',
    icon: (
      <SvgIcon
        iconType="user-group"
        title="Teams"
        desc="Teams Button"
        className="w-10 h-10"
      />
    ),
  },
  {
    id: 4,
    href: '/users',
    title: 'Users',
    icon: (
      <SvgIcon
        iconType="users"
        title="Users"
        desc="Users Button"
        className="w-10 h-10"
      />
    ),
  },
  {
    id: 5,
    href: '/absenceTypes',
    title: 'Absence Types',
    icon: (
      <SvgIcon
        iconType="clock"
        title="Absence Types"
        desc="Absence Types Button"
        className="w-10 h-10"
      />
    ),
  },
  {
    id: 6,
    href: '/absences',
    title: 'Absences',
    icon: (
      <SvgIcon
        iconType="user-minus"
        title="Absences"
        desc="Absences Button"
        className="w-10 h-10"
      />
    ),
  },
]