import { useState, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import {
  createServerSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';
import { supabase } from '@/utils/supabase-client';

import LoadingDots from '@/components/ui/LoadingDots';
import Button from '@/components/ui/Button';
import { useUser } from '@/utils/useUser';
import { postData } from '@/utils/helpers';
import Modal from '@/components/ui/Modal';
import axios from 'axios'
import { url } from '@/constant/url';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="border border-zinc-700	max-w-3xl w-full p rounded-md m-auto my-8">
      <div className="px-5 py-4">
        <h3 className="text-2xl mb-1 font-medium">{title}</h3>
        <p className="text-zinc-300">{description}</p>
        {children}
      </div>
      <div className="border-t border-zinc-700 bg-zinc-900 p-4 text-zinc-500 rounded-b-md">
        {footer}
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: '/signin',
        permanent: false
      }
    };

  const { count } = await supabase.from("api_keys").select('*', { count: "exact", head: true }).eq("user_id", session.user.id)
  return {
    props: {
      initialSession: session,
      user: session.user,
      count: count,
    }
  };
};

export default function Account({ user, count }: { user: User, count: number | null }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const { isLoading, subscription } = useUser();

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const { url, error } = await postData({
        url: '/api/create-portal-link'
      });
      window.location.assign(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
    setLoading(false);
  };

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  const addAPIKey = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(`${url}/api/api-key/add-api-key`, {
        apiKey: apiKey,
        userId: user.id
      })
      setLoading(false)
      alert(res.data.message)
      setOpen(false)
    } catch (error) {
      setLoading(false)
      setOpen(false)
      console.log(error)
    }
  }

  const removeAPIKey = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true)
    try {
      const res = await axios.post(`${url}/api/api-key/remove-api-key`, {
        userId: user.id
      })
      setLoading(false)
      alert(res.data.message)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  return (
    <section className="bg-black  text-white mb-32">
      <Modal open={open} setOpen={setOpen}>
        <div>
          <h3 className='text-base font-semibold leading-6 text-white'>Add API Key</h3>
          <form className="mt-6 sm:flex sm:max-w-md" autoComplete='off' onSubmit={(e) => addAPIKey(e)}>
            <input
              type="text"
              id="apiKey"
              required
              autoComplete="new-password"
              className="w-full min-w-0 appearance-none rounded-md border-0 bg-white/5 px-3 py-1.5 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 sm:w-64 sm:text-sm sm:leading-6 xl:w-full"
              placeholder="Enter OpenAI API Key"
              onChange={(e) => setApiKey(e.currentTarget.value)}
            />
            <div className="mt-4 sm:mt-0 sm:ml-4 sm:flex-shrink-0">
              <button
                type="submit"
                className="min-w-0 flex-auto border-0 bg-white text-zinc-800 transition ease-in-out duration-150 font-semibold text-center justify-center px-3.5 py-2  shadow-sm sm:text-sm sm:leading-6 hover:bg-zinc-800 hover:text-white hover:border-white"
              >
                Add API Key
              </button>
            </div>
          </form>
        </div>
      </Modal>
      <div className="max-w-6xl mx-auto pt-8 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Account
          </h1>
        </div>
      </div>
      <div className="p-4">
        {/* <Card
          title="Manage Billing"
          footer={
            <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">
                Manage your billing.
              </p>
              <Button
                variant="slim"
                loading={loading}
                disabled={loading}
                onClick={redirectToCustomerPortal}
              >
                Open customer portal
              </Button>
            </div>
          }
        >
        </Card> */}
        <Card
          title="Your Name"
          description="Please enter your full name, or a display name you are comfortable with."
          footer={<p>Please use 64 characters at maximum.</p>}
        >
          <div className="text-xl text-white mt-8 mb-4 font-semibold">
            {user ? (
              `${user.user_metadata.full_name
              }`
            ) : (
              <div className="h-8 mb-6">
                <LoadingDots />
              </div>
            )}
          </div>
        </Card>
        <Card
          title="Your Email"
          description="Please enter the email address you want to use to login."
          footer={<p>We will email you to verify the change.</p>}
        >
          <p className="text-xl text-white mt-8 mb-4 font-semibold">
            {user ? user.email : undefined}
          </p>
        </Card>
        <Card
          title="Your OpenAI API Key"
          footer={
            <div>
              {count != 0 && count != null
                ?
                <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
                  <p className="pb-4 sm:pb-0">
                    Remove your API key
                  </p>
                  <Button
                    variant="slim"
                    loading={loading}
                    disabled={loading}
                    onClick={(e) => removeAPIKey(e)}
                  >
                    Remove API Key
                  </Button>
                </div>
                :
                <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
                  <p className="pb-4 sm:pb-0">
                    Add an API key
                  </p>
                  <Button
                    variant="slim"
                    loading={loading}
                    disabled={loading}
                    onClick={() => setOpen(true)}
                  >
                    Add API Key
                  </Button>
                </div>
              }
            </div>
          }
        >
          <div className="text-xl mt-8 mb-4 font-semibold">
            {isLoading ? (
              <div className="h-12 mb-6">
                <LoadingDots />
              </div>
            ) : (count !== 0 && count !== null) ? (
              <p>****************</p>
            ) : (
              <p>No API Key</p>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
