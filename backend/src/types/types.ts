interface Project {
  id: string;
  clientId?: string;
  name: string;
  description: string;
  status: "In Progress" | "Completed" | "On Hold" | "Cancelled";
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export { Project, Client };
