import React from 'react'
import {Link, useLoaderData, useNavigate} from 'react-router'
import { sidebarItems } from '~/constants'
import { NavLink } from "react-router";
import { cn } from '~/lib/utils';
import {  logoutUser } from '~/appwrite/auth';


const NavItems = ({handleClick} : {handleClick?: ()=>void}) => {
const user = useLoaderData() //data from clientloader of admin layout
const navigate = useNavigate()
const handlelogout = async ()=>{
    await logoutUser()
    navigate('/sign-in')
}

  return (
    <section className='nav-items'>
        <Link to='/'  className='link-logo'>
        <img src='/assets/icons/logo.svg' alt='logo'  className='size-[30px]'/> 
        <h1>Tourvisto</h1>
        </Link>
        <div className='container'>
            <nav>
                {sidebarItems.map(({id, href, icon, label})=>(
                    <NavLink  to={href} key={id} 
                    >
                        {({isActive} : {isActive:boolean})=>(
                            <div className={cn('group nav-item', {  /*cn merges static and dynamic tailwind classes */
                                'bg-primary-100 !text-white' : isActive
                            })} onClick={handleClick}>
                                <img src={icon} alt={label} className={`group-hover:brightness-0 size-0 group-hover:invert ${isActive ? 'brightness-0 invert' : 'text-dark-200'}`} />
                                {label}
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>
            <footer className='nav-footer'> 
                 <img src={user?.imageUrl} alt={user.name} referrerPolicy='no-referrer'></img>
                 <article> {/*article says pieces of content are related */}
                    <h2>{user?.name}</h2>
                    <p>{user?.email}</p>
                 </article>
                 <button type='button' className='cursor-pointer' onClick={()=>{handlelogout()}}>
                    <img className='size-6' src='/assets/icons/logout.svg' alt='logout' />
                 </button>
            </footer>
        </div>
    </section>
  )
}

export default NavItems
