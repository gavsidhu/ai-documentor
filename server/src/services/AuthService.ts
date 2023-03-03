import supabase from "../configs/supabase.config";


export default class AuthService {
    constructor() {}

    async signInWithGithub(){
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
          })
          
    }

    async signout() {
        const { error } = await supabase.auth.signOut()

        if (error) error
      }
}