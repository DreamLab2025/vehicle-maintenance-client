"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";

/**
 * Demo stacked tabs (Magic UI). Đặt `public/linear.webp` để hiện ảnh; nếu không có sẽ dùng placeholder.
 */
export default function TabsDemo() {
  const tabs = [
    {
      title: "Product",
      value: "product",
      content: (
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 to-violet-900 p-10 text-xl font-bold text-white md:text-4xl">
          <p>Product Tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Services",
      value: "services",
      content: (
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 to-violet-900 p-10 text-xl font-bold text-white md:text-4xl">
          <p>Services tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Playground",
      value: "playground",
      content: (
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 to-violet-900 p-10 text-xl font-bold text-white md:text-4xl">
          <p>Playground tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Content",
      value: "content",
      content: (
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 to-violet-900 p-10 text-xl font-bold text-white md:text-4xl">
          <p>Content tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Random",
      value: "random",
      content: (
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 to-violet-900 p-10 text-xl font-bold text-white md:text-4xl">
          <p>Random tab</p>
          <DummyContent />
        </div>
      ),
    },
  ];

  return (
    <div className="relative mx-auto my-24 flex h-[20rem] max-w-5xl w-full flex-col items-start justify-start [perspective:1000px] md:my-32 md:h-[40rem]">
      <Tabs
        tabs={tabs}
        motionLayoutId="tabs-demo"
        contentClassName="!mt-8 md:!mt-10"
      />
    </div>
  );
}

function DummyContent() {
  const [imgOk, setImgOk] = useState(true);

  if (!imgOk) {
    return (
      <div
        aria-hidden
        className="absolute inset-x-0 -bottom-10 mx-auto h-[60%] w-[90%] rounded-xl bg-gradient-to-t from-white/25 to-white/5 ring-1 ring-white/20 md:h-[90%]"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- asset tùy chọn trong /public
    <img
      src="/linear.webp"
      alt=""
      width={1000}
      height={1000}
      onError={() => setImgOk(false)}
      className="absolute inset-x-0 -bottom-10 mx-auto h-[60%] w-[90%] rounded-xl object-cover object-left-top md:h-[90%]"
    />
  );
}
