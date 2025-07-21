import React, { useRef } from 'react'
import { SidebarComponent } from '@syncfusion/ej2-react-navigations'
import { Link } from 'react-router'
import NavItems from './NavItems'

const MobileSidebar = () => {
  const sidebarRef = useRef<SidebarComponent | null>(null)

  const toggleSidebar = () => {
    sidebarRef.current?.toggle()
  }

  return (
    <div className="mobile-sidebar wrapper">
      <header>
        <Link to="/">
          <img src="/assets/icons/logo.svg" alt="logo" className="size-[30px]" />
          <h1>Tourvisto</h1>
        </Link>
        <button onClick={toggleSidebar}>
          <img src="/assets/icons/menu.svg" alt="menu" className="size-7" />
        </button>
      </header>

      <SidebarComponent
        ref={sidebarRef}
        width="270px"
        created={() => sidebarRef.current?.hide()}
        closeOnDocumentClick={true}
        showBackdrop={true}
        type="Over" // use string "Over" or import SidebarType.Over
      >
        <NavItems handleClick={toggleSidebar} />
      </SidebarComponent>
    </div>
  )
}

export default MobileSidebar
