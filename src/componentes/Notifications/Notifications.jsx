import React, { useState, useEffect } from 'react';
import styles from '../Notifications/Notifications.module.css';
import modalStyles from '../PaginaInicial/PaginaInicial.module.css';
import Modal from 'react-modal';

const customModalStyles = {
  content: {
    width: '50%',
    height: '35%',
    margin: 'auto',
    padding: '20px',
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
    borderRadius: '5px',
    backgroundColor: 'white',
  },
};

const Notifications = () => {
    const [showNotification, setShowNotification] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
    setShowNotification(true);
  }, 30000);

    return () => clearInterval(interval);
  }, []);

    const closeNotification = () => {
    setShowNotification(false);
  };

    const openModal = () => {
    setModalIsOpen(true);
  };

    const closeModal = () => {
    setModalIsOpen(false);
  };

    const starDescriptions = [
    '1 - Muito ruim',
    '2 - Ruim',
    '3 - Médio',
    '4 - Bom',
    '5 - Muito bom'
  ];

    const handleRatingChange = (value) => {
    setRating(value);
  };

    const handleCommentChange = (value) => {
    setComment(value);
  };

    const enviarAvaliacao = () => {
    const feedbackData = {
    nota: rating,
    comentario: comment,
  };

    fetch('http://localhost:5143/Feedback/send', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
  },
    body: JSON.stringify(feedbackData),
})
    .then((response) => {
    if (response.ok) {
    console.log('Feedback enviado Dr. Emynem!');
    setFeedbackSent(true);
  } else {
    console.log('seu feedback está com erro, veja o que fez rapaz !');
    setFeedbackSent(false);
  }
})
    .catch((error) => {
    console.error('Erro que ta dando:', error);
    setFeedbackSent(false);
});
    closeModal();
  };

  return (
    <div>
      <div className={`${styles.notificationBalloon} ${showNotification ? styles.show : ''}`}>
        <span className={styles.closeBtn} onClick={closeNotification}>X</span>
        <button className={styles.rateButton} onClick={openModal}>
          Avalie o Oh My Dog!
        </button>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Avalie a Oh My Dog!" style={customModalStyles}>
        <h2 className={modalStyles.header}>Avalie a Oh My Dog!</h2>
        <div className={modalStyles.rating}>
        {[1, 2, 3, 4, 5].map((value) => (
        <span
        key={value}
        onClick={() => handleRatingChange(value)}
        className={value <= rating ? modalStyles.starFilled : modalStyles.star}
        title={starDescriptions[value - 1]}
        >
         &#9733;
        </span>
    ))}
        </div>
        <textarea
        value={comment}
        onChange={(e) => handleCommentChange(e.target.value)}
        className={`${modalStyles.commentInput} ${modalStyles.productCard}`}
        placeholder="Descreva sua experiência sobre como é utilizar o OhMyDog..."
        />
        <div className={modalStyles.buttonsContainer}>
        <button onClick={enviarAvaliacao} className={`${modalStyles.addCommentButton} ${modalStyles.productCard}`}>Enviar Avaliação</button>
        <button onClick={closeModal} className={`${modalStyles.verAvaliacoesButton} ${modalStyles.productCard}`}>Cancelar</button>
      </div>
      </Modal>
    </div>
  );
};

export default Notifications;