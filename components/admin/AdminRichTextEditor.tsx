"use client";

import { Editor } from "@tinymce/tinymce-react";

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
        className="min-h-[150px] w-full rounded-md border border-[#dfe2df] bg-white px-3 py-2.5 text-sm text-[#1a1d20] outline-none focus:border-[#9a7653]"
      />
    );
  }

  return (
    <Editor
      value={value}
      apiKey={apiKey}
      onEditorChange={onChange}
      init={{
        height: 180,
        menubar: false,
        plugins: "lists",
        toolbar:
          "undo redo | alignleft aligncenter alignright | bold italic | bullist numlist",
        statusbar: false,
        branding: false,
        promotion: false,
        content_style:
          "body { font-family: Arial, sans-serif; font-size: 14px; color: #1a1d20; background: #fff; margin: 12px; }",
      }}
    />
  );
}
