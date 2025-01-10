import { Button, Link } from "@nextui-org/react";
import React from "react";
import { BiUser } from "react-icons/bi";

export default function MembersPage() {
    return <div>Members Page
        <Button as={Link} href="/" color="primary" variant="bordered" startContent={<p><BiUser /></p>}>Click Me </Button>
    </div>;
}