import "./Navbar.css";
import { Text, Button } from "@chakra-ui/react";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Text fontSize="2xl">Events</Text>
      <Button colorScheme="blue">Button</Button>
    </nav>
  );
};

export default Navbar;
