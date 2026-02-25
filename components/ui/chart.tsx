// "use client";

// import * as React from "react";
// import {
//   ResponsiveContainer,
//   Tooltip,
//   Legend,
//   type TooltipContentProps,
//   // type ValueType,
//   // type NameType,
//   type LegendProps,
//   // type Payload,
// } from "recharts";

// import { cn } from "@/lib/utils";

// /* ---------------------------------- */
// /* Theme */
// /* ---------------------------------- */

// const THEMES = { light: "", dark: ".dark" } as const;

// /* ---------------------------------- */
// /* Types */
// /* ---------------------------------- */

// export type ChartConfig = {
//   [k in string]: {
//     label?: React.ReactNode;
//     icon?: React.ComponentType;
//   } & ({ color?: string; theme?: never } | { color?: never; theme: Record<keyof typeof THEMES, string> });
// };

// type ChartContextProps = {
//   config: ChartConfig;
// };

// const ChartContext = React.createContext<ChartContextProps | null>(null);

// function useChart() {
//   const context = React.useContext(ChartContext);
//   if (!context) {
//     throw new Error("useChart must be used within a <ChartContainer />");
//   }
//   return context;
// }

// /* ---------------------------------- */
// /* Chart Container */
// /* ---------------------------------- */

// const ChartContainer = React.forwardRef<
//   HTMLDivElement,
//   React.ComponentProps<"div"> & {
//     config: ChartConfig;
//     children: React.ComponentProps<typeof ResponsiveContainer>["children"];
//   }
// >(({ id, className, children, config, ...props }, ref) => {
//   const uniqueId = React.useId();
//   const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

//   return (
//     <ChartContext.Provider value={{ config }}>
//       <div
//         ref={ref}
//         data-chart={chartId}
//         className={cn(
//           "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
//           className
//         )}
//         {...props}
//       >
//         <ChartStyle id={chartId} config={config} />
//         <ResponsiveContainer>{children}</ResponsiveContainer>
//       </div>
//     </ChartContext.Provider>
//   );
// });
// ChartContainer.displayName = "Chart";

// /* ---------------------------------- */
// /* Chart Style */
// /* ---------------------------------- */

// const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
//   const colorConfig = Object.entries(config).filter(([, item]) => item.color || item.theme);

//   if (!colorConfig.length) return null;

//   return (
//     <style
//       dangerouslySetInnerHTML={{
//         __html: Object.entries(THEMES)
//           .map(
//             ([theme, prefix]) => `
// ${prefix} [data-chart=${id}] {
// ${colorConfig
//   .map(([key, item]) => {
//     const color = item.theme?.[theme as keyof typeof item.theme] || item.color;
//     return color ? `  --color-${key}: ${color};` : null;
//   })
//   .filter(Boolean)
//   .join("\n")}
// }
// `
//           )
//           .join("\n"),
//       }}
//     />
//   );
// };

// /* ---------------------------------- */
// /* Tooltip */
// /* ---------------------------------- */

// const ChartTooltip = Tooltip;

// // type ChartTooltipContentProps = TooltipContentProps<ValueType, NameType> &
// //   React.ComponentProps<"div"> & {
// //     hideLabel?: boolean;
// //     hideIndicator?: boolean;
// //     indicator?: "line" | "dot" | "dashed";
// //     nameKey?: string;
// //     labelKey?: string;
// //   };

// const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
//   (
//     {
//       active,
//       payload,
//       label,
//       className,
//       indicator = "dot",
//       hideLabel = false,
//       hideIndicator = false,
//       labelFormatter,
//       labelClassName,
//       formatter,
//       color,
//       nameKey,
//       labelKey,
//     },
//     ref
//   ) => {
//     const { config } = useChart();

//     if (!active || !payload?.length) return null;

//     // eslint-disable-next-line react-hooks/rules-of-hooks
//     const tooltipLabel = React.useMemo(() => {
//       if (hideLabel) return null;

//       const item = payload[0];
//       const key = `${labelKey || item.dataKey || item.name || "value"}`;
//       const itemConfig = getPayloadConfig(config, item, key);

//       const value = typeof label === "string" ? config[label]?.label || label : itemConfig?.label;

//       if (!value) return null;

//       return labelFormatter ? (
//         <div className={cn("font-medium", labelClassName)}>{labelFormatter(value, payload)}</div>
//       ) : (
//         <div className={cn("font-medium", labelClassName)}>{value}</div>
//       );
//     }, [payload, label, hideLabel, labelFormatter, labelClassName, config, labelKey]);

//     const nestLabel = payload.length === 1 && indicator !== "dot";

//     return (
//       <div
//         ref={ref}
//         className={cn(
//           "grid min-w-[8rem] gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
//           className
//         )}
//       >
//         {!nestLabel && tooltipLabel}
//         <div className="grid gap-1.5">
//           {payload.map((item, index) => {
//             const key = `${nameKey || item.name || item.dataKey || "value"}`;
//             const itemConfig = getPayloadConfig(config, item, key);
//             const indicatorColor = color || item.color;

//             return (
//               <div
//                 key={item.dataKey ?? index}
//                 className={cn("flex items-center gap-2", indicator !== "dot" && "items-start")}
//               >
//                 {!hideIndicator && (
//                   <div
//                     className={cn("shrink-0 rounded-sm", {
//                       "h-2.5 w-2.5": indicator === "dot",
//                       "w-1 h-full": indicator === "line",
//                       "w-0 h-full border border-dashed": indicator === "dashed",
//                     })}
//                     style={{
//                       backgroundColor: indicator === "dot" || indicator === "line" ? indicatorColor : undefined,
//                       borderColor: indicatorColor,
//                     }}
//                   />
//                 )}

//                 <div className="flex flex-1 justify-between">
//                   <div className="grid gap-1">
//                     {nestLabel && tooltipLabel}
//                     <span className="text-muted-foreground">{itemConfig?.label || item.name}</span>
//                   </div>
//                   {item.value != null && (
//                     <span className="font-medium tabular-nums">
//                       {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   }
// );
// ChartTooltipContent.displayName = "ChartTooltip";

// /* ---------------------------------- */
// /* Legend */
// /* ---------------------------------- */

// const ChartLegend = Legend;

// const ChartLegendContent = React.forwardRef<
//   HTMLDivElement,
//   React.ComponentProps<"div"> &
//     Pick<LegendProps, "payload" | "verticalAlign"> & {
//       hideIcon?: boolean;
//       nameKey?: string;
//     }
// >(({ className, payload, verticalAlign = "bottom", hideIcon, nameKey }, ref) => {
//   const { config } = useChart();

//   if (!payload?.length) return null;

//   return (
//     <div
//       ref={ref}
//       className={cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className)}
//     >
//       {payload.map((item) => {
//         const key = `${nameKey || item.dataKey || "value"}`;
//         const itemConfig = getPayloadConfig(config, item, key);

//         return (
//           <div key={item.value} className="flex items-center gap-1.5">
//             {itemConfig?.icon && !hideIcon ? (
//               <itemConfig.icon />
//             ) : (
//               <div className="h-2 w-2 rounded-sm" style={{ backgroundColor: item.color }} />
//             )}
//             {itemConfig?.label}
//           </div>
//         );
//       })}
//     </div>
//   );
// });
// ChartLegendContent.displayName = "ChartLegend";

// /* ---------------------------------- */
// /* Helpers */
// /* ---------------------------------- */

// function getPayloadConfig(config: ChartConfig, payload: Payload<ValueType, NameType>, key: string) {
//   const data = typeof payload.payload === "object" && payload.payload !== null ? payload.payload : undefined;

//   const resolvedKey =
//     (data && typeof data[key] === "string" && data[key]) ||
//     (typeof payload[key as keyof typeof payload] === "string" ? (payload[key as keyof typeof payload] as string) : key);

//   return config[resolvedKey] ?? config[key];
// }

// /* ---------------------------------- */

// export { ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent };
