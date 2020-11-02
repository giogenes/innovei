import axios from "axios";
import ContentLoadingTable from "./common/contentLoadingTable";
import React, { useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";

const Units = () => {
  const [units, setUnits] = useState(() => []);
  const [isTableLoading, setIsTableLoading] = useState(() => true);

  const getUnits = async () => {
    try {
      const { data } = await axios.get("/api/units");
      setUnits(() => data);
      setIsTableLoading(() => false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUnits();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Part Number",
        accessor: "partNumber", // accessor is the "key" in the data
      },
      {
        Header: "Serial Number",
        accessor: "serialNumber",
      },
      {
        Header: "Type",
        accessor: "ticketType",
      },
      {
        Header: "Location",
        accessor: "location",
      },
      {
        Header: "Pallet",
        accessor: "pallet",
      },
    ],
    []
  );

  const data = React.useMemo(() => {
    const unitData = units.map((unit) => ({
      partNumber: unit.unit_type.pn,
      serialNumber: unit.sn,
      ticketType: unit.ticket.ticket_type.name,
      location: unit.location.name,
      pallet: unit.pallet.name,
    }));

    console.log(unitData);
    return unitData;
  }, [units]);

  const tableInstance = useTable({ columns, data }, useSortBy);
  console.log(tableInstance);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    <div className="">
      <div className="flex flex-col items-center">
        <div className="w-11/12 mt-10 mb-10">
          <h1 className="text-gray-900 font-semibold text-3xl ">Units</h1>
        </div>
        {isTableLoading && (
          <div className="w-11/12 bg-white border-2 border-gray-300" style={{ height: "300px" }}>
            <ContentLoadingTable className="w-full" />
          </div>
        )}
        {!isTableLoading && (
          <div className="w-11/12 bg-white border-2 border-gray-300">
            {/* <table className="table-auto w-full p-5">
              <thead>
                <tr>
                  <th className="border-b w-1/6 px-4 py-2">Part Number</th>
                  <th className="border-b w-1/3 px-4 py-2">Serial Number</th>
                  <th className="border-b w-1/6 px-4 py-2">Type</th>
                  <th className="border-b w-1/6 px-4 py-2">Location</th>
                  <th className="border-b w-1/6 px-4 py-2">Pallet</th>
                </tr>
              </thead>
              <tbody>
                {units.map((unit) => (
                  <tr key={unit.id}>
                    <td className="border-b px-4 py-2">{unit.unit_type.pn}</td>
                    <td className="border-b px-4 py-2">{unit.sn}</td>
                    <td className="border-b px-4 py-2">{unit.ticket.ticket_type.name}</td>
                    <td className="border-b px-4 py-2">{unit.location.name}</td>
                    <td className="border-b px-4 py-2">{unit.pallet.name}</td>
                  </tr>
                ))}
              </tbody>
            </table> */}

            <table className="table-auto w-full p-5" {...getTableProps()}>
              <thead>
                {
                  // Loop over the header rows
                  headerGroups.map((headerGroup) => (
                    // Apply the header row props
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {
                        // Loop over the headers in each row
                        headerGroup.headers.map((column) => (
                          // Apply the header cell props
                          <th
                            className="border-b w-1/6 px-4 py-2"
                            {...column.getHeaderProps(column.getSortByToggleProps())}
                          >
                            {
                              // Render the header
                              column.render("Header")
                            }
                            <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                          </th>
                        ))
                      }
                    </tr>
                  ))
                }
              </thead>
              {/* Apply the table body props */}
              <tbody {...getTableBodyProps()}>
                {
                  // Loop over the table rows
                  rows.map((row) => {
                    // Prepare the row for display
                    prepareRow(row);
                    return (
                      // Apply the row props
                      <tr {...row.getRowProps()}>
                        {
                          // Loop over the rows cells
                          row.cells.map((cell) => {
                            // Apply the cell props
                            return (
                              <td className="border-b px-4 py-2" {...cell.getCellProps()}>
                                {
                                  // Render the cell contents
                                  cell.render("Cell")
                                }
                              </td>
                            );
                          })
                        }
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Units;
