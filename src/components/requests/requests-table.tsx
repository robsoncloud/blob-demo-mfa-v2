
import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table"
import { Button } from "../ui/button"
import { ArrowUpDown, ChevronRightIcon } from "lucide-react"
import { Request } from "@/model/Request";
import { useState } from "react"
import AzureStorageBlobCredential from "@/utils/listContainersAndBlobs"
import { ListTableEntitiesOptions, TableClient } from "@azure/data-tables"
import { useAzureStorageToken } from "@/utils/useAzureStorageToken"

interface DataTableProps<TData> {

    data: TData[]
}


export function DataTable<TData>({

    data,
}: DataTableProps<TData>) {

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
    const [rowDetails, setRowDetails] = useState<Record<string, any>>({});
    const getAccessToken = useAzureStorageToken();
    const fetchDetails = async (rowId: string, partitionKey: string) => {
        try {
            const token = await getAccessToken();

            const options: ListTableEntitiesOptions = {
                queryOptions: {
                    filter: `PartitionKey eq '${partitionKey}' and RowKey ge '001' and RowKey lt '003'`
                }
            };

            const client = new TableClient(
                "https://myownteststterraform.table.core.windows.net/",
                "RequestTable",
                new AzureStorageBlobCredential(token)
            );

            const iterator = client.listEntities(options).byPage();
            const details: any[] = [];
            for await (const entity of iterator) {
                console.log(entity)
                details.push(entity);
            }

            setRowDetails((prev) => ({ ...prev, [rowId]: details }));
            console.log(rowDetails)
        } catch (error) {
            console.error("Error initializing TableClient:", error);
        }
    }

    const columns: ColumnDef<Request>[] = [
        {
            accessorKey: "partitionKey",
            header: () => null,
            cell: ({ row }) => {
                const isExpanded = expandedRows[row.id] || false;
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-0"
                        onClick={async () => {

                            setExpandedRows(prev => ({ ...prev, [row.id]: !isExpanded }))
                            fetchDetails(row.id, row.getValue("partitionKey"))

                        }


                        }
                    >
                        <ChevronRightIcon className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        <span className="sr-only">Toggle details</span>
                    </Button>
                )
            }
        },
        { accessorKey: "ticket", header: "Ticket" },
        { accessorKey: "hostname", header: "Hostname" },
        { accessorKey: "username", header: "Username" },
        { accessorKey: "location", header: "Location" },
        { accessorKey: "type", header: "Type" },
        {
            accessorKey: "status",
            // header: () => <div className="font-bold text-gray-800">Status</div>,
            header: ({ column }) => {
                return (
                    <Button
                        className="font-bold text-gray-800"
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const status = row.getValue("status")
                if (status == "ready") {
                    return <div className="font-bold text-blue-600">Ready</div>
                } else if (status == "assigned") {
                    return <div className="font-bold text-purple-700">Assigned</div>
                }
                else if (status == "failed") {
                    return <div className="font-bold text-red-500">Failed</div>
                }
                else if (status == "inprogress") {
                    return <div className="font-bold text-yellow-500">In Progress</div>
                }
                else if (status == "completed") {
                    return <div className="font-bold text-green-500">Completed</div>
                }

            }
        },
        { accessorKey: "createdDate", header: "Created Date" },
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    })

    return (
        <div className="rounded-md border bg-white/80">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <React.Fragment key={row.id}>
                                <TableRow data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                                {expandedRows[row.id] && (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="p-0">


                                            {rowDetails[row.id] ? (
                                                rowDetails[row.id].map((detail: any[], index: number) => (
                                                    <>

                                                        {detail && detail.length > 0 ? (
                                                            <>
                                                                <div className="p-5 bg-muted grid grid-cols-2">
                                                                    <div>
                                                                        <h4 className="font-semibold mb-2">Computer Details</h4>
                                                                        {
                                                                            detail.map((item: any) => (
                                                                                <>
                                                                                    <p>{item.EntityType}</p>
                                                                                </>
                                                                            ))
                                                                        }
                                                                        <div className="my-6">
                                                                            <h1>progress</h1>
                                                                        </div>

                                                                        <h4 className="font-semibold mt-4 mb-2">Download Information</h4>
                                                                        {
                                                                            detail.filter((item: any) => item.EntityType === "Download").length > 0 ? (
                                                                                detail.filter((item: any) => item.EntityType === "Download").map((item: any) => (
                                                                                    <div className="my-2">
                                                                                        <p>Downloaded by: {item.username} </p>
                                                                                        <p>Download Date: {item.timestamp} </p>
                                                                                    </div>
                                                                                ))
                                                                            ) : (
                                                                                <p>Not downloaded yet</p>
                                                                            )
                                                                        }


                                                                    </div>
                                                                    <div className="flex space-x-2">
                                                                        <h4 className="font-semibold mb-2">Deployments:</h4>
                                                                        <span>{detail.filter((item: any) => item.EntityType === "Deployment").length }</span>
                                                                    </div>
                                                                </div >

                                                            </>) : (
                                                            <div className="p-5 bg-muted text-center">
                                                                <p>No deployment</p>
                                                            </div>)}

                                                    </>

                                                ))
                                            ) : (
                                                <p>Loading... {row.id}</p>
                                            )}



                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

function getAccessToken() {
    throw new Error("Function not implemented.")
}
