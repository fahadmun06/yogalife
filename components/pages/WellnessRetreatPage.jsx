"use client";

import PageHero from "../NewSimpleUI/PageHero";
import RetreatHero from "../RetreatHero";

export default function WellnessRetreatPage() {
  return (
    <>
      <PageHero
        breadcrumb={[
          { label: "Wellness Retreat", link: "/wellness-retreat" },
        ]}
        subtitle="Pilates & wellness retreats — mind-body reset with Tinashaii"
        title="Wellness Retreat"
      />
      <RetreatHero />
    </>
  );
}
