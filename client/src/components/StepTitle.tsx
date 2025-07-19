import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

interface StepTitleProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: "primary" | "secondary" | "success";
}

export default function StepTitle({
  title,
  description,
  icon: Icon = DocumentTextIcon,
  variant = "primary",
}: StepTitleProps) {
  const getVariantStyles = () => {
    return {
      circle: "bg-blue-600",
      text: "text-white",
    };
  };

  const styles = getVariantStyles();

  return (
    <div className="mb-2">
      <div className="flex items-start space-x-3">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${styles.circle}`}
        >
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className={`text-base font-semibold ${styles.text} mb-0`}>
            {title}
          </h3>
          <p className="text-xs text-gray-300 leading-none mt-0.5">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
