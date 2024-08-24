import React from 'react';
import ReactDOM from 'react-dom';

const MODAL_STYLES = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    backgroundColor: 'rgb(34, 34, 34)',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
    height: '90%',
    width: '90%',
    padding: '20px',
    borderRadius: '10px',
    overflowY: 'auto', // Added to handle content overflow
};

const OVERLAY_STYLES = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 999,
};

const CLOSE_BUTTON_STYLES = {
    position: 'absolute',
    top: '10px',
    right: '20px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    zIndex: 1001, // Ensures it's above the modal content
};

export default function Modal({ children, onClose }) {
    return ReactDOM.createPortal(
        <>
            <div style={OVERLAY_STYLES} />
            <div style={MODAL_STYLES}>
                <button
                    className='btn bg-danger fs-3'
                    style={CLOSE_BUTTON_STYLES}
                    onClick={onClose}
                >
                    X
                </button>
                {children}
            </div>
        </>,
        document.getElementById('cart-root')
    );
}
