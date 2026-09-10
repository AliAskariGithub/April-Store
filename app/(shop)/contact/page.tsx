// app/(shop)/contact/page.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { 
  Mail, 
  Phone, 
  Linkedin, 
  Facebook, 
  Instagram, 
  Github, 
  Send, 
  Sparkles, 
  Clock, 
  MapPin, 
  ChevronDown,
  ArrowRight,
  Code2,
  CheckCircle2,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const resetStatusSoon = () => {
    setTimeout(() => setStatus('idle'), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_API_KEY,
          name: formData.name,
          email: formData.email,
          reason: formData.reason,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        Swal.fire({
          title: 'Success!',
          text: 'Message has been sent successfully! You will be contacted soon.',
          icon: 'success',
          confirmButtonColor: '#FF5722',
          customClass: {
            popup: 'rounded-2xl font-sans',
            confirmButton: 'rounded-xl px-6 py-2.5 font-bold text-sm',
          },
        });
        setFormData({ name: '', email: '', reason: '', message: '' });
      } else {
        throw new Error(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      Swal.fire({
        title: 'Error!',
        text: 'Failed to send your message. Please try again later.',
        icon: 'error',
        confirmButtonColor: '#FF5722',
        customClass: {
          popup: 'rounded-2xl font-sans',
          confirmButton: 'rounded-xl px-6 py-2.5 font-bold text-sm',
        },
      });
    } finally {
      resetStatusSoon();
    }
  };

  const contactMethods = [
    {
      title: 'Direct Email',
      value: 'syedaliaskarizaidi1@gmail.com',
      actionText: 'Compose Email',
      actionHref: 'mailto:syedaliaskarizaidi1@gmail.com',
      icon: Mail,
      timing: 'Response within 24 hours',
    },
    {
      title: 'Phone & WhatsApp',
      value: '+92 319 2046516',
      actionText: 'Connect on WhatsApp',
      actionHref: 'https://wa.me/923192046516',
      icon: Phone,
      timing: 'Available for calls & chats',
    },
    {
      title: 'Global Engineering',
      value: 'Karachi, Sindh, Pakistan',
      actionText: 'View Portfolio',
      actionHref: 'https://aliaskari.xyz',
      icon: MapPin,
      timing: 'Remote Contracts Worldwide',
    },
  ];

  const socialChannels = [
    {
      name: 'LinkedIn',
      handle: 'ali-askari-dev',
      href: 'https://www.linkedin.com/in/ali-askari-dev',
      icon: Linkedin,
      color: 'hover:border-[#0077b5] hover:text-[#0077b5]',
    },
    {
      name: 'Facebook',
      handle: 'Syed Ali Askari Zaidi',
      href: 'https://www.facebook.com/profile.php?id=61564881342854',
      icon: Facebook,
      color: 'hover:border-[#1877f2] hover:text-[#1877f2]',
    },
    {
      name: 'Instagram',
      handle: '@syedaliaskarizaidi__',
      href: 'https://www.instagram.com/syedaliaskarizaidi__/',
      icon: Instagram,
      color: 'hover:border-[#e4405f] hover:text-[#e4405f]',
    },
    {
      name: 'GitHub & X',
      handle: '@AliAskariGithub',
      href: 'https://github.com/AliAskariGithub',
      icon: Github,
      color: 'hover:border-gray-900 hover:text-gray-900',
    },
  ];

  const faqs = [
    {
      question: 'Is April Store an active retail shop or a showcase portfolio?',
      answer:
        'April Store is a production-grade showcase application created by Syed Ali Askari Zaidi to demonstrate full-stack e-commerce architecture, headless CMS with Sanity Studio, Firebase authentication & Cloud Firestore, and multimodal Google Gemini AI features. This website is a portfolio showcase to connect with clients for software engineering and design work.',
    },
    {
      question: 'What services do you provide for clients and businesses?',
      answer:
        'I deliver end-to-end full-stack web applications (Next.js 15, React 19, TypeScript, Node.js), headless e-commerce platforms, UI/UX & brand identity design, search engine optimization (SEO), digital marketing tech stacks, and AI integrations.',
    },
    {
      question: 'How quickly do you respond to project inquiries?',
      answer:
        'All client inquiries submitted through this form are sent directly to my inbox via Web3Forms. I review inquiries daily and typically respond within 24 hours with project scope considerations and discovery call availability.',
    },
    {
      question: 'Can you customize or build a custom store similar to April Store?',
      answer:
        'Yes! Whether you require an apparel boutique, luxury goods marketplace, or custom SaaS web app, I can architect, design, and build a tailored solution from scratch to match your brand requirements.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* 1. Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF3E0] text-[#FF5722] text-xs font-bold uppercase tracking-wider">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Client Inquiries & Project Collaboration</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
          Let’s Build Something Exceptional
        </h1>
        <p className="text-sm sm:text-base text-gray-500 font-normal leading-relaxed">
          April Store is a full-stack e-commerce engineering showcase. Have a web development, brand design, or digital project in mind? Reach out below to connect with the developer directly.
        </p>

        {/* Showcase Notice Banner */}
        <div className="mt-4 p-3.5 sm:p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs sm:text-sm flex items-start sm:items-center gap-3 text-left">
          <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <span className="font-bold text-amber-950">Showcase Project Notice: </span>
            This platform is an interactive portfolio demonstration developed by{' '}
            <strong className="text-amber-950 font-bold">Syed Ali Askari Zaidi</strong>. Use this form to discuss freelance development, contracts, or custom web builds.
          </div>
        </div>
      </div>

      {/* 2. Direct Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contactMethods.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white border border-gray-100 hover:border-gray-300 hover:shadow-lg transition-all duration-300 rounded-2xl p-6 text-left flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#FFF3E0] text-[#FF5722] flex items-center justify-center">
                  <Icon className="w-6 h-6" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-sm font-semibold text-gray-800 mt-1 break-all">
                    {item.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span>{item.timing}</span>
                  </p>
                </div>
              </div>

              <div>
                <a
                  href={item.actionHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5722] hover:text-[#F4511E] transition-colors"
                >
                  <span>{item.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Form & Social Channels Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Interactive Contact Form (Web3Forms Functionality with April Store UI) */}
        <div className="lg:col-span-7 bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-xs text-left space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Send a Project Inquiry
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Select what you are looking for and describe your project goals. I will get back to you promptly.
            </p>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 sm:gap-5"
            initial={{ opacity: 0, y: 24, scale: 0.99 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Name and Email Row */}
            <div className="flex gap-4 sm:gap-5 flex-col sm:flex-row">
              <div className="flex-1">
                <label 
                  htmlFor="name" 
                  className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
                >
                  Your Name <span className="text-[#FF5722]">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Syed Ali Askari"
                  className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20 bg-white text-gray-900 placeholder:text-gray-400 transition-all font-sans"
                />
              </div>
              <div className="flex-1">
                <label 
                  htmlFor="email" 
                  className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
                >
                  Email Address <span className="text-[#FF5722]">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@company.com"
                  className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20 bg-white text-gray-900 placeholder:text-gray-400 transition-all font-sans"
                />
              </div>
            </div>

            {/* Inquiry Reason Select Dropdown */}
            <div>
              <label 
                htmlFor="reason" 
                className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
              >
                Inquiry Topic / Service Needed <span className="text-[#FF5722]">*</span>
              </label>
              <select
                id="reason"
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20 bg-white text-gray-900 transition-all font-sans cursor-pointer"
              >
                <option value="">Looking for...</option>
                <option value="web-development">Web Development (Next.js, Full-Stack)</option>
                <option value="brand-design">Brand Design & UI/UX</option>
                <option value="digital-marketing">Digital Marketing & Growth</option>
                <option value="seo">Search Engine Optimization (SEO)</option>
                <option value="video-editing">Video Editing & Creative Content</option>
                <option value="other">Other Collaboration</option>
              </select>
            </div>

            {/* Message Textarea */}
            <div>
              <label 
                htmlFor="message" 
                className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5"
              >
                Project Details / Message <span className="text-[#FF5722]">*</span>
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell me about your project, timeline, budget, or ideas..."
                className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FF5722] focus:ring-2 focus:ring-[#FF5722]/20 bg-white text-gray-900 placeholder:text-gray-400 transition-all font-sans resize-y min-h-[120px]"
              />
            </div>

            {/* Animated Motion Button */}
            <motion.button
              type="submit"
              disabled={status === 'loading'}
              className="w-full min-h-[50px] rounded-xl font-bold text-xs sm:text-sm text-white transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              style={{ 
                background: 
                  status === 'success' ? '#22c55e' : 
                  status === 'error' ? '#ef4444' : 
                  '#FF5722' 
              }}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              {status === 'loading' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending Inquiry...</span>
                </>
              ) : status === 'success' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sent Successfully!</span>
                </>
              ) : status === 'error' ? (
                <>
                  <AlertCircle className="w-4 h-4" />
                  <span>Error - Try Again</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </motion.button>
          </motion.form>
        </div>

        {/* Right Column: Social Channels & Architecture Callout */}
        <div className="lg:col-span-5 space-y-6 text-left">
          
          {/* Social Links Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
            <div>
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                Connect on Social Media
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Reach out on professional networks or explore my open-source repositories and design portfolio.
              </p>
            </div>

            <div className="space-y-3">
              {socialChannels.map((channel) => {
                const Icon = channel.icon;
                return (
                  <a
                    key={channel.name}
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xs transition-all duration-200 group',
                      channel.color
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-700 group-hover:text-inherit transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">
                          {channel.name}
                        </h4>
                        <p className="text-[11px] text-gray-400 font-medium">
                          {channel.handle}
                        </p>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-inherit group-hover:translate-x-1 transition-all" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Technology Highlights Card */}
          <div className="bg-linear-to-br from-gray-900 to-black text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#FF5722] uppercase tracking-wider">
              <Code2 className="w-4 h-4" />
              <span>Engineering Stack</span>
            </div>
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              Production Architecture
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed font-normal">
              Built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, Sanity Studio headless CMS, Firebase Cloud Firestore, and Google Gemini Multimodal AI.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://github.com/AliAskariGithub"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF5722] hover:bg-[#F4511E] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Profile</span>
              </a>
              <a
                href="https://www.linkedin.com/in/ali-askari-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* 4. Frequently Asked Questions (Accordion) */}
      <div className="text-left space-y-6 pt-6 border-t border-gray-100" id="faqs">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Answers regarding client collaborations, showcase architecture, and development services.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={faq.question}
                className="border border-gray-200 rounded-2xl overflow-hidden bg-white transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer hover:bg-gray-50/75 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0',
                      isOpen && 'rotate-180 text-[#FF5722]'
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed pt-1">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
