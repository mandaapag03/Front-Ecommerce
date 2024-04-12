import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../AnalyticsPanel/AnalyticsPanel.css';
import DataTable from 'react-data-table-component';

function AnalyticsPanel() {
  const [feedback, setFeedback] = useState([]);
  const feedbackApiUrl = 'http://localhost:5143/Feedback';

  useEffect(() => {
  axios.get(feedbackApiUrl)
  .then((response) => {
  setFeedback(response.data);
  console.log('deu bom filho !');
})
  .catch((error) => {
   console.error('Erro patrão:', error);
});
  }, []);

  const columns = [
    {
      name: 'Nota',
      selector: 'nota',
    },
    {
      name: 'Comentário',
      selector: 'comentario',
    },
  ];

  const customStyles = {
    rows: {
      style: {
      fontSize: '16px',
      },
    },
    headRow: {
      style: {
      fontSize: '18px',
      },
    },
    headCells: {
      style: {
      fontSize: '18px',
      },
    },
    table: {
      style: {
      width: '100%',
      },
    },
  };

  return (
    <div className='container mt-5'>
      <h1 className='table-title'><strong>Avaliações do OhMyDog</strong></h1>
      <div className="custom-table-container">
        <DataTable
        columns={columns}
        data={feedback}
        customStyles={customStyles}
    />
    </div>
</div>
);
}

export default AnalyticsPanel;