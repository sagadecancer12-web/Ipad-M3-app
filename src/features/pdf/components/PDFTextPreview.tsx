interface Props {
    title: string;
    text: string;
  }
  
  export default function PDFTextPreview({
    title,
    text,
  }: Props) {
    return (
      <div
        className="
          border
          border-neutral-800
          rounded-xl
          bg-neutral-950
          p-4
          h-full
          overflow-y-auto
        "
      >
        <h2 className="text-sm text-amber-400 mb-4">
          {title}
        </h2>
  
        <div
          className="
            text-sm
            text-neutral-300
            whitespace-pre-wrap
            leading-6
          "
        >
          {text}
        </div>
      </div>
    );
  }