"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export type Tab = {
  title: string;
  value: string;
  content?: ReactNode;
};

/** Alias cho code cũ (DesktopCenterPanel) */
export type TabItem = Tab & { content: ReactNode };

function orderTabsWithDefault(tabs: Tab[], defaultValue?: string): Tab[] {
  if (!tabs.length) return [];
  if (!defaultValue) return [...tabs];
  const i = tabs.findIndex((t) => t.value === defaultValue);
  if (i <= 0) return [...tabs];
  const copy = [...tabs];
  const [sel] = copy.splice(i, 1);
  copy.unshift(sel);
  return copy;
}

function tabValuesSignature(tabs: Tab[]) {
  return tabs.map((t) => t.value).join("|");
}

export const FadeInDiv = ({
  className,
  tabs,
  hovering,
  motionLayoutIdPrefix = "stack",
}: {
  className?: string;
  tabs: Tab[];
  hovering?: boolean;
  motionLayoutIdPrefix?: string;
}) => {
  const isActive = (tab: Tab) => tab.value === tabs[0]?.value;
  const prefix = motionLayoutIdPrefix;

  return (
    <div className="relative h-full min-h-[280px] w-full md:min-h-[360px]">
      {tabs.map((tab, idx) => (
        <motion.div
          key={tab.value}
          layoutId={`${prefix}-card-${tab.value}`}
          style={{
            scale: 1 - idx * 0.1,
            top: hovering ? idx * -50 : 0,
            zIndex: -idx,
            opacity: idx < 3 ? 1 - idx * 0.1 : 0,
          }}
          animate={{
            y: isActive(tab) ? [0, 40, 0] : 0,
          }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={cn("absolute left-0 top-0 h-full w-full overflow-y-auto overflow-x-hidden", className)}
        >
          {tab.content}
        </motion.div>
      ))}
    </div>
  );
};

export const Tabs = ({
  tabs: propTabs,
  defaultValue,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
  className,
  /** false = nội dung dài (dashboard): một cột cuộn, không xếp chồng 3D */
  contentStacked = true,
  /** Tránh trùng layoutId khi nhiều Tabs trên cùng trang */
  motionLayoutId = "tabs",
}: {
  tabs: Tab[];
  defaultValue?: string;
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
  className?: string;
  contentStacked?: boolean;
  motionLayoutId?: string;
}) => {
  const initial = orderTabsWithDefault(propTabs, defaultValue)[0]?.value ?? propTabs[0]?.value ?? "";
  const [selectedValue, setSelectedValue] = useState<string>(initial);

  const sig = tabValuesSignature(propTabs);

  useEffect(() => {
    if (!propTabs.length) return;
    setSelectedValue((prev) => {
      const stillValid = propTabs.some((t) => t.value === prev);
      if (stillValid) return prev;
      return defaultValue ?? propTabs[0]?.value ?? "";
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chỉ khi `sig` đổi; propTabs trong closure đã khớp
  }, [sig, defaultValue]);

  const tabs = useMemo(() => {
    const sel = propTabs.find((t) => t.value === selectedValue) ?? propTabs[0];
    if (!sel) return [];
    const rest = propTabs.filter((t) => t.value !== sel.value);
    return [sel, ...rest];
  }, [propTabs, selectedValue]);

  const active = tabs[0] ?? propTabs[0];

  const moveSelectedTabToTop = useCallback(
    (idx: number) => {
      const selected = propTabs[idx];
      if (!selected) return;
      setSelectedValue(selected.value);
    },
    [propTabs],
  );

  const [hovering, setHovering] = useState(false);

  if (!propTabs.length) return null;

  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-4", className)}>
      <div
        className={cn(
          "no-visible-scrollbar relative flex max-w-full w-full flex-row items-center justify-start gap-1 overflow-auto [perspective:1000px] sm:overflow-visible sm:gap-1.5",
          containerClassName,
        )}
        role="tablist"
      >
        {propTabs.map((tab, idx) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active.value === tab.value}
            onClick={() => moveSelectedTabToTop(idx)}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={cn("relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium", tabClassName)}
            style={{ transformStyle: "preserve-3d" }}
          >
            {active.value === tab.value && (
              <motion.div
                layoutId={`${motionLayoutId}-pill`}
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className={cn("absolute inset-0 rounded-full bg-neutral-200 dark:bg-zinc-800", activeTabClassName)}
              />
            )}
            <span className="relative block text-neutral-900 dark:text-neutral-100">{tab.title}</span>
          </button>
        ))}
      </div>

      {contentStacked ? (
        <FadeInDiv
          tabs={tabs}
          hovering={hovering}
          motionLayoutIdPrefix={motionLayoutId}
          className={cn("mt-4 md:mt-6", contentClassName)}
        />
      ) : (
        <div
          className={cn(
            "relative w-full min-h-0 min-w-0 flex-1",
            "mt-4 md:mt-5",
            contentClassName,
          )}
        >
          <motion.div
            key={tabs[0]?.value}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex w-full flex-col gap-4"
          >
            {tabs[0]?.content}
          </motion.div>
        </div>
      )}
    </div>
  );
};
