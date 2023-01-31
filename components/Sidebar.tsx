import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState, useMemo } from 'react'
import CollapseIcon from './icons/CollapseIcon'
import SvgIcon from './icons/SvgIcon'

const menuItems = [
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
]

const Sidebar = () => {
  const [toggleCollapse, setToggleCollapse] = useState(false)
  const [isCollapsible, setIsCollapsible] = useState(false)

  const router = useRouter()

  const activeMenu = useMemo(
    () => menuItems.find((menu) => menu.href === router.pathname),
    [router.pathname]
  )

  const wrapperClasses = classNames(
    'h-screen px-4 pt-8 pb-4 bg-light flex justify-between flex-col',
    {
      ['w-80']: !toggleCollapse,
      ['w-20']: toggleCollapse,
    }
  )

  const collapseIconClasses = classNames(
    'p-4 rounded bg-light-lighter absolute right-0',
    {
      'rotate-180': toggleCollapse,
    }
  )

  const getNavItemClasses = (menu: any) => {
    return classNames(
      'flex items-center cursor-pointer hover:bg-light-lighter rounded w-full overflow-hidden whitespace-nowrap',
      {
        ['bg-light-lighter']: activeMenu?.id === menu.id,
      }
    )
  }

  const onMouseOver = () => {
    setIsCollapsible(!isCollapsible)
  }

  const handleSidebarToggle = () => {
    setToggleCollapse(!toggleCollapse)
  }

  return (
    <div
      className={wrapperClasses}
      onMouseEnter={onMouseOver}
      onMouseLeave={onMouseOver}
      style={{ transition: 'width 300ms cubic-bezier(0.2, 0, 0, 1) 0s' }}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between relative">
          <div className="flex items-center pl-1 gap-4">
            <SvgIcon
              iconType="list-bullet"
              title="Menu"
              desc="Menu Collapse"
              className="w-6 h-6"
            />
            <span
              className={classNames('mt-2 text-lg font-medium text-text', {
                hidden: toggleCollapse,
              })}
            >
              Menu
            </span>
          </div>
          {isCollapsible && (
            <button
              className={collapseIconClasses}
              onClick={handleSidebarToggle}
            >
              <CollapseIcon
                title="Expandir/Recolher Menu"
                desc="Botão de Expandir/Recolher Menu"
              />
            </button>
          )}
        </div>

        <div className="flex flex-col items-start mt-24">
          {menuItems.map((menu) => {
            const classes = getNavItemClasses(menu)
            return (
              <div className={classes} key={menu.id}>
                <Link href={menu.href}>
                  <a className="flex py-4 px-3 items-center w-full h-full">
                    <div style={{ width: '2.5rem' }}>{menu.icon}</div>
                    {!toggleCollapse && (
                      <span
                        className={classNames(
                          'text-md font-medium text-text-light'
                        )}
                      >
                        {menu.title}
                      </span>
                    )}
                  </a>
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      <div className={`${getNavItemClasses({})} px-3 py-4`}>
        <div style={{ width: '2.5rem' }}>
          <SvgIcon
            iconType="power"
            title="Logout"
            desc="Logout Button"
            className="w-6 h-6"
          />
        </div>
        {!toggleCollapse && (
          <span className={classNames('text-md font-medium text-text-light')}>
            Logout
          </span>
        )}
      </div>
    </div>
  )
}

export default Sidebar
