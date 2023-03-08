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
          <FeatureCard title='Document'
            description='Say goodbye to the hassle of writing and maintaining documentation for your code! Easily add comments to your code, promoting good coding practices and improving readability and maintainability.'
          />
        </div>
        <div className={styles.offsetCard}>
          <FeatureCard title='Refactor'
            description=' easily identify inefficient code and make improvements to ensure your code runs as efficiently and quickly as possible. Plus, with the ability to easily undo or redo changes, you can make larger-scale changes with confidence.'
          />
        </div>
      </div>
      <div className={styles.gridContainer}>
        <div className="text-white text-center">
          <div className="mt-4 px-8">
            <h2 className="font-medium text-[30px]">Secure and Private</h2>
            <p className="mt-4 text-left text-lg">We use encryption to protect your code throughout the entire process, ensuring that your code is never exposed to anyone else. We do not store your code or any other sensitive information, so you can use our extension with peace of mind.</p>
          </div>
        </div>
        <div className="text-white text-center">
          <div className="mt-4 px-8">
            <h2 className="font-medium text-[30px]">Secure and Private</h2>
            <p className="mt-4 text-left text-lg">We use encryption to protect your code throughout the entire process, ensuring that your code is never exposed to anyone else. We do not store your code or any other sensitive information, so you can use our extension with peace of mind.</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Features
