"use client";

import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";

const headerImages = [
  "/yoga/img2.jpg",
  "/yoga/img3.jpg",
  "/yoga/img4.jpg",
  "/yoga/img5.jpg",
];

export default function StrengthPilatesPost() {
  const bg =
    headerImages[Math.floor(Math.random() * headerImages.length)] ||
    "/yoga/img1.jpg";

  return (
    <>
      <Head>
        <title>
          Strength Training & Pilates: Transform Your Body Inside and Out
        </title>
        <meta
          content="Why combining strength training and Pilates transforms your body and mind."
          name="description"
        />
      </Head>

      {/* Hero / Page Title Section */}
      <section
        className="relative bg-cover no-repeat bg-center py-32"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="absolute inset-0 bg-primary/70" />

        <motion.img
          alt="Design Element"
          className="absolute top-10 left-0 w-[200px] hidden md:block z-20"
          initial={{ opacity: 0, x: -50, y: -50, scale: 0.8 }}
          src="https://designingmedia.com/yogastic/wp-content/uploads/2022/07/hero-left-design-1.png"
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4 max-w-4xl mx-auto">
              Strength Training & Pilates: Transform Your Body Inside and Out
            </h1>
            <div className="flex justify-center items-center">
              <nav className="breadcrumb bg-black/20 p-2 px-4 rounded-lg">
                <Link className="text-white hover:text-yellow-300" href="/">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <Link
                  className="text-white hover:text-yellow-300"
                  href="/blogs"
                >
                  Blogs
                </Link>
              </nav>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none blog-content">
            <p>
              If you’re looking for a full-body transformation—inside and
              out—combining strength training and Pilates is one of the most
              powerful approaches you can take. While each practice is effective
              on its own, together they create a balance of power, grace, and
              resilience that reshapes not just your body, but also how you move
              and feel every day.
            </p>
            <p>
              Here’s why pairing strength training with Pilates can be a
              game-changer:
            </p>

            <h3>1. Build Lean Muscle & Tone Your Body</h3>
            <p>
              Strength training uses weights, resistance bands, or even your own
              body weight to stimulate muscle growth and strength. Over time,
              this creates definition in your arms, legs, and core while
              improving overall strength.
            </p>
            <p>
              Pilates complements this by focusing on controlled movements that
              lengthen and tone muscles. Instead of bulking up, it helps you
              achieve lean, sculpted lines—especially around the waist, hips,
              and thighs. Together, they create the perfect balance between
              power and elegance.
            </p>

            <h3>2. Improve Core Strength & Stability</h3>
            <p>
              Your core is the powerhouse of your body—it stabilizes you in
              every movement, from lifting groceries to performing complex
              workouts.
            </p>
            <p>
              Pilates is famous for its ability to target deep abdominal and
              stabilizing muscles, often overlooked in traditional workouts.
              This not only strengthens your abs but also improves posture,
              balance, and spinal health. When combined with the functional
              strength you build in the gym, your body becomes more stable,
              efficient, and injury-resistant.
            </p>

            <h3>3. Boost Metabolism & Support Fat Loss</h3>
            <p>
              Strength training builds muscle mass, and muscle is metabolically
              active tissue—it burns more calories even at rest. That means the
              more muscle you build, the faster your metabolism works.
            </p>
            <p>
              Pilates might not torch as many calories as heavy lifting, but it
              enhances body awareness, posture, and movement patterns—making
              your strength training sessions more effective. The two combined
              help you shed fat, tone your body, and keep the results
              sustainable long-term.
            </p>

            <h3>4. Reduce Injury Risk & Support Longevity</h3>
            <p>
              One of the biggest reasons people struggle to stay consistent with
              fitness is injuries. Strength training builds resilience in
              muscles, tendons, and bones, while Pilates enhances flexibility
              and mobility. Together, they create a body that’s both strong and
              supple.
            </p>
            <p>
              This combination helps prevent overuse injuries, supports joint
              health, and even improves recovery after workouts. It’s the kind
              of training that doesn’t just make you stronger today—it keeps you
              moving well for years to come.
            </p>

            <h3>5. Enhance Mental Clarity & Mind-Body Connection</h3>
            <p>
              Physical transformation is powerful, but what happens in your mind
              is just as important.
            </p>
            <ul>
              <li>
                Pilates teaches you to move with control, breathe intentionally,
                and connect with your body on a deeper level.
              </li>
              <li>
                Strength training builds discipline, confidence, and resilience,
                showing you that you’re stronger than you think.
              </li>
            </ul>
            <p>
              Together, they create a sense of empowerment—not just looking
              strong on the outside, but feeling calm, capable, and focused on
              the inside.
            </p>

            <h3>Bringing It All Together</h3>
            <p>
              By integrating both practices into your weekly routine, you’re not
              just reshaping your body—you’re upgrading your entire lifestyle.
              Strength training gives you the power and endurance to move
              through life with ease, while Pilates refines your posture,
              balance, and inner strength.
            </p>
            <p>
              It’s the perfect recipe for transformation: a body that is strong,
              lean, flexible, and deeply connected to mind and spirit.
            </p>

            <h3>Tip for Getting Started</h3>
            <ul>
              <li>Aim for 2–3 strength training sessions per week.</li>
              <li>
                Add 1–2 Pilates sessions (mat or reformer) to improve balance,
                mobility, and core strength.
              </li>
              <li>
                Listen to your body and focus on consistency over perfection.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <style jsx>{`
        .blog-content h3 {
          color: #8b5a8b;
          font-weight: 700;
          letter-spacing: 0.2px;
          margin-top: 2rem;
          padding-left: 0.75rem;
          border-left: 4px solid #d9b88f;
        }
        .blog-content p {
          line-height: 1.9;
          color: #374151;
        }
        .blog-content ul li::marker,
        .blog-content ol li::marker {
          color: #8b5a8b;
          font-weight: 700;
        }
        .blog-content strong {
          color: #6b21a8;
        }
      `}</style>
    </>
  );
}
