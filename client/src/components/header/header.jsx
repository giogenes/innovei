import React, { Fragment } from "react";
import HeaderLogo from "./headerLogo";
import HeaderSearch from "./headerSearch";
import HeaderAccount from "./headerAccount";

const Header = () => {
  return (
    <Fragment>
      <HeaderLogo />
      <HeaderSearch />
      <HeaderAccount />
    </Fragment>
  );
};

export default Header;
