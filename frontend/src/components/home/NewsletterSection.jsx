import { useState } from "react";
import { motion } from "framer-motion";
import { HiMail } from "react-icons/hi";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00D4D8] to-[#00A8B0] p-8 sm:p-12 lg:p-16"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative max-w-2xl mx-auto text-center">
            <HiMail className="text-4xl text-white/90 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Stay in the Loop
            </h2>
            <p className="mt-3 text-base text-white/80">
              Get the latest articles and insights delivered straight to your
              inbox. No spam, unsubscribe anytime.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 py-3 px-5 text-base rounded-xl border-0 outline-none text-gray-900 placeholder-gray-500"
              />
              <button
                type="submit"
                className="py-3 px-6 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                {submitted ? "Subscribed!" : "Subscribe"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
