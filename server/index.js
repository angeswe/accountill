//Copyright (c) 2022 Panshak Solomon

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import PuppeteerHTMLPDF from 'puppeteer-html-pdf';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import invoiceRoutes from './routes/invoices.js';
import clientRoutes from './routes/clients.js';
import userRoutes from './routes/userRoutes.js';

import profile from './routes/profile.js';
import pdfTemplate from './documents/index.js';
// import invoiceTemplate from './documents/invoice.js'
import emailTemplate from './documents/email.js';

const app = express();
dotenv.config();

app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:8002',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-XSRF-TOKEN'],
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.use('/invoices', invoiceRoutes);
app.use('/clients', clientRoutes);
app.use('/users', userRoutes);
app.use('/profiles', profile);

// NODEMAILER TRANSPORT FOR SENDING INVOICE VIA EMAIL
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

var options = { format: 'A4' };
//SEND PDF INVOICE VIA EMAIL
app.post('/send-pdf', (req, res) => {
  const { email, company } = req.body;

  // pdf.create(pdfTemplate(req.body), {}).toFile('invoice.pdf', (err) => {
  pdf.create(pdfTemplate(req.body), options).toFile('invoice.pdf', (err) => {
    // send mail with defined transport object
    transporter.sendMail({
      from: ` Accountill <hello@accountill.com>`, // sender address
      to: `${email}`, // list of receivers
      replyTo: `${company.email}`,
      subject: `Invoice from ${
        company.businessName ? company.businessName : company.name
      }`, // Subject line
      text: `Invoice from ${
        company.businessName ? company.businessName : company.name
      }`, // plain text body
      html: emailTemplate(req.body), // html body
      attachments: [
        {
          filename: 'invoice.pdf',
          path: `${__dirname}/invoice.pdf`,
        },
      ],
    });

    if (err) {
      res.send(Promise.reject());
    }
    res.send(Promise.resolve());
  });
});

//CREATE AND SEND PDF INVOICE
app.post('/create-pdf', async (req, res) => {
  const html = pdfTemplate(req.body);
  const htmlPDF = new PuppeteerHTMLPDF();
  const options = {
    path: 'invoice.pdf',
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-sandbox',
    ],
  };
  htmlPDF.setOptions(options);
  try {
    const buffer = await htmlPDF.create(html);
    res.send(buffer);
  } catch (error) {
    console.error('PuppeteerHTMLPDF', error);
  } finally {
    await htmlPDF.closeBrowser();
  }
});

//SEND PDF INVOICE
app.get('/fetch-pdf', (req, res) => {
  res.sendFile(`${__dirname}/invoice.pdf`);
});

app.get('/', (req, res) => {
  res.send('SERVER IS RUNNING');
});

const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
