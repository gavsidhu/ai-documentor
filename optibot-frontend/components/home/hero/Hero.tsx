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
                            Instantly optimize your code
                        </h1>
                        <p className='text-lg text-white mt-4'>OptiBot instantly generates documentation for your code and refactors inefficient code so you can focus on what really matters - building your project.</p>
                        <div className="mt-10">
                            {user ? (
                                <Link
                                    href="https://marketplace.visualstudio.com/items?itemName=UplevelHQ.optibot"
                                    className="rounded-md bg-white bg-opacity-20 px-5 py-3.5 text-sm font-semibold text-white hover:shadow-sm hover:opacity-75"                                >
                                    Install Optibot for VS Code
                                </Link>

                            ) : (
                                <Link
                                    href="#"
                                    className="rounded-md bg-white bg-opacity-20 px-5 py-3.5 text-sm font-semibold text-white hover:shadow-sm hover:opacity-75"
                                >
                                    Get Started
                                </Link>
                            )}

                        </div>
                    </div>
                    <div className='w-[75%] lg:w-[80%] mx-auto'>
                        <video
                            src="optibot-document-demo.mp4"
                            width={2432}
                            height={1442}
                            loop
                            autoPlay
                            muted
                            className="mt-16 rounded-md bg-transparent shadow-2xl sm:mt-24"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero