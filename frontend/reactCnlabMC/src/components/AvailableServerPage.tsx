import React, { useState, useEffect } from "react";
import {
  DataGrid,
  DataGridHeader,
  DataGridRow,
  DataGridHeaderCell,
  DataGridBody,
  DataGridCell,
  TableColumnDefinition,
  createTableColumn,
  TableCellLayout,
  makeStyles,
  mergeClasses,
  Button,
} from "@fluentui/react-components";
import { ArrowCounterclockwise20Filled } from "@fluentui/react-icons";
import { Server, items as initialItems } from "./testServerItems";
const url = "http://192.168.1.200:8000";

const useStyles = makeStyles({
  grid: {
    width: "fit-content",
    minWidth: "550px",
    maxWidth: "100%",
    fontSize: "16px",
  },
  cell: {
    display: "flex",
    gap: "10px",
    width: "150px",
  },
  nameCell: {
    width: "250px",
    minWidth: "250px",
    maxWidth: "250px",
  },
  nameHeader: {
    width: "300px",
  },
  running_statusCell: {
    fontWeight: "bold",
    color: "green",
  },
  stopped_statusCell: {
    fontWeight: "bold",
    color: "orange",
  },
});

export const AvailableServerPage: React.FC = () => {
  const localClasses = useStyles();
  const [serverItems, setServerItems] = useState<Server[]>(initialItems);
  const [loading, setLoading] = useState<boolean>(true);
  const fetchServers = async () => {
    try {
      const res = await fetch(`${url}/servers`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const resObj = await res.json();
      console.log("Fetched servers:", resObj);
      setServerItems(resObj.data);
    } catch (error) {
      console.error("Failed to fetch servers:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchServers();
  }, []);
  const columns: TableColumnDefinition<Server>[] = [
    createTableColumn<Server>({
      columnId: "serverId",
      renderHeaderCell: () => {
        return "Server ID";
      },
      renderCell: (item) => {
        return <TableCellLayout>{item.id}</TableCellLayout>;
      },
    }),
    createTableColumn<Server>({
      columnId: "name",
      renderHeaderCell: () => {
        return <div className={localClasses.nameHeader}>Name</div>;
      },
      renderCell: (item) => {
        return (
          <TableCellLayout
            className={mergeClasses(localClasses.cell, localClasses.nameCell)}
          >
            {item.name}
          </TableCellLayout>
        );
      },
    }),
    createTableColumn<Server>({
      columnId: "domainName",
      renderHeaderCell: () => {
        return "Domain Name";
      },
      renderCell: (item) => {
        return <TableCellLayout>{item.domain_name}</TableCellLayout>;
      },
    }),
    createTableColumn<Server>({
      columnId: "port",
      renderHeaderCell: () => {
        return "Port";
      },
      renderCell: (item) => {
        return <TableCellLayout>{item.port}</TableCellLayout>;
      },
    }),
    createTableColumn<Server>({
      columnId: "type",
      renderHeaderCell: () => {
        return "Type";
      },
      renderCell: (item) => {
        return <TableCellLayout>{item.server_type}</TableCellLayout>;
      },
    }),
    createTableColumn<Server>({
      columnId: "status",
      renderHeaderCell: () => {
        return "Status";
      },
      renderCell: (item) => {
        return (
          <TableCellLayout>
            <div
              className={
                item.status === "running"
                  ? localClasses.running_statusCell
                  : localClasses.stopped_statusCell
              }
            >
              {item.status}
            </div>
          </TableCellLayout>
        );
      },
    }),
  ];
  return (
    <div style={{ padding: "20px", gap: "10px", width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
          width: "100%",
        }}
      >
        <Button
          icon={<ArrowCounterclockwise20Filled />}
          appearance="secondary"
          onClick={fetchServers}
        >
          Reload
        </Button>
      </div>
      {loading ? (
        <p>Loading servers...</p>
      ) : (
        <DataGrid
          items={serverItems}
          columns={columns}
          focusMode="composite"
          className={localClasses.grid}
        >
          <DataGridHeader>
            <DataGridRow>
              {({ renderHeaderCell, columnId }) => (
                <DataGridHeaderCell
                  className={
                    columnId === "name"
                      ? localClasses.nameCell
                      : localClasses.cell
                  }
                >
                  {renderHeaderCell()}
                </DataGridHeaderCell>
              )}
            </DataGridRow>
          </DataGridHeader>
          <DataGridBody<Server>>
            {({ item, rowId }) => (
              <DataGridRow<Server> key={rowId}>
                {({ renderCell, columnId }) => (
                  <DataGridCell
                    className={
                      columnId === "name"
                        ? localClasses.nameCell
                        : localClasses.cell
                    }
                  >
                    {renderCell(item)}
                  </DataGridCell>
                )}
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      )}
    </div>
  );
};
