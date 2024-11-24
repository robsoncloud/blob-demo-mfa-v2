export interface RequestEntity {
    partitionKey: string; // Ex: location
    rowKey: string;       // Ex: ticket
    ticket: string;
    hostname: string;
    location: string;
    type: "laptop" | "vdi" | "workstation"; // Enum simulation
    status: "ready" | "assigned" | "inprogress" | "failed" | "completed"; // Enum simulation
    downloadFile: string;
    createdDate: string; // ISO string for Date
  }
  