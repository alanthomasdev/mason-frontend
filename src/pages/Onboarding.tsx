import { useState } from "react";

function Onboarding({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Step 1: Add a Note",
      description: "Click the 'Add Note' button on the dashboard to start creating your first note.",
      image: "https://images.pexels.com/photos/3278757/pexels-photo-3278757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // 📸 Put your image in `public/images`
    },
    {
      title: "Step 2: Summarize Your Content",
      description: "After writing your content, click 'Summarize' to auto-generate a summary and tags using AI.",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      title: "Step 3: Edit and Organize",
      description: "You can always edit your notes later and manage tags to keep everything organized.",
      image: "https://images.pexels.com/photos/29645160/pexels-photo-29645160/free-photo-of-digital-artist-using-tablet-and-stylus-pen.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed  inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white max-w-[70vw] p-6 rounded-lg text-center shadow-lg">
        <h2 className="text-xl font-bold mb-2">{steps[step].title}</h2>
        <p className="mb-4">{steps[step].description}</p>
        <img

          src={steps[step].image}
          alt={`Onboarding step ${step + 1}`}
          className="mb-4 mx-auto rounded border h-[300px] w-full object-cover"
        />
        <button
          onClick={handleNext}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {step === steps.length - 1 ? "Got it!" : "Next"}
        </button>
      </div>
    </div>
  );
}

export default Onboarding;
