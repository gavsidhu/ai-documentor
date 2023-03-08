import React from 'react'

type CardProps = {
    title: string,
    description: string
}
const FeatureCard = ({ title, description }: CardProps) => {
    return (
        <div className="block text-white">
            <img
                alt="Signage"
                src="https://images.unsplash.com/photo-1588515724527-074a7a56616c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
                className="h-56 w-full rounded-bl-3xl rounded-tr-3xl object-cover sm:h-64 lg:h-72"
            />

            <div className="mt-4 px-8">
                <h2 className="font-medium">{title}</h2>
                <p className="mt-4 text-left text-lg">{description}</p>
            </div>


        </div>
    )
}

export default FeatureCard