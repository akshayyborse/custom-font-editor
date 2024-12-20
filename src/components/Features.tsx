'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function Features() {
  const features = [
    {
      title: 'Font Weight',
      description: 'Adjust thickness from thin to bold with precise control',
      icon: '⚖️',
    },
    {
      title: 'Letter Spacing',
      description: 'Fine-tune the space between characters',
      icon: '↔️',
    },
    {
      title: 'Style Options',
      description: 'Toggle italic and other stylistic variations',
      icon: '🎨',
    },
  ]

  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-gray-400">Everything you need to create the perfect font</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ feature, index }: { feature: any; index: number }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-colors duration-300"
    >
      <div className="text-4xl mb-4">{feature.icon}</div>
      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
      <p className="text-gray-400">{feature.description}</p>
    </motion.div>
  )
} 