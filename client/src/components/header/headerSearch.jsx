import React, { useState } from "react";

const HeaderSearch = () => {
  const [isFocused, setIsFocused] = useState(() => {
    return false;
  });

  const styleSearchBox = () => {
    if (isFocused)
      return "z-20 overflow-y-scroll transition duration-500 w-2/3 h-48 rounded-sm border-grey-200 border-2 bg-white mt-2";
    return "z-20 overflow-scroll hidden focus:block transition duration-500 w-2/3 h-48 rounded-sm border-grey-200 border-2 bg-white mt-2";
  };

  const styleBackgroundDiv = () => {
    if (isFocused) return "fixed w-screen h-screen bg-gray-900 opacity-25 z-10";
    return "transition duration-500 hidden fixed w-screen h-screen bg-gray-900 opacity-25 z-10";
  };

  return (
    <div className="z-20 ml-1/6 md:ml-1/4 lg:ml-1/6 w-2/3 md:w-2/3 fixed top-0 bg-blue-800" style={{ height: "64px" }}>
      <div className="flex flex-col items-center ">
        <input
          className="transition duration-500 text-white focus:text-black ease-in-out bg-blue-700 focus:bg-white focus:outline-none focus:shadow-outline mt-4 py-1 px-2 rounded-sm appearance-none leading-normal w-2/3"
          type="email"
          placeholder="Search"
          onFocus={() =>
            setIsFocused(() => {
              return true;
            })
          }
        />

        <div
          className={styleBackgroundDiv()}
          onClick={() =>
            setIsFocused(() => {
              return false;
            })
          }
          style={{ marginTop: "64px" }}
        ></div>

        <div
          onClick={() =>
            setIsFocused(() => {
              return true;
            })
          }
          className={styleSearchBox()}
        >
          <p>
            Lorem ipsum dolor sit amet, accusam commune invenire te mea, eam veritus periculis at, vix partem doming
            qualisque eu. Id has equidem denique, his te iriure quaeque evertitur. Mucius omittantur et ius, pri malis
            exerci officiis ea. Ad mucius tractatos vel, an falli bonorum usu. Pro qualisque efficiendi ea. Dico numquam
            sea eu, conceptam conclusionemque at sit. In qui exerci scriptorem. An est odio perfecto partiendo, no
            nonumes repudiare mei. At eum vide possit meliore, his vocibus suscipit salutandi in. Falli quodsi vocibus
            no quo, ex commodo feugait ius. Laudem probatus laboramus mel et. Vis no sonet tation laudem, eu nam
            adipisci indoctum, nisl audire feugiat duo te. Cum ei aliquando moderatius, vix nihil iriure veritus in,
            mazim invidunt pro te. No sed quot dicat liber. Ne accusam placerat dissentiet usu, at insolens qualisque
            dissentiet ius, no usu bonorum appareat. Usu vitae accusamus ut, eum ut quando mentitum. Nam at habeo
            argumentum scriptorem, eu fabulas veritus senserit nec. Reque euripidis ullamcorper ad usu. Nibh propriae
            disputationi ad per, laudem discere eloquentiam no nec, vero adhuc lobortis ex nec. Consul graecis vis ad,
            equidem pericula eos ea. Ex eam ubique corpora. Debet similique cum id, sea modus graece constituam an.
            Illum inimicus duo te, vix ut tritani assentior. Sumo ullum iriure at nam, eum ea apeirian reprimique
            reformidans. Ad efficiendi consequuntur mea, vitae ignota no per. Eos id saepe dignissim prodesset, cu mel
            prima prompta, sit in integre{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeaderSearch;
