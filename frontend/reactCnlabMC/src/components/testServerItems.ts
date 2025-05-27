export type Server = {
  id: string;
  name: string;
  server_type: "bedrock" | "java";
  ip: string;
  domain_name: string;
  port: number;
  status: string;
};
export const items: Server[] = [
  {
    id: "-1",
    name: "test",
    server_type: "bedrock",
    ip: "192.168.1.200",
    domain_name: "ssms1.cnlab",
    port: 8070,
    status: "active",
  },
  {
    id: "-2",
    name: "test2",
    server_type: "java",
    domain_name: "ssms1.cnlab",
    ip: "192.168.1.200",
    port: 8090,
    status: "active",
  },
];