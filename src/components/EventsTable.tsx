import "./EventsTable.css";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import { useNavigate } from "react-router-dom";
import { request, gql } from "graphql-request";
import { TEvent, TEndpointResponse } from "../utils/types";
import { useTable, useSortBy } from "react-table";
import { Table, Thead, Tbody, Tr, Th, Td, Box } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

const EventsTable = () => {
  const [events, setEvents] = useState<TEvent[]>([]);
  const { searchQuery } = useSearch();

  const [initialSort, setInitialSort] = useState(() => {
    const savedSort = localStorage.getItem("tableSort");
    console.log(savedSort);
    return savedSort
      ? JSON.parse(savedSort)
      : [{ id: "Start Time", desc: false }];
  });

  const user = useAuth();
  const navigate = useNavigate();
  const url = "https://api.hackthenorth.com/v3/graphql";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await request<TEndpointResponse>(url, get_events);
        const filteredEvents = data.sampleEvents.filter(
          (event: TEvent) => event.permission === "public" || user.user !== null
        );
        setEvents(filteredEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("tableSort", JSON.stringify(initialSort));
  }, [initialSort]);

  const handleRowClick = (id: number) => {
    navigate(`/event/${id}`);
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

  const statusDisplay = (status: string) => {
    switch (status) {
      case "public":
        return "Public";
      case "private":
        return "Private";
      default:
        return "";
    }
  };

  const data = useMemo(() => {
    if (!searchQuery) return events;

    return events.filter((event) => {
      return (
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.event_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.speakers.some((speaker) =>
          speaker.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    });
  }, [events, searchQuery]);

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
        accessor: (row) => statusDisplay(row.permission),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { sortBy },
  } = useTable(
    { columns, data, initialState: { sortBy: initialSort } },
    useSortBy
  );

  useEffect(() => {
    if (sortBy !== initialSort) {
      setInitialSort(sortBy);
    }
  }, [sortBy, initialSort]);

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
              <Tr
                {...row.getRowProps({
                  onClick: () => handleRowClick(row.original.id),
                })}
              >
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
