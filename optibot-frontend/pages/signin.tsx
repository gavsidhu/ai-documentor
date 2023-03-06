import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import {FaGithub} from 'react-icons/fa'

import LoadingDots from '@/components/ui/LoadingDots';
import Logo from '@/components/icons/Logo';
import { getURL } from '@/utils/helpers';

const SignIn = () => {
  const router = useRouter();
  const user = useUser();
  const supabaseClient = useSupabaseClient()
  async function signInWithGitHub() {
     await supabaseClient.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: getURL()
      }
    })
  }

  useEffect(() => {
    if (user) {
      router.replace('/account');
    }
  }, [user]);

  if (!user)
    return (
      <div className="flex justify-center height-screen-helper mb-32">
        <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
          <div className="flex justify-center pb-12 ">
            <Logo width="64px" height="64px" />
          </div>
          <div className="flex flex-col space-y-4">
          <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-gray-800 border border-gray-600 py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus:border-pink-500 focus:ring-0 focus:outline-none"
                onClick={signInWithGitHub}
                >
                  <FaGithub className='mr-4 h-5 w-5'/>
                  Continue with Github
                </button>
              </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="m-6">
      <LoadingDots />
    </div>
  );
};

export default SignIn;
