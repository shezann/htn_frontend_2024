import { useEffect, useState } from "react";
import { TEvent, TEndpointResponse } from "../utils/types";
import { request, gql } from "graphql-request";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

const EventsTable = () => {
  const [events, setEvents] = useState<TEvent[]>([]);

  // function to return the name of the event given the event id
  const getEventName = (id: number) => {
    const event = events.find((event) => event.id === id);
    return event ? event.name : "";
  };

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

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Id</Th>
          <Th>Name</Th>
          <Th>Type</Th>
          <Th>Start Time</Th>
          <Th>End Time</Th>
          <Th>Description</Th>
          <Th>Speakers</Th>
          <Th>Related Events</Th>
          <Th>Open To</Th>
        </Tr>
      </Thead>
      <Tbody>
        {events.map((event) => (
          <Tr key={event.id}>
            <Td>{event.id}</Td>
            <Td>{event.name}</Td>
            <Td>{event.event_type}</Td>
            <Td>{new Date(event.start_time).toLocaleString()}</Td>
            <Td>{new Date(event.end_time).toLocaleString()}</Td>
            <Td>{event.description}</Td>
            <Td>{event.speakers.map((speaker) => speaker.name).join(", ")}</Td>
            {<Td>{event.related_events.join(", ")}</Td>}
            <Td>
              {event.related_events.map((id) => getEventName(id)).join(", ")}
            </Td>
            <Td>{event.permission}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
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
