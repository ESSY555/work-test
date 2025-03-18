"use client";

import ProtectedRoute from "../components/ProtectedRoute";
import LogoutButton from "../components/LogoutButton";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { User } from "firebase/auth";
import Sidebar from "../components/Sidebar";

const data = [
  { name: "Jan", users: 400 },
  { name: "Feb", users: 600 },
  { name: "Mar", users: 800 },
  { name: "Apr", users: 1200 },
  { name: "May", users: 1600 },
  { name: "Jun", users: 2000 },
  { name: "Jul", users: 2500 },
  { name: "Aug", users: 3000 },
  { name: "Sep", users: 3600 },
  { name: "Oct", users: 4200 },
  { name: "Nov", users: 5000 },
  { name: "Dec", users: 6000 },
];

const rainbowColors = [
  "#FF0000", // Red
  "#FF7F00", // Orange
  "#FFFF00", // Yellow
  "#00FF00", // Green
  "#0000FF", // Blue
  "#4B0082", // Indigo
  "#9400D3", // Violet
  "#FF1493", // Deep Pink
  "#00CED1", // Dark Turquoise
  "#FFD700", // Gold
  "#8A2BE2", // Blue Violet
  "#DC143C"  // Crimson
];
// Pie Chart Data for Category Distribution
const categoryData = [
  { name: "Electronics", value: 35, color: "#4CAF50" },  // Green
  { name: "Clothing", value: 21, color: "#FF5722" },      // Orange
  { name: "Home & Kitchen", value: 21, color: "#2196F3" },// Blue
  { name: "Books", value: 18, color: "#FFC107" },         // Yellow
  { name: "Others", value: 5, color: "#9C27B0" },         // Purple
];


type UserDataKey = "name" | "email" | "status" | "dateJoined";
type StatusType = "Active" | "Pending" | "Inactive";


const usersData = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "Active" as StatusType, country: "USA", dateJoined: "2023-01-01", lastActive: "2024-07-15" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Pending" as StatusType, country: "UK", dateJoined: "2023-02-10", lastActive: "2024-07-10" },
  { id: 3, name: "Emily Davis", email: "emily@example.com", status: "Inactive" as StatusType, country: "Canada", dateJoined: "2023-03-15", lastActive: "2024-07-05" },
];



const getStatusColor = (status: StatusType) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700 border border-green-500";
    case "Pending":
      return "bg-yellow-100 text-yellow-700 border border-yellow-500";
    case "Inactive":
      return "bg-red-100 text-red-700 border border-red-500";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-500";
  }
};



export default function Dashboard() {
  const [filterStatus, setFilterStatus] = useState("All");
  const [users, setUsers] = useState(usersData);
  const [user, setUser] = useState<User | null>(null);

  const sortedData = [...users].sort((a, b) => a.id - b.id);

  const filteredData = filterStatus === "All" ? sortedData : sortedData.filter(user => user.status === filterStatus);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
      setUser(loggedInUser);
    });

    return () => unsubscribe(); 
  }, []);


  return (
    <ProtectedRoute>

      <div className="flex gap-5 justify-between">

        <div className="w-64"> <Sidebar /></div>
        <div className="p-6 bg-gray-100 flex-1">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
          <LogoutButton />
        </div>

       <p className="text-2xl font-semibold text-gray-700 p-5">
          Welcome, {user ? user.displayName || user.email : "Loading..."}!
        </p>

          <div className="flex flex-col md:flex-row gap-6 md:pr-3">
          <div className="bg-white p-6 shadow-lg w-full rounded-lg flex items-center">
            <i className="fas fa-users text-5xl mr-4 text-blue-500 animate-pulse" />
            <div className="">
              <h3 className="text-xl font-semibold">Total Users</h3>
              <p className="text-2xl">{users.length}</p>
            </div>
          </div>
          <div className="w-full bg-white p-6 shadow-lg rounded-lg flex items-center">
            <i className="fas fa-user-friends text-5xl mr-4 text-green-500 animate-pulse" />
            <div>
              <h3 className="text-xl font-semibold">Active Sessions</h3>
              <p className="text-2xl">300</p>
            </div>
          </div>
            <div className="w-full bg-white p-6 shadow-lg rounded-lg flex items-center md:mr-3">
            <i className="fas fa-dollar-sign text-5xl mr-4 text-yellow-500 animate-pulse" />
            <div>
              <h3 className="text-xl font-semibold">Sales Revenue</h3>
              <p className="text-2xl">$50,000</p>
            </div>
          </div>
        </div>


          <div className="flex flex-col md:flex-row gap-6 mt-6">

            <div className="bg-white p-6 shadow-lg rounded-lg flex-1">
            <h2 className="font-bold mb-2">Sales Trends</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={3} animationDuration={800} />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>


            <div className="bg-white p-6 shadow-lg rounded-lg flex-1">
  <h2 className="font-bold text-xl text-gray-700 mb-4">User Growth</h2>

  <ResponsiveContainer width="100%" height={400}>
    <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
      <Tooltip />
      <Bar dataKey="users">
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={rainbowColors[index % rainbowColors.length]} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>;

        </div>



 <div className="w-full">
            <h2 className="font-bold mb-2 text-center text-[25px] pt-5">Category Distribution</h2>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={200} animationDuration={800}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>


        <div className="bg-white p-6 shadow-lg rounded-lg mt-6">
  <h2 className="font-bold text-xl mb-4 text-gray-700">User Data</h2>
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">

      <thead>
  <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
    <th className="py-3 px-6 text-left">ID</th>
    <th className="py-3 px-6 text-left">Name</th>
    <th className="py-3 px-6 text-left">Email</th>
    <th className="py-3 px-6 text-center">Status</th>
                    <th className="py-3 px-6 text-left text-nowrap">Country</th>
                    <th className="py-3 px-6 text-center text-nowrap">Join Date</th>
                    <th className="py-3 px-6 text-center text-nowrap">Last Active</th>
  </tr>
</thead>

      

      <tbody className="text-gray-600 text-sm font-light">
  {filteredData.map((user, index) => (
    <tr
      key={user.id}
      className={`border-b border-gray-200 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition`}
    >
      <td className="py-3 px-6 text-left">{user.id}</td>
      <td className="py-3 px-6 text-left">{user.name}</td>
      <td className="py-3 px-6 text-left">{user.email}</td>
      <td className="py-3 px-6 text-center">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
          {user.status}
        </span>
      </td>
      <td className="py-3 px-6 text-left">{user.country}</td>
      <td className="py-3 px-6 text-center">{user.dateJoined}</td>
      <td className="py-3 px-6 text-center">{user.lastActive}</td>
    </tr>
  ))}
</tbody>


    </table>
  </div>
</div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

































