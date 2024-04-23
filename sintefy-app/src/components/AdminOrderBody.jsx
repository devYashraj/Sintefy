import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { saveAs } from 'file-saver'
import { Link } from 'react-router-dom';
import QuotationBody from './QuotationBody';
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

async function downloadFile(filepath) {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axios.get(`${baseUrl}sint/retrieve/download/${encodeURIComponent(filepath)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      responseType: 'blob'
    });

    saveAs(new Blob([response.data]), "drawing.pdf");
  }
  catch (error) {
    console.log(error);
  }
}

const CardBody = ({ order }) => (
  <React.Fragment>
    <CardContent>
      <Typography variant="h6" component="div">
        {order.toolName + " - " + order.custId.companyName}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {formatDate(order.date)}
      </Typography>
      <Typography variant="body2">
        Ship to:-
        <br />
        {order.custId.name + " at " + order.address}
      </Typography>
    </CardContent>
    <CardActions sx={{ justifyContent: 'space-between' }}>
      <Button size="small" onClick={() => downloadFile(order.filepath)} download>Download Drawing</Button>
      {
        (order.quotation.length === 1 &&
          order.quotation[0].itemName === "empty" &&
          order.quotation[0].qty === 0 &&
          order.quotation[0].price === 0)
          ?
          <Link
            to={`sendquote/${order._id}`}
            className="sendQuote2"
            sx={{ marginLeft: 'auto' }}>
            Quotation Pending
          </Link>
          :
          <QuotationBody
            quote={
              order.quotation.length === 1 &&
              order.quotation[0].itemName === "empty" &&
              order.quotation[0].qty === 0 &&
              order.quotation[0].price === 0
            }
            quotation={order.quotation}
            toolName={order.toolName}
          />
      }

    </CardActions>
  </React.Fragment>
);

export default function OrderBody({ order }) {
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <CardBody order={order} />
      </Card>
    </Box>
  );
}