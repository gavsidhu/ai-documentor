import React from 'react'
import FeatureCard from './FeatureCard'
import styles from './Features.module.css'

const Features = () => {
  return (
    <div className='max-w-7xl mx-auto'>
      <div className="mx-auto max-w-2xl py-24 lg:text-center">
        <h2 className="text-base font-semibold leading-7 text-indigo-600">Deploy faster</h2>
        <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Everything you need to deploy your app
        </p>
        <p className="mt-6 text-lg leading-8 text-white">
          Quis tellus eget adipiscing convallis sit sit eget aliquet quis. Suspendisse eget egestas a elementum
          pulvinar et feugiat blandit at. In mi viverra elit nunc.
        </p>
      </div>
      <div className={styles.gridContainerCards}>
        <div className={styles.item1}>
          <FeatureCard title='Document'>
            <p>sadasddasd</p>
          </FeatureCard>
        </div>
        <div className={styles.offsetCard}>
          <FeatureCard title='Document'>
            <p>sadasddasd</p>
          </FeatureCard>
        </div>
      </div>
      <div className={styles.gridContainer}>
        <div className="text-white text-center">
          <div className="mt-4 sm:flex sm:items-center sm:justify-center sm:gap-4">
            <h2 className="font-medium text-[30px]">Company Name</h2>

            <span className="hidden sm:block sm:h-px sm:w-8 sm:bg-yellow-500"></span>

            <p className="mt-0.5 opacity-50 sm:mt-0">Branding / Signage</p>
          </div>
        </div>
        <div className="text-white">
          <div className="mt-4 sm:flex sm:items-center sm:justify-center sm:gap-4">
            <strong className="font-medium">Company Name</strong>

            <span className="hidden sm:block sm:h-px sm:w-8 sm:bg-yellow-500"></span>

            <p className="mt-0.5 opacity-50 sm:mt-0">Branding / Signage</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features
