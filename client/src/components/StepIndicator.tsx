import { CheckIcon } from "@heroicons/react/24/solid";
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

interface StepIndicatorProps {
  currentStep: number;
  hasUploadedSchema?: boolean;
}

const steps = [
  {
    id: 1,
    name: "Upload Schema",
    description: "Upload your database schema",
    icon: DocumentTextIcon,
  },
];

export default function StepIndicator({
  currentStep,
  hasUploadedSchema = false,
}: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, stepIdx) => {
          const isCurrentStep = currentStep === step.id;
          const isCompleted =
            (hasUploadedSchema && step.id === 1) || currentStep > step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`
                    relative flex h-10 w-10 items-center justify-center rounded-full border-2
                    ${
                      isCompleted
                        ? "bg-blue-600 border-blue-600"
                        : isCurrentStep
                        ? "bg-white border-blue-600"
                        : "bg-white border-gray-300"
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckIcon className="h-6 w-6 text-white" />
                  ) : (
                    <step.icon
                      className={`h-5 w-5 ${
                        isCurrentStep ? "text-blue-600" : "text-gray-400"
                      }`}
                    />
                  )}
                </div>

                {/* Step info */}
                <div className="ml-4">
                  <div
                    className={`text-sm font-medium ${
                      isCompleted
                        ? "text-blue-600"
                        : isCurrentStep
                        ? "text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {step.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {step.description}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
