import { useUser } from '@/utils/useUser';
import React from 'react'
import Link from 'next/link';
import styles from './Hero.module.css'

const Hero = () => {
    const { user } = useUser();
    return (
        <section className='relative'>
            <div className="py-24 sm:py-32 lg:pb-40">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <h1 className="text-4xl leading-normal font-bold tracking-tight text-white sm:text-6xl sm:leading-normal">
                            Instantly Write Cleaner and Better Code
                        </h1>
                        <div className="mt-10">
                            {user ? (
                                <a
                                    href="#"
                                    className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                                >
                                    Get Optibot for VS Code
                                </a>

                            ) : (
                                <Link
                                    href="#"
                                    className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                                >
                                    Get Started
                                </Link>
                            )}

                        </div>
                    </div>
                    <video
                        src="optibot-demo.mp4"
                        width={2432}
                        height={1442}
                        loop
                        autoPlay
                        muted
                        className="mt-16 rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 sm:mt-24"
                    />
                </div>
            </div>
        </section>
    )
}

export default Hero