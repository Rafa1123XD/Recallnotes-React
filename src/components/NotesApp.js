import React from 'react';
import './NotesApp.css';

function NotesApp() {
    return (
        <div className="notes-container">
            <div 
                className="editor-area" 
                contentEditable="true"
                suppressContentEditableWarning={true}
                spellCheck="false"
            >
            </div>
            <div className="status-bar">
            </div>
        </div>
    );
}

export default NotesApp;  