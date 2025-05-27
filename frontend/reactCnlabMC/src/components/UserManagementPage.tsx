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
  Button,
} from "@fluentui/react-components";
import { ArrowCounterclockwise20Filled } from "@fluentui/react-icons";
import { User, userItems as initialUserItems } from "./testUserItems";

import { useAuth } from "../hooks/AuthContext";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "20px",
    fontSize: "16px",
    width: "100%",
    alignItems: "stretch",
  },
  mainSection: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    padding: "20px",
    flex: 1,
    width: "100%",
  },
  title: {
    margin: "10px",
  },
  input: {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
  },
  createButton: {
    backgroundColor: "#c9e5b1",
    border: 0,
  },
  cell: {
    display: "flex",
    gap: "10px",
    minWidth: "300px",
    flexGrow: 1,
  },
  actionCell: {
    display: "flex",
    gap: "10px",
    width: "100px",
    maxWidth: "100px",
    minWidth: "100px",
  },
});

const url = "http://192.168.1.200:8000";

export const UserManagementPage: React.FC = () => {
  const localClasses = useStyles();
  const auth = useAuth();
  const [userItems, setUserItems] = useState<User[]>(initialUserItems);
  const [loading, setLoading] = useState<boolean>(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${url}/users`, {
        method: "GET",
        redirect: "follow",
      });
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }
      const resObj = await res.json();
      console.log("Fetched users:", resObj);
      setUserItems(resObj.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (user: User) => {
    try {
      const res = await fetch(`${url}/users/${user.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      console.log("Delete user response:", res);
      if (!res.ok) {
        throw new Error(`Backend returned ${res.status}`);
      }
      setUserItems((prev) =>
        prev.filter((prevuser) => prevuser.name !== user.name)
      );
      console.log(`User ${user.name} deleted successfully`);
    } catch (e) {
      console.error(`Failed to delete user ${user.name}:`, e);
    }
  };
  const handleCreateUser = async () => {
    const success = await auth.register(username, password);
    console.log("Create user success:", success);
    if (!success) {
      console.error("使用者建立失敗");
    } else {
      fetchUsers();
    }
  };

  const columns: TableColumnDefinition<User>[] = [
    createTableColumn<User>({
      columnId: "name",
      renderHeaderCell: () => <DataGridHeaderCell>Name</DataGridHeaderCell>,
      renderCell: (user) => <TableCellLayout>{user.name}</TableCellLayout>,
    }),
    createTableColumn<User>({
      columnId: "actions",
      renderHeaderCell: () => <DataGridHeaderCell>Actions</DataGridHeaderCell>,
      renderCell: (user) => (
        <TableCellLayout>
          <Button appearance="secondary" onClick={() => handleDeleteUser(user)}>
            Delete
          </Button>
        </TableCellLayout>
      ),
    }),
  ];
  return (
    <div className={localClasses.root}>
      <div>
        <div className={localClasses.inputContainer}>
          <input
            className={localClasses.input}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className={localClasses.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            className={localClasses.createButton}
            shape="circular"
            appearance="secondary"
            onClick={handleCreateUser}
          >
            Add User
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className={localClasses.mainSection}>
          <h1 className={localClasses.title}>User Management</h1>

          <DataGrid
            items={userItems}
            columns={columns}
            focusMode="composite"
            className="server-manage-table"
          >
            <DataGridHeader>
              <DataGridRow>
                {({ renderHeaderCell, columnId }) => (
                  <DataGridHeaderCell
                    className={
                      columnId === "actions"
                        ? localClasses.actionCell
                        : localClasses.cell
                    }
                  >
                    {renderHeaderCell()}
                  </DataGridHeaderCell>
                )}
              </DataGridRow>
            </DataGridHeader>
            <DataGridBody<User>>
              {({ item, rowId }) => (
                <DataGridRow<User> key={rowId}>
                  {({ renderCell, columnId }) => (
                    <DataGridCell
                      className={
                        columnId === "actions"
                          ? localClasses.actionCell
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

          <Button
            icon={<ArrowCounterclockwise20Filled />}
            appearance="outline"
            onClick={fetchUsers}
          >
            Fetch Users
          </Button>
        </div>
      )}
    </div>
  );
};
