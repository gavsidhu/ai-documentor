import React from 'react'
import FeatureCard from './FeatureCard'
import styles from './Features.module.css'

const Features = () => {
  return (
    <div className='max-w-7xl mx-auto'>
      <div className="mx-auto max-w-2xl py-16 lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Deploy faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to deploy your app
          </p>
          <p className="mt-6 text-lg leading-8 text-white">
            Quis tellus eget adipiscing convallis sit sit eget aliquet quis. Suspendisse eget egestas a elementum
            pulvinar et feugiat blandit at. In mi viverra elit nunc.
          </p>
        </div>
      <div className={styles.gridContainer}>
        <div className={styles.item1}>
          <FeatureCard />
        </div>
        <div className={styles.offsetCard}>
          <FeatureCard />
        </div>
        <div className={styles.item3}>
          <FeatureCard />
        </div>
        <div className={styles.offsetCard}>
          <FeatureCard />
        </div>

      </div>
    </div>
  )
}

export default Features
