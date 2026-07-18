const ExportResults = (function() {

    // Dummy detailed student data for the CSV export
    const detailedStudentResults = [
        {
            rank: 1,
            studentName: "Arun Kumar",
            studentId: "717821P101",
            branch: "CSE",
            score: "49/50",
            percentage: 98,
            timeTaken: "45 mins",
            proctoringStatus: "Clean",
            weakTopics: "None"
        },
        {
            rank: 2,
            studentName: "Deepak Raj",
            studentId: "717821P104",
            branch: "IT",
            score: "46/50",
            percentage: 92,
            timeTaken: "52 mins",
            proctoringStatus: "Clean",
            weakTopics: "Dynamic Programming"
        },
        {
            rank: 3,
            studentName: "Bhavya Shree",
            studentId: "717821P102",
            branch: "CSE",
            score: "44/50",
            percentage: 88,
            timeTaken: "35 mins",
            proctoringStatus: "3 Flags Detected",
            weakTopics: "SQL Joins"
        },
        {
            rank: 45,
            studentName: "Chandra Sekhar",
            studentId: "717821P103",
            branch: "ECE",
            score: "32/50",
            percentage: 65,
            timeTaken: "85 mins",
            proctoringStatus: "1 Minor Warning",
            weakTopics: "Graph Theory, Sorting"
        },
        {
            rank: 112,
            studentName: "Michael Chang",
            studentId: "CS2025118",
            branch: "CSE",
            score: "16/50",
            percentage: 32,
            timeTaken: "90 mins",
            proctoringStatus: "Clean",
            weakTopics: "Data Structures & Algo"
        }
    ];

    function downloadTestResults(testName = "Detailed_Test_Report") {
        let headers = [];
        let rows = [];

        const table = document.querySelector('.premium-table');
        if (table) {
            // Scrape headers from the table, skipping the Actions column
            const ths = table.querySelectorAll('thead th');
            headers = Array.from(ths).map(th => th.innerText.trim());
            headers.pop(); // Remove "Actions"

            // Scrape visible rows
            const trs = table.querySelectorAll('tbody tr');
            trs.forEach(tr => {
                if (tr.style.display !== 'none') {
                    const tds = tr.querySelectorAll('td');
                    const rowData = [];
                    for (let i = 0; i < tds.length - 1; i++) { // Skip Actions
                        // Replace newlines with spaces for clean CSV formatting
                        rowData.push(tds[i].innerText.trim().replace(/\n/g, ' | '));
                    }
                    rows.push(rowData);
                }
            });
        } else {
            // Fallback to dummy data
            headers = [
                "Rank", 
                "Student Name", 
                "Roll Number", 
                "Branch", 
                "Score", 
                "Percentage", 
                "Time Taken", 
                "Proctoring Status", 
                "Weak Topics"
            ];
            
            rows = detailedStudentResults.map(s => [
                s.rank,
                s.studentName,
                s.studentId,
                s.branch,
                s.score,
                `${s.percentage}%`,
                s.timeTaken,
                s.proctoringStatus,
                s.weakTopics
            ]);
        }

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(item => `"${String(item).replace(/"/g, '""')}"`).join(","))
        ].join("\n");
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${testName.replace(/\s+/g, '_')}_Results.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // specific method for a single student's individual row
    function downloadStudentResult(studentId) {
        const s = detailedStudentResults.find(st => st.studentId === studentId);
        if (!s) {
            alert('Student result not found.');
            return;
        }

        const headers = ["Field", "Value"];
        const rows = [
            ["Student Name", s.studentName],
            ["Roll Number", s.studentId],
            ["Branch", s.branch],
            ["Score", s.score],
            ["Percentage", `${s.percentage}%`],
            ["Time Taken", s.timeTaken],
            ["Proctoring Status", s.proctoringStatus],
            ["Weak Topics", s.weakTopics]
        ];

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(item => `"${String(item).replace(/"/g, '""')}"`).join(","))
        ].join("\n");
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `Student_${studentId}_Result.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Advanced Professional Profile Export
    function downloadFullStudentProfile(studentId, student) {
        if (!student) {
            alert('Student profile data not found.');
            return;
        }

        let csvContent = "";

        // Section 1: Profile Details
        csvContent += "=== STUDENT PROFILE DATA ===\n";
        csvContent += `Name,${student.name}\n`;
        csvContent += `Roll Number,${student.roll}\n`;
        csvContent += `Branch,${student.branch}\n\n`;

        // Section 2: Analytics & Overall Performance
        csvContent += "=== OVERALL ANALYTICS ===\n";
        csvContent += `Average Score,${student.overallAvg}\n`;
        csvContent += `Total Tests Taken,${student.totalTests}\n`;
        csvContent += `Cheating Risk Level,${student.riskLevel}\n`;
        csvContent += `Identified Weak Topics,"${student.weakTopics}"\n\n`;

        // Section 3: Test History
        csvContent += "=== TEST HISTORY ===\n";
        csvContent += "Date,Test Name,Score,Proctoring Status\n";
        
        student.tests.forEach(t => {
            csvContent += `"${t.date}","${t.name}","${t.score}","${t.status}"\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `Professional_Profile_${studentId}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function downloadPerformanceReport() {
        const select = document.getElementById('export-date-range');
        const range = select ? select.options[select.selectedIndex].text : "Custom";

        const headers = ["Rank", "Student Name", "Roll Number", "Branch", "Score", "Percentage"];
        const rows = detailedStudentResults.map(s => [
            s.rank, s.studentName, s.studentId, s.branch, s.score, `${s.percentage}%`
        ]);

        let csvContent = `=== PERFORMANCE REPORT: ${range} ===\n`;
        csvContent += headers.join(",") + "\n";
        csvContent += rows.map(row => row.map(item => `"${String(item).replace(/"/g, '""')}"`).join(",")).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `Performance_Report_${range.replace(/\s+/g, '_')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function downloadProctoringLogs() {
        const select = document.getElementById('export-risk-level');
        const risk = select ? select.options[select.selectedIndex].text : "All";

        const headers = ["Student Name", "Roll Number", "Proctoring Status", "Risk Analysis"];
        
        // Filter based on mock risk level
        const filtered = detailedStudentResults.filter(s => {
            if (risk === "High Risk Only") return s.proctoringStatus.includes("Flag");
            if (risk === "Medium & High") return s.proctoringStatus !== "Clean";
            return true;
        });

        const rows = filtered.map(s => [
            s.studentName, s.studentId, s.proctoringStatus, s.proctoringStatus === "Clean" ? "Low/No Risk" : "Attention Required"
        ]);

        let csvContent = `=== AI PROCTORING LOGS: ${risk} ===\n`;
        csvContent += headers.join(",") + "\n";
        csvContent += rows.map(row => row.map(item => `"${String(item).replace(/"/g, '""')}"`).join(",")).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `Proctoring_Logs_${risk.replace(/\s+/g, '_')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function generateCSV(filename, headers, rows) {
        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(item => `"${String(item).replace(/"/g, '""')}"`).join(","))
        ].join("\n");
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function generatePDF(title, headers, rows) {
        const printWindow = window.open('', '_blank');
        const html = `
        <html>
        <head>
            <title>${title}</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #333; }
                h2 { color: #1e293b; text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 30px;}
                table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
                th, td { border: 1px solid #cbd5e1; padding: 12px; text-align: left; }
                th { background-color: #f8fafc; color: #0f172a; font-weight: bold; }
                tr:nth-child(even) { background-color: #f1f5f9; }
                .footer { margin-top: 40px; font-size: 12px; color: #94a3b8; text-align: center; }
            </style>
        </head>
        <body>
            <h2>${title}</h2>
            <table>
                <thead>
                    <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}
                </tbody>
            </table>
            <div class="footer">Generated by GPAP Platform on ${new Date().toLocaleString()}</div>
            <script>
                window.onload = function() { 
                    setTimeout(() => { window.print(); window.close(); }, 500);
                }
            </script>
        </body>
        </html>
        `;
        printWindow.document.write(html);
        printWindow.document.close();
    }

    // Performance Report
    const perfHeaders = ["Rank", "Student Name", "Roll Number", "Department", "Overall Score", "Percentile"];
    const perfRows = [
        ["1", "Arun Kumar", "717821P101", "CSE", "98%", "Top 1%"],
        ["2", "Deepak Raj", "717821P104", "IT", "92%", "Top 5%"],
        ["3", "Bhavya Shree", "717821P102", "CSE", "88%", "Top 10%"],
        ["45", "Chandra Sekhar", "717821P103", "ECE", "65%", "Top 40%"]
    ];

    function downloadPerformanceCSV() { generateCSV("Performance_Report.csv", perfHeaders, perfRows); }
    function downloadPerformancePDF() { generatePDF("Performance Report", perfHeaders, perfRows); }

    // Attendance Report
    const attHeaders = ["Date", "Student Name", "Roll Number", "Department", "Session", "Status", "Duration"];
    const attRows = [
        ["Oct 12, 2023", "Arun Kumar", "717821P101", "CSE", "Java Training", "Present", "2h 0m"],
        ["Oct 12, 2023", "Deepak Raj", "717821P104", "IT", "Java Training", "Present", "1h 55m"],
        ["Oct 12, 2023", "Bhavya Shree", "717821P102", "CSE", "Aptitude Test", "Absent", "0h 0m"]
    ];

    function downloadAttendanceCSV() { generateCSV("Attendance_Report.csv", attHeaders, attRows); }
    function downloadAttendancePDF() { generatePDF("Attendance Report", attHeaders, attRows); }

    // Placement Eligibility
    const placeHeaders = ["Student Name", "Roll Number", "Department", "CGPA", "Assessment Avg", "Eligible For"];
    const placeRows = [
        ["Arun Kumar", "717821P101", "CSE", "8.9", "95%", "Tier 1 & 2"],
        ["Deepak Raj", "717821P104", "IT", "8.5", "90%", "Tier 1 & 2"],
        ["Bhavya Shree", "717821P102", "CSE", "7.8", "82%", "Tier 2 & 3"]
    ];

    function downloadPlacementCSV() { generateCSV("Placement_Eligibility_Report.csv", placeHeaders, placeRows); }
    function downloadPlacementPDF() { generatePDF("Placement Eligibility Report", placeHeaders, placeRows); }

    return {
        downloadTestResults,
        downloadStudentResult,
        downloadFullStudentProfile,
        downloadPerformanceReport,
        downloadProctoringLogs,
        downloadPerformanceCSV,
        downloadPerformancePDF,
        downloadAttendanceCSV,
        downloadAttendancePDF,
        downloadPlacementCSV,
        downloadPlacementPDF
    };
})();
