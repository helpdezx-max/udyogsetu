import React, { useState } from 'react';
import Head from 'next/head';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Head>
        <title>Contact UdyogSetu • Chakan MIDC Recruitment Helpdesk</title>
      </Head>

      <div className="flex-1 p-5 sm:p-8 space-y-7 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-3xs font-bold uppercase tracking-wider border border-neutral-200">
            <Phone className="w-3.5 h-3.5 text-neutral-600" />
            <span>Helpdesk & Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
            Get in Touch with Our Chakan Desk
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed">
            Support for job seekers, factory HR inquiries, and employer onboarding assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Field Office Card (Pastel Palette) */}
          <div className="md:col-span-5 bg-[#F2F6FD] border border-[#D8E6FA] rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-neutral-950 text-base mb-1">Local Field Office</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Located near Ambethan Chowk to serve manufacturing plants across Chakan Phase 1-4 and Khed City.
                </p>
              </div>

              <div className="space-y-4 text-xs text-neutral-700 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-xl text-blue-700 shadow-2xs shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900">Chakan Operations Desk</div>
                    <div className="text-neutral-600 text-3xs mt-0.5">
                      Plot 18, Opp. Chakan Police Station, Ambethan Road, Chakan, Pune 410501
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-xl text-emerald-700 shadow-2xs shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900">Helpline (Mon - Sat)</div>
                    <div className="text-neutral-600 text-3xs mt-0.5">+91 2135 278000 / +91 98220 00000</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-xl text-amber-700 shadow-2xs shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900">Email Inquiries</div>
                    <div className="text-neutral-600 text-3xs mt-0.5">help@udyogsetu.in</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-blue-200/60 text-3xs text-neutral-500">
              Hours: 8:30 AM – 6:00 PM (Monday to Saturday)
            </div>
          </div>

          {/* Form Card */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-2xs">
            {submitted ? (
              <div className="text-center py-10 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-neutral-950">Inquiry Received</h3>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                  Thank you! Our Chakan industrial support desk has logged your message and will reach out within 24 working hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-neutral-900 text-white text-xs font-semibold px-4 py-2 rounded-xl mt-3"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Your Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Shinde"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-400 bg-neutral-50/50"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Mobile Number (WhatsApp)</label>
                  <input
                    type="text"
                    placeholder="+91 98XXX XXXXX"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-400 bg-neutral-50/50"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Message or Query Details</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can our Chakan industrial team help you?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-400 bg-neutral-50/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-neutral-900 hover:bg-black text-white text-xs font-semibold py-3 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message to Support Desk</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
