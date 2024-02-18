import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { request, gql } from "graphql-request";
import { useAuth } from "../context/AuthContext";
import { Box, Text, Link, VStack } from "@chakra-ui/react";
import "./EventDetails.css";

const EventDetails = () => {
  const { user } = useAuth();
  let { id } = useParams();
  id = parseFloat(id);
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  const eventTypeDisplay = (eventType) => {
    switch (eventType) {
      case "workshop":
        return "Workshop";
      case "activity":
        return "Activity";
      case "tech_talk":
        return "Tech Talk";
      default:
        return eventType;
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      const url = `https://api.hackthenorth.com/v3/graphql`;
      try {
        const data = await request(url, get_event, { id });
        if (data.sampleEvent.permission === "private" && !user) {
          navigate("/");
        } else {
          setEvent({
            ...data.sampleEvent,
            event_type: eventTypeDisplay(data.sampleEvent.event_type),
          });
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEvent();
  }, [id, user, navigate]);

  if (!event) return <Box>Loading...</Box>;

  return (
    <div className="container">
      <VStack spacing={4} align="start">
        <Text fontSize="4xl" fontWeight="bold">
          {event.name}
        </Text>
        <Text fontSize="lg">
          <strong>Type:</strong> {event.event_type}
        </Text>
        <Text fontSize="lg">
          <strong>Start Time:</strong>
          {new Date(event.start_time).toLocaleString()}
        </Text>
        <Text fontSize="lg">
          <strong>End Time:</strong> {new Date(event.end_time).toLocaleString()}
        </Text>
        <Text fontSize="lg">
          <strong>Description:</strong> {event.description}
        </Text>
        {event.public_url && (
          <Text fontSize="lg">
            <strong>Public URL:</strong>
            <Link href={event.public_url} isExternal color="blue.500">
              {event.public_url}
            </Link>
          </Text>
        )}
        {user && event.private_url && (
          <Text fontSize="lg">
            <strong>Private URL:</strong>
            <Link href={event.private_url} isExternal color="blue.500">
              {event.private_url}
            </Link>
          </Text>
        )}
      </VStack>
    </div>
  );
};

const get_event = gql`
  query getEvent($id: Float!) {
    sampleEvent(id: $id) {
      id
      name
      event_type
      permission
      start_time
      end_time
      description
      public_url
      private_url
    }
  }
`;

export default EventDetails;
