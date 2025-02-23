/** @format */

import React, { useState } from "react";
import {
  Bell,
  Filter,
  Download,
  Plus,
  X,
  BarChart,
  Clock,
  Edit2,
  MessageCircle,
  ChevronDown,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  Bar,
  BarChart as RechartsBarChart,
} from "recharts";

interface Project {
  id: string;
  name: string;
  client: string;
  budget: number;
  profitability: number;
  hours: string;
  status: "over" | "warning" | "good";
  overBy: string;
  startDate: string;
  endDate: string;
}

interface FilterState {
  status: string;
  dateRange: string;
  client: string;
  budgetRange: string;
}

// Types for team mood tracking
interface TeamMember {
  id: string;
  name: string;
  role: string;
  mood: {
    current: MoodType;
    timestamp: string;
    note?: string;
  };
  moodHistory: {
    mood: MoodType;
    timestamp: string;
    note?: string;
  }[];
  availability: "available" | "meeting" | "busy" | "offline";
}

type MoodType = "very_happy" | "happy" | "neutral" | "unhappy" | "very_unhappy";

const MoodEmoji: Record<MoodType, string> = {
  very_happy: "😄",
  happy: "😊",
  neutral: "😐",
  unhappy: "😕",
  very_unhappy: "😢",
};

const TeamMoodSection = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Andrea",
      role: "Product Manager",
      mood: {
        current: "happy",
        timestamp: "2024-02-23T09:00:00",
        note: "Great progress on new features!",
      },
      moodHistory: [
        {
          mood: "happy",
          timestamp: "2024-02-23T09:00:00",
          note: "Great progress on new features!",
        },
        {
          mood: "neutral",
          timestamp: "2024-02-22T09:00:00",
          note: "Busy day ahead",
        },
      ],
      availability: "available",
    },
    {
      id: "2",
      name: "Alvaro",
      role: "Dev and Manager",
      mood: {
        current: "very_happy",
        timestamp: "2024-02-23T08:30:00",
        note: "Sprint goals achieved!",
      },
      moodHistory: [
        {
          mood: "very_happy",
          timestamp: "2024-02-23T08:30:00",
          note: "Sprint goals achieved!",
        },
        { mood: "happy", timestamp: "2024-02-22T08:30:00" },
      ],
      availability: "meeting",
    },
  ]);

  const [showMoodModal, setShowMoodModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [newMood, setNewMood] = useState<MoodType>("happy");
  const [moodNote, setMoodNote] = useState("");

  // Calculate team mood statistics
  const moodStats = teamMembers.reduce((acc, member) => {
    acc[member.mood.current] = (acc[member.mood.current] || 0) + 1;
    return acc;
  }, {} as Record<MoodType, number>);

  const moodTrend = [
    { name: "Mon", happy: 4, neutral: 1, unhappy: 0 },
    { name: "Tue", happy: 3, neutral: 2, unhappy: 0 },
    { name: "Wed", happy: 2, neutral: 2, unhappy: 1 },
    { name: "Thu", happy: 4, neutral: 1, unhappy: 0 },
    { name: "Fri", happy: 5, neutral: 0, unhappy: 0 },
  ];

  const updateMood = (memberId: string) => {
    if (!newMood) return;

    setTeamMembers((prev) =>
      prev.map((member) => {
        if (member.id === memberId) {
          const newMoodEntry = {
            mood: newMood,
            timestamp: new Date().toISOString(),
            note: moodNote,
          };
          return {
            ...member,
            mood: {
              current: newMood,
              timestamp: newMoodEntry.timestamp,
              note: moodNote,
            },
            moodHistory: [newMoodEntry, ...member.moodHistory],
          };
        }
        return member;
      })
    );

    setShowMoodModal(false);
    setMoodNote("");
  };

  const MoodUpdateModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Update Mood</h3>
          <button
            onClick={() => setShowMoodModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How are you feeling?
            </label>
            <div className="flex justify-between p-2 border rounded-md">
              {Object.entries(MoodEmoji).map(([mood, emoji]) => (
                <button
                  key={mood}
                  onClick={() => setNewMood(mood as MoodType)}
                  className={`text-2xl p-2 rounded-full ${
                    newMood === mood ? "bg-blue-100" : ""
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add a note (optional)
            </label>
            <textarea
              className="w-full border rounded-md p-2"
              rows={3}
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              placeholder="What's on your mind?"
            />
          </div>

          <button
            onClick={() => selectedMember && updateMood(selectedMember)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Update Mood
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Team Mood Overview */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Current Team Mood</h3>
          <PieChart width={200} height={200}>
            <Pie
              data={Object.entries(moodStats).map(([mood, count]) => ({
                name: mood,
                value: count,
              }))}
              cx={100}
              cy={100}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {Object.entries(moodStats).map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`hsl(${index * 50}, 70%, 50%)`}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <RechartsBarChart width={300} height={200} data={moodTrend}>
            {/* <BarChart width={300} height={200} data={moodTrend}> */}
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="happy" fill="#4CAF50" />
            <Bar dataKey="neutral" fill="#FFC107" />
            <Bar dataKey="unhappy" fill="#F44336" />
            {/* </BarChart> */}
          </RechartsBarChart>
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Team Members</h3>
        </div>
        <div className="divide-y">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="p-4 flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                <img
                  src="/api/placeholder/40/40"
                  alt={member.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-gray-500">{member.role}</div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                {/* Availability indicator */}
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500 capitalize">
                    {member.availability}
                  </span>
                </div>

                {/* Current mood */}
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">
                    {MoodEmoji[member.mood.current]}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedMember(member.id);
                      setNewMood(member.mood.current);
                      setShowMoodModal(true);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Edit2 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Quick actions */}
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <MessageCircle className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mood Update Modal */}
      {showMoodModal && <MoodUpdateModal />}
    </div>
  );
};
const ProjectDashboard = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: "",
    dateRange: "",
    client: "",
    budgetRange: "",
  });

  // Sample data for the line chart
  const revenueData = [
    { date: "19 June", value: 1000 },
    { date: "20 June", value: 3500 },
    { date: "21 June", value: 3700 },
    { date: "22 June", value: 4000 },
    { date: "23 June", value: 5000 },
    { date: "24 June", value: 6500 },
    { date: "25 June", value: 6500 },
  ];

  // Sample data for the pie chart
  const budgetData = [
    { name: "Over Budget", value: 20, color: "#FF4B55" },
    { name: "On Budget", value: 30, color: "#8884d8" },
    { name: "Under Budget", value: 50, color: "#36D7B7" },
  ];

  // Sample data for team members
  const teamMembers = [
    {
      name: "Andrea",
      role: "Product",
      mood: "😊",
    },
    {
      name: "Alvaro",
      role: "Dev and Manager",
      mood: "😃",
    },
    {
      name: "Juan",
      role: "UX Senior",
      mood: "😊",
    },
    {
      name: "Jose",
      role: "Marketing",
      mood: "😄",
    },
    {
      name: "Maria",
      role: "UX Junior",
      mood: "😊",
    },
  ];

  // Sample project data
  const projects = [
    {
      name: "Insurance App",
      budget: 70000,
      profitability: -2500,
      hours: "1:00",
      status: "over",
      overBy: "100 hours over Budget!",
    },
    {
      name: "Neo",
      budget: 70000,
      profitability: 4000,
      hours: "1:00",
      status: "warning",
      overBy: "800 left hours",
    },
    {
      name: "VR Website",
      budget: 70000,
      profitability: 4000,
      hours: "1:00",
      status: "good",
      overBy: "2000 left hours",
    },
    {
      name: "VR Website",
      budget: 70000,
      profitability: 4000,
      hours: "1:00",
      status: "good",
      overBy: "1600 left hours",
    },
  ];

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    return projects.filter((project) => {
      if (filters.status && project.status !== filters.status) return false;
      if (
        filters.client &&
        project.name.toLowerCase().includes(filters.client.toLowerCase())
      )
        return false;
      if (filters.budgetRange) {
        const [min, max] = filters.budgetRange.split("-").map(Number);
        if (project.budget < min || project.budget > max) return false;
      }
      return true;
    });
  };

  // Download handlers
  const downloadProjectData = (format: "pdf" | "csv" | "excel") => {
    const filteredProjects = applyFilters();

    switch (format) {
      case "pdf":
        generatePDF(filteredProjects as Project[]);
        break;
      case "csv":
        generateCSV(filteredProjects as Project[]);
        break;
      case "excel":
        generateExcel(filteredProjects as Project[]);
        break;
    }
  };

  const generatePDF = (data: Project[]) => {
    // In a real implementation, you would use a library like jsPDF
    const projectsString = JSON.stringify(data, null, 2);
    const blob = new Blob([projectsString], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "projects.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateCSV = (data: Project[]) => {
    const headers = ["Name", "Client", "Budget", "Profitability", "Status"];
    const csvData = data.map((project) =>
      [
        project.name,
        project.client,
        project.budget,
        project.profitability,
        project.status,
      ].join(",")
    );
    const csv = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "projects.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateExcel = (data: Project[]) => {
    // In a real implementation, you would use a library like xlsx
    const projectsString = JSON.stringify(data, null, 2);
    const blob = new Blob([projectsString], {
      type: "application/vnd.ms-excel",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "projects.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter Modal Component
  const FilterModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Filter Projects</h3>
          <button
            onClick={() => setShowFilters(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full border rounded-md p-2"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">All</option>
              <option value="over">Over Budget</option>
              <option value="warning">Warning</option>
              <option value="good">Good</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <input
              type="text"
              className="w-full border rounded-md p-2"
              value={filters.client}
              onChange={(e) => handleFilterChange("client", e.target.value)}
              placeholder="Search by client name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget Range
            </label>
            <select
              className="w-full border rounded-md p-2"
              value={filters.budgetRange}
              onChange={(e) =>
                handleFilterChange("budgetRange", e.target.value)
              }
            >
              <option value="">All</option>
              <option value="0-50000">$0 - $50,000</option>
              <option value="50000-100000">$50,000 - $100,000</option>
              <option value="100000-200000">$100,000 - $200,000</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={() =>
                setFilters({
                  status: "",
                  dateRange: "",
                  client: "",
                  budgetRange: "",
                })
              }
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Download Options Menu Component
  const DownloadMenu = () => {
    const [showMenu, setShowMenu] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center space-x-1 px-3 py-2 border rounded"
        >
          <Download className="w-4 h-4" />
          <span>Download report</span>
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <div className="py-1">
              <button
                onClick={() => {
                  downloadProjectData("pdf");
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Download as PDF
              </button>
              <button
                onClick={() => {
                  downloadProjectData("csv");
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Download as CSV
              </button>
              <button
                onClick={() => {
                  downloadProjectData("excel");
                  setShowMenu(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Download as Excel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold">
              <span className="text-teal-400">H</span>OURS
            </h1>
            <nav className="space-x-6">
              <a href="#" className="hover:text-teal-400">
                Dashboard
              </a>
              <a href="#" className="hover:text-teal-400">
                Projects
              </a>
              <a href="#" className="hover:text-teal-400">
                Team
              </a>
              <a href="#" className="hover:text-teal-400">
                Clients
              </a>
              <a href="#" className="hover:text-teal-400">
                Time
              </a>
              <a href="#" className="hover:text-teal-400">
                Reports
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-5 h-5" />
            <div className="flex items-center space-x-2">
              <span>Mario</span>
              <img
                src="https://avatar.iran.liara.run/public"
                alt="User"
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-4xl font-bold">5</div>
            <div className="text-gray-500">Total Projects</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-4xl font-bold">1</div>
            <div className="text-gray-500">Completed</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-4xl font-bold">3</div>
            <div className="text-gray-500">Ongoing</div>
          </div>
          <div className="bg-red-100 p-4 rounded-lg shadow">
            <div className="text-4xl font-bold text-red-500">1</div>
            <div className="text-red-500">Delayed</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-4xl font-bold">5</div>
            <div className="text-gray-500">Employees</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Revenue Chart */}
          <div className="col-span-2 bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Total revenue</h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 rounded bg-gray-100">Month</button>
                <button className="px-3 py-1 rounded bg-gray-100">Week</button>
              </div>
            </div>
            <LineChart width={600} height={300} data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#36D7B7" />
            </LineChart>
          </div>

          {/* Budget Pie Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Budget</h2>
            <PieChart width={300} height={300}>
              <Pie
                data={budgetData}
                cx={150}
                cy={150}
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
              >
                {budgetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
        </div>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Team Mood Tracking</h2>
          <TeamMoodSection />
        </section>

        {/* Team Section */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Team mood</h2>
          <div className="space-y-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={`https://avatar.iran.liara.run/public/${index}`}
                    alt={member.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-gray-500 text-sm">{member.role}</div>
                  </div>
                </div>
                <div>{member.mood}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Budget status</h2>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-1 px-3 py-2 bg-teal-600 text-white rounded">
                <Plus className="w-4 h-4" />
                <span>Add New Project</span>
              </button>
              <DownloadMenu />
              <button className="px-3 py-2 border rounded">
                dd/mm/yyyy - dd/mm/yyyy
              </button>
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center space-x-1 px-3 py-2 border rounded"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
            {projects.map((project, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">{project.name}</h3>
                    <div className="text-gray-500 text-sm">Berba</div>
                  </div>
                  <img
                    src={`https://avatar.iran.liara.run/public/${index}`}
                    alt="Project"
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Budget</span>
                    <span>{project.budget}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Profitability (ROI)</span>
                    <span
                      className={
                        project.profitability < 0
                          ? "text-red-500"
                          : "text-green-500"
                      }
                    >
                      {project.profitability}€
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Actual hours</span>
                    <span>{project.hours}</span>
                  </div>
                  <div
                    className={`h-2 rounded-full ${
                      project.status === "over"
                        ? "bg-red-500"
                        : project.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  />
                  <div className="text-sm text-center">{project.overBy}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Filter Modal */}
      {showFilters && <FilterModal />}
    </div>
  );
};

export default ProjectDashboard;
