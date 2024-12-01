// import { Request } from "@/model/Request";
// import { ColumnDef } from "@tanstack/react-table";
// import { Button } from "../ui/button";
// import { ArrowUpDown } from "lucide-react";

// export const columns: ColumnDef<Request>[] = [
//     // {
//     //     id: "expander",
//     //     header: () => null,
//     //     cell: ({ row }) => {
//     //         const isExpanded = expandedRows[row.id] || false;

//     //     }
//     // },
//     { accessorKey: "ticket", header: "Ticket" },
//     { accessorKey: "hostname", header: "Hostname" },
//     { accessorKey: "username", header: "Username" },
//     { accessorKey: "location", header: "Location" },
//     { accessorKey: "type", header: "Type" },
//     {
//         accessorKey: "status",
//         // header: () => <div className="font-bold text-gray-800">Status</div>,
//         header: ({ column }) => {
//             return (
//                 <Button
//                     className="font-bold text-gray-800"
//                     variant="ghost"
//                     onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//                 >
//                     Status
//                     <ArrowUpDown className="ml-2 h-4 w-4" />
//                 </Button>
//             )
//         },
//         cell: ({ row }) => {
//             const status = row.getValue("status")
//             if (status == "ready") {
//                 return <div className="font-bold text-blue-600">Ready</div>
//             } else if (status == "assigned") {
//                 return <div className="font-bold text-purple-700">Assigned</div>
//             }
//             else if (status == "failed") {
//                 return <div className="font-bold text-red-500">Failed</div>
//             }
//             else if (status == "inprogress") {
//                 return <div className="font-bold text-yellow-500">In Progress</div>
//             }
//             else if (status == "completed") {
//                 return <div className="font-bold text-green-500">Completed</div>
//             }

//         }
//     },
//     { accessorKey: "createdDate", header: "Created Date" },
// ]