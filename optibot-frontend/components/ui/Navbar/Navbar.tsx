import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { HiBars3, HiXMark } from 'react-icons/hi2'
import { useUser } from '@/utils/useUser';

import s from './Navbar.module.css';
import { Dialog } from '@headlessui/react';
import { useState } from 'react';
const navigation = [
  { name: 'Pricing', href: '/#pricing' },
  { name: 'Account', href: '/account' },
]

const Navbar = () => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-transparent">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex items-center gap-x-12">
          <Link href="/" className={s.logo}>
            <h1 className='font-bold text-white'>Optibot</h1>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <HiBars3 className="h-6 w-6 text-white" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:space-x-10">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className={s.link}>
                {item.name}
              </Link>
            ))}
          {user ? (
            <span
              className={s.link}
              onClick={async () => {
                await supabaseClient.auth.signOut();
                router.push('/signin');
              }}
            >
              Sign out
            </span>
          ) : (
            <Link href="/signin" className={s.link}>
              Sign in
            </Link>
          )}
        </div>
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="" className={s.logo}>
            <h1 className='font-bold text-white'>Optibot</h1>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <HiXMark className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={s.linkMobile}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                {user ? (
                  <span
                    className={s.linkMobile}
                    onClick={async () => {
                      await supabaseClient.auth.signOut();
                      router.push('/signin');
                    }}
                  >
                    Sign out
                  </span>
                ) : (
                  <Link href="/signin" className={s.link}>
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
};

export default Navbar;
