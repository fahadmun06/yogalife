import WorkoutDetails from "@/components/premium-user-componenets/WorkoutDetails";

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/workouts/${id}`,
      {
        next: { revalidate: 3600 },
      },
    );
    const data = await res.json();

    if (data?.data) {
      return {
        title: data.data.title,
        description: data.data.description?.substring(0, 160),
        openGraph: {
          title: data.data.title,
          description: data.data.description?.substring(0, 160),
          images: [data.data.thumbnailUrl || "/apple-icon.png"],
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }

  return {
    title: "Workout Details",
    description: "View and follow along with this premium workout.",
  };
}

export default function Page() {
  return <WorkoutDetails />;
}
