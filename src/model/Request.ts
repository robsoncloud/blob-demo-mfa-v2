import { TableEntity } from "@azure/data-tables";

export interface Request extends TableEntity {
    ticket: string;
    rowKey: string;
    paritionKey: string;
    hostname: string;
    username: string;
    location: string;
    type: "laptop" | "vdi" | "workstation"; // Enum simulation
    status: "ready" | "assigned" | "inprogress" | "failed" | "completed"; // Enum simulation
    downloadFile: string;
    createdDate: string; // ISO string for Date
  }

//   https://learn.microsoft.com/en-us/azure/cosmos-db/table/quickstart-nodejs?toc=https%3A%2F%2Flearn.microsoft.com%2Fen-us%2Fazure%2Fstorage%2Ftables%2Ftoc.json&bc=https%3A%2F%2Flearn.microsoft.com%2Fen-us%2Fazure%2Fbread%2Ftoc.json&pivots=programming-language-ts
  