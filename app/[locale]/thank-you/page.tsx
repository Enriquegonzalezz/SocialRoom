'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger)

export default function ThankYouPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const messageRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const decorativeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state
      gsap.set(titleRef.current, { opacity: 0, y: -50 })
      gsap.set(subtitleRef.current, { opacity: 0, y: 30 })
      gsap.set(messageRef.current, { opacity: 0, scale: 0.9 })
      gsap.set(buttonRef.current, { opacity: 0, y: 20 })
      gsap.set(decorativeRef.current, { opacity: 0, scale: 0.5 })

      // Title animation
      gsap.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3
      })

      // Subtitle animation
      gsap.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.6
      })

      // Decorative elements animation
      gsap.to(decorativeRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "elastic.out(1, 0.3)",
        delay: 0.8
      })

      // Message box animation
      gsap.to(messageRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "back.out(1.7)",
        delay: 1
      })

      // Button animation
      gsap.to(buttonRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 1.3
      })

      // Floating animation for decorative elements
      gsap.to(decorativeRef.current, {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 2
      })

      // Subtle pulse for message box
      gsap.to(messageRef.current, {
        scale: 1.02,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 2.5
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center relative">
        {/* Decorative element */}
        <div 
          ref={decorativeRef}
          className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20"
        />
        
        {/* Main content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -mr-20 -mt-20 opacity-50" />
          
          <h1 
            ref={titleRef}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
          >
            Thank You
          </h1>
          
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl text-gray-600 mb-8"
          >
            Your submission has been received successfully
          </p>
          
          <div 
            ref={messageRef}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8 border border-blue-100"
          >
            <p className="text-gray-700 leading-relaxed mb-4">
              We appreciate your interest and have received your information. Our team will review your submission and get back to you shortly.
            </p>
            <p className="text-gray-600 text-sm">
              A confirmation email has been sent to your registered email address with all the details.
            </p>
          </div>
          
          <Link href="/">
            <button 
              ref={buttonRef}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Return to Home
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </Link>
        </div>
        
        {/* Additional decorative elements */}
        <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-20" />
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-2xl opacity-20" />
      </div>
    </div>
  )
}
