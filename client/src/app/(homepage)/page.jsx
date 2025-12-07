"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Users, Calendar, MessageCircle } from "lucide-react";

export default function Homepage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const features = [
    {
      title: "Pet Community",
      description: "Connect with fellow pet lovers, share stories, and get advice.",
      icon: Users,
      link: "/community",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Pet Store",
      description: "Find high-quality essentials, toys, and treats for your furry friends.",
      icon: ShoppingBag,
      link: "/store",
      color: "bg-orange-100 text-orange-600"
    },
    {
      title: "Events",
      description: "Join local meetups, adoption drives, and fun pet gatherings.",
      icon: Calendar,
      link: "/events",
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Chat",
      description: "Instant message with other owners and sellers.",
      icon: MessageCircle,
      link: "/chat",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary/30 pt-10 pb-20 lg:pt-20 lg:pb-32">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="lg:w-1/2 text-center lg:text-left"
            >
              <h1 className="titlefont text-5xl lg:text-7xl font-bold mb-6 text-primary leading-tight">
                The Place Where <span className="text-accent italic">Love</span> Meets Pet Essentials
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
                Join our thriving community of pet lovers. Shop premium products, discover local events, and connect with paw-rents just like you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/store">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full w-full sm:w-auto shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    Shop Now <ShoppingBag className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 text-lg rounded-full w-full sm:w-auto transition-all">
                    Join Community
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="/hero-pets.png" 
                  alt="Happy pets" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -top-10 -right-10 w-60 h-60 bg-primary/10 rounded-full blur-3xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl lg:text-5xl font-bold text-primary titlefont mb-4">Everything You Need</motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-500 max-w-2xl mx-auto">Explore our diverse range of features designed to make pet parenting easier and more fun.</motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="h-full"
              >
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-primary/10 hover:shadow-xl hover:border-accent/30 transition-all h-full flex flex-col items-center text-center group">
                  <div className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-primary">{feature.title}</h3>
                  <p className="text-gray-500 mb-6 text-sm leading-relaxed flex-grow">{feature.description}</p>
                  <Link href={feature.link} className="flex items-center text-primary font-bold hover:text-accent transition-colors text-sm group-hover:underline decoration-accent underline-offset-4">
                    Explore <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-secondary relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <PawPrint className="w-96 h-96 absolute -top-20 -left-20 text-white transform rotate-12" />
          <PawPrint className="w-64 h-64 absolute bottom-10 right-10 text-white transform -rotate-12" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-white titlefont">Ready to Join the Fun?</h2>
            <p className="text-xl text-secondary mb-10 max-w-2xl mx-auto">Create an account today and start connecting with thousands of other pet lovers in your area.</p>
            <Link href="/profile">
              <Button className="bg-accent hover:bg-white hover:text-primary text-primary font-bold px-10 py-6 text-lg rounded-full shadow-lg transition-all transform hover:scale-105">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Helper icon component since it was missing in imports
function PawPrint({ className, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.38 7.37c1.39 1.39 1.5 5.21.25 7.74-1.25 2.53-3.03 2.1-3.03 2.1s-.41 1.78-2.6 1.78-2.6-1.78-2.6-1.78-1.78.43-3.03-2.1c-1.25-2.53-1.14-6.35.25-7.74 1.39-1.39 2.16-.06 2.16-.06l.54.54a2.95 2.95 0 0 1 5.37 0l.54-.54s.77-1.33 2.16.06z" />
    </svg>
  )
}
