import React, { useState, useMemo, useCallback } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { FaEdit, FaFileCsv, FaFileExcel, FaFilePdf, FaTrash } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Loader from "../../Components/Admin/Loader";

// Dummy Data
const initialData = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  flowrate: (Math.random() * 100).toFixed(2),
  totalizer: (Math.random() * 1000).toFixed(2),
  efm: (Math.random() * 50).toFixed(2),
}));

function Master() {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      `${item.flowrate} ${item.totalizer} ${item.efm}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  // Get export data function
  const getExportData = useCallback(() => {
    return selectedRows.length ? selectedRows : filteredData;
  }, [selectedRows, filteredData]);

  // CSV Export
  const downloadCSV = useCallback(() => {
    const rows = getExportData();

    const headers = ["Flowrate (m³/h)", "Totalizer (m³)", "EFM"];

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        [row.flowrate, row.totalizer, row.efm].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "flow-data.csv";
    link.click();
    URL.revokeObjectURL(url);
  }, [getExportData]);

  // Excel Export
  const exportExcel = useCallback(() => {
    const rows = getExportData();

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Flow Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(file, `flow-data-${Date.now()}.xlsx`);
  }, [getExportData]);

  const exportPDF = useCallback(() => {
    const rows = getExportData();

    const doc = new jsPDF();

    const tableData = rows.map((r) => [
      r.flowrate,
      r.totalizer,
      r.efm,
    ]);

    autoTable(doc, {
      head: [["Flowrate", "Totalizer", "EFM"]],
      body: tableData,
    });

    doc.save(`flow-data-${Date.now()}.pdf`);
  }, [getExportData]);

  // Delete
  const handleDelete = useCallback(async (row) => {
    const result = await Swal.fire({
      title: "Delete this record?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      setLoading(true);

      setTimeout(() => {
        setData((prev) => prev.filter((item) => item.id !== row.id));
        setLoading(false);

        Swal.fire({
          title: "Deleted!",
          text: "Record has been removed",
          icon: "success",
          confirmButtonColor: "#10b981",
        });
      }, 500);
    }
  }, []);

  // Update
  const handleUpdate = useCallback((row) => {
    Swal.fire({
      title: "Update Flowrate",
      input: "number",
      inputValue: row.flowrate,
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed && res.value) {
        setData((prev) =>
          prev.map((item) =>
            item.id === row.id ? { ...item, flowrate: res.value } : item
          )
        );
        Swal.fire("Updated!", "Flowrate has been updated.", "success");
      }
    });
  }, []);

  // Columns
  const columns = useMemo(
    () => [
      {
        name: "Flowrate",
        selector: (row) => row.flowrate,
        sortable: true,
        cell: (row) => (
          <span className="font-semibold text-blue-600">
            {row.flowrate} m³/h
          </span>
        ),
      },
      {
        name: "Totalizer",
        selector: (row) => row.totalizer,
        sortable: true,
        cell: (row) => (
          <span className="text-gray-700">{row.totalizer} m³</span>
        ),
      },
      {
        name: "EFM",
        selector: (row) => row.efm,
        sortable: true,
        cell: (row) => (
          <span className="text-purple-600 font-medium">{row.efm}</span>
        ),
      },
      {
        name: "Actions",
        cell: (row) => (
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.2 }}
              onClick={() => handleUpdate(row)}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaEdit size={16} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.2 }}
              onClick={() => handleDelete(row)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash size={16} />
            </motion.button>
          </div>
        ),
      },
    ],
    [handleDelete, handleUpdate]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

      {/* Sticky Header */}
      <div className="sticky top-0 md:top-24 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">

          {/* Title */}
          <div className="w-full lg:w-auto">
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">
              Flow Monitoring Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Real-time IoT Flow Data Insights
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

            {/* Export Buttons (scrollable on mobile) */}
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadCSV}
                className="flex items-center gap-2 whitespace-nowrap bg-blue-50 text-blue-600 px-3 py-2 rounded-xl text-xs sm:text-sm shadow border border-blue-200"
              >
                <FaFileCsv size={14} /> CSV
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportExcel}
                className="flex items-center gap-2 whitespace-nowrap bg-emerald-50 text-emerald-600 px-3 py-2 rounded-xl text-xs sm:text-sm shadow border border-emerald-200"
              >
                <FaFileExcel size={14} /> Excel
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportPDF}
                className="flex items-center gap-2 whitespace-nowrap bg-rose-50 text-rose-600 px-3 py-2 rounded-xl text-xs sm:text-sm shadow border border-rose-200"
              >
                <FaFilePdf size={14} /> PDF
              </motion.button>

            </div>

            {/* Search */}
            <div className="flex items-center bg-white px-3 py-2 rounded-xl shadow-md w-full sm:w-72 border">
              <FiSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search flow data..."
                className="outline-none w-full text-sm bg-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

          </div>
        </div>
      </div>

      {/* Loader */}
      {loading && <Loader />}

      {/* Table */}
      <div className="w-full mx-auto mt-4">

        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-2 sm:p-4 overflow-x-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >

          <DataTable
            title={
              <span className="text-base sm:text-lg font-semibold text-gray-700">
                Flow Monitoring Table
              </span>
            }
            columns={columns}
            data={filteredData}
            pagination
            selectableRows
            onSelectedRowsChange={(state) =>
              setSelectedRows(state.selectedRows)
            }
            highlightOnHover
            striped
            responsive
          />

        </motion.div>
      </div>
    </div>
  );
}

export default Master;