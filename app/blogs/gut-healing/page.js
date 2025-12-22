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

export default function GutHealingPost() {
  const bg =
    headerImages[Math.floor(Math.random() * headerImages.length)] ||
    "/yoga/img1.jpg";

  return (
    <>
      <Head>
        <title>
          10 Ways to Heal Your Gut – Tips from a Certified Holistic Health Coach
        </title>
        <meta
          content="10 natural, holistic ways to heal your gut and improve digestion, energy, skin, and mood."
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
              10 Ways to Heal Your Gut – Tips from a Certified Holistic Health
              Coach
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
              Your gut is at the center of your overall well-being—it doesn’t
              just help you digest food, it also plays a vital role in your
              immunity, energy, mental clarity, and even your mood. When your
              gut is out of balance, you may experience symptoms like bloating,
              fatigue, skin issues, cravings, or brain fog. The good news? With
              a few intentional shifts, you can start to restore balance and
              give your digestive system the support it needs.
            </p>
            <p>
              Here are 10 natural, holistic ways to heal your gut and feel
              better from the inside out:
            </p>

            <h3>1. Eat Whole, Real Foods</h3>
            <p>
              Your body thrives on foods that are as close to their natural
              state as possible. Whole foods—like leafy greens, fresh fruits,
              lean proteins, legumes, nuts, and seeds—deliver the fiber,
              vitamins, and minerals your gut bacteria need to flourish. Think
              of these foods as “medicine” that gently repairs and fuels your
              body.
            </p>

            <h3>2. Include Fermented Foods</h3>
            <p>
              Fermented foods like sauerkraut, kimchi, miso, kefir, and kombucha
              are loaded with probiotics—live beneficial bacteria that help
              restore balance in your microbiome. Adding even a small serving
              each day can improve digestion and reduce bloating.
            </p>

            <h3>3. Limit Sugar & Processed Foods</h3>
            <p>
              Refined sugar, artificial sweeteners, and processed foods feed
              harmful bacteria and yeast in the gut, which can lead to
              inflammation and digestive distress. By reducing packaged snacks,
              sugary drinks, and fast food, you give your gut space to rebalance
              and heal.
            </p>

            <h3>4. Stay Hydrated</h3>
            <p>
              Water is essential for every function in your body, including
              digestion. Staying hydrated helps your digestive system break down
              food efficiently and supports regular bowel movements. Aim for at
              least 8 cups a day—more if you’re active or live in a warm
              climate.
            </p>

            <h3>5. Manage Stress</h3>
            <p>
              Your brain and gut are deeply connected (often called the
              gut-brain axis). Stress can slow digestion, trigger inflammation,
              and upset the delicate balance of your microbiome. Simple
              practices like deep breathing, prayer, meditation, or gentle yoga
              can work wonders in calming your nervous system and supporting gut
              health.
            </p>

            <h3>6. Prioritize Sleep</h3>
            <p>
              A well-rested body heals better. Studies show that poor sleep
              alters gut bacteria and increases inflammation. Aim for 7–9 hours
              of deep, restorative sleep every night. Try creating a bedtime
              ritual—dim lights, limit screens, and enjoy a calming tea before
              bed.
            </p>

            <h3>7. Incorporate Prebiotics</h3>
            <p>
              Prebiotics are fibers that feed your healthy gut bacteria, helping
              them multiply and thrive. Foods like garlic, onions, leeks,
              asparagus, green bananas, and oats are rich in prebiotics. Pairing
              them with probiotics is a powerful way to build long-term gut
              health.
            </p>

            <h3>8. Take Digestive Enzymes (If Needed)</h3>
            <p>
              Some people struggle with breaking down certain foods due to low
              enzyme levels. Digestive enzyme supplements can support nutrient
              absorption and reduce discomfort such as bloating or gas
              especially if you’re transitioning to a healthier diet.
            </p>

            <h3>9. Avoid Unnecessary Antibiotics</h3>
            <p>
              While antibiotics can be lifesaving, they also wipe out both
              harmful and beneficial bacteria. Overuse can lead to long-term gut
              imbalances. Take them only when absolutely necessary, and always
              follow up with probiotic-rich foods to rebuild your gut flora.
            </p>

            <h3>10. Move Your Body Regularly</h3>
            <p>
              Exercise doesn’t just benefit your muscles and heart—it also
              supports your gut. Movement improves circulation, reduces stress,
              and encourages healthy digestion. Whether it’s walking, Pilates,
              dancing, or strength training, find movement that brings you joy
              and make it a regular part of your routine.
            </p>

            <h3>Final Word</h3>
            <p>
              Healing your gut isn’t about perfection—it’s about consistency.
              Small, daily changes add up to big transformations. When you give
              your gut the care it needs, you’ll notice more energy, clearer
              skin, better moods, and a stronger immune system.
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .blog-content h3 {
          color: #8b5a8b; /* primary */
          font-weight: 700;
          letter-spacing: 0.2px;
          margin-top: 2rem;
          padding-left: 0.75rem;
          border-left: 4px solid #d9b88f; /* accent */
        }
        .blog-content p {
          line-height: 1.9;
          color: #374151; /* gray-700 */
        }
        .blog-content ul li::marker,
        .blog-content ol li::marker {
          color: #8b5a8b;
          font-weight: 700;
        }
        .blog-content strong {
          color: #6b21a8; /* purple-800 */
        }
      `}</style>
    </>
  );
}
