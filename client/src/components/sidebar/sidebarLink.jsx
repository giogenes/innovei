import React from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SidebarLink = ({ to, icon, title }) => {
  return (
    <Link to={to} className="rounded-1 bg-gray-100 hover:bg-gray-200 h-10 m-1">
      <div className="flex flex-row items-start pl-3 pt-1">
        <FontAwesomeIcon size="lg" color="#718096" className="mt-1" icon={icon} />
        <span className="font-semibold text-lg text-gray-600 pl-3">{title}</span>
      </div>
    </Link>
  );
};

export default SidebarLink;
