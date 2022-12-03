import axios from "axios";

const server = axios.create({
  baseURL: "http://localhost:3042/api",
});

export default server;
