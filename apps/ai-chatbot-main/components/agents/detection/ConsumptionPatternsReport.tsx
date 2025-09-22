import type { FC } from "react";
export type GenericAgentReportProps = { data?: unknown };
export const ConsumptionPatternsReport: FC<GenericAgentReportProps> = ({
  data,
}) => (
  <div
    className="rounded-md border p-4 text-sm"
    data-component="ConsumptionPatternsReport"
  >
    <h3 className="mb-2 font-semibold">Consumption Patterns</h3>
    <pre className="whitespace-pre-wrap break-words text-xs opacity-80">
      {JSON.stringify(data, null, 2)}
    </pre>
  </div>
);
export default ConsumptionPatternsReport;
