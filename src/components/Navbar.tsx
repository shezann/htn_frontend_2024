import { useNavigate } from "react-router-dom";
import { Text, Button, Tooltip, Input } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (user) {
      logout();
      window.location.reload();
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <nav className="navbar">
        <Text fontSize="3xl" fontWeight="bold">
          Events
        </Text>
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search events"
          size="md"
          width="auto"
          ml="2"
        />
        <Tooltip label={user ? "Logout" : "Login for more events"}>
          <Button
            onClick={handleAuthClick}
            colorScheme="blue"
            variant="solid"
            bg="gray.800"
            color="white"
          >
            {user ? "Logout" : "Login"}
          </Button>
        </Tooltip>
      </nav>
      <div className="navbar-border"></div>
    </>
  );
};

export default Navbar;
