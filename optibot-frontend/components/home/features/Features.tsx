import React from 'react'
import FeatureCard from './FeatureCard'
import styles from './Features.module.css'

const Features = () => {
  return (
    <div className='max-w-7xl mx-auto'>
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
