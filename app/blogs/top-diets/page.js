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

export default function TopDietsPost() {
  const bg =
    headerImages[Math.floor(Math.random() * headerImages.length)] ||
    "/yoga/img1.jpg";

  return (
    <>
      <Head>
        <title>
          Top 5 Diets to Transform Your Body: Keto, Paleo, Carnivore, Vegan,
          Pescatarian
        </title>
        <meta
          content="Understand Keto, Paleo, Carnivore, Vegan, and Pescatarian diets to choose what fits your goals."
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
              Top 5 Diets to Transform Your Body: Understanding Keto, Paleo,
              Carnivore, Vegan, and Pescatarian
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
              Choosing the right eating plan can feel overwhelming. Every diet
              promises transformation—but the truth is, not every plan works the
              same for everybody. The key is understanding the purpose,
              benefits, and best fit of each, so you can make an informed
              decision and create a lifestyle that supports your health goals.
            </p>
            <p>
              Here’s a closer look at the top five diets people turn to for body
              transformation:
            </p>

            <h3>1. Keto</h3>
            <p>
              The ketogenic diet is high in healthy fats, moderate in protein,
              and very low in carbohydrates. The goal is to shift your body into
              ketosis—a state where fat is burned for fuel instead of carbs.
            </p>
            <p>
              <strong>Benefits:</strong>
            </p>
            <ul>
              <li>Supports fat loss and reduces cravings.</li>
              <li>Helps stabilize blood sugar levels.</li>
              <li>Can improve mental clarity and energy for some people.</li>
            </ul>
            <p>
              <strong>Considerations:</strong> It may feel restrictive at first,
              and it’s important to focus on quality fats (like avocado, olive
              oil, salmon) rather than processed “keto snacks.”
            </p>

            <h3>2. Paleo</h3>
            <p>
              The Paleo diet focuses on eating like our ancestors: whole foods,
              lean meats, vegetables, fruits, nuts, and seeds, while avoiding
              grains, dairy, and processed foods.
            </p>
            <p>
              <strong>Benefits:</strong>
            </p>
            <ul>
              <li>Reduces inflammation in the body.</li>
              <li>
                Supports gut health by focusing on natural, unprocessed foods.
              </li>
              <li>Encourages nutrient-dense meals.</li>
            </ul>
            <p>
              <strong>Considerations:</strong> It can be restrictive for those
              who enjoy legumes or dairy, but it’s a great foundation for
              learning to eat clean, whole foods.
            </p>

            <h3>3. Carnivore</h3>
            <p>
              The carnivore diet is animal-based only—meat, fish, eggs, and
              sometimes dairy. It eliminates all plant foods.
            </p>
            <p>
              <strong>Benefits:</strong>
            </p>
            <ul>
              <li>
                Can reduce digestive issues for those sensitive to fiber or
                plant compounds.
              </li>
              <li>Supports muscle growth with high protein intake.</li>
              <li>Often simplifies eating decisions.</li>
            </ul>
            <p>
              <strong>Considerations:</strong> It can lack fiber, vitamins, and
              antioxidants from plants. This diet is very extreme and usually
              works best short-term or under supervision.
            </p>

            <h3>4. Vegan</h3>
            <p>
              Vegan eating is 100% plant-based—fruits, vegetables, grains,
              legumes, nuts, and seeds—with no animal products.
            </p>
            <p>
              <strong>Benefits:</strong>
            </p>
            <ul>
              <li>Rich in fiber, antioxidants, and micronutrients.</li>
              <li>Supports heart health and weight management.</li>
              <li>Ethically and environmentally conscious.</li>
            </ul>
            <p>
              <strong>Considerations:</strong> It requires careful planning to
              ensure enough protein, iron, vitamin B12, and omega-3s are
              consumed. Supplements are often necessary.
            </p>

            <h3>5. Pescatarian</h3>
            <p>
              A pescatarian diet is primarily plant-based but includes fish and
              seafood for added protein and omega-3s.
            </p>
            <p>
              <strong>Benefits:</strong>
            </p>
            <ul>
              <li>Provides brain-boosting omega-3 fatty acids.</li>
              <li>Easier to sustain long-term than stricter diets.</li>
              <li>
                Offers balance between plant foods and lean animal protein.
              </li>
            </ul>
            <p>
              <strong>Considerations:</strong> Quality matters—choose
              wild-caught fish where possible to reduce exposure to toxins.
            </p>

            <h3>Combining Diets for Transformation</h3>
            <p>
              You don’t have to lock yourself into one rigid box. Many people
              find success by blending principles, such as:
            </p>
            <ul>
              <li>
                A high-protein vegan approach (plants + protein
                supplementation).
              </li>
              <li>A pescatarian-friendly Paleo plan (whole foods + fish).</li>
              <li>
                A balanced keto with more vegetables for fiber and
                micronutrients.
              </li>
            </ul>
            <p>
              The goal is to create a way of eating that supports your energy,
              digestion, and overall well-being.
            </p>

            <h3>Finding What Works for You</h3>
            <ol>
              <li>
                <strong>Assess Your Goals</strong> – Do you want weight loss,
                more energy, or better gut health?
              </li>
              <li>
                <strong>Experiment Mindfully</strong> – Try a diet for a few
                weeks and notice how your body responds.
              </li>
              <li>
                <strong>Prioritize Whole Foods</strong> – No matter the label,
                focus on nutrient-dense foods over processed alternatives.
              </li>
              <li>
                <strong>Be Flexible</strong> – If something isn’t working for
                your body, adjust instead of forcing it.
              </li>
            </ol>

            <h3>Final Word from a Holistic Health Coach</h3>
            <p>
              Whichever diet you choose, the most important thing is to listen
              to your body. Healing and transformation aren’t one-size-fits-all.
              If a particular way of eating is giving you energy, clearer skin,
              better digestion, and improved mood—lean into it. If not, give
              yourself permission to pivot.
            </p>
            <p>
              Your body is your best guide. When you find what works, stay
              consistent, and you’ll not only transform your body—you’ll
              transform your health and lifestyle from the inside out.
            </p>
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
