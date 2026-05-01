// storage.js

/**
 * Data Persistence Utilities for localStorage
 * 
 * This module provides utilities for managing authentication,
 * profile management, citation search, audit logs, and CSV export functionalities.
 */

// Helper function to save data to localStorage
const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// Helper function to get data from localStorage
const getFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

// Authentication management
const Auth = {
    loginUser: (user) => {
        saveToLocalStorage('currentUser', user);
    },
    logoutUser: () => {
        localStorage.removeItem('currentUser');
    },
    isLoggedIn: () => {
        return getFromLocalStorage('currentUser') !== null;
    }
};

// Profile management
const Profile = {
    saveProfile: (profile) => {
        saveToLocalStorage('userProfile', profile);
    },
    getProfile: () => {
        return getFromLocalStorage('userProfile');
    }
};

// Citation search
const Citation = {
    saveCitation: (citation) => {
        const citations = getFromLocalStorage('citations') || [];
        citations.push(citation);
        saveToLocalStorage('citations', citations);
    },
    getCitations: () => {
        return getFromLocalStorage('citations') || [];
    }
};

// Audit logs
const AuditLog = {
    logAction: (action) => {
        const logs = getFromLocalStorage('auditLogs') || [];
        logs.push({
            action,
            timestamp: new Date().toISOString()
        });
        saveToLocalStorage('auditLogs', logs);
    },
    getLogs: () => {
        return getFromLocalStorage('auditLogs') || [];
    }
};

// CSV Export
const CSVExport = {
    exportCitationsToCSV: () => {
        const citations = Citation.getCitations();
        const csvContent = 'data:text/csv;charset=utf-8,' + citations.map(c => c.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'citations.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// Exporting modules
export { Auth, Profile, Citation, AuditLog, CSVExport };