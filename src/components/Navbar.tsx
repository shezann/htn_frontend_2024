import "./Navbar.css";
import { Text, Button } from "@chakra-ui/react";

const Navbar = () => {
  return (
    <>
      <nav className="navbar">
        <Text fontSize="3xl" fontWeight="bold">
          Events
        </Text>
        <Button
          colorScheme="blue"
          variant="solid"
          borderRadius="0"
          bg="gray.800"
          color="white"
        >
          Button
        </Button>
      </nav>
      <div className="navbar-border"></div>
    </>
  );
};

export default Navbar;
