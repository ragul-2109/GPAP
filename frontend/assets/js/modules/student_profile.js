const StudentProfile = (function() {

    // Dummy Database for Student Profiles
    const profilesDB = {
        "717821P101": {
            name: "Arun Kumar",
            roll: "717821P101",
            branch: "CSE",
            avatar: "https://ui-avatars.com/api/?name=Arun+Kumar&background=random",
            overallAvg: "92%",
            totalTests: 12,
            riskLevel: "Low",
            weakTopics: "None detected",
            tests: [
                { date: "Oct 12", name: "TCS NQT Mock 1", score: "98%", status: "Clean" },
                { date: "Oct 05", name: "Data Structures", score: "85%", status: "Clean" },
                { date: "Sep 28", name: "Core Java", score: "95%", status: "Clean" }
            ]
        },
        "717821P102": {
            name: "Bhavya Shree",
            roll: "717821P102",
            branch: "CSE",
            avatar: "https://ui-avatars.com/api/?name=Bhavya+Shree&background=random",
            overallAvg: "78%",
            totalTests: 12,
            riskLevel: "High Risk",
            weakTopics: "SQL Joins, Graph Theory",
            tests: [
                { date: "Oct 12", name: "TCS NQT Mock 1", score: "88%", status: "3 Flags" },
                { date: "Oct 05", name: "Data Structures", score: "70%", status: "Clean" },
                { date: "Sep 28", name: "Core Java", score: "76%", status: "1 Warning" }
            ]
        },
        "717821P103": {
            name: "Chandra Sekhar",
            roll: "717821P103",
            branch: "ECE",
            avatar: "https://ui-avatars.com/api/?name=Chandra+Sekhar&background=random",
            overallAvg: "65%",
            totalTests: 11,
            riskLevel: "Medium",
            weakTopics: "Dynamic Programming, SQL",
            tests: [
                { date: "Oct 12", name: "TCS NQT Mock 1", score: "65%", status: "1 Minor Warning" },
                { date: "Oct 05", name: "Data Structures", score: "60%", status: "Clean" },
                { date: "Sep 28", name: "Core Java", score: "70%", status: "Clean" }
            ]
        },
        "717821P104": {
            name: "Deepak Raj",
            roll: "717821P104",
            branch: "IT",
            avatar: "https://ui-avatars.com/api/?name=Deepak+Raj&background=random",
            overallAvg: "89%",
            totalTests: 12,
            riskLevel: "Safe",
            weakTopics: "Dynamic Programming",
            tests: [
                { date: "Oct 12", name: "TCS NQT Mock 1", score: "92%", status: "Clean" },
                { date: "Oct 05", name: "Data Structures", score: "85%", status: "Clean" },
                { date: "Sep 28", name: "Core Java", score: "90%", status: "Clean" }
            ]
        }
    };

    let profileModalInstance = null;

    function view(studentId) {
        const student = profilesDB[studentId];
        
        if(!student) {
            alert("Student profile data not found.");
            return;
        }

        // Populate Modal Fields
        document.getElementById('sp-avatar').src = student.avatar;
        document.getElementById('sp-name').textContent = student.name;
        document.getElementById('sp-roll').textContent = student.roll + " • " + student.branch;
        
        document.getElementById('sp-avg').textContent = student.overallAvg;
        document.getElementById('sp-total').textContent = student.totalTests;
        
        const riskBadge = document.getElementById('sp-risk');
        riskBadge.textContent = student.riskLevel;
        riskBadge.className = 'badge';
        if (student.riskLevel === 'Safe' || student.riskLevel === 'Low') riskBadge.classList.add('bg-success');
        else if (student.riskLevel === 'Medium') riskBadge.classList.add('bg-warning', 'text-dark');
        else riskBadge.classList.add('bg-danger');

        document.getElementById('sp-weakness').textContent = student.weakTopics;

        // Populate Test History Table
        const tbody = document.getElementById('sp-test-history');
        tbody.innerHTML = student.tests.map(t => {
            let statusClass = 'text-success';
            if (t.status !== 'Clean') statusClass = 'text-danger fw-bold';
            return `
                <tr>
                    <td><div class="small text-muted">${t.date}</div></td>
                    <td><div class="fw-medium text-dark">${t.name}</div></td>
                    <td><div class="fw-bold">${t.score}</div></td>
                    <td><span class="small ${statusClass}">${t.status}</span></td>
                </tr>
            `;
        }).join('');

        // Wire download button
        const dlBtn = document.getElementById('sp-download-btn');
        dlBtn.onclick = () => {
            if(window.ExportResults) {
                ExportResults.downloadFullStudentProfile(studentId, student);
            } else {
                alert("Export module not found.");
            }
        };

        // Show Modal
        if (typeof bootstrap !== 'undefined') {
            const modalEl = document.getElementById('studentProfileModal');
            if(modalEl) {
                if (!profileModalInstance) profileModalInstance = new bootstrap.Modal(modalEl);
                profileModalInstance.show();
            }
        }
    }

    return {
        view
    };
})();
