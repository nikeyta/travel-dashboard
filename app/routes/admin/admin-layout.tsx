import React from 'react'
import { Outlet, redirect } from 'react-router'
import {SidebarComponent} from "@syncfusion/ej2-react-navigations"
import { MobileSidebar, NavItems } from 'components'
import { account } from '~/appwrite/client'
import { getExistingUser, storeUserData } from '~/appwrite/auth'


// load data and check for authenticated user
export async function clientLoader(){
    try{
         const user = await account.get()
         if(!user.$id) return redirect('/sign-in') // if not authenticated 
         // if a authenticated user present
          const existingUser = await getExistingUser(user.$id)
        if(existingUser?.status ==='user' ){ // if regular user and not admin
            return redirect('/')
        }
        // at  end
        return existingUser?.$id ? existingUser : await storeUserData()
    }catch(e){
        console.log('error in client loader', e)
        return redirect('/sign-in')
    }
}

const AdminLayout = () => {
  return (
    <div className='admin-layout '>
       <MobileSidebar />
       <aside className='w-full max-w-[270px] hidden lg:block'>
        <SidebarComponent width={270} enableGestures={false} >
             <NavItems />
        </SidebarComponent>
       </aside>
       <aside className='children'>
            <Outlet /> {/*basically shows the page we're on */}
       </aside>
       
    </div>
  )
}

export default AdminLayout
