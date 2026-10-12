"use client";

import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((module) => module.Editor),
  { ssr: false },
);

export default function AdminRichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY ?? "";

  if (!apiKey) {
    return (
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[250px] w-full rounded-md border border-[#dfe2df] bg-white px-3 py-2.5 text-sm text-[#1a1d20] outline-none focus:border-[#9a7653]"
      />
    );
  }

  return (
    <Editor
      value={value}
      apiKey={apiKey}
      onEditorChange={onChange}
      init={{
        height: 250,
        menubar: false,
        plugins: "lists",
        toolbar:
          "undo redo | alignleft aligncenter alignright | bold italic | bullist numlist",
        statusbar: false,
        branding: false,
        promotion: false,
        content_style:
          "body { font-family: 'Noto Sans', Arial, sans-serif; font-size: 14px; color: #1a1d20; background: #fff; margin: 12px; }",
      }}
    />
  );
}
