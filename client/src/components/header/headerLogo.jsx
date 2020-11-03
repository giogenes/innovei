import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const HeaderLogo = () => {
  return (
    <div
      className="z-30 fixed top-0 w-1/6 md:w-1/4 lg:w-1/6 bg-blue-800 md:bg-blue-900 flex flex-row items-center"
      style={{ height: "64px" }}
    >
      <img
        className="h-6 pl-4 pr-4 hidden md:block "
        src="https://res.cloudinary.com/djuytm4lm/image/upload/v1599078148/innovei_sideways_mono_wn9p9c.svg"
        alt=""
      />
      <FontAwesomeIcon icon={faBars} color="white" className="ml-5 block md:hidden" size="2x" />
    </div>
  );
};

export default HeaderLogo;
