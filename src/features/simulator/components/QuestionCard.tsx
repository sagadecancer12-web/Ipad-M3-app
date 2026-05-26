import { useState } from "react";

interface Props {
  question: string;
  options: string[];
  answer: string;
}

export default function QuestionCard({
  question,
  options,
  answer,
}: Props) {
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState(false);

  function handleCheck(option: string) {
    setSelected(option);
    setChecked(true);
  }

  return (
    <div
      className="
        border
        border-neutral-800
        rounded-xl
        p-5
        bg-neutral-900
        space-y-4
      "
    >
      <h2 className="text-lg font-semibold text-white">
        {question}
      </h2>

      <div className="space-y-2">
        {options.map((option) => {
          const isCorrect = option === answer;
          const isSelected = option === selected;

          return (
            <button
              key={option}
              onClick={() => handleCheck(option)}
              className={`
                w-full
                text-left
                p-3
                rounded-lg
                transition
                border

                ${
                  checked && isCorrect
                    ? "border-emerald-500 bg-emerald-900/30"
                    : checked && isSelected
                    ? "border-red-500 bg-red-900/30"
                    : "border-neutral-700 bg-neutral-800"
                }
              `}
            >
              {option}
            </button>
          );
        })}
      </div>

      {checked && (
        <div className="text-sm text-neutral-400">
          Respuesta correcta:{" "}
          <span className="text-emerald-400">
            {answer}
          </span>
        </div>
      )}
    </div>
  )
}