import moment from 'moment';

export default function ({
  name,
  address,
  phone,
  email,
  dueDate,
  date,
  id,
  notes,
  subTotal,
  type,
  vat,
  total,
  items,
  status,
  totalAmountReceived,
  balanceDue,
  company,
  currency,
  rates,
  paymentDetails,
}) {
  const today = new Date();
  return `
<!DOCTYPE html>
<html>
<head>
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.invoice-container {
    max-width: 800px;
    margin: 40px auto;
    padding: 40px;
    font-family: 'Inter', system-ui, sans-serif;
    background: white;
    border-radius: 12px;
}

.header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
}

.header img {
    max-width: 150px;
    height: auto;
}

.info-group {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
    margin-bottom: 40px;
}

.info-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.title {
    text-transform: uppercase;
    color: #64748b;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.05em;
    margin-bottom: 4px;
}

.details {
    font-size: 12px;
    line-height: 1.6;
}

.status-section {
    text-align: right;
    padding: 20px 0;
    font-size: 14px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
}

th, td {
    padding: 12px;
    border-bottom: 1px solid #e2e8f0;
    font-size: 11px;
    text-align: left;
}

th {
    background: #f8fafc;
    font-weight: 500;
    color: #64748b;
    text-transform: uppercase;
    font-size: 12px;
}

.amount-column {
    text-align: right;
}

.summary {
    margin-left: auto;
    width: 50%;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    font-size: 12px;
}

.summary-row.total {
    font-weight: bold;
    font-size: 12px;
    border-top: 2px solid #e2e8f0;
    margin-top: 8px;
    padding-top: 16px;
}

.bottom-section {
    display: flex;
    justify-content: space-between;
    gap: 40px;
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #e2e8f0;
}

.notes {
    flex: 1;
    font-size: 12px;
}
.notes p {
    white-space: pre-line;
}
.banking-section {
    width: 200px;
    font-size: 12px;
}

.invoice-title {
    font-size: 16px;
    font-weight: bold;
}
</style>
</head>
<body>
<div class="invoice-container">
    <div class="header">
        <div>
            ${
              company?.logo
                ? `<img src=${company?.logo} alt="Company Logo"/>`
                : `<h2>___</h2>`
            }
        </div>
        <div class="status-section">
            <p class="invoice-title">${
              Number(balanceDue) <= 0 ? 'Receipt' : type
            } #${id}</p>
            <p>Date: ${moment(date).format('ll')}</p>
            <p>Due Date: ${moment(dueDate).format('ll')}</p>
            <p>Amount: ${currency} ${total}</p>
        </div>
    </div>

    <div class="info-group">
        <div class="info-section">
            <p class="title">From</p>
            <div class="details">
                <p><strong>${
                  company.businessName ? company.businessName : company.name
                }</strong></p>
                <p>${company.email}</p>
                <p>${company.phoneNumber}</p>
                <p>${company.contactAddress}</p>
            </div>
        </div>
        
        <div class="info-section">
            <p class="title">Bill To</p>
            <div class="details">
                <p><strong>${name}</strong></p>
                <p>${email}</p>
                <p>${phone}</p>
                <p>${address}</p>
            </div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>${
                  items.some((x) => x.discount > 0) ? 'Discount(%)' : ''
                }</th>
                <th class="amount-column">Amount</th>
            </tr>
        </thead>
        <tbody>
            ${items
              .map(
                (item) => `
                <tr>
                    <td>${item.itemName}</td>
                    <td>${item.quantity}</td>
                    <td>${currency} ${item.unitPrice}</td>
                    <td>${item.discount}</td>
                    <td class="amount-column">${currency} ${
                  item.quantity * item.unitPrice -
                  (item.quantity * item.unitPrice * item.discount) / 100
                }</td>
                </tr>
            `
              )
              .join('')}
        </tbody>
    </table>

    <div class="summary">
        <div class="summary-row">
            <span>Sub Total</span>
            <span>${currency} ${subTotal}</span>
        </div>
        <div class="summary-row">
            <span>VAT (${rates} %)</span>
            <span> ${currency} ${vat}</span>
        </div>
        <div class="summary-row">
            <span>Total</span>
            <span>${currency} ${total}</span>
        </div>
        <div class="summary-row total">
            <span>Balance Due</span>
            <span>${currency} ${balanceDue}</span>
        </div>
    </div>

    <div class="bottom-section">
    <div class="notes">
        ${notes
          .replace(/\\n/g, '\n')
          .split('\n')
          .filter((line) => line.trim())
          .map((line) => `<p>${line}</p>`)
          .join('')}
    </div>
    <div class="banking-section">
        <h4>Payment details</h4>
        <p>Reference: ${id}</p>
        ${paymentDetails
          .replace(/\\n/g, '\n')
          .split('\n')
          .filter((line) => line.trim())
          .map((line) => `<p>${line}</p>`)
          .join('')}
    </div>
  </div>
</body>
</html>`;
}
