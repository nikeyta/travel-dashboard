import { ID, OAuthProvider, Query } from "appwrite"
import { account, appwriteConfig, database } from "./client"
import { redirect } from "react-router"

export const loginWithGoogle = async () =>{
    try{
         account.createOAuth2Session(
            OAuthProvider.Google,
           `${window.location.origin}/`,
            `${window.location.origin}/404`
         )
    } catch(e){
        console.log('loginWithGoogle',e)
    }
}
export const getUser = async () =>{
    try{
        const user = await account.get()
        if(!user) return redirect('/sign-in')
        
        const {documents} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [
                Query.equal('accountId' , user.$id),
                Query.select(['name', 'email', 'imageUrl', 'joinedAt', 'accountId'])
            ]
        )
        if(documents.length>0) return documents[0]
    } catch(e){
        console.log('getUser',e)
    }
}
export const logoutUser = async () =>{
    try{
         await account.deleteSession(
    'current' 
);
return true
    } catch(e){
        console.log('logoutUser', e)
    }
}
export const getGooglePicture = async () =>{
    try{
        const session = await account.getSession('current')
        const OAuthToken = session.providerAccessToken
        if(!OAuthToken){
            console.log('No OAuth token available')
            return null
        }
        const response = await fetch(
            'https://people.googleapis.com/v1/people/me?personFields=photos',
            {
                headers : {
                    Authorization : `Bearer ${OAuthToken}`
                }
            }
        )
        if(!response.ok) {
            console.log('Failed to fetch profile photo from google people Api')
            return null
        }
        const data = await response.json()
        const photoUrl =( data.photos && data.photos.length >0) ? data.photos[0].url : null
        return photoUrl
    } catch(e){
        console.log(e)
    }
}
export const storeUserData = async () =>{
    try{
         const user = await account.get()
         if(!user)  throw new Error("User not found");
         //if user already exists
         const {documents} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId' , user.$id)]
         )
         if(documents.length>0) return documents[0] //return user
         //else create one
         const imageUrl = await getGooglePicture()
         const newUser = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId : user.$id,
                email : user.email,
                name : user.name,
                imageUrl : imageUrl || '',
                joinedAt : new Date().toISOString()
            }
         )
          if (!newUser.$id) redirect("/sign-in");
         return newUser

    } catch(e){
        console.log('storeUserData',e)
    }
}
export const getExistingUser = async (id: string) =>{
    try{
        const {documents, total} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId' , id)]
        )
        return total>0 ? documents[0] : null
    } catch(e){
        console.log('getExistingUser',e)
    }
}
export const getAllUsers = async (limit : number , offset : number)=>{
    try{
        const {documents : users, total} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [
                Query.limit(limit),
                Query.offset(offset)
            ]
        )
        if(total ===0) return {users : [], total};
        return {users, total}
    }catch(e){
        return {users : [], total : 0}
    }
}


// {
//   "resourceName": "people/123456789",
//   "etag": "abcXYZ",
//   "photos": [
//     {
//       "metadata": {
//         "primary": true,
//         "source": {
//           "type": "PROFILE",
//           "id": "123"
//         }
//       },
//       "url": "https://lh3.googleusercontent.com/a-/AOh14Gh...."
//     }
//   ]
// }

// from appwrite
// {
//   total: 1,
//   documents: [
//     {
//       $id: "abc123",
//       accountId: "user123",
//       name: "Nikita",
//       email: "nikita@example.com",
//       $createdAt: "...",
//       $updatedAt: "..."
//     }
//   ]
// }