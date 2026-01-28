import React from "react";

export default function MenuIcon({ onClick }) {
    return (
        <div onClick={onClick} style={styles.container}>
            <span style={styles.line}></span>
            <span style={styles.line}></span>
            <span style={styles.line}></span>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        cursor: "pointer",
        marginRight: "15px",
    },
    line: {
        width: "22px",
        height: "3px",
        backgroundColor: "#fff",
        borderRadius: "2px",
    },
};
