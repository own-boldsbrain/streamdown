import type { FC } from 'react';

export type GenericAgentReportProps = { data?: unknown };

export const AnomalyReport: FC<GenericAgentReportProps> = ({ data }) => {
  return (
  <div className="border rounded-md p-4 text-sm" data-component="AnomalyReport">
      <h3 className="mb-2 font-semibold">Anomaly Report</h3>
      <pre className="whitespace-pre-wrap break-words text-xs opacity-80">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
export default AnomalyReport;
