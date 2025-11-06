import React from 'react'
import { Package, CreditCard, BarChart3, Shield, Zap, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'motion/react';

const features = [
  {
    icon: Package,
    title: "Smart Inventory",
    description: "Real-time tracking, automated reordering, and multi-location management to keep your stock optimized."
  },
  {
    icon: CreditCard,
    title: "Modern POS",
    description: "Lightning-fast checkout with support for multiple payment methods and seamless customer experience."
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Powerful insights and customizable reports to help you make informed business decisions."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and compliance with industry standards to protect your business data."
  },
  {
    icon: Zap,
    title: "Quick Integration",
    description: "Connect with your favorite tools and platforms in minutes with our robust API and integrations."
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Role-based access, employee tracking metrics. all in one place."
  }
];

export default function About() {
  return (
    <motion.section
    className="relative py-20 sm:py-32 bg-gradient-subtle overflow-hidden" id='about'>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-[#E2EEEE] border border-primary/20 rounded-full mb-6">
            <span className="text-sm font-medium text-[#2E6C6D]">About POSIM</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6">
            Everything You Need to
            <br />
            <span className="bg-gradient-to-r to-[#03686A] from-[#034344] bg-clip-text text-transparent">
              Scale Your Business
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            POSIM combines powerful point-of-sale capabilities with comprehensive inventory management, 
            giving you complete control over your business operations from a single, intuitive platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="inline-flex p-3 rounded-xl bg-[#E4F0F0] group-hover:bg-[#E4F0F0]/60 transition-colors duration-300">
                    <Icon className="h-6 w-6 text-[#034344]" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-[#034344] group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-20 text-center animate-fade-in">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 px-8 py-6 bg-card border border-border/50 rounded-2xl shadow-md">
            <div className="text-left">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Ready to transform your business?
              </h3>
              <p className="text-sm text-muted-foreground">
                Join thousands of businesses already using POSIM
              </p>
            </div>
            <button className="px-6 py-3 bg-gradient-primary text-primary-foreground font-medium rounded-xl hover:shadow-glow transition-all duration-300 whitespace-nowrap">
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
