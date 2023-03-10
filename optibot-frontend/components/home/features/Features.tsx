import React from 'react'
import FeatureCard from './FeatureCard'
import styles from './Features.module.css'
import { HiPencil, HiTrash } from "react-icons/hi2"


const features = [
  {
    name: 'Secured',
    description:
      'Your code is secured through the use of both SSL encryption and industry-standard 256-bit encryption. This combination offers a highly secure environment for your code, ensuring that it remains protected and inaccessible.',
    icon: HiPencil,
  },
  {
    name: 'Never stored',
    description:
      'Once your code is processed and the result is returned, we immediately delete the code from our systems. This means that your code remains private and secure, with no risk of it being accessed or compromised by anyone.',
    icon: HiTrash,
  },
]
const Features = () => {
  return (
    <div className='max-w-7xl mx-auto'>
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
      <div className="text-white mt-24 py-24 sm:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Secure & Private
            </h2>
            <dl className="col-span-2 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2">
              {features.map((feature) => (
                <div key={feature.name}>
                  <dt className="text-base font-semibold leading-7">
                    {feature.name}
                  </dt>
                  <dd className="mt-1 text-base leading-7">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features
