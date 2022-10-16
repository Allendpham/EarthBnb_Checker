import React, { useState } from 'react';
import { Modal } from '../../context/Modal';
import SignupFormPage from '.';

function SignUpFormModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button className="account-button" onClick={(e) => (setShowModal(true), e.stopPropagation())}>Sign Up</button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <SignupFormPage />
        </Modal>
      )}
    </>
  );
}

export default SignUpFormModal;
