import React from "react";

import { faHome, faBoxOpen, faTags, faUserFriends, faCog } from "@fortawesome/free-solid-svg-icons";
import SidebarLink from "./sidebarLink";

const Sidebar = () => {
  return (
    <div
      className="hidden md:block fixed md:w-1/4 lg:w-1/6 top-0 h-full bg-gray-100 border-r-2 border-gray-300"
      style={{ marginTop: "64px" }}
    >
      <div className="h-full flex-col flex justify-between" style={{ paddingBottom: "64px" }}>
        <div className="pt-3 pl-2 pr-2 flex flex-col">
          <SidebarLink to="/home" icon={faHome} title="Home" />
          <SidebarLink to="/units" icon={faBoxOpen} title="Units" />
          <SidebarLink to="/tickets" icon={faTags} title="Tickets" />
          <SidebarLink to="/customers" icon={faUserFriends} title="Customers" />
        </div>
        <div className="pb-3 pl-2 pr-2 flex flex-col">
          <SidebarLink to="/settings" icon={faCog} title="Settings" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
