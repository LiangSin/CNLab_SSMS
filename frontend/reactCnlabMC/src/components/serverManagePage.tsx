import {
  DataGrid,
  DataGridHeader,
  DataGridRow,
  DataGridHeaderCell,
  DataGridBody,
  DataGridCell,
  TableColumnDefinition,
  createTableColumn,
  TableCell,
  TableCellLayout,
  makeStyles,
  Button,
} from "@fluentui/react-components";
import { useEffect, useState } from "react";
import "./ServerManagePage.css";


import { Server, items as initialItems } from "./testServerItems";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "20px",
  },
  table: {
    minWidth: "550px",
  },
  actionCell: {
    display: "flex",
    gap: "10px",
    width: "500px",
  },
  actionButton2: {
    marginLeft: "8px",
  },
});


const url = "http://192.168.1.200:8000";

export const ServerManagePage = () => {
  const localClasses = useStyles();
  const [serverItems, setServerItems] = useState<Server[]>(initialItems);
  const [loading, setLoading] = useState<boolean>(true);
  const [serverName, setServerName] = useState<string>("");
  const [serverType, setServerType] = useState<"bedrock" | "java">("bedrock");


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

  const handleStatusChange = async (
    serverId: string,
    status: "running" | "stopped"
  ) => {
    try {
      const res = await fetch(`${url}/servers/${serverId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      setServerItems((prev) =>
        prev.map((server) =>
          server.id === serverId ? { ...server, status: status } : server
        )
      );
      console.log(`Server ${serverId} status changed to ${status}`);
    } catch (e) {
      console.error(`Failed to change status for server ${serverId}:`, e);
    }
  };

  const handleDeleteServer = async (serverId: string) => {
    try {
      const res = await fetch(`${url}/servers/${serverId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      setServerItems((prev) => prev.filter((server) => server.id !== serverId));
      console.log(`Server ${serverId} deleted successfully`);
    } catch (e) {
      console.error(`Failed to delete server ${serverId}:`, e);
    }
  };
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
        return "Name";
      },
      renderCell: (item) => {
        return <TableCellLayout>{item.name}</TableCellLayout>;
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
      columnId: "status",
      renderHeaderCell: () => {
        return "Status";
      },
      // renderCell: (item) => {
      //   const statusClass = `status-${item.status}`;
      //   return <TableCellLayout className={statusClass}>{item.status}</TableCellLayout>;
      // },
      renderCell: (item) => {
        return <TableCellLayout className={`status-${item.status}`}>{item.status}</TableCellLayout>;
      },
    }),
    createTableColumn<Server>({
      columnId: "actions",
      renderHeaderCell: () => {
        return "Actions";
      },
      renderCell: (item) => {
        return (
          <TableCellLayout id="test">
            
            <div className="server-manage-action-cell">
              <Button
                style={{ backgroundColor: "#A8D5BA", color: "#1a3e2e" }}
                onClick={() => handleStatusChange(item.id, "running")}
              >
                Start
              </Button>
              <Button 
                style={{ backgroundColor: "#FBE6A2", color: "#665200" }}
                onClick={() => handleStatusChange(item.id, "stopped")}
              >Stop</Button>
              <Button
                style={{ backgroundColor: "#D9A5A5", color: "#2c1111" }}
                onClick={() => handleDeleteServer(item.id)}
              >Delete</Button>
            </div>


          </TableCellLayout>
        );
      },
    }),
  ];

  
  // function createServer() {
  //   fetch(url + "/servers/", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       name: "test server",
  //       server_type: "bedrock",
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((result) => console.log(result))
  //     .catch((error) => console.log("error", error));
  // }
  function createServer() {
    fetch(url + "/servers/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: serverName,
        server_type: serverType,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        fetchServers(); // 建立後更新列表
      })
      .catch((error) => console.log("error", error));
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '12px', marginBottom: '16px', width: "100%" }} className="server-manage-root">
      {/* <Button onClick={getData}>Get Data</Button>
      <Button onClick={createServer}>Create Server</Button> */}
      <div className="server-manage-toolbar">
        <input
          type="text"
          className="server-input"
          placeholder="ServerName"
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
        />
        <select
          className="server-select"
          value={serverType}
          onChange={(e) => setServerType(e.target.value as "bedrock" | "java")}
        >
          <option value="bedrock">bedrock</option>
          <option value="java">java</option>
        </select>
        <button className="custom-btn success-btn" onClick={createServer}>Create Server</button>
      </div>

      {/* <h1>Server Management</h1> */}
      <h1 className="server-title">Server Management</h1>
      {loading ? (
        <p>Loading servers...</p>
      ) : (
        <DataGrid
          items={serverItems}
          columns={columns}
          focusMode="composite"
          className="server-manage-table"
        >

          <DataGridHeader>
            <DataGridRow>
              {({ renderHeaderCell, columnId }) => (
                <DataGridHeaderCell className={columnId === "actions" ? localClasses.actionCell : ""}>{renderHeaderCell()}</DataGridHeaderCell>
              )}
            </DataGridRow>
          </DataGridHeader>
          <DataGridBody<Server>>
            {({ item, rowId }) => (
              <DataGridRow<Server> key={rowId}>
                {({ renderCell, columnId }) => (
                  <DataGridCell className={columnId === "actions" ? localClasses.actionCell : ""}>{renderCell(item)}</DataGridCell>
                )}
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      )}
    </div>
  );
};
