import "./EventsTable.css";
import { useEffect, useState, useMemo } from "react";
import { request, gql } from "graphql-request";
import { TEvent, TEndpointResponse } from "../utils/types";
import { useTable, useSortBy } from "react-table";
import { Table, Thead, Tbody, Tr, Th, Td, Box } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

const EventsTable = () => {
  const [events, setEvents] = useState<TEvent[]>([]);

  const url = "https://api.hackthenorth.com/v3/graphql";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await request<TEndpointResponse>(url, get_events);
        setEvents(data.sampleEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchData();
  }, []);

  const handleRowClick = (id: Number) => {
    console.log("Row clicked", id);
  };

  const eventTypeDisplay = (eventType: string) => {
    switch (eventType) {
      case "workshop":
        return "Workshop";
      case "activity":
        return "Activity";
      case "tech_talk":
        return "Tech Talk";
      default:
        return "";
    }
  };

  const data = useMemo(() => events, [events]);

  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Type",
        accessor: (row) => eventTypeDisplay(row.event_type),
      },
      {
        Header: "Start Time",
        accessor: (row) => new Date(row.start_time).toISOString(),
        Cell: ({ value }) =>
          new Intl.DateTimeFormat("en", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }).format(new Date(value)),
      },
      {
        Header: "End Time",
        accessor: (row) => new Date(row.end_time).toISOString(),
        Cell: ({ value }) =>
          new Intl.DateTimeFormat("en", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }).format(new Date(value)),
      },
      {
        Header: "Speakers",
        accessor: (row) =>
          row.speakers.map((speaker) => speaker.name).join(", "),
      },
      {
        Header: "Status",
        accessor: "permission",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  return (
    <div className="tableContainer">
      <Table className="eventsTable" {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <Box as="span" ml="2">
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <TriangleDownIcon aria-label="sorted descending" />
                      ) : (
                        <TriangleUpIcon aria-label="sorted ascending" />
                      )
                    ) : (
                      ""
                    )}
                  </Box>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </div>
  );
};

const get_events = gql`
  query {
    sampleEvents {
      id
      name
      event_type
      permission
      start_time
      end_time
      description
      speakers {
        name
      }
      public_url
      private_url
      related_events
    }
  }
`;

export default EventsTable;
