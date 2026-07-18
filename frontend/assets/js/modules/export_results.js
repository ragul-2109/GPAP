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
        const headers = [
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
        
        const rows = detailedStudentResults.map(s => [
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

    return {
        downloadTestResults,
        downloadStudentResult,
        downloadFullStudentProfile
    };
})();
