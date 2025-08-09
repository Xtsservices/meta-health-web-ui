import React from "react";
import WardDetails from "./WardDetails";
import { Ward } from "../../../types";

interface DynamicWardRendererProps {
  activeTabId: string | null;
  wards: Ward[];
}

const DynamicWardRenderer: React.FC<DynamicWardRendererProps> = ({
  activeTabId,
  wards,
}) => {

  return <WardDetails wardId={activeTabId} wards={wards} />;
};

export default DynamicWardRenderer;
